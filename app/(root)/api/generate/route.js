import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  const { name } = await request.json();

  try {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Say hi to the user named ${name}`,
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
