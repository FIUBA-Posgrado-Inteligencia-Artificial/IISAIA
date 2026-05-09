# Plan — Semana 03: Arquitectura Backend y Datos

Implementation plan derived from `spine.md`. Through-line A (espejo backend de semana 02). One task per section + setup + assembly + coherence + verification.

## Conventions for execution

- Each section subagent writes a self-contained HTML fragment to `slides/_section-N.html`. The main agent integrates them into `slides/index.html` after all are ready.
- A section fragment contains:
  - An optional leading `<style>` block scoped under a `.s{N}-` prefix (e.g., `.s4-contract-row`).
  - Outer `<section>` (one or more) with inner `<section>` verticals as needed.
  - `<aside class="notes">` per slide, three-format speaker notes.
  - Trailing `<script>` block(s) only if the section needs animation init.
- **Shared CSS first.** Prefer existing classes from `_config/theme/components.css`: `.bg-secondary-card`, `.bg-code-card`, `.comparison-2col`, `.flow-step`, `.flow-arrow`, `.pipe-grid`, `.pipe-node`, `.pipe-arrow`, `.pipeline-box`, `.pipeline-arrow`, `.chat-mockup` (+ `.chat-bubble`, `.chat-cursor`), `.stage-box`. Only invent scoped CSS when no existing class fits.
- **Shared roadmap class.** A `.piece-roadmap` (defined once in the page-level scaffold) reuses `.pipe-node` / `.pipe-arrow` styling and adds `.active-1` … `.active-6` selectors that highlight one of the six pieces (HTTP, REST, rutas/contratos, datos, errores, salto). Section openers (§2 onward) re-render the roadmap with the right `.active-N` to keep the espejo arc visible.
- **Voice and didactic rules** per `tools/skills/slide-generation/voice-and-didactics.md`. No bullet-only slides. Three-format notes: `<strong>` actions / `<u>` description / `<em>` script (between quotes, conversational). One `<em>` block per fragment-press.
- **No emojis. No "diplomatura". No "Vibe Coding". No "payoff" — usar "recompensa" o "sentido". Title slide h1 is the topic, not "Semana NN".**

---

## Task 0 — Setup the scaffold

**Goal:** create `slides/index.html` from `shared/templates/week-template.html`, customize the head and title slide, and define the page-level `.piece-roadmap` styling.

**Steps:**
1. Copy `shared/templates/week-template.html` to `slides/index.html`.
2. Title: `Semana 03 — Arquitectura Backend y Datos`.
3. Title slide: `h1 = Arquitectura Backend y Datos`, subtitle = `Vocabulario para dirigir a la IA del otro lado del cable`, muted = `Introducción al desarrollo de software asistido por IA`.
4. Add a per-page `<style>` block with the `.piece-roadmap` rules: a thin row using `.pipe-node` / `.pipe-arrow`, with selectors `.piece-roadmap.active-1 …` through `.active-6` that highlight the corresponding node and dim the rest. Six nodes labelled: HTTP, REST, Rutas y contratos, Datos, Errores, Salto.
5. Leave a placeholder block per section: `<!-- ============= §N — Title ============= --> <!-- INJECT_SECTION_N --> <!-- /§N -->`.

## Task 1 — §1 Backend y el supervisor arquitectónico (apertura)

**Subagent dispatch.** Inputs: spine §1 entry, source `01-backend-y-el-supervisor.md`, semana 02 §1 as shape reference.

**Slide arc (3 slides):**
1. Mismo rol, otro terreno — `comparison-2col`: Frontend (semana 02) ↔ Backend (semana 03). Esto materializa la analogía clave y abre la sección.
2. Roadmap de las seis piezas — `piece-roadmap` con seis nodos, fragmentos para revelarlos uno por uno + arrow.
3. A qué prestamos atención hoy — `comparison-2col`: lo que NO es / lo que SÍ es. Cierra con la frase del source: "Volvé al rol cuando dudes: sos supervisor arquitectónico también del lado del servidor."

NB: omitido un hook tipo big-question (era redundante con la pregunta de semana 02) y omitida una slide de "tres cosas que cambian" (pre-cargaba vocabulario backend antes de que el alumno tuviera contexto). Cada una de esas tres consecuencias se motiva en su sección propia más adelante.

**Patterns:** title-slide is owned by Task 0. §1 uses `comparison-2col` and the page-level `.piece-roadmap` helper.

**Animations:** none new.

**Speaker notes target:** ~120-180 words/slide, three-format.

## Task 2 — §2 Cliente, servidor y HTTP

**Subagent dispatch.** Inputs: spine §2, source `02-cliente-servidor-y-http.md`.

**Slide arc (8–10 slides):**
1. Section opener: `Capa 1 — HTTP` con `piece-roadmap` en `active-1`, frase puente bajo el roadmap.
2. Hook: tres ejemplos cotidianos (Twitter feed, Gmail check, WhatsApp Web send) — diagrama mínimo cliente↔servidor con texto evocativo. "Algo viajó."
3. Cliente y servidor son roles, no programas — `comparison-2col` o tarjeta única: lista de cosas que pueden ser cliente (navegador, app móvil, otro servidor consumiendo API, `curl`).
4. Anatomía del request/response — `code-walkthrough` con el bloque crudo `GET /projects/4 HTTP/1.1 ... HTTP/1.1 200 OK ...`. Resaltar las cuatro partes del request y las tres del response.
5. Los cinco verbos — tabla compacta o data-table: GET / POST / PUT / PATCH / DELETE con descripción de una línea cada uno.
6. Códigos 2xx/4xx/5xx — `comparison-2col` o tres-card lateral: cada familia con ejemplos concretos (200/201/204; 400/404 + nota "401/403 → semana 7"; 500/503).
7. La regla diagnóstica — "Si arranca con 4, mirá tu pedido. Si arranca con 5, mirá los logs." Slide minimal con la frase como mantra.
8. Por qué importa para vos como supervisor — frase de cierre del source, una sola idea grande.
9. Vago vs específico — `comparison-2col` con dos prompts del source. Cierre: tres ejes (determinismo, iteración, auditoría) + disclosure honesta sobre LLMs modernos. Cumplir con el patrón de la spine.

**Patterns:** `comparison-2col`, `code-walkthrough`, `data-table` (verbos), tarjetas.

**Animations:** none new. Para el hook puede haber un mini-diagrama estático con dos cajas y una flecha animada con CSS (scope: `.s2-`).

## Task 3 — §3 REST como estilo

**Subagent dispatch.** Inputs: spine §3, source `03-rest-como-estilo.md`.

**Slide arc (7–9 slides):**
1. Section opener: `Capa 2 — REST` con `piece-roadmap` en `active-2`.
2. Hook — la decisión "borrar la tarea 17". `comparison-2col`: `DELETE /projects/4/tasks/17` ↔ `POST /borrar-tarea?...`. Ambas son HTTP válidas; una sola es REST.
3. HTTP es el cómo; REST es el qué — frase + nota corta sobre alternativas (GraphQL, RPC) sin entrar en detalle.
4. Todo es recurso — concepto + ejemplos: colección (`/projects`), item (`/projects/4`), recurso anidado (`/projects/4/tasks`, `/projects/4/tasks/17`). Mantra: "el verbo dice qué hacer; la URL dice sobre qué".
5. Regla 1 — Plural. `comparison-2col` `/users` ↔ `/user`, con explicación corta.
6. Regla 2 — Jerarquía cuando hay relación. Pertenencia estructural vs opcional con dos ejemplos: `/projects/4/tasks` (anidado) ↔ `/tasks?project=4` (filtro plano).
7. Regla 3 — Idempotencia. Tabla con 5 verbos × idempotente sí/no, con consecuencia práctica (retentar sin miedo vs duplicar).
8. Regla 4 — Stateless. Frase + por qué importa para escalar y por qué van a aparecer tokens de auth en semana 7.
9. Vago vs específico (con el ejemplo del source).

**Patterns:** `comparison-2col`, `data-table`, tarjetas.

**Animations:** none new.

## Task 4 — §4 Rutas, controladores y el contrato (climax)

**Subagent dispatch.** Inputs: spine §4, source `04-rutas-controladores-y-contratos.md`.

**Slide arc (8–10 slides):**
1. Section opener: `Capa 3 — Rutas y contratos` con `piece-roadmap` en `active-3`.
2. Hook: "Le decís a la IA 'hacé un endpoint para crear una tarea' y te devuelve trescientas líneas." Listar las 10 decisiones invisibles que tomó la IA en una columna; del otro lado, el contrato que las explicita. `comparison-2col`.
3. Una ruta es una promesa — las cinco piezas con un slide tipo pipeline horizontal: verbo → path → schema-in → schema-out → códigos posibles. Reuse `.flow-step` o crear `.s4-piece` con highlight por fragmento.
4. Path / Query / Body — mantra ("path identifica, query modifica, body transporta"). `comparison-2col` o tres-card con ejemplos.
5. El controlador atiende la promesa — frase: vos no escribís controladores, los especificás. Tarjeta única.
6. El bloque de contrato — `code-walkthrough` con el pseudocódigo del source completo (POST /projects/{id}/tasks con sus salidas 201/400/404). `data-line-numbers` para resaltar primero el verbo+path, después la entrada, después salida 201, después las salidas de error.
7. **Slide de la analogía clave** — espejo con semana 02: "Endpoint con contrato ↔ componente con props/state". `comparison-2col`: a la izquierda el componente con props tipadas (semana 02), a la derecha el endpoint con contrato (esta clase). Pie: "El átomo dictable también tiene gemelo del lado del servidor."
8. Vago vs específico (con el bloque del source).

**Patterns:** `comparison-2col`, `code-walkthrough` con highlights progresivos, `flow-with-arrows` para las cinco piezas.

**Animations:** none new. Posibilidad de usar `.flow-step.active` con fragmentos para que cada pieza del contrato se resalte secuencialmente.

## Task 5 — §5 Datos: relaciones vs documentos

**Subagent dispatch.** Inputs: spine §5, source `05-datos-relaciones-vs-documentos.md`.

**Slide arc (7–9 slides):**
1. Section opener: `Capa 4 — Datos` con `piece-roadmap` en `active-4`.
2. Hook: "La to-do list de la clase pasada vivía en una variable de JavaScript." Mostrar imagen mental del refresh borrando todo. Tarjeta o slide con frase grande tipo `big-question` ("la página nunca tuvo memoria").
3. Tres razones por las que hace falta una DB — `comparison-2col` o tres-card: persistencia / eficiencia de consulta / integridad. Cada una con ejemplo concreto del source.
4. Relacional — `code-walkthrough` con el schema `projects` + `tasks` del source, resaltando la foreign key. Frase de cierre: tabla, fila, columna, esquema, JOIN.
5. Documental — `code-walkthrough` con el JSON anidado del source. Frase: documento, colección, sin esquema rígido. Ejemplo: MongoDB / DynamoDB.
6. El trade-off — `comparison-2col`: cuándo una, cuándo la otra. (anidar conviene cuando siempre leés todo junto; mal cuando las tareas viven solas o filtrás globalmente.)
7. Cómo elegir — heurística pragmática: relacional por default, documental cuando un patrón concreto lo justifica.
8. SQLite como punto de entrada — frase: cero configuración, vive en un archivo. Distinción local (SQLite) ↔ producción (Postgres) con la nota: las decisiones de modelado son las mismas.
9. Vago vs específico (con el bloque CREATE TABLE del source).

**Patterns:** `comparison-2col`, `code-walkthrough`, tarjetas.

**Animations:** none new.

## Task 6 — §6 Errores y observabilidad

**Subagent dispatch.** Inputs: spine §6, source `06-errores-y-observabilidad.md`.

**Slide arc (6–7 slides):**
1. Section opener: `Capa 5 — Errores` con `piece-roadmap` en `active-5`.
2. Hook: "500 Internal Server Error. Frente a esa pantalla hay dos reacciones." `comparison-2col`: rezar / abrir la terminal. Tarjeta minimalista, fuerte.
3. Los errores tienen dueño — mantra 4xx=cliente / 5xx=servidor con ejemplos. Tabla compacta o `comparison-2col`. (Nota: 401/403 → semana 7, igual que en §2.)
4. Logs: lo que el servidor te susurra — `code-walkthrough` con las 3 líneas del source. Resaltar progresivamente: request, error interno, status code de salida.
5. El stack trace — `code-walkthrough` con el traceback Python del source. Resaltar la línea relevante (`app/routes/tasks.py:14`) — no las del framework, no la última. Mantra: "el síntoma grita al final, la causa vive en la primera línea de código que escribiste vos".
6. Cómo le contás esto a la IA — `comparison-2col`: prompt malo ("no funciona, dame fix") ↔ prompt con evidencia (verbo+ruta+código+log+stack+handler). Misma diferencia, otra capa.
7. Vago vs específico (cierre del patrón con el ejemplo del source).

**Patterns:** `comparison-2col`, `code-walkthrough` con highlights progresivos.

**Animations:** none new.

## Task 7 — §7 De lo local al stack (salto)

**Subagent dispatch.** Inputs: spine §7, source `07-de-lo-local-al-stack.md`.

**Slide arc (7–8 slides):**
1. Section opener: `Pieza 6 — Salto` con `piece-roadmap` en `active-6`.
2. Hook: "Hasta ahora todo pasaba en una pestaña." Frase grande, sola. La pestaña no aguanta un servidor.
3. Por qué Canvas no alcanza — tres-card o `comparison-2col` con tres elementos: proceso / puerto / sistema de archivos.
4. Por qué CLI antes que IDE — tres razones del source (transparencia / foco didáctico / continuidad con semana 4). `comparison-2col` o tarjetas.
5. El stack del demo — diagrama horizontal o pipeline-box: Python · FastAPI · SQLite · Uvicorn · venv. Cada caja con frase de una línea explicativa al hover (tooltip ya viene en `.pipeline-box`).
6. FastAPI es una elección — slide con `data-table` o tarjetas: alternativas (Node+Express / Django / Flask / Go / Rails). Frase de cierre: "El punto no es aprenderlas. Es saberlas."
7. Tarea para semana 4 — slide tipo checklist con los 5 ítems del source (Python ≥3.11, Node ≥18, `npm install -g @anthropic-ai/claude-code`, `claude --version`, avisar si falla). Bloque de código con los comandos exactos.
8. Vago vs específico — bloque del source con la estructura del proyecto Python.

**Patterns:** `comparison-2col`, `pipeline-box` con tooltips, `code-walkthrough`, tarjetas.

**Animations:** none new.

## Task 8 — §8 Demo en vivo (scaffolding del cierre)

**Subagent dispatch.** Inputs: spine §8, source `08-demo-en-vivo.md`. **Importante:** sección de scaffolding mínimo — la animación real es el demo en vivo. No inventar dominio si no está decidido; usar plantilla con placeholders.

**Slide arc (4–6 slides):**
1. Section divider — `Demo en vivo` (clase `section-divider`).
2. Lo que se va a mostrar — la lista de los 5 requisitos del source (3 verbos, foreign key visible, camino de error 4xx, frontend mínimo, dominio NO-trivial). `comparison-2col` o lista densa transformada en tarjetas.
3. La plantilla de contrato — `code-walkthrough` con la plantilla del source (stack + tablas + endpoints + frontend). Pre-fragmentar para revelar bloque por bloque mientras el profesor la dicta en vivo.
4. Beats del demo — `clickable-steps` con los 6 beats numerados. Texto corto en cada paso; el detalle vive en la lectura previa del profesor. (Reuse `clickable-steps.js` de semana 01: copiar a `slides/clickable-steps.js`.)
5. Cierre — slide de 30 segundos final: "Ustedes no tipearon nada. Lo que dirigieron fue el contrato." Espejo cerrado con semana 02. Una sola frase grande.
6. (Opcional) Agradecimiento o "preguntas?" — sección dividida.

**Patterns:** `section-divider`, `code-walkthrough`, `clickable-steps` (reuse JS desde semana 01).

**Animations:** copiar `clickable-steps.js` desde `semanas/01/slides/`.

---

## Task 9 — Assembly

After all 8 section files exist:

1. Read `slides/_section-1.html` … `slides/_section-8.html`.
2. Splice each into the corresponding `<!-- INJECT_SECTION_N -->` placeholder in `slides/index.html`.
3. If any section has trailing `<script>` blocks, move them to the bottom of `<body>` *before* the reveal init script so animations register correctly.
4. Remove the now-empty `_section-N.html` fragment files from disk.

## Task 10 — Coherence pass

1. Re-read `spine.md`. For each section, confirm in `slides/index.html`:
   - The section's through-line is visible in the slides (not just buried in notes).
   - The hook lands as the first slide after the section opener (when the spine specifies a hook).
   - The walk-aways are addressed somewhere across the slides.
   - The vago/específico pattern is the last slide of the section.
2. Verify the `.piece-roadmap` re-highlights once per section opener (1 → 2 → 3 → 4 → 5 → 6).
3. Verify the espejo with semana 02 lands in §1 (slide 2 — frontend ↔ backend) and §4 (analogy slide — endpoint con contrato ↔ componente con props).
4. Verify per-section checklist: no bullet-only slides; second-person collaborative voice; one concept per slide; no emojis; speaker notes three-format with `<em>` blocks split per fragment-press.
5. Verify all referenced JS files exist (`clickable-steps.js` if §8 uses it).
6. Verify all `<section>` open/close tags balance (count grep equals).

## Task 11 — Verification

1. `npm start` in repo root if not already running. Open `http://localhost:3000/semanas/03/slides/`.
2. Walk through with arrow keys. Confirm:
   - Every slide renders.
   - Fragments fire in the intended order.
   - No console errors (open DevTools).
   - `clickable-steps` animation in §8 responds to click.
   - The roadmap highlight transitions match active-N per section.
3. (Static check, since no human walkthrough is possible while user is away) Run a local `curl` on `http://localhost:3000/semanas/03/slides/` to confirm 200; grep the served HTML for `<section>` tag balance.

## Task 12 — Finishing

1. Commit slides + plan with descriptive message.
2. Push branch (do NOT merge to main without user review).
3. Leave the branch in a state where the user can `git checkout feature/semana-03-slides` and review.
