import type { Work } from "@/db/schema/works.schema";

export interface WorksGroupedByGenre {
	genreName: string;
	works: Work[];
}
