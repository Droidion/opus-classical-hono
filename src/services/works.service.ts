import type { Work } from "@/db/schema/works.schema";
import type { WorksGroupedByGenre } from "@/types/works.types";
import { workRepository } from "./repositories/works.repository";

async function getWorksGroupedByGenres(
	composerId: number,
): Promise<WorksGroupedByGenre[]> {
	const works = await workRepository.getWorksByComposerId(composerId);
	const genresWithWorks = Object.values(
		works.reduce<Record<string, WorksGroupedByGenre>>((acc, work) => {
			if (!acc[work.genreName]) {
				acc[work.genreName] = { genreName: work.genreName, works: [] };
			}
			acc[work.genreName].works.push(work);
			return acc;
		}, {}),
	);
	return genresWithWorks;
}

async function getWorkById(workId: number): Promise<Work> {
	return await workRepository.getWorkById(workId);
}

export const worksService = {
	getWorksGroupedByGenres,
	getWorkById,
};
