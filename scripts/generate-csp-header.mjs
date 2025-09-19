import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Path to your built HTML file (adjust if necessary)
const htmlPath = "dist/index.html";
const html = await readFile(htmlPath, "utf-8");

// Extract the JSON-LD block content
const match = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/
);

if (!match) {
    console.error("❌ No JSON-LD <script> block found in", htmlPath);
    process.exit(1);
}

const jsonLdContent = match[1].trim();

// Compute SHA-256 hash
const hash = createHash("sha256").update(jsonLdContent, "utf8").digest("base64");

// Output nginx header line
const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    `script-src 'self' https://metrics.schrett.net 'sha256-${hash}'`,
    "style-src 'self'",
    "font-src 'self'",
    "connect-src 'self' https://metrics.schrett.net",
    "form-action 'none'",
    "manifest-src 'self'",
    "worker-src 'none'",
    "upgrade-insecure-requests"
].join("; ");
const line = `add_header Content-Security-Policy "${csp}" always;`;


console.log(`################################`)
console.log(`✅ CSP header:`);
console.log(`  ${line}`);
console.log(`################################`)