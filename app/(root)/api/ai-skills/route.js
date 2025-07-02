import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request) {
    try {
        const {prompt} = await request.json();

        const res = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `You're an AI Resume Improver. The user has given you a prompt detailing the job they're going to apply for.
            You have to make an ideal skill section containing the ideal tech stack of candidate of given experience if mentioned, applying for that job.
            IT MUST FOLLOW THE GIVEN FORMAT, of skill type, followed by the skills.
            
            IMPORTANT - 
            It should be in this format, for example:
            {Programming Languages: C++, Python, JavaScript
            Frontend: React, Next.js
            Backend: Node.js, Express.js, Next.js
            ,etc.}

            There should be 4-5 sections as you see best for the given job description.
            
            The given is the prompt:
            ${prompt}

            Rules:
            No text regarding assumptions, etc., should be included in the response. Only the points to be included in the resume.
            No text other than the skills in the given format should be returned, as it is directly displayed to the user as reference.`
        })

        return Response.json({success:true, result:res.text},{status:200});
    }
    catch (error) {
        console.log("Error: ", error.message);
        return Response.json({success:false, error:error.message}, {status:500});
    }
}