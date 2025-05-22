import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { periodsTable } from "./periods.schema";

export const composersTable = pgTable("composers_with_countries", {
	id: serial("id").primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	yearBorn: integer("year_born").notNull(),
	yearDied: integer("year_died"),
	periodId: integer("period_id")
		.notNull()
		.references(() => periodsTable.id),
	slug: text("slug").notNull(),
	wikipediaLink: text("wikipedia_link"),
	imslpLink: text("imslp_link"),
	enabled: boolean("enabled").notNull(),
	countries: text("countries").notNull(),
});

export type Composer = typeof composersTable.$inferSelect;
