import { pgTable, uuid, varchar, timestamp, inet, integer } from "drizzle-orm/pg-core";

export const reactions = pgTable("reactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  targetType: varchar("target_type", { length: 20 }).notNull(),
  targetId: uuid("target_id").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  visitorIp: varchar("visitor_ip", { length: 45 }).default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  pagePath: varchar("page_path", { length: 500 }).notNull(),
  targetType: varchar("target_type", { length: 20 }).default(""),
  targetId: uuid("target_id"),
  visitorIp: varchar("visitor_ip", { length: 45 }).default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Reaction = typeof reactions.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
