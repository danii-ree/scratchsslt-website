
import { PracticeCard } from "@/components/PracticeCard";

// Sample data for practice problems
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
  // Filter practice problems based on search term and filters
  const filteredProblems = samplePracticeProblems.filter(problem => {
    // Search term filter
    const searchMatch = !searchTerm || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProblems.map((problem) => (
        <PracticeCard
          key={problem.id}
          id={problem.id}
          title={problem.title}
          description={problem.description}
          type={problem.type}
          difficulty={problem.difficulty}
          timeEstimate={problem.timeEstimate}
          creator={problem.creator}
          savedCount={problem.savedCount}
        />
      ))}
    </div>
  );
}
