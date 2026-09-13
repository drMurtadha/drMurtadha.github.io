#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const base = String(args.base || 'https://people.utm.my/murtadha').replace(/\/$/, '');
const outDir = resolve(String(args.out || 'audit/raw'));
const resources = ['posts', 'pages', 'media', 'categories', 'tags', 'users'];

await mkdir(outDir, { recursive: true });

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'drMurtadha-migration-audit/0.1' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return { data: await response.json(), headers: response.headers };
}

async function fetchCollection(resource) {
  const firstUrl = `${base}/wp-json/wp/v2/${resource}?per_page=100&page=1&context=view`;
  const first = await fetchJson(firstUrl);
  const pages = Number(first.headers.get('x-wp-totalpages') || 1);
  const total = Number(first.headers.get('x-wp-total') || first.data.length);
  const records = [...first.data];
  for (let page = 2; page <= pages; page += 1) {
    const result = await fetchJson(`${base}/wp-json/wp/v2/${resource}?per_page=100&page=${page}&context=view`);
    records.push(...result.data);
    process.stdout.write(`\r${resource}: ${records.length}/${total}`);
  }
  process.stdout.write(`\r${resource}: ${records.length}/${total}\n`);
  await writeFile(resolve(outDir, `${resource}.json`), `${JSON.stringify(records, null, 2)}\n`);
  return { resource, total, pages };
}

const index = [];
for (const resource of resources) index.push(await fetchCollection(resource));

for (const resource of ['menus', 'menu-items', 'menu-locations']) {
  const response = await fetch(`${base}/wp-json/wp/v2/${resource}?per_page=100&context=view`);
  const body = await response.json();
  await writeFile(resolve(outDir, `${resource}.json`), `${JSON.stringify(body, null, 2)}\n`);
  index.push({ resource, status: response.status, accessible: response.ok });
}

const api = await fetchJson(`${base}/wp-json/`);
await writeFile(resolve(outDir, 'api-index.json'), `${JSON.stringify(api.data, null, 2)}\n`);
await writeFile(resolve(outDir, 'import-index.json'), `${JSON.stringify({ base, capturedAt: new Date().toISOString(), collections: index }, null, 2)}\n`);
console.log(`Snapshot written to ${outDir}`);
