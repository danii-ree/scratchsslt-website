
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
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }[difficulty];

  // Define badge color based on question type
  const typeColor = {
    "Multiple Choice": "bg-blue-100 text-blue-800",
    "Short Answer": "bg-purple-100 text-purple-800",
    "Paragraph": "bg-indigo-100 text-indigo-800",
    "Matching": "bg-pink-100 text-pink-800",
  }[type];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={typeColor}>
            {type}
          </Badge>
          <Badge variant="outline" className={difficultyColor}>
            {difficulty}
          </Badge>
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            <Clock className="mr-1 h-3 w-3" /> {timeEstimate}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="flex items-center">
            <Book className="mr-1 h-3 w-3" /> Created by {creator}
          </span>
          <span className="flex items-center mt-1">
            <Star className="mr-1 h-3 w-3" /> Saved by {savedCount} students
          </span>
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
