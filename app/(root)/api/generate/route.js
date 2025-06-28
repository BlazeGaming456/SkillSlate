import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  const { prompt } = await request.json();

  try {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are supposed to make the content for a cover letter. It should be in 3 paragraphs, enough for a page. The paragraphs should be seperated, that is on a new line.
      The following is the prompt:
      ${prompt}
      
      Rules:
      1. Don't generate anything else
      2. only the content should be present since it will be directly pasted into the document.`,
    });

    console.log("AI Response:", response.text);

    return Response.json(
      { success: true, result: response.text },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);

    return Response.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
