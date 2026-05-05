import { pgTable, uuid, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleEn: varchar("title_en", { length: 500 }).notNull(),
  titleAr: varchar("title_ar", { length: 500 }).default(""),
  descriptionEn: text("description_en").default(""),
  descriptionAr: text("description_ar").default(""),
  contentEn: text("content_en").default(""),
  contentAr: text("content_ar").default(""),
  coverImage: varchar("cover_image", { length: 1000 }).default(""),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  githubUrl: varchar("github_url", { length: 1000 }).default(""),
  huggingfaceUrl: varchar("huggingface_url", { length: 1000 }).default(""),
  demoUrl: varchar("demo_url", { length: 1000 }).default(""),
  kind: varchar("kind", { length: 20 }).notNull().default("personal"),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  // Stable identifier for rows that originated in data/seed/projects.json.
  // NULL for admin-created rows. Lets the seed script upsert + prune
  // without wiping admin-only projects.
  seedKey: varchar("seed_key", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
