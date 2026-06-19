import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Timer } from "lucide-react";
import QuizSessionForm from "@/components/quiz/QuizSessionForm";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/");

  const quiz = await prisma.quiz.findUnique({
    where: { id: id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 uppercase tracking-widest text-[10px]">
              {quiz.subject}
            </Badge>
            <Badge variant="outline" className="bg-white/5 text-gray-400 border-white/10 uppercase tracking-widest text-[10px]">
              {quiz.difficulty}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold font-outfit">{quiz.title}</h1>
          <p className="text-gray-400 text-sm">Read the questions carefully and select the best answer.</p>
        </div>
        
        <Card className="bg-white/5 border-white/5 px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2 text-purple-400">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{quiz.questions.length} Questions</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-gray-400">
            <Timer className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Untimed</span>
          </div>
        </Card>
      </header>

      {/* Since we need interactivity (state) for picking answers, 
          we'll move the actual form to a client component */}
      <QuizSessionForm quiz={quiz} />
    </div>
  );
}
