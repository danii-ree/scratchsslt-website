import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReadingPassageSection } from "./ReadingPassageSection";
import { QuestionSection } from "./QuestionSection";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

interface PracticeContentSectionProps {
  practiceId: string;
}

export function PracticeContentSection({ practiceId }: PracticeContentSectionProps) {
  const [practiceContent, setPracticeContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("reading");

  useEffect(() => {
    const fetchPracticeContent = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('practice_content')
          .select('*')
          .eq('id', practiceId)
          .single();

        if (fetchError) throw fetchError;

        setPracticeContent(data);
      } catch (err) {
        console.error("Error fetching practice content:", err);
        setError("Failed to load practice content");
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeContent();
  }, [practiceId]);

  if (loading) {
    return (
      <div className="container py-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !practiceContent) {
    return (
      <div className="container py-6 flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Content Not Available</h3>
        <p className="text-muted-foreground">{error || "This practice content cannot be loaded."}</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{practiceContent.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="capitalize">{practiceContent.difficulty}</span>
            <span>•</span>
            <span>{practiceContent.time_estimate}</span>
            <span>•</span>
            <span className="capitalize">{practiceContent.question_type.replace('-', ' ')}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reading">Reading Passage</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="mt-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                  {practiceContent.description}
                </div>
                {practiceContent.image_url && (
                  <div className="mt-6">
                    <img 
                      src={practiceContent.image_url} 
                      alt="Passage illustration" 
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <QuestionSection practiceContentId={practiceId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 