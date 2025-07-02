import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request) {
    try {
        const {username} = await request.json();

        const repoRes = await fetch(`https://api.github.com/users/${username}/repos`)
        if (!repoRes.ok) return Response.json({success:false, error:'GitHub user not found'}, {status:404});

        const repos = await repoRes.json();
        const projectSummaries = repos.map(r => `- ${r.name}: ${r.description || 'No description'}`).join('\n')

        const response = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `The following is a list of public GitHub repositories and their descriptions:
        ${projectSummaries}

        Please review this developer's profile and suggest:
        - What they are doing well
        - Areas of improvement
        - Projects or skills they could add to strengthen their profile`
        })

        return Response.json({success:true, analysis:response.text}, {status:200});
    }
    catch (error) {
        console.log("Error: ", error.message);
        return Response.json({success:false, error:error.message},{status:500});
    }
}