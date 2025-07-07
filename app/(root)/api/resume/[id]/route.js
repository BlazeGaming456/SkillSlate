//Here, we handle resume retrieval and deletion, including PDF generation from LaTeX code.

import prisma from "@/lib/db";
import { NextResponse } from "next/server";

//Function to retrieve a resume by ID when we click on a resume in the Dashboard
export async function GET(req, { params }) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: params.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Check if this is a PDF request
    const url = new URL(req.url);
    if (url.searchParams.get("format") === "pdf") {
      // Generate PDF from LaTeX code
      const res = await fetch(
        "https://latex-compiler-backend-production-3063.up.railway.app/compile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: resume.latexCode,
            compiler: "pdflatex",
          }),
        }
      );

      if (!res.ok || res.headers.get("Content-Type") !== "application/pdf") {
        const err = await res.text();
        console.error("LaTeX Compile Error:\n", err);
        return NextResponse.json(
          { error: "PDF generation failed" },
          { status: 500 }
        );
      }

      const buffer = await res.arrayBuffer();
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${
            resume.name || "resume"
          }.pdf"`,
        },
      });
    }

    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

//Function to delete the specified resume on the dashboard
export async function DELETE(req, { params }) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: params.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    await prisma.resume.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
