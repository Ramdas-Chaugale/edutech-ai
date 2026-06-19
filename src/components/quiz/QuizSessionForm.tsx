"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { toast } from "sonner";

export default function QuizSessionForm({ quiz }: { quiz: any }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const currentQuestion = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  const handleSelect = (optionId: string) => {
    if (result) return; // Disable selection in review mode
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit assessment");

      const data = await res.json();
      setResult(data);
      toast.success(`Assessment completed! Your score: ${Math.round(data.score)}%`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500">
        <Card className="bg-purple-600 text-white border-none shadow-2xl shadow-purple-500/20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Your Score: {Math.round(result.score)}%</h2>
            <p className="text-purple-100 max-w-xs mx-auto">Great effort! Review your answers and AI feedback below.</p>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              onClick={() => router.push("/student")}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>

        {quiz.questions.map((q: any, i: number) => {
          const selectedOptionId = answers[q.id];
          const correctOption = q.options.find((o: any) => o.isCorrect);
          const isCorrect = selectedOptionId === correctOption?.id;

          return (
            <Card key={q.id} className="bg-white/5 border-white/5 overflow-hidden">
               <div className={cn("h-1", isCorrect ? "bg-green-500" : "bg-red-500")} />
               <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-medium">{i + 1}. {q.content}</h3>
                    <Badge variant="outline" className={cn(
                      "flex-shrink-0 capitalize",
                      isCorrect ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-red-500/50 text-red-400 bg-red-500/10"
                    )}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt: any) => (
                      <div 
                        key={opt.id}
                        className={cn(
                          "p-3 rounded-lg border text-sm",
                          opt.isCorrect ? "bg-green-500/10 border-green-500/30 text-green-400" : 
                          (opt.id === selectedOptionId ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-transparent text-gray-400")
                        )}
                      >
                        {opt.content} {opt.isCorrect && " (Correct Answer)"}
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold text-yellow-500 uppercase flex items-center gap-2">
                       <BrainCircuit className="w-3 h-3" /> AI Solution & Explanation
                    </span>
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                      "{q.explanation || "No explanation provided for this question."}"
                    </p>
                  </div>
               </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-medium text-gray-500 uppercase tracking-tighter">
          <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-white/5" />
      </div>

      <Card className="bg-white/5 border-white/5 min-h-[400px] flex flex-col">
        <CardContent className="p-8 flex-grow">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold leading-relaxed">
              {currentQuestion.content}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                    answers[currentQuestion.id] === option.id
                      ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                      : "bg-white/5 border-white/5 hover:bg-white/[0.08] text-gray-300"
                  )}
                >
                  <span className="font-medium">{option.content}</span>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    answers[currentQuestion.id] === option.id
                      ? "border-purple-400 bg-purple-400"
                      : "border-white/10"
                  )}>
                    {answers[currentQuestion.id] === option.id && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="p-6 border-t border-white/5 flex justify-between bg-white/[0.02]">
          <Button
            variant="ghost"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Previous
          </Button>

          {currentIdx === quiz.questions.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < quiz.questions.length}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8"
            >
              Finish Assessment <Send className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              disabled={!answers[currentQuestion.id]}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              Next Question <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
      
      <div className="flex justify-center">
        <div className="flex gap-2">
          {quiz.questions.map((_: any, i: number) => (
            <div 
              key={i} 
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === currentIdx ? "bg-purple-500 scale-125" : (answers[quiz.questions[i].id] ? "bg-gray-400" : "bg-white/10")
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
