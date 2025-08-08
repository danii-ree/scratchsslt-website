import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PDFViewer } from "./PDFViewer";
import { QuestionSection } from "./QuestionSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PracticeContent {
  id: string;
  title: string;
  description: string;
  question_type: string;
  difficulty: string;
  time_estimate: number;
  document: {
    id: string;
    title: string;
    description: string;
    file_url: string;
  } | null;
}

export function PracticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [practiceContent, setPracticeContent] = useState<PracticeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPracticeContent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('practice_content')
          .select(`
            id,
            title,
            description,
            question_type,
            difficulty,
            time_estimate,
            document:documents (
              id,
              title,
              description,
              file_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        // Convert time_estimate to number
        const formattedData = {
          ...data,
          time_estimate: Number(data.time_estimate)
        };

        setPracticeContent(formattedData);
      } catch (err) {
        console.error("Error fetching practice content:", err);
        setError("Failed to load practice content");
        toast.error("Failed to load practice content", {
          description: "Please try refreshing the page"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeContent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !practiceContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || "Practice content not found"}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Practice
        </Button>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Difficulty: {practiceContent.difficulty}
          </span>
          <span className="text-sm text-muted-foreground">
            Estimated Time: {practiceContent.time_estimate} minutes
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-full">
          <h2 className="text-xl font-semibold mb-2">{practiceContent.document?.title || "Reading Passage"}</h2>
          <PDFViewer 
            documentId={practiceContent.document?.id}
            className="h-[calc(100%-2rem)]"
          />
        </div>
        <div className="h-full">
          <h2 className="text-xl font-semibold mb-2">Questions</h2>
          <QuestionSection 
            practiceContentId={practiceContent.id}
          />
        </div>
      </div>
    </div>
  );
} 