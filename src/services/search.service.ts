import type { ComposerSearchResult } from "@/db/schema/composersSearchResults.schema";
import Fuse from "fuse.js";
import { cacheService } from "./cache.service";
import { composerSearchResultsRepository } from "./repositories/composersSearchResults.repository";

async function cacheComposers(): Promise<ComposerSearchResult[]> {
	const composers =
		await composerSearchResultsRepository.getComposerSearchResults();
	cacheService.setCache("composers", composers);
	return composers;
}

async function getComposersSearchData(): Promise<ComposerSearchResult[]> {
	const cachedComposers = cacheService.getCache("composers");
	if (!cachedComposers) {
		return cacheComposers();
	}
	return cachedComposers;
}

async function searchComposers(query: string): Promise<ComposerSearchResult[]> {
	const keys = [
		"firstName",
		"lastName",
	] as const satisfies (keyof ComposerSearchResult)[];
	const searchData = await getComposersSearchData();
	const fuse = new Fuse(searchData, {
		keys,
	});

	return fuse
		.search(query)
		.map((result) => result.item)
		.slice(0, 5);
}

export const searchService = {
	cacheComposers,
	searchComposers,
};
