
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, Loader2, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QuestionForm } from "./QuestionForm";

interface Question {
  text: string;
  type: string;
  options?: { id: string; text: string; }[];
  correctAnswer?: string;
}

export function UploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setDescription("");
    setQuestionType("");
    setDifficulty("");
    setUploadProgress(0);
    setUploadStatus("idle");
    setFile(null);
    setQuestions([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleAddQuestion = (question: Question) => {
    setQuestions([...questions, question]);
    toast.success("Question added successfully");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!file || !title || !questionType || questions.length === 0) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields and add at least one question."
      });
      return;
    }

    setIsSubmitting(true);
    setUploadStatus("uploading");
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadProgress(10);
      
      // Check if storage bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'practice-materials')) {
        await supabase.storage.createBucket('practice-materials', {
          public: true
        });
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('practice-materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      
      setUploadProgress(30);

      const { data: { publicUrl } } = supabase.storage
        .from('practice-materials')
        .getPublicUrl(filePath);

      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert([
          {
            title,
            description,
            file_url: publicUrl,
          },
        ])
        .select()
        .single();

      if (documentError) throw documentError;

      setUploadProgress(50);

      const { data: practiceData, error: practiceError } = await supabase
        .from('practice_content')
        .insert([
          {
            title,
            description,
            document_id: documentData.id,
            question_type: questionType,
            difficulty,
            time_estimate: '15 mins',
          },
        ])
        .select()
        .single();

      if (practiceError) throw practiceError;

      setUploadProgress(75);

      if (questions.length > 0) {
        const questionsToInsert = questions.map(q => ({
          practice_content_id: practiceData.id,
          question_text: q.text,
          question_type: q.type,
          options: q.options ? q.options : null,
          correct_answer: q.correctAnswer,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      setUploadProgress(100);
      setUploadStatus("success");
      toast.success("Practice content uploaded successfully!", {
        description: "Your content is now available in the library."
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus("error");
      toast.error("Failed to upload content", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-osslt-purple hover:bg-osslt-dark-purple transition-colors duration-300 transform hover:scale-105">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Practice Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
        <DialogHeader>
          <DialogTitle>Upload Practice Content</DialogTitle>
          <DialogDescription>
            Create new practice materials for OSSLT preparation.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what students will practice"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionType">Question Type</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger id="questionType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="matching">Matching</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="file">Upload Reading Passage or PDF</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-osslt-purple hover:bg-osslt-purple/5">
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop or click to upload
                </p>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById("file")?.click()}
                  className="mt-2 transition-all duration-200 hover:bg-osslt-purple/10"
                >
                  Select File
                </Button>
                {file && (
                  <div className="mt-4 flex items-center gap-2 bg-muted p-2 rounded-md w-full animate-fade-in">
                    <div className="w-full overflow-hidden">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setFile(null)}
                      className="h-8 w-8 hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4 animate-fade-in">
            {uploadStatus === "idle" && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                    <span>Added Questions ({questions.length})</span>
                    {questions.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        At least one question is required
                      </span>
                    )}
                  </h3>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {questions.map((q, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md mb-2 animate-fade-in">
                        <p className="font-medium">{q.text}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-muted-foreground">Type: {q.type}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 hover:bg-red-100 hover:text-red-600 transition-colors"
                            onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <div className="p-4 text-center border border-dashed rounded-md">
                        <p className="text-muted-foreground">No questions added yet</p>
                      </div>
                    )}
                  </div>
                </div>
                <QuestionForm onQuestionAdd={handleAddQuestion} />
              </>
            )}
            
            {uploadStatus === "uploading" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-osslt-purple" />
                </div>
                <p className="text-center text-sm">Uploading your content...</p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-center text-xs text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
            
            {uploadStatus === "success" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3 animate-scale-in">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="text-center font-medium">Upload Complete!</p>
                <p className="text-center text-sm text-muted-foreground">
                  Your practice content has been successfully uploaded and is now available in the library.
                </p>
              </div>
            )}
            
            {uploadStatus === "error" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <p className="text-center font-medium">Upload Failed</p>
                <p className="text-center text-sm text-muted-foreground">
                  There was an error uploading your content. Please try again.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {step > 1 && uploadStatus === "idle" && (
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              className="transition-all duration-200 hover:bg-gray-100"
            >
              Back
            </Button>
          )}
          
          {step < 3 && (
            <Button 
              onClick={handleNextStep} 
              disabled={
                (step === 1 && (!title || !description || !questionType || !difficulty)) ||
                (step === 2 && !file)
              }
              className="bg-osslt-purple hover:bg-osslt-dark-purple ml-auto transition-all duration-200"
            >
              Next
            </Button>
          )}
          
          {step === 3 && uploadStatus === "idle" && (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || questions.length === 0}
              className="bg-osslt-purple hover:bg-osslt-dark-purple ml-auto transition-all duration-200"
            >
              Submit
            </Button>
          )}
          
          {uploadStatus === "success" && (
            <Button 
              onClick={handleClose} 
              className="ml-auto transition-all duration-200 hover:bg-gray-100"
            >
              Close
            </Button>
          )}
          
          {uploadStatus === "error" && (
            <Button 
              onClick={() => setUploadStatus("idle")} 
              className="ml-auto transition-all duration-200 hover:bg-gray-100"
            >
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
