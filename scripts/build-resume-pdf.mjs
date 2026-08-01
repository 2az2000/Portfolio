/**
 * Regenerates public/resume/Amirali-Zand-Resume.pdf from the HTML résumé
 * next to it, by printing the file with an installed Chromium browser.
 *
 * The HTML is the single source of truth for the document — the site embeds
 * it live in the résumé preview, so the PDF is the only rendition that can
 * drift. Run this after every edit to the HTML:
 *
 *   npm run resume:pdf
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/resume/amirali-zand-resume.html");
const output = resolve(root, "public/resume/Amirali-Zand-Resume.pdf");

// Chromium is only used as a print engine here, so any of these will do.
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const browser = CANDIDATES.find((p) => p && existsSync(p));

if (!browser) {
  console.error(
    "No Chrome/Edge binary found. Set CHROME_PATH to one and re-run:\n" +
      "  CHROME_PATH=\"/path/to/chrome\" npm run resume:pdf"
  );
  process.exit(1);
}

if (!existsSync(source)) {
  console.error(`Missing résumé source: ${source}`);
  process.exit(1);
}

execFileSync(
  browser,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    // Give the webfonts time to land; printing before they do silently falls
    // back to system faces and changes the document's line breaks.
    "--virtual-time-budget=20000",
    `--print-to-pdf=${output}`,
    pathToFileURL(source).href,
  ],
  { stdio: "inherit" }
);

console.log(`Wrote ${output}`);
