import {
	CodeAction,
	CodeActionKind,
	Command,
	Connection,
	FileChangeType,
	TextDocumentEdit,
} from "vscode-languageserver";
import {
	TextDocuments,
	TextDocumentSyncKind,
} from "vscode-languageserver/node";
import type {
	InitializeParams,
	InitializeResult,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { ExtractProvider } from "./features/code-actions";
import { doCompletion } from "./features/completion";
import { doDiagnostics } from "./features/diagnostics/diagnostics";
import { goDefinition } from "./features/go-definition/go-definition";
import { doHover } from "./features/hover/hover";
import { provideReferences } from "./features/references";
import { doRename, prepareRename } from "./features/rename";
import { doSignatureHelp } from "./features/signature-help/signature-help";
import { searchWorkspaceSymbol } from "./features/workspace-symbols/workspace-symbol";
import type { FileSystemProvider } from "./file-system";
import { getFileSystemProvider } from "./file-system-provider";
import { RuntimeEnvironment } from "./runtime";
import ScannerService from "./scanner";
import type { IEditorSettings, ISettings } from "./settings";
import StorageService from "./storage";
import { getSCSSRegionsDocument } from "./utils/embedded";

interface InitializationOption {
	workspace: string;
	settings: ISettings;
}

export class SomeSassServer {
	private readonly connection: Connection;
	private readonly runtime: RuntimeEnvironment;

	constructor(connection: Connection, runtime: RuntimeEnvironment) {
		this.connection = connection;
		this.runtime = runtime;
	}

	public listen(): void {
		let workspaceRoot: URI;
		let settings: ISettings;
		let editorSettings: IEditorSettings;
		let storageService: StorageService;
		let scannerService: ScannerService;
		let fileSystemProvider: FileSystemProvider;

		// Create a simple text document manager. The text document manager
		// _supports full document sync only
		const documents = new TextDocuments(TextDocument);

		// Make the text document manager listen on the connection
		// _for open, change and close text document events
		documents.listen(this.connection);

		// After the server has started the client sends an initilize request. The server receives
		// _in the passed params the rootPath of the workspace plus the client capabilites
		this.connection.onInitialize(
			async (params: InitializeParams): Promise<InitializeResult> => {
				const options = params.initializationOptions as InitializationOption;

				fileSystemProvider = getFileSystemProvider(
					this.connection,
					this.runtime,
				);

				workspaceRoot = URI.parse(options.workspace);

				return {
					capabilities: {
						textDocumentSync: TextDocumentSyncKind.Incremental,
						referencesProvider: true,
						completionProvider: {
							resolveProvider: false,
							triggerCharacters: [
								// For SassDoc annotation completion
								"@",
								" ",
								"/",

								// For @use completion
								'"',
								"'",
							],
						},
						signatureHelpProvider: {
							triggerCharacters: ["(", ",", ";"],
						},
						hoverProvider: true,
						definitionProvider: true,
						workspaceSymbolProvider: true,
						codeActionProvider: {
							codeActionKinds: [
								CodeActionKind.RefactorExtract,
								CodeActionKind.RefactorExtract + ".function",
								CodeActionKind.RefactorExtract + ".constant",
							],
							resolveProvider: false,
						},
						renameProvider: { prepareProvider: true },
					},
				};
			},
		);

		this.connection.onInitialized(async () => {
			settings = await this.connection.workspace.getConfiguration("somesass");
			editorSettings = await this.connection.workspace.getConfiguration(
				"editor",
			);

			storageService = new StorageService();
			scannerService = new ScannerService(
				storageService,
				fileSystemProvider,
				settings,
			);

			const files = await fileSystemProvider.findFiles(
				"**/*.{scss,svelte,astro,vue}",
				settings.scannerExclude,
			);

			try {
				await scannerService.scan(files, workspaceRoot);
			} catch (error) {
				console.log(String(error));
			}
		});

		documents.onDidChangeContent(async (change) => {
			if (!scannerService) {
				return null;
			}

			try {
				await scannerService.update(change.document, workspaceRoot);
			} catch (error) {
				// Something went wrong trying to parse the changed document.
				console.error((error as Error).message);
				return;
			}

			const diagnostics = await doDiagnostics(change.document, storageService);

			// Check that no new version has been made while we waited
			const latestTextDocument = documents.get(change.document.uri);
			if (
				latestTextDocument &&
				latestTextDocument.version === change.document.version
			) {
				this.connection.sendDiagnostics({
					uri: latestTextDocument.uri,
					diagnostics,
				});
			}
		});

		this.connection.onDidChangeConfiguration((params) => {
			settings = params.settings.somesass;
		});

		this.connection.onDidChangeWatchedFiles(async (event) => {
			if (!scannerService) {
				return null;
			}

			const newFiles: URI[] = [];
			for (const change of event.changes) {
				const uri = URI.parse(change.uri);
				if (change.type === FileChangeType.Deleted) {
					storageService.delete(uri);
				} else if (change.type === FileChangeType.Changed) {
					const document = storageService.get(uri);
					if (document) {
						await scannerService.update(document, workspaceRoot);
					} else {
						// New to us anyway
						newFiles.push(uri);
					}
				} else {
					newFiles.push(uri);
				}
			}
			return scannerService.scan(newFiles, workspaceRoot);
		});

		this.connection.onCompletion((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return doCompletion(document, offset, settings, storageService);
		});

		this.connection.onHover((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return doHover(document, offset, storageService);
		});

		this.connection.onSignatureHelp((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return doSignatureHelp(document, offset, storageService);
		});

		this.connection.onDefinition((textDocumentPosition) => {
			const uri = documents.get(textDocumentPosition.textDocument.uri);
			if (uri === undefined) {
				return;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				textDocumentPosition.position,
			);
			if (!document) {
				return null;
			}

			return goDefinition(document, offset, storageService);
		});

		this.connection.onReferences(async (referenceParams) => {
			const uri = documents.get(referenceParams.textDocument.uri);
			if (uri === undefined) {
				return undefined;
			}

			const { document, offset } = getSCSSRegionsDocument(
				uri,
				referenceParams.position,
			);
			if (!document) {
				return null;
			}

			const options = referenceParams.context;
			const references = await provideReferences(
				document,
				offset,
				storageService,
				options,
			);

			if (!references) {
				return null;
			}

			return references.references.map((r) => r.location);
		});

		this.connection.onWorkspaceSymbol((workspaceSymbolParams) => {
			return searchWorkspaceSymbol(
				workspaceSymbolParams.query,
				storageService,
				workspaceRoot.toString(),
			);
		});

		this.connection.onCodeAction(async (params) => {
			const codeActionProviders = [new ExtractProvider(editorSettings)];

			const document = documents.get(params.textDocument.uri);
			if (document === undefined) {
				return undefined;
			}

			const allActions: (Command | CodeAction)[] = [];

			for (const provider of codeActionProviders) {
				const actions = await provider.provideCodeActions(
					document,
					params.range,
				);

				if (provider instanceof ExtractProvider) {
					for (const action of actions) {
						const edit: TextDocumentEdit | undefined = action.edit
							?.documentChanges?.[0] as TextDocumentEdit;

						const command = Command.create(
							action.title,
							"_somesass.applyExtractCodeAction",
							document.uri,
							document.version,
							edit && edit.edits[0],
						);

						allActions.push(
							CodeAction.create(action.title, command, action.kind),
						);
					}
				}
			}

			return allActions;
		});

		this.connection.onPrepareRename(async (params) => {
			const uri = documents.get(params.textDocument.uri);
			if (uri === undefined) {
				return null;
			}

			const { document, offset } = getSCSSRegionsDocument(uri, params.position);
			if (!document) {
				return null;
			}

			const preparations = await prepareRename(
				document,
				offset,
				storageService,
				settings,
			);
			return preparations;
		});

		this.connection.onRenameRequest(async (params) => {
			const uri = documents.get(params.textDocument.uri);
			if (uri === undefined) {
				return null;
			}

			const { document, offset } = getSCSSRegionsDocument(uri, params.position);
			if (!document) {
				return null;
			}

			const edits = await doRename(
				document,
				offset,
				storageService,
				params.newName,
			);
			return edits;
		});

		this.connection.onShutdown(() => {
			storageService.clear();
		});

		this.connection.listen();
	}
}