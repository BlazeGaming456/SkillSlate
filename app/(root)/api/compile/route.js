export async function POST(req) {
  const { code, compiler } = await req.json();

  const res = await fetch("https://latexonline.cc/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, compiler }),
  });

  const contentType = res.headers.get("Content-Type");

  if (contentType !== "application/pdf") {
    const errorText = await res.text(); // Catch LaTeX errors
    return new Response(errorText, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const buffer = await res.arrayBuffer();

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=resume.pdf",
    },
  });
}
