import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";
import { formatArticleDateFull } from "@/lib/article-utils";

export default function ArticlePage() {
  const [location] = useLocation();
  const level = location.includes("/gcse") ? "gcse" : location.includes("/as") ? "as" : "ks3";
  const articleId = new URLSearchParams(window.location.search).get("article");

  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles", level],
    queryFn: () => fetch(`/api/articles?level=${level}`).then(r => r.json())
  });

  const article = articles?.find(a => a.id === Number(articleId));

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
        <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button 
        variant="outline" 
        className="mb-8"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Articles
      </Button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 space-y-6">
          <header className="space-y-4 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {article.title}
            </h1>
            <p className="text-xl text-primary/80 italic">
              {article.titleFr}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{article.source}</span>
              <span>•</span>
              <span>{formatArticleDateFull(article.publishedAt)}</span>
            </div>
          </header>

          <div className="space-y-8 pt-6">
            <div className="prose max-w-none">
              <p>{article.summary}</p>
            </div>
            <div className="prose max-w-none text-primary/70 italic">
              <p>{article.summaryFr}</p>
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button asChild>
              <a 
                href={article.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Globe className="mr-2 h-4 w-4" />
                Read Original Article
              </a>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}