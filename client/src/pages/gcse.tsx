import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/article-card";
import type { Article } from "@shared/schema";

export default function GCSE() {
  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles", "gcse"],
    queryFn: () => fetch("/api/articles?level=gcse").then(r => r.json())
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          GCSE News Articles
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          More complex news articles with French translations for GCSE students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}