import { resolve } from "url";
import {
	LanguageServiceOptions,
	TextDocument,
	LanguageService,
	SassDocumentLink,
	Utils,
	URI,
	DocumentUri,
	NodeType,
	INode,
	Range,
} from "@somesass/language-server-types";
import { LanguageFeature, LanguageFeatureInternal } from "../language-feature";
import { dirname, joinPath } from "../utils/resources";

type UnresolvedLink = {
	link: SassDocumentLink;
	/**
	 * `true` if the link is to a Sass module, as opposed to for instance url()
	 */
	isModuleLink: boolean;
};

const startsWithSchemeRegex = /^\w+:\/\//;
const startsWithData = /^data:/;
const sassLangFile = /\.(sass|scss)$/;

export class FindLinks extends LanguageFeature {
	constructor(
		ls: LanguageService,
		options: LanguageServiceOptions,
		_internal: LanguageFeatureInternal,
	) {
		super(ls, options, _internal);
	}

	#getDocumentContext() {
		return {
			/**
			 * @param ref Resolve this path from the context of the document
			 * @returns The resolved path
			 */
			resolveReference: (ref: string, base: string) => {
				if (ref.startsWith("/") && this.configuration.workspaceRoot) {
					return joinPath(this.configuration.workspaceRoot.toString(), ref);
				}
				try {
					return resolve(base, ref);
				} catch (e) {
					return undefined;
				}
			},
		};
	}

	async findDocumentLinks(document: TextDocument): Promise<SassDocumentLink[]> {
		const stylesheet = await this.ls.parseStylesheet(document);
		const unresolved: UnresolvedLink[] = [];

		const collect = (node: INode) => {
			const linkStatement = node.parent;
			if (!linkStatement) {
				return;
			}

			let linkString = node.getText();

			const range = Range.create(
				document.positionAt(node.offset),
				document.positionAt(node.end),
			);

			// Make sure the range is not empty
			if (
				range.start.line === range.end.line &&
				range.start.character === range.end.character
			) {
				return;
			}

			if (linkString.startsWith(`'`) || linkString.startsWith(`"`)) {
				linkString = linkString.slice(1, -1);
			}

			const isModuleLink = isModuleLinkNode(linkStatement);

			// TODO: as / prefix
			// TODO: parse "*" as an identifier in Use
			// TODO: show
			// TODO: hide
			// TODO: namespace

			const alias: INode | undefined = linkStatement
				.getChildren()
				.find((c) => c.type === NodeType.Identifier);
			const as = alias ? alias.getText() : undefined;

			const namespace =
				linkStatement.type === NodeType.Use
					? as || getNamespaceFromLink(linkString)
					: undefined;

			unresolved.push({
				link: {
					target: linkString,
					range,
					type: linkStatement.type,
					namespace,
				},
				isModuleLink,
			});
		};

		stylesheet.accept((candidate) => {
			if (candidate.type === NodeType.URILiteral) {
				const first = candidate.getChild(0);
				if (first) {
					collect(first);
				}
				return false;
			}
			/**
			 * In @import, it is possible to include links that do not use `url()`
			 * For example, `@import 'foo.css';`
			 */
			if (candidate.parent && isModuleLinkNode(candidate.parent)) {
				const rawText = candidate.getText();
				if (rawText.startsWith(`'`) || rawText.startsWith(`"`)) {
					collect(candidate);
				}
				return false;
			}

			return true;
		});

		const resolved: SassDocumentLink[] = [];
		for (const { link, isModuleLink } of unresolved) {
			const target = link.target;
			if (!target || startsWithData.test(target)) {
				// no links for data:
			} else if (startsWithSchemeRegex.test(target)) {
				resolved.push(link);
			} else {
				if (target.startsWith("sass:")) {
					// Sass built-in
					resolved.push(link);
					continue;
				}
				const resolvedTarget = await this.resolveReference(
					target,
					document.uri,
					isModuleLink,
				);
				if (resolvedTarget !== undefined) {
					link.target = resolvedTarget;
					resolved.push(link);
				}
			}
		}
		return resolved;
	}

	protected async mapReference(
		target: string | undefined,
		isModuleLink: boolean,
	): Promise<string | undefined> {
		if (this.options.fileSystemProvider && target && isModuleLink) {
			const pathVariations = toPathVariations(target);
			for (const variation of pathVariations) {
				if (await this.fileExists(variation)) {
					return variation;
				}
			}
		}
		return target;
	}

	protected async resolveReference(
		target: string,
		documentUri: string,
		isModuleLink = false,
		settings = this.configuration.importAliases,
	): Promise<string | undefined> {
		// Following [css-loader](https://github.com/webpack-contrib/css-loader#url)
		// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#imports)
		// convention, if an import path starts with ~ then use node module resolution
		// *unless* it starts with "~/" as this refers to the user's home directory.
		if (
			target[0] === "~" &&
			target[1] !== "/" &&
			this.options.fileSystemProvider
		) {
			target = target.substring(1);
			return this.mapReference(
				await this.resolveModuleReference(target, documentUri),
				isModuleLink,
			);
		}

		// Following the [sass package importer](https://github.com/sass/sass/blob/f6832f974c61e35c42ff08b3640ff155071a02dd/js-api-doc/importer.d.ts#L349),
		// look for the `exports` field of the module and any `sass`, `style` or `default` that matches the import.
		// If it's only `pkg:module`, also look for `sass` and `style` on the root of package.json.
		if (target.startsWith("pkg:")) {
			return this.resolvePkgModulePath(target, documentUri);
		}

		const ref = await this.mapReference(
			this.#getDocumentContext().resolveReference(target, documentUri),
			isModuleLink,
		);

		// Following [less-loader](https://github.com/webpack-contrib/less-loader#imports)
		// and [sass-loader's](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules)
		// new resolving import at-rules (~ is deprecated). The loader will first try to resolve @import as a relative path. If it cannot be resolved,
		// then the loader will try to resolve @import inside node_modules.
		if (ref && (await this.fileExists(ref))) {
			return ref;
		}

		const moduleReference = await this.mapReference(
			await this.resolveModuleReference(target, documentUri),
			isModuleLink,
		);
		if (moduleReference) {
			return moduleReference;
		}

		// Try resolving the reference from the language configuration alias settings
		if (ref && !(await this.fileExists(ref))) {
			const rootFolderUri = this.#getDocumentContext().resolveReference(
				"/",
				documentUri,
			);
			if (settings && rootFolderUri) {
				// Specific file reference
				if (target in settings) {
					return this.mapReference(
						joinPath(rootFolderUri, settings[target]),
						isModuleLink,
					);
				}
				// Reference folder
				const firstSlash = target.indexOf("/");
				const prefix = `${target.substring(0, firstSlash)}/`;
				if (prefix in settings) {
					const aliasPath = settings[prefix].slice(0, -1);
					let newPath = joinPath(rootFolderUri, aliasPath);
					return this.mapReference(
						(newPath = joinPath(newPath, target.substring(prefix.length - 1))),
						isModuleLink,
					);
				}
			}
		}

		// fall back. it might not exists
		return ref;
	}

	protected async resolveModuleReference(
		ref: string,
		documentUri: string,
	): Promise<string | undefined> {
		if (documentUri.startsWith("file://")) {
			const moduleName = this.getModuleNameFromPath(ref);
			if (moduleName && moduleName !== "." && moduleName !== "..") {
				const rootFolderUri = this.#getDocumentContext().resolveReference(
					"/",
					documentUri,
				);
				const documentFolderUri = dirname(documentUri);
				const modulePath = await this.resolvePathToModule(
					moduleName,
					documentFolderUri,
					rootFolderUri,
				);
				if (modulePath) {
					const pathWithinModule = ref.substring(moduleName.length + 1);
					return joinPath(modulePath, pathWithinModule);
				}
			}
		}
		return undefined;
	}

	protected async resolvePathToModule(
		_moduleName: string,
		documentFolderUri: string,
		rootFolderUri: string | undefined,
	): Promise<string | undefined> {
		// resolve the module relative to the document. We can't use `require` here as the code is webpacked.

		const packPath = joinPath(
			documentFolderUri,
			"node_modules",
			_moduleName,
			"package.json",
		);
		if (await this.fileExists(packPath)) {
			return dirname(packPath);
		} else if (
			rootFolderUri &&
			documentFolderUri.startsWith(rootFolderUri) &&
			documentFolderUri.length !== rootFolderUri.length
		) {
			return this.resolvePathToModule(
				_moduleName,
				dirname(documentFolderUri),
				rootFolderUri,
			);
		}
		return undefined;
	}

	protected getModuleNameFromPath(path: string) {
		const firstSlash = path.indexOf("/");
		if (firstSlash === -1) {
			return "";
		}

		// If a scoped module (starts with @) then get up until second instance of '/', or to the end of the string for root-level imports.
		if (path[0] === "@") {
			const secondSlash = path.indexOf("/", firstSlash + 1);
			if (secondSlash === -1) {
				return path;
			}
			return path.substring(0, secondSlash);
		}
		// Otherwise get until first instance of '/'
		return path.substring(0, firstSlash);
	}

	protected async resolvePkgModulePath(
		target: string,
		documentUri: string,
	): Promise<string | undefined> {
		const bareTarget = target.replace("pkg:", "");
		const moduleName = bareTarget.includes("/")
			? this.getModuleNameFromPath(bareTarget)
			: bareTarget;
		const rootFolderUri = this.#getDocumentContext().resolveReference(
			"/",
			documentUri,
		);
		const documentFolderUri = dirname(documentUri);
		const modulePath = await this.resolvePathToModule(
			moduleName,
			documentFolderUri,
			rootFolderUri,
		);
		if (modulePath) {
			const packageJsonPath = `${modulePath}/package.json`;
			if (packageJsonPath) {
				// Since submodule exports import strings don't match the file system,
				// we need the contents of `package.json` to look up the correct path.
				const packageJsonContent = await this.getContent(packageJsonPath);
				if (packageJsonContent) {
					const packageJson: {
						style?: string;
						sass?: string;
						exports: Record<string, string | Record<string, string>>;
					} = JSON.parse(packageJsonContent);

					const subpath = bareTarget.substring(moduleName.length + 1);
					if (packageJson.exports) {
						if (!subpath) {
							// look for the default/index export
							const entry = getSubpathEntry(packageJson.exports["."]);
							// the 'default' entry can be whatever, typically .js – confirm it looks like Sass
							if (entry && entry.match(sassLangFile)) {
								const entryPath = joinPath(modulePath, entry);
								return entryPath;
							}
						} else {
							// The import string may be with or without .scss.
							// Likewise the exports entry. Look up both paths.
							// However, they need to be relative (start with ./).
							const lookupSubpath = subpath.match(sassLangFile)
								? `./${subpath.replace(sassLangFile, "")}`
								: `./${subpath}`;
							const lookupSubpathScss = subpath.match(sassLangFile)
								? `./${subpath}`
								: `./${subpath}.scss`;
							const lookupSubpathSass = subpath.match(sassLangFile)
								? `./${subpath}`
								: `./${subpath}.sass`;

							const subpathObject =
								packageJson.exports[lookupSubpath] ||
								packageJson.exports[lookupSubpathScss] ||
								packageJson.exports[lookupSubpathSass];

							if (subpathObject) {
								const entry = getSubpathEntry(subpathObject);

								// the 'default' entry can be whatever, typically .js – confirm it looks like Sass
								if (entry && entry.match(sassLangFile)) {
									const entryPath = joinPath(modulePath, entry);
									return entryPath;
								}
							} else {
								// We have a subpath, but found no matches on direct lookup.
								// It may be a [subpath pattern](https://nodejs.org/api/packages.html#subpath-patterns).
								for (const [maybePattern, subpathObject] of Object.entries(
									packageJson.exports,
								)) {
									if (!maybePattern.includes("*")) {
										continue;
									}
									// Patterns may also be without file extensions on the left side, so compare without on both sides
									const re = new RegExp(
										maybePattern
											.replace("./", "\\./")
											.replace(sassLangFile, "")
											.replace("*", "(.+)"),
									);
									const match = re.exec(lookupSubpath);
									if (match) {
										const entry = getSubpathEntry(subpathObject);

										// the 'default' entry can be whatever, typically .js – confirm it looks like `scss`
										if (entry && entry.match(sassLangFile)) {
											// The right-hand side of a subpath pattern is also a pattern.
											// Replace the pattern with the match from our regexp capture group above.
											const expandedPattern = entry.replace("*", match[1]);
											const entryPath = joinPath(modulePath, expandedPattern);
											return entryPath;
										}
									}
								}
							}
						}
					} else if (!subpath && (packageJson.sass || packageJson.style)) {
						// Fall back to a direct lookup on `sass` and `style` on package root
						const entry = packageJson.sass || packageJson.style;
						if (entry) {
							const entryPath = joinPath(modulePath, entry);
							return entryPath;
						}
					}
				}
			}
		}
		return undefined;
	}

	protected async fileExists(uri: string): Promise<boolean> {
		if (!this.options.fileSystemProvider) {
			return false;
		}
		try {
			const exists = await this.options.fileSystemProvider.exists(
				URI.parse(uri),
			);
			return exists;
		} catch (err) {
			return false;
		}
	}

	protected async getContent(uri: string): Promise<string | null> {
		if (!this.options.fileSystemProvider) {
			return null;
		}
		try {
			return await this.options.fileSystemProvider.readFile(URI.parse(uri));
		} catch (err) {
			return null;
		}
	}
}

function getNamespaceFromLink(target: string): string {
	if (target.startsWith("sass")) {
		return target.split(":")[1];
	}

	const bareTarget = target.replace("pkg:", "").replace("./", "");
	let from = 0;
	let to = bareTarget.length;
	if (bareTarget.includes("/")) {
		from = bareTarget.lastIndexOf("/") + 1;
	}
	if (bareTarget.includes(".")) {
		to = bareTarget.lastIndexOf(".");
	}
	let namespace = bareTarget.substring(from, to);
	namespace = namespace.startsWith("_") ? namespace.slice(1) : namespace;
	if (namespace === "index") {
		// The link points to an index file. Use the folder name above as a namespace.
		const linkOmitIndex = bareTarget.slice(
			0,
			Math.max(0, bareTarget.lastIndexOf("/")),
		);
		const newLastSlash = linkOmitIndex.lastIndexOf("/");
		namespace = linkOmitIndex.slice(Math.max(0, newLastSlash + 1));
	}

	return namespace;
}

function toPathVariations(target: string): DocumentUri[] {
	// No variation for links that ends with .css suffix
	if (target.endsWith(".css")) {
		return [target];
	}

	// If a link is like a/, try resolving a/index.scss, a/_index.scss, a/index.sass and a/_index.sass
	if (target.endsWith("/")) {
		return [
			target + "index.scss",
			target + "_index.scss",
			target + "index.sass",
			target + "_index.sass",
		];
	}

	const targetUri = URI.parse(target.replace(/\.s[ac]ss$/, ""));
	const basename = Utils.basename(targetUri);
	const dirname = Utils.dirname(targetUri);
	if (basename.startsWith("_")) {
		// No variation for links such as _a
		return [
			Utils.joinPath(dirname, basename + ".scss").toString(true),
			Utils.joinPath(dirname, basename + ".sass").toString(true),
		];
	}

	const variants = [
		Utils.joinPath(dirname, basename + ".scss").toString(true),
		Utils.joinPath(dirname, "_" + basename + ".scss").toString(true),
		target + "/index.scss",
		target + "/_index.scss",
		Utils.joinPath(dirname, basename + ".sass").toString(true),
		Utils.joinPath(dirname, "_" + basename + ".sass").toString(true),
		target + "/index.sass",
		target + "/_index.sass",
		Utils.joinPath(dirname, basename + ".css").toString(true),
	];
	return variants;
}

function getSubpathEntry(
	subpathObject: string | Record<string, unknown>,
): string | undefined {
	return (
		// @ts-expect-error If subpathObject is a string this just produces undefined
		subpathObject["sass"] ||
		// @ts-expect-error If subpathObject is a string this just produces undefined
		subpathObject["styles"] ||
		// @ts-expect-error If subpathObject is a string this just produces undefined
		subpathObject["default"]
	);
}

function isModuleLinkNode(node: INode): boolean {
	return (
		node.type === NodeType.Import ||
		node.type === NodeType.Use ||
		node.type === NodeType.Forward
	);
}
