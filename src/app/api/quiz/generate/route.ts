import { NextRequest, NextResponse } from "next/server";
import { app } from "@/services/ai/graph";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { topic, difficulty, count, subject } = body;

    console.log(`--- Creating ${difficulty} ${subject} Quiz for User ${userId} ---`);

    // Run the AI Graph
    const result = await app.invoke({
      topic,
      difficulty,
      count: parseInt(count),
      subject,
      status: "planning",
    });

    if (!result.questions || result.questions.length === 0) {
      throw new Error("AI failed to generate questions.");
    }

    // Save to Database in a single transaction
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title: `${difficulty} ${subject} Quiz on ${topic}`,
        subject,
        difficulty,
        questions: {
          create: result.questions.map((q: any) => ({
            content: q.text || q.content,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            options: {
              create: q.options.map((opt: string) => {
                // Smart match: check if correct answer is "A" and opt starts with "A)"
                const isLetterMatch = q.correctAnswer.length === 1 && opt.startsWith(`${q.correctAnswer})`);
                const isFullMatch = opt === q.correctAnswer;
                
                return {
                  content: opt,
                  isCorrect: isLetterMatch || isFullMatch,
                };
              }),
            },
          })),
        },
      },
    });

    console.log(`✅ QUIZ CREATED: ${quiz.id}`);

    return NextResponse.json({ id: quiz.id });
  } catch (error: any) {
    console.error("CRITICAL ERROR DURING GENERATION:", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
