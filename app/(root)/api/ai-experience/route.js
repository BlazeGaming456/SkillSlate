//Generates the required resume bullet points for experience using AI
//Used in ResumeForm.jsx

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const res = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You're an AI Resume Improver. The user has given you a prompt detailing their experience. Seperate each experience or work and make 4 points from each.
            The points should be clear and optimise such that it will be best to put into a resume.
            
            The given is the prompt:
            ${prompt}
            
            For each experience, place the heading, followed by four points, based on the user's description.
            

            Rules:
            IMPORTANT - Each point should be indicated by a bullet or other symbol.
            Different sectionsd should be seperate by new lines.
            No text regarding assumptions, etc., should be included in the response. Only the points to be included in the resume.`,
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
