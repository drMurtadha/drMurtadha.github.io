#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const files = (await readdir(root, { recursive: true })).filter((x) => x.endsWith('.html'));
const failures = [];
for (const file of files) {
  const html = await readFile(resolve(root, file), 'utf8');
  const links = [...html.matchAll(/href=["']([^"'#?]+)["']/gi)].map((x) => x[1]);
  for (const link of links.filter((x) => !/^(?:https?:|mailto:|tel:)/.test(x))) {
    const path = link.startsWith('/') ? join(root, link) : resolve(dirname(resolve(root, file)), link);
    const candidates = [path, join(path, 'index.html'), `${path}.html`];
    let found = false;
    for (const candidate of candidates) { try { if ((await stat(candidate)).isFile()) { found = true; break; } } catch {} }
    if (!found) failures.push(`${file} -> ${link}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Checked ${files.length} HTML files; local links resolved.`);
