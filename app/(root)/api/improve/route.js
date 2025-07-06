import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  const { prompt, jobDetails, extraJD } = await request.json();

  // Helper to call Gemini
  async function askGemini(prompt) {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });
    return response.text;
  }

  try {
    // 1. ATS Score
    const atsScorePrompt = `Read the following resume text and give only a single number out of 100 as the ATS score. No explanation, just the number.\nResume: ${prompt}`;
    // 2. Pros
    const prosPrompt = `Read the following resume text and list the good points (pros) in clear bullet points.\nResume: ${prompt}`;
    // 3. Cons
    const consPrompt = `Read the following resume text and list the bad points (cons) in clear bullet points.\nResume: ${prompt}`;
    // 4. Job Match & Improvements (if job description provided)
    let jobMatch = null;
    let jobImprovements = null;
    let jobMatchPrompt = null;
    let jobImprovementsPrompt = null;
    if (jobDetails && jobDetails.trim() !== "") {
      jobMatchPrompt = `Given the following resume and job description, rate how well the resume matches the job on a scale of 0-100. Give only the number.\nResume: ${prompt}\nJob Description: ${jobDetails}`;
      jobImprovementsPrompt = `Given the following resume and job description, suggest specific improvements to the resume to better match the job. List as bullet points.\nResume: ${prompt}\nJob Description: ${jobDetails}`;
    }

    // Run all requests in parallel
    const [atsScore, pros, cons, jobMatchScore, jobImprovementsText] =
      await Promise.all([
        askGemini(atsScorePrompt),
        askGemini(prosPrompt),
        askGemini(consPrompt),
        jobMatchPrompt ? askGemini(jobMatchPrompt) : Promise.resolve(null),
        jobImprovementsPrompt
          ? askGemini(jobImprovementsPrompt)
          : Promise.resolve(null),
      ]);

    return Response.json(
      {
        success: true,
        atsScore: atsScore.trim(),
        pros,
        cons,
        jobMatch: jobMatchScore ? jobMatchScore.trim() : null,
        jobImprovements: jobImprovementsText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return Response.json(
      { success: false, error: error.toString() },
      { status: 500 }
    );
  }
}
