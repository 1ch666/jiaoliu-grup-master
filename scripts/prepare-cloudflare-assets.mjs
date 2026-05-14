import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const assetsDir = path.join(root, ".open-next", "assets");
const pagesDir = path.join(root, ".next", "server", "pages");

async function copyIfExists(sourceName, targetName = sourceName) {
  const source = path.join(pagesDir, sourceName);
  const target = path.join(assetsDir, targetName);

  try {
    await access(source);
  } catch {
    return;
  }

  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`Copied ${sourceName} to Cloudflare assets`);
}

await mkdir(assetsDir, { recursive: true });
await copyIfExists("index.html");
await copyIfExists("404.html");
