import type { FC } from "hono/jsx";
import type { Work } from "@/db/schema/works.schema";
import {
	formatCatalogueName,
	formatWorkLength,
	formatWorkName,
	formatYearsRangeString,
} from "@/utils/formatting";

interface WorkCardProps {
	work: Work;
	composerSlug: string;
}

export const WorkCard: FC<WorkCardProps> = ({ work, composerSlug }) => {
	const workName = formatWorkName(work.title, work.no, work.nickname);
	const catalogueName = formatCatalogueName(
		work.catalogueName,
		work.catalogueNumber,
		work.cataloguePostfix,
	);
	const yearsRange = formatYearsRangeString(work.yearStart, work.yearFinish);
	const workLength = formatWorkLength(work.averageMintues);
	const link = `/composer/${composerSlug}/work/${work.id}`;
	return (
		<a href={link}>
			<div class="mr-6 mb-3">
				<div>
					<span>{workName}</span>
				</div>
				<div class="font-light text-xs">
					{catalogueName && (
						<>
							<span>{catalogueName}</span>
							{(yearsRange || workLength) && (
								<span class="vertical-separator" />
							)}
						</>
					)}
					{yearsRange && (
						<>
							<span>{yearsRange}</span>
							{workLength && <span class="vertical-separator" />}
						</>
					)}
					{workLength}
				</div>
			</div>
		</a>
	);
};
