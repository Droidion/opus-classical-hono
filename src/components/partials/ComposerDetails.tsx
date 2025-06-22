import type { FC } from "hono/jsx";
import type { Composer } from "@/db/schema/composers.schema";
import { formatYearsRangeString } from "@/utils/formatting";

interface ComposerDetailsProps {
	composer: Composer;
}

export const ComposerDetails: FC<ComposerDetailsProps> = ({ composer }) => {
	const yearsRange = formatYearsRangeString(
		composer.yearBorn,
		composer.yearDied,
	);
	return (
		<>
			<h1>
				<span>{composer.firstName}</span>
				<span>&nbsp;</span>
				<span>{composer.lastName}</span>
			</h1>
			<div class="mb-4 w-full text-center">
				<span>{composer.countries}</span>
				<span class="vertical-separator" />
				<span>{yearsRange}</span>
				{composer.wikipediaLink && (
					<>
						<span class="vertical-separator" />
						<a href={composer.wikipediaLink}>Wikipedia</a>
					</>
				)}
				{composer.imslpLink && (
					<>
						<span class="vertical-separator" />
						<a href={composer.imslpLink}>IMSLP</a>
					</>
				)}
			</div>
		</>
	);
};
