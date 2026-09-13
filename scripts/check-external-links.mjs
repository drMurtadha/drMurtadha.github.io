#!/usr/bin/env node
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { parse } from 'node-html-parser';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));

const scope = String(args.scope || 'audit');
const output = resolve(String(args.out || (
  scope === 'site'
    ? 'audit/generated/external-link-status-current-site.json'
    : 'audit/generated/external-link-status.json'
)));
const defaultLimit = scope === 'site' ? 500 : 25;
const limit = Math.max(1, Math.min(Number(args.limit || defaultLimit), 2000));
const timeoutMs = Math.max(1000, Math.min(Number(args.timeout || 12000), 30000));
const delayMs = Math.max(0, Math.min(Number(args.delay || 250), 5000));

async function walkHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(path));
    else if (extname(entry.name) === '.html') files.push(path);
  }
  return files;
}

async function siteUrls(directory) {
  const urls = [];
  for (const file of await walkHtml(directory)) {
    const page = parse(await readFile(file, 'utf8'));
    for (const anchor of page.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href')?.replaceAll('&amp;', '&').trim();
      if (href?.startsWith('http://') || href?.startsWith('https://')) urls.push(href);
    }
  }
  return [...new Set(urls)];
}

async function auditUrls(source) {
  const report = JSON.parse(await readFile(source, 'utf8'));
  return [...new Set(report.researchLinks.map((item) => item.url.replaceAll('&#038;', '&')))];
}

function classify(status, error) {
  if (error) return error === 'timeout' ? 'timeout' : 'transport-error';
  if (status >= 200 && status < 400) return 'reachable';
  if ([401, 403, 429, 999].includes(status)) return 'access-controlled';
  if ([404, 410].includes(status)) return 'broken';
  if (status >= 500) return 'server-error';
  return 'other-response';
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  const headers = { 'user-agent': 'drMurtadha-migration-link-audit/0.2' };
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers });
    if ([405, 501].includes(response.status)) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { ...headers, range: 'bytes=0-0' } });
    }
    return {
      url,
      status: response.status,
      classification: classify(response.status),
      finalUrl: response.url,
      elapsedMs: Date.now() - started
    };
  } catch (error) {
    const message = error.name === 'AbortError' ? 'timeout' : error.message;
    return { url, status: null, classification: classify(0, message), error: message, elapsedMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

const discovered = scope === 'site'
  ? await siteUrls(resolve(String(args.dir || 'dist')))
  : await auditUrls(resolve(String(args.source || 'audit/generated/audit-summary.json')));
const urls = discovered.slice(0, limit);
const results = [];
for (const url of urls) {
  const result = await check(url);
  results.push(result);
  console.log(`${result.status ?? 'ERR'} [${result.classification}] ${url}`);
  if (delayMs) await new Promise((done) => setTimeout(done, delayMs));
}

const classifications = Object.fromEntries(
  [...new Set(results.map((item) => item.classification))]
    .sort()
    .map((classification) => [classification, results.filter((item) => item.classification === classification).length])
);
await mkdir(resolve(output, '..'), { recursive: true });
await writeFile(output, `${JSON.stringify({
  checkedAt: new Date().toISOString(),
  scope,
  discovered: discovered.length,
  checked: results.length,
  truncated: discovered.length > urls.length,
  timeoutMs,
  delayMs,
  classifications,
  results
}, null, 2)}\n`);

if (String(args.strict) === 'true' && results.some((item) => ['broken', 'server-error', 'timeout', 'transport-error'].includes(item.classification))) {
  process.exitCode = 2;
}
