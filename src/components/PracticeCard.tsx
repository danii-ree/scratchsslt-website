import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface PracticeCardProps {
  id: string;
  title: string;
  description: string;
  type: "Multiple Choice" | "Short Answer" | "Paragraph" | "Matching";
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  creator: string;
  savedCount: number;
}

export function PracticeCard({
  id,
  title,
  description,
  type,
  difficulty,
  timeEstimate,
  creator,
  savedCount,
}: PracticeCardProps) {
  // Define badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {type}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeEstimate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{savedCount} saves</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
          <Link to={`/practice/${id}`}>Start Practice</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
