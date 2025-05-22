import { Layout } from "@/components/layouts/Layout";
import { RecordingCard } from "@/components/partials/RecordingCard";
import type { Composer } from "@/db/schema/composers.schema";
import type { Work } from "@/db/schema/works.schema";
import { env } from "@/services/env.service";
import type { RecordingWithPerformersAndLinks } from "@/types/recordings.types";
import { formatWorkName, formatYearsRangeString } from "@/utils/formatting";
import type { FC } from "hono/jsx";

interface RecordingsPageProps {
	composer: Composer;
	work: Work;
	recordingsWithPerformersAndLinks: RecordingWithPerformersAndLinks[];
}

export const RecordingsPage: FC<RecordingsPageProps> = ({
	composer,
	work,
	recordingsWithPerformersAndLinks,
}) => {
	const workName = formatWorkName(work.title, work.no, work.nickname);
	const workYears = formatYearsRangeString(work.yearStart, work.yearFinish);
	const link = `/composer/${composer.slug}`;
	return (
		<Layout title={workName}>
			<div>
				<h1>
					<span>{workName}</span>
				</h1>
				<div class="mb-4 w-full text-center">
					<a href={link}>
						{composer.firstName} {composer.lastName}
					</a>
					{workYears && <span>, {workYears}</span>}
				</div>
				<h2>Recommended Recordings</h2>
				<hr />
				<div class="full-width mb-4 flex flex-wrap">
					{recordingsWithPerformersAndLinks.map((recording) => (
						<RecordingCard
							key={recording.recording.id}
							links={recording.links}
							performers={recording.performers}
							recording={recording.recording}
							imagesUrl={env.PUBLIC_IMAGES_URL}
						/>
					))}
				</div>
			</div>
		</Layout>
	);
};
