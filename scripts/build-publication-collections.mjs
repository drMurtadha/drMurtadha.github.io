#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sources = [
  { key: 'web-of-science', file: 'web-of-science-indexed-publications.json', title: 'Web of Science-indexed publications', label: 'Web of Science Core Collection', expected: 35 },
  { key: 'other', file: 'other-publications.json', title: 'Other verified publications', label: 'RADIS-verified outputs', expected: 40 },
  { key: 'non-indexed', file: 'verified-non-indexed-publications.json', title: 'Verified non-indexed publications', label: 'Institutionally verified records', expected: 5 }
];
const inputDir = resolve(process.argv[2] || 'src/data/imported-pages');
const output = resolve(process.argv[3] || 'src/data/publication-collections.json');
const collections = {};

for (const sourceInfo of sources) {
  const source = JSON.parse(await readFile(resolve(inputDir, sourceInfo.file), 'utf8'));
  const root = parse(source.html);
  let year;
  const records = [];
  for (const node of root.querySelectorAll('.mm-year, .mm-rec')) {
    if (node.classList.contains('mm-year')) { year = Number(node.text.trim()); continue; }
    const title = node.querySelector('.mm-rec__title')?.text.trim().replace(/\s+/g, ' ');
    const venueText = node.querySelector('.mm-rec__venue')?.text.trim().replace(/\s+/g, ' ') || '';
    const [venue, type] = venueText.split('·').map((value) => value.trim());
    const cite = node.querySelector('.mm-rec__cite');
    const strong = cite?.querySelector('strong');
    const citations = strong ? Number(strong.text.trim()) : null;
    const status = strong ? null : cite?.text.trim().replace(/\s+/g, ' ') || null;
    const url = cite?.querySelector('a')?.getAttribute('href') || null;
    if (year && title) records.push({ year, title, venue, type: type || null, citations, status, url });
  }
  if (records.length !== sourceInfo.expected) throw new Error(`Expected ${sourceInfo.expected} records for ${sourceInfo.key}; found ${records.length}.`);
  collections[sourceInfo.key] = { ...sourceInfo, file: undefined, generatedFrom: source.legacyUrl, sourceModifiedAt: source.sourceModifiedAt, records };
}

await writeFile(output, `${JSON.stringify(collections, null, 2)}\n`);
console.log(`Built ${Object.keys(collections).length} publication collections at ${output}.`);
