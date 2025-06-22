import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { type Link, linksTable } from "@/db/schema/links.schema";

async function getLinksByRecordings(recordingIds: number[]): Promise<Link[]> {
	try {
		return await db
			.select()
			.from(linksTable)
			.where(inArray(linksTable.recordingId, recordingIds));
	} catch (error) {
		throw new Error(
			`Failed DB request to get links by recordingIds=${recordingIds}`,
			{
				cause: error,
			},
		);
	}
}

export const linksRepository = {
	getLinksByRecordings,
};
