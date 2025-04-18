
import { useLocation, useParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { PDFViewer } from "@/components/PDFViewer";
import { QuestionSection } from "@/components/QuestionSection";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PracticeDetail = () => {
  const location = useLocation();
  const { id } = useParams();

  const handleSave = () => {
    toast.success("Practice saved to your library!", {
      description: "You can access this later from your saved items."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {
      description: "You can now share this practice problem with others."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="outline" size="icon" asChild className="mr-4">
                <Link to="/practice">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-osslt-dark-gray">The Curious Case of the Night Sky</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Multiple Choice</span>
            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Short Answer</span>
            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">Paragraph</span>
            <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">Matching</span>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Reading Comprehension</span>
          </div>
          
          <p className="text-gray-600 mb-8">
            Read the short story below, then answer the questions that follow. This practice set includes 
            multiple choice, short answer, paragraph writing, and matching questions.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden h-[600px]">
                <PDFViewer />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Questions</h2>
              <div className="bg-white rounded-lg shadow p-6 overflow-y-auto h-[600px]">
                <QuestionSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeDetail;
