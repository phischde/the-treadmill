import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eleventyImage from '@11ty/eleventy-img';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src/assets/images');
const outDir = path.resolve(__dirname, '../dist/assets/images');

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function processRasterImage(relativePath) {
  const fullInputPath = path.join(srcDir, relativePath);
  const dirName = path.dirname(relativePath);
  const normalizedDir = dirName === '.' ? '' : dirName.replace(/\\/g, '/');
  const outputDirectory = normalizedDir ? path.join(outDir, normalizedDir) : outDir;
  const urlPath = `/assets/images/${normalizedDir ? normalizedDir + '/' : ''}`;

  await ensureDir(outputDirectory);

  await eleventyImage(fullInputPath, {
    widths: [480, 768, 1024, 1440],
    formats: ['avif', 'webp', 'jpeg'],
    outputDir: outputDirectory,
    urlPath,
    sharpOptions: {
      animated: false
    },
    sharpJpegOptions: {
      quality: 82,
      progressive: true
    },
    sharpWebpOptions: {
      quality: 75
    },
    sharpAvifOptions: {
      quality: 70
    }
  });
}

async function copyVectorImage(relativePath) {
  const input = path.join(srcDir, relativePath);
  const output = path.join(outDir, relativePath);
  await ensureDir(path.dirname(output));
  await copyFile(input, output);
}

async function build() {
  const patterns = ['**/*.{jpg,jpeg,png}', '**/*.webp', '**/*.avif', '**/*.svg'];
  const files = new Set();

  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: srcDir, nodir: true, absolute: false });
    matches.forEach((file) => files.add(file));
  }

  if (!files.size) {
    console.log('No images found to process.');
    return;
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.svg') {
      await copyVectorImage(file);
      console.log(`Copied SVG: ${file}`);
    } else {
      await processRasterImage(file);
      console.log(`Processed image: ${file}`);
    }
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
