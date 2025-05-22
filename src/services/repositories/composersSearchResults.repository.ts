import { db } from "@/db";
import {
	type ComposerSearchResult,
	composerSearchResultsTable,
} from "@/db/schema/composersSearchResults.schema";

async function getComposerSearchResults(): Promise<ComposerSearchResult[]> {
	try {
		return await db.select().from(composerSearchResultsTable);
	} catch (error) {
		throw new Error("Failed DB request to get composer search results", {
			cause: error,
		});
	}
}

export const composerSearchResultsRepository = {
	getComposerSearchResults,
};
