'use strict';

import { CompletionList, CompletionItemKind, CompletionItem } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { URI } from 'vscode-uri';

import type { IMixin, IDocumentSymbols } from '../types/symbols';
import type { ISettings } from '../types/settings';
import type StorageService from '../services/storage';

import { parseDocument } from '../services/parser';
import { getSymbolsRelatedToDocument } from '../utils/symbols';
import { getDocumentPath } from '../utils/document';
import { getCurrentWord, getLimitedString, getTextBeforePosition } from '../utils/string';
import { getVariableColor } from '../utils/color';
import { applySassDoc } from './sassdoc';

// RegExp's
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /['"](?:[^'"\\]|\\.)*['"]/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^(\/(\/|\*)|\*)/;
const reQuotes = /['"]/;

/**
 * Returns `true` if the path is not present in the document.
 */
function isImplicitly(symbolsDocument: string | undefined, documentPath: string, documentImports: string[]): boolean {
	if (symbolsDocument === undefined) {
		return true;
	}

	return symbolsDocument !== documentPath && documentImports.indexOf(symbolsDocument) === -1;
}

/**
 * Return Mixin as string.
 */
function makeMixinDocumentation(symbol: IMixin): string {
	const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
	return `${symbol.name}(${args}) {\u2026}`;
}

/**
 * Check context for Variables suggestions.
 */
function checkVariableContext(
	word: string,
	isInterpolation: boolean,
	isPropertyValue: boolean,
	isEmptyValue: boolean,
	isQuotes: boolean
): boolean {
	if (isPropertyValue && !isEmptyValue && !isQuotes) {
		return word.includes('$');
	} else if (isQuotes) {
		return isInterpolation;
	}

	return word[0] === '$' || isInterpolation || isEmptyValue;
}

/**
 * Check context for Mixins suggestions.
 */
function checkMixinContext(textBeforeWord: string, isPropertyValue: boolean): boolean {
	return !isPropertyValue && reMixinReference.test(textBeforeWord);
}

/**
 * Check context for Function suggestions.
 */
function checkFunctionContext(
	textBeforeWord: string,
	isInterpolation: boolean,
	isPropertyValue: boolean,
	isEmptyValue: boolean,
	isQuotes: boolean,
	settings: ISettings
): boolean {
	if (isPropertyValue && !isEmptyValue && !isQuotes) {
		const lastChar = textBeforeWord.substr(-2, 1);
		return settings.suggestFunctionsInStringContextAfterSymbols.indexOf(lastChar) !== -1;
	} else if (isQuotes) {
		return isInterpolation;
	}

	return false;
}

function isCommentContext(text: string): boolean {
	return reComment.test(text.trim());
}

function isInterpolationContext(text: string): boolean {
	return text.includes('#{');
}

function createCompletionContext(document: TextDocument, offset: number, settings: ISettings) {
	const currentWord = getCurrentWord(document.getText(), offset);
	const textBeforeWord = getTextBeforePosition(document.getText(), offset);

	// Is "#{INTERPOLATION}"
	const isInterpolation = isInterpolationContext(currentWord);

	// Information about current position
	const isPropertyValue = rePropertyValue.test(textBeforeWord);
	const isEmptyValue = reEmptyPropertyValue.test(textBeforeWord);
	const isQuotes = reQuotes.test(textBeforeWord.replace(reQuotedValueInString, ''));

	return {
		comment: isCommentContext(textBeforeWord),
		variable: checkVariableContext(currentWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes),
		function: checkFunctionContext(
			textBeforeWord,
			isInterpolation,
			isPropertyValue,
			isEmptyValue,
			isQuotes,
			settings
		),
		mixin: checkMixinContext(textBeforeWord, isPropertyValue)
	};
}

async function createVariableCompletionItems(
	symbols: IDocumentSymbols[],
	filepath: string,
	imports: string[],
	settings: ISettings
): Promise<CompletionItem[]> {
	const completions: CompletionItem[] = [];

	for (let symbol of symbols) {
		const isImplicitlyImport = isImplicitly(symbol.document, filepath, imports);
		const fsPath = getDocumentPath(filepath, isImplicitlyImport ? symbol.filepath : symbol.document);

		for (let variable of symbol.variables) {
			const color = getVariableColor(variable.value || '');
			const completionKind = color ? CompletionItemKind.Color : CompletionItemKind.Variable;

			// Add 'implicitly' prefix for Path if the file imported implicitly
			let detailPath = fsPath;
			if (isImplicitlyImport && settings.implicitlyLabel) {
				detailPath = settings.implicitlyLabel + ' ' + detailPath;
			}


			let documentation = getLimitedString(color ? color.toString() : variable.value || '');
			let detailText = detailPath;
			if (variable.mixin) {
				// Add 'argument from MIXIN_NAME' suffix if Variable is Mixin argument
				detailText = `argument from ${variable.mixin}, ${detailText}`;
			} else {
				// See if there is sassdoc for this standalone variable
				const sassdoc = await applySassDoc(
					{ document: symbol.filepath, info: variable },
					"function",
					{ displayOptions: { description: true, access: true }}
				);
				if (sassdoc) {
					documentation += `\n\n${sassdoc}`;
				}
			}

			completions.push({
				label: variable.name,
				kind: completionKind,
				detail: detailText,
				documentation,
			});
		}
	}

	return completions;
}

async function createMixinCompletionItems(
	symbols: IDocumentSymbols[],
	filepath: string,
	imports: string[],
	settings: ISettings
): Promise<CompletionItem[]> {
	const completions: CompletionItem[] = [];

	for (let symbol of symbols) {
		const isImplicitlyImport = isImplicitly(symbol.document, filepath, imports);
		const fsPath = getDocumentPath(filepath, isImplicitlyImport ? symbol.filepath : symbol.document);

		for (let mixin of symbol.mixins) {
			// Add 'implicitly' prefix for Path if the file imported implicitly
			let detailPath = fsPath;
			if (isImplicitlyImport && settings.implicitlyLabel) {
				detailPath = settings.implicitlyLabel + ' ' + detailPath;
			}

			let documentation = makeMixinDocumentation(mixin);
			const sassdoc = await applySassDoc(
				{ document: symbol.filepath, info: mixin },
				"mixin",
				{ displayOptions: { description: true, access: true }}
			);
			if (sassdoc) {
				documentation += `\n\n${sassdoc}`;
			}

			completions.push({
				label: mixin.name,
				kind: CompletionItemKind.Function,
				detail: detailPath,
				documentation,
				insertText: mixin.name
			});
		}
	}

	return completions;
}

async function createFunctionCompletionItems(
	symbols: IDocumentSymbols[],
	filepath: string,
	imports: string[],
	settings: ISettings
): Promise<CompletionItem[]> {
	const completions: CompletionItem[] = [];

	for (let symbol of symbols) {
		const isImplicitlyImport = isImplicitly(symbol.document, filepath, imports);
		const fsPath = getDocumentPath(filepath, isImplicitlyImport ? symbol.filepath : symbol.document);

		for (let func of symbol.functions) {
			// Add 'implicitly' prefix for Path if the file imported implicitly
			let detailPath = fsPath;
			if (isImplicitlyImport && settings.implicitlyLabel) {
				detailPath = settings.implicitlyLabel + ' ' + detailPath;
			}

			let documentation = makeMixinDocumentation(func);
			const sassdoc = await applySassDoc(
				{ document: symbol.filepath, info: func },
				"function",
				{ displayOptions: { description: true, access: true }}
			);
			if (sassdoc) {
				documentation += `\n\n${sassdoc}`;
			}

			completions.push({
				label: func.name,
				kind: CompletionItemKind.Interface,
				detail: detailPath,
				documentation,
				insertText: func.name
			});
		};
	};

	return completions;
}

export async function doCompletion(
	document: TextDocument,
	offset: number,
	settings: ISettings,
	storage: StorageService
): Promise<CompletionList | null> {
	const completions = CompletionList.create([], false);

	const documentPath = URI.parse(document.uri).fsPath;

	const resource = await parseDocument(document, offset);

	storage.set(document.uri, resource.symbols);

	const symbolsList = getSymbolsRelatedToDocument(storage, documentPath);
	const documentImports = resource.symbols.imports.map(x => x.filepath);
	const context = createCompletionContext(document, offset, settings);

	// Drop suggestions inside `//` and `/* */` comments
	if (context.comment) {
		return completions;
	}

	if (settings.suggestVariables && context.variable) {
		const variables = await createVariableCompletionItems([resource.symbols, ...symbolsList], documentPath, documentImports, settings);

		completions.items = completions.items.concat(variables);
	}

	if (settings.suggestMixins && context.mixin) {
		const mixins = await createMixinCompletionItems([resource.symbols, ...symbolsList], documentPath, documentImports, settings);

		completions.items = completions.items.concat(mixins);
	}

	if (settings.suggestFunctions && context.function) {
		const functions = await createFunctionCompletionItems([resource.symbols, ...symbolsList], documentPath, documentImports, settings);

		completions.items = completions.items.concat(functions);
	}

	return completions;
}
