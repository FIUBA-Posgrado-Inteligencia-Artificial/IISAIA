# Plan — Semana 05: Plugins de Claude Code y Superpowers

> **For agentic workers:** REQUIRED SUB-SKILL: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar tarea por tarea. Steps usan checkbox `- [ ]`.

**Goal:** Generar `semanas/05/slides/index.html` con 15 secciones que cubran el arco "piezas → paquete → metodología" del spine, ensambladas desde fragmentos `_section-N.html` vía el patrón establecido en S04 (`_scaffold.html` + `_assemble.mjs`). Salida final: deck reveal.js corriente abrible desde `npm start`.

**Architecture:** Un fragmento HTML por sección. Setup (Task 0) clona el patrón de scaffold de S04 con markers para §§1-15. Cada §§1-13 sigue el slide arc del spine; §§6-7 y §§9-13 comparten **plantilla común** (qué hace / cuándo se activa / por qué importa / punto crítico / anti-patrones + captura del demo-repo de S04). El **pipeline-roadmap del happy-path** se introduce en §4 y se re-ilumina pieza por pieza en §§6-7 y §§9-13 usando el patrón `pipeline-roadmap.html` con clases `.highlight-<group>` toggleadas via Reveal listeners.

**Tech stack:** reveal.js, `_config/theme/components.css`, `shared/patterns/`. **Sin JS bespoke nuevo** — reuso opcional de `clickable-steps.js` (de S01) si una sección lo pide. Re-iluminación del pipeline-roadmap es CSS + Reveal listeners (no JS de animación).

**Spine:** `semanas/05/spine.md`.
**Source material canónico:** `semanas/05/source_material/index.md` y los 15 archivos numerados.

---

## Conventions for execution

- **Plantilla recurrente §§6-7 y §§9-13** (las 7 skills del happy-path):
  1. Apertura con **mini pipeline-roadmap** del happy-path con la skill actual iluminada (clase `.highlight-<skill>` en `.pipe-grid`).
  2. **Qué hace** — definición operativa.
  3. **Cuándo se activa** — trigger.
  4. **Por qué importa** — problema que resuelve.
  5. **Punto crítico** — regla no negociable.
  6. *(Si aplica)* **Artefacto en disco** — para skills con output persistente (§§6, §7).
  7. *(Si aplica)* **Punto de auto-review** — para §§6, §7, §9.
  8. **Anti-patrones a evitar** — qué NO hacer.
  9. **Captura del demo-repo de S04** — screenshot real del flujo aplicado.

  §8 (git refresher + GitHub Flow) usa plantilla distinta porque no es skill.

- **Pipeline-roadmap del happy-path** — pattern `pipeline-roadmap.html`. Nodos (en orden):
  - `brainstorming` (group `s6`)
  - `writing-plans` (group `s7`)
  - `GitHub Flow` (group `s8`, visualmente delimitado como "envoltorio")
  - `subagent-driven-development` (group `s9`)
  - `test-driven-development` (group `s10`)
  - `requesting-code-review` (group `s11`)
  - `verification-before-completion` (group `s12`)
  - `finishing-a-development-branch` (group `s13`)

  En §4 se introduce con todos los nodos visibles vía fragments. En §§6-7 y §§9-13 reaparece como **mini-header** del slide de apertura con la clase `.highlight-sN` en `.pipe-grid` para destacar la pieza activa. La re-iluminación es CSS pura (las clases ya existen en `components.css`; verificar en Task 0 y agregar si faltan).

- **Capturas del demo-repo de S04** — son **placeholders por ahora**. Cada captura aparece como `<img src="../img/section-N-demo-{slug}.png" alt="...">` (no commiteamos imágenes todavía). El profesor las completará en una pasada posterior, pre-clase. Las anotaciones de qué tiene que mostrar cada captura están en los comentarios HTML `<!-- INSERT-USER-CAPTURE -->` que el source_material ya trae.

- **Estilo (memorias activas):** Argentine Spanish, "vos". Inglés para técnicos (status code, path, schema, frontmatter, glob, allow/deny/ask, marketplace, plugin, scope, branch, commit, PR, merge, hook, spec, plan, review, subagent). Prohibidos: payoff, vibe coding, diplomatura, bisagra, "esta clase / esta semana / la firma de esta clase", scaffolding, andamiaje. Sin emojis. Sin meta-referencias al curso. Sin "diplomatura". Demos solo en Parte 2 (Claude Code) — todos los demos en vivo van en §§3, §5, y dentro de §§6-13 como parte de la plantilla.

- **Speaker notes (3-formato):** `<strong>` acciones / `<u>` descripción / `<em>` script entre comillas. Un `<p><em>...</em></p>` por reveal/fragmento. Target: **~80–200 palabras por slide**; slides con demo o que sólo apoyan demo en vivo ~60–90.

- **Hooks que cargan los openers** (ya decididos en spine, no negociar):
  - §1 — pregunta inversa "¿tenés que escribirlas siempre vos?"
  - §4 — frase del README de Superpowers
  - §6 — la regla del 1% del frontmatter
  - §7 — meta-revelación de auto-aplicación (cierre, no apertura)
  - §9 — "fresh subagent o no arranca"
  - §10 — "si nunca lo viste rojo, no estás midiendo nada — estás creyendo"
  - §12 — "compilar es la barrera más baja del éxito"

- **Slides openers son SIEMPRE sin bullets**. Visual structure (comparison, flow, pipeline, hook frase grande). Bullets aceptables sólo en slides "qué es" de definición o "3 decisiones" de howto.

- **No mencionar otras entregas / alumnos** en ningún slide.

---

## Task 0 — Scaffold + assembler + pipeline-roadmap base

**Files:**
- Create: `semanas/05/slides/_scaffold.html`
- Create: `semanas/05/slides/_assemble.mjs`
- Create: `semanas/05/slides/_section-1.html` a `_section-15.html` (stubs vacíos)
- Verify: `_config/theme/components.css` tiene clases `.pipe-grid.highlight-s6` ... `.highlight-s13` (agregar si faltan)

**Steps:**

- [ ] **Step 1: Copiar `_scaffold.html` desde S04 como base.** Comando: `cp semanas/04/slides/_scaffold.html semanas/05/slides/_scaffold.html`. Editar el `<title>` a `Semana 05 — Plugins de Claude Code y Superpowers`. Mantener el block de `<style>` safety net (overflow + pre/code wrapping). **Quitar** los `<style>` de `.lens-tracker` (no se usa en S05). Mantener `.s7-five-q-*` si está (puede que se reuse en §§6-13 — verificar).

- [ ] **Step 2: Reemplazar el title slide** en el scaffold por:
  ```html
  <section class="title-slide">
    <h1>Plugins de Claude Code y Superpowers</h1>
    <p class="subtitle">De piezas escribibles a paquetes instalables, y al flujo que opera sobre ellos.</p>
    <p class="muted">Introducción al desarrollo de software asistido por IA</p>
  </section>
  ```
  El `<h1>` es el topic (sin "Semana 05" — esa info vive solo en `<title>`).

- [ ] **Step 3: Reemplazar los markers `<!-- INJECT_SECTION_1 -->` ... `<!-- INJECT_SECTION_14 -->` por `1..15`.** Cada bloque queda como:
  ```html
  <!-- ===== §N — <título corto> ===== -->
  <!-- INJECT_SECTION_N -->
  <!-- /§N -->
  ```
  Títulos cortos en orden:
  1. De piezas a paquetes
  2. Qué es un plugin
  3. Marketplaces e instalación
  4. Superpowers — qué problema resuelve
  5. Instalar Superpowers
  6. brainstorming
  7. writing-plans
  8. git refresher + GitHub Flow
  9. subagent-driven-development
  10. test-driven-development
  11. requesting-code-review
  12. verification-before-completion
  13. finishing-a-development-branch
  14. Resto del cinturón
  15. Bajada al trabajo final

- [ ] **Step 4: Copiar `_assemble.mjs` desde S04** y editar:
  - Cambiar `for (let n = 1; n <= 14; n++)` por `for (let n = 1; n <= 15; n++)`.
  - **Quitar** las líneas que wirean `four-loop-anim.js` (no se usa en S05). Mantener el wiring de `clickable-steps.js` (puede que se use).

- [ ] **Step 5: Crear `clickable-steps.js`** copiando desde `semanas/04/slides/clickable-steps.js` o `semanas/01/slides/clickable-steps.js`. Comando: `cp semanas/04/slides/clickable-steps.js semanas/05/slides/clickable-steps.js`.

- [ ] **Step 6: Crear stubs `_section-1.html` a `_section-15.html`** — cada uno con un slide placeholder que sólo diga `<section><h2>§N — TODO</h2></section>` para que el assembler corra sin warnings. Esto permite testear pipeline-roadmap sin que falten markers.

- [ ] **Step 7: Verificar/agregar CSS para `.pipe-grid.highlight-sN`** en `_config/theme/components.css`. Buscar las clases `.pipe-grid.highlight-A`, `.highlight-B`, etc. Si existen solo con grupos de S01, **agregar reglas equivalentes para `.highlight-s6`, `.highlight-s7`, `.highlight-s9`, `.highlight-s10`, `.highlight-s11`, `.highlight-s12`, `.highlight-s13`** (no `s8` — git no es skill, no aparece como nodo iluminable independiente; el envoltorio "GitHub Flow" se trata como contexto del flow). Reglas: `opacity: 0.35` para los `.pipe-node` no del grupo activo + opacity completa para el `.pipe-node[data-group="sN"]`. Spec del CSS:
  ```css
  .pipe-grid.highlight-s6 .pipe-node:not([data-group="s6"]) { opacity: 0.35; }
  /* ... etc para s7, s9-s13 */
  ```

- [ ] **Step 8: Correr el assembler** y verificar el output:
  ```bash
  node semanas/05/slides/_assemble.mjs
  ```
  Expected: `sections: 16 open / 16 close` (15 secciones + título), `unfilled markers: 0`, `init blocks: 0`.

- [ ] **Step 9: Probar en el navegador** que `index.html` carga (`npm start`, abrir `http://localhost:3000/semanas/05/slides/`). Deberías ver el title slide + 15 slides con "§N — TODO". Navegación derecha/izquierda funciona.

- [ ] **Step 10: Commit.**
  ```bash
  git add semanas/05/slides/ _config/theme/components.css
  git commit -m "feat(s05): scaffold + assembler + stubs para §1–§15"
  ```

---

## Task 1 — §1 De piezas sueltas a paquetes (3–4 slides)

**Subagent dispatch.** Inputs: spine §1 + `source_material/01-de-piezas-a-paquetes.md`. Re-leer el spine antes de empezar.

**Slide arc:**

1. **Hook — pregunta inversa.** Pattern: opener visual sin bullets. Frase grande tipo:
   > "Sabés que podés escribir cada una de las piezas del runtime de Claude Code. La pregunta de hoy es la opuesta: **¿tenés que escribirlas siempre vos?**"
   Subtexto pequeño: "Semana 04 te dio las piezas. Hoy las recibís empaquetadas." Sin reveals — el slide entra entero.

2. **Recap visual de las 7 piezas de S04.** Pattern: grid (no `pipeline-roadmap`) — 7 cards en gris claro con los nombres (`CLAUDE.md`, `rules`, `settings.json`, `permisos`, `skills`, `sub-agents`, `slash commands`, `plan mode` — verificar cuáles son las 7 reales del scaffold de S04 leyendo `semanas/04/spine.md` §§7-13). Subtítulo: "Lo que armaste vos pieza por pieza. Hoy llega ya empaquetado." Sin reveals o uno solo para el subtítulo.

3. **Las tres complicaciones sin formato común.** Pattern: grid 3×1 con reveals progresivos (uno por complicación). Cada card es título + frase corta:
   - **Descubrimiento** — "No sabés dónde buscar. ¿GitHub? ¿Discord? ¿Blogs?"
   - **Bajada** — "Cada autor organiza distinto. Cada vez es un puzzle nuevo."
   - **Mantenimiento** — "No hay versión. Tenés una foto inmóvil."
   Speaker notes desarrollan cada complicación con el ejemplo del source.

4. **El nombre del formato.** Slide de cierre/bridge:
   > "La respuesta tiene nombre: **plugin**."
   Subtítulo: "Un formato estándar que junta esas piezas en un paquete reconocible. El autor lo publica; vos lo instalás con un comando." Bridge al §2.

**Patterns:** opener visual (frase grande), grid 7×1 para recap, grid 3×1 para las complicaciones. Sin pipeline-roadmap (todavía).
**Animations:** Ninguna JS. Reveals CSS only.
**Speaker-note target:** ~150–200 palabras/slide para los slides 1 y 4; ~120–160 para 2 y 3.

---

## Task 2 — §2 Qué es un plugin de Claude Code (4–5 slides)

**Subagent dispatch.** Inputs: spine §2 + `source_material/02-plugins-que-son.md`. Re-leer spine antes.

**Slide arc:**

1. **Definición literal de la doc.** Frase grande en el centro:
   > "Plugin: directorio autocontenido de componentes que extiende Claude Code."
   Subtítulo con las dos palabras clave en mono: `directorio autocontenido` + `componentes`. Speaker notes leen la definición despacio y explican qué importa de cada palabra.

2. **Anatomía mínima — árbol de directorios.** Pattern: `code-walkthrough` con el árbol del source `02-plugins-que-son.md`:
   ```text
   mi-plugin/
   ├── .claude-plugin/
   │   └── plugin.json        # manifest opcional con metadata
   ├── skills/                # una carpeta por skill, con su SKILL.md
   ├── agents/                # sub-agents en archivos markdown
   ├── hooks/
   │   └── hooks.json         # configuración de hooks
   └── commands/              # slash commands como .md sueltos
   ```
   Fragments opcionales: revelar `.claude-plugin/` primero, después los demás folders. Notas: cada folder es uno de los componentes que ya vieron en S04, ahora bajo un layout estándar.

3. **El manifest mínimo.** `code-walkthrough` con:
   ```json
   {
     "name": "mi-plugin",
     "version": "0.1.0",
     "description": "Un plugin de ejemplo",
     "author": { "name": "Equipo", "email": "equipo@ejemplo.com" }
   }
   ```
   Highlight: sólo `name` es obligatorio. El resto suma metadata útil. Notas: si no ponés `plugin.json`, Claude Code autodescubre y deriva el nombre del folder.

4. **El mapping complicación → respuesta.** Pattern: tabla 3-col o `comparison` extendido. Tres filas, columnas: **Complicación (de §1)** / **Respuesta del formato** / **Cómo funciona (preview)**.
   - Descubrimiento / habilita marketplaces / "Lo vemos en §3"
   - Bajada / layout estandarizado / "Skills siempre en `skills/`, agents siempre en `agents/`, …"
   - Mantenimiento / versión declarada en `plugin.json` / "Con campo `version` o SHA del commit como cache key"
   Reveals progresivos por fila. Es la slide de payoff conceptual de §1+§2.

5. *(Opcional, si el budget lo aguanta)* **Cierre — preview de §3.** Slide corto con el bridge:
   > "No tenés que adivinar qué existe — hay marketplaces. No tenés que aprender el layout de cada autor — el layout es uno solo. No tenés que rastrear cambios — hay versión."
   > "Lo único que falta es el comando que instala. Eso viene ya."

**Patterns:** `code-walkthrough` (snippet del catálogo), grid/tabla 3×3 para el mapping. Sin pipeline-roadmap.
**Animations:** Ninguna JS. Reveals CSS only.
**Speaker-note target:** ~120–180 palabras/slide.

---

## Task 3 — §3 Marketplaces e instalación (5–6 slides + demo)

**Subagent dispatch.** Inputs: spine §3 + `source_material/03-plugins-distribucion.md`. Re-leer spine antes.

**Slide arc:**

1. **El comando que falta.** Hook visual:
   > "El plugin existe en disco como folder. Cuando lo escribió otro autor, ese folder vive en su máquina. **¿Cómo llega al tuyo?**"
   > "No clonás. No copiás archivos a mano. **Llega por un comando**, y el comando se apoya en un registro: el **marketplace**."

2. **Marketplace — definición + dos tipos.** Card central con la definición + grid 2×1:
   - **Oficial** (`claude-plugins-official`) — mantenido por Anthropic, **pre-registrado** (no hace falta agregarlo).
   - **Comunitario** — cualquiera puede armar uno. Se agrega con:
     ```text
     /plugin marketplace add <usuario-github>/<repo>
     ```
   Notas explican que después del add, sus plugins están disponibles igual que los del oficial.

3. **Analogía rápida.** Slide corto:
   > "Un marketplace es a Claude Code lo que **npm** es a Node, o lo que el **extension store** es a VS Code."
   Tres íconos chicos o tres cards (npm / extension store / marketplace) para anclar visualmente. Notas: registro central + metadata estandarizada + consultable por nombre.

4. **Los cuatro comandos del ciclo de vida.** Pattern: opción A — `clickable-steps` reusando `clickable-steps.js`. Opción B — grid 2×2 con cuatro cards revealed progresivamente (más simple, recomendado).
   Cuatro cards, cada una con sintaxis + 1 línea de qué hace:
   - `/plugin install <plugin>@<marketplace>` — descarga + registra.
   - `/plugin update <plugin>` — actualiza a la última versión.
   - `/plugin uninstall <plugin>` — desinstala. `--keep-data` para conservar el data dir.
   - `/plugin list` — lista lo instalado, versión, marketplace, habilitado.

5. **Scope de instalación — tres opciones.** Pattern: tabla 3×3 con columnas **Scope** / **Dónde se registra** / **Cuándo usarlo**:
   - `user` (default) — `~/.claude/settings.json` — uso personal en todos los proyectos.
   - `project` — `.claude/settings.json` del repo — equipo, versionado.
   - `local` — `.claude/settings.local.json` (gitignored) — sólo en tu copia.
   Speaker notes: default es `user`, opt-in a `project` cuando querés que el plugin viaje con el repo.

6. **Demo en vivo — anatomía en disco.** `section-divider` + slide con `clickable-steps` con 3 beats:
   - Beat 1: `code ~/.claude/plugins/cache/claude-plugins-official/` — mostrar que es un folder real.
   - Beat 2: abrir un `.claude-plugin/plugin.json` y un `SKILL.md` adentro de `skills/<alguna>/`.
   - Beat 3: cerrar con "es el mismo árbol que dibujamos hace dos minutos en §2".
   Plan B en notes: screenshot pre-armado del árbol del cache si el comando no coopera.

**Patterns:** opener visual, grid 2×1, grid 2×2 o `clickable-steps`, tabla 3×3, `section-divider` + `clickable-steps` para demo.
**Animations:** `clickable-steps.js` para el demo (último slide).
**Speaker-note target:** ~120–180 palabras/slide; demo beats ~60–90.

---

## Task 4 — §4 Superpowers — qué problema resuelve (6–7 slides) **+ introducir pipeline-roadmap**

**Subagent dispatch.** Inputs: spine §4 + `source_material/04-superpowers-que-es.md`. Re-leer spine antes.

**Slide arc:**

1. **Hook — frase del README.** Slide opener con la frase grande:
   > "Apenas ve que estás construyendo algo, **no salta a escribir código**. En vez de eso, da un paso atrás y te pregunta qué estás tratando de hacer realmente."
   Atribución pequeña al pie: "—README de Superpowers". Sin reveals.

2. **El problema diagnostico.** Pattern: `comparison-2col` o flow vertical. Izquierda: el flujo sin metodología — "le pedís algo → arranca a tipear → desfasaje tarde, con 20 mensajes y archivos commiteados". Derecha: el flujo con — "entendé qué construís → spec → plan → ejecutá → verificá → mergeá". Cierre: "Detectar desfasaje en palabras es barato. En código ya escrito es caro."

3. **Qué es Superpowers — definición.** Card central:
   > "Una metodología completa de desarrollo de software para tu coding agent, construida sobre un set de skills componibles."
   Dos chips abajo: `skills componibles` (callback explícito a §2 — formato plugin) + `metodología` (callback a la próxima parte de la sección).

4. **El happy-path completo — `pipeline-roadmap` (introducción).** **Este es el slide ancla de toda Parte 3.** Pattern: `pipeline-roadmap.html` con los 8 nodos (7 skills + GitHub Flow como envoltorio):
   ```
   brainstorming → writing-plans → [GitHub Flow] → subagent-driven-development
                → test-driven-development → requesting-code-review
                → verification-before-completion → finishing-a-development-branch
   ```
   Cada nodo con `data-group="sN"` (s6, s7, s8 para GitHub Flow envoltorio, s9, s10, s11, s12, s13). Reveals progresivos via fragments. **El layout debe permitir que en §§6-13 se inserte como mini-header con un nodo iluminado.**
   Speaker notes: este mapa es el resto de la clase. Cada sección de Parte 3 va a iluminar una pieza. Quedate con este mapa.

5. **Cuatro principios filosóficos.** Pattern: grid 2×2 con los cuatro principios + frase corta cada uno:
   - **TDD** — Tests primero, siempre.
   - **Sistemático antes que improvisado** — Un proceso definido por encima de improvisar.
   - **Complexity reduction** — Simplicidad como objetivo primario.
   - **Evidence over claims** — Verificar antes de declarar éxito.
   Notas: ninguno es nuevo en ingeniería; lo nuevo es aplicarlos al loop con el agente, no sólo al código que el agente produce.

6. **Lo que NO hace.** Pattern: grid 3×1 con reveals progresivos. Honest disclosure. Tres puntos del source:
   - **No escribe código sin que vos decidas qué construir.**
   - **No reemplaza tu criterio arquitectónico.**
   - **No funciona en piloto automático.**
   Notas: cada punto desarrollado brevemente. Cierre: "El plugin estructura la conversación. Las respuestas las ponés vos."

7. **Bridge — "ahora instalamos".** Slide chico de transición a §5. Una frase + roadmap reducido en la esquina.

**Patterns:** `comparison-2col`, `pipeline-roadmap` (nuevo en S05), grid 2×2, grid 3×1.
**Animations:** Ninguna JS. CSS-only.
**Speaker-note target:** ~140–200 palabras para slide 1, 2, 4 (los conceptuales); ~100–150 para 5, 6.

---

## Task 5 — §5 Instalar Superpowers en vivo (2–3 slides + demo)

**Subagent dispatch.** Inputs: spine §5 + `source_material/05-instalar-superpowers.md`. Re-leer spine antes.

**Slide arc:**

1. **El comando.** Slide soporte con sólo el code block grande:
   ```bash
   /plugin install superpowers@claude-plugins-official
   ```
   Subtítulo: "Un solo comando. Marketplace oficial pre-registrado, no hace falta `marketplace add`."

2. **Verificar.** Slide soporte:
   ```bash
   /plugin list
   ```
   Subtítulo: "`superpowers` aparece con versión + marketplace `claude-plugins-official`."

3. **Demo en vivo + Plan B.** `section-divider` + slide con instrucciones para el profesor (en speaker notes, no on-slide):
   - Demo flow: abrir Claude Code en terminal limpia → correr `/plugin install superpowers@claude-plugins-official` → esperar que termine → correr `/plugin list` → mostrar las 14 skills en otro `/plugin info`.
   - Plan B en notes: screenshot pre-armado de antes/después de `/plugin list`. Marketplace alternativo `obra/superpowers-marketplace` documentado. `/reload-plugins` si las skills no aparecen.

**Patterns:** code-walkthrough mínimo, `section-divider` para el demo.
**Animations:** Ninguna.
**Speaker-note target:** ~80–120 palabras para slides 1 y 2; ~100–140 para el slide de demo (donde vive el guion del profesor).

---

## Task 6 — §6 brainstorming (7–8 slides)

**Subagent dispatch.** Inputs: spine §6 + `source_material/06-brainstorming.md`. Re-leer spine antes.

**Slide arc (plantilla §§6-7 y §§9-13):**

1. **Apertura — mini pipeline-roadmap + skill iluminada.** Reusar el snippet del `pipeline-roadmap` de §4 (extraer a un partial si es práctico) con `.highlight-s6` aplicada a `.pipe-grid`. Título grande arriba: "§6 — brainstorming". Sin reveals — entra entero.

2. **Hook — la regla del 1%.** Frase grande:
   > "Si hay un **1 %** de probabilidad de que el pedido implique construir algo, la skill se invoca."
   Subtítulo más chico: "Es deliberadamente paranoica. Aplica a todo proyecto sin importar cuán simple parezca." Notas explican: los proyectos "simples" son donde las suposiciones no examinadas hacen más daño.

3. **Qué hace.** Card o flow vertical: idea cruda → diálogo dirigido (propósito / restricciones / criterios de éxito) → 2-3 approaches con trade-offs → spec aprobado por vos. Anti-bullet: usar un flow con flechas, no una lista.

4. **Cuándo se activa.** `comparison-2col`:
   - Izquierda **"Sí se activa"** — features nuevas, componentes nuevos, agregar funcionalidad, modificar comportamiento. Incluye scripts triviales y cambios de config.
   - Derecha **"No se activa"** — leer código, explicar cómo funciona, debug, correcciones mecánicas donde el diseño ya está fijado.

5. **Por qué importa.** Slide soporte con la frase central:
   > "Sin esta skill, el modelo arranca a codear con la primera interpretación plausible. El trabajo desechado en los rebotes es el costo real que la skill ataca."
   Sub-card al lado: el problema del scope creep — pedidos que son cinco proyectos disfrazados de uno.

6. **Punto crítico — una pregunta por vez + hard gate.** Card único en el centro:
   > "Una pregunta por vez. Multiple choice cuando se puede. **Nunca implementar nada — ni un esqueleto del proyecto, ni un archivo vacío — antes de que vos hayas aprobado el diseño escrito.**"

7. **El artefacto en disco + auto-review.** Slide dividido en dos:
   - Izquierda: el path completo del spec — `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`. Está commiteado al repo. Las próximas skills lo leen desde ahí, no desde la conversación.
   - Derecha: **Spec Self-Review** interno antes de pedir review humano: placeholders, contradicciones, scope, ambigüedades. "Vos nunca deberías leer un 'TBD' en tu propio spec."

8. **Anti-patrones + captura demo-repo S04.** Slide dividido:
   - Arriba: tres anti-patrones (grid 3×1):
     - "Esto es muy simple, no necesita diseño."
     - Combinar varias preguntas en un solo mensaje.
     - Invocar implementación antes de la aprobación.
   - Abajo: placeholder de captura — `<img src="../img/section-6-demo-spec.png" alt="Spec resultante del demo-repo S04">` con caption breve. Si la imagen no existe todavía, dejar el `<img>` con `alt` claro + comment HTML `<!-- TODO captura: ver placeholder spine §6 -->`.

**Patterns:** `pipeline-roadmap` mini-header (extraer de §4), `comparison-2col`, grid 2×1 (artefacto + self-review), grid 3×1 (anti-patrones).
**Animations:** Ninguna JS.
**Speaker-note target:** ~120–200 palabras/slide.

---

## Task 7 — §7 writing-plans (+ spec-driven development) (8–9 slides)

**Subagent dispatch.** Inputs: spine §7 + `source_material/07-writing-plans.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura — mini pipeline-roadmap, `.highlight-s7`.**

2. **Antes de writing-plans — qué es spec-driven development.** Slide marco. Card central con la regla de dirección:
   > "Si cambia el spec, cambia el plan. Si cambia el plan, cambia el código. **Nunca al revés.**"
   Sub-card: "El código no le dicta nada al spec."

3. **La cadena Superpowers.** Pattern: flow horizontal `brainstorming → writing-plans → subagent-driven-development`. Cada nodo con un sub-label de qué artefacto produce/consume:
   - brainstorming → produce **spec**
   - writing-plans → consume spec, produce **plan**
   - subagent-driven-development → consume plan, produce **código**
   Notas: cada skill mira el artefacto previo como contrato cerrado. Si la entrada está mal, subís — no compensás hacia adelante.

4. **Qué hace writing-plans.** Card o slide soporte. Tareas de 2-5 minutos, paths exactos, código completo en cada step. Asunción agresiva: el ejecutor no conoce el codebase ni el dominio.

5. **Cuándo se activa.** Slide breve. Después de brainstorming, antes de código. Si pedís plan sin spec, primero recomienda volver a brainstorming.

6. **Por qué importa.** Slide soporte:
   > "El plan persistido en disco es lo que permite que cualquier agente — vos mañana, un subagente, un colega — ejecute la implementación sin re-deducir nada."
   Sub-card: contrato técnico que cierra la brecha spec → ejecución.

7. **Punto crítico.** Card único:
   > "Tareas de 2 a 5 minutos con archivos exactos y código completo en cada step. Nada de **'similar a la Task N'** sin repetir el código. Nada de **'add appropriate error handling'** sin mostrar qué error handling."
   Razón al pie: el ejecutor puede leer las tareas fuera de orden; un subagente arranca con contexto fresco en cada una.

8. **Artefacto + Plan Self-Review.** Slide dividido:
   - Izquierda: el path — `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`. Commiteado junto al spec.
   - Derecha: tres chequeos del self-review — **spec coverage** (¿hay tarea por requisito?), **placeholder scan** (TBD/TODO/etc.), **type consistency** (`clearLayers()` no puede aparecer como `clearFullLayers()` en otra tarea).

9. **Meta-revelación + anti-patrones + captura.** **Slide de cierre poderoso.** Layout:
   - Arriba: anti-patrones (3 chips chicos):
     - "TBD" / "TODO" / "implement later" son **fallas del plan**.
     - "Add appropriate error handling" sin mostrar el código exacto.
     - "Similar to Task N" sin repetir el código.
   - Abajo (más grande, con énfasis): **la meta-revelación**.
     > "El archivo que están leyendo fue escrito ejecutando esta misma cadena."
     - Mostrar el spec real: `docs/superpowers/specs/2026-05-21-semana-05-source-material-design.md`.
     - Mostrar el plan real: `docs/superpowers/plans/2026-05-21-semana-05-source-material.md`.
     - Placeholder de captura: `<img src="../img/section-7-demo-meta.png" alt="Spec y plan reales del repo del curso, abiertos en VS Code">`.
   Speaker notes: este es el momento de cierre del §7. Twist meta-pedagógico. "Lo que les estoy mostrando, así fue como lo armé."

**Patterns:** `pipeline-roadmap` mini-header, flow horizontal con nodos, grid 2×1 (artefacto + self-review).
**Animations:** Ninguna JS.
**Speaker-note target:** ~140–200 palabras; el slide 9 (meta-revelación) ~180–220 para sostener el twist.

---

## Task 8 — §8 git refresher + GitHub Flow (7–8 slides)

**Subagent dispatch.** Inputs: spine §8 + `source_material/08-github-flow.md`. Re-leer spine antes.

**Slide arc** (plantilla distinta — git no es skill):

1. **Apertura.** Slide soporte. **No** pipeline-roadmap iluminado — git es envoltorio, no nodo iluminable. En su lugar, opener visual:
   > "Las próximas skills operan dentro de una **branch**. Si el modelo mental de git no está cómodo, esas skills se sienten mágicas o aterradoras según el día."
   Subtítulo: "Refresher de tres conceptos + el workflow concreto que se usa con Superpowers."

2. **commit — foto del repo.** Card con definición + 1 ejemplo visual. "Guarda QUÉ cambió, QUIÉN lo hizo, CUÁNDO, y POR QUÉ." Regla práctica al pie: commits chicos, uno por idea cerrada.

3. **branch — línea paralela.** Diagrama CSS de líneas: `main` horizontal + una rama divergente etiquetada `feature/<descripcion>`. Code block con el comando:
   ```bash
   git checkout -b feature/<descripcion>
   ```
   Notas: en la branch podés romper, deshacer, reintentar; nadie se entera.

4. **pull request — propuesta de merge.** Card + diagrama: la branch + un círculo que dice "PR" + flecha a `main`. "No es un comando: es un evento en GitHub." Notas: hasta que no se mergea, `main` no tiene esos cambios. PR como contrato visible.

5. **GitHub Flow paso a paso (antes y durante).** Pattern: flow vertical con 3 steps + caption.
   ```bash
   git checkout main
   git pull
   git checkout -b feature/<descripcion>
   ```
   Caption: "Empezás desde `main` actualizado y abrís tu branch."
   Después: "Durante el trabajo, Superpowers (vía subagent-driven-development) commitea por tarea automáticamente."

6. **GitHub Flow — cierre.** Continuación:
   ```bash
   git push origin feature/<descripcion>
   ```
   Caption: "Cuando el feature está listo (después de verification-before-completion). En la UI de GitHub abrís el PR — título + descripción claros." Notas: Superpowers ya generó los commits con buenos mensajes; vos contás la historia en la descripción del PR.

7. **Por qué este patrón se lleva bien con Superpowers.** Slide soporte con 4 razones cortas en grid:
   - Aislamiento natural por sesión.
   - PR como contrato visible.
   - `main` siempre estable.
   - Sin stash / rebase complicado / cherry-pick.

8. **`using-git-worktrees` — honest disclosure.** Slide chico:
   > "Existe una skill `using-git-worktrees` que automatiza un workflow más avanzado. **No la usamos en este curso** — agrega fricción cognitiva sobre git base, y branch + PR alcanza para el TP."
   Path al archivo para los curiosos. Notas: la idea es la misma — aislar trabajo en branches. Worktrees lleva la idea un paso más allá permitiendo que cada branch viva en su propio folder físico.
   - Placeholder captura del PR del demo-repo de S04: `<img src="../img/section-8-demo-pr.png" alt="PR del demo-repo S04 con commits generados durante la sesión">`.

**Patterns:** opener visual, cards con definición, diagramas CSS de branches/PR, code-walkthrough, grid 2×2 para razones.
**Animations:** Ninguna JS.
**Speaker-note target:** ~120–180 palabras/slide.

---

## Task 9 — §9 subagent-driven-development (7–8 slides)

**Subagent dispatch.** Inputs: spine §9 + `source_material/09-subagent-driven-development.md`. Re-leer spine antes.

**Slide arc (plantilla §§6-7 y §§9-13):**

1. **Apertura — mini pipeline-roadmap, `.highlight-s9`.**

2. **Hook — "fresh subagent o no arranca".** Frase grande:
   > "**Fresh subagent o no arranca.**"
   Subtítulo: "El reset de contexto entre tareas es lo que escala el flujo. No es paralelismo; es disciplina."

3. **Qué hace.** Diagrama CSS: un círculo "Coordinador" con varias flechas a subagents efímeros uno por tarea. Cada subagent: "fresh, recibe la tarea + contexto, implementa, testea, commitea, devuelve resumen". Notas: el coordinador mantiene la visión global.

4. **Cuándo se activa — vs `executing-plans`.** `comparison-2col`:
   - Izquierda **subagent-driven-development** — autónomo entre checkpoints, fresh subagent por tarea, rápido. "Para delegar una hora y volver."
   - Derecha **`executing-plans`** — más conservador, batchea con checkpoints humanos por tarea. "Para ver cada step antes de seguir."

5. **Por qué importa.** Card central:
   > "Cada subagent arranca limpio, así que no acumula **context rot** ni decisiones tácitas que se le filtraron en la Task 1 y le ensucian la Task 4."
   Sub-card: callback explícito a spec-driven development — el subagent no improvisa, lee plan + spec como contratos cerrados.

6. **Punto crítico — two-stage review.** Pattern: flow vertical con dos cajas (no es opcional, es la **regla central**). Caja 1: **Spec Compliance Review** — ¿el código cumple lo que el plan pedía? Caja 2: **Code Quality Review** — ¿el código es razonable, sin dead code, sin sobre-engineering? El orden importa: primero el qué, después el cómo.

7. **Anti-patrones.** Grid 3×1:
   - Reusar el subagent para varias tareas (perdés el reset).
   - Saltearse el two-stage review (sin review, dos tareas más adelante estás compensando errores).
   - Intervenir demasiado pronto (rompe el patrón de modo autónomo).

8. **Captura del demo-repo.** Slide con placeholder:
   - `<img src="../img/section-9-demo-review.png" alt="Terminal con subagents en serie + output de two-stage review entre tareas">`.
   - Caption: "Dos casos: spec compliance verde al primer intento (izquierda) vs review encontró issues, implementer re-ejecutó, segunda pasada verde (derecha)."

**Patterns:** `pipeline-roadmap` mini, `comparison-2col`, diagrama CSS coordinador + subagents, flow vertical 2-stage, grid 3×1.
**Animations:** Opcional `clickable-steps.js` si el slide 3 o 6 lo pide. Recomendación: probar sin JS primero.
**Speaker-note target:** ~120–200 palabras/slide.

---

## Task 10 — §10 test-driven-development (6–7 slides)

**Subagent dispatch.** Inputs: spine §10 + `source_material/10-test-driven-development.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura — mini pipeline-roadmap, `.highlight-s10`.**

2. **Hook.** Frase grande:
   > "**Si nunca lo viste rojo, no estás midiendo nada. Estás creyendo.**"

3. **El ciclo RED-GREEN-REFACTOR.** Pattern: flow horizontal 3 nodos con descripción de cada uno:
   - **RED** — test que describe el comportamiento deseado, falla.
   - **GREEN** — mínimo código para que pase.
   - **REFACTOR** — limpiar con tests en verde, sin romper.

4. **La regla de hierro.** Card único:
   > "Cualquier código de producción escrito antes de su test se **borra y se reescribe** siguiendo el ciclo."
   Sub-card: "No se 'adapta', no se 'guarda como referencia' — se borra."

5. **Por qué importa.** Slide soporte:
   > "Sin TDD, el agente escribe código que parece correcto y arma tests post-hoc que pasan al primer intento. Esos tests validan lo que el código hace, no lo que vos querías que hiciera — pierden su valor como red de seguridad."
   Sub-card: en el contexto de subagent-driven-dev (1 hora sola sin supervisión), TDD es lo que evita que "ya funciona" termine siendo "compila".

6. **Punto crítico + anti-patrones.** Layout split:
   - Arriba (punto crítico): "Ver el RED primero. Si saltás el RED, no sabés si tu test efectivamente está testeando algo."
   - Abajo (grid 3×1 anti-patrones):
     - Tests post-hoc.
     - Tests que pasan en RED.
     - Tests con mocks de todo.

7. **Captura del demo-repo.** Slide con placeholder:
   - `<img src="../img/section-10-demo-red-green.png" alt="Ciclo RED-GREEN-REFACTOR corriendo sobre el demo-repo S04">`.
   - Caption: "Terminal: test fallando (rojo) → código mínimo → test pasando (verde)."

**Patterns:** `pipeline-roadmap` mini, flow horizontal 3 nodos, cards de soporte, grid 3×1.
**Animations:** Ninguna JS.
**Speaker-note target:** ~120–180 palabras/slide.

---

## Task 11 — §11 requesting-code-review (6–7 slides)

**Subagent dispatch.** Inputs: spine §11 + `source_material/11-requesting-code-review.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura — mini pipeline-roadmap, `.highlight-s11`.**

2. **Qué hace.** Card central + diagrama corto:
   > "Code review estructurado contra el plan, antes de claimar listo. **El reviewer es un agente separado** del que implementó."
   Sub-card: "Recibe sólo el diff + el spec original. No tu historial de sesión. No el sesgo del autor."

3. **Cuándo se activa.** Slide soporte:
   - Cuando terminás de implementar el plan, después de TDD verde.
   - Antes de mergear features que tocan más de un par de archivos.
   - Cuando estás trabado y no sabés qué falta — agente fresco lee y marca lo que vos ya no ves.

4. **Por qué importa.** Card:
   > "Code review encuentra cosas distintas a los tests: dead code, desfasaje entre spec y código, ergonomía pésima de API pública, archivos que crecieron demasiado, invariantes implícitos rotos."
   Sub: "Tests verifican comportamiento. Review verifica diseño."

5. **Las tres severidades.** Pattern: `data-table` o grid 3×1. Tres niveles con qué hacer con cada uno:
   - **Crítico** — bloquea el avance. **Se resuelve YA**.
   - **Mayor** — requiere aprobación humana explícita antes de mergear.
   - **Menor** — nota que puede quedar en el PR como contexto.

6. **Punto crítico + anti-patrones.** Layout split:
   - Arriba (punto crítico): "Los críticos NO se 'anotan para después'. Se arreglan ya. La severidad es informativa, no negociable."
   - Abajo (grid 3×1):
     - Saltear porque "los tests pasan".
     - Degradar críticos a mayores para no atrasar el merge.
     - Pedir review antes de TDD verde.

7. **Captura del demo-repo.** Placeholder:
   - `<img src="../img/section-11-demo-review-report.png" alt="Report de review generado sobre el feature del demo-repo S04">`.
   - Caption: "Con al menos un issue por severidad — crítico, mayor, menor — para ver la estructura entera."

**Patterns:** `pipeline-roadmap` mini, `data-table` para severidades, cards, grid 3×1.
**Animations:** Ninguna JS.
**Speaker-note target:** ~120–180 palabras/slide.

---

## Task 12 — §12 verification-before-completion (5–6 slides)

**Subagent dispatch.** Inputs: spine §12 + `source_material/12-verification-before-completion.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura — mini pipeline-roadmap, `.highlight-s12`.**

2. **Hook.** Frase grande:
   > "**Compilar es la barrera más baja del éxito. Tu trabajo es verificar comportamiento, no sintaxis.**"

3. **Qué hace + la regla.** Slide soporte con la regla central:
   > "Antes de afirmar que algo está listo, **correr los verification commands** del plan y **citar el output** en la misma afirmación de éxito."
   Sub-card: "Si no corriste el comando en este turno, no podés afirmar que pasa."

4. **La forma correcta vs la incorrecta.** Pattern: `comparison-2col`.
   - Izquierda (mal): `"los tests pasan"`
   - Derecha (bien): `"los tests pasan: [output completo pegado]"`
   Notas: la diferencia entre "creo que funciona" y "acá está el comando y su salida" es la diferencia entre afirmación y hecho.

5. **Cuándo se activa + punto crítico.** Split:
   - Izquierda: cuándo — antes de claimar completion, antes del commit "feature listo", antes del PR, antes de `requesting-code-review`.
   - Derecha: punto crítico — "Si no podés correr el comando porque la infra no está, **lo decís explícitamente**: 'no pude verificar X porque Y'. No asumís, no minimizás, no extrapolás."

6. **Anti-patrones + captura.** Split:
   - Arriba (grid 3×1):
     - "Los tests deberían pasar" sin haberlos corrido.
     - "El feature funciona" sin correr el feature end-to-end.
     - "Listo" porque la implementación compila.
   - Abajo: placeholder de captura — `<img src="../img/section-12-demo-verification.png" alt="Verification commands corridos al final del feature del demo-repo + output citado en el commit/PR">`.

**Patterns:** `pipeline-roadmap` mini, `comparison-2col` (forma correcta vs incorrecta), grid 3×1.
**Animations:** Ninguna JS.
**Speaker-note target:** ~120–180 palabras/slide.

---

## Task 13 — §13 finishing-a-development-branch (5–6 slides)

**Subagent dispatch.** Inputs: spine §13 + `source_material/13-finishing-a-development-branch.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura — mini pipeline-roadmap, `.highlight-s13`.**

2. **Qué hace.** Card central:
   > "Cuando todas las tareas del plan están implementadas y verificadas, estructura las **opciones de cierre** y limpia el workspace según la elegida."
   Sub: "No decide por vos. Primero corre los tests una última vez sobre el resultado final, detecta el tipo de workspace (repo normal / worktree / detached HEAD), te muestra el menú que corresponde."

3. **Las cuatro opciones.** Pattern: grid 2×2.
   - **Merge a base local** — cuando es trabajo local sin revisión necesaria.
   - **Abrir PR** *(default en GitHub Flow, recomendada)* — para todo cambio que amerite revisión humana.
   - **Branch viva con plan de seguimiento** — cuando te tenés que ir y el trabajo quedó a mitad de camino, con plan explícito.
   - **Descartar** — cuando el trabajo no va.

4. **Punto crítico + cleanup order.** Split:
   - Izquierda (punto crítico): "**No quedarse en estado intermedio.** Mergeás, o PR, o mantenés viva con plan, o cerrás. 'Después decido' = deuda silenciosa."
   - Derecha (orden del cleanup): "Mergear primero → verificar tests sobre el resultado mergeado → remover worktree (si aplica) → borrar branch local al final."

5. **Anti-patrones.** Grid 3×1:
   - Mergear directo a `main` sin PR cuando el cambio amerita revisión.
   - Dejar la branch viva sin razón explícita.
   - Olvidarse del cleanup (worktrees no removidos, branches mergeadas).

6. **Captura del demo-repo + cierre del happy-path.** Split:
   - Arriba: placeholder — `<img src="../img/section-13-demo-pr-merged.png" alt="PR final del feature del demo-repo + estado de branches después del cleanup">`.
   - Abajo (cierre del bloque de las 7 skills): un **pipeline-roadmap completo** sin highlight (vuelve a estado neutral) con la frase:
     > "Cubrimos el happy-path entero. Lo que sigue es el resto del cinturón."

**Patterns:** `pipeline-roadmap` mini iluminado en slide 1, completo neutral en slide 6. Grid 2×2, splits 2-col, grid 3×1.
**Animations:** Ninguna JS.
**Speaker-note target:** ~120–180 palabras/slide.

---

## Task 14 — §14 Resto del cinturón (3 slides)

**Subagent dispatch.** Inputs: spine §14 + `source_material/14-resto-del-cinturon.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura.** Slide soporte con título grande:
   > "El cinturón completo: **otras seis skills** que el plugin trae."
   Subtítulo: "No son centrales al flujo lineal. Aparecen cuando algo se sale del happy-path. Una frase cada una alcanza para reconocerlas."

2. **Las seis skills al pasar.** Pattern: `data-table` 6×2 o grid 3×2 con una card por skill. Para cada una: **nombre** + **frase de qué hace + cuándo se activa**:
   - **`systematic-debugging`** — proceso de root-cause en 4 fases cuando aparece un bug.
   - **`dispatching-parallel-agents`** — despachar varios subagents en paralelo cuando hay tareas independientes.
   - **`writing-skills`** — crear o editar skills propias (la skill que escribe skills).
   - **`receiving-code-review`** — el lado opuesto de `requesting-code-review`: cómo responder a feedback sin ceder por reflejo ni defenderte ciegamente.
   - **`executing-plans`** — alternativa a `subagent-driven-development`: ejecuta el plan en la misma sesión con checkpoints humanos.
   - **`using-git-worktrees`** — workflow de worktrees (la mencionamos en §8 con honest disclosure).

3. **Cómo se las invoca.** Slide soporte:
   > "**No hace falta memorizarlas.** Cada skill tiene su trigger declarado en el frontmatter de su `SKILL.md`; cuando hagas algo que coincida, Claude las propone o las invoca solo."
   Path al cache para los curiosos: `~/.claude/plugins/cache/claude-plugins-official/superpowers/skills/<nombre>/SKILL.md`. Notas: abrilo y leelo, es prosa, no magia.

**Patterns:** opener simple, `data-table` o grid 3×2, slide soporte.
**Animations:** Ninguna JS.
**Speaker-note target:** ~100–160 palabras/slide.

---

## Task 15 — §15 Bajada al trabajo final (3–4 slides)

**Subagent dispatch.** Inputs: spine §15 + `source_material/15-bajada-al-tp-final.md`. Re-leer spine antes.

**Slide arc:**

1. **Apertura.** Slide soporte:
   > "El trabajo final se construye con **exactamente este flujo**."
   Subtítulo: "No hay un modo especial para proyectos integradores. El plugin es el mismo y la secuencia es la misma."

2. **El flujo aplicado al TP — pipeline-roadmap completo.** **Reuso del `pipeline-roadmap` del §4** sin highlight individual (todos los nodos en estado activo). Cada nodo con un sub-label que aterriza la skill al TP, e.g.:
   - brainstorming → "Sacar el spec del proyecto. No saltees."
   - writing-plans → "Convierte spec en plan de tareas chicas."
   - GitHub Flow → "`git checkout -b feature/<descripcion>`."
   - subagent-driven-development → "Revisás entre tareas."
   - test-driven-development → "Rojo antes que verde. Si nunca lo viste rojo, no estás midiendo."
   - requesting-code-review → "Críticos en el momento; nice-to-have como follow-up."
   - verification-before-completion → "Comando + output citado."
   - finishing-a-development-branch → "Abrís el PR. El PR es la entrega visible."

3. **Lo que el flujo NO hace por vos.** Pattern: grid 2×2 o flow vertical con cuatro puntos. Honest disclosure:
   - **Qué construir** — decisión tuya, antes de abrir brainstorming.
   - **Si la decisión arquitectónica es la correcta** — decisión tuya, durante brainstorming.
   - **Si el feature sirve a un usuario real** — decisión tuya, fuera del flujo.
   - **El plugin acelera la ejecución y disciplina el proceso. No decide qué entregar.**
   Cierre: "Te libera tiempo, justamente, para ocuparte de esa parte — que es la única que no puede hacer."

4. **Bridge a semana 06.** Slide chico:
   > "La próxima clase entramos a **refactor y debugging asistidos** sobre lo que ya construyen con este flujo."

**Patterns:** `pipeline-roadmap` reusado (el ancla visual de toda la Parte 2 se cierra acá), grid 2×2 o flow vertical.
**Animations:** Ninguna JS.
**Speaker-note target:** ~140–200 palabras para slides 1, 2 y 3; ~80–120 para el bridge.

---

## Task 16 — Coherence pass

**Subagent dispatch.** Inputs: `semanas/05/slides/index.html` ensamblado + spine completo.

**Steps:**

- [ ] **Step 1: Ensamblar el deck completo.**
  ```bash
  node semanas/05/slides/_assemble.mjs
  ```
  Expected: `sections: ≥16 open / ≥16 close`, `unfilled markers: 0`. Si quedan markers sin llenar, identificar qué task quedó incompleta.

- [ ] **Step 2: Recorrer las transiciones entre secciones** (slide final de cada una + slide opener de la siguiente). Verificar:
  - §3 → §4: bridge a "ahora instalamos uno que vale la pena conocer en serio".
  - §5 → §6: bridge a "arrancamos directo con la primera skill — brainstorming".
  - §7 → §8: bridge a git porque las próximas skills operan en branch.
  - §13 → §14: cierre del happy-path + "el resto del cinturón".
  - §14 → §15: bajada al TP.

- [ ] **Step 3: Verificar el pipeline-roadmap re-iluminado.** En cada slide opener de §§6-7 y §§9-13 debe aparecer el mini-roadmap con la clase `.highlight-sN` correcta. En §13 el slide de cierre debe mostrar el roadmap completo sin highlight (estado neutral). En §15 el roadmap reaparece como mapa aplicado al TP. Verificar visualmente abriendo en el navegador.

- [ ] **Step 4: Verificar que la whole-week through-line es visible.** El arco "piezas → paquete → metodología" tiene que sentirse:
  - Parte 1 (§§1-3) clausura cuando entra Superpowers en §4 (verificar bridge del §3).
  - Parte 2 (§§4-5) clausura cuando arranca el happy-path en §6.
  - Parte 3 (§§6-13) clausura con el roadmap completo en §13.
  - Cierre (§§14-15) cierra con bajada al TP.
  Si algún bridge queda flojo, ajustar el slide opener/cierre afectado.

- [ ] **Step 5: Cazar orphan animations.** Buscar `<script>init...</script>` en todos los `_section-*.html`. Verificar que cada init tiene su container correspondiente en el slide y que el JS está wired en `_assemble.mjs`. Si encuentras un init sin container o un container sin init, repararlo.

- [ ] **Step 6: Cazar bullet-list slides.** Grep por `<ul>` en todos los fragmentos. Cada uso debe estar justificado: tabla disfrazada de lista (`<ul>` con CSS de grid), lista de "qué es" / "tres decisiones" del manual de voz, o anti-pattern enumerado en una tarjeta. Cualquier `<ul>` con 3+ `<li>` plain como contenido principal del slide → re-estructurar.

- [ ] **Step 7: Cazar emojis.** Grep por emojis Unicode (`grep -P '[\x{1F000}-\x{1FFFF}]'`) en todos los fragmentos. Si aparece alguno, removerlo.

- [ ] **Step 8: Cazar términos prohibidos.** Grep por: `payoff`, `vibe coding`, `diplomatura`, `bisagra`, `scaffolding`, `andamiaje`, "esta clase", "esta semana", "la firma de esta clase", "la tesis de esta clase". En cualquier `<aside class="notes">` o slide content. Si aparecen, reemplazar con equivalente neutro.

- [ ] **Step 9: Verificar speaker notes en three-format.** Spot-check 3 slides por sección: cada `<aside class="notes">` tiene `<p><strong>...</strong></p>` (acciones), `<p><u>...</u></p>` (descripción), `<p><em>"..."</em></p>` (script). En slides con fragments, un `<em>` por reveal.

- [ ] **Step 10: Final check en navegador.** `npm start`, abrir el deck en `http://localhost:3000/semanas/05/slides/`, navegar slide por slide (flecha derecha → fragment por fragment con flecha abajo cuando aplica). Verificar:
  - Sin errores en console.
  - Sin slides clippeados (la safety net de overflow funciona).
  - Pipeline-roadmap se ilumina como corresponde.
  - Capturas placeholder se ven (aunque sean rotas — el `alt` aparece).

- [ ] **Step 11: Commit final.**
  ```bash
  git add semanas/05/slides/
  git commit -m "feat(s05 slides): coherence pass + deck completo §1–§15"
  ```

---

## Self-review (writing-plans)

**Spec coverage:**
- Whole-week through-line "piezas → paquete → metodología" cubierto por la división Parte 1 / 2 / 3 / Cierre del plan. ✓
- Pipeline-roadmap re-iluminado en §§6-7 y §§9-13 cubierto en Task 4 (introducción) + Tasks 6, 7, 9-13 (re-iluminación). ✓
- Plantilla recurrente §§6-7 y §§9-13 cubierta en Conventions for execution + reiterada en cada task. ✓
- Meta-revelación del §7 cubierta como slide 9 de Task 7. ✓
- Capturas del demo-repo S04 como placeholders cubierto en Conventions (`<img>` placeholders) y en cada task que cierra con captura. ✓
- §8 git con plantilla distinta cubierto en Task 8 (no usa mini-roadmap iluminado). ✓
- §15 reusa el roadmap completo cubierto en Task 15 slide 2. ✓
- Coherence pass cubre transiciones, through-line, orphan animations, bullets, emojis, términos prohibidos, speaker notes. ✓

**Placeholder scan:** Releyendo, no encuentro "TBD", "TODO" como pendientes legítimos en pasos. Las menciones a TODO en Task 1/2 son ejemplos de stubs del scaffold (Task 0 Step 6 los crea explícitamente como placeholders intencionales del bootstrap, y se reemplazan en Tasks 1-15). Aceptable.

**Type consistency:** Verificado:
- `.highlight-s6` ... `.highlight-s13` consistente entre Task 0 Step 7 y Tasks 6-13.
- `.pipe-grid` usado consistente con el pattern `pipeline-roadmap.html`.
- `data-group="sN"` consistente entre Task 4 y tasks que re-iluminan.
- Paths del demo-repo siempre relativos (`./CLAUDE.md`, no `semanas/04/demo-repo/...`) — convención de S04 mantenida.
- Placeholders de imagen siempre `../img/section-N-demo-<slug>.png` (relativos a `slides/`).
- No hay funciones JS nuevas, así que no hay nombres a chequear allí.

Plan listo.

---

## Execution Handoff

Plan guardado en `semanas/05/plan.md`. Próximo paso: Fase 3 — ejecutar tarea por tarea. Per slide-generation skill override, **hand straight to phase 3** (no extra checkpoint — el gate del spine ya pasó). Voy con `superpowers:executing-plans` para mantener checkpoints humanos por sección (lo recomendado para slide work — el output visual necesita aprobación humana entre tareas).

---
---

# Plan de revisión 2026-09-29 — harnesses + Superpowers 6.4.1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Actualizar el deck de S05 para que (1) las notas de plugins sirvan a quien usa Codex u OpenCode y §5 muestre cómo instalar Superpowers ahí, y (2) todo lo que se dice de Superpowers corresponda a la v6.4.1, con los casos reales tomados de la sesión auth0 sobre tp-final.

**Architecture:** Se editan los fragmentos `slides/_section-N.html` y se regenera `slides/index.html` con `node semanas/05/slides/_assemble.mjs`. Sin JS nuevo; se reusan las clases CSS que cada sección ya define. Los slides de caso real se reconstruyen en HTML a partir del log de la sesión (no screenshots), igual que los actuales.

**Tech Stack:** reveal.js, CSS por sección + `_config/theme/components.css`, Playwright (medición de desbordes), Node.

**Spec:** `semanas/05/spine.md` — bloque "Revisión 2026-09-29" al principio (manda sobre el resto del spine).

**Fuentes de datos:**
- Sesión auth0: `~/.claude/projects/c--Users-Enzo-Documents-intro-desarrollo-asistido-IA/2bd2fa5d-65dd-4040-a593-5b6b3553122d.jsonl` (líneas clave: 40-135 brainstorming, 193 plan, 230-338 SDD, 322 review final, 435-488 fix, 569 menú de cierre, 647 merge).
- Spec y plan del caso real: `semanas/00/source_material/apellido-iisaia/tp-final/docs/superpowers/{specs,plans}/2026-09-29-tp-final-auth0*.md`.
- Superpowers 6.4.1: `semanas/05/source_material/superpowers/` (skills + `RELEASE-NOTES.md`).

## Global Constraints

- Texto visible en español rioplatense (voseo); términos técnicos en inglés (spec, plan, review, branch, merge, commit, test suite, subagent).
- Nada de "payoff", "bisagra", "diplomatura", "vibe coding", "diálogo socrático", "dolores", "mismatch"; nada de meta-referencias al curso en texto visible ("esta clase", "esta semana").
- Sin marketing ni mención al TP en texto visible fuera de §15.
- Body principal ≥1.1rem, secundario ≥1.05rem, eyebrows ≥0.85rem.
- Speaker notes en tres formatos: `<strong>` acciones, `<u>` descripciones, `<p><em>"…"</em></p>` guion hablado; **un `<em>` por cada reveal** (intro + uno por fragment). Slide sin fragments → un solo `<em>`.
- Nada de `<span>` dentro de `<pre><code>`; para terminal con color usar `<div>` con `white-space: pre-wrap`.
- Citas de la sesión auth0: traducidas al español, fieles al original; las notas dicen que la sesión fue en inglés. No inventar frases que no están en el log.
- Repo público: no mostrar el dominio del tenant de Auth0, el client ID ni ningún secreto. `apellido-iisaia` es placeholder, se puede mostrar.
- Plugins en otros harnesses: **solo speaker notes** en §§1-3; slides nuevas no.
- Commits por tarea, formato `tipo(s05 §N): descripción` en español, con el trailer `Co-Authored-By` de la sesión.

## Review Focus

1. **Desborde a 1280×720 con todos los fragments visibles**: un slide reescrito (sobre todo casos reales, más densos) puede cortar la última línea proyectado. Se mide en cada tarea con `measure.mjs` (Task 0).
2. **Referencias viejas que sobreviven fuera del slide editado**: "dos reviewers", "two-stage", "cuatro opciones", "descartar", "46 tests", "CSV", "demo-repo", "v5.1.0" en otro slide o en las notas. Grep al cierre de cada tarea y en Task 13.
3. **Notas desalineadas con los reveals**: al cambiar la cantidad de fragments, la cantidad de `<em>` tiene que seguirla. Se cuenta en cada tarea.
4. **Afirmaciones sobre Codex/OpenCode no verificadas**: solo se usan las del bloque "Hechos verificados" del spine; OpenCode 2.0 no se menciona.
5. **Filtración de datos de Auth0**: grep por el prefijo del tenant (leído del `.env` local del tp-final, sin imprimirlo) y por `AUTH0_CLIENT_SECRET=.` en `semanas/05` antes de cada commit.

---

### Task 0: Setup y herramienta de medición

**Files:** Create `<scratchpad>/measure.mjs` (fuera del repo).

- [ ] **Step 1:** Confirmar rama `feature/s05-harness-neutral-superpowers-6` y working tree limpio salvo untracked preexistentes.
- [ ] **Step 2:** Escribir `measure.mjs`: abre `slides/index.html` por `file://` con Playwright a 1280×720, neutraliza el safety-net (`section { overflow: visible !important; max-height: none !important }`), muestra todos los fragments, y para cada `section` hoja reporta `h/v`, título y exceso de alto si lo hay.
- [ ] **Step 3:** `node semanas/05/slides/_assemble.mjs` y correr `measure.mjs` → guardar la línea base de desbordes.

### Task 1: §§2-3 — notas para otros harnesses

**Files:** Modify `slides/_section-2.html`, `slides/_section-3.html`; `source_material/02-plugins-que-son.md`, `03-plugins-distribucion.md` (párrafo "En otros harnesses").

- [ ] **Step 1:** §2.1 (definición) — notas: la definición es de la doc de Claude Code; en Codex es el mismo concepto (carpeta con manifest `.codex-plugin/plugin.json`); en OpenCode un plugin es un módulo JS/TS que se declara en `opencode.json`. Lo que comparten los tres es el `SKILL.md`.
- [ ] **Step 2:** §2.2 (anatomía) — notas: Superpowers trae un `skills/` compartido y un manifest por harness (`.claude-plugin/`, `.codex-plugin/`, `.opencode/`, `.cursor-plugin/`…).
- [ ] **Step 3:** §3.2 (marketplace) — notas: Codex tiene marketplaces (`codex plugin marketplace add owner/repo`); OpenCode no, se lista el paquete npm/git en `opencode.json`.
- [ ] **Step 4:** §3.4 (cuatro comandos) — notas: equivalentes en Codex (`/plugins`, `codex plugin add x@mkt`, `codex plugin remove`, `codex plugin list`).
- [ ] **Step 5:** §3.5 (scope) — notas: Codex habilita por usuario o por repo en `config.toml`; OpenCode global en `~/.config/opencode/` o por proyecto en `opencode.json`.
- [ ] **Step 6:** §3.7 (demo anatomía) — notas: caches `~/.codex/plugins/cache/<mkt>/<plugin>/<versión>/` y `~/.cache/opencode/node_modules/`.
- [ ] **Step 7:** Un `<em>` por reveal: el agregado va como `<u>` o dentro del `<em>` existente del momento. Assemble + measure + commit `docs(s05 §2-3): notas con el equivalente en Codex y OpenCode`.

### Task 2: §5 — instalación 6.4.1 y otros harnesses

**Files:** Modify `slides/_section-5.html`, `source_material/05-instalar-superpowers.md`.

- [ ] **Step 1:** Output esperado de `/plugin list`: `superpowers v6.4.1 claude-plugins-official enabled`.
- [ ] **Step 2:** Debajo de Plan B, franja compacta "En otro harness" con dos cards: **Codex** → `/plugins`, buscar "superpowers", Install; **OpenCode** → en `opencode.json`: `"plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]`. Reusar `.s5-planb-grid` / `.s5-planb-card` / `.s5-planb-cmd`.
- [ ] **Step 3:** Notas: en Windows el hook de inicio corre con Git Bash; si no está, Claude Code pide instalarlo.
- [ ] **Step 4:** Source: "catorce skills" → "quince".
- [ ] **Step 5:** Assemble + measure §5 (si desborda, una sola línea por harness) + commit `feat(s05 §5): superpowers 6.4.1 y cómo instalarlo en Codex y OpenCode`.

### Task 3: §4 — roadmap y notas

**Files:** Modify `slides/_section-4.html` y cualquier `_section-*.html` que replique el sub-label.

- [ ] **Step 1:** Sub-label del nodo finishing: "PR / merge / discard" → "merge / PR / seguir después". Grep `discard` en todos los `_section-*.html`.
- [ ] **Step 2:** Notas del roadmap: la ejecución tiene dos modos (Subagent-driven / Native); el roadmap muestra SDD porque es el que se recorre; Native aparece en §9.
- [ ] **Step 3:** Assemble + measure + commit `fix(s05 §4): finishing ya no ofrece descartar; mencionar el modo Native`.

### Task 4: §6 — brainstorming

**Files:** Modify `slides/_section-6.html`, `source_material/06-brainstorming.md`.

- [ ] **Step 1:** §6.2 "Qué hace": agregar al principio **"Para qué y para quién"** (te devuelve lo que entendió para que lo corrijas) y **"Clasifica"** (spike / bounded / architectural, en voz alta). Salida: "diseño aprobado — escrito en disco si es architectural".
- [ ] **Step 2:** §6.3 "Cuándo se activa": agregar tres chips: *spike* → prueba descartable · *bounded* → diseño corto en el chat · *architectural* → spec escrito. Texto: "Lo que escala es la ceremonia, no la aprobación."
- [ ] **Step 3:** §6.4 "Punto crítico": "antes de que vos hayas aprobado el diseño" (sin "escrito"); "Vale para los tres caminos, por simple que parezca."
- [ ] **Step 4:** §6.5 "Detalles": el spec en disco → "en trabajo architectural".
- [ ] **Step 5:** §6.6 caso real → sesión auth0. Visible: prompt inicial traducido. Fragments: (1) *Clasificación: architectural* + por qué; (2) pregunta de propósito → "que los usuarios entren fácil con su cuenta de Google"; (3) "¿qué cambia al estar logueado?" → todo el sitio detrás del login; (4) "¿de dónde sale el nombre?" → lo sigue tipeando el jugador.
- [ ] **Step 6:** §6.7 → "Dos approaches": A login en el servidor con cookie de sesión (recomendada); B SDK en el browser + JWT. Fragments: diseño en 3 secciones aprobadas una por una → el usuario agrega pytest a mitad de camino → spec commiteado + la skill marca lo que difiere de lo charlado.
- [ ] **Step 7:** Notas (un `<em>` por reveal; aclarar traducción). Grep `CSV|csv|demo-repo` → 0. Assemble + measure §6 + commit `feat(s05 §6): brainstorming 6.4.1 — propósito, clasificación y caso real auth0`.

### Task 5: §7 — writing-plans

**Files:** Modify `slides/_section-7.html`, `source_material/07-writing-plans.md`.

- [ ] **Step 1:** §7.4 "Qué hace": "tareas de 2 a 5 minutos" → "tareas del tamaño de su propio ciclo de test, partidas en steps de 2 a 5 minutos".
- [ ] **Step 2:** §7.6 "Detalles": self-review de 4 chequeos (+ **Review Focus**); lo que el plan trae arriba de las tareas: `Spec:`, **Global Constraints**, **Review Focus**; "Vos revisás el plan guardado antes de que corra nada."
- [ ] **Step 3:** Handoff: **Subagent-driven** vs **Native**, y la skill **recomienda uno con una razón**. Preferir sumarlo al caso real (Step 4).
- [ ] **Step 4:** §7.7 caso real → plan auth0: spec `…/specs/2026-09-29-tp-final-auth0-design.md` → plan `…/plans/2026-09-29-tp-final-auth0.md` (commit `52ddf56`), 3 tareas. Fragment: Review Focus con 5 casos borde. Fragment final: "Recomiendo Native: son solo tres tareas, cada una depende de la anterior y el plan ya trae el código" → el usuario eligió Subagent-driven.
- [ ] **Step 5:** Notas + grep `csv|demo-repo|2 a 5 min` + assemble + measure §7 + commit `feat(s05 §7): writing-plans 6.4.1 — estructura del plan, dos modos y caso real auth0`.

### Task 6: §8 — git (retoque)

**Files:** Modify `slides/_section-8.html`, `source_material/08-github-flow.md`.

- [ ] **Step 1:** Diagrama §8.2: `feature/csv-import` → `feature/auth0-login`.
- [ ] **Step 2:** §8.3: "vía subagent-driven-development, commitea por tarea" → "commitea por tarea, en cualquiera de los dos modos de ejecución".
- [ ] **Step 3:** Assemble + measure §8 + commit `fix(s05 §8): branch del caso real y commits en ambos modos`.

### Task 7: §9 — subagent-driven-development

**Files:** Modify `slides/_section-9.html`, `source_material/09-subagent-driven-development.md`.

- [ ] **Step 1:** §9.2 "Qué hace": cards auth0 — Task 1 tests del API · **haiku** · 62k · 3m 47s; Task 2 login en el backend · **sonnet** · 120k · 5m 51s; Task 3 frontend y cierre de sesión · **haiku** · 58k · 2m 5s; debajo de cada una reviewer **sonnet** "spec + quality"; al pie review final de rama · **opus**. Mensaje: cada dispatch nombra su modelo.
- [ ] **Step 2:** §9.3: "executing-plans (conservador)" → **"Native (executing-plans)"**: la sesión implementa todo sin pausas; una sola review final con el modelo más capaz; más barato. SDD: subagent + reviewer por tarea, review final; más completo, más caro.
- [ ] **Step 3:** §9.4 → **"Punto crítico: un reviewer, dos veredictos"**: spec compliance + code quality en la misma pasada; lo que no puede verificar desde el diff lo marca aparte. Pie: review final de rama con el modelo más capaz.
- [ ] **Step 4:** §9.5 "Cómo se opera": el coordinador decide las ambigüedades, las registra y te las muestra al final como rulings; frena solo ante lo destructivo o irreversible. Re-dispatch: el fix vuelve al mismo implementer; si no converge, sube de modelo.
- [ ] **Step 5:** §9.6 captura → reconstrucción HTML de la secuencia real de 9 dispatches con modelo, tokens y duración (62k/3m47s, 80k/1m42s, 120k/5m51s, 102k/2m56s, 58k/2m5s, 72k/1m46s, 98k/2m17s, 87k/3m11s, 79k/1m37s). Fragment: 2-3 "Rulings I made" traducidos.
- [ ] **Step 6:** §9.7 "Por qué escala" → coordinador 132,6k → 175,7k (+43k) durante 3 tareas + review final; los 7 subagents de ese tramo usaron ~590k en sus propios contextos.
- [ ] **Step 7:** Grep `two-stage|dos etapas|Spec review|Code quality review|11 tasks|csv|demo-repo`. Notas. Assemble + measure §9 + commit `feat(s05 §9): SDD 6.4.1 — un reviewer por tarea, modo Native, rulings y caso real auth0`.

### Task 8: §10 — TDD

**Files:** Modify `slides/_section-10.html`, `source_material/10-test-driven-development.md`.

- [ ] **Step 1:** §10.3: **"Verde = toda la suite del proyecto, no solo tu archivo. Cada falla se reporta por nombre, aunque no la hayas causado vos."** Donde TDD se ata solo a SDD, "en cualquiera de los dos modos".
- [ ] **Step 2:** §10.4 caso real: Task 1 11 tests · Task 2 RED `ModuleNotFoundError: backend.auth` → 31 passed · Task 3 RED 2 failed → 33 passed · fix final RED 2 failed → 34 passed, 0 warnings.
- [ ] **Step 3:** Grep `46|csv` + notas + assemble + measure §10 + commit `feat(s05 §10): TDD 6.4.1 — la suite entera define el verde; caso real auth0`.

### Task 9: §11 — requesting-code-review

**Files:** Modify `slides/_section-11.html`, `source_material/11-requesting-code-review.md`.

- [ ] **Step 1:** §11.4: Crítico → se arregla ya, bloquea · **Importante** → se arregla antes de seguir · Menor → se anota; la review final decide qué queda para después.
- [ ] **Step 2:** Fragment: "Lo que el spec no dice se juzga por lo que esperaría un usuario razonable." / "Lo que el reviewer decide no evaluar va a *Declined to judge*, y lo decidís vos."
- [ ] **Step 3:** §11.3: la review final ya viene incluida en los dos modos; la skill sirve sola antes de mergear algo grande.
- [ ] **Step 4:** §11.5 caso real → review final (opus): Crítico ninguno · **Importante**: el logout te vuelve a meter (vuelve a `/` → login → Google re-loguea sin preguntar; "un usuario razonable espera terminar deslogueado") · 6 Menores, "ninguno bloquea el merge" · *Declined to judge*: deploy y HTTPS, mostrar el nombre, logout por GET. Fragment final: el navegador lo confirmó → página pública `/logged-out`; los 33 tests pasaban.
- [ ] **Step 5:** Grep `Mayor|aprobación humana|csv|71 líneas` + notas + assemble + measure §11 + commit `feat(s05 §11): code review 6.4.1 — severidades, usuario razonable, declined to judge; caso real auth0`.

### Task 10: §12 — verification-before-completion

**Files:** Modify `slides/_section-12.html`.

- [ ] **Step 1:** §12.2: ejemplo válido `$ uv run pytest` → `34 passed in 0.55s`.
- [ ] **Step 2:** §12.4 caso real, tres fragments: (1) commit de la Tarea 3: el brief decía "Verificado en el navegador…", el commit real dice "Próximo paso: verificar en el navegador…"; (2) re-review: "arreglado solo vía TestClient, no en un navegador real"; (3) cierre: 34 passed sin warnings + recorrido real en navegador.
- [ ] **Step 3:** Grep `46|csv` + notas + assemble + measure §12 + commit `feat(s05 §12): verificación — caso real auth0`.

### Task 11: §13 — finishing-a-development-branch

**Files:** Modify `slides/_section-13.html`, `source_material/13-finishing-a-development-branch.md`.

- [ ] **Step 1:** §13.2 → **"Tres opciones, sin estado intermedio"**: 1 Merge a `main` local · 2 Push + abrir PR (default en GitHub Flow) · 3 Dejar la branch como está. Pie: "Descartar no está en el menú: pasa solo si lo pedís, y confirmás tipeando `discard`."
- [ ] **Step 2:** §13.3: el menú aparece recién con la suite en verde; si te vas a la mitad, la branch queda como está y la retomás con el plan.
- [ ] **Step 3:** §13.4 caso real: verificó (34 passed; branch sale de `main` en `097a342`) → 3 opciones → merge local + push → fast-forward, 34 passed en `main`, branch borrada, `.env` no subió.
- [ ] **Step 4:** Grep `cuatro|Descartar|46|csv` + notas + assemble + measure §13 + commit `fix(s05 §13): finishing 6.4.1 — tres opciones; caso real auth0`.

### Task 12: §§14-15 — cierre

**Files:** Modify `slides/_section-14.html`, `slides/_section-15.html`, `source_material/14-resto-del-cinturon.md`, `15-bajada-al-tp-final.md`.

- [ ] **Step 1:** §14: cinco → seis skills, sumando **`diagnosing-superpowers`** ("Cuando una sesión salió mal, lee los transcripts y te dice qué pasó, con evidencia"). Path con `<versión>`. Grid 3×2 si no entra.
- [ ] **Step 2:** §15 notas: Native como opción barata al lado de SDD.
- [ ] **Step 3:** Assemble + measure §§14-15 + commit `feat(s05 §14-15): diagnosing-superpowers y modo Native en el cierre`.

### Task 13: Coherence pass y verificación final

- [ ] **Step 1:** Grep global en `slides/_section-*.html` y `source_material/*.md`: `two-stage|dos etapas|cuatro opciones|Descartar|discard|v5\.1|catorce|46 test|csv|CSV|demo-repo|reset_store|aprobación humana` → cada hit resuelto o justificado.
- [ ] **Step 2:** Leak check (prefijo del tenant leído del `.env` local, sin imprimirlo; y `AUTH0_CLIENT_SECRET=.`) en `semanas/05` → 0.
- [ ] **Step 3:** Imágenes de `img/` sin referencia: listarlas y preguntar al docente si se borran.
- [ ] **Step 4:** Assemble; `measure.mjs` sobre todo el deck → sin desbordes nuevos respecto de la línea base; recorrer §§4-15 con Playwright y revisar consola (0 errores).
- [ ] **Step 5:** `source_material/index.md` (demo-repo → tp-final). Memoria `reference_demo_repo_session_log`: sumar el log auth0.
- [ ] **Step 6:** Commit final con nota de próximo paso.

## Self-review (writing-plans, revisión 2026-09-29)

**Spec coverage:** notas plugins → T1; §5 → T2; §4 → T3; §6 → T4; §7 → T5; §9 → T7; §10 → T8; §11 → T9; §12 → T10; §13 → T11; §14/§15 → T12. §8 no estaba en el bloque pero muestra `csv-import` → T6. Sin huecos.
**Placeholders:** ninguno; los textos visibles clave están fijados y los números salen del log.
**Consistencia:** "Subagent-driven" / "Native" y "Crítico / Importante / Menor" iguales en T3, T5, T7, T9, T12.
**Review Focus:** 1 → measure por tarea; 2 → greps por tarea + T13; 3 → conteo de `<em>`; 4 → T1 solo usa hechos del spine; 5 → leak grep por commit + T13.
