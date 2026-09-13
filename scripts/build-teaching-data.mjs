#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const input = resolve(process.argv[2] || 'src/data/imported-pages/teaching.json');
const output = resolve(process.argv[3] || 'src/data/teaching.json');
const source = JSON.parse(await readFile(input, 'utf8'));
const root = parse(source.html);
const sequence = root.querySelectorAll('.mm-year, .mm-table');
const subjects = [];
let subject;
for (const node of sequence) {
  if (node.classList.contains('mm-year')) {
    subject = { title: node.text.trim().replace(/\s+/g, ' '), entries: [] };
    subjects.push(subject);
    continue;
  }
  if (!subject) continue;
  const headings = node.querySelectorAll('thead th').map((cell) => cell.text.trim());
  subject.entries = node.querySelectorAll('tbody tr').map((row) => Object.fromEntries(row.querySelectorAll('td').map((cell, index) => [headings[index], cell.text.trim().replace(/\s+/g, ' ')])));
}
if (subjects.length !== 12) throw new Error(`Expected 12 teaching subjects; found ${subjects.length}.`);
await writeFile(output, `${JSON.stringify({ generatedFrom: source.legacyUrl, sourceModifiedAt: source.sourceModifiedAt, summary: { undergraduateSubjects: 8, undergraduateSemesterEntries: 28, undergraduateStudents: '702+', postgraduateSubjects: 4, postgraduateSemesterEntries: 20 }, subjects }, null, 2)}\n`);
console.log(`Built ${subjects.length} teaching subjects at ${output}.`);
