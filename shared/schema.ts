import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleFr: text("title_fr").notNull(),
  summary: text("summary").notNull(),
  summaryFr: text("summary_fr").notNull(),
  originalUrl: text("original_url").notNull(),
  source: text("source").notNull(),
  isGcse: boolean("is_gcse").notNull(),
  isAs: boolean("is_as").notNull().default(false),
  publishedAt: timestamp("published_at").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const articleLevels = {
  KS3: 'ks3',
  GCSE: 'gcse',
  AS: 'as'
} as const;