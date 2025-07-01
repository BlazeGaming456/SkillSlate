import { authOptions } from "@/components/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(request) {
  //   const session = await getServerSession(authOptions);

  //   if (!session) {
  //     return Response.json(
  //       { success: false, error: "Unauthorized" },
  //       { status: 404 }
  //     );
  //   }

  try {
    const body = await request.json();

    const email = body.userId;

    const resume = await prisma.resume.create({
      data: {
        latexCode: body.latexCode,
        userId: body.userId,
      },
    });

    return Response.json({ success: true, resume, email }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
