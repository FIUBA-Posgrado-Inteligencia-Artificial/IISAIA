# Plan — Semana 02 slides

Implementation plan for the deck described in `spine.md`. One task per section in spine order, plus setup at the start and a coherence pass at the end. Patterns referenced are from `shared/patterns/`.

Branch: `feature/semana-02-slides` (create at task 0).

---

## Task 0 — Setup

**Goal:** working `slides/index.html` skeleton ready to receive sections.

- Create `feature/semana-02-slides` from clean `main`.
- Copy `shared/templates/week-template.html` to `semanas/02/slides/index.html`.
- Set the title slide (week 02 — "Arquitectura Frontend y Vibe Coding"), subtitle from `programa.md`.
- Verify `_config/theme/` CSS loads (theme variables, components.css).
- Verify `semanas/02/img/` exists; create if missing.
- Copy `shared/patterns/title-slide.html` and `shared/patterns/section-divider.html` references in case they need adapting.
- `npm start` and confirm the empty deck renders at `http://localhost:3000/semanas/02/slides/`.

**Commit:** `feat(semana-02): scaffold reveal.js deck`

---

## Task 1 — Section 1: Frontend y el supervisor arquitectónico

**Spine entry:** §1. Through-line: cuello de botella es la decisión, no la sintaxis; alumno = supervisor.

**Patterns likely:**
- `title-slide.html` for the week opener (already in setup).
- A hook slide with the "pregunta incómoda" — likely a custom centered-question slide (no pattern exact match; if invented, add to `shared/patterns/` as `question-hook.html`).
- `comparison-2col.html` for "antes / ahora" of escribir vs leer código.
- `pipeline-roadmap.html` (or a simpler 5-pill roadmap) to seed the five-layer outline (Estructura / Estilo / Comportamiento / Estado / Empaque) — this roadmap will get re-highlighted in §§2–5.
- `section-divider.html` to close into Anatomía.

**Animations:** none.

**Speaker-note target:** ~120–180 words/slide for hook+motivation slides; ~80 for the roadmap.

**Notes:** the 5-layer roadmap introduced here is the canonical "where are we" device for the rest of the deck — re-highlight the active layer at the start of §§2–5.

**Commit:** `feat(semana-02): §1 supervisor arquitectónico`

---

## Task 2 — Section 2: Estructura HTML

**Spine entry:** §2. Through-line: HTML semántico nombra; div soup es el costo.

**Patterns likely:**
- Re-highlight the 5-layer roadmap on "Estructura".
- Hook: `comparison-2col.html` showing `<header>...</header>` vs `<div class="header">...</div>` rendered identically — caption "el navegador no las lee igual".
- `data-table.html` (or a denser 7-row variant) for the seven structural elements (header/main/section/article/nav/footer/aside).
- One slide for content elements (h1–h6, p, ul/ol/li, a, img) and one for interaction (button, input, form, label) — likely a 2-col layout, no bullet lists.
- `code-walkthrough.html` for the prompt-vago vs prompt-con-vocabulario contrast (two stacked code blocks, the second annotated with `data-line-numbers`).
- Live demo slide: embed `demo.html` §1 in iframe (or anchor link if iframe is too heavy at full screen). Verify the §1 toggle visually distinguishes semantic from div-soup — if not, edit `demo.html` to make it obvious.

**Animations:** none bespoke. Iframe of `demo.html#section-1` if reveal.js plays nice.

**Speaker-note target:** ~100–150 words/slide.

**Demo.html consideration:** if the §1 toggle in `demo.html` doesn't clearly signal "these two render identically", patch the demo (e.g., overlay outline-tree visualization side-by-side).

**Commit:** `feat(semana-02): §2 estructura HTML`

---

## Task 3 — Section 3: Estilo CSS

**Spine entry:** §3. Through-line: cuatro primitivas (caja, layout, tipografía/color, variables).

**Patterns likely:**
- Roadmap re-highlight on "Estilo".
- Box model: a custom annotated diagram (concentric layers content/padding/border/margin). If not in `shared/patterns/`, invent and add as `box-model-diagram.html`.
- Flex vs Grid: `comparison-2col.html` — flex (1D, fila/columna) vs grid (2D, filas+columnas), each with one minimal code block.
- Tipografía/color: a small sample slide with two paired examples (one font, one paired heading+body); palette swatches as 4 colored squares.
- Variables CSS: `code-walkthrough.html` showing `:root { --color-primary: ... }` and the use site `var(--color-primary)`.
- Live demo slide: embed `demo.html` §2 (theme switcher).
- Prompt-vago vs prompt-específico close.

**Animations:** none bespoke. The theme switcher in `demo.html` §2 is the live element.

**Speaker-note target:** ~100–150 words/slide; longer (~200) on the box-model intro.

**Demo.html consideration:** confirm `demo.html` §2 theme switcher actually swaps `--color-accent` / `--color-bg` visibly. If subtle, push contrast in the alt theme.

**Commit:** `feat(semana-02): §3 estilo CSS`

---

## Task 4 — Section 4: Estado, DOM y eventos

**Spine entry:** §4. Through-line: ciclo evento → estado → DOM; "estado es la verdad, DOM es el reflejo".

**Patterns likely:**
- Roadmap re-highlight on "Estado/Comportamiento" (decide whether to merge the two roadmap pills here or keep separate; spine treats §4 as one section).
- Hook: a counter mockup — click → "1" → question slide "¿qué se actualizó entre el click y el render?".
- Three concept slides (Estado / DOM / Eventos), each with a tight definition + a one-line example. NOT bullet lists — use 2-col definition+example layout.
- The 5-step cycle: `flow-with-arrows.html` (Estado inicial → Click → Listener → Mutación de estado → Mutación de DOM → Render). Use `class="fragment"` to reveal each step.
- "Estado es la verdad, DOM es el reflejo": single-statement slide, large type, `metaphor-pages.html` style (or a simpler centered slide if metaphor-pages doesn't fit).
- Live demo: `demo.html` §3 (counter + todo + event log).
- Prompt-vago vs prompt-específico close.

**Animations:** the cycle slide uses fragments. No bespoke JS.

**Speaker-note target:** ~120–180 words/slide; longer on the cycle slide as it's the anchor.

**Demo.html consideration:** §3 of `demo.html` already has counter, todo, event log per recent commits. Verify each one shows the evento→estado→DOM cycle visibly (event log especially). If the event log doesn't make the cycle obvious, add timestamped entries that name "evento" / "estado" / "DOM" at each step.

**Commit:** `feat(semana-02): §4 estado y eventos`

---

## Task 5 — Section 5: Single-file platform

**Spine entry:** §5. Through-line: un archivo cabe en contexto, deploya por copy-paste, sin toolchain.

**Patterns likely:**
- Roadmap re-highlight on "Empaque".
- Hook (light): screenshot of `demo.html` source + filesize stat ("~600 líneas, un archivo, todo lo que viste").
- Three-advantage slides: each advantage gets its own slide with concrete framing (cabe en contexto / deploy copy-paste / cero toolchain). Use `comparison-2col.html` for "antes / ahora" on each — multi-archivo + bundler vs single file.
- "Cuándo se rompe": a short list of limits — but NOT a bullet list. Use a 2x2 grid of "se rompe cuando..." cells.
- Live demo: open the view-source modal already implemented in `demo.html` §5.

**Animations:** none.

**Speaker-note target:** ~100–140 words/slide.

**Demo.html consideration:** §5 view-source modal exists per recent commit. Verify it actually shows the file content and that line count is visible.

**Commit:** `feat(semana-02): §5 single-file platform`

---

## Task 6 — Section 6: Cuatro patrones de prompt

**Spine entry:** §6. The payoff section. ~20 min, 8–10 slides.

**Patterns likely:**
- `section-divider.html` "Patrones" to mark the shift from anatomía to aplicación.
- Hook: prompt vago "hacelo más lindo" vs prompt P3 (flex/justify/gap) → resultados — `comparison-2col.html`.
- Mindset shift slide: "no estás escribiendo código, estás encargando código" — single statement.
- Overview of the 4 patterns: reuse `clickable-steps.js` from week 01 — copy file into `semanas/02/slides/`, adapt content to the 4 patterns. Each step shows the template + one trabajado example.
- Per-pattern slides (P1/P2/P3/P4): each gets one slide with template (left) + ejemplo trabajado (right), code-walkthrough style. The Pomodoro examples from source go here.
- "Cómo se conectan con las secciones 2–5": a small diagram showing which vocabulary each pattern leans on (P1 → estructura+estilo+estado, P2 → estado, P3 → layout, P4 → variables). Likely `flow-with-arrows.html` repurposed or a custom 4-row table.
- Live demo: dice roller in 4 prompts (one slide naming the demo, then run it live in another tab). Slides include the four prompts as `code-walkthrough.html` blocks for reference.

**Animations:** copy-and-adapt `clickable-steps.js` from `semanas/01/slides/` → `semanas/02/slides/`. Update content arrays to P1/P2/P3/P4 with template + ejemplo. Verify the contract `initClickableSteps({ containerId })`.

**Speaker-note target:** ~150–220 words/slide. This is the densest section — the script needs to flag where to switch to the live tab and back.

**Commit:** `feat(semana-02): §6 patrones de prompt`

---

## Task 7 — Section 7: Actividad grupal — briefing

**Spine entry:** §7. Briefing for the 60-min group activity.

**Patterns likely:**
- `section-divider.html` "Actividad".
- Goal slide: 60 min, grupos de 4, single-file, ChatGPT Canvas.
- Cycle diagram: `flow-with-arrows.html` — Architect (top, one-time) → loop Prompter → Reviewer → Tester → back to Prompter, with a return arrow to Architect for major scope changes. This is the centerpiece of the briefing.
- Per-role slides (4 slides): Architect / Prompter / Reviewer / Tester — each with the role's responsibility and a concrete failure mode if absent. Use `comparison-2col.html` (responsabilidad / qué falla si no se cumple).
- Constraints + entregable slide: `data-table.html` 2-col (constraints | entregable).
- Cierre: "5 min de presentación por grupo" + "el formato es suyo".

**Animations:** none.

**Speaker-note target:** ~100–140 words/slide. Briefing notes lean on imperative ("dividan los roles ahora", "el repo va al chat antes de presentar").

**Commit:** `feat(semana-02): §7 briefing actividad grupal`

---

## Task 8 — Coherence pass

**Goal:** the deck reads as one whole-week through-line, not seven independent decks.

- Walk the deck section by section in the browser. Verify section transitions feel like an arc, not jumps.
- Verify the 5-layer roadmap re-highlights consistently in §§2–5 (same colors, same labels, only the active pill changes).
- Verify section openers (hooks where spine specifies one) actually hook — read them aloud cold, ask "would I lean in?".
- Verify all "what students walk away knowing" bullets from each spine section are addressed somewhere in the slides (cross-check spine ↔ slides).
- Check no orphan animations (every `init...()` call has a container; no script tags pointing to missing files).
- Run `npm start`, walk through the deck end-to-end, time it roughly: target ~60 min for §§1–6, ~8 min for §7.
- Open browser console, confirm zero errors.
- Run any speaker-note sanity check: pick 3 random slides, confirm notes have the three-format structure (`<strong>`/`<u>`/`<em>`) where applicable.
- Verify no inline `style="..."` blocks where a `_config/theme/components.css` class exists (refactor to class if found).
- Verify no AI-filler vocabulary made it through (`grep` for the banned list).

**Commit:** `chore(semana-02): coherence pass and final review`

---

## Notes for execution phase

- Re-read `spine.md` before starting each task (anti-drift).
- After each task, run the per-section review checklist from the slide-generation skill.
- Show each section to Enzo before moving to the next.
- Any new pattern invented during execution must be added to `shared/patterns/` with a row in the catalogue (don't silently inline).
- `demo.html` may be modified when a slide reveals a concrete improvement; commit demo changes alongside the slide that motivated them.
- Animations: only `clickable-steps.js` is a reuse-and-adapt task (in §6). Everything else is HTML + fragments + iframes to `demo.html`.
