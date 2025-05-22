import { db } from "@/db";
import { type Period, periodsTable } from "@/db/schema/periods.schema";

async function getPeriods(): Promise<Period[]> {
	try {
		return db.select().from(periodsTable).orderBy(periodsTable.yearStart);
	} catch (error) {
		throw new Error("Failed DB request to get periods", { cause: error });
	}
}

export const periodRepository = {
	getPeriods,
};
