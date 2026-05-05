import { pgTable, uuid, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";

export const aboutSections = pgTable("about_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  data: jsonb("data").notNull(),
  sortOrder: integer("sort_order").default(0),
  // Stable identifier for rows that originated in data/seed/about.json.
  // NULL for admin-created rows. Lets the seed script upsert + prune
  // without wiping admin-only edits.
  seedKey: varchar("seed_key", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AboutSection = typeof aboutSections.$inferSelect;
export type NewAboutSection = typeof aboutSections.$inferInsert;
