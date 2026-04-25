import { pgTable, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
