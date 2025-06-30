import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import * as cheerio from "cheerio";

//Here, we use puppeteer on a local machine, and from puppeteer-core and chromium if on hosted or serverless program.

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Configuration for different environments
    const launchOptions = process.env.VERCEL
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        }
      : {
          //The executable path changes when it's hosted and when it's on a local machine.
          executablePath:
            process.env.CHROME_PATH ||
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        };

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Configure page behavior
    await page.setViewport({ width: 1366, height: 768 });
    await page.setJavaScriptEnabled(true);

    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });
    } catch (err) {
      console.log("Navigation timeout, continuing with loaded content");
    }

    // Wait for critical elements or timeout
    await Promise.race([
      page.waitForSelector("div.heading_6_6, h1", { timeout: 10000 }),
      new Promise((resolve) => setTimeout(resolve, 10000)),
    ]);

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    // Information Extraction
    const title =
      $("h1.heading_4_5").first().text().trim() ||
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      "No title found";

    const type = url.includes("/internship/")
      ? "Internship"
      : url.includes("/job/")
      ? "Job"
      : "Unknown";

    let description = "No description found";
    const descriptionSections = [
      'div.heading_6_6:contains("About the internship") + div',
      'div.heading_6_6:contains("About the job") + div',
      "div.internshipDetails__description-container",
      "div.job-details-section",
      "section.description",
    ];

    for (const section of descriptionSections) {
      if ($(section).length) {
        description = $(section).text().trim();
        break;
      }
    }

    let skills = [];
    const skillsSections = [
      'div.heading_6_6:contains("Skills required") + div span',
      "div.skills-section li",
      "div.requirements-section li",
      "span.skill-tag",
    ];

    for (const section of skillsSections) {
      if ($(section).length) {
        skills = $(section)
          .map((i, el) => $(el).text().trim())
          .get();
        if (skills.length > 0) break;
      }
    }

    if (skills.length === 0) {
      const potentialSkillsText = $("body")
        .text()
        .match(/(skills|requirements):?\s*([^.]+)/i);
      if (potentialSkillsText) {
        skills = potentialSkillsText[2].split(",").map((s) => s.trim());
      }
    }

    return Response.json({
      success: true,
      result: {
        type,
        title,
        description: description || "No description found",
        skills: skills.length ? skills : ["No skills listed"],
      },
    });
  } catch (error) {
    console.error("🔥 Scrape error:", error);
    return Response.json(
      { success: false, error: error.message || "Scraping failed" },
      { status: 500 }
    );
  }
}
