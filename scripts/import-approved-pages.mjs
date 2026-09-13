#!/usr/bin/env node
import { parse } from 'node-html-parser';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const snapshotPath = resolve(process.argv[2] || 'audit/raw/pages.json');
const outputDir = resolve(process.argv[3] || 'src/data/imported-pages');
const policy = JSON.parse(await readFile(resolve('src/data/migration-policy.json'), 'utf8'));
const pages = JSON.parse(await readFile(snapshotPath, 'utf8'));
const approved = new Set(policy.pages.currentPageIds);

const routeMap = new Map([
  ['/murtadha/', '/'],
  ['/murtadha/home/', '/'],
  ['/murtadha/research-areasinterest/', '/research/'],
  ['/murtadha/scopus-indexed-publications/', '/publications/'],
  ['/murtadha/web-of-science-indexed-publications/', '/publications/web-of-science/'],
  ['/murtadha/other-publications/', '/publications/other/'],
  ['/murtadha/verified-non-indexed-publications/', '/publications/non-indexed/'],
  ['/murtadha/publications/', '/publications/'],
  ['/murtadha/phd-students/', '/people/'],
  ['/murtadha/teaching/', '/teaching/'],
  ['/murtadha/consultancy-industry-engagement/', '/impact/'],
  ['/murtadha/biography/', '/biography/'],
  ['/murtadha/cv/', '/cv/'],
  ['/murtadha/social-media/', '/connect/'],
]);

function stripTags(value = '') {
  return parse(value).text.trim().replace(/\s+/g, ' ');
}

function cleanPage(page) {
  let source = page.content.rendered;
  const contentStart = source.match(/<div id=["']ni-main["'][^>]*><\/div>/i);
  if (contentStart) source = source.slice(contentStart.index + contentStart[0].length);
  const footerStart = source.search(/<footer class=["'][^"']*ni-footer/i);
  if (footerStart >= 0) source = source.slice(0, footerStart);
  const site = parse(source, { comment: false });
  for (const selector of ['.ni-archive', '#notes', '.wp-block-query', 'script', 'style', 'noscript', 'form']) {
    for (const element of site.querySelectorAll(selector)) element.remove();
  }
  for (const image of site.querySelectorAll('img')) {
    const alt = image.getAttribute('alt') || image.getAttribute('title') || 'Image';
    image.replaceWith(`<span class="media-review-placeholder" role="img" aria-label="${alt.replaceAll('"', '&quot;')}"><small>Media pending review</small><span>${alt}</span></span>`);
  }
  for (const anchor of site.querySelectorAll('a')) {
    const href = anchor.getAttribute('href');
    if (!href) continue;
    if (/\/wp-content\//i.test(href)) {
      const label = anchor.text.trim().replace(/\s+/g, ' ') || 'Download';
      anchor.replaceWith(`<span class="media-download-placeholder"><small>Download pending media review</small><span>${label}</span></span>`);
      continue;
    }
    if (routeMap.has(href)) anchor.setAttribute('href', routeMap.get(href));
    else if (href.startsWith('/murtadha/')) anchor.setAttribute('href', href.replace('/murtadha/', '/'));
    else if (href.startsWith('https://people.utm.my/murtadha/')) {
      const path = new URL(href).pathname;
      anchor.setAttribute('href', routeMap.get(path) || path.replace('/murtadha/', '/'));
    }
    if (/^https?:\/\//.test(anchor.getAttribute('href') || '')) {
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  }
  return site.innerHTML.trim();
}

await mkdir(outputDir, { recursive: true });
const selected = pages.filter((page) => approved.has(page.id));
if (selected.length !== approved.size) throw new Error(`Expected ${approved.size} approved pages; found ${selected.length}.`);

const manifest = [];
for (const page of selected) {
  const html = cleanPage(page);
  const record = {
    legacyId: page.id,
    slug: page.slug,
    title: stripTags(page.title.rendered),
    description: stripTags(html).slice(0, 280),
    legacyUrl: page.link,
    sourceModifiedAt: page.modified,
    html,
  };
  await writeFile(resolve(outputDir, `${page.slug}.json`), `${JSON.stringify(record, null, 2)}\n`);
  manifest.push({ legacyId: record.legacyId, slug: record.slug, title: record.title, sourceModifiedAt: record.sourceModifiedAt });
}
await writeFile(resolve(outputDir, 'manifest.json'), `${JSON.stringify(manifest.sort((a, b) => a.legacyId - b.legacyId), null, 2)}\n`);
console.log(`Imported ${manifest.length} approved pages into ${outputDir}.`);
