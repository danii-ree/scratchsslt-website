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
import { UploadCloud, Loader2, Check, X, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QuestionForm } from "./QuestionForm";
import { useAuth } from "@/contexts/auth-context";

interface Question {
  text: string;
  type: string;
  options?: { id: string; text: string; }[];
  matchingPairs?: { id: string; left: string; right: string; }[];
  correctAnswer?: string;
}

export function UploadModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [passage, setPassage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)"
        });
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Please select an image smaller than 5MB"
        });
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setPassage("");
    setDifficulty("");
    setUploadProgress(0);
    setUploadStatus("idle");
    setImageFile(null);
    setImagePreview(null);
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      // Generate a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `passage-images/${fileName}`;

      // First, try to create the bucket if it doesn't exist
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.find(bucket => bucket.name === 'passage-images');
        
        if (!bucketExists) {
          const { error: bucketError } = await supabase.storage.createBucket('passage-images', {
            public: true,
            allowedMimeTypes: ['image/*'],
            fileSizeLimit: 5242880 // 5MB limit
          });
          
          if (bucketError) {
            console.error('Bucket creation error:', bucketError);
            // Continue anyway, the bucket might already exist
          }
        }
      } catch (bucketError) {
        console.error('Bucket check error:', bucketError);
        // Continue with upload attempt
      }

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('passage-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('passage-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error("Failed to upload image", {
        description: error instanceof Error ? error.message : "The passage will be saved without the image."
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!title || !passage || !difficulty || questions.length === 0) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields and add at least one question."
      });
      return;
    }

    setIsSubmitting(true);
    setUploadStatus("uploading");
    
    try {
      setUploadProgress(10);

      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
        setUploadProgress(30);
      }

      // Create practice content record directly (no document needed)
      const { data: practiceData, error: practiceError } = await supabase
        .from('practice_content')
        .insert([
          {
            title,
            description: passage, // Store the passage text in description field
            difficulty,
            time_estimate: '15 mins',
            question_type: 'multiple-choice',
            document_id: null, // No document needed for text-based content
            image_url: imageUrl, // Add image URL if we have one
          },
        ])
        .select()
        .single();

      if (practiceError) {
        console.error('Practice content error:', practiceError);
        throw practiceError;
      }

      setUploadProgress(60);

      // Insert questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map(q => {
          let options = null;
          let correct_answer = q.correctAnswer;

          // Transform options based on question type
          if (q.type === 'multiple-choice' && q.options) {
            // Convert from {id, text} format to array of strings
            options = q.options.map(opt => opt.text);
          } else if (q.type === 'matching' && q.matchingPairs) {
            // Convert matching pairs to the format expected by the database
            options = q.matchingPairs.map(pair => ({
              left: pair.left,
              right: pair.right
            }));
          }

          return {
            practice_content_id: practiceData.id,
            question_text: q.text,
            question_type: q.type,
            options: options,
            correct_answer: correct_answer,
          };
        });

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) {
          console.error('Questions error:', questionsError);
          throw questionsError;
        }
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
        description: error instanceof Error ? error.message : "Please try again later."
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
              <Label htmlFor="title">Title/Header</Label>
              <Input
                id="title"
                placeholder="Enter the title or header of the passage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passage">Reading Passage</Label>
              <Textarea
                id="passage"
                placeholder="Enter the full reading passage text here..."
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                rows={8}
                className="resize-none"
              />
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
        )}

        {step === 2 && (
          <div className="space-y-4 py-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="image">Passage Image (Optional)</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-osslt-purple hover:bg-osslt-purple/5">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Add an image to accompany the passage (optional)
                </p>
                <Input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById("image")?.click()}
                  className="mt-2 transition-all duration-200 hover:bg-osslt-purple/10"
                >
                  Select Image
                </Button>
                {imagePreview && (
                  <div className="mt-4 w-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-32 object-cover rounded-md"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="mt-2 h-8 hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove Image
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
                (step === 1 && (!title || !passage || !difficulty)) ||
                (step === 2 && false) // Step 2 is optional, so always allow next
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
