import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();

  const { data: ks3Articles } = useQuery<Article[]>({
    queryKey: ["/api/articles", "ks3"],
    queryFn: () => fetch("/api/articles?level=ks3").then(r => r.json())
  });

  const { data: gcseArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles", "gcse"],
    queryFn: () => fetch("/api/articles?level=gcse").then(r => r.json())
  });

  const refreshArticles = async () => {
    try {
      await apiRequest("POST", "/api/articles/refresh");
      toast({
        title: "Success",
        description: "Articles have been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh articles",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Latest News
        </h1>
        <Button 
          onClick={refreshArticles}
          className="bg-primary hover:bg-primary/90"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Articles
        </Button>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            KS3 Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ks3Articles?.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            GCSE Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gcseArticles?.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}