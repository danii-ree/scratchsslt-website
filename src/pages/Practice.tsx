
import { useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { PracticeGrid } from "@/components/PracticeGrid";
import { useState } from "react";

const Practice = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    questionTypes: {
      multipleChoice: true,
      shortAnswer: true,
      paragraph: true,
      matching: true,
    },
    difficulty: {
      easy: true,
      medium: true,
      hard: true,
    },
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-osslt-dark-gray mb-2">Practice Problems</h1>
            <p className="text-gray-600">
              Browse our collection of OSSLT practice problems created by teachers and students.
              Filter by question type, difficulty level, or search for specific topics.
            </p>
          </div>
          
          <SearchAndFilter 
            onSearch={handleSearch} 
            onFilterChange={handleFilterChange} 
          />
          
          <PracticeGrid 
            searchTerm={searchTerm}
            filters={filters}
          />
        </div>
      </main>
    </div>
  );
};

export default Practice;
