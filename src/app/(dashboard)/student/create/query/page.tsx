"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

export default function QueryQuizPage() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return toast.error("Please enter a query");
    
    setLoading(true);

    try {
      // We send the raw query to our agentic graph
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify({ 
          topic: query, 
          difficulty: "MEDIUM", 
          count: 10,
          subject: "General Knowledge (Query)",
          isQueryMode: true 
        }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const quiz = await res.json();
      toast.success("Magic! Quiz generated from your query.");
      router.push(`/student/quizzes/${quiz.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-outfit">Magic Query Generator</h1>
          <p className="text-gray-400">Just type what you want to learn, and our agents will build it.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 relative overflow-hidden backdrop-blur-md">
        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-xl font-bold text-white">AI Agents are Researching...</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">Analyzing your query and drafting high-quality educational content.</p>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 font-outfit">
            <Wand2 className="w-5 h-5 text-amber-400" /> The Magic Box
          </CardTitle>
          <CardDescription>Tell the AI exactly what subjects, grade levels, or specific topics you need.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <Textarea 
              placeholder="e.g. Create a 10-question quiz on the French Revolution for Grade 12 students, focusing on the Reign of Terror..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[200px] bg-white/5 border-white/10 text-lg p-6 focus:ring-amber-500/50 resize-none"
              required
            />

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("Basic Algebra for 8th Grade")}>Algebra</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("Photosynthesis and Plant Biology")}>Biology</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("World War II major battles")}>History</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("C++ Programming Fundamentals")}>Computer Science</Badge>
            </div>

            <Button type="submit" disabled={loading || !query} className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-lg font-bold shadow-xl shadow-amber-500/20">
              {loading ? "Constructing Quiz..." : "Cast Magic Spell 🪄"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
             <Brain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold mb-1">Natural Language</h4>
            <p className="text-sm text-gray-500 leading-relaxed">No need for forms. Just speak naturally like you would to a tutor.</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
             <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold mb-1">Deep Knowledge</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Agents cross-reference multiple educational standards in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
