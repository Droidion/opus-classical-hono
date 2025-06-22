import { eq } from "drizzle-orm";
import { db } from "@/db";
import { type Work, worksTable } from "@/db/schema/works.schema";
import { NotFoundError } from "@/errors/errors";

async function getWorkById(id: number): Promise<Work> {
	try {
		const works = await db
			.select()
			.from(worksTable)
			.where(eq(worksTable.id, id));
		if (works.length === 0) {
			throw new NotFoundError(`Work with id=${id} not found`);
		}
		return works[0];
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
		throw new Error(`Failed DB request to get work by id=${id}`, {
			cause: error,
		});
	}
}

async function getWorksByComposerId(composerId: number): Promise<Work[]> {
	try {
		return await db
			.select()
			.from(worksTable)
			.where(eq(worksTable.composerId, composerId))
			.orderBy(
				worksTable.genreName,
				worksTable.sort,
				worksTable.catalogueNumber,
			);
	} catch (error) {
		throw new Error(
			`Failed DB request to get works by composer id=${composerId}`,
			{
				cause: error,
			},
		);
	}
}

export const workRepository = {
	getWorkById,
	getWorksByComposerId,
};
