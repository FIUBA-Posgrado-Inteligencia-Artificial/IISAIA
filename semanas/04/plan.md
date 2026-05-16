# Plan — Semana 04: Fundamentos de Agentic AI y Claude Code

> **For agentic workers:** REQUIRED SUB-SKILL: use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `semanas/04/source_material/` into `semanas/04/slides/index.html` following the approved `spine.md`, the course voice, and the established semana-03 plan house style.

**Architecture:** One self-contained HTML fragment per section (`slides/_section-N.html`), integrated into `slides/index.html` at assembly. Two page-level shared helpers defined once in Task 0: the **"¿loop o contexto?" tracker** (re-rendered at every Part-2 section opener) and the **tricotomía table** (filled progressively across §4 → §8 → §9). One new JS animation (the loop) built in its own task before any section uses it. `clickable-steps.js` reused from semana 01 for demo beats, the §5 failure modes, and the tricotomía build-up.

**Tech Stack:** reveal.js (template `shared/templates/week-template.html`), `_config/theme/components.css`, vanilla JS animations following `tools/skills/slide-generation/animation-pattern.md`.

Derived from `spine.md`. Through-line: **"dos cosas, no quince"** — el loop y el contexto como lente para clasificar cada feature de Claude Code. One task per section + setup + loop-anim + assembly + coherence + verification + finishing.

---

## Conventions for execution

- Each section subagent writes a self-contained HTML fragment to `slides/_section-N.html`. The main agent integrates fragments into `slides/index.html` at Assembly.
- A section fragment contains:
  - An optional leading `<style>` block scoped under a `.s{N}-` prefix (e.g. `.s4-fill-bar`). Only when no existing class fits.
  - Outer `<section>` (one or more) with inner `<section>` verticals as needed.
  - `<aside class="notes">` per slide, three-format speaker notes.
  - Trailing `<script>` block(s) only if the section needs animation init.
- **Shared CSS first.** Prefer existing classes from `_config/theme/components.css`: `.bg-secondary-card`, `.bg-code-card`, `.comparison-2col`, `.flow-step`, `.flow-arrow`, `.pipe-grid`, `.pipe-node`, `.pipeline-box`, `.pipeline-arrow`, `.chat-mockup` (+ `.chat-bubble`, `.chat-cursor`), `.stage-box`. Only invent `.sN-`-scoped CSS when no existing class fits.
- **Shared lens tracker.** A `.lens-tracker` (defined once in Task 0) renders a two-pole bar — `LOOP` ↔ `CONTEXTO` — with selectors `.lens-tracker.on-context` and `.lens-tracker.on-loop` that light the active pole and dim the other. Every Part-2 section opener (§7–§11) re-renders it; §7–§10 are `on-context`, §11 flips to `on-loop`.
- **Shared tricotomía table.** A `.tricotomia` page-level helper (defined once in Task 0) with three rows — *siempre cargado* / *condicional* / *autocurado* — and selectors `.tricotomia.show-1`, `.show-2`, `.show-3` that progressively un-dim rows. §4 renders it `show-1` (rótulos only, no mechanism filled), §8 renders `show-2` with CLAUDE.md + path-scoped/auto-memory filled, §9 renders `show-3` adding the skill row.
- **Voice and didactic rules** per `tools/skills/slide-generation/voice-and-didactics.md`. No bullet-only slides — every slide has visual structure. Three-format notes: `<strong>` actions / `<u>` description / `<em>` script between quotes, conversational. One `<em>` block per fragment-press.
- **No emojis. No "diplomatura". No "Vibe Coding". No "payoff" — usar "recompensa" o "sentido". One em-dash per slide max. Title slide h1 is the topic, not "Semana NN".**
- **Demo sections (estructurado):** every mini-demo gets `section-divider` + a `clickable-steps` block with the beats as steps (the qué hago / qué digo / qué mirar lives in `<aside class="notes">`, terse) + a closing 30-second slide. Plan B from the source goes in the closing slide's notes.

---

## Task 0 — Setup the scaffold

**Files:**
- Create: `semanas/04/slides/index.html` (from `shared/templates/week-template.html`)

**Steps:**

- [ ] **Step 1:** Copy `shared/templates/week-template.html` → `semanas/04/slides/index.html`. Verify `semanas/04/img/` exists (it does — leave as-is).
- [ ] **Step 2:** `<title>`: `Semana 04 — Fundamentos de Agentic AI y Claude Code`.
- [ ] **Step 3:** Title slide: `h1 = Fundamentos de Agentic AI y Claude Code`; `subtitle = De una IA que escribe a una que actúa: el loop y el contexto`; `muted = Introducción al desarrollo de software asistido por IA`.
- [ ] **Step 4:** Add a per-page `<style>` block with:
  - `.lens-tracker` rules — a thin horizontal bar, two poles `LOOP` and `CONTEXTO` separated by a divider; base state dims both; `.lens-tracker.on-context` brightens the CONTEXTO pole + accent color, dims LOOP; `.lens-tracker.on-loop` the reverse. Use `var(--accent-secondary)` for the lit pole.
  - `.tricotomia` rules — a 3-row table (cols: *rótulo* | *mecanismo* | *cuándo paga contexto*); rows default dimmed; `.show-1` un-dims row 1 label only; `.show-2` un-dims rows 1–2 fully; `.show-3` un-dims all 3.
- [ ] **Step 5:** Replace the example/closing sections with 12 placeholder blocks: `<!-- ===== §N — Title ===== --><!-- INJECT_SECTION_N --><!-- /§N -->` for N = 1..12, plus a final `<section class="section-divider"><h2>¿Preguntas?</h2></section>`.
- [ ] **Step 6:** Commit: `git add semanas/04/slides/index.html && git commit -m "feat(s04): scaffold + lens-tracker + tricotomía helpers"`.

## Task LA — Bespoke loop animation + reused clickable-steps

**Files:**
- Create: `semanas/04/slides/four-loop-anim.js`
- Create: `semanas/04/slides/clickable-steps.js` (copied from `semanas/01/slides/clickable-steps.js`)

**Steps:**

- [ ] **Step 1:** Copy `semanas/01/slides/clickable-steps.js` → `semanas/04/slides/clickable-steps.js` unchanged (canonical reusable component; do not modify the semana-01 original).
- [ ] **Step 2:** Create `four-loop-anim.js` exporting a single `initFourLoop(opts)` per the `animation-pattern.md` contract. Config: `{ containerId, phase, mode, labels }`.
  - Renders a cycle of three nodes — **PENSAR → ACTUAR → OBSERVAR** — with a "repetir" return arc, and four labelled exits below: *objetivo alcanzado*, *límite de pasos*, *pide ayuda*, *falla no recuperable*.
  - `phase` (`'pensar'|'actuar'|'observar'|null`) highlights the active node; `mode` selects a preset: `'intro'` (full cycle, all exits), `'tool'` (highlight actuar+observar, label them "llamada"/"resultado"), `'fill'` (annotate each turn depositing tokens — small token chips accumulate), `'infinite'` (no exit fires, return arc pulses), `'drift'` (the goal label crossed out / replaced), `'cc'` (node labels become `Edit/Bash/Read` tool names), `'subagent'` (a second smaller cycle nested, returns only a "resultado" chip to the parent), `'planmode'` (a pause gate inserted between pensar and actuar), `'gate'` (a gate before actuar on write-tools).
  - `labels` optionally overrides node text. Vanilla JS, manipulates the DOM, listens to `Reveal.on('slidechanged', …)` to re-render when its slide is shown. No build step.
- [ ] **Step 3:** Wire a smoke test: a temporary `<div id="loop-smoke"></div>` + `initFourLoop({containerId:'loop-smoke', mode:'intro'})` is rendered without console error when the page loads (verify in Task 14).
- [ ] **Step 4:** Commit: `git add semanas/04/slides/four-loop-anim.js semanas/04/slides/clickable-steps.js && git commit -m "feat(s04): bespoke four-loop animation + reuse clickable-steps"`.

---

## Task 1 — §1 De escribir a actuar (apertura)

**Subagent dispatch.** Inputs: spine §1, source `01-de-escribir-a-actuar.md`. The title slide is owned by Task 0.

**Slide arc (5–7 slides):**
1. Hook — la rueda copy-paste: error → chat → código → pegar → correr → 500 distinto → volver al chat. `flow-with-arrows` cíclico con la frase grande "Vos eras el que corría el loop."
2. Lo que cambia — la IA ahora *actúa*: tiene filesystem, corre comandos, lee resultados. No describe lo que habría que hacer: lo hace. Tarjeta única con la idea central, sin lista.
3. Dos paradigmas — `comparison-2col`: izquierda "la IA sugiere y vos conducís" (reactivo, autocomplete/chat); derecha "el agente planifica y ejecuta en loop". Cierre: el LLM debajo puede ser el mismo; cambia la arquitectura encima.
4. Por qué necesitás un modelo mental nuevo — `comparison-2col`: chat (alucina función → no compila → lo notás) ↔ agente (alucina comando de borrado → lo ejecuta). "La diferencia entre proponer y actuar no es cosmética."
5. El mapa de la clase — dos conceptos: el **loop** y el **contexto**. Diagrama de dos cajas grandes (sin animación todavía); frase: "todo lo que sigue actúa sobre uno de los dos".
6. Cierre — el rol de supervisor sobrevive; se le agregan estos dos conceptos. "Hoy no aprendés una herramienta; aprendés la máquina que vas a dirigir el resto del curso." Una sola frase grande.

**Patterns:** `flow-with-arrows`, `comparison-2col`, tarjeta única.
**Animations:** none new (the loop anim debuts in §2).
**Speaker notes target:** ~120–180 words/slide, three-format.

## Task 2 — §2 El loop: pensar, actuar, observar

**Subagent dispatch.** Inputs: spine §2, source `02-el-loop-agentic.md`. Uses `four-loop-anim.js` (Task LA).

**Slide arc (11–14 slides):**
1. Hook — "'Arreglá el bug.' Una sola línea. ¿Por qué eso no alcanza?" Slide minimal con la pregunta; abajo la respuesta corta: el modelo todavía no vio el error.
2. No da una respuesta: entra en un loop — introducir `four-loop-anim` (`mode:'intro'`, sin fase resaltada). El visual firma de la semana.
3–5. Las tres fases, una por slide, re-conduciendo la anim con `phase:'pensar'`, luego `'actuar'`, luego `'observar'`. Cada slide: definición terse + qué produce.
6. El trace concreto — `code-walkthrough` o `flow-with-arrows` paso a paso: pensar (no sé si corren) → actuar (`pytest`) → observar (`AssertionError 200/404`) → pensar (corrijo path) → actuar (edita router) → observar (verde). "Tres vueltas: identificó, corrigió, confirmó."
7. ReAct nombrado — el patrón tiene nombre; lo importante no es el nombre, es que pensar y actuar se alternan vuelta a vuelta.
8. Un agente = LLM + loop + tools + entorno — 4 piezas, `pipeline-box`/tarjetas; cada una con "qué aporta / qué falta si no está". Cierre: cuando algo falla, ¿cuál de las 4?
9. Por qué un loop y no una respuesta — `comparison-2col`: chat (pregunta→respuesta, independiente) ↔ agente (objetivo→loop hasta lograrlo). "El valor no es info sobre el problema: es el problema resuelto."
10. Condiciones de corte — `four-loop-anim` resaltando las 4 salidas; tarjetas: objetivo alcanzado / límite de pasos / pide ayuda / falla no recuperable. "Sin esto el loop da vueltas; el descontrol lo vemos en §5."
11. `section-divider` — "Demo D1 — el loop desnudo".
12. Beats del demo — `clickable-steps` con 3 beats (tarea verificable / narrar fases / la corrección es otra vuelta). Script + qué mirar en notes.
13. Cierre del demo + bridge — "Vieron al agente pensar, actuar, observar. El loop opera sobre algo finito: el contexto. Eso es §4." Plan B en notes.

**Patterns:** `code-walkthrough`, `comparison-2col`, `pipeline-box`, `section-divider`, `clickable-steps`.
**Animations:** `four-loop-anim` (`intro`, then `phase` per fase, then exits highlighted).
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90 words (script lives in the live demo).

## Task 3 — §3 Tools: las manos del agente

**Subagent dispatch.** Inputs: spine §3, source `03-tools-las-manos.md`. Reuses `four-loop-anim` (`mode:'tool'`).

**Slide arc (9–12 slides):**
1. Hook — callback semana 1: el token especial que pausaba la generación, hacía la búsqueda web, pegaba el resultado al contexto. "Eso era una tool. Hoy lo mismo, pero las manos llegan más lejos." `chat-mockup` o diagrama del mecanismo S1.
2. La analogía clave — Tools = las manos del agente. Sin manos: razona pero no toca nada. Frase grande + ícono conceptual.
3. Recontextualizar — `comparison-2col`: S1 (solo buscar, consulta, no cambia el mundo) ↔ hoy (leer/escribir/ejecutar/correr tests, modifica el entorno). "La mecánica no cambió; cambió que ahora modifica."
4. El ciclo de una tool ES el loop — `four-loop-anim` `mode:'tool'`: la llamada estructurada (`read_file("src/index.ts")`) = actuar; el resultado = observar; alimenta el próximo pensar.
5. La observación vuelve al contexto — semilla del §4: el output de `read_file` no desaparece, queda en la working memory. 800 líneas = 800 líneas ahí. Diagrama de acumulación simple (sin JS).
6. Cada herramienta cuesta — `npm test` entra, la respuesta HTTP entra, el directorio entra. "La observación no es gratuita: ocupa espacio, y ese espacio tiene un límite (§4)."
7. Leer vs escribir — `comparison-2col`: leer (reversible, bajo riesgo, peor caso = contexto irrelevante) ↔ escribir/ejecutar (modifica el entorno, puede no ser reversible). El supervisor mira más las que actúan sobre el mundo. (Esta tarjeta se referencia de nuevo en §11.)
8. `section-divider` — "Demo D2 — la observación entra al contexto".
9. Beats — `clickable-steps` 3 beats (leer `package.json` / señalar el bloque de observación / tamaño vs contexto total). Script + qué mirar en notes.
10. Cierre + bridge — "Cada vez que el agente actúa, la observación entra al contexto. Ese contexto tiene un tamaño. §4." Plan B en notes.

**Patterns:** `chat-mockup`, `comparison-2col`, `section-divider`, `clickable-steps`.
**Animations:** reuse `four-loop-anim` (`mode:'tool'`).
**Speaker notes target:** ~120–170 words/slide; demo-beat slides ~60–90.

## Task 4 — §4 La ventana de contexto es finita

**Subagent dispatch.** Inputs: spine §4, source `04-la-ventana-es-todo.md`. Reuses `four-loop-anim` (`mode:'fill'`) and the page-level `.tricotomia` helper (`show-1`).

**Slide arc (12–15 slides):**
1. Hook — "¿Por qué un agente que venía de maravilla de repente 'olvida'? ¿Por qué después de treinta herramientas gira en círculos?" Pregunta grande; "la respuesta no está en el modelo, está en el espacio donde el modelo trabaja".
2. La analogía clave — callback S1: parámetros = recuerdo vago (algo que leíste hace un mes) ↔ ventana = working memory, acceso directo. `comparison-2col`.
3. El loop llena la ventana — `four-loop-anim` `mode:'fill'`: cada vuelta deposita tokens (pensamiento, llamada, respuesta). Chips se acumulan.
4. Cuánto es eso — `data-table`: archivo ~300 líneas ≈ 1.5–2.5k tokens; ventana ≈ 200k; 20 archivos ≈ 30–50k solo en observaciones. Números concretos.
5. Finita — propiedad estructural, no defecto a corregir; ventanas más grandes desplazan el límite, no lo eliminan. Cuando se llena: cortar / resumir / parar.
6. Context rot — el mecanismo: la instrucción del inicio queda sepultada; lo reciente domina; la señal se diluye en ruido. Diagrama: instrucción arriba, sepultada por capas de observaciones.
7. Síntomas — tarjetas (no lista): contradice restricción explícita / repite trabajo hecho / respuestas genéricas / "no recuerda" lo que está ahí. "No es que el modelo falló: la ventana trabaja contra vos."
8. La tesis — frase grande: "quien dirige bien no es el que escribe mejores prompts de entrada; es el que mantiene la ventana enfocada en lo que importa".
9. Dos operaciones — `comparison-2col`: compactación (resumir, soltar lastre, no borrar) ↔ reset (empezar limpio, cargar solo lo necesario). Ninguna mejor en abstracto.
10. Adelanto de la tricotomía — render `.tricotomia` `show-1`: tres rótulos *siempre cargado / condicional / autocurado*, mecanismos aún en blanco. "Tres rótulos en la cabeza; se llenan en la parte 2."
11. `section-divider` — "Demo D-§4 — context rot y qué sobrevive a /compact".
12. Beats — `clickable-steps` 4 beats (plantar LISTO / context rot en acto / qué sobrevive a /compact / cierre archivo vs dicho al pasar). Script + qué mirar en notes.
13. Cierre + bridge — "Lo que vive en un archivo persiste; lo dicho al pasar, no. Esa idea atraviesa toda la parte 2." Plan B en notes.

**Patterns:** `comparison-2col`, `data-table`, `section-divider`, `clickable-steps`, page-level `.tricotomia`.
**Animations:** reuse `four-loop-anim` (`mode:'fill'`).
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90.

## Task 5 — §5 Cuando el agente falla (cierre parte 1)

**Subagent dispatch.** Inputs: spine §5, source `05-cuando-el-agente-falla.md`. Reuses `four-loop-anim` (`mode:'infinite'` and `mode:'drift'`) and `clickable-steps` for the 4 modes.

**Slide arc (7–9 slides):**
1. Opener-hook — `comparison-2col`: el modelo sugería (peor caso: sugerencia mala, la rechazabas) ↔ el agente actúa (peor caso: un entorno que ya cambió, la falla deja rastro).
2. Cuatro modos de falla — `clickable-steps` con 4 pasos (loop infinito / deriva de objetivo / alucinar tools-resultados / envenenar su propio contexto); el detalle al click.
3. Loop infinito + deriva, en imagen — `four-loop-anim` `mode:'infinite'` (ninguna salida del §2 se dispara) y `mode:'drift'` (arranca en A, termina en otra tarea). Conecta cada modo con su §previo.
4. Alucinar tools/resultados — escala la alucinación de S1: el agente afirma que ejecutó algo que no ejecutó; el loop sigue sobre una premisa falsa. "Lo que cambió: ahora actúa sobre ella."
5. Envenenar el contexto — la versión activa del context rot del §4: una salida enorme entra sin procesar; el modelo razona desde ese contexto degradado.
6. El rol del supervisor — no desaparece con la autonomía: cambia *cuándo* mira. Callback S3 grande: "no le creés a la IA, creale a la máquina" — ¿los archivos cambiaron? ¿el test corre? "Revisión al final no es supervisión: es auditoría."
7. Cierre de la parte 1 — las 4 piezas (loop / tools leer-escribir / ventana finita / modos de falla). Frase que monta la lente: "todo lo que sigue actúa sobre el loop o sobre el contexto."

**Patterns:** `comparison-2col`, `clickable-steps`.
**Animations:** reuse `four-loop-anim` (`infinite`, `drift`).
**Speaker notes target:** ~130–180 words/slide. Sin demo (el source no tiene una).

## Task 6 — §6 Claude Code es ese loop (apertura parte 2)

**Subagent dispatch.** Inputs: spine §6, source `06-claude-code-es-el-loop.md`. Introduces the `.lens-tracker`; reuses `four-loop-anim` (`mode:'cc'`).

**Slide arc (6–8 slides):**
1. `section-divider` fuerte — "Parte 2 — Claude Code" (costura parte 1/2).
2. Hook — "Lo que describimos en §2 no era un diagrama abstracto. Era algo que podés abrir ahora mismo en la terminal." Reveal.
3. La pantalla mapeada al loop — `four-loop-anim` `mode:'cc'`: texto razonando (pensar) → tool call `Edit`/`Bash`/`Read`/`Write` (actuar) → resultado (observar) → repetir. "No es un log: es el loop expuesto."
4. Las 4 piezas con herramienta concreta — `comparison-2col` o tarjetas: LLM=Claude / loop=el motor que no para / tools=Edit·Bash·Read·Write / entorno=tu repo real (npm test corre de verdad).
5. La pregunta-lente — **introducir `.lens-tracker`** (estado neutro, ambos polos): "¿esto actúa sobre cómo corre el loop, o sobre qué hay en el contexto?" Explicar que este visual va a abrir cada sección que sigue.
6. Lo que viene — preview compacto §7–§11, cada uno rotulado loop/contexto. `flow-with-arrows` o tarjetas.

**Patterns:** `section-divider`, `comparison-2col`, `flow-with-arrows`, page-level `.lens-tracker`.
**Animations:** reuse `four-loop-anim` (`mode:'cc'`).
**Speaker notes target:** ~120–170 words/slide.

## Task 7 — §7 CLAUDE.md jerárquico

**Subagent dispatch.** Inputs: spine §7, source `07-CLAUDE-md-jerarquico.md`. Opener renders `.lens-tracker` `on-context`.

**Slide arc (8–11 slides):**
1. Opener — `.lens-tracker` `on-context`, sub-rótulo "siempre cargado". "¿Loop o contexto? Contexto."
2. CLAUDE.md = siempre cargado — texto tuyo inyectado antes del primer mensaje, cada sesión, con o sin relevancia. "Todo lo que ponés ahí cuesta contexto siempre → exige disciplina."
3. La jerarquía — los 4 niveles (managed policy / usuario / proyecto / local) con rutas. `data-table` o `pipeline-box` de lo más amplio a lo más específico.
4. Orden de carga — caminata hacia arriba en el árbol; concatenación, no sobreescritura. `flow-with-arrows`. "Las contradicciones entre niveles no dan error: dan comportamiento impredecible."
5. @import — `code-walkthrough`: `@ruta/al/archivo`, recursivo hasta 5 niveles. "Organiza (1 archivo por tema, <200 líneas) pero NO ahorra ni un token: se expande e inyecta igual."
6. Este repo como ejemplo vivo — el `CLAUDE.md` raíz: routing table, convenciones git. "Entra completo a la ventana antes de tu primer mensaje. No se lo dijiste; lo encontró en el archivo."
7. `section-divider` — "Demo D3 — la ventana antes y después".
8. Beats — `clickable-steps` 3 beats (`/context` sin CLAUDE.md / con CLAUDE.md, delta / `/memory` fuentes cargadas). Script + qué mirar en notes.
9. Cierre + bridge — "Siempre cargado, con o sin relevancia. ¿Y si una instrucción pudiera estar solo cuando hace falta? Eso es §8." Plan B (`/memory` solo) en notes.

**Patterns:** `data-table`, `pipeline-box`, `flow-with-arrows`, `code-walkthrough`, `section-divider`, `clickable-steps`, page-level `.lens-tracker`.
**Animations:** none new.
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90.

## Task 8 — §8 Rules y auto memory

**Subagent dispatch.** Inputs: spine §8, source `08-rules-y-auto-memory.md`. Opener `.lens-tracker` `on-context`; renders `.tricotomia` `show-2`. **Dos demos.**

**Slide arc (13–16 slides):**
1. Opener — `.lens-tracker` `on-context`. Reabre la pregunta de §7: "¿y si una instrucción pudiera estar en el contexto solo cuando hace falta?"
2. `.claude/rules/` — cualquier `.md` en `.claude/rules/` es una regla; descubrimiento recursivo (`rules/backend/`, `rules/testing/`).
3. Sin frontmatter = igual que CLAUDE.md — siempre cargado, mismo costo, ventaja solo organizativa. Aclaración: **no es `.cursorrules`** (mecanismo distinto, no compatible). Tarjeta de "confusión común".
4. Path-scoped rules — `code-walkthrough`: frontmatter `paths:` con glob `src/api/**/*.ts`. "No entra al arranque: entra cuando Claude toca un archivo que matchea. Cero contexto hasta entonces."
5. Globs soportados — ejemplos concretos: `**/*.ts`, `src/**/*`, `*.md`, `src/**/*.{ts,tsx}`. El trigger es leer un archivo que matchee.
6. Auto memory — la diferencia con CLAUDE.md no es dónde vive, es **quién lo escribe** (vos vs Claude). `comparison-2col`.
7. Dónde vive — `~/.claude/projects/<project>/memory/`, `MEMORY.md` índice, local a tu máquina; primeras 200 líneas / 25 KB al inicio; `/memory` para auditar.
8. La tricotomía cerrada — render `.tricotomia` `show-2`: *siempre cargado* = CLAUDE.md/@import; *condicional* = path-scoped rules; *autocurado* = auto memory. Mecanismo equivocado = pagás contexto de más o la instrucción no está cuando hace falta. (Tercera fila aún tenue — se completa en §9.)
9. `section-divider` — "Demo D8 — la rule condicional".
10. Beats D8 — `clickable-steps` 3 beats (regla existe sin cargar / tocar archivo que no matchea / tocar archivo que matchea). Script + qué mirar en notes.
11. `section-divider` — "Demo D9 — auto memory".
12. Beats D9 — `clickable-steps` 3 beats (la corrección que Claude recuerda / nueva sesión misma corrección / abrir la carpeta de memoria). Script + qué mirar en notes.
13. Cierre + bridge — "Condicional y autocurado: dos cosas que CLAUDE.md no tiene. Las skills llevan lo condicional más lejos. §9." Plan B de ambos demos en notes.

**Patterns:** `code-walkthrough`, `comparison-2col`, `section-divider`, `clickable-steps`, page-level `.lens-tracker` + `.tricotomia`.
**Animations:** none new.
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90.

## Task 9 — §9 Skills y slash commands

**Subagent dispatch.** Inputs: spine §9, source `09-skills-y-slash-commands.md`. Opener `.lens-tracker` `on-context`; completes `.tricotomia` `show-3`.

**Slide arc (9–11 slides):**
1. Opener — `.lens-tracker` `on-context`. Hilo de §8: "¿puede el contexto condicional ir más lejos? Un procedimiento completo no matchea ningún path."
2. Qué es una skill — un procedimiento repetible completo (fases, verificaciones, anti-patterns), no una instrucción suelta. "No cargada al arranque: cero tokens hasta invocación/relevancia. Lo que no usás, no pagás."
3. Ejemplo meta — `tools/skills/slide-generation/`: la skill que generó *esta misma clase*. Su `SKILL.md`: 4 fases, checkpoint duro del spine, anti-patterns. También `yt-transcript-to-md`. Momento meta concreto.
4. Skill ≠ slash command — `comparison-2col`: skill = capacidad/procedimiento ↔ slash command = disparador/atajo. `/build-class` es 1 línea que solo invoca la skill; `/memory`, `/context` no invocan ninguna skill.
5. Si cambia el pipeline — actualizás la skill, no el comando. "La separación no es cosmética."
6. La tabla que ordena todo — completar `.tricotomia` `show-3`: CLAUDE.md (arranque siempre) | path-scoped rule (toca archivo que matchea) | skill (invocación/relevancia de tarea). "Misma tricotomía del §4, ahora completa."
7. `section-divider` — "Demo D6 — la skill on-demand".
8. Beats — `clickable-steps` 3 beats (skill instalada que la sesión no conoce / invocarla / mapa completo de los 3 mecanismos). Script + qué mirar en notes; el demo puede referenciar este deck.
9. Cierre + bridge — "Las skills aíslan un procedimiento. §10 aísla algo más grande: un loop entero." Plan B (demostrar por comportamiento) en notes.

**Patterns:** `comparison-2col`, `section-divider`, `clickable-steps`, page-level `.lens-tracker` + `.tricotomia`.
**Animations:** none new.
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90.

## Task 10 — §10 Sub-agents: aislar un loop entero

**Subagent dispatch.** Inputs: spine §10, source `10-sub-agents.md`. Opener `.lens-tracker` `on-context`; reuses `four-loop-anim` (`mode:'subagent'`).

**Slide arc (8–10 slides):**
1. Opener — `.lens-tracker` `on-context`, sub-rótulo "aísla el contexto de un loop entero".
2. Hook — "Le pedís a Claude Code que encuentre dónde se maneja la autenticación. Cuarenta archivos, fácil. ¿Y si todo lo que leyó viviera en *otra* ventana, y al terminar te diera solo el resultado?"
3. Qué es un sub-agent — el mismo LLM + loop + tools + entorno instanciado aparte, ventana propia que nace y muere con la tarea. "No es 'otra IA': es la misma lógica, aislada." `four-loop-anim` `mode:'subagent'` (loop anidado que devuelve solo un chip de resultado al padre).
4. Por qué protege el contexto — callback §5 (envenenar el contexto): la sub-tarea lee 50 archivos, razona mil tokens, todo vive en su ventana y desaparece. Al padre llega un párrafo.
5. Paralelización — beneficio secundario: varias sub-tareas independientes a la vez. "Real, pero no el motivo principal."
6. El costo — el padre ve el resumen, no el razonamiento. Callback §5: la delegación no te exime de supervisar; leés la evidencia, evaluás coherencia.
7. `section-divider` — "Demo D5 — el sub-agent aísla".
8. Beats — `clickable-steps` 3 beats (búsqueda inline + `/context` / misma búsqueda delegada + `/context` / mismo resultado, fracción del costo). Script + qué mirar en notes.
9. Cierre + bridge — "Aislamos la unidad más grande: el loop entero. §11 cambia de eje: ya no qué entra, sino cuánto le dejás hacer." Plan B (2 transcripts) en notes.

**Patterns:** `section-divider`, `clickable-steps`, page-level `.lens-tracker`.
**Animations:** reuse `four-loop-anim` (`mode:'subagent'`).
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90.

## Task 11 — §11 Plan mode y control del loop (cierre parte 2)

**Subagent dispatch.** Inputs: spine §11, source `11-plan-mode-y-control.md`. Opener flips `.lens-tracker` to `on-loop` (primer flip de la parte 2). Reuses `four-loop-anim` (`mode:'planmode'`, `mode:'gate'`).

**Slide arc (11–14 slides):**
1. Opener-hook — `.lens-tracker` **flip a `on-loop`**. El visual lo dice antes que las palabras: "Hasta acá todo aterrizó en contexto. Hoy la pregunta cambia."
2. Gestionar contexto vs gestionar autonomía — no es "¿qué entra al agente?" sino "¿cuánto le dejás hacer antes de mirar?".
3. Plan mode — `four-loop-anim` `mode:'planmode'`: un alto deliberado entre pensar y actuar; el agente construye un plan y te lo presenta; recién después ejecuta. "No es un resumen a posteriori."
4. Por qué importa — callback §5 (deriva de objetivo): si el plan muestra que ya entiende mal antes de tocar nada, corregís ahí. "Plan mode es la defensa más barata contra la deriva."
5. Permisos — `four-loop-anim` `mode:'gate'`: gate antes de cada herramienta que actúa sobre el mundo. Callback §3: leer (reversible, no gate) vs escribir/ejecutar (puede no serlo, gate ahí).
6. El dial de autonomía (analogía clave) — tarea acotada y reversible → más autonomía; consecuencias persistentes → plan mode + gate. Callback S3: "el backend persiste". "El dial se ajusta según reversibilidad."
7. La formalización del rol — `comparison-2col`: revisión al final (auditoría) ↔ entrar antes de la primera acción (supervisión). "No es solo leer la salida: es decidir cuándo entrás."
8. Hooks y MCP al pasar — dos tarjetas breves: hook = ejecución real (bloquea de verdad) vs CLAUDE.md = contexto que el modelo puede ignorar; MCP = qué puede hacer el agente, no cuándo. "Se ven en otra clase."
9. `section-divider` — "Demo D7 — plan mode como freno".
10. Beats — `clickable-steps` 3 beats (sin plan mode el agente actúa / con plan mode propone primero / corrección antes de aprobar). Script + qué mirar en notes.
11. Cierre de la parte 2 — la tabla maestra (`data-table`): cada herramienta §7–§11 → actúa sobre loop o contexto. "No son 15 features: son DOS cosas y formas de entrar al proceso." El through-line hecho literal.
12. Bridge — "Hoy terminamos de armar el runtime. Lo que falta no es otra herramienta: es el para qué. §12." Plan B (tarea con más superficie) en notes.

**Patterns:** `comparison-2col`, `data-table`, `section-divider`, `clickable-steps`, page-level `.lens-tracker`.
**Animations:** reuse `four-loop-anim` (`planmode`, `gate`).
**Speaker notes target:** ~120–180 words/slide; demo-beat slides ~60–90.

## Task 12 — §12 El trabajo final (cierre del curso)

**Subagent dispatch.** Inputs: spine §12, source `12-trabajo-final.md`. Reuses `pipeline-box`/`flow-with-arrows` for the course arc.

**Slide arc (6–8 slides):**
1. Hook — "Hace cuatro semanas no sabías qué era un token. Hoy terminaste de armar tres cosas que, juntas, cambian cómo construís software."
2. Las tres piezas — `pipeline-box`: modelo (S1) → rol/vocabulario (S2–3) → runtime (S4), cada una con "sin ella, qué pasa" (caja negra / aceptás lo primero / el proyecto da vueltas).
3. Qué vas a construir: la forma, no el contenido — front + back + persistencia; el dominio se define aparte. "No el tema: la forma."
4. Por qué conecta con todo — la forma activa exactamente lo aprendido: vocabulario S2/S3 para dictar; herramientas de hoy (CLAUDE.md persiste arquitectura, sub-agents aíslan, plan mode muestra antes de tocar) cuando el proyecto crece.
5. Qué se evalúa, en espíritu — apropiación: el producto es tuyo aunque el agente escriba el código; se mide en explicar/corregir/extender, no en líneas tecleadas.
6. Lo que NO se decide hoy — tarjetas: equipos / fechas / dominio exacto / rúbrica → se comunican aparte. "Hoy es el por qué y la forma."
7. El arco — síntesis: modelo + rol + runtime, el mismo supervisor en distintas capas a la vez. Última aparición del `.lens-tracker` junto al arco, como cierre. Frase final del source.

**Patterns:** `pipeline-box`, `flow-with-arrows`, tarjetas, page-level `.lens-tracker`.
**Animations:** none new.
**Speaker notes target:** ~130–190 words/slide. Sin demo.

---

## Task 13 — Assembly

**Steps:**

- [ ] **Step 1:** Read `slides/_section-1.html` … `slides/_section-12.html`.
- [ ] **Step 2:** Splice each into its `<!-- INJECT_SECTION_N -->` placeholder in `slides/index.html`.
- [ ] **Step 3:** Move any trailing `<script>` blocks (animation init) to the bottom of `<body>`, *before* the reveal init script, after `<script src="four-loop-anim.js">` and `<script src="clickable-steps.js">` (add those two source tags once, after the reveal/plugins scripts).
- [ ] **Step 4:** Remove the now-empty `_section-N.html` fragment files from disk.
- [ ] **Step 5:** Commit: `git add -A semanas/04/slides && git commit -m "feat(s04): assemble all 12 sections into index.html"`.

## Task 14 — Coherence pass

- [ ] Re-read `spine.md`. For each section confirm in `slides/index.html`: through-line visible in slides (not only notes); hook lands right after the opener when the spine specifies one; all walk-aways addressed somewhere.
- [ ] `.lens-tracker`: appears at §6 (neutral), `on-context` at §7/§8/§9/§10, flips to `on-loop` at §11, final appearance at §12.
- [ ] `.tricotomia`: `show-1` at §4, `show-2` at §8, `show-3` at §9 (same visual, progressively filled).
- [ ] `four-loop-anim`: introduced §2; re-driven in §3 (`tool`), §4 (`fill`), §5 (`infinite`/`drift`), §6 (`cc`), §10 (`subagent`), §11 (`planmode`/`gate`). No orphan init calls; every `initFourLoop` container id exists in the DOM.
- [ ] Cross-section callbacks land: S1 (tools §3, working memory §4), S3 (no le creés a la IA §5, backend persiste §11), §2 condiciones de corte → §5 loop infinito, §4 context rot → §5 envenenar, §3 leer/escribir → §11 permisos, §4 tricotomía → §8/§9.
- [ ] Part 1/Part 2 seam: strong `section-divider` between §5 and §6; §1–§5 never name Claude Code.
- [ ] Per-section checklist: no bullet-only slides; second-person collaborative voice; one concept per slide; no emojis; ≤1 em-dash/slide; speaker notes three-format with `<em>` split per fragment-press; patterns are from `shared/patterns/` (the new pattern is the loop anim — already in the animation catalogue concept, document it in `shared/patterns/README.md` if a reusable HTML snippet emerges).
- [ ] All `<section>` open/close tags balance (grep counts equal).

## Task 15 — Verification

- [ ] `npm start` in repo root if not running. Open `http://localhost:3000/semanas/04/slides/`.
- [ ] Walk through with arrow keys: every slide renders; fragments fire in order; no console errors (DevTools open); `four-loop-anim` renders and re-renders per section; `clickable-steps` responds to click in every demo; `.lens-tracker` and `.tricotomia` show the right state per section.
- [ ] Static fallback (if no human walkthrough possible): `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/semanas/04/slides/` returns `200`; grep served HTML for `<section>` tag balance and for each `initFourLoop`/`initClickableSteps` container id.

## Task 16 — Finishing

- [ ] Commit slides + plan with a descriptive message.
- [ ] Per `superpowers:finishing-a-development-branch`: present merge/PR/cleanup options. Do NOT merge to `main` without user review.
- [ ] Leave the branch reviewable: user can `git checkout feature/semana-04-source-material` and open the deck.

---

## Self-review

- **Spec coverage:** every §1–§12 in `spine.md` maps to Task 1–12; whole-week devices (lens-tracker, four-loop-anim, tricotomía) each have a defining task (0/LA) and per-section render points; demos all get divider+beats+close per the structured decision. ✓
- **Placeholder scan:** no "TBD/TODO"; slide arcs are concrete (drawn from spine + source); the only intentional placeholder is Task 0 Step 5's INJECT markers, which Assembly consumes. ✓
- **Type consistency:** the animation entrypoint is `initFourLoop({containerId, phase, mode, labels})` everywhere; reused component is `initClickableSteps(...)`; helper classes `.lens-tracker.on-context|.on-loop` and `.tricotomia.show-1|2|3` are named identically across Task 0 and all consuming tasks. ✓
