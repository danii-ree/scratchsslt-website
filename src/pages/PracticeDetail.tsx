import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2, AlertCircle, Loader2 } from "lucide-react";
import { QuestionSection } from "@/components/QuestionSection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PracticeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [practiceContent, setPracticeContent] = useState<any>(null);

  useEffect(() => {
    const fetchPracticeContent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("practice_content")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setPracticeContent(data);
      } catch (err) {
        console.error("Error fetching practice content:", err);
        setError("Failed to load practice content");
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeContent();
  }, [id]);

  const handleSave = () => {
    toast.success("Practice saved to your library!", {
      description: "You can access this later from your saved items."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {
      description: "Share this practice with others."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav currentPath={location.pathname} />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-osslt-purple" />
        </div>
      </div>
    );
  }

  if (error || !practiceContent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav currentPath={location.pathname} />
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Content Not Found</h3>
            <p className="text-muted-foreground mb-4">{error || "This practice content doesn't exist."}</p>
            <Button asChild>
              <Link to="/practice">Back to Practice</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {practiceContent.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="capitalize">{practiceContent.difficulty}</span>
                  <span>•</span>
                  <span>{practiceContent.time_estimate}</span>
                  <span>•</span>
                  <span className="capitalize">{practiceContent.question_type.replace('-', ' ')}</span>
                </div>
                {practiceContent.description && (
                  <p className="text-gray-700">{practiceContent.description.substring(0, 200)}...</p>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button variant="outline" onClick={handleSave}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border shadow-sm">
            {/* Reading Passage */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
              <div className="prose max-w-none">
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

            {/* Questions */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Questions</h2>
              <QuestionSection practiceContentId={id!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetail;