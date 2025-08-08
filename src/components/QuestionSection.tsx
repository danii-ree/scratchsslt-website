import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/auth-context";

interface QuestionSectionProps {
  practiceContentId: string;
  questionType?: string;
  difficulty?: string;
}

interface BaseQuestion {
  id: string;
  type: string;
  question: string;
  points: number;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: "short-answer";
  correctAnswer: string;
  wordLimit?: number;
}

interface ParagraphQuestion extends BaseQuestion {
  type: "paragraph";
  wordLimit: number;
  rubric: string;
}

interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  items: {
    left: string;
    right: string;
  }[];
}

type Question = MultipleChoiceQuestion | ShortAnswerQuestion | ParagraphQuestion | MatchingQuestion;

// Sample questions for the demo
const sampleQuestions: Question[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "What was unusual about the night that Maria observed from her balcony?",
    options: [
      "The moon was exceptionally bright",
      "She could see stars despite being in the city",
      "There was a meteor shower happening",
      "The sky was completely cloudless"
    ],
    correctAnswer: "She could see stars despite being in the city",
    points: 1
  },
  {
    id: "q2",
    type: "multiple-choice",
    question: "What explanation did Maria come up with for the unusual visibility of stars?",
    options: [
      "Seasonal changes affecting atmospheric conditions",
      "A recent environmental cleanup initiative",
      "A power outage in the city",
      "Special astronomical conditions that night"
    ],
    correctAnswer: "A power outage in the city",
    points: 1
  },
  {
    id: "q3",
    type: "short-answer",
    question: "How did the mysterious object in the sky differ from an airplane or shooting star?",
    correctAnswer: "It moved too slowly for a shooting star and followed too precise a path to be an airplane.",
    wordLimit: 30,
    points: 2
  },
  {
    id: "q4",
    type: "paragraph",
    question: "Explain what evidence in the text suggests that the object Maria saw was not from Earth. Support your answer with details from the passage.",
    wordLimit: 100,
    rubric: "Responses should identify at least two specific details from the text that suggest the object was extraterrestrial or advanced beyond current human technology.",
    points: 4
  },
  {
    id: "q5",
    type: "matching",
    question: "Match each description with the corresponding element from the story.",
    items: [
      { left: "Pulsating glow", right: "The craft's exterior light" },
      { left: "Musical note held at perfect pitch", right: "The humming sound" },
      { left: "Warm and golden", right: "Light from inside the craft" },
      { left: "Red, green, blue, yellow", right: "Sequence of perimeter lights" }
    ],
    points: 2
  }
];

export function QuestionSection({ practiceContentId, questionType, difficulty }: QuestionSectionProps) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, {correct: boolean, message: string}>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionActivityId, setSessionActivityId] = useState<string | null>(null);

  const startSessionTracking = async () => {
    if (!user) return;
    
    try {
      const startTime = Date.now();
      setSessionStartTime(startTime);
      
      // Record session start
      const { data, error } = await supabase
        .from('user_activity')
        .insert([
          {
            user_id: user.id,
            practice_content_id: practiceContentId,
            activity_type: 'started',
            started_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setSessionActivityId(data.id);
    } catch (err) {
      console.error('Error starting session tracking:', err);
    }
  };

  const completeSessionTracking = async (finalScore: number, totalQuestions: number, correctAnswers: number) => {
    if (!user || !sessionActivityId) return;
    
    try {
      const endTime = Date.now();
      const timeSpentSeconds = sessionStartTime ? Math.floor((endTime - sessionStartTime) / 1000) : 0;
      
      // Update session with completion data
      await supabase
        .from('user_activity')
        .update({
          activity_type: 'completed',
          score: finalScore,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_spent_seconds: timeSpentSeconds,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionActivityId);
    } catch (err) {
      console.error('Error completing session tracking:', err);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('questions')
          .select('*')
          .eq('practice_content_id', practiceContentId);

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          // Transform database questions to match our Question types
          const formattedQuestions: Question[] = data.map(q => {
            const baseQuestion = {
              id: q.id,
              question: q.question_text,
              type: q.question_type as any,
              points: 1,  // Default points
            };

            switch (q.question_type) {
              case 'multiple-choice':
                // Handle options - they might be stored as JSON array or string array
                let options: string[] = [];
                if (q.options) {
                  if (Array.isArray(q.options)) {
                    options = q.options.map(opt => String(opt));
                  } else if (typeof q.options === 'string') {
                    try {
                      const parsed = JSON.parse(q.options);
                      options = Array.isArray(parsed) ? parsed.map(opt => String(opt)) : [];
                    } catch {
                      options = [];
                    }
                  }
                }
                
                return {
                  ...baseQuestion,
                  type: 'multiple-choice' as const,
                  options: options,
                  correctAnswer: q.correct_answer || ''
                };
              
              case 'short-answer':
                return {
                  ...baseQuestion,
                  type: 'short-answer' as const,
                  correctAnswer: q.correct_answer || '',
                  wordLimit: 30
                };
              
              case 'paragraph':
                return {
                  ...baseQuestion,
                  type: 'paragraph' as const,
                  wordLimit: 100,
                  rubric: 'Provide a well-structured response.'
                };
              
              case 'matching':
                // Handle matching items - they might be stored as JSON array of objects
                let items: { left: string; right: string }[] = [];
                if (q.options) {
                  if (Array.isArray(q.options)) {
                    items = q.options.map((item: any) => ({
                      left: String(item.left || item[0] || ''),
                      right: String(item.right || item[1] || '')
                    }));
                  } else if (typeof q.options === 'string') {
                    try {
                      const parsed = JSON.parse(q.options);
                      if (Array.isArray(parsed)) {
                        items = parsed.map((item: any) => ({
                          left: String(item.left || item[0] || ''),
                          right: String(item.right || item[1] || '')
                        }));
                      }
                    } catch {
                      items = [];
                    }
                  }
                }
                
                return {
                  ...baseQuestion,
                  type: 'matching' as const,
                  items: items
                };
              
              default:
                return baseQuestion as Question;
            }
          });
          
          console.log('Formatted questions:', formattedQuestions);
          setQuestions(formattedQuestions);
          
          // Start session tracking when questions are loaded
          await startSessionTracking();
        } else {
          // Fallback to sample questions if no questions found
          setQuestions(sampleQuestions);
          await startSessionTracking();
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
        // Fallback to sample questions on error
        setQuestions(sampleQuestions);
        await startSessionTracking();
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [practiceContentId, user]);

  const handleMultipleChoiceChange = (questionId: string, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  };

  const handleShortAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  };

  const handleParagraphChange = (questionId: string, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  };

  const handleMatchingChange = (questionId: string, itemIndex: number, value: string) => {
    const currentMatches = answers[questionId] || [];
    const newMatches = [...currentMatches];
    newMatches[itemIndex] = value;
    setAnswers(prev => ({...prev, [questionId]: newMatches}));
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    setSubmitted(true);
    let totalScore = 0;
    let totalQuestions = questions.length;
    let correctAnswers = 0;
    const newFeedback: Record<string, {correct: boolean, message: string}> = {};

    questions.forEach((question) => {
      const answer = answers[question.id];
      
      switch (question.type) {
        case "multiple-choice":
          const isCorrect = answer === question.correctAnswer;
          totalScore += isCorrect ? question.points : 0;
          correctAnswers += isCorrect ? 1 : 0;
          newFeedback[question.id] = {
            correct: isCorrect,
            message: isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${question.correctAnswer}`
          };
          break;
          
        case "short-answer":
          // For short answer, we'll consider it correct if it matches exactly (case-insensitive)
          const isShortAnswerCorrect = answer && answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          totalScore += isShortAnswerCorrect ? question.points : 0;
          correctAnswers += isShortAnswerCorrect ? 1 : 0;
          newFeedback[question.id] = {
            correct: isShortAnswerCorrect,
            message: isShortAnswerCorrect ? "Correct!" : `Incorrect. The correct answer is: ${question.correctAnswer}`
          };
          break;
          
        case "paragraph":
          // For paragraph questions, we'd normally need human grading or advanced NLP
          // For this demo, we'll just check if they wrote something substantial
          const wordCount = answer ? answer.trim().split(/\s+/).length : 0;
          const paragraphScore = wordCount >= 20 ? question.points : (wordCount >= 10 ? Math.floor(question.points / 2) : 0);
          totalScore += paragraphScore;
          correctAnswers += paragraphScore === question.points ? 1 : 0;
          newFeedback[question.id] = {
            correct: paragraphScore === question.points,
            message: `You wrote ${wordCount} words. ${paragraphScore === question.points ? 
              "Good detailed response!" : 
              "Consider adding more specific details from the text to support your answer."}`
          };
          break;
          
        case "matching":
          // Check how many matches are correct
          const matches = answer || [];
          let correctMatches = 0;
          question.items.forEach((item, index) => {
            if (matches[index] === item.right) correctMatches++;
          });
          const matchingScore = Math.floor((correctMatches / question.items.length) * question.points);
          totalScore += matchingScore;
          correctAnswers += correctMatches === question.items.length ? 1 : 0;
          newFeedback[question.id] = {
            correct: correctMatches === question.items.length,
            message: `You matched ${correctMatches} out of ${question.items.length} items correctly.`
          };
          break;
      }
    });
    
    setScore(totalScore);
    setFeedback(newFeedback);

    // Complete session tracking
    const finalScore = Math.round((totalScore / questions.reduce((sum, q) => sum + q.points, 0)) * 100);
    completeSessionTracking(finalScore, totalQuestions, correctAnswers);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6">
        <Loader2 className="h-6 w-6 animate-spin text-osslt-purple mb-2" />
        <p className="text-xs text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6">
        <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
        <p className="text-xs text-red-500">{error}</p>
        <p className="text-xs text-muted-foreground mt-2">Showing sample questions instead</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6">
        <AlertCircle className="h-6 w-6 text-yellow-500 mb-2" />
        <p className="text-xs text-muted-foreground">No questions found for this practice content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-w-3xl mx-auto">
        {submitted && (
          <Card className="mb-4">
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <span>Your Score: {score}/{totalPoints}</span>
                {score === totalPoints ? (
                  <CheckCircle2 className="text-green-500 h-4 w-4" />
                ) : score >= totalPoints / 2 ? (
                  <AlertCircle className="text-yellow-500 h-4 w-4" />
                ) : (
                  <XCircle className="text-red-500 h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full", 
                    score === totalPoints 
                      ? "bg-green-500" 
                      : score >= totalPoints / 2 
                        ? "bg-yellow-500" 
                        : "bg-red-500"
                  )}
                  style={{ width: `${(score / totalPoints) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                {score === totalPoints 
                  ? "Excellent work! You've mastered this exercise." 
                  : score >= totalPoints / 2 
                    ? "Good effort! Review the feedback to improve further." 
                    : "Review the feedback carefully and try again to improve your score."}
              </p>
            </CardContent>
          </Card>
        )}

        {questions.map((question, index) => (
          <div key={question.id} className="mb-4 p-3 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between mb-1">
              <h3 className="text-sm font-semibold">{index + 1}. {question.question}</h3>
              <span className="text-xs text-muted-foreground">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            
            {question.type === "multiple-choice" && (
              <div className="mt-2">
                <RadioGroup 
                  value={answers[question.id]} 
                  onValueChange={(value) => handleMultipleChoiceChange(question.id, value)}
                  disabled={submitted}
                  className="space-y-1"
                >
                  {question.options.map((option, optionIndex) => {
                    // Handle both string and object options
                    const optionText = typeof option === 'string' ? option : 
                      (option && typeof option === 'object' && 'text' in (option as any) ? (option as any).text : String(option));
                    const optionValue = optionText;
                    
                    console.log(`Option ${optionIndex}:`, option, 'Text:', optionText);
                    
                    return (
                      <div key={`${question.id}-option-${optionIndex}`} className="flex items-center space-x-2 mb-1">
                        <RadioGroupItem value={optionValue} id={`${question.id}-${optionIndex}`} className="h-3 w-3" />
                        <Label 
                          htmlFor={`${question.id}-${optionIndex}`}
                          className={cn(
                            "text-xs",
                            submitted && optionValue === question.correctAnswer && "text-green-600 font-medium"
                          )}
                        >
                          {optionText}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "mt-2 p-1.5 text-xs rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
            
            {question.type === "short-answer" && (
              <div className="mt-2">
                <Input
                  value={answers[question.id] || ""}
                  onChange={(e) => handleShortAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer"
                  maxLength={question.wordLimit ? question.wordLimit * 10 : undefined}
                  disabled={submitted}
                  className="text-xs h-8"
                />
                {question.wordLimit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum {question.wordLimit} words
                  </p>
                )}
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "mt-2 p-1.5 text-xs rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
            
            {question.type === "paragraph" && (
              <div className="mt-2">
                <Textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleParagraphChange(question.id, e.target.value)}
                  placeholder="Write your answer here"
                  rows={3}
                  disabled={submitted}
                  className="text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Suggested word limit: {question.wordLimit} words
                </p>
                {question.rubric && (
                  <div className="mt-1 p-1.5 bg-blue-50 text-blue-700 text-xs rounded">
                    <p className="font-semibold text-xs">Rubric:</p>
                    <p className="text-xs">{question.rubric}</p>
                  </div>
                )}
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "mt-2 p-1.5 text-xs rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
            
            {question.type === "matching" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  {question.items.map((item, itemIndex) => (
                    <div key={`left-${itemIndex}`} className="p-1.5 border rounded bg-gray-50 text-xs">
                      {item.left}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {question.items.map((item, itemIndex) => (
                    <div key={`right-${itemIndex}`}>
                      <select
                        className="w-full p-1 border rounded text-xs h-7"
                        value={answers[question.id]?.[itemIndex] || ""}
                        onChange={(e) => handleMatchingChange(question.id, itemIndex, e.target.value)}
                        disabled={submitted}
                      >
                        <option value="">Select a match</option>
                        {question.items.map((opt, optIndex) => (
                          <option key={optIndex} value={opt.right}>
                            {opt.right}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "col-span-2 mt-2 p-1.5 text-xs rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!submitted ? (
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit} 
            className="px-4 py-1 text-sm h-8 bg-osslt-purple hover:bg-osslt-purple/90"
          >
            Submit Answers
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button 
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
              setScore(0);
              setFeedback({});
            }}
            variant="outline"
            className="px-4 py-1 text-sm h-8"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
