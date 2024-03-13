import type {
	LanguageService,
	LanguageServiceOptions,
} from "@somesass/language-server-types";
import { SassLinkFinder } from "./feature/find-links";
import { SassSymbolFinder } from "./feature/find-symbols";
import { getLanguageModelCache } from "./language-model-cache";
import { parseStylesheet } from "./parser";

export { getLanguageModelCache };

export function getLanguageService(
	options: LanguageServiceOptions,
): LanguageService {
	const linkFinder = new SassLinkFinder(options);
	const symbolFinder = new SassSymbolFinder();

	return {
		configure: (settings) => {
			linkFinder.configure(settings);
		},
		parseStylesheet,
		findDocumentLinks: linkFinder.findDocumentLinks.bind(linkFinder),
		findDocumentSymbols: symbolFinder.findDocumentSymbols.bind(symbolFinder),
	};
}
