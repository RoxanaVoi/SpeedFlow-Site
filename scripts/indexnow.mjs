#!/usr/bin/env node
/**
 * IndexNow submission.
 *
 * Reads the freshly built sitemap, compares it with the snapshot from the last
 * run, and submits only the URLs that are new or whose <lastmod> changed. That
 * keeps submissions meaningful — IndexNow is for telling engines "this page
 * changed", not for re-announcing the whole site on every deploy.
 *
 * Run after `astro build`:
 *   node scripts/indexnow.mjs            # submit changed URLs
 *   node scripts/indexnow.mjs --all      # submit every URL (first run / re-index)
 *   node scripts/indexnow.mjs --dry-run  # show what would be sent, send nothing
 *
 * The key file must already be served at https://<host>/<key>.txt containing
 * exactly the key. That file lives in public/ and is committed.
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const STATE = path.join(ROOT, '.indexnow-state.json');
const HOST = 'www.speed-flow.ai';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const BATCH = 10000; // IndexNow allows up to 10,000 URLs per request

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const submitAll = args.has('--all');

/** Find the key by looking for the <32-hex>.txt file in public/. */
async function findKey() {
  const files = await readdir(path.join(ROOT, 'public'));
  const keyFile = files.find(f => /^[a-f0-9]{8,128}\.txt$/i.test(f));
  if (!keyFile) throw new Error('No IndexNow key file found in public/ (expected <key>.txt)');
  const key = keyFile.replace(/\.txt$/, '');
  const contents = (await readFile(path.join(ROOT, 'public', keyFile), 'utf8')).trim();
  if (contents !== key) {
    throw new Error(`Key file ${keyFile} must contain exactly "${key}", found "${contents}"`);
  }
  return key;
}

/** Collect <loc> + <lastmod> pairs from every sitemap-N.xml in dist/. */
async function readSitemap() {
  if (!existsSync(DIST)) throw new Error('dist/ not found — run `npm run build` first');
  const files = (await readdir(DIST)).filter(f => /^sitemap-\d+\.xml$/.test(f));
  if (files.length === 0) throw new Error('No sitemap-N.xml in dist/');

  const urls = {};
  for (const f of files) {
    const xml = await readFile(path.join(DIST, f), 'utf8');
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = m[1].match(/<loc>(.*?)<\/loc>/)?.[1];
      if (!loc) continue;
      urls[loc] = m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '';
    }
  }
  return urls;
}

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE, 'utf8'));
  } catch {
    return {};
  }
}

async function submit(key, urlList) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `https://${HOST}/${key}.txt`,
      urlList,
    }),
  });
  // 200 = accepted, 202 = accepted but key still being validated. Both are fine.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow returned ${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.status;
}

const key = await findKey();
const current = await readSitemap();
const previous = submitAll ? {} : await loadState();

const changed = Object.keys(current).filter(url => previous[url] !== current[url]);

console.log(`Sitemap: ${Object.keys(current).length} URLs · changed since last run: ${changed.length}`);

if (changed.length === 0) {
  console.log('Nothing to submit.');
  process.exit(0);
}

for (const url of changed.slice(0, 20)) console.log(`  ${url}`);
if (changed.length > 20) console.log(`  … and ${changed.length - 20} more`);

if (dryRun) {
  console.log('\n--dry-run: nothing sent, state not written.');
  process.exit(0);
}

for (let i = 0; i < changed.length; i += BATCH) {
  const batch = changed.slice(i, i + BATCH);
  const status = await submit(key, batch);
  console.log(`Submitted ${batch.length} URLs — HTTP ${status}`);
}

await mkdir(path.dirname(STATE), { recursive: true });
await writeFile(STATE, JSON.stringify(current, null, 2));
console.log('State saved. Next run will only submit what changes.');
