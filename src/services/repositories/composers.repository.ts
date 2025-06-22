import { eq } from "drizzle-orm";
import { db } from "@/db";
import { type Composer, composersTable } from "@/db/schema/composers.schema";
import { NotFoundError } from "@/errors/errors";

async function getComposers(): Promise<Composer[]> {
	try {
		return await db
			.select()
			.from(composersTable)
			.orderBy(composersTable.lastName);
	} catch (error) {
		throw new Error("Failed DB request to get composers", { cause: error });
	}
}

async function getComposerBySlug(slug: string): Promise<Composer> {
	try {
		const composers = await db
			.select()
			.from(composersTable)
			.where(eq(composersTable.slug, slug));
		if (composers.length === 0) {
			throw new NotFoundError(`Composer with slug="${slug}" not found`);
		}
		return composers[0];
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
		throw new Error("Failed DB request to get composer by slug", {
			cause: error,
		});
	}
}

export const composerRepository = {
	getComposers,
	getComposerBySlug,
};
