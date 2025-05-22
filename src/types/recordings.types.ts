import type { Link } from "@/db/schema/links.schema";
import type { Performer } from "@/db/schema/performers.schema";
import type { Recording } from "@/db/schema/recordings.schema";

export interface RecordingWithPerformersAndLinks {
	recording: Recording;
	performers: Performer[];
	links: Link[];
}
