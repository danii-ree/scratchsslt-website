import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/components/UploadModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, Database, FileText, ListChecks, AlignLeft, SplitSquareVertical } from "lucide-react";
import { seedDemoData } from "@/utils/seedDemoData";
import { toast } from "sonner";

const Create = () => {
  const location = useLocation();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  
  const handleSeedDemoData = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    
    try {
      const result = await seedDemoData();
      if (result.success) {
        setSeedSuccess(true);
        toast.success("Demo data seeded successfully!");
      } else {
        toast.error("Failed to seed demo data");
      }
    } catch (error) {
      console.error("Error seeding demo data:", error);
      toast.error("Failed to seed demo data");
    } finally {
      setSeeding(false);
    }
  };

  const questionTypes = [
    {
      icon: <FileText className="h-6 w-6 text-osslt-purple" />,
      title: "Multiple Choice",
      description: "Test students' comprehension with multiple choice questions."
    },
    {
      icon: <ListChecks className="h-6 w-6 text-osslt-purple" />,
      title: "Short Answer",
      description: "Require brief written responses to targeted questions."
    },
    {
      icon: <AlignLeft className="h-6 w-6 text-osslt-purple" />,
      title: "Paragraph",
      description: "Students develop extended responses with paragraph answers."
    },
    {
      icon: <SplitSquareVertical className="h-6 w-6 text-osslt-purple" />,
      title: "Matching",
      description: "Create matching exercises to test associations and relationships."
    }
  ];

  return (
    <div className="container px-4 py-24 mx-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Create Resources</h1>
          <p className="text-gray-600">Add new practice content and materials to help students prepare for the OSSLT.</p>
        </div>
           
        <Tabs defaultValue="upload" className="w-full mb-10">
          
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Practice Content</CardTitle>
                <CardDescription>
                  Create a new practice set with reading passages and various question types.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mt-4">
                  <UploadModal />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seed Demo Data</CardTitle>
                <CardDescription>
                  Add sample practice problems to your database for demonstration purposes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 mt-4">
                  <p className="text-center text-gray-600 max-w-md">
                    Click the button below to create sample practice problems with various question types.
                    This is useful for testing and demonstration purposes.
                  </p>
                  
                  <Button 
                    onClick={handleSeedDemoData} 
                    disabled={seeding || seedSuccess}
                    className="min-w-[200px]"
                  >
                    {seeding ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding Data...</>
                    ) : seedSuccess ? (
                      <><CheckCircle2 className="mr-2 h-4 w-4" /> Data Seeded</>
                    ) : (
                      <><Database className="mr-2 h-4 w-4" /> Seed Demo Data</>
                    )}
                  </Button>
                  
                  {seedSuccess && (
                    <p className="text-green-600 text-sm text-center">
                      Demo data has been added successfully! You can now view the practice problems in the Practice section.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {questionTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {type.icon}
                  <CardTitle>{type.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>OSSLT Question Guidelines</CardTitle>
            <CardDescription>
              Tips for creating effective practice questions aligned with OSSLT standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Multiple Choice</h3>
                <p className="text-sm text-gray-600">Include 4 options with one correct answer. Make distractors plausible but clearly incorrect.</p>
              </div>
              <div>
                <h3 className="font-semibold">Short Answer</h3>
                <p className="text-sm text-gray-600">Questions should be answerable in 2-3 sentences. Provide clear criteria for acceptable answers.</p>
              </div>
              <div>
                <h3 className="font-semibold">Paragraph</h3>
                <p className="text-sm text-gray-600">Ask students to develop responses of 5-10 sentences. Include a clear rubric for evaluation.</p>
              </div>
              <div>
                <h3 className="font-semibold">Matching</h3>
                <p className="text-sm text-gray-600">Create 4-6 matching pairs with clear relationships. Avoid overly ambiguous connections.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Create;
