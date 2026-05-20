// Build helper (removed at finishing). Deterministically regenerates
// semanas/04/slides/index.html from _scaffold.html (the editable Task-0
// scaffold + shared helpers) + the _section-N.html fragments. Run from
// anywhere:  node semanas/04/slides/_assemble.mjs
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));

let html = readFileSync(join(DIR, '_scaffold.html'), 'utf8');

// 1. Wire the animation source files (after notes.js, before the inline init script).
const notesTag = '<script src="../../../node_modules/reveal.js/plugin/notes/notes.js"></script>';
html = html.replace(
  notesTag,
  notesTag +
    '\n  <script src="four-loop-anim.js"></script>' +
    '\n  <script src="clickable-steps.js"></script>'
);

// 2. Splice each section fragment; collect its init <script> block.
const initBlocks = [];
for (let n = 1; n <= 14; n++) {
  const f = join(DIR, `_section-${n}.html`);
  const marker = `<!-- INJECT_SECTION_${n} -->`;
  if (!existsSync(f)) continue;
  let frag = readFileSync(f, 'utf8');

  // Pull out the delimited init block, if any.
  const re = new RegExp(
    `<!-- INIT-SCRIPTS-\\S+-START -->([\\s\\S]*?)<!-- INIT-SCRIPTS-\\S+-END -->`
  );
  const m = frag.match(re);
  if (m) {
    initBlocks.push(`  <!-- init §${n} -->\n${m[1].trim()}`);
    frag = frag.replace(re, '').trimEnd();
  }
  if (!html.includes(marker)) {
    console.error(`WARN: marker for §${n} not found`);
    continue;
  }
  // Group this section's slides into a reveal.js vertical stack so the
  // deck is 2D like semana 01-03: left/right between sections, up/down
  // within a section. Hoist the leading scoped <style> out of the wrapper
  // (it applies globally regardless of DOM position; reveal ignores
  // non-<section> children of .slides for navigation).
  frag = frag.trim();
  let styleBlock = '';
  const sm = frag.match(/^\s*<style>[\s\S]*?<\/style>\s*/);
  if (sm) {
    styleBlock = sm[0].trim() + '\n';
    frag = frag.slice(sm[0].length).trim();
  }
  const wrapped = `${styleBlock}<section>\n${frag}\n</section>`;
  html = html.split(marker).join(wrapped);
}

// 3. Insert collected init scripts after the Reveal.initialize block.
// Use a regex so we tolerate CRLF line endings on Windows checkouts of the
// scaffold; otherwise the literal-string match silently no-ops and we ship
// an index.html with zero init scripts.
if (initBlocks.length) {
  const injected = html.replace(
    /  <\/script>\r?\n<\/body>/,
    '  </script>\n\n' + initBlocks.join('\n\n') + '\n</body>'
  );
  if (injected === html) {
    console.error('ERROR: failed to inject init blocks — injection marker not found in scaffold');
    process.exit(1);
  }
  html = injected;
}

const out = join(DIR, 'index.html');
writeFileSync(out, html);

const open = (html.match(/<section/g) || []).length;
const close = (html.match(/<\/section>/g) || []).length;
const left = (html.match(/INJECT_SECTION_/g) || []).length;
console.log(
  `assembled -> ${out}\n  sections: ${open} open / ${close} close` +
    `\n  unfilled markers: ${left}\n  init blocks: ${initBlocks.length}`
);
