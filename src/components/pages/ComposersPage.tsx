import { Layout } from "@/components/layouts/Layout";
import { PeriodHeader } from "@/components/partials/PeriodHeader";
import type { ComposersGroupedByPeriod } from "@/types/composers.types";
import type { FC } from "hono/jsx";
import { Fragment } from "hono/jsx";
import { ComposerCard } from "../partials/ComposerCard";

interface ComposersPageProps {
	composersGroupedByPeriods: ComposersGroupedByPeriod[];
}

export const ComposersPage: FC<ComposersPageProps> = ({
	composersGroupedByPeriods,
}) => {
	return (
		<Layout title="Composers">
			<h1>Composers</h1>
			{composersGroupedByPeriods.map((composersGroupedByPeriod) => {
				return (
					<Fragment key={composersGroupedByPeriod.period.id.toString()}>
						<PeriodHeader period={composersGroupedByPeriod.period} />
						<hr />
						<div class="mb-4 flex flex-wrap">
							{composersGroupedByPeriod.composers.map((composer) => {
								return <ComposerCard key={composer.id} composer={composer} />;
							})}
						</div>
					</Fragment>
				);
			})}
		</Layout>
	);
};
