//Here, we take the content from the PDF, and make requests to Gemini AI to generate the ATS score, pros, and cons
//Used in the Improve Resume page to analyze resumes and provide feedback

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
  const { prompt, jobDetails, extraJD } = await request.json();

  //Function to call Gemini AI and pass a prompt
  async function askGemini(prompt) {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });
    return response.text;
  }

  try {
    const atsScorePrompt = `Read the following resume text and give only a single number out of 100 as the ATS score. No explanation, just the number.\nResume: ${prompt}`;
    const prosPrompt = `Read the following resume text and list the good points (pros) in clear bullet points.\nResume: ${prompt}`;
    const consPrompt = `Read the following resume text and list the bad points (cons) in clear bullet points.\nResume: ${prompt}`;

    //Combine job descriptions if available - Scraped data from Job URL and the Job Description provided by the user
    let combinedJobDesc = "";
    if (jobDetails && jobDetails.trim() !== "") {
      combinedJobDesc += jobDetails.trim();
    }
    if (extraJD && extraJD.description && extraJD.description.trim() !== "") {
      if (combinedJobDesc.length > 0) combinedJobDesc += "\n\n";
      combinedJobDesc += extraJD.description.trim();
    }

    let jobMatchPrompt = null;
    let jobImprovementsPrompt = null;
    if (combinedJobDesc.length > 0) {
      jobMatchPrompt = `Given the following resume and job description(s), rate how well the resume matches the job on a scale of 0-100. Give only the number.\nResume: ${prompt}\nJob Description(s): ${combinedJobDesc}`;
      jobImprovementsPrompt = `Given the following resume and job description(s), suggest specific improvements to the resume to better match the job. List as bullet points. Don't make it like a conversation, there should be no text before the bullet point list. \nResume: ${prompt}\nJob Description(s): ${combinedJobDesc}`;
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
