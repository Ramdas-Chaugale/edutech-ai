import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { pdfService } from "@/services/rag/pdf";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const formData = await req.json(); // Simple JSON for now, or use FormData
    // Note: Standard Next.js Request.formData() is better for real files
    // But for this project's initial state, we'll demonstrate the logic
    
    const { fileBase64, subject, topic } = formData;
    const buffer = Buffer.from(fileBase64, 'base64');

    console.log(`--- Processing PDF for Subject: ${subject} ---`);

    const result = await pdfService.processAndIngest(buffer, {
      userId,
      subject,
      topic,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PDF Upload Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
