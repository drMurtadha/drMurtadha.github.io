#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const roots = ['src/content/pages', 'src/content/posts'];
let failures = 0;
for (const root of roots) {
  let files = [];
  try { files = await readdir(resolve(root), { recursive: true }); } catch { continue; }
  for (const file of files.filter((name) => /\.mdx?$/.test(name))) {
    const text = await readFile(resolve(root, file), 'utf8');
    if (!text.startsWith('---\n') || !/\ntitle:\s*.+/m.test(text) || !/\ndescription:\s*.+/m.test(text)) {
      console.error(`Invalid frontmatter: ${root}/${file}`);
      failures += 1;
    }
  }
}
if (failures) process.exit(1);
console.log('Content validation passed.');
