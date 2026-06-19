import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    
    const quizzes = await prisma.quiz.findMany({
      where: {
        OR: [
          { userId: userId },
          { userId: dbUser?.id }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { attempts: true }
        }
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("[QUIZ_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
