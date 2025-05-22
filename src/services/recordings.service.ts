import type { Link } from "@/db/schema/links.schema";
import type { Performer } from "@/db/schema/performers.schema";
import type { Recording } from "@/db/schema/recordings.schema";
import type { RecordingWithPerformersAndLinks } from "@/types/recordings.types";
import { linksRepository } from "./repositories/links.repository";
import { performersRepository } from "./repositories/performers.repository";
import { recordingRepository } from "./repositories/recordings.repository";

async function getRecordingsByWorkId(workId: number): Promise<Recording[]> {
	return await recordingRepository.getRecordingsByWork(workId);
}

function getRecordingsIds(recordings: Recording[]): number[] {
	return recordings.map((recording) => recording.id);
}

async function recordingsWithPerformersAndLinks(
	workId: number,
): Promise<RecordingWithPerformersAndLinks[]> {
	const recordings = await recordingRepository.getRecordingsByWork(workId);
	const recordingsIds = getRecordingsIds(recordings);
	const performers =
		await performersRepository.getPerformersByRecordings(recordingsIds);
	const links = await linksRepository.getLinksByRecordings(recordingsIds);
	const recordingsWithPerformersAndLinks = recordings.map(
		(recording: Recording) => {
			return {
				recording,
				performers: performers.filter(
					(performer: Performer) => performer.recordingId === recording.id,
				),
				links: links.filter((link: Link) => link.recordingId === recording.id),
			};
		},
	);
	return recordingsWithPerformersAndLinks;
}
export const recordingsService = {
	getRecordingsByWorkId,
	recordingsWithPerformersAndLinks,
};
