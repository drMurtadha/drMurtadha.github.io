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

const policy = JSON.parse(await readFile(resolve('src/data/migration-policy.json'), 'utf8'));
const assetPolicy = JSON.parse(await readFile(resolve('src/data/asset-policy.json'), 'utf8'));
const academicProfile = JSON.parse(await readFile(resolve('src/data/academic-profile.json'), 'utf8'));
const publicationData = JSON.parse(await readFile(resolve('src/data/publications.json'), 'utf8'));
const peopleData = JSON.parse(await readFile(resolve('src/data/people.json'), 'utf8'));
const approvedImagePaths = new Set(assetPolicy.images.map((asset) => asset.path));
const approvedDocumentPaths = new Set(assetPolicy.documents.map((asset) => asset.path));
const importedDir = resolve('src/data/imported-pages');
const importedFiles = (await readdir(importedDir)).filter((name) => name.endsWith('.json') && name !== 'manifest.json');
if (academicProfile.metrics.scopus.hIndex !== 15) {
  console.error(`Expected verified Scopus h-index 15; found ${academicProfile.metrics.scopus.hIndex}.`);
  failures += 1;
}
if (publicationData.count !== 79 || publicationData.records.length !== 79) {
  console.error(`Expected 79 detailed publication records; found ${publicationData.records.length}.`);
  failures += 1;
}
if (peopleData.currentPhd.length !== 9 || peopleData.currentMasters.length !== 5 || peopleData.summary.currentStudents !== 14) {
  console.error('Structured supervision data no longer matches the approved current-page snapshot.');
  failures += 1;
}
if (importedFiles.length !== policy.pages.currentCount) {
  console.error(`Expected ${policy.pages.currentCount} approved page records; found ${importedFiles.length}.`);
  failures += 1;
}
for (const file of importedFiles) {
  const record = JSON.parse(await readFile(resolve(importedDir, file), 'utf8'));
  if (!policy.pages.currentPageIds.includes(record.legacyId)) {
    console.error(`Unapproved WordPress page imported: ${file} (${record.legacyId})`);
    failures += 1;
  }
  for (const forbidden of [/<script\b/i, /\/wp-content\//i, /href=["']\/murtadha\//i, /wp-block-post\b/i]) {
    if (forbidden.test(record.html)) {
      console.error(`Forbidden legacy/runtime content in ${file}: ${forbidden}`);
      failures += 1;
    }
  }
  for (const match of record.html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    if (!approvedImagePaths.has(match[1])) {
      console.error(`Unapproved image in ${file}: ${match[1]}`);
      failures += 1;
    }
  }
  for (const match of record.html.matchAll(/<a\b[^>]*\bhref=["'](\/assets\/documents\/[^"']+)["']/gi)) {
    if (!approvedDocumentPaths.has(match[1])) {
      console.error(`Unapproved document in ${file}: ${match[1]}`);
      failures += 1;
    }
  }
}
if (failures) process.exit(1);
console.log(`Content validation passed (${importedFiles.length} approved pages; legacy posts excluded).`);
