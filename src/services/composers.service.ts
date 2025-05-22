import type { Composer } from "@/db/schema/composers.schema";
import type { ComposersGroupedByPeriod } from "@/types/composers.types";
import { composerRepository } from "./repositories/composers.repository";
import { periodRepository } from "./repositories/periods.repository";

async function getComposersGroupedByPeriods(): Promise<
	ComposersGroupedByPeriod[]
> {
	const periods = await periodRepository.getPeriods();
	const composers = await composerRepository.getComposers();
	const periodsWithComposers = periods.map((period) => {
		return {
			period,
			composers: composers.filter(
				(composer) => composer.periodId === period.id,
			),
		};
	});

	return periodsWithComposers;
}

async function getComposerBySlug(slug: string): Promise<Composer> {
	return await composerRepository.getComposerBySlug(slug);
}

export const composersService = {
	getComposersGroupedByPeriods,
	getComposerBySlug,
};
