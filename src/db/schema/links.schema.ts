import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const linksTable = pgTable("links_with_streamers", {
	recordingId: integer("recording_id").notNull(),
	recordingLink: text("recording_link").notNull(),
	streamer: text("streamer").notNull(),
	icon: text("icon"),
	linkPrefix: text("link_prefix").notNull(),
	streamerId: integer("streamer_id").notNull(),
});

export type Link = typeof linksTable.$inferSelect;
