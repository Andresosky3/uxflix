#!/usr/bin/env node
/* Rebuild the 15 local PNG covers. Requires Playwright for authoring only.
 * Start the local site first: npm start
 * Optional environment variables:
 * UXFLIX_PLAYWRIGHT_MODULE: path to an installed playwright module
 * UXFLIX_CHROME_EXECUTABLE: Chrome/Chromium executable path
 * UXFLIX_BASE_URL: site URL (default http://127.0.0.1:5173/)
 */
'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const baseUrl = process.env.UXFLIX_BASE_URL || 'http://127.0.0.1:5173/';

async function main() {
  let chromium;
  try {
    ({ chromium } = require(process.env.UXFLIX_PLAYWRIGHT_MODULE || 'playwright'));
  } catch {
    throw new Error('Install Playwright for authoring or set UXFLIX_PLAYWRIGHT_MODULE to its installed module path.');
  }
  const launchOptions = process.env.UXFLIX_CHROME_EXECUTABLE
    ? { executablePath: process.env.UXFLIX_CHROME_EXECUTABLE }
    : { channel: 'chrome' };
  const browser = await chromium.launch({ ...launchOptions, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 560, height: 372 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="${baseUrl}"><link rel="stylesheet" href="scripts/cover-template.css"></head><body><div id="cover-root"></div></body></html>`, { waitUntil: 'networkidle' });
    for (const source of ['content.js', 'metadata.js', 'compact-previews.js', 'scripts/cover-template.js']) {
      await page.addScriptTag({ content: await fs.readFile(path.join(root, source), 'utf8') });
    }
    const destination = path.join(root, 'assets', 'covers');
    await fs.mkdir(destination, { recursive: true });
    const episodes = await page.evaluate(() => window.UXFLIX_CONTENT.map(episode => episode.id));
    const checks = [];
    for (const id of episodes) {
      await page.evaluate(id => {
        const episode = window.UXFLIX_CONTENT.find(item => item.id === id);
        const season = window.UXFLIX_SEASONS.find(item => item.id === episode.season);
        const compact = window.UXFLIX_COMPACT_PREVIEWS?.[id];
        document.querySelector('#cover-root').innerHTML = window.UXFLIX_COVER_TEMPLATE.render(episode, season, compact);
      }, id);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        })));
      });
      const check = await page.evaluate(() => {
        const root = document.querySelector('#cover-root');
        const broken = [...root.querySelectorAll('img')].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute('src'));
        const title = root.querySelector('.cover-copy h1');
        const subtitle = root.querySelector('.cover-copy p');
        const artifact = root.querySelector('.cover-artifact');
        const titleBox = title?.getBoundingClientRect();
        const subtitleBox = subtitle?.getBoundingClientRect();
        const artifactBox = artifact?.getBoundingClientRect();
        return { broken, title: title?.textContent, titleBottom: titleBox?.bottom, subtitleBottom: subtitleBox?.bottom, artifactTop: artifactBox?.top, overflow: title ? title.scrollWidth > title.clientWidth || (subtitleBox.bottom > artifactBox.top - 10) : false };
      });
      if (check.broken.length || check.overflow) throw new Error(`Episode ${id} cover has missing assets or text overlap: ${JSON.stringify(check)}`);
      const name = `uxflix-episodio-${String(id).padStart(2, '0')}.png`;
      await page.locator('#cover-root').screenshot({ path: path.join(destination, name), animations: 'disabled' });
      checks.push({ id, file: name, ...check });
      console.log(`assets/covers/${name}`);
    }
    if (episodes.length !== 15) throw new Error(`Expected 15 episode covers; rendered ${episodes.length}.`);
    console.log('Verified all 15 covers: local assets loaded and headline/step text fits.');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
