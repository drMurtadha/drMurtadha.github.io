#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const input = resolve(process.argv[2] || 'src/data/imported-pages/scopus-indexed-publications.json');
const output = resolve(process.argv[3] || 'src/data/publications.json');
const source = JSON.parse(await readFile(input, 'utf8'));
const root = parse(source.html);
let currentYear;
const records = [];

for (const node of root.querySelectorAll('.mm-year, .mm-rec')) {
  if (node.classList.contains('mm-year')) {
    currentYear = Number(node.text.trim());
    continue;
  }
  const title = node.querySelector('.mm-rec__title')?.text.trim().replace(/\s+/g, ' ');
  const venueText = node.querySelector('.mm-rec__venue')?.text.trim().replace(/\s+/g, ' ') || '';
  const [venue, type] = venueText.split('·').map((value) => value.trim());
  const citations = Number(node.querySelector('.mm-rec__cite strong')?.text.trim() || 0);
  const url = node.querySelector('.mm-rec__cite a')?.getAttribute('href') || null;
  if (currentYear && title) records.push({ year: currentYear, title, venue, type: type || null, citations, url });
}

if (records.length !== 79) throw new Error(`Expected 79 detailed Scopus records; found ${records.length}.`);
await writeFile(output, `${JSON.stringify({ generatedFrom: source.legacyUrl, sourceModifiedAt: source.sourceModifiedAt, count: records.length, records }, null, 2)}\n`);
console.log(`Built ${records.length} structured publication records at ${output}.`);
