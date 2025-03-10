import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    let level = "ks3";
    if (article.isAs) {
      level = "as";
    } else if (article.isGcse) {
      level = "gcse";
    }
    setLocation(`/${level}/article?article=${article.id}`);
  };

  return (
    <Card 
      className="overflow-hidden border-0 shadow-lg bg-white cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={handleClick}
    >
      <CardHeader className="p-6 bg-gray-50 border-b">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight text-gray-900">
            {article.title}
          </h3>
          <p className="text-base text-primary/80 italic">
            {article.titleFr}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="prose-sm text-gray-700">
          <p>{article.summary}</p>
        </div>
        <div className="prose-sm text-primary/70 italic">
          <p>{article.summaryFr}</p>
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{article.source}</span>
          <span className="mx-2">•</span>
          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="text-primary hover:text-primary-foreground hover:bg-primary"
          onClick={(e) => {
            e.stopPropagation();
            window.open(article.originalUrl, '_blank', 'noopener,noreferrer');
          }}
        >
          Read Original
        </Button>
      </CardFooter>
    </Card>
  );
}