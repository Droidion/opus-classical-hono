import { db } from "@/db";
import { type Performer, performersTable } from "@/db/schema/performers.schema";
import { inArray } from "drizzle-orm";

async function getPerformersByRecordings(
	recordingIds: number[],
): Promise<Performer[]> {
	try {
		return await db
			.select()
			.from(performersTable)
			.where(inArray(performersTable.recordingId, recordingIds));
	} catch (error) {
		throw new Error(
			`Failed DB request to get performers by recordingIds=${recordingIds}`,
			{
				cause: error,
			},
		);
	}
}

export const performersRepository = {
	getPerformersByRecordings,
};
