import type { Composer } from "@/db/schema/composers.schema";
import { formatYearsRangeString } from "@/utils/formatting";
import type { FC } from "hono/jsx";
interface ComposerCardProps {
	composer: Composer;
}

export const ComposerCard: FC<ComposerCardProps> = ({ composer }) => {
	const composerLink = `/composer/${composer.slug}`;
	const yearsRange = formatYearsRangeString(
		composer.yearBorn,
		composer.yearDied,
	);
	return (
		<a href={composerLink}>
			<div class="mr-6 mb-3">
				<div>
					<span>{composer.lastName}, </span>
					<span class="font-light">{composer.firstName}</span>
				</div>
				<div class="whitespace-nowrap font-light text-xs">
					<span>{composer.countries}</span>
					<span class="vertical-separator" />
					<span>{yearsRange}</span>
				</div>
			</div>
		</a>
	);
};
