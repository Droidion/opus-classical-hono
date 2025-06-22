import { eq } from "drizzle-orm";
import { db } from "@/db";
import { type Recording, recordingsTable } from "@/db/schema/recordings.schema";

async function getRecordingsByWork(workId: number): Promise<Recording[]> {
	try {
		return db
			.select()
			.from(recordingsTable)
			.where(eq(recordingsTable.workId, workId))
			.orderBy(recordingsTable.yearFinish);
	} catch (error) {
		throw new Error(`Failed DB request to get recordings by workId=${workId}`, {
			cause: error,
		});
	}
}

export const recordingRepository = {
	getRecordingsByWork,
};
