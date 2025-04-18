
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

// Sample questions for the story
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

export function QuestionSection() {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, {correct: boolean, message: string}>>({});

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
    setSubmitted(true);
    let totalScore = 0;
    const newFeedback: Record<string, {correct: boolean, message: string}> = {};

    sampleQuestions.forEach(question => {
      const answer = answers[question.id];
      
      switch(question.type) {
        case "multiple-choice":
          const mcCorrect = answer === question.correctAnswer;
          totalScore += mcCorrect ? question.points : 0;
          newFeedback[question.id] = {
            correct: mcCorrect,
            message: mcCorrect ? "Correct!" : `The correct answer is: ${question.correctAnswer}`
          };
          break;
          
        case "short-answer":
          // Simple contains check for short answer - in real app would use more sophisticated comparison
          const saCorrect = answer && question.correctAnswer.toLowerCase().includes(answer.toLowerCase());
          totalScore += saCorrect ? question.points : 0;
          newFeedback[question.id] = {
            correct: saCorrect,
            message: saCorrect ? "Good answer!" : `A model answer would be: ${question.correctAnswer}`
          };
          break;
          
        case "paragraph":
          // For paragraph questions, we'd normally need human grading or advanced NLP
          // For this demo, we'll just check if they wrote something substantial
          const wordCount = answer ? answer.trim().split(/\s+/).length : 0;
          const paragraphScore = wordCount >= 20 ? question.points : (wordCount >= 10 ? Math.floor(question.points / 2) : 0);
          totalScore += paragraphScore;
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
          newFeedback[question.id] = {
            correct: correctMatches === question.items.length,
            message: `You matched ${correctMatches} out of ${question.items.length} items correctly.`
          };
          break;
      }
    });
    
    setScore(totalScore);
    setFeedback(newFeedback);
  };

  const totalPoints = sampleQuestions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto">
        {submitted && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Your Score: {score}/{totalPoints}</span>
                {score === totalPoints ? (
                  <CheckCircle2 className="text-green-500" />
                ) : score >= totalPoints / 2 ? (
                  <AlertCircle className="text-yellow-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={cn(
                    "h-2.5 rounded-full", 
                    score === totalPoints 
                      ? "bg-green-500" 
                      : score >= totalPoints / 2 
                        ? "bg-yellow-500" 
                        : "bg-red-500"
                  )}
                  style={{ width: `${(score / totalPoints) * 100}%` }}
                ></div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {score === totalPoints 
                  ? "Excellent work! You've mastered this exercise." 
                  : score >= totalPoints / 2 
                    ? "Good effort! Review the feedback to improve further." 
                    : "Review the feedback carefully and try again to improve your score."}
              </p>
            </CardContent>
          </Card>
        )}

        {sampleQuestions.map((question, index) => (
          <div key={question.id} className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{index + 1}. {question.question}</h3>
              <span className="text-sm text-muted-foreground">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
            </div>
            
            {question.type === "multiple-choice" && (
              <div className="mt-4">
                <RadioGroup 
                  value={answers[question.id]} 
                  onValueChange={(value) => handleMultipleChoiceChange(question.id, value)}
                  disabled={submitted}
                >
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label 
                        htmlFor={`${question.id}-${option}`}
                        className={cn(
                          submitted && option === question.correctAnswer && "text-green-600 font-medium"
                        )}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "mt-2 p-2 text-sm rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
            
            {question.type === "short-answer" && (
              <div className="mt-4">
                <Input
                  value={answers[question.id] || ""}
                  onChange={(e) => handleShortAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer"
                  maxLength={question.wordLimit ? question.wordLimit * 10 : undefined}
                  disabled={submitted}
                />
                {question.wordLimit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum {question.wordLimit} words
                  </p>
                )}
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "mt-2 p-2 text-sm rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
            
            {question.type === "paragraph" && (
              <div className="mt-4">
                <Textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleParagraphChange(question.id, e.target.value)}
                  placeholder="Write your answer here"
                  rows={4}
                  disabled={submitted}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Suggested word limit: {question.wordLimit} words
                </p>
                {question.rubric && (
                  <div className="mt-2 p-2 bg-blue-50 text-blue-700 text-xs rounded">
                    <p className="font-semibold">Rubric:</p>
                    <p>{question.rubric}</p>
                  </div>
                )}
                {submitted && feedback[question.id] && (
                  <div className={cn(
                    "mt-2 p-2 text-sm rounded",
                    feedback[question.id].correct ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  )}>
                    {feedback[question.id].message}
                  </div>
                )}
              </div>
            )}
            
            {question.type === "matching" && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {question.items.map((item, itemIndex) => (
                    <div key={`left-${itemIndex}`} className="p-2 border rounded bg-gray-50">
                      {item.left}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {question.items.map((item, itemIndex) => (
                    <div key={`right-${itemIndex}`}>
                      <select
                        className="w-full p-2 border rounded"
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
                    "col-span-2 mt-2 p-2 text-sm rounded",
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
            className="px-8 py-2 bg-osslt-purple hover:bg-osslt-dark-purple"
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
            className="px-8 py-2"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
