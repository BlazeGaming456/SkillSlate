//Here, we retrieve the list of resumes for the authenticated user to show on the dashboard

import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";

export async function GET(req) {
  const token = await getToken({ req });

  const email = token?.email;
  if (!email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: email },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(resumes), {
    headers: { "Content-Type": "application/json" },
  });
}