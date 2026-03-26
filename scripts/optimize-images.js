#!/usr/bin/env node

/**
 * One-time image optimization script.
 * Generates WebP versions of all PNG/JPG images in public/images/ and src/assets/.
 * Originals are kept in place — WebP siblings are created alongside them.
 *
 * Usage: node scripts/optimize-images.js
 */

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const QUALITY = 80;
const MAX_WIDTH = 1440;
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function walkDir(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(full)));
    } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  const image = sharp(filePath);
  const meta = await image.metadata();

  let pipeline = image;
  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH);
  }

  await pipeline.webp({ quality: QUALITY }).toFile(webpPath);

  const originalSize = (await stat(filePath)).size;
  const webpSize = (await stat(webpPath)).size;
  const savings = ((1 - webpSize / originalSize) * 100).toFixed(0);

  console.log(
    `  ${basename(filePath)} → ${basename(webpPath)}  ` +
      `${(originalSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB  (${savings}% smaller)`,
  );

  return { originalSize, webpSize };
}

async function main() {
  const publicDir = join(__dirname, "..", "public", "images");
  const assetsDir = join(__dirname, "..", "src", "assets");

  console.log("Optimizing public/images/ ...\n");
  const publicFiles = await walkDir(publicDir);
  let totalOriginal = 0;
  let totalWebp = 0;

  for (const file of publicFiles) {
    const { originalSize, webpSize } = await optimizeImage(file);
    totalOriginal += originalSize;
    totalWebp += webpSize;
  }

  console.log("\nOptimizing src/assets/ ...\n");
  const assetFiles = (await readdir(assetsDir))
    .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .map((f) => join(assetsDir, f));

  for (const file of assetFiles) {
    const { originalSize, webpSize } = await optimizeImage(file);
    totalOriginal += originalSize;
    totalWebp += webpSize;
  }

  console.log(
    `\nDone! Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalWebp / 1024 / 1024).toFixed(1)}MB  ` +
      `(${((1 - totalWebp / totalOriginal) * 100).toFixed(0)}% smaller)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
