import type { FC } from "hono/jsx";
import type { ComposerSearchResult } from "@/db/schema/composersSearchResults.schema";

interface ComposerSearchResultsProps {
	composers: ComposerSearchResult[];
}

export const ComposerSearchResults: FC<ComposerSearchResultsProps> = ({
	composers,
}) => {
	return (
		<>
			{composers.map((composer) => (
				<a
					href={`/composer/${composer.slug}`}
					key={composer.id.toString()}
					class="mx-1.5 my-1 block rounded-sm px-2 py-0.5 focus:bg-black/10 focus:outline-none"
				>
					{composer.lastName}, {composer.firstName}
				</a>
			))}
		</>
	);
};
