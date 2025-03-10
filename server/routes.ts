import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fetch articles based on level
  app.get("/api/articles", async (req, res) => {
    try {
      const level = req.query.level as 'ks3' | 'gcse' | 'as';
      if (!level) {
        return res.status(400).json({ message: "Level parameter is required" });
      }

      const articles = await storage.getArticles({ level });
      res.json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Fetch and translate new articles
  app.post("/api/articles/refresh", async (req, res) => {
    try {
      console.log('Starting article refresh...');
      await storage.fetchAndTranslateArticles();
      console.log('Article refresh completed');
      res.json({ message: "Articles refreshed successfully" });
    } catch (error) {
      console.error('Error refreshing articles:', error);
      res.status(500).json({ message: "Failed to refresh articles" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}