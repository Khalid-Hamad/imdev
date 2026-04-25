import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: varchar("url", { length: 2000 }).notNull(),
  altText: varchar("alt_text", { length: 500 }).default(""),
  type: varchar("type", { length: 50 }).notNull().default("image"),
  sizeBytes: integer("size_bytes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
