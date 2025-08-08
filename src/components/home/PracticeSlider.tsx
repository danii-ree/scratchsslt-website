import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_estimate: string;
  question_type: string;
}

export function PracticeSlider() {
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPracticeProblems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('practice_content')
          .select('id, title, description, difficulty, time_estimate, question_type')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setPracticeProblems(data || []);
      } catch (err) {
        console.error('Error fetching practice problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeProblems();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= practiceProblems.length ? 0 : prev + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, practiceProblems.length - 3) : prev - 3
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'multiple-choice': return 'bg-blue-100 text-blue-800';
      case 'short-answer': return 'bg-purple-100 text-purple-800';
      case 'paragraph': return 'bg-indigo-100 text-indigo-800';
      case 'matching': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-osslt-purple"></div>
      </div>
    );
  }

  if (practiceProblems.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No practice problems available yet.</p>
      </div>
    );
  }

  const visibleProblems = practiceProblems.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative">
      {/* Navigation Controls */}
      <div className="flex items-center justify-end mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={practiceProblems.length <= 3}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={practiceProblems.length <= 3}
            className="h-10 w-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Practice Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {visibleProblems.map((problem) => (
          <Card key={problem.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-osslt-purple/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-osslt-purple" />
                </div>
                <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty || 'Medium'}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{problem.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pb-4">
              <CardDescription className="text-sm leading-relaxed line-clamp-3 mb-4">
                {problem.description || 'Practice your literacy skills with this exercise.'}
              </CardDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{problem.time_estimate || '15 mins'}</span>
                </div>
                <Badge variant="outline" className={getQuestionTypeColor(problem.question_type)}>
                  {problem.question_type?.replace('-', ' ') || 'Multiple Choice'}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
                <Link to={`/practice/${problem.id}`} className="flex items-center gap-2">
                  Start Practice
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* See More Button */}
      <div className="flex justify-center">
        <Button asChild className="bg-osslt-purple hover:bg-osslt-dark-purple">
          <Link to="/practice" className="flex items-center gap-2">
            See More Practice Problems
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Dots indicator */}
      {practiceProblems.length > 3 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(practiceProblems.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === Math.floor(currentIndex / 3) 
                  ? 'bg-osslt-purple' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
