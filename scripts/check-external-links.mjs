#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const source = resolve(String(args.source || 'audit/generated/audit-summary.json'));
const output = resolve(String(args.out || 'audit/generated/external-link-status.json'));
const limit = Math.max(1, Math.min(Number(args.limit || 25), 500));
const timeoutMs = Math.max(1000, Math.min(Number(args.timeout || 12000), 30000));
const report = JSON.parse(await readFile(source, 'utf8'));
const urls = [...new Set(report.researchLinks.map((item) => item.url.replaceAll('&#038;', '&')))].slice(0, limit);

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'drMurtadha-migration-link-audit/0.1' } });
    if (response.status === 405) response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'drMurtadha-migration-link-audit/0.1', range: 'bytes=0-0' } });
    return { url, status: response.status, ok: response.ok, finalUrl: response.url, elapsedMs: Date.now() - started };
  } catch (error) {
    return { url, status: null, ok: false, error: error.name === 'AbortError' ? 'timeout' : error.message, elapsedMs: Date.now() - started };
  } finally { clearTimeout(timer); }
}

const results = [];
for (const url of urls) {
  const result = await check(url);
  results.push(result);
  console.log(`${result.status ?? 'ERR'} ${url}`);
  await new Promise((done) => setTimeout(done, 250));
}
await mkdir(resolve(output, '..'), { recursive: true });
await writeFile(output, `${JSON.stringify({ checkedAt: new Date().toISOString(), limitedTo: limit, timeoutMs, results }, null, 2)}\n`);
if (results.some((item) => !item.ok)) process.exitCode = 2;
