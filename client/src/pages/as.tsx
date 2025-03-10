import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/article-card";
import type { Article } from "@shared/schema";

export default function AS() {
  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles", "as"],
    queryFn: () => fetch("/api/articles?level=as").then(r => r.json())
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          AS Level News Articles
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Advanced news articles with French translations for AS Level students.
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
