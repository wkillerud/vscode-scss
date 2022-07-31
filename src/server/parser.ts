import { Parameter, parseString } from "scss-sassdoc-parser";
import type { ParseResult } from "scss-sassdoc-parser";
import {
	Position,
	Range,
	SymbolKind,
	DocumentLink,
} from "vscode-css-languageservice";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { getLanguageService } from "./language-service";
import { sassBuiltInModuleNames } from "./sass-built-in-modules";
import { buildDocumentContext, getLinesFromText } from "./utils/document";
import { fileExists, realPath } from "./utils/fs";
import { asDollarlessVariable } from "./utils/string";

/**
 * Must be synced with https://github.com/microsoft/vscode-css-languageservice/blob/main/src/parser/cssNodes.ts
 * when upgrading vscode-css-languageservice.
 */
export enum NodeType {
	Undefined,
	Identifier,
	Stylesheet,
	Ruleset,
	Selector,
	SimpleSelector,
	SelectorInterpolation,
	SelectorCombinator,
	SelectorCombinatorParent,
	SelectorCombinatorSibling,
	SelectorCombinatorAllSiblings,
	SelectorCombinatorShadowPiercingDescendant,
	Page,
	PageBoxMarginBox,
	ClassSelector,
	IdentifierSelector,
	ElementNameSelector,
	PseudoSelector,
	AttributeSelector,
	Declaration,
	Declarations,
	Property,
	Expression,
	BinaryExpression,
	Term,
	Operator,
	Value,
	StringLiteral,
	URILiteral,
	EscapedValue,
	Function,
	NumericValue,
	HexColorValue,
	RatioValue,
	MixinDeclaration,
	MixinReference,
	VariableName,
	VariableDeclaration,
	Prio,
	Interpolation,
	NestedProperties,
	ExtendsReference,
	SelectorPlaceholder,
	Debug,
	If,
	Else,
	For,
	Each,
	While,
	MixinContentReference,
	MixinContentDeclaration,
	Media,
	Keyframe,
	FontFace,
	Import,
	Namespace,
	Invocation,
	FunctionDeclaration,
	ReturnStatement,
	MediaQuery,
	MediaCondition,
	MediaFeature,
	FunctionParameter,
	FunctionArgument,
	KeyframeSelector,
	ViewPort,
	Document,
	AtApplyRule,
	CustomPropertyDeclaration,
	CustomPropertySet,
	ListEntry,
	Supports,
	SupportsCondition,
	NamespacePrefix,
	GridLine,
	Plugin,
	UnknownAtRule,
	Use,
	ModuleConfiguration,
	Forward,
	ForwardVisibility,
	Module,
	UnicodeRange,
}

export interface INode {
	type: NodeType;
	offset: number;
	length: number;
	end: number;
	accept: (node: (node: INode) => boolean) => boolean;
	getName: () => string;
	getValue: () => INode;
	getDefaultValue: () => INode;
	getText: () => string;
	getParameters: () => INode;
	getIdentifier: () => INode;
	getParent: () => INode;
	getChildren: () => INode[];
	getChild: (index: number) => INode;
	getSelectors: () => INode;
}

export interface ScssSymbol {
	kind: SymbolKind;
	name: string;
	sassdoc?: ParseResult;
	position: Position;
	offset: number;
}

export interface ScssVariable extends ScssSymbol {
	mixin?: string;
	value: string | null;
}

export interface ScssParameter
	extends Omit<ScssVariable, "kind" | "position" | "sassdoc"> {
	sassdoc?: Parameter;
}

export interface ScssMixin extends ScssSymbol {
	parameters: ScssParameter[];
}

export type ScssFunction = ScssMixin;

export interface ScssLink {
	link: DocumentLink;
}

export interface ScssUse extends ScssLink {
	namespace?: string;
	/** Indicates whether the namespace is different from the file name. */
	isAliased: boolean;
}

export interface ScssForward extends ScssLink {
	hide: string[];
	prefix?: string;
}

export interface ScssImport extends ScssLink {
	css: boolean;
	dynamic: boolean;
}

export interface IScssSymbols {
	imports: Map<string, ScssImport>;
	uses: Map<string, ScssUse>;
	forwards: Map<string, ScssForward>;
	variables: Map<string, ScssVariable>;
	mixins: Map<string, ScssMixin>;
	functions: Map<string, ScssFunction>;
}

export interface IScssDocument extends TextDocument, IScssSymbols {
	textDocument: TextDocument;
	ast: INode;
	filePath: string;
	/**
	 * The last part of the URI, including extension.
	 * For instance, given the URI `file:///home/test.scss`,
	 * the fileName is `test.scss`.
	 */
	fileName: string;
	/** Find and cache the real path (as opposed to symlinked) */
	getRealPath: () => Promise<string | null>;
	getLinks: (options?: { forwards: boolean }) => ScssLink[];
	getSymbols: () => ScssSymbol[];
	getNodeAt: (offset: number) => INode | null;
	getNodeRange: (node: INode) => Range;
}

export const reModuleAtRule = /@(?:use|forward|import)/;
export const reUse = /@use ["'|](?<url>.+)["'|](?: as (?<namespace>\*|\w+))?;/;
export const reForward =
	/@forward ["'|](?<url>.+)["'|](?: as (?<prefix>\w+-)\*)?(?: hide (?<hide>.+))?;/;
export const reImport = /@import ["'|](?<url>.+)["'|]/;

const reDynamicPath = /[#*{}]/;

const ls = getLanguageService();

export async function parseDocument(
	document: TextDocument,
	workspaceRoot: URI,
): Promise<ScssDocument> {
	const ast = ls.parseStylesheet(document) as INode;
	const symbols = await findDocumentSymbols(document, ast, workspaceRoot);

	return new ScssDocument(document, symbols, ast);
}

async function findDocumentSymbols(
	document: TextDocument,
	ast: INode,
	workspaceRoot: URI,
): Promise<IScssSymbols> {
	const result: IScssSymbols = {
		functions: new Map(),
		mixins: new Map(),
		variables: new Map(),
		imports: new Map(),
		uses: new Map(),
		forwards: new Map(),
	};

	const links = await ls.findDocumentLinks2(
		document,
		ast,
		buildDocumentContext(document.uri, workspaceRoot),
	);

	const text = document.getText();
	const lines = getLinesFromText(text);

	for (const line of lines) {
		for (const link of links) {
			if (
				!link.target ||
				link.target.endsWith(".css") ||
				!reModuleAtRule.test(line)
			) {
				continue;
			}

			link.target = ensureScssExtension(link.target);

			const targetFsPath = URI.parse(link.target).fsPath;
			const targetExists = await fileExists(targetFsPath);
			if (!targetExists) {
				// The target string may be a partial without its _ prefix,
				// so try looking for it by that name.
				const partial = ensurePartial(link.target);
				const partialFsPath = URI.parse(partial).fsPath;
				const partialExists = await fileExists(partialFsPath);
				if (!partialExists) {
					// We tried to resolve the file as a partial, but it doesn't exist.
					continue;
				}

				link.target = partial;
			}

			const matchUse = reUse.exec(line);
			if (matchUse) {
				const url = matchUse.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					const namespace = matchUse.groups?.["namespace"];
					result.uses.set(link.target, {
						link,
						namespace: namespace || getNamespaceFromLink(link),
						isAliased: Boolean(namespace),
					});
				}

				continue;
			}

			const matchForward = reForward.exec(line);
			if (matchForward) {
				const url = matchForward.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					result.forwards.set(link.target, {
						link,
						prefix: matchForward.groups?.["prefix"],
						hide: matchForward.groups?.["hide"]
							? matchForward.groups["hide"].split(",").map((s) => s.trim())
							: [],
					});
				}

				continue;
			}

			const matchImport = reImport.exec(line);
			if (matchImport) {
				const url = matchImport.groups?.["url"];
				if (urlMatches(url as string, link.target)) {
					result.imports.set(link.target, {
						link,
						dynamic: reDynamicPath.test(link.target),
						css: link.target.endsWith(".css"),
					});
				}
			}
		}

		// Look for any usage of built-in modules like @use "sass:math";
		const matchUse = reUse.exec(line);
		if (matchUse) {
			const url = matchUse.groups?.["url"];
			const builtIn = sassBuiltInModuleNames.find((module) => module === url);
			if (builtIn) {
				const namespace = matchUse.groups?.["namespace"];
				result.uses.set(builtIn, {
					// Fake link with builtin as target
					link: DocumentLink.create(
						Range.create(Position.create(1, 1), Position.create(1, 1)),
						builtIn,
					),
					namespace: namespace || builtIn.split(":")[1],
					isAliased: Boolean(namespace),
				});
			}

			continue;
		}
	}

	let sassdoc: ParseResult[] = [];
	try {
		sassdoc = await parseString(text);
	} catch (error) {
		console.error(error);
	}

	const symbols = ls.findDocumentSymbols(document, ast);

	for (const symbol of symbols) {
		const position = symbol.location.range.start;
		const offset = document.offsetAt(symbol.location.range.start);
		switch (symbol.kind) {
			case SymbolKind.Variable: {
				const dollarlessName = symbol.name.replace("$", "");
				const docs = sassdoc.find(
					(v) =>
						v.context.name === dollarlessName && v.context.type === "variable",
				);
				result.variables.set(symbol.name, {
					name: symbol.name,
					kind: SymbolKind.Variable,
					offset,
					position,
					value: getVariableValue(ast, offset),
					sassdoc: docs,
				});

				break;
			}

			case SymbolKind.Method: {
				const docs = sassdoc.find(
					(v) => v.context.name === symbol.name && v.context.type === "mixin",
				);
				result.mixins.set(symbol.name, {
					name: symbol.name,
					kind: SymbolKind.Method,
					offset,
					position,
					parameters: getMethodParameters(ast, offset, docs),
					sassdoc: docs,
				});

				break;
			}

			case SymbolKind.Function: {
				const docs = sassdoc.find(
					(v) =>
						v.context.name === symbol.name && v.context.type === "function",
				);
				result.functions.set(symbol.name, {
					name: symbol.name,
					kind: SymbolKind.Function,
					offset,
					position,
					parameters: getMethodParameters(ast, offset, docs),
					sassdoc: docs,
				});

				break;
			}
			// No default
		}
	}

	return result;
}

function getNamespaceFromLink(link: DocumentLink): string | undefined {
	if (!link.target) {
		return undefined;
	}

	const lastSlash = link.target.lastIndexOf("/");
	const extension = link.target.lastIndexOf(".");
	let candidate = link.target.substring(lastSlash + 1, extension);

	candidate = candidate.startsWith("_") ? candidate.slice(1) : candidate;

	if (candidate === "index") {
		// The link points to an index file. Use the folder name above as a namespace.
		const linkOmitIndex = link.target.slice(0, Math.max(0, lastSlash));
		const newLastSlash = linkOmitIndex.lastIndexOf("/");
		candidate = linkOmitIndex.slice(Math.max(0, newLastSlash + 1));
	}

	return candidate;
}

function ensureScssExtension(target: string): string {
	if (target.endsWith(".scss")) {
		return target;
	}

	return `${target}.scss`;
}

function ensurePartial(target: string): string {
	const lastSlash = target.lastIndexOf("/");
	const lastDot = target.lastIndexOf(".");
	const fileName = target.substring(lastSlash + 1, lastDot);

	if (fileName.startsWith("_")) {
		return target;
	}

	const path = target.slice(0, Math.max(0, lastSlash + 1));
	const extension = target.slice(Math.max(0, lastDot));
	return `${path}_${fileName}${extension}`;
}

function urlMatches(url: string, linkTarget: string): boolean {
	let safeUrl = url;
	while (/^[./@~]/.exec(safeUrl)) {
		safeUrl = safeUrl.slice(1);
	}

	let match = linkTarget.includes(safeUrl);
	if (!match) {
		const lastSlash = safeUrl.lastIndexOf("/");
		const toLastSlash = safeUrl.slice(0, Math.max(0, lastSlash));
		const restOfUrl = safeUrl.slice(Math.max(0, lastSlash + 1));
		const partial = `${toLastSlash}/_${restOfUrl}`;
		match = linkTarget.includes(partial);
	}

	return match;
}

function getVariableValue(ast: INode, offset: number): string | null {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return null;
	}

	const parent = getParentNodeByType(node, NodeType.VariableDeclaration);

	return parent?.getValue()?.getText() || null;
}

function getMethodParameters(
	ast: INode,
	offset: number,
	sassDoc: ParseResult | undefined,
) {
	const node = getNodeAtOffset(ast, offset);

	if (node === null) {
		return [];
	}

	return node
		.getParameters()
		.getChildren()
		.map((child) => {
			const defaultValueNode = child.getDefaultValue();

			const value =
				defaultValueNode === undefined ? null : defaultValueNode.getText();
			const name = child.getName();

			const dollarlessName = asDollarlessVariable(name);
			const docs = sassDoc
				? sassDoc.parameter?.find((p) => p.name === dollarlessName)
				: undefined;

			return {
				name,
				offset: child.offset,
				value,
				kind: SymbolKind.Variable,
				sassdoc: docs,
			};
		});
}

/**
 * Get Node by offset position.
 */
export function getNodeAtOffset(
	parsedDocument: INode,
	posOffset: number | null,
): INode | null {
	let candidate: INode | null = null;

	parsedDocument.accept((node) => {
		if (node.offset === -1 && node.length === -1) {
			return true;
		}

		if (
			posOffset !== null &&
			node.offset <= posOffset &&
			node.end >= posOffset
		) {
			if (!candidate) {
				candidate = node;
			} else if (node.length <= candidate.length) {
				candidate = node;
			}

			return true;
		}

		return false;
	});

	return candidate;
}

/**
 * Returns the parent Node of the specified type.
 */
export function getParentNodeByType(
	node: INode | null,
	type: NodeType,
): INode | null {
	if (node === null) {
		return null;
	}

	node = node.getParent();

	while (node.type !== type) {
		if (node.type === NodeType.Stylesheet) {
			return null;
		}

		node = node.getParent();
	}

	return node;
}

export class ScssDocument implements IScssDocument {
	public textDocument: TextDocument;
	public ast: INode;
	public fileName: string;

	public imports: Map<string, ScssImport> = new Map();
	public uses: Map<string, ScssUse> = new Map();
	public forwards: Map<string, ScssForward> = new Map();
	public variables: Map<string, ScssVariable> = new Map();
	public mixins: Map<string, ScssMixin> = new Map();
	public functions: Map<string, ScssFunction> = new Map();

	private _realPath: string | null = null;

	constructor(document: TextDocument, symbols: IScssSymbols, ast?: INode) {
		this.textDocument = document;
		this.ast = ast ?? (ls.parseStylesheet(document) as INode);
		this.imports = symbols.imports;
		this.uses = symbols.uses;
		this.forwards = symbols.forwards;
		this.variables = symbols.variables;
		this.mixins = symbols.mixins;
		this.functions = symbols.functions;
		this.fileName = this.getFileName();
	}

	public get uri(): string {
		return this.textDocument.uri;
	}

	public get filePath(): string {
		return URI.parse(this.textDocument.uri).fsPath;
	}

	public async getRealPath(): Promise<string | null> {
		if (this._realPath) {
			return this._realPath;
		}

		try {
			const path = await realPath(this.filePath);
			this._realPath = path;
		} catch {
			// Do nothing
		}

		return this._realPath;
	}

	private getFileName(): string {
		const uri = this.textDocument.uri;
		const lastSlash = uri.lastIndexOf("/");
		return lastSlash === -1 ? uri : uri.slice(Math.max(0, lastSlash + 1));
	}

	public get languageId(): string {
		return this.textDocument.languageId;
	}

	public get version(): number {
		return this.textDocument.version;
	}

	public getText(range?: Range): string {
		return this.textDocument.getText(range);
	}

	public getNodeAt(offset: number): INode | null {
		return getNodeAtOffset(this.ast, offset);
	}

	public getNodeRange(node: INode): Range {
		return Range.create(
			this.textDocument.positionAt(node.offset),
			this.textDocument.positionAt(node.end),
		);
	}

	public positionAt(offset: number): Position {
		return this.textDocument.positionAt(offset);
	}

	public offsetAt(position: Position): number {
		return this.textDocument.offsetAt(position);
	}

	public get lineCount(): number {
		return this.textDocument.lineCount;
	}

	public getLines(): string[] {
		return getLinesFromText(this.textDocument.getText());
	}

	public getSymbols(): ScssSymbol[] {
		const symbols: ScssSymbol[] = [];

		for (const variable of this.variables.values()) {
			symbols.push(variable);
		}

		for (const mixin of this.mixins.values()) {
			symbols.push(mixin);
		}

		for (const func of this.functions.values()) {
			symbols.push(func);
		}

		return symbols;
	}

	public getLinks(options = { forwards: true }): ScssLink[] {
		const links: ScssLink[] = [];

		for (const imp of this.imports.values()) {
			links.push(imp);
		}

		for (const use of this.uses.values()) {
			links.push(use);
		}

		if (options.forwards) {
			for (const forward of this.forwards.values()) {
				links.push(forward);
			}
		}

		return links;
	}
}
