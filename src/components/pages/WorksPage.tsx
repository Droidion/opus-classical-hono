import { Layout } from "@/components/layouts/Layout";
import { ComposerDetails } from "@/components/partials/ComposerDetails";
import { WorkCard } from "@/components/partials/WorkCard";
import type { Composer } from "@/db/schema/composers.schema";
import type { WorksGroupedByGenre } from "@/types/works.types";
import type { FC } from "hono/jsx";

interface WorksPageProps {
	composer: Composer;
	worksGroupedByGenres: WorksGroupedByGenre[];
}

export const WorksPage: FC<WorksPageProps> = ({
	composer,
	worksGroupedByGenres,
}) => {
	return (
		<Layout title={composer.lastName}>
			<div>
				<ComposerDetails composer={composer} />
				{worksGroupedByGenres.map((workesGroupedByGenre) => (
					<div key={workesGroupedByGenre.genreName}>
						<h2>{workesGroupedByGenre.genreName}</h2>
						<hr />
						<div class="mb-4 flex flex-wrap">
							{workesGroupedByGenre.works.map((work) => (
								<WorkCard
									key={work.id}
									work={work}
									composerSlug={composer.slug}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</Layout>
	);
};
