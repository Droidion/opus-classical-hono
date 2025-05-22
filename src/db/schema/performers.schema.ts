import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const performersTable = pgTable("performers_with_instruments", {
	recordingId: integer("recording_id").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name").notNull(),
	instrument: text("instrument").notNull(),
	priority: integer("priority"),
	performerId: integer("performer_id").notNull(),
});

export type Performer = typeof performersTable.$inferSelect;
