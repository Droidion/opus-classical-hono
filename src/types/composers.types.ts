import type { Composer } from "@/db/schema/composers.schema";
import type { Period } from "@/db/schema/periods.schema";

export interface ComposersGroupedByPeriod {
	period: Period;
	composers: Composer[];
}
