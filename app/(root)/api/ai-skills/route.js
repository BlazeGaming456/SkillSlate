import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const res = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are an expert resume builder. Given the following job description, generate an ideal skills section for a candidate applying to this job. Categorize the skills into 4-5 relevant sections (e.g., Programming Languages, Frameworks, Tools, Soft Skills, etc.), and list the most important and modern skills for each.

Format:
Programming Languages: Python, JavaScript, ...
Frameworks: React, Next.js, ...
...
Only output the skills in this format, no extra text.

Job description:
${prompt}`,
    });

    return Response.json({ success: true, result: res.text }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error.message);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
