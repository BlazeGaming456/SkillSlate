import { prisma } from '@/lib/db'

export async function POST (request) {
    try {
        const body = await request.json();

        const resume = await prisma.resume.create({
            data: {
                latexCode: body.latexCode,
            }
        })

        return Response.json({ success: true, resume }, { status: 200 })
    }
    catch (error) {
        console.log('Error: ', error);
        return Response.json({ success: false }, { status:500 });
    }
}