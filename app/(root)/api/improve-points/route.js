//Function to improve points using Gemini AI
//It is used in ResumeForm.jsx to take the points given by the user and improve them

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  const { type, points } = await request.json();

  if (points.length === 0) {
    return Response.json(
      { success: false, error: "No points provided" },
      { state: 500 }
    );
  }

  try {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You're an AI resume improver. THe given points may belong to ${type}
            Improve them to be more impactful, clear and achievement-driven.
            Improve each of the lines and then return as many lines as was given.
            
            IMPORTANT - Format output as a list, with each point on a new line.
            IMPORTANT - Don't have any other message before or after the text. Only return the answer.
            IMPORTANT - Remove these stars from before and after each line - *   **.
            IMPORTANT - There should be no spaces or stars before or after the text on each line. 

            Here are the points:
            ${points.map((pt, i) => `${i + 1}. ${pt}`).join("\n")}`,
    });

    console.log(response);

    const text = response.text;

    //Providing the correct formatting
    const improvedPoints = text
      .split(/\n+/)
      .map((line) => line.replace(/^[-\d.]*\s*/, "").trim())
      .filter(Boolean);

    return Response.json({ success: true, improvedPoints }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}
