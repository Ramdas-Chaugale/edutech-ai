import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, History, LayoutDashboard, Plus, PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/");

  // Fetch dbUser to get the internal ID
  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  
  const quizzes = dbUser ? await prisma.quiz.findMany({
    where: { 
      OR: [
        { userId: clerkId },
        { userId: dbUser.id }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: { attempts: { where: { userId: dbUser.id } } }
  }) : [];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Student Performance
          </h1>
          <p className="text-gray-400 text-sm">Track your AI-generated assessments and learning progress.</p>
        </div>
        <Link href="/student/create">
          <Button className="bg-purple-600 hover:bg-purple-500 text-white gap-2 shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4" /> New AI Quiz
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Assessments</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Quizzes Attempted</CardTitle>
            <History className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.filter(q => q.attempts.length > 0).length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Learning Hours</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(quizzes.length * 0.5)}h</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" /> Recent Quizzes
        </h2>
        
        {quizzes.length === 0 ? (
          <Card className="bg-white/5 border-dashed border-white/10 p-12 text-center space-y-4">
            <div className="text-gray-500 italic">No quizzes generated yet.</div>
            <Link href="/student/create">
              <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
                Create your first quiz
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-white/5 border-white/5 hover:bg-white/[0.08] transition-colors group">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                       <Brain className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <h3 className="font-semibold text-lg">{quiz.title}</h3>
                         <Badge variant="outline" className="text-[10px] uppercase border-purple-500/30 text-purple-400 bg-purple-500/5">
                           {quiz.difficulty}
                         </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{quiz.subject} • Generated on {new Date(quiz.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                       <div className="text-xs text-gray-500 uppercase font-bold">Best Score</div>
                       <div className="text-lg font-bold text-white">
                         {quiz.attempts[0]?.score ? `${Math.round(quiz.attempts[0].score)}%` : "N/A"}
                       </div>
                    </div>
                    <Link href={`/student/quizzes/${quiz.id}`}>
                      <Button className="bg-white/5 hover:bg-white/10 border-white/10 text-white gap-2">
                         {quiz.attempts.length > 0 ? "Retake" : "Start"} <PlayCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
