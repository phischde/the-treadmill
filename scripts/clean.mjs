import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

async function clean() {
  await rm(distDir, { recursive: true, force: true });
}

clean().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
