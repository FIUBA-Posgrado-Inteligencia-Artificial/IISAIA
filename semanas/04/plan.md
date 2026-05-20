# Plan — Semana 04 Parte 2 (rediseñada)

> **For agentic workers:** REQUIRED SUB-SKILL: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar tarea por tarea. Steps usan checkbox `- [ ]`.

**Goal:** Regenerar `_section-7.html` a `_section-13.html`, renombrar el actual `_section-12.html` (trabajo final) a `_section-14.html`, y actualizar el preview map de §6.6 + plumbing del scaffold. Salida final: `semanas/04/slides/index.html` ensamblado con §1–§14 coherentes.

**Architecture:** Un fragmento HTML por sección (`_section-N.html`). Cada §7–§13 sigue la **plantilla documentation-walkthrough** del spec del rediseño (qué es / dónde vive / cuándo se carga / cómo se usa / casos límite / mini-demo). Cada sección abre con una **tarjeta de 5 preguntas** como divider (dispositivo recurrente nuevo de Parte 2, reemplaza al `.lens-tracker` que se descartó). El demo es un único bloque al final de cada sección — antes del demo, los slides muestran el contenido de los archivos del demo-repo vía `code-walkthrough` (constraint del profesor: una sola incursión a VS Code por sección).

**Tech stack:** reveal.js, `_config/theme/components.css`, `shared/patterns/`. Sin JS nuevo — reusa `clickable-steps.js` (de semana 01) para los beats de demo. Sin reactivar `.lens-tracker` en §7–§13.

**Spine:** `semanas/04/spine.md` (Parte 2 actualizada al rediseño 2026-05-19).
**Spec base:** `docs/superpowers/specs/2026-05-19-semana-04-parte2-redesign-design.md`.

---

## Conventions for execution

- **Plantilla obligatoria por sección §7–§13** — cada sección cubre las 6 sub-secciones del spec:
  1. **Qué es** (definición en una línea)
  2. **Dónde vive** (rutas; jerarquía si aplica, tabla)
  3. **Cuándo se carga / se aplica** (momento + trigger)
  4. **Cómo se usa** (sintaxis + ejemplos del demo-repo)
  5. **Casos límite / cosas que confunden** (anti-patterns, precedencias, gotchas)
  6. **Demo en VS Code** (bloque único al cierre, `section-divider` + `clickable-steps` con beats)
- **Tarjeta de 5 preguntas (divider de apertura)**: slide opener visual con las 5 preguntas listadas; la pregunta activa de la sección resaltada. Pattern nuevo — agregar a `shared/patterns/` la primera vez que se use (en §7) con un snippet reusable.
- **No `.lens-tracker` en §7–§13.** Decisión del rediseño. El que está en §6.5 queda como hanging promise aceptado.
- **Demo único al final**: `section-divider` "Demo · <título>" + slide con `clickable-steps` con 3–4 beats. Beats terse (~60–90 palabras en notes); el script vive en la demo en vivo, no en las notas. Plan B siempre en notes del último beat.
- **Rutas del demo-repo**: SIEMPRE relativas (`./CLAUDE.md`, `.claude/rules/api.md`, `backend/routers/users.py`). Nunca `semanas/04/demo-repo/...` — el profesor copia el repo afuera antes de dictar.
- **Estilo (memorias activas):** Argentine Spanish, "vos". Inglés para técnicos (status code, path, schema, frontmatter, glob, allow/deny/ask). Prohibidos: payoff, vibe coding, diplomatura, bisagra, "esta clase", "esta semana", scaffolding, andamiaje. Sin emojis. Sin meta-referencias al curso. Slides info-densos pero sin bullet lists planas — tablas, code blocks, jerarquías visuales.
- **Speaker notes (3-formato):** `<strong>` acciones / `<u>` descripción / `<em>` script entre comillas. Un `<p><em>...</em></p>` por reveal/fragmento. Target: ~80–200 palabras por slide; demo-beat slides ~60–90 (el script va en vivo).
- **Animaciones**: solo `clickable-steps.js` para beats de demo. Cero JS nuevo.

---

## Task 0 — Plumbing del scaffold + ensamblador

**Files:**
- Edit: `semanas/04/slides/_scaffold.html`
- Edit: `semanas/04/slides/_assemble.mjs`

**Steps:**
- [ ] **Step 1:** En `_scaffold.html`, después del bloque `<!-- INJECT_SECTION_12 -->`, agregar markers para §13 y §14:
  ```html
  <!-- ===== §13 — Plan mode + permission modes ===== -->
  <!-- INJECT_SECTION_13 -->
  <!-- /§13 -->

  <!-- ===== §14 — El trabajo final ===== -->
  <!-- INJECT_SECTION_14 -->
  <!-- /§14 -->
  ```
- [ ] **Step 2:** En `_scaffold.html`, actualizar los comentarios de label de §7–§12 para reflejar los nuevos títulos (CLAUDE.md y memoria automática / Rules / settings.json / Permisos / Skills y slash commands / Sub-agents). El §12 actual ("El trabajo final") queda como §14.
- [ ] **Step 3:** En `_assemble.mjs`, cambiar `for (let n = 1; n <= 12; n++)` por `for (let n = 1; n <= 14; n++)`.
- [ ] **Step 4:** Correr `node semanas/04/slides/_assemble.mjs` para verificar que ensambla sin warnings de markers faltantes (todavía faltan secciones nuevas, pero el script no debe fallar — solo loguear "WARN: marker for §N not found" para los que no existen).
- [ ] **Step 5:** Commit: `feat(s04 slides): plumbing scaffold + assembler para §13 y §14`.

## Task 1 — §6.6 fixup: preview map actualizado

**Files:**
- Edit: `semanas/04/slides/_section-6.html` (sólo §6.6 — `<!-- §6.6 · Lo que viene -->`)

**Steps:**
- [ ] **Step 1:** En `_section-6.html`, ubicar la slide `<!-- §6.6 · Lo que viene — preview §7–§11 -->`. Reemplazar el grid de 5 cards por uno de 7 cards (`grid-template-columns: repeat(7, 1fr)` o ajustar tamaño/typo si entra apretado — probar primero 7 col, si se ve mal hacer 4+3 wrap).
- [ ] **Step 2:** Nuevos cards (orden y títulos exactos del spine):
  - §7 — CLAUDE.md y memoria automática
  - §8 — Rules (`.claude/rules/`)
  - §9 — settings.json
  - §10 — Permisos
  - §11 — Skills y slash commands
  - §12 — Sub-agents
  - §13 — Plan mode y permission modes
- [ ] **Step 3:** **Eliminar** los `<span class="s6-prev-tag tag-context">Contexto</span>` y `tag-loop`. La taxonomía context/loop se descarta en Parte 2; los chips no aplican.
- [ ] **Step 4:** Reemplazar el sub-paragraph "Llevá esa pregunta a cada sección y las conexiones se hacen solas" por algo coherente con la nueva Parte 2 — sugerencia: "Cada sección abre con las mismas cinco preguntas — qué es, dónde vive, cuándo se carga, cómo se usa, qué confunde." Mantener tono concreto, sin meta-narración.
- [ ] **Step 5:** Reescribir el `<aside class="notes">` de §6.6: la narración actual habla del tracker y de "context/loop". Reemplazar por una narración sobre las 7 piezas configurables del runtime + la plantilla recurrente de 5 preguntas. Un `<em>` por reveal.
- [ ] **Step 6:** Quitar también los CSS para `.s6-prev-tag.tag-context` y `.s6-prev-tag.tag-loop` si quedaron sin uso (revisar `.s6-prev-tag` base — eso puede quedar).
- [ ] **Step 7:** Commit: `fix(s04 §6.6): preview map sincronizado con nueva Parte 2 §7–§13`.

## Task 2 — §7 CLAUDE.md y memoria automática (10 slides)

**Subagent dispatch.** Inputs: spine §7 + `source_material/07-CLAUDE-md.md` + demo-repo `CLAUDE.md` y `~/.claude/projects/...` (auto memory). Re-leer spine antes de empezar.

**Slide arc (10 slides):**

1. **Apertura — Tarjeta de 5 preguntas (dispositivo nuevo).** Pattern nuevo `five-questions-card.html` (agregar a `shared/patterns/` y catálogo). Layout: encabezado "Cada sección de Parte 2" + grid 5×1 con las 5 preguntas; las 4 primeras dimmed, la 1 ("Qué es") resaltada. Subtítulo: "§7 · CLAUDE.md y memoria automática". Speaker notes: explicar brevemente que esta tarjeta abre cada una de las 7 secciones; durante la sección la pregunta activa va a ir rotando (o se va a ir mostrando entera). Este slide también introduce el dispositivo para el resto de Parte 2.
2. **Qué es** — Card único, definición en una línea + propiedad central ("Cuesta contexto siempre"). Reusa la estructura del actual `.s7-focus-card` pero **sin el `.lens-tracker`** en la cabecera. Inserta la 5-questions card en mini en la cabecera con "Qué es" iluminada.
3. **Dónde vive — jerarquía 4 niveles** — Tabla `.s7-hierarchy` (cascade) con los 4 niveles (managed / user / project / local). Mantener layout actual de `_section-7.html` §7.3.
4. **Cuándo se carga — concatenación, no override** — Flow vertical `.s7-load-flow` (mantener layout actual §7.4). Warning sobre contradicciones.
5. **Cómo se usa — `@import` + comentarios HTML + tamaño** — `.s7-import-wrap` (mantener §7.5). El callout central: "@import no ahorra contexto".
6. **Casos límite — comparativa de tres confusiones** — Slide NUEVO. Grid 1×3 con: (a) contradicciones entre niveles, (b) @import no ahorra contexto, (c) auto memory ≠ CLAUDE.md. Card por card, jerarquía visual.
7. **Auto memory — el sistema paralelo** — Slide NUEVO o expandido desde §7.5. Card central con: qué es (Claude la escribe, no vos), dónde vive (`~/.claude/projects/<project>/memory/MEMORY.md`), cuándo se carga (primeras 200 líneas o 25 KB), cómo se audita (`/memory`). Citar la doc oficial (https://code.claude.com/docs/en/memory) al pie.
8. **Demo-repo ejemplo vivo** — Adaptar §7.6 actual ("Este repo como ejemplo vivo"). Reemplazar la ruta absoluta `/Users/enzo/Documents/IISAIA/CLAUDE.md` por `./CLAUDE.md` (relativa al demo-repo). `code-walkthrough` chico del demo-repo CLAUDE.md mostrando folder map + convenciones + workflow (3–4 fragmentos representativos, max 12 líneas total).
9. **Demo · /memory + /context** (`section-divider` + `clickable-steps`). Beats:
   - Beat 1: `cd demo-repo/` + `claude`, ejecutar `/memory`, mostrar user + project listados con sus paths.
   - Beat 2: `/context` (si disponible) — mostrar el delta atribuible a CLAUDE.md.
   - Beat 3: navegar a la carpeta `~/.claude/projects/<demo-repo>/memory/`, abrir `MEMORY.md` si existe (sino narrar que aparece cuando Claude aprende algo).
   - Plan B en notes del último beat: si `/context` no funciona, sostener el punto con `/memory` y narrar "todo lo que ven entró antes del primer mensaje".
10. **Cierre + bridge a §8** — Adaptar §7.9 actual. Reformular para que la pregunta del bridge ("¿y si una instrucción pudiera estar en contexto solo cuando hace falta?") aterrice en §8 Rules sin mencionar el tracker.

**Patterns:** `five-questions-card` (nuevo, agregar al catálogo), tablas cascade existentes en `.s7-hierarchy`, flow vertical, `code-walkthrough`, `section-divider`, `clickable-steps`.
**Animations:** sólo `clickable-steps` para beats del demo. Sin JS nuevo.
**Speaker-note target:** ~120–180 palabras/slide; demo beats ~60–90.

## Task 3 — §8 Rules (`.claude/rules/`) (9 slides)

**Subagent dispatch.** Inputs: spine §8 + `source_material/08-rules.md` + demo-repo `.claude/rules/{api,code-style,security,testing}.md`. Re-leer spine antes de empezar.

**Slide arc (9 slides):**

1. **Apertura — 5 preguntas card** (con "Qué es" iluminada, subtítulo "§8 · Rules"). Reusar el snippet `five-questions-card` agregado en Task 2.
2. **Qué es** — Card único: archivos `.md` modulares de instrucciones, ventaja organizativa sobre un CLAUDE.md monolítico.
3. **Dónde viven** — Tabla con los dos niveles + nota sobre recursión en subdirectorios. Layout cascade similar a §7.
4. **Cuándo se cargan — sin frontmatter vs con `paths:`** — Slide clave de la sección. `comparison-2col`: izquierda "sin frontmatter — siempre cargado" / derecha "con `paths: [...]` — path-scoped, cero contexto hasta tocar archivo que matchee".
5. **Cómo se usa — frontmatter + globs** — `code-walkthrough` del demo-repo `.claude/rules/api.md` mostrando el frontmatter completo (`paths: ["backend/**/*.py"]` o el glob real del demo-repo, verificar leyendo el archivo) + ejemplos de globs soportados.
6. **Las 4 rules del demo-repo** — Tabla con `code-style.md` / `testing.md` / `security.md` / `api.md` y su comportamiento (siempre cargadas vs path-scoped). Concreto al demo.
7. **Casos límite** — Slide con 3 confusiones: (a) no es `.cursorrules`, (b) sin `paths:` cuesta igual que CLAUDE.md, (c) el trigger es leer un archivo que matchea, no el path en sí.
8. **Demo · `/memory` antes y después** (`section-divider` + `clickable-steps`):
   - Beat 1: árbol `.claude/rules/`, abrir `api.md` con frontmatter, ejecutar `/memory` — `api.md` no aparece.
   - Beat 2: pedirle a Claude que lea `frontend/index.html`. Repetir `/memory` — `api.md` sigue sin aparecer (no matchea el glob).
   - Beat 3: pedirle a Claude que lea `backend/routers/users.py`. Repetir `/memory` — `api.md` ahora aparece cargada.
   - Plan B en notes: si `/memory` no muestra el detalle, mostrar por comportamiento (e.g., `api.md` prescribe regenerar `openapi.yaml`, Claude lo hace solo cuando edita backend/).
9. **Cierre + bridge a §9** — Hasta acá, instrucciones (markdown). Lo que viene es config (JSON) — no le decís al agente qué hacer, le decís al runtime cómo correrlo.

**Patterns:** `five-questions-card`, `comparison-2col`, tabla cascade, `code-walkthrough`, `section-divider`, `clickable-steps`.

## Task 4 — §9 settings.json (9 slides)

**Subagent dispatch.** Inputs: spine §9 + `source_material/09-settings-json.md` + demo-repo `.claude/settings.json` (leer el contenido real).

**Slide arc (9 slides):**

1. **Apertura — 5 preguntas card** (subtítulo "§9 · settings.json").
2. **Qué es** — Card con el contraste central: **NO son instrucciones para el agente** (eso es CLAUDE.md/rules); son parámetros del programa que envuelve al LLM.
3. **Dónde vive** — Tabla cascade con los 4 niveles (user / project / local-gitignored / managed).
4. **Cuándo se carga + precedencia** — Slide simple: arranque, merge entre niveles, precedencia (managed > local > project > user). Diagrama de pirámide o cascada visual.
5. **Cómo se usa — campos clave** — Tabla con los 7 campos del demo-repo: `model`, `env`, `permissions`, `hooks`, `includeCoAuthoredBy`, `cleanupPeriodDays`, `permissionMode`. Una fila por campo, columna "qué controla" + "ejemplo en demo-repo".
6. **Walkthrough del demo-repo settings.json** — `code-walkthrough` del archivo real, anotado por bloques (model + env arriba, permissions más adelante, hooks chico).
7. **Casos límite** — 3 confusiones: (a) `.local.json` siempre al `.gitignore`, (b) no es `mcp.json` (mecanismo distinto), (c) `permissions` es el campo más impactante (anticipo §10).
8. **Demo · los 3 archivos lado a lado** (`section-divider` + `clickable-steps`):
   - Beat 1: abrir los 3 archivos de settings simultáneamente (user / project / local).
   - Beat 2: cambiar `model` en uno, mostrar que aplica en próxima sesión.
   - Beat 3: abrir `.gitignore`, mostrar la entrada `.claude/settings.local.json`.
   - Plan B en notes: si no hay diferencia visible inmediata, sostener con la convención de "qué va en cada archivo y por qué".
9. **Cierre + bridge a §10** — El campo más impactante de settings.json es `permissions`. Vale una sección propia.

**Patterns:** `five-questions-card`, tabla cascade, tabla con dos columnas, `code-walkthrough`, `section-divider`, `clickable-steps`.

## Task 5 — §10 Permisos (11 slides)

**Subagent dispatch.** Inputs: spine §10 + `source_material/10-permisos.md` + demo-repo bloque `permissions` dentro de `.claude/settings.json`.

**Slide arc (11 slides):**

1. **Apertura — 5 preguntas card** (subtítulo "§10 · Permisos").
2. **Qué es** — Card único: sistema que decide qué tools puede ejecutar Claude **sin pedir confirmación**.
3. **Dónde vive** — Card chico: campo `permissions` dentro de `settings.json` (cualquier nivel) + comando `/permissions` para ajustar en sesión.
4. **Cuándo se evalúa + lógica de matching** — Diagrama flow: tool call → match deny? → match allow? → match ask? → default. Resaltar que `deny` tiene precedencia sobre `allow`.
5. **Sintaxis Tool(pattern)** — Card con la sintaxis + ejemplos cortos del demo-repo: `Bash(uv run pytest)`, `Bash(uvicorn backend.main:app *)`, `Edit(./backend/**)`, `Read(./.env)`.
6. **La matriz allow / deny / ask del demo-repo** — Tres code blocks separados (allow / deny / ask) con el bloque real del demo-repo. Layout grid 1×3 o vertical apilado.
7. **Cómo se aplican — `/permissions` en vivo** — Slide explicativa del comando interactivo + qué archivo edita (`.claude/settings.local.json` por default).
8. **Casos límite** — Tabla con 4 gotchas: (a) `Bash(*)` no existe (hay que ser explícito), (b) default = preguntar (no negar), (c) wildcards no matchean a través de `;`/`&&`, (d) deny > allow.
9. **Permission modes overlay** — Tabla con los 4 modes (`default` / `acceptEdits` / `plan` / `bypassPermissions`) y qué hace cada uno con allow/deny. Nota: `plan` se desarrolla en §13.
10. **Demo · prompt → /permissions → repetir** (`section-divider` + `clickable-steps`):
    - Beat 1: sesión nueva sin permisos configurados; pedir correr tests; aparece prompt "¿permitir Bash `uv run pytest`?".
    - Beat 2: negar; `/permissions` agrega al `allow`; repetir corrida — pasa sin prompt.
    - Beat 3: agregar `deny` para `Read(./.env)`; mostrar que bloquea.
    - Plan B en notes: si el flujo no coopera, mostrar el bloque `permissions` completo y narrar las reglas.
11. **Cierre + bridge a §11** — Los permisos limitan qué tools usa el agente. Las skills hacen lo contrario: le dan procedimientos que no traía.

**Patterns:** `five-questions-card`, flow diagram, tabla, `code-walkthrough`, grid 1×3, `section-divider`, `clickable-steps`.

## Task 6 — §11 Skills y slash commands (11 slides)

**Subagent dispatch.** Inputs: spine §11 + `source_material/11-skills-y-slash-commands.md` + demo-repo `.claude/skills/add-endpoint/SKILL.md` + `.claude/commands/add-endpoint.md`.

**Slide arc (11 slides):**

1. **Apertura — 5 preguntas card** (subtítulo "§11 · Skills y slash commands").
2. **Qué es — la distinción central** — `comparison-2col`: Skill (procedimiento completo: fases, verificaciones, anti-patterns) vs Slash command (atajo). Tipográficamente fuerte.
3. **Dónde viven** — Tabla 2×2: skills (project `.claude/skills/<nombre>/SKILL.md` + user + plugins) vs slash commands (project `.claude/commands/<nombre>.md` + user + plugins).
4. **Cuándo se cargan — clave: skills NO en contexto al arranque** — Card de honestidad: skills no están en contexto al inicio; solo nombre + descripción aparecen. Entran cuando se invocan explícitamente o la descripción matchea por relevancia. Slash commands se muestran en autocomplete con `/`, no consumen contexto hasta invocación.
5. **Cómo se usa — SKILL.md walkthrough** — `code-walkthrough` del frontmatter del demo-repo `SKILL.md` (`name`, `description`) + estructura del cuerpo (fases, anti-patterns). Anotado.
6. **Cómo se usa — slash command como disparador** — `code-walkthrough` del `.claude/commands/add-endpoint.md` del demo-repo, mostrando que solo invoca la skill. El procedimiento vive en la skill, no en el comando.
7. **Frontmatter `description` — por qué importa para la activación por relevancia** — Card con tip: "Use when X" no "X". Ejemplo bueno vs malo.
8. **Casos límite** — 3 confusiones: (a) algunos slash commands NO invocan skills (`/memory`, `/context`, `/permissions`), (b) skills pueden tener checklists, (c) ejemplo meta — el `/build-class` del curso es exactamente esto.
9. **Demo · `/context` sin la skill, invocar la skill, /context con la skill** (`section-divider` + `clickable-steps`):
   - Beat 1: sesión nueva, `/context` — la skill `add-endpoint` no aparece referenciada.
   - Beat 2: invocar la skill (`/add-endpoint posts` o describiendo la tarea); Claude empieza a seguir las fases del SKILL.md.
   - Beat 3: contrastar con misma tarea sin la skill — Claude inventa el flow.
   - Plan B en notes: si la skill no se activa por relevancia, usar el slash command que la invoca directo.
10. *(slide 10 — el budget pide 11; usar este slot para un slide intermedio si hace falta, p.ej. "Las skills built-in de Claude Code" o "Cómo se distribuye una skill: plugins")*. Decidir en el momento de generación según contenido del source_material; si no hace falta, condensar a 10.
11. **Cierre + bridge a §12** — Las skills aíslan un procedimiento. Los sub-agents aíslan un loop entero.

**Patterns:** `five-questions-card`, `comparison-2col`, tabla, `code-walkthrough`, `section-divider`, `clickable-steps`.

## Task 7 — §12 Sub-agents (9 slides)

**Subagent dispatch.** Inputs: spine §12 + `source_material/12-sub-agents.md` + demo-repo `.claude/agents/researcher.md`.

**Slide arc (9 slides):**

1. **Apertura — 5 preguntas card** (subtítulo "§12 · Sub-agents").
2. **Qué es** — Card único con la definición operativa + la línea anti-confusión: "NO es otra IA — es la misma lógica, aislada".
3. **Dónde viven** — Tabla con los 3 niveles (project `.claude/agents/<nombre>.md` + user + plugins/built-in como `Explore`, `Plan`).
4. **Cuándo se invoca** — Card: el supervisor llama el tool `Agent` con `subagent_type`. Algunas skills lo hacen automático.
5. **Cómo se usa — frontmatter de `researcher.md`** — `code-walkthrough` del archivo real con frontmatter (`name`, `description`, `tools` restringidos, `model` opcional). Anotar que el cuerpo es el system prompt del sub-agent.
6. **El padre solo recibe el resultado — diagrama** — Diagrama CSS estático: caja "padre" arriba con su ventana de contexto; caja "sub-agent" abajo con su propia ventana aislada; flecha de invocación abajo y flecha de retorno con solo "resultado". Sin animación nueva.
7. **Casos límite** — 4 cards: (a) la delegación no exime de supervisar (el padre no ve el razonamiento), (b) paralelización es beneficio secundario — el motivo principal es proteger el contexto, (c) el sub-agent puede leer 50 archivos y todo vive en su ventana, desaparece al terminar, (d) `tools:` restringido por default — no hereda todas las tools del padre.
8. **Demo · inline vs delegado, /context antes/después** (`section-divider` + `clickable-steps`):
   - Beat 1: pregunta "¿dónde se maneja la auth en este repo?" inline; `/context` después — la ventana del padre tiene los archivos leídos.
   - Beat 2: misma pregunta delegada al `researcher` sub-agent (o `Explore` built-in); `/context` después — el padre solo tiene el resumen.
   - Beat 3: mostrar `.claude/agents/researcher.md` con `tools:` restringido.
   - Plan B en notes: si la diferencia en `/context` no es dramática, narrar con el archivo abierto.
9. **Cierre + bridge a §13** — Sub-agents aíslan el contexto. Plan mode hace algo distinto: detiene el loop antes de actuar.

**Patterns:** `five-questions-card`, tabla, `code-walkthrough`, diagrama CSS estático, `section-divider`, `clickable-steps`.

## Task 8 — §13 Plan mode (+ permission modes) (11 slides)

**Subagent dispatch.** Inputs: spine §13 + `source_material/13-plan-mode.md`. Reusa la tabla de permission modes adelantada en §10.

**Slide arc (11 slides):**

1. **Apertura — 5 preguntas card** (subtítulo "§13 · Plan mode").
2. **Qué es** — Card único: modo de operación que separa "pensar" de "actuar". Claude lee y propone; las escrituras esperan aprobación.
3. **Dónde vive — los 4 permission modes** — Tabla completa con `default` / `acceptEdits` / `plan` / `bypassPermissions` y qué permite cada uno. Más detallada que la de §10.
4. **Cuándo se activa — 3 caminos** — Tarjetas o flow: (a) flag al arranque `--permission-mode plan`, (b) campo `permissionMode: "plan"` en `settings.json`, (c) `Shift+Tab` cicla entre modos durante la sesión + la UI muestra el modo activo.
5. **Cómo se usa — flujo** — Diagrama horizontal: tarea → plan → revisión → `ExitPlanMode` → ejecución. El plan es el contrato: una vez aprobado, Claude ejecuta sin volver a parar (a menos que toque un `deny`).
6. **Cuándo elegir cada modo** — Tabla con los 4 modes y "cuándo usarlo según reversibilidad". Recomendación: `plan` para tareas grandes / multi-archivo / sin certeza del enfoque; `acceptEdits` para tareas chicas con tests rápidos; `bypassPermissions` solo en sandboxes efímeros; `default` en el resto.
7. **Casos límite** — 3 confusiones: (a) plan mode NO es sandbox (es un freno deliberado), (b) el gate de permisos (§10) y el modo son ortogonales — pueden combinarse, (c) plan mode no protege contra `Bash` riesgoso si tras aprobar algo lo ejecuta.
8. **Plantilla de un plan típico** — `code-walkthrough` chico de un plan ejemplo (estructura: goal / files / steps con checkbox / verification). Mostrar que es el contrato que se aprueba.
9. **Demo · refactor multi-archivo: con y sin plan mode** (`section-divider` + `clickable-steps`):
   - Beat 1: modo `default` — pedir el refactor; Claude empieza a editar; cancelar.
   - Beat 2: `Shift+Tab` hasta `plan` (UI muestra el modo); misma tarea; Claude responde con un plan, no edita.
   - Beat 3: revisar plan, corregir ("no toques `users.py`"), aprobar; Claude ejecuta la versión aprobada.
   - Plan B en notes: si la UI de modo no es visible en grabación, narrar el cambio; la diferencia conductual se ve igual.
10. *(slide 10 — slot opcional para "plan mode como defensa contra la deriva" — slide bisagra antes del cierre. Decidir en el momento)*. Si no se usa, condensar a 10.
11. **Cierre + bridge a §14** — Tenés el runtime. La última sección cierra el arco completo del curso.

**Patterns:** `five-questions-card`, tabla, flow diagram, `code-walkthrough`, `section-divider`, `clickable-steps`.

## Task 9 — §14 Rename (sin cambios de contenido)

**Files:**
- Rename: `semanas/04/slides/_section-12.html` → `semanas/04/slides/_section-14.html` (vía `git mv`).

**Steps:**
- [ ] **Step 1:** `git mv semanas/04/slides/_section-12.html semanas/04/slides/_section-14.html` (preserva history).
- [ ] **Step 2:** Abrir el archivo renombrado y buscar referencias internas a "§12" o ids tipo `s12-*` que valga la pena renombrar para coherencia. La regla: NO cambiar contenido didáctico; SÍ actualizar prefijos de CSS scoped (`.s12-` → `.s14-` si conviene) e ids/comentarios para evitar confusión futura. Si el archivo no tiene prefijos scoped, no tocar.
- [ ] **Step 3:** Verificar que `_assemble.mjs` después de Task 0 lo levanta correctamente (debería loguear "init §14" si tiene init blocks; sino, solo splice).
- [ ] **Step 4:** Commit: `refactor(s04 §14): renombrar _section-12 → _section-14 (trabajo final)`.

## Task 10 — Coherence pass + assemble + verification

**Files:**
- Edit: `semanas/04/slides/index.html` (regenerado por `_assemble.mjs`)
- Edit: cualquier archivo que requiera fix de coherencia detectado

**Steps:**
- [ ] **Step 1:** Re-correr `node semanas/04/slides/_assemble.mjs`. Verificar output: 14 init blocks listados o las warnings explícitas; sin "ERROR" ni "unfilled markers".
- [ ] **Step 2:** Abrir `slides/index.html` en navegador (`npm start` desde la raíz del repo, `http://localhost:3000/semanas/04/slides/`). Walk completo §1 → §14:
  - §6 transición a §7 limpia (el preview map actualizado).
  - §7 → §13 cada uno abre con el 5-questions card y cierra con bridge.
  - §13 → §14 hace sentido (trabajo final no es un feature más).
  - Ningún `.lens-tracker` en §7–§13.
  - Fragments fire, animaciones load, no errores en consola.
- [ ] **Step 3:** Chequear que no haya menciones de "esta semana"/"esta clase", "payoff", "vibe coding", "diplomatura", "bisagra", "scaffolding", "andamiaje" introducidas en las secciones nuevas. Grep:
  ```
  grep -niE "(esta semana|esta clase|payoff|vibe coding|diplomatura|bisagra|scaffolding|andamiaje)" semanas/04/slides/_section-{7,8,9,10,11,12,13,14}.html
  ```
- [ ] **Step 4:** Chequear que las rutas del demo-repo son siempre relativas (`./CLAUDE.md`, `.claude/...`, `backend/...`) — nunca `semanas/04/demo-repo/...`:
  ```
  grep -n "semanas/04/demo-repo" semanas/04/slides/_section-{7,8,9,10,11,12,13}.html
  ```
- [ ] **Step 5:** Confirmar que `shared/patterns/` tiene una entrada nueva para `five-questions-card.html` con su row en el catálogo (README.md). Si no, agregarla — el snippet primero, después la row.
- [ ] **Step 6:** Commit final: `feat(s04 slides): Parte 2 rediseñada — §7–§14`.

## Task 11 — Finishing branch

- [ ] **Step 1:** Invocar `superpowers:finishing-a-development-branch`. Decidir merge a `main`, PR, o stay-on-branch según contexto.

---

## Open decisions (defer to execution)

- **Layout del 5-questions card**: ¿siempre fila horizontal (grid 5×1) o vertical apilado? Probar en §7 (Task 2) y replicar en §8–§13. Si las 5 preguntas en horizontal se cortan visualmente, hacer vertical.
- **Slides slot 10 de §11 y §13** (los que el budget pide pero el contenido no exige claramente): decidir en el momento de generación. Si no hay material que justifique, condensar a 10 slides y dejar nota en el commit message.
- **CSS scoped en _section-14.html**: si hay prefijos `.s12-*` decidir si vale la pena renombrarlos a `.s14-*` o dejarlos por coherencia con history. Tiebreaker: si renombrar requiere tocar >5 selectors, no tocar.
