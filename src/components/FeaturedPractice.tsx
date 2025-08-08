import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Featured = { id: string; title: string; difficulty: string; timeEstimate: string };

export function FeaturedPractice() {
  const [featuredPractice, setFeaturedPractice] = useState<Featured | null>(null);

  useEffect(() => {
    const loadFeatured = async () => {
      const { data } = await supabase
        .from('practice_content')
        .select('id,title,difficulty,time_estimate')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setFeaturedPractice({
          id: data.id,
          title: data.title,
          difficulty: (data.difficulty?.charAt(0).toUpperCase() || '') + (data.difficulty?.slice(1) || 'Medium'),
          timeEstimate: data.time_estimate || '15 mins',
        });
      }
    };
    loadFeatured();
  }, []);

  const fallback: Featured = featuredPractice || {
    id: "",
    title: "Add your first practice set",
    difficulty: "Medium",
    timeEstimate: "15 mins",
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-osslt-purple/10 to-osslt-light-purple/20 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-osslt-purple" />
            {fallback.title}
          </CardTitle>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {fallback.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Reading comprehension exercise • {fallback.timeEstimate}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {featuredPractice ? (
          <Button asChild className="w-full bg-osslt-purple hover:bg-osslt-purple/90">
            <Link to={`/practice/${featuredPractice.id}`}>
              Start Practice <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link to="/create">Seed Demo Data</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 