import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/services/ai/evaluation";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const { quizId, answers } = await req.json();

    // 1. Map Clerk ID to Database User ID
    let dbUser = await prisma.user.findUnique({ where: { clerkId } });
    
    // If user doesn't exist in DB yet (e.g. webhook delay), create them
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { clerkId, email: `${clerkId}@temp.com`, name: "Student" },
      });
    }

    const userId = dbUser.id;

    // 2. Fetch the quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });

    if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

    // 3. Create the attempt record
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        startedAt: new Date(),
      },
    });

    let totalScore = 0;
    const submissions = [];

    // 4. Grade each answer
    for (const question of quiz.questions) {
      const studentAnswerId = answers[question.id];
      const selectedOption = question.options.find(o => o.id === studentAnswerId);
      const isCorrect = selectedOption?.isCorrect || false;

      // Call AI for feedback (Async)
      const aiResponse = await evaluateAnswer(
        question.content,
        selectedOption?.content || "No answer",
        question.correctAnswer || "Check explanation"
      );

      if (isCorrect) totalScore += (100 / quiz.questions.length);

      submissions.push({
        attemptId: attempt.id,
        questionId: question.id,
        answer: selectedOption?.content || "N/A",
        isCorrect,
        aiFeedback: aiResponse.feedback,
      });
    }

    // 5. Save grades and final score
    await prisma.answerSubmission.createMany({ data: submissions });
    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { 
        score: totalScore, 
        completedAt: new Date(),
        feedback: `Great job! You scored ${Math.round(totalScore)}%` 
      },
    });

    return NextResponse.json({ score: totalScore, attemptId: attempt.id });
  } catch (error: any) {
    console.error("Submission Error:", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
