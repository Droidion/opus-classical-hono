import type { FC } from "hono/jsx";
import type { Link } from "@/db/schema/links.schema";
import type { Performer } from "@/db/schema/performers.schema";
import type { Recording } from "@/db/schema/recordings.schema";
import { formatWorkLength, formatYearsRangeString } from "@/utils/formatting";
import { LinkCard } from "./LinkCard";
import { PerformerCard } from "./PerformerCard";

interface RecordingCardProps {
	imagesUrl: string;
	performers: Performer[];
	recording: Recording;
	links: Link[];
}

export const RecordingCard: FC<RecordingCardProps> = ({
	imagesUrl,
	performers,
	recording,
	links,
}) => {
	const imagePath = `${imagesUrl}/${recording.coverName}`;
	const recordingYears = formatYearsRangeString(
		recording.yearStart,
		recording.yearFinish,
	);
	const workLength = formatWorkLength(recording.length);
	return (
		<div class="mt-2 mr-8 mb-6 flex min-w-full flex-1 xl:min-w-[450px]">
			<img
				class="cover float-left mr-4 h-24 w-24 border border-black/20 xl:mr-6 xl:h-52 xl:w-52 dark:border-white/20"
				src={imagePath}
				alt="Recording cover."
				width="400"
				height="400"
			/>
			<div>
				{performers.map((performer) => (
					<PerformerCard performer={performer} key={performer.performerId} />
				))}
				<div class="font-light text-xs">
					<span>{recording.label}</span>
					<span class="vertical-separator" />
					<span>{recordingYears}</span>
					<span class="vertical-separator" />
					<span>{workLength}</span>
				</div>
				<div class="flex items-center">
					{links.map((link) => (
						<LinkCard link={link} key={link.recordingId + link.streamerId} />
					))}
				</div>
			</div>
		</div>
	);
};
