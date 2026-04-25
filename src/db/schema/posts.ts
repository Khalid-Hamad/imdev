import { pgTable, uuid, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleEn: varchar("title_en", { length: 500 }).notNull(),
  titleAr: varchar("title_ar", { length: 500 }).default(""),
  contentEn: text("content_en").notNull().default(""),
  contentAr: text("content_ar").default(""),
  excerptEn: text("excerpt_en").default(""),
  excerptAr: text("excerpt_ar").default(""),
  coverImage: varchar("cover_image", { length: 1000 }).default(""),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  tags: jsonb("tags").$type<string[]>().default([]),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
