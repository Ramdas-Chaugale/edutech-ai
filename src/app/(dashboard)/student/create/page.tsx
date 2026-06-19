"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateQuizPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const quiz = await res.json();
      toast.success("Quiz generated successfully!");
      router.push(`/student/quizzes/${quiz.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-outfit">AI Quiz Generator</h1>
          <p className="text-gray-400">Specify your requirements and let our agents build the perfect assessment.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-white">Agentic Workflow in Action...</p>
            <p className="text-sm text-gray-400 mt-2">Planner and Generator agents are collaborating to draft your quiz.</p>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Quiz Configurations
          </CardTitle>
          <CardDescription>Tailor the quiz parameters to your study goals.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input name="subject" id="subject" placeholder="e.g. Mathematics" required className="bg-white/5 border-white/10 focus:border-purple-500/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input name="topic" id="topic" placeholder="e.g. Calculus" required className="bg-white/5 border-white/10 focus:border-purple-500/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select name="difficulty" id="difficulty" className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">Question Count</Label>
                <Input type="number" name="count" id="count" defaultValue={10} min={1} max={50} className="bg-white/5 border-white/10 focus:border-purple-500/50" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold">
              {loading ? "Generating..." : <><Wand2 className="mr-2 w-4 h-4" /> Generate AI Assessment</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400">PRO TIP</Badge>
          </h4>
          <p className="text-xs text-gray-400">Be specific with the Topic (e.g., 'Newton's Second Law' vs 'Physics') for better RAG precision.</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400">AGENTIC AI</Badge>
          </h4>
          <p className="text-xs text-gray-400">Our Critic Agent reviews every question to ensure it fits the requested difficulty level.</p>
        </div>
      </div>
    </div>
  );
}
