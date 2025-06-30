import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST (request) {
    const {prompt, jobDetails, extraJD } = await request.json();

    console.log('Job Details: ', jobDetails);
    console.log('Extra Information: ', extraJD);

    try {
        const response = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `You're a Resume Reviewer. You're supposed to review the given resume and give an ATS score, and give it in the form of sections, that you can decide.
            I recommend clarity, use of buzzwords, visibility, relevance of projects and skills, etc.
            Say good points and then the bad points.
            
            This is the parsed text from the resume:
            ${prompt}
            
            Rules:
            1. Your response will be directly given to the user so create it accordingly, with no refernce to me.
            2. Don't give an introduction in the beginning of the response. Directly go to the points.
            3. The response should be given with exact answers and numbers, and less like a conversation.
            4. The text is going to be directly displayed onto the website, and there will be no formatting. So remove the stars, etc., and add proper spacing.
            
            Also, the user may share a job description as below. These may or may not be specified, so don't mention it if not mentioned.
            Analyse the resume, and make suggestions based on this job description.
            The following has been taken from the URL provided by user, and may or may not be accurate:
            type: ${extraJD.type}
            title: ${extraJD.title}
            description: ${extraJD.description}
            skills: ${extraJD.skills}
            
            The next is the job description given by the user or pasted from the website:
            ${jobDetails}`
        });

        return Response.json({success: true, result: response.text}, {status: 200});
    }
    catch (error) {
        console.error("Error: ", error);
        alert("Error Occured with Prompt")

        return Response.json({success: false, error: error}, {status: 500});
    }
}