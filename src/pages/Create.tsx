
import { useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, ListChecks, AlignLeft, SplitSquareVertical } from "lucide-react";
import { UploadModal } from "@/components/UploadModal";

const Create = () => {
  const location = useLocation();

  const questionTypes = [
    {
      title: "Multiple Choice",
      description: "Create questions with a set of possible answers where only one is correct.",
      icon: ListChecks,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      title: "Short Answer",
      description: "Create questions that require brief written responses from students.",
      icon: FileText,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      title: "Paragraph",
      description: "Create prompts for extended written responses with detailed rubrics.",
      icon: AlignLeft,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200"
    },
    {
      title: "Matching",
      description: "Create activities where students match related items from two columns.",
      icon: SplitSquareVertical,
      color: "bg-pink-100 text-pink-800 border-pink-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-osslt-dark-gray mb-2">Create Practice Content</h1>
            <p className="text-gray-600">
              Create your own practice problems to help yourself and others prepare for the OSSLT.
              Choose from different question types or upload existing documents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {questionTypes.map((type, index) => (
              <Card key={index} className="overflow-hidden border-2 hover:shadow-md transition-all border-transparent hover:border-osslt-purple/30">
                <CardHeader className={`${type.color} border-b`}>
                  <div className="flex items-center">
                    <type.icon className="h-6 w-6 mr-2" />
                    <CardTitle>{type.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-base">
                    {type.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create {type.title}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-osslt-purple/10 to-osslt-light-purple/20 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Already have content?</h2>
            <p className="text-lg mb-6 max-w-lg mx-auto">
              Upload your existing documents and convert them into interactive practice problems.
            </p>
            <UploadModal />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
