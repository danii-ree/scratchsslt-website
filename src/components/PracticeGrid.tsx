
import { useEffect, useState } from "react";
import { PracticeCard } from "@/components/PracticeCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type definition for practice problem data
interface PracticeProblem {
  id: string;
  title: string;
  description: string | null;
  type: "Multiple Choice" | "Short Answer" | "Paragraph" | "Matching";
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: string;
  creator: string;
  savedCount: number;
}

// Map database question_type to UI-friendly format
const mapQuestionType = (type: string): "Multiple Choice" | "Short Answer" | "Paragraph" | "Matching" => {
  const typeMap: Record<string, any> = {
    'multiple-choice': "Multiple Choice",
    'short-answer': "Short Answer",
    'paragraph': "Paragraph",
    'matching': "Matching"
  };
  return typeMap[type] || "Multiple Choice";
};

// Sample data as fallback
const samplePracticeProblems = [
  {
    id: "1",
    title: "Understanding Themes in Short Stories",
    description: "Practice identifying themes and main ideas in short literary texts.",
    type: "Multiple Choice" as const,
    difficulty: "Easy" as const,
    timeEstimate: "15 mins",
    creator: "Mrs. Johnson",
    savedCount: 245
  },
  {
    id: "2",
    title: "Analyzing Character Motivations",
    description: "Explore character development and motivations in narrative texts.",
    type: "Short Answer" as const,
    difficulty: "Medium" as const,
    timeEstimate: "20 mins",
    creator: "Mr. Davis",
    savedCount: 189
  },
  {
    id: "3",
    title: "Paragraph Writing: Organizing Ideas",
    description: "Learn to write well-organized paragraphs with clear topic sentences.",
    type: "Paragraph" as const,
    difficulty: "Medium" as const,
    timeEstimate: "30 mins",
    creator: "Ms. Williams",
    savedCount: 312
  },
  {
    id: "4",
    title: "Identifying Literary Devices",
    description: "Match literary devices with their examples from various texts.",
    type: "Matching" as const,
    difficulty: "Hard" as const,
    timeEstimate: "25 mins",
    creator: "Dr. Martinez",
    savedCount: 178
  },
  {
    id: "5",
    title: "Comprehending News Articles",
    description: "Practice reading and understanding informational texts from news sources.",
    type: "Multiple Choice" as const,
    difficulty: "Medium" as const,
    timeEstimate: "20 mins",
    creator: "Mr. Thompson",
    savedCount: 203
  },
  {
    id: "6",
    title: "Writing Opinion Paragraphs",
    description: "Learn to express and support your opinions in structured paragraphs.",
    type: "Paragraph" as const,
    difficulty: "Hard" as const,
    timeEstimate: "35 mins",
    creator: "Ms. Garcia",
    savedCount: 156
  }
];

interface PracticeGridProps {
  searchTerm?: string;
  filters?: {
    questionTypes: {
      multipleChoice: boolean;
      shortAnswer: boolean;
      paragraph: boolean;
      matching: boolean;
    };
    difficulty: {
      easy: boolean;
      medium: boolean;
      hard: boolean;
    };
  };
}

export function PracticeGrid({ searchTerm = "", filters }: PracticeGridProps) {
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch practice problems from Supabase
    const fetchPracticeProblems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('practice_content')
          .select(`
            id,
            title,
            description,
            question_type,
            documents(id)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedData: PracticeProblem[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || "No description provided",
            type: mapQuestionType(item.question_type),
            // For prototype purposes, assign random difficulty
            difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
            timeEstimate: `${Math.floor(Math.random() * 30) + 10} mins`,
            creator: "OSSLT Teacher",
            savedCount: Math.floor(Math.random() * 300),
          }));
          
          setPracticeProblems(formattedData);
        }
      } catch (err) {
        console.error("Error fetching practice problems:", err);
        setError("Failed to load practice problems");
        toast.error("Failed to load practice content", {
          description: "Please try refreshing the page"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeProblems();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:practice_content')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'practice_content' 
      }, (payload) => {
        // When new content is added, add it to the state
        const newItem = payload.new as any;
        const newPracticeProblem: PracticeProblem = {
          id: newItem.id,
          title: newItem.title,
          description: newItem.description || "No description provided",
          type: mapQuestionType(newItem.question_type),
          difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
          timeEstimate: `${Math.floor(Math.random() * 30) + 10} mins`,
          creator: "OSSLT Teacher",
          savedCount: Math.floor(Math.random() * 20),
        };

        setPracticeProblems(prev => [newPracticeProblem, ...prev]);
        toast.success("New practice content added!", {
          description: `"${newItem.title}" is now available`
        });
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter practice problems based on search term and filters
  const filteredProblems = practiceProblems.filter(problem => {
    // Search term filter
    const searchMatch = !searchTerm || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.description && problem.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Skip other filters if no search match
    if (!searchMatch) return false;
    
    // Skip type/difficulty filters if not provided
    if (!filters) return true;
    
    // Question type filter
    const typeMatch = (
      (problem.type === "Multiple Choice" && filters.questionTypes.multipleChoice) ||
      (problem.type === "Short Answer" && filters.questionTypes.shortAnswer) ||
      (problem.type === "Paragraph" && filters.questionTypes.paragraph) ||
      (problem.type === "Matching" && filters.questionTypes.matching)
    );
    
    // Difficulty filter
    const difficultyMatch = (
      (problem.difficulty === "Easy" && filters.difficulty.easy) ||
      (problem.difficulty === "Medium" && filters.difficulty.medium) ||
      (problem.difficulty === "Hard" && filters.difficulty.hard)
    );
    
    return typeMatch && difficultyMatch;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2 text-red-600">{error}</h3>
        <p className="text-muted-foreground mb-4">
          Please try again later or contact support if the problem persists.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-osslt-purple text-white rounded-md hover:bg-osslt-dark-purple"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // If we have no data from Supabase, use sample data
  const dataToDisplay = practiceProblems.length === 0 && !error ? samplePracticeProblems : filteredProblems;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dataToDisplay.length > 0 ? (
        dataToDisplay.map((problem) => (
          <PracticeCard
            key={problem.id}
            id={problem.id}
            title={problem.title}
            description={problem.description || ""}
            type={problem.type}
            difficulty={problem.difficulty}
            timeEstimate={problem.timeEstimate}
            creator={problem.creator}
            savedCount={problem.savedCount}
          />
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <h3 className="text-lg font-medium mb-2">No practice problems found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find more content
          </p>
        </div>
      )}
    </div>
  );
}
