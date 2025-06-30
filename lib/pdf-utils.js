import pdf from "pdf-parse";

export async function parsePDF(file) {
  try {
    // 1. Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Parse with pdf-parse
    const data = await pdf(buffer);

    return {
      text: data.text,
      pages: data.numpages,
      metadata: data.info,
    };
  } catch (error) {
    console.error("PDF parsing failed:", error);
    throw new Error("Failed to extract text from PDF");
  }
}