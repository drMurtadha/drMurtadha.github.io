#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const rawDir = resolve(process.argv[2] || 'audit/raw');
const reportDir = resolve(process.argv[3] || 'audit/generated');
// Owner-approved current page set: pages created in Aug/Sep 2026 plus legacy-ID
// pages substantially refreshed for the current homepage/navigation in Sep 2026.
const currentPageIds = new Set([7543, 7499, 7464, 7462, 7427, 7421, 7402, 7393, 2036, 292, 265, 83, 45]);
await mkdir(reportDir, { recursive: true });
const load = async (name) => JSON.parse(await readFile(resolve(rawDir, `${name}.json`), 'utf8'));
const [posts, pages, media, categories, tags] = await Promise.all(['posts', 'pages', 'media', 'categories', 'tags'].map(load));
const entities = [...pages.map((x) => ({ ...x, kind: 'page' })), ...posts.map((x) => ({ ...x, kind: 'post' }))];
const unescapeHtml = (value = '') => value.replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&quot;/g, '"').replace(/<[^>]+>/g, '').trim();
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const getLinks = (html = '') => [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((m) => m[1]);
const normalizePath = (link) => {
  try { return new URL(link, 'https://people.utm.my').pathname; } catch { return ''; }
};

const inventory = entities.map((item) => {
  const body = item.content?.rendered || '';
  const links = getLinks(body);
  return {
    id: item.id,
    type: item.kind,
    status: item.status,
    date: item.date,
    modified: item.modified,
    slug: item.slug,
    title: unescapeHtml(item.title?.rendered),
    legacyUrl: item.link,
    canonical: item.yoast_head_json?.canonical || item.link,
    targetPath: normalizePath(item.link).replace(/^\/murtadha/, '') || '/',
    internalLinks: links.filter((x) => /^(?:https?:)?\/\/people\.utm\.my\/murtadha|^\//i.test(x)).length,
    externalLinks: links.filter((x) => /^https?:\/\//i.test(x) && !/people\.utm\.my/i.test(x)).length,
    doiLinks: links.filter((x) => /doi\.org|\bdoi:/i.test(x)).length,
    orcidLinks: links.filter((x) => /orcid\.org/i.test(x)).length,
    scopusLinks: links.filter((x) => /scopus\.com/i.test(x)).length,
  };
});

const headers = Object.keys(inventory[0]);
await writeFile(resolve(reportDir, 'content-inventory.csv'), `${headers.join(',')}\n${inventory.map((row) => headers.map((key) => csv(row[key])).join(',')).join('\n')}\n`);
await writeFile(resolve(reportDir, 'url-mapping.csv'), `legacy_url,target_path,type,source_status,migration_decision,publish_on_new_site,redirect_required\n${inventory.map((x) => {
  const excluded = x.type === 'post';
  const legacyPage = x.type === 'page' && !currentPageIds.has(x.id);
  const omit = excluded || legacyPage;
  const decision = excluded ? 'exclude-legacy-post' : legacyPage ? 'exclude-legacy-page' : 'migrate-current-page';
  return [csv(x.legacyUrl), csv(omit ? '' : x.targetPath), x.type, x.status, decision, omit ? 'no' : 'yes', omit ? 'no' : 'host-only'].join(',');
}).join('\n')}\n`);

const allLinks = entities.flatMap((item) => getLinks(item.content?.rendered).map((url) => ({ source: item.link, url })));
const linkRows = [...new Map(allLinks.map((x) => [`${x.source}\n${x.url}`, x])).values()];
await writeFile(resolve(reportDir, 'links.csv'), `source,url,classification\n${linkRows.map((x) => [csv(x.source), csv(x.url), /people\.utm\.my\/murtadha|^\//i.test(x.url) ? 'internal' : /^https?:/i.test(x.url) ? 'external' : 'other'].join(',')).join('\n')}\n`);

const pdfs = media.filter((item) => item.mime_type === 'application/pdf' || /\.pdf(?:$|\?)/i.test(item.source_url || ''));
const researchLinks = linkRows.filter((x) => /doi\.org|orcid\.org|scopus\.com|researcherid|webofscience/i.test(x.url));
const externalLinks = linkRows.filter((x) => /^https?:\/\//i.test(x.url) && !/people\.utm\.my/i.test(x.url));
const externalDomains = {};
for (const { url } of externalLinks) {
  try { const host = new URL(url.replaceAll('&#038;', '&')).hostname.toLowerCase(); externalDomains[host] = (externalDomains[host] || 0) + 1; } catch {}
}
const sensitiveTitlePattern = /markah|grade|student|pelajar|borang|viva|sijil|kad|cuti|receipt|payment|passport|ic\b/i;
const summary = {
  generatedAt: new Date().toISOString(),
  counts: { posts: posts.length, pages: pages.length, media: media.length, pdfs: pdfs.length, categories: categories.length, tags: tags.length, uniqueLinks: linkRows.length, researchProfileLinks: researchLinks.length },
  dateRange: { oldest: posts.map((x) => x.date).sort()[0], newest: posts.map((x) => x.date).sort().at(-1) },
  statuses: Object.groupBy(entities, (x) => x.status),
  mediaTypes: Object.groupBy(media, (x) => x.mime_type || 'unknown'),
  linkClasses: {
    internal: linkRows.filter((x) => /people\.utm\.my\/murtadha|^\//i.test(x.url)).length,
    external: externalLinks.length,
    other: linkRows.filter((x) => !/people\.utm\.my\/murtadha|^\/|^https?:/i.test(x.url)).length,
  },
  topExternalDomains: Object.entries(externalDomains).sort((a, b) => b[1] - a[1]).slice(0, 50).map(([domain, count]) => ({ domain, count })),
  canonicalOverrides: inventory.filter((x) => x.canonical !== x.legacyUrl).map((x) => ({ legacyUrl: x.legacyUrl, canonical: x.canonical })),
  researchLinks,
  pdfs: pdfs.map((x) => ({ id: x.id, title: unescapeHtml(x.title?.rendered), url: x.source_url, parent: x.post, privacyReview: sensitiveTitlePattern.test(unescapeHtml(x.title?.rendered)) })),
};
summary.statuses = Object.fromEntries(Object.entries(summary.statuses).map(([key, value]) => [key, value.length]));
summary.mediaTypes = Object.fromEntries(Object.entries(summary.mediaTypes).map(([key, value]) => [key, value.length]));
await writeFile(resolve(reportDir, 'audit-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary.counts, null, 2));
