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
for (let n = 1; n <= 12; n++) {
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
  html = html.split(marker).join(frag.trim());
}

// 3. Insert collected init scripts after the Reveal.initialize block.
if (initBlocks.length) {
  html = html.replace(
    '  </script>\n</body>',
    '  </script>\n\n' + initBlocks.join('\n\n') + '\n</body>'
  );
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
