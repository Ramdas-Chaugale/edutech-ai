"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, History, PlayCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch("/api/quiz/list"); // I'll create this API next
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-outfit">My Quiz Library</h1>
          <p className="text-gray-400 text-sm">Access and review all your AI-generated assessments.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input placeholder="Search quizzes..." className="pl-10 bg-white/5 border-white/10" />
           </div>
           <Button variant="outline" className="border-white/10 text-gray-400">
             <Filter className="w-4 h-4 mr-2" /> Filter
           </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 opacity-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <Card className="bg-white/5 border-dashed border-white/10 p-20 text-center space-y-6">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <History className="w-10 h-10 text-gray-600" />
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-semibold">Your library is empty</h3>
             <p className="text-gray-400 max-w-sm mx-auto">Start by generating your first AI quiz from the dashboard.</p>
           </div>
           <Link href="/student/create">
             <Button className="bg-purple-600 hover:bg-purple-500 text-white px-8">
               Create First Quiz
             </Button>
           </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz: any) => (
            <Card key={quiz.id} className="bg-white/5 border-white/5 hover:bg-white/[0.08] transition-all group">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{quiz.title}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase border-purple-500/30 text-purple-400 bg-purple-500/5">
                            {quiz.difficulty}
                          </Badge>
                       </div>
                       <p className="text-sm text-gray-500">{quiz.subject} • {quiz.questions?.length || 0} Questions</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                    <div className="text-right hidden md:block">
                       <p className="text-[10px] text-gray-500 font-bold uppercase">Created</p>
                       <p className="text-sm font-medium">{new Date(quiz.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link href={`/student/quizzes/${quiz.id}`} className="w-full md:w-auto">
                       <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white gap-2">
                         Open Quiz <PlayCircle className="w-4 h-4" />
                       </Button>
                    </Link>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
