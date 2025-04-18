
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Filter, Search } from "lucide-react";
import React from "react";

interface SearchAndFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: any) => void;
}

export function SearchAndFilter({ onSearch, onFilterChange }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [questionTypes, setQuestionTypes] = React.useState({
    multipleChoice: true,
    shortAnswer: true,
    paragraph: true,
    matching: true,
  });
  
  const [difficulty, setDifficulty] = React.useState({
    easy: true,
    medium: true,
    hard: true,
  });

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleQuestionTypeChange = (key: keyof typeof questionTypes) => {
    const updatedTypes = { ...questionTypes, [key]: !questionTypes[key] };
    setQuestionTypes(updatedTypes);
    onFilterChange({ questionTypes: updatedTypes, difficulty });
  };

  const handleDifficultyChange = (key: keyof typeof difficulty) => {
    const updatedDifficulty = { ...difficulty, [key]: !difficulty[key] };
    setDifficulty(updatedDifficulty);
    onFilterChange({ questionTypes, difficulty: updatedDifficulty });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search practice problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSearch} variant="secondary">
          Search
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Question Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={questionTypes.multipleChoice}
              onCheckedChange={() => handleQuestionTypeChange("multipleChoice")}
            >
              Multiple Choice
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={questionTypes.shortAnswer}
              onCheckedChange={() => handleQuestionTypeChange("shortAnswer")}
            >
              Short Answer
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={questionTypes.paragraph}
              onCheckedChange={() => handleQuestionTypeChange("paragraph")}
            >
              Paragraph
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={questionTypes.matching}
              onCheckedChange={() => handleQuestionTypeChange("matching")}
            >
              Matching
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuLabel className="mt-2">Difficulty</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={difficulty.easy}
              onCheckedChange={() => handleDifficultyChange("easy")}
            >
              Easy
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={difficulty.medium}
              onCheckedChange={() => handleDifficultyChange("medium")}
            >
              Medium
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={difficulty.hard}
              onCheckedChange={() => handleDifficultyChange("hard")}
            >
              Hard
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
