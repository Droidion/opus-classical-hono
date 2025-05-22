import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { worksTable } from "./works.schema";

export const recordingsTable = pgTable("recordings_with_labels", {
	id: integer("id").primaryKey(),
	coverName: text("cover_name").notNull(),
	length: integer("length").notNull(),
	label: text("label").notNull(),
	workId: integer("work_id").references(() => worksTable.id),
	yearStart: integer("year_start"),
	yearFinish: integer("year_finish"),
});

export type Recording = typeof recordingsTable.$inferSelect;
