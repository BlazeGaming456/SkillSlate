import { NextResponse } from "next/server";
import { parsePDF } from "@/lib/pdf-utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    // 1. Get the file from FormData
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file - please upload a PDF" },
        { status: 400 }
      );
    }

    // 2. Process the PDF
    const result = await parsePDF(file);

    // 3. Return success
    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PDF processing error:", error);
    return NextResponse.json(
      {
        error: "PDF processing failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
