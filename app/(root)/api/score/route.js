//This is used to handle PDF uploads and processing in the Improve Resume page
//This is then passed to Gemini to generate required prompts for ATS score, pros, cons, and job match improvements

import { NextResponse } from "next/server";
import { parsePDF } from "@/lib/pdf-utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    //Retrieve the file from the form data
    const file = formData.get("resume");

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file - please upload a PDF" },
        { status: 400 }
      );
    }

    //Processing the PDF file
    const result = await parsePDF(file);

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
