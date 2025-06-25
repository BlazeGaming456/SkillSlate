import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST (request) {
    const { name } = await request.json();

    try {
        const res = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Say hi to the user named ${name}`
        })
    
        console.log(res);

        return Response.json({success: true}, {status: 200})
    }
    catch (error) {
        console.error('Error:', error);
        return Response.json({success:false, error: error}, {status: 500})
    }
}