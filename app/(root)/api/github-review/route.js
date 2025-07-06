import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request) {
  const { username } = await request.json();

  if (!username || typeof username !== "string") {
    return Response.json(
      { success: false, error: "Invalid GitHub username" },
      { status: 400 }
    );
  }

  async function askGemini(prompt) {
    const response = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });
    return response.text;
  }

  try {
    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    if (!repoRes.ok)
      return Response.json(
        { success: false, error: "GitHub user not found" },
        { status: 404 }
      );

    const repos = await repoRes.json();
    const projectSummaries = repos
      .map((r) => `- ${r.name}: ${r.description || "No description"}`)
      .join("\n");

    const prosPrompt =
      "Read the following GitHub projects and list the good points (pros) in clear bullet points. Not for each project, but in general, what they have done well such as clear documentation, diverse ideas, etc. Do this with the perspective that the user is a student or fresh engineer. Yor response should be not be too large but include all the relevant and strong points. Do not give any introduction before or summary after the bullet points. \nProjects:\n" +
      projectSummaries;
    const consPrompt =
      "Read the following GitHub projects and list the bad points (cons) in clear bullet points. Not for each project, but in general, like unclear documentation, similar ideas, etc. Do this with the perspective that the student is a college student or a fresh graduate. Your response should not be too large but should contain all the important points and be relevant. Do not give any introduction before or summary after the bullet points.\nProjects:\n" +
      projectSummaries;
    const summaryPrompt =
      "Read the followoing GitHub repositories and basically give a summary of the profile. How active it is, how many repositories. How many repositories seem to have a good number of commits, etc. The response should be brief and concise. Do not give bullet points, but just a paragraph.\nProjects:\n" +
      projectSummaries;
    const guidePrompt =
      "Read the following GitHub repositories and give a brief guide on how to improve the profile and what the user should focus on in the future, along with advice on if they should tap into other domains. What they can do to make it better, like adding more projects, improving documentation, etc. The response should be brief and concise. Do not give any intorduction before the bullet points, but give a very brief summary afterwards.\nProjects:\n" +
      projectSummaries;

    const pros = await askGemini(prosPrompt);
    const cons = await askGemini(consPrompt);
    const summary = await askGemini(summaryPrompt);
    const guide = await askGemini(guidePrompt);

    if (!pros || !cons || !summary || !guide) {
      return Response.json(
        { success: false, error: "Failed to generate pros or cons" },
        { status: 500 }
      );
    }
    return Response.json(
      { success: true, pros: pros, cons: cons, summary: summary, guide: guide },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: ", error.message);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
