import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, extname } from "node:path";

// Find all HTML files in dist directory
async function findHtmlFiles(dir) {
    const files = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await findHtmlFiles(fullPath));
        } else if (entry.isFile() && extname(entry.name) === '.html') {
            files.push(fullPath);
        }
    }
    return files;
}

// Extract all JSON-LD snippets from all HTML files
const htmlFiles = await findHtmlFiles("dist");
const allHashes = new Set();

for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, "utf-8");

    // Find all JSON-LD script blocks
    const matches = html.matchAll(
        /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g
    );

    for (const match of matches) {
        const jsonLdContent = match[1].trim();
        const hash = createHash("sha256").update(jsonLdContent, "utf8").digest("base64");
        allHashes.add(hash);
        console.log(`📄 ${htmlPath.replace('dist/', '')}: sha256-${hash}`);
    }
}

if (allHashes.size === 0) {
    console.error("❌ No JSON-LD <script> blocks found in any HTML files");
    process.exit(1);
}

// Generate script-src with all hashes
const scriptSources = [
    "'self'",
    "https://metrics.schrett.net",
    ...Array.from(allHashes).map(hash => `'sha256-${hash}'`)
].join(" ");

// Output nginx header line
const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    `script-src ${scriptSources}`,
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