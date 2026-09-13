#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const limits = { cssTotal: 60 * 1024, jsTotal: 30 * 1024, inlineJsPerPage: 10 * 1024, htmlFile: 100 * 1024, imageFile: 250 * 1024 };
const totals = { css: 0, js: 0, maxInlineJs: 0 };
const failures = [];

for (const relative of await readdir(root, { recursive: true })) {
  const file = resolve(root, relative);
  const info = await stat(file);
  if (!info.isFile()) continue;
  const extension = extname(relative).toLowerCase();
  if (extension === '.css') totals.css += info.size;
  if (extension === '.js') totals.js += info.size;
  if (extension === '.html') {
    if (info.size > limits.htmlFile) failures.push(`${relative}: HTML exceeds 100 KiB`);
    const html = await readFile(file, 'utf8');
    const inlineBytes = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
      .reduce((total, match) => total + Buffer.byteLength(match[1]), 0);
    totals.maxInlineJs = Math.max(totals.maxInlineJs, inlineBytes);
    if (inlineBytes > limits.inlineJsPerPage) failures.push(`${relative}: inline JavaScript exceeds 10 KiB`);
  }
  if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(extension) && info.size > limits.imageFile) failures.push(`${relative}: image exceeds 250 KiB`);
}
if (totals.css > limits.cssTotal) failures.push(`Total CSS exceeds 60 KiB (${totals.css} bytes)`);
if (totals.js > limits.jsTotal) failures.push(`Total JavaScript exceeds 30 KiB (${totals.js} bytes)`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Performance budget passed: ${(totals.css / 1024).toFixed(1)} KiB CSS, ${(totals.js / 1024).toFixed(1)} KiB external JS, ${(totals.maxInlineJs / 1024).toFixed(1)} KiB maximum inline JS per page.`);
