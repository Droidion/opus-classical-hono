import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { composersTable } from "./composers.schema";

export const worksTable = pgTable("works_with_genres", {
	id: integer("id").primaryKey(),
	title: text("title").notNull(),
	yearStart: integer("year_start"),
	yearFinish: integer("year_finish"),
	averageMintues: integer("average_minutes").notNull(),
	catalogueName: text("catalogue_name"),
	catalogueNumber: integer("catalogue_number"),
	cataloguePostfix: text("catalogue_postfix"),
	no: integer("no"),
	nickname: text("nickname"),
	composerId: integer("composer_id")
		.notNull()
		.references(() => composersTable.id),
	sort: integer("sort"),
	genreId: integer("genre_id").notNull(),
	genreName: text("genre_name").notNull(),
});

export type Work = typeof worksTable.$inferSelect;
