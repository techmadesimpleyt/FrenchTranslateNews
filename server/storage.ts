import { articles, type Article, type InsertArticle } from "@shared/schema";
import Parser from 'rss-parser';
import { translate } from '@vitalets/google-translate-api';

interface NewsSource {
  name: string;
  url: string;
  language: 'en' | 'fr';
}

const NEWS_SOURCES: NewsSource[] = [
  { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', language: 'en' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', language: 'en' },
  { name: 'Reuters', url: 'https://www.reutersagency.com/feed/', language: 'en' },
  { name: 'Associated Press', url: 'https://feeds.feedburner.com/breaking-news', language: 'en' },
  { name: 'France 24', url: 'https://www.france24.com/en/rss', language: 'en' },
  { name: 'Le Monde', url: 'https://www.lemonde.fr/en/rss/une.xml', language: 'fr' }
];

export interface IStorage {
  getArticles(options: { level: 'ks3' | 'gcse' | 'as' }): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  fetchAndTranslateArticles(): Promise<void>;
}

export class MemStorage implements IStorage {
  private articles: Map<number, Article>;
  private currentId: number;
  private parser: Parser;

  constructor() {
    this.articles = new Map();
    this.currentId = 1;
    this.parser = new Parser();
  }

  async getArticles({ level }: { level: 'ks3' | 'gcse' | 'as' }): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => {
        if (level === 'as') return article.isAs;
        if (level === 'gcse') return article.isGcse && !article.isAs;
        return !article.isGcse && !article.isAs;
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    console.log(`Fetching ${level.toUpperCase()} articles, found: ${articles.length}`);
    return articles;
  }

  private async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    console.log(`Created article: ${article.title}`);
    return article;
  }

  private async translateWithRetry(text: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await translate(text, { to: 'fr' });
        return result.text;
      } catch (error) {
        if (i === retries - 1) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Translation failed after retries');
  }

  private isDuplicate(title: string): boolean {
    return Array.from(this.articles.values()).some(article => 
      article.title.toLowerCase() === title.toLowerCase()
    );
  }

  async fetchAndTranslateArticles(): Promise<void> {
    console.log('Starting to fetch and translate articles...');

    for (const source of NEWS_SOURCES) {
      try {
        console.log(`Fetching from ${source.name}: ${source.url}`);
        const feedData = await this.parser.parseURL(source.url);
        console.log(`Got ${feedData.items.length} items from ${source.name}`);

        for (const item of feedData.items.slice(0, 5)) {
          try {
            // Skip if we already have this article
            if (this.isDuplicate(item.title || '')) {
              console.log(`Skipping duplicate article: ${item.title}`);
              continue;
            }

            const summary = item.contentSnippet?.slice(0, 250) || '';
            console.log(`Processing article: ${item.title}`);

            let titleFr: string;
            let summaryFr: string;

            if (source.language === 'fr') {
              // For French sources, use original text and translate to English
              const [titleEn, summaryEn] = await Promise.all([
                this.translateWithRetry(item.title || ''),
                this.translateWithRetry(summary)
              ]);
              titleFr = item.title || '';
              summaryFr = summary;
              item.title = titleEn;
              summary = summaryEn;
            } else {
              // For English sources, translate to French
              [titleFr, summaryFr] = await Promise.all([
                this.translateWithRetry(item.title || ''),
                this.translateWithRetry(summary)
              ]);
            }

            const wordCount = summary.split(' ').length;
            const isAs = wordCount > 200;
            const isGcse = wordCount > 100;

            await this.createArticle({
              title: item.title || '',
              titleFr,
              summary,
              summaryFr,
              originalUrl: item.link || '',
              source: source.name,
              isGcse: isGcse || isAs,
              isAs,
              publishedAt: new Date(item.pubDate || Date.now())
            });
          } catch (error) {
            console.error(`Error processing article ${item.title} from ${source.name}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error fetching/translating from ${source.name}:`, error);
      }
    }
    console.log('Finished fetching and translating articles');
  }
}

export const storage = new MemStorage();