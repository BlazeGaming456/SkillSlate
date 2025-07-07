//Here, we handle saving a resume with LaTeX code and user data.
//This is used in ResumeForm.jsx

import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.userId;

    const resume = await prisma.resume.create({
      data: {
        latexCode: body.latexCode,
        userId: body.userId,
        name: body.name,
        data: body.data,
      },
    });

    return Response.json({ success: true, resume, email }, { status: 200 });
  } catch (error) {
    console.error("SAVE ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
