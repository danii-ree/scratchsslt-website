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
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!file || !title || !questionType) return;

    setUploadStatus("uploading");
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Set initial progress
      setUploadProgress(10);
      
      // Upload to storage bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('practice-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Update progress after upload
      setUploadProgress(50);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('practice-materials')
        .getPublicUrl(filePath);

      // Create document record
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

      setUploadProgress(75);

      // Create practice content record
      const { data: practiceData, error: practiceError } = await supabase
        .from('practice_content')
        .insert([
          {
            title,
            description,
            document_id: documentData.id,
            question_type: questionType,
          },
        ])
        .select()
        .single();

      if (practiceError) throw practiceError;

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
        <Button variant="default" className="bg-osslt-purple hover:bg-osslt-dark-purple">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Practice Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Practice Content</DialogTitle>
          <DialogDescription>
            Create new practice materials for OSSLT preparation.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
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
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload Reading Passage or PDF</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
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
                  className="mt-2"
                >
                  Select File
                </Button>
                {file && (
                  <div className="mt-4 flex items-center gap-2 bg-muted p-2 rounded-md w-full">
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
                      className="h-8 w-8"
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
          <div className="space-y-4 py-4">
            {uploadStatus === "idle" && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ready to upload your practice content. Click submit to continue.
                </p>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3">
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
              <div className="space-y-4">
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
            <Button variant="outline" onClick={handlePrevStep}>
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
              className="bg-osslt-purple hover:bg-osslt-dark-purple ml-auto"
            >
              Next
            </Button>
          )}
          
          {step === 3 && uploadStatus === "idle" && (
            <Button onClick={handleSubmit} className="bg-osslt-purple hover:bg-osslt-dark-purple ml-auto">
              Submit
            </Button>
          )}
          
          {uploadStatus === "success" && (
            <Button onClick={handleClose} className="ml-auto">
              Close
            </Button>
          )}
          
          {uploadStatus === "error" && (
            <Button onClick={() => setUploadStatus("idle")} className="ml-auto">
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
