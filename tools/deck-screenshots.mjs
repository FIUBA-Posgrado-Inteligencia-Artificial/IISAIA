/**
 * Captura una screenshot por slide de un deck reveal.js y reporta problemas
 * de layout. Pensado para que Claude Code pueda verificar visualmente un deck
 * generado con /build-class, algo que la verificacion estructural no cubre.
 *
 * Requiere el server corriendo (`npm start`).
 *
 * Uso:
 *   node tools/deck-screenshots.mjs 00
 *   node tools/deck-screenshots.mjs 00 --out .screenshots/00
 *   node tools/deck-screenshots.mjs 00 --base http://localhost:3000
 *
 * Cada slide se captura con todos sus fragments revelados, que es el estado
 * en el que el desborde aparece. Sale con codigo 1 si alguna slide desborda.
 */

import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const week = argv[0];

if (!week || week.startsWith('--')) {
  console.error('Falta el numero de semana. Ej: node tools/deck-screenshots.mjs 00');
  process.exit(2);
}

const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const base = flag('base', 'http://localhost:3000');
const outDir = flag('out', path.join('.screenshots', week));
const url = `${base}/semanas/${week}/slides/`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push(String(e)));

const response = await page.goto(url, { waitUntil: 'networkidle' });
if (!response || !response.ok()) {
  console.error(`No se pudo cargar ${url} (status ${response ? response.status() : 'sin respuesta'}).`);
  console.error('Esta corriendo el server? Levantalo con: npm start');
  await browser.close();
  process.exit(2);
}

await page.waitForFunction(() => window.Reveal && window.Reveal.isReady());

// Sin esto, la captura agarra la slide anterior a mitad del fade y sale
// un fantasma superpuesto que parece un bug del deck y no lo es.
await page.evaluate(() => {
  window.Reveal.configure({ transition: 'none', backgroundTransition: 'none' });
});

const total = await page.evaluate(() => window.Reveal.getTotalSlides());

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const overflowing = [];

for (let i = 0; i < total; i++) {
  // Ir a la slide i y revelar todos sus fragments: el desborde aparece
  // recien con el contenido completo en pantalla.
  await page.evaluate((index) => {
    const { h, v } = window.Reveal.getIndices(window.Reveal.getSlides()[index]);
    window.Reveal.slide(h, v);
  }, i);

  // eslint-disable-next-line no-await-in-loop
  while (await page.evaluate(() => window.Reveal.nextFragment())) {
    // avanza hasta agotar los fragments de la slide
  }

  await page.waitForTimeout(180);

  const info = await page.evaluate(() => {
    const el = document.querySelector('section.present');
    if (!el) return null;
    const heading = el.querySelector('h1, h2');
    return {
      title: heading ? heading.textContent.trim() : '(sin encabezado)',
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      fragments: el.querySelectorAll('.fragment').length,
    };
  });

  const label = String(i + 1).padStart(2, '0');
  await page.screenshot({ path: path.join(outDir, `slide-${label}.png`) });

  // 4px de tolerancia: reveal.js redondea alturas y produce falsos positivos.
  const overflow = info && info.scrollHeight - info.clientHeight > 4;
  if (overflow) overflowing.push({ n: i + 1, ...info });

  console.log(
    `slide ${label}  ${overflow ? 'DESBORDA' : 'ok      '}  ` +
      `${String(info?.fragments ?? 0).padStart(2)} fragments  ${info?.title ?? ''}`
  );
}

await browser.close();

console.log(`\n${total} slides capturadas en ${outDir}/`);

if (consoleErrors.length) {
  console.log(`\nErrores de consola (${consoleErrors.length}):`);
  for (const e of consoleErrors.slice(0, 10)) console.log(`  - ${e}`);
}

if (overflowing.length) {
  console.log(`\nSlides que desbordan vertical (${overflowing.length}):`);
  for (const s of overflowing) {
    console.log(`  - slide ${s.n} "${s.title}": ${s.scrollHeight}px de contenido en ${s.clientHeight}px de canvas`);
  }
  process.exit(1);
}

console.log('\nNinguna slide desborda.');
