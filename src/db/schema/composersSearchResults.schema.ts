import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const composerSearchResultsTable = pgTable("composers", {
	id: integer("id").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	slug: text("slug").notNull(),
});

export type ComposerSearchResult =
	typeof composerSearchResultsTable.$inferSelect;
