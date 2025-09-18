import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const manifest = {};

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

async function processDirectory(relativeDir, extensions) {
  const targetDir = path.join(distDir, relativeDir);

  let entries;
  try {
    entries = await readdir(targetDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!extensions.has(ext)) {
      continue;
    }

    const originalPath = path.join(targetDir, entry.name);
    const fileContents = await readFile(originalPath);
    const hash = crypto.createHash('sha256').update(fileContents).digest('hex').slice(0, 8);
    const baseName = path.basename(entry.name, ext);
    const hashedName = `${baseName}-${hash}${ext}`;
    const hashedPath = path.join(targetDir, hashedName);

    await rename(originalPath, hashedPath);

    const originalKey = `/${toPosixPath(path.join(relativeDir, entry.name))}`;
    const hashedValue = `/${toPosixPath(path.join(relativeDir, hashedName))}`;
    manifest[originalKey] = hashedValue;
  }
}

async function buildManifest() {
  await mkdir(distDir, { recursive: true });
  await processDirectory('assets/css', new Set(['.css']));
  await processDirectory('assets/js', new Set(['.js']));

  const manifestPath = path.join(distDir, 'assets-manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

buildManifest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
