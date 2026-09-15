#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const routes = ['/', '/404.html', '/biography/', '/connect/', '/cv/', '/impact/', '/people/', '/publications/', '/publications/web-of-science/', '/publications/other/', '/publications/non-indexed/', '/research/', '/student-development/', '/teaching/'];
const failures = [];

for (const route of routes) {
  const file = route === '/404.html' ? resolve(root, '404.html') : resolve(root, route.slice(1), 'index.html');
  try { await stat(file); } catch { failures.push(`${route}: output file missing`); continue; }
  const html = await readFile(file, 'utf8');
  const page = parse(html);
  const h1s = page.querySelectorAll('h1');
  if (h1s.length !== 1) failures.push(`${route}: expected one h1; found ${h1s.length}`);
  if (page.querySelectorAll('main').length !== 1) failures.push(`${route}: expected one main landmark`);
  if (!page.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()) failures.push(`${route}: missing description`);
  if (!page.querySelector('link[rel="canonical"]')?.getAttribute('href')) failures.push(`${route}: missing canonical`);
  if (!page.querySelector('link[rel="manifest"]')?.getAttribute('href')) failures.push(`${route}: missing web manifest`);
  if (page.querySelector('meta[name="robots"]')?.getAttribute('content') !== 'noindex,nofollow') failures.push(`${route}: preview must remain noindex`);
  try { JSON.parse(page.querySelector('script[type="application/ld+json"]')?.text || ''); }
  catch { failures.push(`${route}: invalid or missing JSON-LD`); }
  if (/\/wp-content\//i.test(html)) failures.push(`${route}: WordPress media dependency found`);
  if (/href=["']\/murtadha\//i.test(html)) failures.push(`${route}: legacy /murtadha/ internal path found`);
  for (const image of page.querySelectorAll('img')) {
    if (!image.getAttribute('alt')?.trim()) failures.push(`${route}: image missing alt text`);
    if (!image.getAttribute('width') || !image.getAttribute('height')) failures.push(`${route}: image missing intrinsic dimensions`);
  }
  for (const link of page.querySelectorAll('a[target="_blank"]')) {
    const rel = link.getAttribute('rel') || '';
    if (!/\bnoopener\b/.test(rel)) failures.push(`${route}: target="_blank" link missing rel="noopener" (${link.getAttribute('href')})`);
  }
}

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated ${routes.length} static outputs, metadata, landmarks and images.`);
