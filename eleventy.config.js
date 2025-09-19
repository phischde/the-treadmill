// eleventy.config.js (ESM)
import fs from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { minify } from "html-minifier-terser";

let assetManifestCache = null;

function loadAssetManifest() {
    if (assetManifestCache !== null) return assetManifestCache;

    const manifestPath = path.join(process.cwd(), "dist", "assets-manifest.json");

    if (fs.existsSync(manifestPath)) {
        try {
            const raw = fs.readFileSync(manifestPath, "utf-8");
            assetManifestCache = JSON.parse(raw);
        } catch (error) {
            console.warn("Failed to parse asset manifest:", error);
            assetManifestCache = {};
        }
    } else {
        assetManifestCache = {};
    }
    return assetManifestCache;
}

function resolveAssetPath(assetPath) {
    const manifest = loadAssetManifest();
    return manifest[assetPath] || assetPath;
}

async function imageShortcode(src, alt, options = {}) {
    if (!src) throw new Error("Missing `src` for image shortcode");
    if (!alt) throw new Error(`Missing \`alt\` on image from ${src}`);

    const {
        widths = [480, 768, 1024, 1440],
        formats = ["avif", "webp", "jpeg"],
        sizes = "(min-width: 960px) 960px, 100vw",
        loading = "lazy",
        decoding = "async",
        className = ""
    } = options;

    const filePath = path.join("src", "assets", "images", src);

    const metadata = await Image(filePath, {
        widths,
        formats,
        outputDir: "dist/assets/images",
        urlPath: "/assets/images/",
        sharpJpegOptions: { quality: 80 },
        sharpPngOptions: { quality: 80 },
        sharpWebpOptions: { quality: 70 },
        sharpAvifOptions: { quality: 65 }
    });

    const sources = Object.values(metadata)
        .map((imageFormat) => {
            const sourceType = imageFormat[0].sourceType;
            const srcset = imageFormat.map((entry) => entry.srcset).join(", ");
            return `<source type="${sourceType}" srcset="${srcset}" sizes="${sizes}">`;
        })
        .join("\n");

    const fallbackFormat = metadata.jpeg || metadata.png || Object.values(metadata)[0];
    const fallback = fallbackFormat[fallbackFormat.length - 1];

    return `<picture>${sources}<img src="${fallback.url}" width="${fallback.width}" height="${fallback.height}" alt="${alt}" loading="${loading}" decoding="${decoding}" class="${className}" /></picture>`;
}

export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ public: "." });
    eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });

    eleventyConfig.addWatchTarget("./src/assets/css/");
    eleventyConfig.addWatchTarget("./src/assets/js/");

    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

    const md = markdownIt({
        html: true,
        linkify: true,
        typographer: true
    }).use(markdownItAnchor, {
        level: [1, 2, 3],
        permalink: markdownItAnchor.permalink.headerLink({
            safariReaderFix: true,
            class: "heading-anchor"
        })
    });
    eleventyConfig.setLibrary("md", md);

    eleventyConfig.addFilter("assetPath", resolveAssetPath);

    eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
    eleventyConfig.addFilter("htmlDate", (dateObj) => {
        if (!dateObj) return "";
        const date = new Date(dateObj);
        if (Number.isNaN(date.valueOf())) return "";
        return date.toISOString().split("T")[0];
    });

    eleventyConfig.addFilter("year", (value) => {
        const date = value ? new Date(value) : new Date();
        if (Number.isNaN(date.valueOf())) return new Date().getFullYear();
        return date.getFullYear();
    });

    if (process.env.ELEVENTY_ENV === "prod") {
        eleventyConfig.addTransform("htmlmin", async (content, outputPath) => {
            if (outputPath && outputPath.endsWith(".html")) {
                return await minify(content, {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    minifyCSS: true,
                    minifyJS: true
                });
            }
            return content;
        });
    }

    return {
        dir: {
            input: "src",
            includes: "includes",
            layouts: "layouts",
            data: "data",
            output: "dist"
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        templateFormats: ["njk", "md"]
    };
}
