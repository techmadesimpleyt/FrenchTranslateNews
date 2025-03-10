import { Article } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Formats a date for display in article cards and listings
 */
export function formatArticleDate(date: Date | string): string {
  const articleDate = new Date(date);
  return formatDistanceToNow(articleDate, { addSuffix: true });
}

/**
 * Formats a date in full format for article details
 */
export function formatArticleDateFull(date: Date | string): string {
  const articleDate = new Date(date);
  return format(articleDate, "MMMM d, yyyy 'at' h:mm a");
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Determines if an article is suitable for GCSE level based on content
 */
export function isGcseLevel(summary: string): boolean {
  // Count words in summary
  const wordCount = summary.split(/\s+/).length;
  
  // GCSE articles are longer and more complex
  return wordCount > 100;
}

/**
 * Groups articles by source
 */
export function groupArticlesBySource(articles: Article[]): Record<string, Article[]> {
  return articles.reduce((acc, article) => {
    if (!acc[article.source]) {
      acc[article.source] = [];
    }
    acc[article.source].push(article);
    return acc;
  }, {} as Record<string, Article[]>);
}

/**
 * Sorts articles by publication date
 */
export function sortArticlesByDate(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Gets a readable study level label
 */
export function getStudyLevelLabel(isGcse: boolean): string {
  return isGcse ? "GCSE Level" : "KS3 Level";
}

/**
 * Calculates reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Formats source name for display
 */
export function formatSourceName(source: string): string {
  return source
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('.')[0]
    .toUpperCase();
}

/**
 * Checks if an article is recent (within last 24 hours)
 */
export function isRecentArticle(publishedAt: Date | string): boolean {
  const articleDate = new Date(publishedAt);
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return articleDate > oneDayAgo;
}

/**
 * Creates a shareable URL for an article
 */
export function getShareableUrl(article: Article): string {
  const baseUrl = window.location.origin;
  const level = article.isGcse ? 'gcse' : 'ks3';
  return `${baseUrl}/${level}?article=${article.id}`;
}
