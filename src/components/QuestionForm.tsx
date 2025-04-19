
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Option {
  id: string;
  text: string;
}

interface QuestionFormProps {
  onQuestionAdd: (question: {
    text: string;
    type: string;
    options?: Option[];
    correctAnswer?: string;
  }) => void;
}

// Create a schema for question validation
const questionSchema = z.object({
  text: z.string().min(3, "Question text is required"),
  type: z.string().min(1, "Question type is required"),
  correctAnswer: z.string().optional(),
});

export function QuestionForm({ onQuestionAdd }: QuestionFormProps) {
  const [options, setOptions] = useState<Option[]>([
    { id: crypto.randomUUID(), text: "" },
    { id: crypto.randomUUID(), text: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // Initialize form
  const form = useForm<{
    text: string;
    type: string;
    correctAnswer: string;
  }>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      type: "",
      correctAnswer: "",
    },
  });

  const addOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), text: "" }]);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleSubmit = (values: z.infer<typeof questionSchema>) => {
    setLoading(true);
    
    onQuestionAdd({
      text: values.text,
      type: values.type,
      options: values.type === 'multiple-choice' ? options : undefined,
      correctAnswer: values.type !== 'paragraph' ? values.correctAnswer : undefined,
    });

    // Reset form
    form.reset({
      text: "",
      type: "",
      correctAnswer: "",
    });
    
    setOptions([
      { id: crypto.randomUUID(), text: "" },
      { id: crypto.randomUUID(), text: "" },
    ]);
    
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-fade-in">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your question"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Question Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset correctAnswer when changing question type
                  if (value === 'paragraph') {
                    form.setValue('correctAnswer', '');
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === 'multiple-choice' && (
          <div className="space-y-4 animate-fade-in">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {(form.watch("type") === 'multiple-choice' || form.watch("type") === 'short-answer') && (
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem className="space-y-2 animate-fade-in">
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter the correct answer"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Add Question"
          )}
        </Button>
      </form>
    </Form>
  );
}
