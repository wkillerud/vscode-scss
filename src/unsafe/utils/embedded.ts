import { TextDocument, Position } from 'vscode-languageserver-textdocument';

type Region = [number, number];

export function isFileWhereScssCanBeEmbedded(path: string) {
	return path.endsWith('.vue') || path.endsWith('.svelte') || path.endsWith('.astro');
}

export function getSCSSRegions(content: string) {
	const regions: Region[] = [];
	const startRe = /<style[\w=\"\' \n\t]{1,}(lang|type)=[\"\'](text\/)?scss[\"\'][\w=\"\' \n\t]{0,}>/g;
	const endRe = /<\/style>/g;
	/* tslint:disable:no-conditional-assignment */
	let start: RegExpExecArray | null;
	let end: RegExpExecArray | null;
	while ((start = startRe.exec(content)) !== null && (end = endRe.exec(content)) !== null) {
		if (start[0] !== undefined) {
			regions.push([start.index + start[0].length, end.index]);
		}
	}
	return regions;
}

export function getSCSSContent(content: string, regions = getSCSSRegions(content)) {
	const oldContent = content;

	let newContent = oldContent
		.split('\n')
		.map(line => ' '.repeat(line.length))
		.join('\n');

	for (const r of regions) {
		newContent = newContent.slice(0, r[0]) + oldContent.slice(r[0], r[1]) + newContent.slice(r[1]);
	}

	return newContent;
}

function convertTextDocument(document: TextDocument, regions: Region[]) {
	return TextDocument.create(document.uri, 'scss', document.version, getSCSSContent(document.getText(), regions));
}

export function getSCSSRegionsDocument(document: TextDocument, position?: Position) {
	const offset = position ? document.offsetAt(position) : 0;
	if (!isFileWhereScssCanBeEmbedded(document.uri)) {
		return { document, offset };
	}

	const scssRegions = getSCSSRegions(document.getText());

	if (typeof position === "undefined") {
		return { document: convertTextDocument(document, scssRegions), offset };
	} else if (scssRegions.some(region => region[0] <= offset && region[1] >= offset)) {
		return { document: convertTextDocument(document, scssRegions), offset };
	}

	return { document: null, offset };
}