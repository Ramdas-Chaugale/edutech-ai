"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Sparkles, Wand2, FormInput, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CreateQuizPage() {
  const [mode, setMode] = useState<"standard" | "magic">("standard");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const baseData = Object.fromEntries(formData);
    
    const data = mode === "magic" 
      ? { topic: query, difficulty: "MEDIUM", count: 10, subject: "General Knowledge", isQueryMode: true }
      : baseData;

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const quiz = await res.json();
      toast.success(mode === "magic" ? "Magic! Quiz generated." : "Quiz generated successfully!");
      router.push(`/student/quizzes/${quiz.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-outfit">Generator Studio</h1>
            <p className="text-gray-400">Choose your method and initiate the AI agents.</p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-full max-w-md mx-auto">
        <button
          onClick={() => setMode("standard")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            mode === "standard" ? "bg-white text-black shadow-xl" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <FormInput className="w-4 h-4" /> Standard Form
        </button>
        <button
          onClick={() => setMode("magic")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            mode === "magic" ? "bg-amber-500 text-black shadow-xl" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <Sparkles className="w-4 h-4" /> Magic Query
        </button>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-xl font-bold text-white">
              {mode === "magic" ? "Casting Magic Spell..." : "Agents Collaborating..."}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Our {mode === "magic" ? "Research Agent" : "Planner"} is drafting high-quality content for you.
            </p>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {mode === "standard" ? <Zap className="w-5 h-5 text-purple-400" /> : <Wand2 className="w-5 h-5 text-amber-400" />}
            {mode === "standard" ? "Configuration Mode" : "Natural Language Mode"}
          </CardTitle>
          <CardDescription>
            {mode === "standard" 
              ? "Specify exact parameters for your assessment." 
              : "Simply type what you want to learn in plain English."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            {mode === "standard" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input name="subject" placeholder="e.g. Mathematics" required className="bg-white/5 border-white/10 focus:border-purple-500/50" />
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input name="topic" placeholder="e.g. Calculus" required className="bg-white/5 border-white/10 focus:border-purple-500/50" />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <select name="difficulty" className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Question Count</Label>
                  <Input type="number" name="count" defaultValue={10} min={1} max={50} className="bg-white/5 border-white/10 focus:border-purple-500/50" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Textarea 
                  placeholder="e.g. Create a 10-question quiz on World War II major battles for Grade 12 students..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[180px] bg-white/5 border-white/10 text-lg p-6 focus:ring-amber-500/50 resize-none"
                  required
                />
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("Basic Algebra for 8th Grade")}>Algebra</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("Photosynthesis and Plant Biology")}>Biology</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-white/10" onClick={() => setQuery("World War II major battles")}>History</Badge>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className={cn(
                "w-full h-14 text-lg font-bold shadow-2xl transition-all",
                mode === "standard" 
                  ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20" 
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20"
              )}
            >
              {loading ? "Generating..." : <><Wand2 className="mr-2 w-5 h-5" /> {mode === "standard" ? "Generate Assessment" : "Cast Magic Spell"}</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
          <h4 className="text-xs font-black uppercase text-purple-400 mb-2">Technical Insight</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Our agents cross-reference multiple educational datasets in real-time to ensure curriculum alignment.</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <h4 className="text-xs font-black uppercase text-amber-500 mb-2">Magic Logic</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Magic mode uses semantic parsing to infer difficulty and subject from your plain text description.</p>
        </div>
      </div>
    </div>
  );
}
