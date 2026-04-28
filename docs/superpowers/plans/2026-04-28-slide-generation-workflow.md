# Slide Generation Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/build-class` slash command + `slide-generation` skill that wraps the superpowers pipeline to turn `semanas/NN/source_material/` into polished reveal.js decks; refactor week 01 into a canonical reference.

**Architecture:** A skill at `tools/skills/slide-generation/` provides per-phase scaffolding around `superpowers:brainstorming` → `writing-plans` → `executing-plans` → `verification-before-completion` → `finishing-a-development-branch`. A hard checkpoint at `semanas/NN/spine.md` separates the brainstorm phase from generation. CSS classes from week 01 are extracted into `_config/theme/components.css`; recurring slide patterns are extracted into `shared/patterns/` snippets. JS animations stay untouched.

**Tech Stack:** reveal.js, vanilla JS, CSS custom properties, markdown skill files.

---

## Task 1: Extract CSS class library to `_config/theme/components.css`

**Files:**
- Create: `_config/theme/components.css`
- Reference: `semanas/01/slides/index.html:11-249` (the inline `<style>` block to extract)

The inline `<style>` block in `semanas/01/slides/index.html` contains ~240 lines of CSS with these class clusters: `.pipeline-box` (+ tooltip and arrow), `.flow-step` / `.flow-arrow`, `.rl-attempt` (with `.correct`/`.wrong`), `.stage-box` (with `.highlight`), `.chat-mockup` and children + `@keyframes blink`, `.pipe-grid` with `.pipe-node` / `.pipe-icon` / `.pipe-label` / `.pipe-sub` / `.pipe-arrow`, plus `.pipe-grid.highlight-pre` and `.pipe-grid.highlight-post` group-highlight rules.

Plus, scan the rest of the file for recurring inline `style="..."` patterns to define new classes for. Three to add based on the pattern catalogue from the brainstorm:
- `.comparison-2col` — flexbox row with two equal-width children, gap, alignment for side-by-side comparison.
- `.bg-secondary-card` — `background: var(--bg-secondary)`, `border-radius: 8px`, `padding: 16px` — generic card-style container.
- `.bg-code-card` — `background: var(--bg-code)`, `border-radius: 8px`, `padding: 16px` — for code/data block presentations (different from `.reveal pre` since this is a `<div>` container, not a `<pre>`).

- [ ] **Step 1: Read the full `<style>` block from week 01**

Run: `Read semanas/01/slides/index.html lines 11-249`

Expected: ~238 lines of CSS rules grouped by component.

- [ ] **Step 2: Create `_config/theme/components.css` with the existing classes plus the three new ones**

Write the file with this structure:

```css
/* Component classes for slide patterns.
   Imported by week-template.html (and per-week slides/index.html via the template).
   All classes assume variables from _config/theme/variables.css are available. */

/* ============ Pipeline diagram (pipeline-box / pipeline-arrow) ============ */
.pipeline-box {
  background: var(--bg-secondary);
  border: 1px solid var(--text-muted);
  border-radius: 8px;
  padding: 6px 12px;
  position: relative;
  cursor: default;
  transition: border-color 0.2s, color 0.2s;
}
.pipeline-box:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.pipeline-box .tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-code);
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.85em;
  color: var(--text-primary);
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.pipeline-box .tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--accent);
}
.pipeline-box:hover .tooltip { display: block; }
.pipeline-arrow {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
}
.pipeline-arrow svg {
  width: 24px;
  height: 14px;
}

/* ============ Tool use flow (flow-step / flow-arrow) ============ */
.flow-step {
  background: var(--bg-secondary);
  border: 1px solid var(--text-muted);
  border-radius: 8px;
  padding: 10px 16px;
  text-align: center;
  font-size: 0.8em;
}
.flow-step.active {
  border-color: var(--accent);
  color: var(--accent);
}
.flow-arrow {
  color: var(--text-muted);
  font-size: 1.2em;
}

/* ============ RL attempts (rl-attempt with correct/wrong) ============ */
.rl-attempt {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.7em;
  font-family: var(--font-mono);
  border: 2px solid transparent;
  transition: border-color 0.3s, opacity 0.3s;
}
.rl-attempt.correct { border-color: #27ae60; }
.rl-attempt.wrong { border-color: #e74c3c; opacity: 0.5; }

/* ============ Three-stage diagram (stage-box) ============ */
.stage-box {
  flex: 1;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border: 1px solid var(--text-muted);
}
.stage-box.highlight { border-color: var(--accent); }

/* ============ Chat mockup ============ */
.chat-mockup {
  background: #2a2a3e;
  border-radius: 12px;
  max-width: 520px;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.chat-mockup-header {
  background: #1e1e30;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7em;
  color: var(--text-muted);
}
.chat-mockup-body {
  padding: 20px 18px;
  min-height: 80px;
}
.chat-mockup-input {
  margin: 0 18px 16px;
  background: #1e1e30;
  border: 1px solid #444;
  border-radius: 24px;
  padding: 10px 18px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.7em;
  display: flex;
  align-items: center;
  gap: 8px;
}
.chat-cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}
@keyframes blink {
  50% { opacity: 0; }
}
.chat-bubble {
  background: #3a3a52;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.75em;
  line-height: 1.5;
  color: var(--text-primary);
  max-width: 85%;
}
.chat-bubble.user {
  background: var(--accent);
  color: var(--bg-primary);
  margin-left: auto;
  text-align: right;
}

/* ============ Pipeline roadmap (pipe-grid / pipe-node) ============ */
.pipe-grid {
  display: grid;
  grid-template-columns: auto 24px auto 24px auto 24px auto;
  grid-template-rows: auto 28px auto;
  align-items: center;
  justify-items: center;
  gap: 0;
  font-size: 0.55em;
  margin-top: 12px;
}
.pipe-node {
  background: var(--bg-secondary);
  border: 2px solid #333;
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
  min-width: 110px;
  transition: border-color 0.5s, box-shadow 0.5s, opacity 0.5s;
}
.pipe-node .pipe-icon {
  font-size: 1.6em;
  line-height: 1;
  margin-bottom: 4px;
  color: var(--accent);
}
.pipe-node .pipe-label {
  color: var(--text-primary);
  font-weight: 600;
}
.pipe-node .pipe-sub {
  color: var(--text-muted);
  font-size: 0.85em;
  margin-top: 2px;
}
/* Override reveal.js fragment defaults for pipeline */
.pipe-grid .fragment {
  visibility: inherit;
}
.pipe-grid .pipe-node.fragment {
  opacity: 0.2;
}
.pipe-grid .pipe-node.fragment.visible {
  opacity: 1;
  border-color: var(--accent);
  box-shadow: 0 0 16px rgba(100, 255, 218, 0.15);
}
.pipe-grid .pipe-arrow.fragment {
  opacity: 0;
}
.pipe-grid .pipe-arrow.fragment.visible {
  opacity: 1;
}
/* Group highlights for pipeline roadmap */
.pipe-grid.highlight-pre .pipe-node[data-group="pre"].visible {
  border-color: var(--accent);
  box-shadow: 0 0 24px rgba(100, 255, 218, 0.3), inset 0 0 12px rgba(100, 255, 218, 0.05);
}
.pipe-grid.highlight-pre .pipe-node[data-group="post"].visible {
  opacity: 0.35;
  box-shadow: none;
}
.pipe-grid.highlight-pre .pipe-arrow.visible {
  opacity: 0.3;
}
.pipe-grid.highlight-pre [data-fragment-index="1"].pipe-arrow.visible,
.pipe-grid.highlight-pre [data-fragment-index="2"].pipe-arrow.visible,
.pipe-grid.highlight-pre [data-fragment-index="3"].pipe-arrow.visible,
.pipe-grid.highlight-pre [data-fragment-index="4"].pipe-arrow.visible {
  opacity: 1;
}
.pipe-grid.highlight-post .pipe-node[data-group="post"].visible {
  border-color: var(--accent-secondary);
  box-shadow: 0 0 24px rgba(130, 170, 255, 0.3), inset 0 0 12px rgba(130, 170, 255, 0.05);
}
.pipe-grid.highlight-post .pipe-node[data-group="pre"].visible {
  opacity: 0.35;
  box-shadow: none;
}
.pipe-grid.highlight-post .pipe-arrow.visible {
  opacity: 0.3;
}
.pipe-grid.highlight-post [data-fragment-index="4"].pipe-arrow.visible,
.pipe-grid.highlight-post [data-fragment-index="5"].pipe-arrow.visible,
.pipe-grid.highlight-post [data-fragment-index="6"].pipe-arrow.visible,
.pipe-grid.highlight-post [data-fragment-index="7"].pipe-arrow.visible {
  opacity: 1;
}

/* ============ New utility classes (extracted from recurring inline styles) ============ */

/* Side-by-side comparison row. Two children, equal widths, gap. */
.comparison-2col {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.comparison-2col > * {
  flex: 1;
  min-width: 0;
}

/* Generic card-style container with secondary background. */
.bg-secondary-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
}

/* Code/data block container (a <div>, distinct from .reveal pre which styles <pre>). */
.bg-code-card {
  background: var(--bg-code);
  border-radius: 8px;
  padding: 16px;
}
```

- [ ] **Step 3: Commit**

```bash
git add _config/theme/components.css
git commit -m "feat: extract slide component CSS classes to components.css"
```

---

## Task 2: Refactor `semanas/01/slides/index.html` to use components.css

**Files:**
- Modify: `semanas/01/slides/index.html`

The refactor is two changes:
1. Replace the inline `<style>` block (lines 11-249) with a `<link>` tag for `_config/theme/components.css`.
2. Replace recurring inline `style="..."` patterns with class equivalents (`comparison-2col`, `bg-secondary-card`, `bg-code-card`).

Visual output must be byte-identical (or as close as practical).

- [ ] **Step 1: Replace the inline `<style>` block with a stylesheet link**

In `semanas/01/slides/index.html`, replace lines 11-249 (the entire `<style>...</style>` block) with:

```html
  <link rel="stylesheet" href="../../../_config/theme/components.css">
```

Verify the line numbering: after the existing `<link rel="stylesheet" href="../../../_config/theme/custom.css">`, add the components.css link. The four `<link>` elements in `<head>` should now be: reveal.css, theme/black.css, highlight/monokai.css, custom.css, components.css.

- [ ] **Step 2: Identify recurring inline styles to replace with classes**

Run: `Grep "style=\"display: flex; gap: 20px" semanas/01/slides/index.html` and similar greps to confirm count of inline-style patterns.

Search for:
- `style="display: flex; gap: 20px; align-items: flex-start"` → should map to `class="comparison-2col"` (preserve any extra inline styles).
- `style="background: var(--bg-secondary); border-radius: 8px; padding: 12px"` (with variations) → maps to `class="bg-secondary-card"`.
- `style="background: var(--bg-code); border-radius: 8px; padding: 12px"` (with variations) → maps to `class="bg-code-card"`.

Be conservative: only replace when the inline style EXACTLY matches the class definition. If the inline style has extra rules (e.g., a custom border or different padding), leave it inline. Goal is minimization, not zero inline styles.

- [ ] **Step 3: Apply the class replacements**

For each match found in Step 2, edit the inline style to use the class. Example transformations:

Before:
```html
<div style="display: flex; gap: 20px; align-items: flex-start;">
```

After:
```html
<div class="comparison-2col">
```

Before:
```html
<div style="background: var(--bg-secondary); border-radius: 8px; padding: 12px;">
```

After:
```html
<div class="bg-secondary-card">
```

If the original had additional rules (e.g., `border: 1px solid var(--accent);`), keep those inline alongside the class:

```html
<div class="bg-secondary-card" style="border: 1px solid var(--accent);">
```

- [ ] **Step 4: Verify visual output is unchanged**

Run: `npm start` (in background, or expect the user to run it).

Expected: dev server on `http://localhost:3000`. Open `http://localhost:3000/semanas/01/slides/`. Walk through every slide using arrow keys. Confirm:
- Title slide renders correctly
- Pipeline diagram has correct colors, hover tooltips, fragment opacity
- Chat mockup is centered, has correct typing animation
- All side-by-side comparisons still align
- All animated demos load (tokenizer, training, inference, base-model-chat, etc.)
- All section dividers, pipeline roadmap, RL slides, attention SVG appear correct

If any visual regression: revert the offending change OR fix the class definition in components.css to match exactly what was inline.

- [ ] **Step 5: Commit**

```bash
git add semanas/01/slides/index.html
git commit -m "refactor: use components.css classes in week 01 slides"
```

---

## Task 3: Create pattern snippet library

**Files:**
- Create: `shared/patterns/README.md`
- Create: `shared/patterns/title-slide.html`
- Create: `shared/patterns/section-divider.html`
- Create: `shared/patterns/comparison-2col.html`
- Create: `shared/patterns/pipeline-roadmap.html`
- Create: `shared/patterns/flow-with-arrows.html`
- Create: `shared/patterns/code-walkthrough.html`
- Create: `shared/patterns/chat-mockup.html`
- Create: `shared/patterns/clickable-steps.html`
- Create: `shared/patterns/data-table.html`
- Create: `shared/patterns/metaphor-pages.html`

Each snippet is a bare-bones `<section>` using `components.css` classes, with placeholder content and a leading HTML comment explaining when to use it and pointing to the canonical week 01 example. Snippets are extracted from week 01 — read the relevant lines, generalize the content, save with a leading comment.

- [ ] **Step 1: Create the catalogue index README**

Write `shared/patterns/README.md`:

````markdown
# Slide Pattern Library

Reusable HTML snippets for slide patterns extracted from semana 01. Drop a snippet into a week's `slides/index.html`, replace the placeholder content, and adjust as needed.

All snippets assume `_config/theme/components.css` is loaded by the page.

## Catalogue

| Pattern | When to use | Snippet | Canonical week 01 example |
|---|---|---|---|
| Title slide | Week opener | `title-slide.html` | line 256 |
| Section divider | Major topic transition | `section-divider.html` | line 420 (and 7 others) |
| Comparison 2-col | Contrasting two concepts | `comparison-2col.html` | line 917 ("Supervised vs Self-supervised") |
| Pipeline roadmap | Multi-stage process diagram with re-highlighting | `pipeline-roadmap.html` | line 319 ("Construyamos un LLM") |
| Flow with arrows | Sequential process | `flow-with-arrows.html` | line 1616 ("Conversaciones como datos") |
| Code walkthrough | Code block with optional line highlights | `code-walkthrough.html` | line 818 (tokenizer animation embed) |
| Chat mockup | Chat UI mockup with typing animation | `chat-mockup.html` | line 266 (hook slide) |
| Clickable steps | Multi-step explainer with click-to-reveal detail | `clickable-steps.html` | line 1895 ("Mitigación: enseñar a decir 'no sé'") |
| Data table | Numerical comparison | `data-table.html` | line 1261 ("Mismo stack, otra escala") |
| Metaphor pages | Concrete-domain metaphor (book pages) | `metaphor-pages.html` | line 2243 ("Del libro de texto a la práctica") |

## Adding a new pattern

When generating slides for a new week, if no existing pattern fits a slide, you may invent a new one — but:
1. Add a snippet file in this directory.
2. Add a row to the catalogue table above.
3. Add a leading HTML comment to the snippet file explaining when to use it and pointing to the first real-world example.

This keeps the catalogue growing instead of fragmenting.
````

- [ ] **Step 2: Create snippets in parallel**

The 10 snippet files can be created independently. For each one, the structure is:

```html
<!--
  Pattern: <name>
  When to use: <one sentence>
  Canonical example: semanas/01/slides/index.html:<line>
-->
<section>
  <!-- minimal placeholder using components.css classes -->
</section>
```

Use the canonical week 01 line numbers from the catalogue table to find the source HTML, copy it, replace content with placeholders (Spanish: "Texto del título", "Concepto A", "Concepto B", etc.), and save.

Specific contents:

**`title-slide.html`:**
```html
<!--
  Pattern: Title slide
  When to use: As the first slide of every week (week opener with topic + subtitle).
  Canonical example: semanas/01/slides/index.html:256
-->
<section class="title-slide">
  <h1>Semana NN</h1>
  <p class="subtitle">Título del tema</p>
  <p class="muted">Introducción al desarrollo de software asistido por IA</p>
  <aside class="notes">
    Notas para el docente: cómo abrir la clase, qué proyectar, qué decir mientras los estudiantes se acomodan.
  </aside>
</section>
```

**`section-divider.html`:**
```html
<!--
  Pattern: Section divider
  When to use: Between major topic blocks within a week. Acts as a chapter break.
  Canonical example: semanas/01/slides/index.html:420
-->
<section class="section-divider">
  <h2>Título de la sección</h2>
  <aside class="notes">
    Adelantar de qué va la sección, conectar con lo anterior.
  </aside>
</section>
```

**`comparison-2col.html`:**
```html
<!--
  Pattern: Two-column comparison
  When to use: Contrasting two concepts, approaches, or states side by side.
  Canonical example: semanas/01/slides/index.html:917 ("Supervised vs Self-supervised")
-->
<section>
  <h2>Concepto A vs Concepto B</h2>
  <div class="comparison-2col">
    <div class="bg-secondary-card fragment fade-in" style="border-left: 4px solid var(--accent);">
      <h3 style="color: var(--accent);">Concepto A</h3>
      <p>Descripción breve. Una idea por bloque.</p>
    </div>
    <div class="bg-secondary-card fragment fade-in" style="border-left: 4px solid var(--accent-secondary);">
      <h3 style="color: var(--accent-secondary);">Concepto B</h3>
      <p>Descripción breve. Una idea por bloque.</p>
    </div>
  </div>
  <aside class="notes">
    Explicar el contraste. Por qué importa la diferencia.
  </aside>
</section>
```

**`pipeline-roadmap.html`:**
```html
<!--
  Pattern: Pipeline roadmap
  When to use: A multi-stage process you want to introduce step-by-step and return to throughout
    the week, re-highlighting different groups of nodes. Use group="..." attributes to enable
    .highlight-<group> class on the parent .pipe-grid for re-emphasis later.
  Canonical example: semanas/01/slides/index.html:319 ("Construyamos un LLM")
-->
<section>
  <h2>Construyamos algo</h2>
  <div class="pipe-grid" id="my-pipe">
    <div class="pipe-node fragment" data-group="A" data-fragment-index="0">
      <div class="pipe-icon">●</div>
      <div class="pipe-label">Etapa 1</div>
      <div class="pipe-sub">subtexto</div>
    </div>
    <span class="pipe-arrow fragment" data-fragment-index="1">→</span>
    <div class="pipe-node fragment" data-group="A" data-fragment-index="2">
      <div class="pipe-icon">●</div>
      <div class="pipe-label">Etapa 2</div>
      <div class="pipe-sub">subtexto</div>
    </div>
    <span class="pipe-arrow fragment" data-fragment-index="3">→</span>
    <div class="pipe-node fragment" data-group="B" data-fragment-index="4">
      <div class="pipe-icon">●</div>
      <div class="pipe-label">Etapa 3</div>
      <div class="pipe-sub">subtexto</div>
    </div>
  </div>
  <aside class="notes">
    Roadmap: introducir las etapas en orden. Cada fragmento revela una.
    Más adelante en la clase se puede volver a este diagrama y agregar la clase .highlight-A
    o .highlight-B al .pipe-grid para reenfocar.
  </aside>
</section>
```

**`flow-with-arrows.html`:**
```html
<!--
  Pattern: Flow with arrows
  When to use: A short sequential process (3-5 steps), horizontal layout, with arrows.
  Canonical example: semanas/01/slides/index.html:1616 ("Conversaciones como datos")
-->
<section>
  <h2>Título del proceso</h2>
  <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
    <div class="flow-step">Paso 1</div>
    <span class="flow-arrow">→</span>
    <div class="flow-step">Paso 2</div>
    <span class="flow-arrow">→</span>
    <div class="flow-step active">Paso 3</div>
  </div>
  <aside class="notes">
    Explicar el proceso paso a paso. Marcar el paso clave con .active.
  </aside>
</section>
```

**`code-walkthrough.html`:**
```html
<!--
  Pattern: Code walkthrough
  When to use: Showing code with optional line highlighting. Uses reveal.js highlight plugin.
  Canonical example: semanas/01/slides/index.html:818 (and other code blocks)
-->
<section>
  <h2>Bloque de código</h2>
  <pre><code class="language-python" data-line-numbers="2-3">def ejemplo():
    valor = 42
    return valor
</code></pre>
  <aside class="notes">
    Explicar el código línea por línea. data-line-numbers permite resaltar líneas.
  </aside>
</section>
```

**`chat-mockup.html`:**
```html
<!--
  Pattern: Chat mockup with typing animation
  When to use: Hook/engagement at the start of a week or section to introduce the central mystery.
    Often paired with an inline script that types out the user message character by character.
  Canonical example: semanas/01/slides/index.html:266 (week 01 hook)
-->
<section>
  <h2>Pregunta de apertura</h2>
  <div class="chat-mockup">
    <div class="chat-mockup-header">
      <span>Chat con la IA</span>
    </div>
    <div class="chat-mockup-body">
      <div class="chat-bubble user">¿Qué hay detrás de este cuadro de texto?</div>
    </div>
    <div class="chat-mockup-input">
      <span>Escribir...</span>
      <span class="chat-cursor"></span>
    </div>
  </div>
  <aside class="notes">
    Hook narrativo. Dejar que el cursor parpadee mientras se hace la pregunta abierta.
    Para typing animation, agregar un script inline que escriba carácter por carácter en el bubble.
  </aside>
</section>
```

**`clickable-steps.html`:**
```html
<!--
  Pattern: Clickable steps with detail-on-click
  When to use: A multi-step explainer where students can click each step to see a concrete example
    panel below. The week 01 implementation uses clickable-steps.js as the renderer.
  Canonical example: semanas/01/slides/index.html:1895 ("Mitigación: enseñar a decir 'no sé'")
  Reusable JS: semanas/01/slides/clickable-steps.js (copy and adapt as needed).
-->
<section>
  <h2>Proceso paso a paso</h2>
  <div id="my-clickable-steps"></div>
  <aside class="notes">
    Walkthrough multi-paso. Cada paso muestra un ejemplo cuando se hace clic.
    Copiar clickable-steps.js de la semana 01 y adaptarlo con los pasos de esta sección.
  </aside>
</section>
<script src="clickable-steps.js"></script>
<script>
  initClickableSteps({
    containerId: 'my-clickable-steps',
    steps: [
      { label: 'Paso 1', detail: '<p>Detalle del paso 1.</p>' },
      { label: 'Paso 2', detail: '<p>Detalle del paso 2.</p>' }
    ]
  });
</script>
```

**`data-table.html`:**
```html
<!--
  Pattern: Data table
  When to use: Numerical comparisons (model sizes, costs, memory, parameters) where you want
    students to see scale differences. Use color on values to highlight scale.
  Canonical example: semanas/01/slides/index.html:1261 ("Mismo stack, otra escala")
-->
<section>
  <h2>Comparación numérica</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">
    <thead>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 2px solid var(--text-muted);">Modelo</th>
        <th style="text-align: right; padding: 8px; border-bottom: 2px solid var(--text-muted);">Parámetros</th>
        <th style="text-align: right; padding: 8px; border-bottom: 2px solid var(--text-muted);">Costo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px;">Modelo A</td>
        <td style="text-align: right; padding: 8px; color: var(--accent);">7B</td>
        <td style="text-align: right; padding: 8px;">$X</td>
      </tr>
      <tr>
        <td style="padding: 8px;">Modelo B</td>
        <td style="text-align: right; padding: 8px; color: var(--accent-secondary);">405B</td>
        <td style="text-align: right; padding: 8px;">$Y</td>
      </tr>
    </tbody>
  </table>
  <aside class="notes">
    Hacer concretas las diferencias de escala con números reales.
  </aside>
</section>
```

**`metaphor-pages.html`:**
```html
<!--
  Pattern: Metaphor with three perspective-skewed cards (the "book pages" pattern)
  When to use: Bridging an abstract technical concept to a familiar concrete domain (e.g.,
    learning modes via textbook pages, training pipeline via factory floor).
  Canonical example: semanas/01/slides/index.html:2243 ("Del libro de texto a la práctica")
-->
<section>
  <h2>Del concepto familiar al concepto técnico</h2>
  <div style="display: flex; gap: 24px; justify-content: center; align-items: flex-start; perspective: 800px;">
    <div class="bg-secondary-card" style="width: 200px; transform: rotateY(-15deg); cursor: pointer;">
      <h3 style="color: var(--accent);">Página del libro</h3>
      <p>Descripción del concepto familiar.</p>
    </div>
    <div class="bg-secondary-card" style="width: 200px; cursor: pointer;">
      <h3 style="color: var(--accent);">Otra perspectiva</h3>
      <p>Variación.</p>
    </div>
    <div class="bg-secondary-card" style="width: 200px; transform: rotateY(15deg); cursor: pointer;">
      <h3 style="color: var(--accent);">Tercera perspectiva</h3>
      <p>Otra variación.</p>
    </div>
  </div>
  <aside class="notes">
    Metáfora visual. Cada tarjeta puede tener un click handler que revela el equivalente técnico.
    Ver semana 01 para el patrón de "click → mostrar equivalente en LLM".
  </aside>
</section>
```

- [ ] **Step 3: Verify the directory structure**

Run: `Glob shared/patterns/*`

Expected output: README.md plus 10 .html files.

- [ ] **Step 4: Commit**

```bash
git add shared/patterns/
git commit -m "feat: add slide pattern snippet library"
```

---

## Task 4: Create the slide-generation skill files

**Files:**
- Create: `tools/skills/slide-generation/SKILL.md`
- Create: `tools/skills/slide-generation/voice-and-didactics.md`
- Create: `tools/skills/slide-generation/spine-template.md`
- Create: `tools/skills/slide-generation/animation-pattern.md`

The four files can be created in parallel since they have no inter-dependencies during creation (only at runtime, when the skill loads them).

- [ ] **Step 1: Create `SKILL.md`** (the wrapping skill itself)

```markdown
---
name: slide-generation
description: Use when working in semanas/NN/ directories to generate or refine reveal.js presentation slides for the AI-assisted development course. Wraps the superpowers pipeline (brainstorming → writing-plans → executing-plans → verification → finishing-branch) with slide-specific scaffolding for each phase. Triggered by /build-class. Includes a hard checkpoint at semanas/NN/spine.md before any slide HTML is generated.
---

# Slide Generation

Wraps the superpowers pipeline to turn `semanas/NN/source_material/` into `semanas/NN/slides/index.html` matching the course's established style and didactic voice.

## When to use

- User typed `/build-class` and the current working directory is `semanas/NN/`.
- User asked to "build slides for week N" or "generate the deck for semana N".
- User asked to refine an existing week's slides — in which case, skip phases 1-2 and go straight to phase 3 (execute) on the existing spine and plan, OR run a new spine if the request is large.

## Required context — load these BEFORE phase 1

Read these files at the start of every invocation:
- `semanas/NN/source_material/index.md` and the `.md` files it references
- `programa.md` — find the row for week NN (alcance + temas)
- `_config/slide-conventions.md` — formatting rules
- `tools/skills/slide-generation/voice-and-didactics.md` — voice + didactic principles
- `tools/skills/slide-generation/spine-template.md` — schema for spine.md
- `tools/skills/slide-generation/animation-pattern.md` — animation contract + reuse policy
- `shared/patterns/README.md` — pattern catalogue

## Phase 1: Spine (wraps superpowers:brainstorming)

Invoke `superpowers:brainstorming` with these overrides:

1. **Design-doc target:** `semanas/NN/spine.md`. NOT `docs/superpowers/specs/`.
2. **Schema:** copy the structure from `spine-template.md` exactly. Whole-week through-line first, then per-section.
3. **Question order:**
   - First: propose 2-3 candidate **whole-week through-lines** (different framings of the arc), recommend one, get user agreement.
   - Then: per section in source-material order, ask spine-schema questions (through-line — required; hook — only if it serves the section; analogy — only if one fits; walk-aways — required; animation needs — required; slide budget — required).
4. **Skip these standard brainstorming questions:** "what's the architecture / how will it scale / what tech stack", which don't apply to slide work.
5. **Skip the per-section approach question.** The spine schema fields ARE the structured prompts at section level.

After spine.md is written, ask the user: *"Review and edit `spine.md`. Reply 'go' (or similar) when ready to plan."* This is the **hard checkpoint**. Do not proceed to phase 2 without explicit user approval.

## Phase 2: Plan (wraps superpowers:writing-plans)

Invoke `superpowers:writing-plans` with these overrides:

1. **Plan target:** `semanas/NN/plan.md`. NOT `docs/superpowers/plans/`.
2. **Task chunking:** one task per section in spine order. Plus:
   - First task: setup (verify `slides/index.html` exists or copy from `shared/templates/week-template.html`; verify `img/` exists).
   - Last task: coherence pass (verify section transitions, whole-week through-line is visible, no orphan animations).
3. **Per-task body:** references the corresponding spine entry; lists patterns from `shared/patterns/` likely to apply (concrete suggestions, not exhaustive); calls out any animations needed (reuse-existing or build-new); names speaker-note word target (~80–200 words/slide).
4. Hand straight to phase 3. No extra checkpoint here — the spine.md gate already happened.

## Phase 3: Execute (wraps superpowers:executing-plans)

Invoke `superpowers:executing-plans`. For each section task:

1. Re-read spine.md before starting (anti-drift).
2. Generate the section's slides into `semanas/NN/slides/index.html` (append, or insert at the right structural position).
3. Run the **per-section review checklist** below.
4. Show the section to the user; on approval, move to the next section.

### Per-section review checklist

- [ ] No bullet-list slides — every slide has visual structure (comparison / flow / pattern from `shared/patterns/`). Bullet lists with reveals are NOT acceptable.
- [ ] Voice matches `voice-and-didactics.md` — second-person collaborative ("vamos a", "podés", "recordá"), Spanish technical-but-accessible, no AI filler.
- [ ] One concept per slide.
- [ ] No emojis.
- [ ] Speaker notes present, ~80–200 words each, conversational tone.
- [ ] Section opens with hook from spine if spine specifies one.
- [ ] Key analogy from spine appears as a slide if spine specifies one.
- [ ] All "what students walk away knowing" bullets are addressed somewhere in the section.
- [ ] Patterns used are from `shared/patterns/` (or a new pattern is introduced AND added to the catalogue, not silently inlined).
- [ ] Inline `style="..."` is minimized — uses `_config/theme/components.css` classes where one exists.
- [ ] Animations follow the `init{Name}({ containerId })` contract from `animation-pattern.md`.

## Phase 4: Verify and finish

Invoke `superpowers:verification-before-completion` (open `slides/index.html` locally, walk through, check fragments fire, animations load, no console errors).

Invoke `superpowers:finishing-a-development-branch` (commit any final changes, optionally PR).

## Anti-patterns

- DO NOT generate slides without first writing spine.md and getting user approval.
- DO NOT skip the brainstorming phase even if user says "just generate the slides for week N". Push back: spine first, then slides. The spine is what makes the slides good.
- DO NOT replace any superpowers skill's behavior. Only override targets, schemas, and question scope.
- DO NOT silently invent new slide patterns. Add them to `shared/patterns/` with a row in the catalogue.
- DO NOT touch JS animations unless the spine explicitly calls for a new one.
```

- [ ] **Step 2: Create `voice-and-didactics.md`**

```markdown
# Voice and Didactic Principles

Loaded by the `slide-generation` skill at the start of phase 1 (brainstorm) and consulted at every per-section review checkpoint in phase 3.

## Voice

- **Spanish, technical-but-accessible** for diploma-level students.
- **Second-person collaborative.** Address the student. "Vamos a ver", "podés probar", "recordá que".
- **Imperative for actions.** "Abrí Tik Tokenizer", "ejecutá el script", "mirá la salida".
- **Rhetorical questions for engagement.** "¿Qué pasa si...?", "¿Por qué la red predice esto?".
- **First-person plural for shared discovery.** "Vamos a abrir la caja negra", "estamos viendo cómo".

## Anti-AI-filler vocabulary

Never use:
- "revolucionario", "potenciar", "de vanguardia", "seamless", "robusto", "leverage", "streamline"
- "increíble", "asombroso", "espectacular" as filler intensifiers
- "Bienvenidos a esta increíble jornada de aprendizaje" — no welcome boilerplate.

CTAs and headings must be specific: "Ver tokenización en vivo", not "Empezar".

## Didactic principles distilled from week 01

1. **Hook before explanation.** Open a section with a mystery, question, or visual surprise when the section warrants it. Not every section. Never start with a definition.

2. **Why before what.** Motivate the filter before showing the filter. Motivate the algorithm before naming it. The student should understand the *problem the technique solves* before learning the technique's name.

3. **Layer-by-layer concept building.** Each slide assumes only what came before. Don't reference forward.

4. **Concrete numbers over abstractions.** "15 trillion tokens" not "a lot of data". "100,277 tokens" not "many vocabulary entries". "405B parameters" not "huge".

5. **Analogies bridge to the familiar.** Book pages = learning modes. Spiders = web crawl. Use one when it earns its keep — when an abstract idea becomes graspable through a concrete familiar domain. SKIP when the topic is already concrete enough that an analogy would dilute, not clarify.

6. **No bullet-list slides.** A slide whose entire content is a `<ul>` (with or without fragments) is a code smell. Replace with: a comparison-2col, a flow-with-arrows, a data-table, an annotated diagram, an animated demo. Visual structure carries the meaning.

7. **Live demo > prose explanation** when the concept is observable. If you can show inference happening, run inference. If you can show a tokenizer's output, embed the tokenizer animation.

## Tone calibration

The voice is "smart professor talking to capable students who are seeing this for the first time". It is NOT:
- A textbook (too distant, too dense).
- A blog post (too casual, too marketing).
- A whiteboard scribble (too sparse, too unstructured).

It IS:
- A live lecture script written down.
- The professor's voice as they would speak it, with hooks, analogies, demos, and calls to do something.

## Anti-patterns to refuse

- Bullet-list slides
- Emojis in slide content (anywhere)
- AI-sounding filler vocabulary (above)
- Placeholder text in committed files
- Em-dash overuse — one per slide max
- Gratuitous gradients, glassmorphism, purple-dominant palettes
- Headings that don't inform ("Introducción", "Resumen", "Conclusión" without specifics)
```

- [ ] **Step 3: Create `spine-template.md`**

```markdown
# Spine Template

The schema for `semanas/NN/spine.md`. Phase 1 of the `slide-generation` skill produces this document. It is the hard checkpoint between brainstorm and generation.

## Template (copy verbatim, then fill in)

```markdown
# Spine — Semana NN: <Topic>

**Whole-week through-line:** <One paragraph. The single arc connecting all sections.>

## Section 1: <Title>
**Source material:** `source_material/01-...md`
**Through-line:** <One sentence — the section's argument or arc.>
**Hook:** <Optional. Only when it serves the section. Otherwise omit this line entirely.>
**Key analogy:** <Optional. Only when one fits naturally. Otherwise omit this line entirely.>
**What students walk away knowing:**
- <Bullet 1>
- <Bullet 2>
- <Bullet 3 — keep to 1–3 bullets>
**Animations / interactive:** <None | bespoke (describe what to build) | reuse-existing (which from week 01: tokenizer-anim / training-anim / inference-anim / clickable-steps / etc.)>
**Slide budget:** <rough count, e.g., 4–6>

## Section 2: <Title>
...

## Section N: <Title>
...
```

## Field meanings

- **Whole-week through-line:** The narrative spine of the entire week. The one sentence/paragraph a student would say if asked "what was this week about?" It's NOT a list of topics — it's the argument or arc.
- **Through-line (per section):** Same idea but for the section. What's the one thing this section is making the student understand?
- **Hook:** A specific question, mystery, or visual that opens the section and makes students lean in. OPTIONAL. Don't force one on every section.
- **Key analogy:** A bridge from a familiar concrete domain to the abstract concept. OPTIONAL. Only when one earns its keep.
- **What students walk away knowing:** 1–3 concrete take-aways. Concrete enough that you could test for them.
- **Animations / interactive:** Be specific. If reusing a week 01 animation, name the file. If building new, describe what it shows.
- **Slide budget:** A rough count to keep sections balanced. Not enforced — the executing phase may go over or under.

## What does NOT belong in the spine

- **Pattern sequence** ("section-divider, then comparison-2col, then..."). Generation-time decision; the executing phase picks patterns based on content.
- **Slide titles**. Same reason.
- **Speaker note drafts**. Same reason.
- **Code samples**. Generation-time.

The spine is *pedagogy*, not HTML structure.
```

- [ ] **Step 4: Create `animation-pattern.md`**

```markdown
# Animation Pattern

Loaded by the `slide-generation` skill. Defines the contract that every interactive animation in a week's slide deck must follow, the catalogue of week 01 animations available for reuse, and the default policy for "reuse vs. build new".

## Contract

Every interactive animation lives in its own `.js` file inside the week's `slides/` directory. The file:

1. **Exports a single init function** named `init<Name>` (e.g., `initTokenizerAnim`, `initClickableSteps`).
2. **Accepts a config object** with at least `containerId`. Other options as needed.
3. **Listens to reveal.js lifecycle events** as needed: `Reveal.on('slidechanged', ...)`, `Reveal.on('fragmentshown', ...)`, `Reveal.on('fragmenthidden', ...)`.
4. **Manipulates the DOM directly.** No framework, no virtual DOM, no build step. Vanilla JS.

## Wiring into a slide

```html
<section>
  <h2>Título</h2>
  <div id="my-anim-container"></div>
  <aside class="notes">...</aside>
</section>
<script src="my-anim.js"></script>
<script>
  initMyAnim({ containerId: 'my-anim-container' });
</script>
```

## Catalogue of week 01 animations

Each entry: file → what it does → reusability.

| File | What it does | Reusable for |
|---|---|---|
| `tokenizer-anim.js` | Multi-stage explainer that loads a text file and walks through: plain text → UTF-8 codes → BPE chunks → token IDs. Manual prev/next buttons or auto-reveal. | Any "watch the data transform step by step" pattern. Generic. |
| `training-anim.js` | Plots loss curve over training steps and shows generated text at each checkpoint. | Any "live chart updates over time" pattern. Loss curve specifics are content; the chart-with-checkpoint pattern is reusable. |
| `inference-anim.js` | Simulates token-by-token generation with stochastic regeneration. | Any "token-by-token generation" or "stochastic process simulation". Generic. |
| `base-model-chat.js` | Connects to a vLLM endpoint and runs a 70B base model in real-time. Renders both pretty chat and raw token stream. | Content-specific (week 01 demo). Don't reuse without major adaptation. |
| `instruct-model-chat.js` | Same as base-model-chat but for the instruct-tuned variant. | Content-specific. Don't reuse. |
| `sft-anim.js` | Animated explainer of SFT: conversation serialization, loss masking, parameter updates. | Content-specific. Pattern of "step-by-step animation explainer" is reusable; SFT specifics are not. |
| `rl-anim.js` | Interactive walkthrough of RL verification loop. | Content-specific. The "step-by-step explainer with verification" pattern can inspire similar ideas in other weeks. |
| `deepseek-anim.js` | Visualizes DeepSeek R1 results — RL improving reasoning with longer chains of thought. | Content-specific. Don't reuse. |
| `clickable-steps.js` | Reusable component: row of clickable boxes; clicking one highlights it and shows a detail panel below. Tracks `activeIdx`. | Highly generic. Reuse for any "multi-step explainer with detail-on-click". |

## Default policy: reuse first, build new only when needed

When the spine says a section needs an animation:

1. **First check the catalogue.** Does `tokenizer-anim`, `clickable-steps`, or `inference-anim` fit the spine's description? If yes, copy the file into the new week's `slides/` directory and adapt the content (the data being transformed, the steps, the labels).
2. **If no existing animation fits, only then build new.** Build it as a new `.js` file in the new week's `slides/` following the contract above.
3. **Do not modify week 01 animations to be more "generic".** They're stable canonical examples; making them parametric would break week 01.

## When to flag an animation as a separate task in the plan

If a section's spine specifies a bespoke animation (not a copy-and-adapt of an existing one), the writing-plans phase should split it into its own task. Animations are higher-effort than slide markup; chunking them separately makes review easier.
```

- [ ] **Step 5: Verify all four files exist and have correct content**

Run: `Glob tools/skills/slide-generation/*`

Expected output: SKILL.md, voice-and-didactics.md, spine-template.md, animation-pattern.md.

- [ ] **Step 6: Commit**

```bash
git add tools/skills/slide-generation/
git commit -m "feat: add slide-generation skill with phase scaffolding for superpowers"
```

---

## Task 5: Create the `/build-class` slash command

**Files:**
- Create: `.claude/commands/build-class.md`

The slash command is the entry point. Body invokes the slide-generation skill.

- [ ] **Step 1: Create the command file**

```markdown
---
description: Generate or refine the reveal.js deck for the current semana, using source_material/ as input. Triggers the slide-generation skill which wraps the full superpowers pipeline (brainstorming → writing-plans → executing-plans → verification → finishing-branch). Hard checkpoint at semanas/NN/spine.md before any HTML is generated.
---

The user wants to build slides for the current week. The current working directory should be `semanas/NN/` for some N.

Invoke the `slide-generation` skill via the Skill tool. The skill handles everything from spine brainstorm to final commit.

If the current directory is not `semanas/NN/`, ask the user which week they're targeting and `cd` there (or have them) before proceeding.
```

- [ ] **Step 2: Verify the file exists**

Run: `Glob .claude/commands/build-class.md`

Expected: one match.

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/build-class.md
git commit -m "feat: add /build-class slash command"
```

---

## Task 6: Update existing docs

**Files:**
- Modify: `shared/templates/week-template.html`
- Modify: `shared/CONTEXT.md`
- Modify: `_config/slide-conventions.md`

Three small updates: template imports `components.css`; shared/CONTEXT.md describes the new `/build-class` flow; slide-conventions.md links to the new reference docs.

- [ ] **Step 1: Update `shared/templates/week-template.html` to import components.css**

Read current content first, then edit. Add a `<link>` for components.css after the existing custom.css link.

Before (line 10):
```html
  <link rel="stylesheet" href="../../../_config/theme/custom.css">
```

After:
```html
  <link rel="stylesheet" href="../../../_config/theme/custom.css">
  <link rel="stylesheet" href="../../../_config/theme/components.css">
```

- [ ] **Step 2: Update `shared/CONTEXT.md` to describe the `/build-class` flow**

Replace the "How to Use" section with:

```markdown
## How to Use

For a new week:
1. Create `semanas/NN/` with subfolders: `source_material/`, `slides/`, `img/`.
2. Add source material markdown files to `source_material/` with an `index.md` listing the structure.
3. Inside `semanas/NN/`, run `/build-class`. The slide-generation skill takes over from there:
   - Phase 1: brainstorms the didactic spine with you and writes `spine.md`.
   - Phase 2: writes `plan.md` (one task per section).
   - Phase 3: generates `slides/index.html` section by section, with review checkpoints.
   - Phase 4: verifies and commits.

For manual setup (no skill): copy `templates/week-template.html` to `semanas/NN/slides/index.html`, replace `NN` with the week number and `TOPIC_TITLE` with the week's topic from `programa.md`, then add slide `<section>` elements following `_config/slide-conventions.md`.

## Patterns reference

- `_config/slide-conventions.md` — formatting rules.
- `_config/theme/components.css` — CSS classes for slide components.
- `shared/patterns/` — HTML snippet library, one per recurring slide pattern.
- `tools/skills/slide-generation/voice-and-didactics.md` — voice and didactic principles.
- `tools/skills/slide-generation/animation-pattern.md` — animation contract and reuse policy.
```

- [ ] **Step 3: Update `_config/slide-conventions.md` to link to new reference docs**

Append a new section at the end of the file:

```markdown
## Related references

- `_config/theme/components.css` — CSS classes for slide components (pipeline, flow, chat-mockup, comparison, etc.).
- `shared/patterns/` — HTML snippet library for recurring slide patterns. See `shared/patterns/README.md`.
- `tools/skills/slide-generation/voice-and-didactics.md` — voice and didactic principles for slide content.
- `tools/skills/slide-generation/animation-pattern.md` — animation contract and reuse policy.
- `tools/skills/slide-generation/spine-template.md` — schema for the spine.md document produced by `/build-class`.
```

- [ ] **Step 4: Verify all three files were updated**

Run: `Read shared/templates/week-template.html` (check for components.css link), `Read shared/CONTEXT.md` (check for /build-class section), `Read _config/slide-conventions.md` (check for related references section at end).

- [ ] **Step 5: Commit**

```bash
git add shared/templates/week-template.html shared/CONTEXT.md _config/slide-conventions.md
git commit -m "docs: update template, CONTEXT, and slide-conventions for /build-class flow"
```

---

## Task 7: Visual verification of week 01

**Files:**
- Test: open `semanas/01/slides/index.html` in browser via `npm start`

The whole point of the medium-refactor was that week 01's visual output stays unchanged. Verify it.

- [ ] **Step 1: Start the dev server**

Run: `npm start` in background.

Expected: live-server on `http://localhost:3000`.

- [ ] **Step 2: Walk through every slide of week 01 in browser**

Open `http://localhost:3000/semanas/01/slides/`. Use arrow keys to walk through every slide and vertical sub-slide.

Specifically check:
- Title slide renders with correct font sizes and colors.
- Chat mockup at the start has correct background, border-radius, and the cursor blink animation works.
- Pipeline roadmap (`pipe-grid`): nodes have correct borders, fragments reveal one at a time, group highlights work when you reach the slides that re-emphasize pre-training and post-training.
- Common Crawl crawl animation runs.
- Tokenizer animation loads the text and walks through the 4 stages.
- Training animation, inference animation, attention SVG render.
- Base model chat (and instruct model chat if visible) connect or fail gracefully.
- SFT animation, RL animation, DeepSeek animation render.
- Clickable steps (mitigation: enseñar a decir 'no sé') have the click handlers working.
- All side-by-side comparisons align correctly.
- All section dividers render centered with correct h2 styling.

- [ ] **Step 3: If any visual regression is found**

Diagnose: is the issue a missing class? A class definition mismatch? An inline style that didn't get translated correctly?

Fix in `_config/theme/components.css` or `semanas/01/slides/index.html` as appropriate. Re-verify.

- [ ] **Step 4: If everything looks correct**

Stop the dev server. Report verification status.

- [ ] **Step 5: Commit any verification fixes (if any were needed)**

```bash
git add _config/theme/components.css semanas/01/slides/index.html
git commit -m "fix: address visual regressions found during week 01 verification"
```

---

## Final verification

After all tasks complete:
- [ ] `git log --oneline` shows commits for: spec, components.css, slides refactor, patterns library, skill files, slash command, doc updates, (optional) verification fixes.
- [ ] Working tree is clean.
- [ ] `Glob tools/skills/slide-generation/*` returns 4 files.
- [ ] `Glob shared/patterns/*` returns 11 files (10 .html + README).
- [ ] `Glob .claude/commands/build-class.md` returns 1 file.
- [ ] `Glob _config/theme/components.css` returns 1 file.
- [ ] Week 01 slides visually match pre-refactor state.
