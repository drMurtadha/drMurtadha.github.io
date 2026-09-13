#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const input = resolve(process.argv[2] || 'src/data/imported-pages/phd-students.json');
const output = resolve(process.argv[3] || 'src/data/people.json');
const source = JSON.parse(await readFile(input, 'utf8'));
const root = parse(source.html);
const clean = (value = '') => value.trim().replace(/\s+/g, ' ');

const currentPhd = root.querySelectorAll('.mm-table tbody tr').map((row) => {
  const [name, programme, role] = row.querySelectorAll('td').map((cell) => clean(cell.text));
  return { name, programme, role };
});
const groups = root.querySelectorAll('.mm-names');
const parseNames = (group) => group?.querySelectorAll('.mm-name').map((item) => ({
  name: clean(item.querySelector('.mm-name__n')?.text),
  detail: clean(item.querySelector('.mm-name__m')?.text)
})) || [];
const currentMasters = parseNames(groups[0]);
const phdGraduates = parseNames(groups[1]);
const mastersGraduates = root.querySelectorAll('.mm-tl__row').map((row) => ({
  category: clean(row.querySelector('.mm-tl__when')?.text),
  names: clean(row.querySelector('.mm-tl__what')?.text).split('·').map((name) => clean(name))
}));

if (currentPhd.length !== 9 || currentMasters.length !== 5 || phdGraduates.length !== 10) {
  throw new Error(`Unexpected supervision counts: ${currentPhd.length} PhD, ${currentMasters.length} Master's, ${phdGraduates.length} graduates.`);
}

const data = {
  generatedFrom: source.legacyUrl,
  sourceModifiedAt: source.sourceModifiedAt,
  summary: { currentStudents: 14, currentPhd: 9, completedSupervisions: 37 },
  currentPhd,
  currentMasters,
  phdGraduates,
  mastersGraduates
};
await writeFile(output, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Built supervision data at ${output}.`);
