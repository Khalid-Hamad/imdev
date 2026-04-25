import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const usesItems = pgTable("uses_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  descriptionEn: text("description_en").default(""),
  descriptionAr: text("description_ar").default(""),
  category: varchar("category", { length: 100 }).notNull(),
  rating: integer("rating").default(0),
  iconUrl: varchar("icon_url", { length: 1000 }).default(""),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UsesItem = typeof usesItems.$inferSelect;
export type NewUsesItem = typeof usesItems.$inferInsert;
