
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

export function QuestionForm({ onQuestionAdd }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: crypto.randomUUID(), text: "" },
    { id: crypto.randomUUID(), text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    onQuestionAdd({
      text: questionText,
      type: questionType,
      options: questionType === 'multiple-choice' ? options : undefined,
      correctAnswer: questionType !== 'paragraph' ? correctAnswer : undefined,
    });

    // Reset form
    setQuestionText("");
    setQuestionType("");
    setOptions([
      { id: crypto.randomUUID(), text: "" },
      { id: crypto.randomUUID(), text: "" },
    ]);
    setCorrectAnswer("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="questionType">Question Type</Label>
        <Select value={questionType} onValueChange={setQuestionType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
            <SelectItem value="short-answer">Short Answer</SelectItem>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="matching">Matching</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questionType === 'multiple-choice' && (
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

      {(questionType === 'multiple-choice' || questionType === 'short-answer') && (
        <div className="space-y-2 animate-fade-in">
          <Label htmlFor="correctAnswer">Correct Answer</Label>
          <Input
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            required
          />
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Add Question"
        )}
      </Button>
    </form>
  );
}
