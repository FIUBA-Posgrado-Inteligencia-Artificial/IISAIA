# Semana 05 Source Material — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Escribir los 16 archivos de `semanas/05/source_material/` (index.md + 15 archivos numerados) que la fase `/build-class` convertirá en slides, siguiendo el spec `docs/superpowers/specs/2026-05-21-semana-05-source-material-design.md`.

**Architecture:** Continuación directa de S04. Apertura (§01) + 2 secciones de plugins (§§02-03) + intro a Superpowers (§§04-05) + recorrido del happy-path skill-por-skill (§§06-13) + cierre (§§14-15). Cada archivo es prosa de source material — no slides — siguiendo el patrón de `semanas/04/source_material/`. Las secciones de skill se apoyan en los `SKILL.md` del plugin clonado (fuente de verdad); el source material los enmarca pedagógicamente sin reemplazarlos. Cada sección de skill termina con un placeholder `<!-- INSERT-USER-CAPTURE -->` para que Enzo inserte capturas reales de su propio uso al armar los slides.

**Tech Stack:** Markdown. Sin build ni tests automatizados — verificación es checklist editorial + grep de placeholders. El downstream (`/build-class` → spine → slides) está fuera de alcance.

---

## Convenciones (aplican a TODOS los archivos)

Tomadas de `tools/skills/slide-generation/voice-and-didactics.md`, el patrón de `semanas/04/source_material/`, y memoria global del usuario:

**Voz y estructura:**
- Español rioplatense, técnico-accesible, segunda persona (`podés`, `fijate`), imperativo para acciones.
- Hook antes de explicación; why antes de what; capa sobre capa sin referencias hacia adelante (salvo callbacks/semillas declarados explícitamente en el spec).
- `# Título` (sin numerar), prosa en párrafos cortos, subsecciones con `## Header` específico (nunca "Introducción"/"Resumen"). Modelo: `semanas/04/source_material/06-claude-code-es-el-loop.md`.
- Números concretos sobre abstracciones. Analogías sólo si ganan su lugar.
- Los archivos NO llevan `<aside class="notes">` ni HTML de slides — eso lo genera `/build-class`.

**Prohibido (memoria del usuario):**
- Emojis.
- Vocabulario AI-filler (`revolucionario`, `potenciar`, `robusto`, `leverage`, `seamless`, `streamline`, `empower`).
- Término **"vibe coding"** (aunque esté en `programa.md`, es demasiado informal).
- Término **"diplomatura"** (referirse a `este curso` / `estas ocho semanas`).
- Término **"bisagra"** como metáfora de transición (usar `salto` / `bajada`).
- Anglicismo **"payoff"** (usar `recompensa` / `sentido`).
- Meta-referencias al calendario del curso (`esta semana`, `la firma de la semana`) — el texto visible enseña el concepto, no ubica al alumno temporalmente.
- Em-dash más de uno por párrafo.
- Texto placeholder, boilerplate de bienvenida.

**Preferencias técnicas:**
- Defaultear a términos en inglés para conceptos técnicos (`status code`, `path`, `schema`, `branch`, `commit`, `pull request`, `marketplace`, `plugin`, `skill`, `subagent`).
- Las marcas concretas que sí se usan: Claude Code, Superpowers, GitHub, VS Code.

**Marcadores especiales:**
- `<!-- INSERT-USER-CAPTURE -->` seguido por un comentario que describe qué captura va en ese lugar. Lo coloca el plan exactamente como aparece en el template de la sección de skill. La fase `/build-class` lo interpreta como hueco de imagen.

---

## Mapa de archivos

```
semanas/05/source_material/
├── index.md                              (Task 1)
├── 01-de-piezas-a-paquetes.md            (Task 2)
├── _research/
│   └── plugins-reference.md              (Task 3, cacheado para reproducibilidad)
├── 02-plugins-que-son.md                 (Task 4)
├── 03-plugins-distribucion.md            (Task 5)
├── 04-superpowers-que-es.md              (Task 6)
├── 05-instalar-superpowers.md            (Task 7)
├── 06-brainstorming.md                   (Task 8)  ★ con auto-review
├── 07-writing-plans.md                   (Task 9)  ★ con spec-driven dev + auto-review
├── 08-github-flow.md                     (Task 10) (excepción: no skill, no auto-review)
├── 09-subagent-driven-development.md     (Task 11) ★ con two-stage review
├── 10-test-driven-development.md         (Task 12)
├── 11-requesting-code-review.md          (Task 13)
├── 12-verification-before-completion.md  (Task 14)
├── 13-finishing-a-development-branch.md  (Task 15)
├── 14-resto-del-cinturon.md              (Task 16)
└── 15-bajada-al-tp-final.md              (Task 17)
```

Task 18 = consistency check final.

---

## Shared Skill Section Template

**Usado por:** Tasks 8, 9, 11, 12, 13, 14, 15 (skills del happy-path con plantilla uniforme).

Cada archivo de skill se escribe siguiendo este molde literalmente. La sub-sección `## Punto de auto-review` está presente sólo en las skills con auto-review interna (marcadas con ★ en el mapa de archivos: Tasks 8, 9, 11). En las demás se omite limpiamente.

```markdown
# <skill-name>

## Qué hace

<Cita literal del campo `description` del frontmatter del SKILL.md, en prosa.
Si el description original está en inglés, traducir al español manteniendo la
literalidad técnica. 1-2 párrafos cortos. Sin bullets.>

## Cuándo se activa

<Triggers del frontmatter + condiciones del body que sean no-obvias. Prosa, no
checklist. Si los triggers son varios casos discretos (ej. "antes de tocar
código / feature nueva / refactor"), van como prosa enumerativa: "Antes de
cualquier trabajo creativo: feature nueva, refactor, modificación de
comportamiento".>

## Por qué importa

<Utilidad pedagógica. La única parte 100% autoral. Responde:
"si saco esta skill del flujo, qué se rompe?" Concreto y específico para
esta skill. 2-4 oraciones. Sin bullets. Acá entra la voz del docente.>

## El punto crítico

<1 idea central, extraída del SKILL.md. Una oración o un párrafo corto.
Sin bullets.>

## El artefacto: <X> en disco              ← OPCIONAL — sólo §06 brainstorming y §07 writing-plans
<Path exacto donde la skill persiste su output (spec o plan), formato de
nombre, qué skill lo lee después. Refuerza la disciplina spec-driven dev
con un anclaje tangible. 1 párrafo.>

## Punto de auto-review                    ← OPCIONAL — sólo si la skill tiene una
<Qué se autorrevisa, cuándo en el flujo de la skill, y qué busca. Acá las
auto-reviews dentro de la skill (Spec Self-Review, Plan Self-Review,
two-stage review). 1 párrafo.>

## Anti-patrones a evitar

<2-3 anti-patrones extraídos del SKILL.md. Acá sí se admite bullets cortos
(la lista de anti-patrones es uno de los pocos casos donde bullets ayudan
según la convención del curso).>

- <Anti-patrón 1>.
- <Anti-patrón 2>.
- <Anti-patrón 3>.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/<skill-name>/SKILL.md`

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: <descripción específica de qué captura va acá según skill> -->
```

---

## Task 1: index.md

**Files:**
- Modify (overwrite): `semanas/05/source_material/index.md`

- [ ] **Step 1: Reescribir `index.md` completamente**

Reemplazar el contenido placeholder actual (`Proyecto Integrador I...`) por el siguiente. Pegar literalmente:

````markdown
# Semana 5 — Plugins de Claude Code y Superpowers

Este es el material fuente de la clase de Semana 5. La presentación reveal.js se genera con `/build-class` a partir de estos archivos.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-de-piezas-a-paquetes.md](01-de-piezas-a-paquetes.md) | De piezas sueltas a paquetes distribuibles | Apertura (~10 min) |
| 2 | [02-plugins-que-son.md](02-plugins-que-son.md) | Qué es un plugin de Claude Code | Plugins (~12 min) |
| 3 | [03-plugins-distribucion.md](03-plugins-distribucion.md) | Marketplaces e instalación | Plugins (~13 min) |
| 4 | [04-superpowers-que-es.md](04-superpowers-que-es.md) | Superpowers: qué problema resuelve | Superpowers intro (~12 min) |
| 5 | [05-instalar-superpowers.md](05-instalar-superpowers.md) | Instalar Superpowers en vivo | Superpowers intro (~8 min) |
| 6 | [06-brainstorming.md](06-brainstorming.md) | brainstorming — refinación socrática del diseño | Happy-path (~13 min) |
| 7 | [07-writing-plans.md](07-writing-plans.md) | writing-plans + spec-driven development | Happy-path (~14 min) |
| 8 | [08-github-flow.md](08-github-flow.md) | git refresher + GitHub Flow | Happy-path (~17 min) |
| 9 | [09-subagent-driven-development.md](09-subagent-driven-development.md) | subagent-driven-development | Happy-path (~13 min) |
| 10 | [10-test-driven-development.md](10-test-driven-development.md) | test-driven-development | Happy-path (~12 min) |
| 11 | [11-requesting-code-review.md](11-requesting-code-review.md) | requesting-code-review | Happy-path (~12 min) |
| 12 | [12-verification-before-completion.md](12-verification-before-completion.md) | verification-before-completion | Happy-path (~12 min) |
| 13 | [13-finishing-a-development-branch.md](13-finishing-a-development-branch.md) | finishing-a-development-branch | Happy-path (~11 min) |
| 14 | [14-resto-del-cinturon.md](14-resto-del-cinturon.md) | Skills off-path del plugin | Cierre (~8 min) |
| 15 | [15-bajada-al-tp-final.md](15-bajada-al-tp-final.md) | Bajada al trabajo final | Cierre (~7 min) |

## Hilo conductor

Semana 4 te dio las piezas sueltas del runtime de Claude Code: CLAUDE.md, rules, skills, sub-agents, plan mode. Semana 5 las recibe ya empaquetadas en un **plugin** — el envoltorio que las distribuye, instala y versiona. Para no quedarte sólo en "qué es un plugin", instalás el más completo que existe (**Superpowers**) y aprendés el flujo de trabajo que opera sobre Claude Code: brainstorming → spec → plan → ejecución autónoma → review → merge. Es la metodología con la que vas a armar tu trabajo final.

La parte 1 (§§01-03) presenta plugins como concepto general; la parte 2 (§§04-05) instala Superpowers; la parte 3 (§§06-13) recorre las siete skills del happy-path con la misma plantilla — qué hace / cuándo se activa / por qué importa / punto crítico / anti-patrones — y termina cada una con una captura real del propio uso del flujo aplicado al demo-repo de la semana 04. El cierre (§§14-15) nombra el resto del cinturón y baja al trabajo final.
````

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/index.md
git commit -m "feat(s05): index.md con orden de lectura e hilo conductor"
```

---

## Task 2: 01-de-piezas-a-paquetes.md

**Files:**
- Create: `semanas/05/source_material/01-de-piezas-a-paquetes.md`

- [ ] **Step 1: Escribir el archivo**

Apertura. Recap de S04 (siete piezas del runtime) → problema concreto: cómo distribuís una skill que escribiste, cómo la versionás, cómo la compartís con un compañero → respuesta: un plugin es el envoltorio que junta todo eso. No definir todavía la anatomía exacta (eso es §02). Esta sección plantea el problema; §02 responde.

Estructura sugerida (3-4 subsecciones, ~5 slides):

1. `# De piezas sueltas a paquetes`
2. `## La semana pasada quedó algo abierto` — recap rápido: tenés un CLAUDE.md potente, un par de skills propias en `.claude/skills/`, dos slash commands útiles. Funciona en tu máquina. ¿Cómo lo lleva tu compañero a la suya?
3. `## Las tres cosas que duelen sin envoltorio` — copy-paste manual de directorios, sincronización de versiones, conflictos cuando uno actualiza y el otro no. Cada una en un párrafo corto.
4. `## La respuesta tiene nombre: plugin` — un párrafo planteando el concepto al toque, sin profundizar. "En la próxima sección vemos qué hay adentro de un plugin y cómo se distribuye."

Tono: el problema antes de la solución. Es ingenuo (los alumnos podrían preguntarse "y por qué no zip-eo todo y mando por mail") — eso está bien, lo respondemos en §02-03.

- [ ] **Step 2: Verificar que no hay términos prohibidos**

Run: `Select-String -Path semanas/05/source_material/01-de-piezas-a-paquetes.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless|streamline|robust"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/01-de-piezas-a-paquetes.md
git commit -m "feat(s05 §01): apertura — de piezas sueltas a paquetes"
```

---

## Task 3: Fetch + cache plugins reference doc

**Files:**
- Create: `semanas/05/source_material/_research/plugins-reference.md`

Razón: los §§02-03 se apoyan en la doc oficial de plugins. Cacheamos el contenido para reproducibilidad (la doc puede cambiar) y para que el agente de Tasks 4-5 no tenga que volver a fetchear.

- [ ] **Step 1: Crear directorio `_research/`**

Run: `New-Item -ItemType Directory -Force semanas/05/source_material/_research/`

- [ ] **Step 2: Fetch + escribir el cache**

Usar la herramienta WebFetch:
- URL: `https://code.claude.com/docs/en/plugins-reference`
- Prompt: `"Extract the full plugin reference content. Include: definition of a plugin, anatomy (plugin.json structure, folder layout), marketplace mechanics, install/uninstall commands, any examples shown."`

Escribir el output a `semanas/05/source_material/_research/plugins-reference.md` con un header:

```markdown
# Cache: https://code.claude.com/docs/en/plugins-reference

Fetched: <YYYY-MM-DD>
Purpose: fuente canónica para §§02-03. No editar manualmente.

---

<contenido del fetch>
```

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/_research/plugins-reference.md
git commit -m "chore(s05): cache plugins-reference doc para §§02-03"
```

---

## Task 4: 02-plugins-que-son.md

**Files:**
- Create: `semanas/05/source_material/02-plugins-que-son.md`
- Read first: `semanas/05/source_material/_research/plugins-reference.md`

- [ ] **Step 1: Escribir el archivo**

Concepto + anatomía mínima. Usar el cache del Task 3 como fuente. Estructura sugerida (~6-7 slides):

1. `# Qué es un plugin de Claude Code`
2. `## Lo que junta` — un plugin puede traer varios de los componentes vistos en S04: skills, slash commands, sub-agents, hooks, MCP servers. Listar (acá bullets están bien, es lista de tipos discretos). Un párrafo aclarando que no necesariamente trae todos — un plugin puede ser sólo skills, o sólo slash commands.
3. `## La anatomía mínima` — qué hay en el folder de un plugin. Mencionar `plugin.json` (manifest), el layout típico de carpetas (`skills/`, `commands/`, `agents/`, `hooks/`). Citar las propiedades clave del `plugin.json` según el cache. Mostrar un ejemplo de `plugin.json` minimal en un fence ```json```.
4. `## Por qué empaquetar` — recoger el problema que §01 dejó abierto: versionado, distribución, actualización en grupo. Resolver el "y por qué no zip-eo": un plugin es estándar (Claude Code sabe leerlo), es versionable, es instalable con un comando. No tenés que pensar en dónde poner cada cosa.

Tono: descriptivo y concreto. Citar la fuente canónica al pie del archivo:

```
Fuente: https://code.claude.com/docs/en/plugins-reference
```

- [ ] **Step 2: Verificar términos prohibidos**

Run: `Select-String -Path semanas/05/source_material/02-plugins-que-son.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless|streamline"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/02-plugins-que-son.md
git commit -m "feat(s05 §02): qué es un plugin de Claude Code"
```

---

## Task 5: 03-plugins-distribucion.md

**Files:**
- Create: `semanas/05/source_material/03-plugins-distribucion.md`
- Read first: `semanas/05/source_material/_research/plugins-reference.md`

- [ ] **Step 1: Escribir el archivo**

Marketplaces e instalación. Estructura sugerida (~5-6 slides):

1. `# Cómo se distribuyen e instalan los plugins`
2. `## Marketplaces` — qué es un marketplace (registro de plugins). El oficial (`claude-plugins-official`) y la idea de marketplaces comunitarios. Citar del cache la sintaxis de registro: `/plugin marketplace add <fuente>`.
3. `## Instalar y desinstalar` — comandos `/plugin install <plugin>@<marketplace>` y `/plugin uninstall`. Mostrar exactamente uno por bloque de código. Mencionar que el plugin queda instalado a nivel de usuario (no de proyecto) y se carga automáticamente.
4. `## Inspeccionar un plugin instalado` — beat-sheet corto de demo en vivo: abrir el folder donde se instalaron los plugins (`~/.claude/plugins/cache/`), entrar al de un plugin cualquiera (ej. el oficial), señalar `plugin.json` + carpeta `skills/`. Formato beat-sheet:

```markdown
## Mini-demo en vivo: anatomía de un plugin instalado

Mostramos que la teoría de §02 efectivamente está en disco.

- **Qué hago:** abro `~/.claude/plugins/cache/claude-plugins-official/` en VS Code (terminal: `code ~/.claude/plugins/cache/claude-plugins-official/`).
- **Qué digo:** "Esto es lo que Claude Code descargó cuando corrimos `/plugin install`. Es el folder estándar que vimos hace dos minutos."
- **Qué tienen que mirar:** el `plugin.json` arriba, el folder `skills/` adentro, cada skill como subfolder con su `SKILL.md`.
- **Plan B si no coopera:** screenshot pre-armado del file tree con anotaciones.
```

Cierre: "Ya viste qué es un plugin y cómo se instala. Ahora instalamos uno serio."

- [ ] **Step 2: Verificar términos prohibidos**

Run: `Select-String -Path semanas/05/source_material/03-plugins-distribucion.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless|streamline"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/03-plugins-distribucion.md
git commit -m "feat(s05 §03): marketplaces e instalación de plugins"
```

---

## Task 6: 04-superpowers-que-es.md

**Files:**
- Create: `semanas/05/source_material/04-superpowers-que-es.md`
- Read first:
  - `semanas/05/source_material/superpowers/README.md`
  - `semanas/05/source_material/superpowers/skills/using-superpowers/SKILL.md`

- [ ] **Step 1: Escribir el archivo**

Overview de Superpowers. Excepción a la plantilla de skill — esto es una intro al plugin, no a una skill individual. Estructura sugerida (~5-6 slides):

1. `# Superpowers`
2. `## Qué problema resuelve` — del README: el agente, sin metodología, salta a escribir código. Pierde la oportunidad de detectar mismatch de intención antes de que sea caro. Superpowers fuerza un proceso: entendé qué construís → diseñá → planificá → ejecutá → verificá.
3. `## El happy-path completo` — el flujo que vamos a recorrer las próximas dos horas. Acá conviene un diagrama: brainstorming → writing-plans → (GitHub Flow) → subagent-driven-dev → TDD → requesting-code-review → verification-before-completion → finishing-a-development-branch. En el archivo va como texto (la fase spine decide si lo convierte en diagrama visual o en lista numerada). Una línea explicando que las skills se invocan automáticamente cuando aplican.
4. `## Filosofía` — extraer del README la sección "Philosophy": TDD, sistemático sobre ad-hoc, reducción de complejidad, evidencia sobre claims. 4 líneas.
5. `## Lo que NO es` — para evitar inflar expectativas: no escribe el código por vos, no reemplaza tu criterio, no funciona si no contestás las preguntas socráticas (la skill se traba si vos te trabás). Una oración por punto.

Cierre: "En la próxima sección lo instalamos."

- [ ] **Step 2: Verificar términos prohibidos**

Run: `Select-String -Path semanas/05/source_material/04-superpowers-que-es.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless|streamline|empower"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/04-superpowers-que-es.md
git commit -m "feat(s05 §04): Superpowers — problema, flujo, filosofía"
```

---

## Task 7: 05-instalar-superpowers.md

**Files:**
- Create: `semanas/05/source_material/05-instalar-superpowers.md`

- [ ] **Step 1: Escribir el archivo**

Demo de instalación en vivo. Excepción a la plantilla — formato beat-sheet tipo S04 (qué hago / qué digo / qué mirar / plan B). Estructura corta (~3-4 slides):

1. `# Instalar Superpowers`
2. `## La instalación, paso a paso` — beat-sheet:

```markdown
- **Qué hago:** abro Claude Code en una terminal limpia.
- **Qué digo:** "Vamos a instalarlo desde el marketplace oficial. Es un comando."
- **Qué tienen que mirar:** la línea de comando.
- **Comando:** `/plugin install superpowers@claude-plugins-official`
- **Qué digo mientras corre:** "Esto baja el plugin a ~/.claude/plugins/cache/claude-plugins-official/superpowers/ y registra todas sus skills."
```

3. `## Verificar que cargó` — beat-sheet:

```markdown
- **Qué hago:** escribo `/skills` (o lo que liste skills disponibles según versión).
- **Qué tienen que mirar:** las skills de Superpowers aparecen en la lista — brainstorming, writing-plans, etc.
- **Qué digo:** "Estas son las catorce skills que vamos a recorrer las próximas dos horas — pero antes, un panorama de cómo se encadenan."
```

4. `## Plan B si no coopera` — pantalla con captura pre-armada del antes/después de `/skills`. Si el marketplace está caído, mostrar la doc oficial del comando.

Tono: instructivo, directo. Sin teoría — la teoría fue §04.

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/05-instalar-superpowers.md
git commit -m "feat(s05 §05): demo de instalación de Superpowers"
```

---

## Task 8: 06-brainstorming.md (★ con auto-review)

**Files:**
- Create: `semanas/05/source_material/06-brainstorming.md`
- Read first: `semanas/05/source_material/superpowers/skills/brainstorming/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template**

Aplicar la plantilla del header del plan. Valores específicos para esta skill:

- **Qué hace:** del frontmatter de SKILL.md (`description`). En esencia: "Antes de cualquier trabajo creativo, esta skill explora intención, requisitos y diseño en lugar de saltar a implementar."
- **Cuándo se activa:** antes de feature nueva, refactor, modificación de comportamiento. Si hay 1% de chance de que aplique, se invoca.
- **Por qué importa (autoral):** sin esta skill, los agentes saltan a escribir código antes de saber qué construís. La conversación termina produciendo el spec — el artefacto que después dirige todo el flujo. Es ingeniería de prompts aplicada al diseño: detectás el mismatch de intención cuando es barato (palabras), no cuando es caro (código). Plantar la semilla de spec-driven dev: "el spec que sale de acá es el contrato; en la próxima skill vemos por qué tener un spec separado del código importa".
- **El punto crítico:** una pregunta por vez. Multiple choice cuando se puede. Nunca implementar antes de que el usuario apruebe el diseño escrito.
- **El artefacto en disco (sub-sección extra):** el spec aprobado se persiste en `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` y se commitea. No es un documento descartable de la conversación — es un archivo de primera clase del repo. Las próximas skills (writing-plans, subagent-driven-dev) lo leen desde ahí. Esto va como sub-sección propia entre "El punto crítico" y "Punto de auto-review", con título `## El artefacto: el spec en disco`.
- **Punto de auto-review (★):** después de escribir el spec en disco, antes de mostrarlo al usuario, la skill ejecuta un Spec Self-Review: escanea placeholders ("TBD", "TODO"), contradicciones internas, scope (¿esto es un spec o cinco specs?), ambigüedades. Lo arregla en el momento sin pedirle al usuario. El humano nunca debería leer un placeholder en su spec.
- **Anti-patrones a evitar:**
  - "Esto es muy simple, no necesita diseño" — todo proyecto pasa por el proceso.
  - Combinar 3 preguntas en un mensaje — satura al usuario y abrevia calidad.
  - Invocar implementation skills antes de tener spec aprobado.
- **Fuente canónica:** `semanas/05/source_material/superpowers/skills/brainstorming/SKILL.md`
- **Captura:** `<!-- Captura real: screenshot de las preguntas socráticas recibidas al pedir un feature al demo-repo de S04 + el archivo de spec resultante abierto en VS Code (path docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md). Opcional: notas del Spec Self-Review previo a entregar. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/06-brainstorming.md
git commit -m "feat(s05 §06): skill brainstorming + Spec Self-Review"
```

---

## Task 9: 07-writing-plans.md (★ con spec-driven dev + auto-review)

**Files:**
- Create: `semanas/05/source_material/07-writing-plans.md`
- Read first: `semanas/05/source_material/superpowers/skills/writing-plans/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template + spec-driven dev**

Esta sección desvía levemente del template: antes de las sub-secciones estándar de la plantilla, va un bloque dedicado a **spec-driven development** (el desarrollo completo del concepto que §06 plantó como semilla).

Orden del archivo:

1. `# writing-plans`
2. `## Antes de la skill: qué es spec-driven development` — 2 sub-bloques:
   - `### El spec como source of truth` — separa el qué/por qué (spec) del cómo (plan + código). El spec se discute con el humano; el plan y el código se delegan al agente. Si cambia el spec, cambia el plan; si cambia el plan, cambia el código. Nunca al revés.
   - `### Cómo Superpowers lo operacionaliza` — la cadena `brainstorming` (produce spec) → `writing-plans` (spec → plan ejecutable) → `subagent-driven-dev` (plan → código). Cada skill mira la del paso anterior como contrato.
3. Y ahora la plantilla estándar a partir de `## Qué hace`:
   - **Qué hace:** convierte un spec en implementation plan — tareas de 2-5 min, archivos exactos, código completo en cada step, verificación al lado.
   - **Cuándo se activa:** después del brainstorming, antes de tocar código. Si tenés un spec, esta skill convierte spec → plan.
   - **Por qué importa (autoral):** el plan es lo que permite que cualquier agente (vos en otra sesión, un subagente, un colega) ejecute la implementación sin re-deducir nada. Es el contrato técnico. Sin esta skill, el "plan" queda en tu cabeza y se pierde cuando el contexto se acaba o cambia el agente.
   - **El punto crítico:** tareas de 2-5 minutos cada una, con archivos exactos y código completo en cada step. Nada de "implementar similar al Task N" — el ingeniero puede leer las tareas fuera de orden.
   - **El artefacto en disco (sub-sección extra):** el plan se persiste en `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` y se commitea junto al spec. Ese par (spec + plan) es lo que después lee `subagent-driven-development` para ejecutar autónomamente. Ya tenés un ejemplo concreto a mano: el spec de esta semana 05 está en `docs/superpowers/specs/2026-05-21-semana-05-source-material-design.md` y el plan que estamos ejecutando está en `docs/superpowers/plans/2026-05-21-semana-05-source-material.md` — son los mismos archivos que Superpowers produjo armando esta clase. Esto va como sub-sección propia entre "El punto crítico" y "Punto de auto-review", con título `## El artefacto: el plan en disco`.
   - **Punto de auto-review (★):** después de escribir el plan, antes de pasárselo al usuario, hay un Plan Self-Review: spec coverage (¿cada requisito del spec tiene una tarea?), placeholder scan, type consistency (¿`clearLayers()` en una tarea sigue siendo `clearLayers()` en la siguiente?). Issues se arreglan inline.
   - **Anti-patrones a evitar:**
     - "TBD", "TODO", "implement later" — son fallas del plan, no pendientes legítimos.
     - "Add appropriate error handling" — vago. Mostrar el error handling concreto.
     - "Similar to Task N" — repetir el código. La gente lee fuera de orden.
   - **Fuente canónica:** `semanas/05/source_material/superpowers/skills/writing-plans/SKILL.md`
   - **Captura:** `<!-- Captura real: screenshot del archivo de plan resultante abierto en VS Code (path docs/superpowers/plans/YYYY-MM-DD-<feature>.md) — mostrando la estructura task-by-task con archivos exactos y steps. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/07-writing-plans.md
git commit -m "feat(s05 §07): writing-plans + spec-driven dev + Plan Self-Review"
```

---

## Task 10: 08-github-flow.md (excepción a la plantilla)

**Files:**
- Create: `semanas/05/source_material/08-github-flow.md`

- [ ] **Step 1: Escribir el archivo**

Excepción a la plantilla — no es una skill de Superpowers. Mini-refresher de git + GitHub Flow. Estructura sugerida (~8-9 slides, ~17 min):

1. `# Git y GitHub Flow`
2. `## Mini-refresher: tres conceptos` — 3 sub-bloques cortos, uno por concepto:
   - `### commit` — qué es un commit, qué guarda, por qué hacer commits chicos y frecuentes.
   - `### branch` — qué es una branch, por qué arrancar la session en una rama propia (`feature/<descripcion>`), comando: `git checkout -b feature/<descripcion>`.
   - `### pull request` — qué es un PR, qué pasa cuando lo abrís, por qué es el contrato visible de un feature.
3. `## GitHub Flow paso a paso` — el flujo que Enzo usa todos los días con Superpowers. Beat por beat, sin teoría adicional:
   - Antes de arrancar la session: `git checkout -b feature/<descripcion>`.
   - Durante el trabajo: commits granulares mientras Superpowers ejecuta el plan (la skill `subagent-driven-dev` commitea por tarea; tu trabajo es revisar y aceptar).
   - Cuando el feature está listo (verification-before-completion pasó): `git push origin feature/<descripcion>`.
   - En la UI de GitHub: abrir el PR. Título y descripción claros — Superpowers ya generó los commits, ahora vos contás la historia.
4. `## Por qué este patrón se lleva bien con Superpowers` — cada session tiene su branch (aislamiento natural), el PR queda como contrato visible (revisable por humanos), main siempre permanece estable. No necesitás stash ni rebase complicado.
5. `## Honesty: existe using-git-worktrees` — un párrafo corto. Superpowers incluye una skill `using-git-worktrees` que automatiza un workflow más avanzado (trabajar en varias branches en paralelo en distintos folders). No la usamos en este curso porque worktrees agrega fricción cognitiva sobre git base y el flujo simple es suficiente para el TP. Link a la skill por si querés explorarla después: `superpowers/skills/using-git-worktrees/SKILL.md`.

Cierre: "Ya sabés cómo enmarcar el trabajo en branches y PRs. Ahora volvemos a Superpowers — la próxima skill es la que ejecuta el plan que escribimos."

`<!-- INSERT-USER-CAPTURE -->`
`<!-- Captura real: screenshot del PR de Enzo en el demo-repo de S04, abierto con los commits que Superpowers generó durante la session. -->`

- [ ] **Step 2: Verificar términos prohibidos**

Run: `Select-String -Path semanas/05/source_material/08-github-flow.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless|streamline"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/08-github-flow.md
git commit -m "feat(s05 §08): git refresher + GitHub Flow + disclosure de worktrees"
```

---

## Task 11: 09-subagent-driven-development.md (★ con two-stage review)

**Files:**
- Create: `semanas/05/source_material/09-subagent-driven-development.md`
- Read first: `semanas/05/source_material/superpowers/skills/subagent-driven-development/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template**

Valores específicos:

- **Qué hace:** despacha un subagent fresco por cada tarea del plan. Cada subagent corre con contexto limpio, ejecuta su tarea, y devuelve un resumen. El coordinador hace un review en dos etapas (spec compliance + calidad) y decide si pasar a la siguiente tarea o iterar.
- **Cuándo se activa:** con un plan aprobado, cuando elegís ejecutarlo en este modo (la alternativa es `executing-plans` con checkpoints humanos).
- **Por qué importa (autoral):** es el corazón del "autonomous coding" de Superpowers. Cada subagent arranca limpio — no arrastra context rot ni decisiones de tareas anteriores. El coordinador mantiene la visión global; los subagents tienen foco quirúrgico. Callback a spec-driven dev: el subagent lee el plan y el spec — por eso podés correr el flujo casi autónomo durante una hora sin desviarse.
- **El punto crítico:** un subagent fresco por tarea, no un subagent que recibe varias tareas. El reset de contexto entre tareas es lo que hace que esto escale.
- **Punto de auto-review (★):** después de que el subagent reporta tarea completa, el coordinador corre un **two-stage review** antes de pasar a la siguiente: (1) spec compliance — ¿cumple lo que el plan pedía?; (2) calidad — ¿el código es razonable, sin dead code ni shortcuts? Si alguna etapa falla, vuelve a despachar el subagent con feedback puntual. El humano sólo interviene cuando ambas etapas pasan o cuando la skill explícitamente pide criterio.
- **Anti-patrones a evitar:**
  - Reusar el subagent para varias tareas — pierde el beneficio de reset de contexto.
  - Saltearse el two-stage review — el spec compliance check es lo que evita que el flujo derive.
  - Intervenir demasiado pronto — la skill está diseñada para correr sola entre checkpoints.
- **Fuente canónica:** `semanas/05/source_material/superpowers/skills/subagent-driven-development/SKILL.md`
- **Captura:** `<!-- Captura real: screenshot de la terminal con subagents despachándose en serie + el output del two-stage review entre dos tareas. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/09-subagent-driven-development.md
git commit -m "feat(s05 §09): subagent-driven-development + two-stage review"
```

---

## Task 12: 10-test-driven-development.md

**Files:**
- Create: `semanas/05/source_material/10-test-driven-development.md`
- Read first: `semanas/05/source_material/superpowers/skills/test-driven-development/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template** (sin sub-sección de auto-review)

Valores específicos:

- **Qué hace:** fuerza el ciclo RED-GREEN-REFACTOR. Tests primero, mínimo código para pasar, refactor con tests en verde. Cualquier código escrito antes de su test se borra y se reescribe siguiendo el ciclo.
- **Cuándo se activa:** durante la implementación de cualquier feature o bugfix, antes de escribir código de producción.
- **Por qué importa (autoral):** sin TDD, el agente escribe código que "parece" correcto y después arma tests que pasan. Los tests post-hoc validan lo que el código hace, no lo que querías que hiciera. RED primero te obliga a expresar la intención en forma ejecutable antes de saber el cómo. Es la única forma de tener confianza real de que el feature funciona sin que un humano lea cada línea.
- **El punto crítico:** ver el test FALLAR antes de implementar. Si saltás el RED, no sabés si tu test efectivamente está testeando algo. Borrar y reescribir es disciplina, no perfeccionismo.
- **Anti-patrones a evitar:**
  - Escribir el código primero y "después agregar el test" — el test resultante valida el código que escribiste, no la intención original.
  - Tests que pasan en RED — significa que no están testeando lo que decís que testean.
  - Tests que dependen de mocks de todo — si el test no falla cuando rompés lógica real, el test no sirve.
- **Fuente canónica:** `semanas/05/source_material/superpowers/skills/test-driven-development/SKILL.md`
- **Captura:** `<!-- Captura real: screenshot del ciclo RED-GREEN-REFACTOR durante el demo — terminal con el test fallando primero, después pasando. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/10-test-driven-development.md
git commit -m "feat(s05 §10): test-driven-development"
```

---

## Task 13: 11-requesting-code-review.md

**Files:**
- Create: `semanas/05/source_material/11-requesting-code-review.md`
- Read first: `semanas/05/source_material/superpowers/skills/requesting-code-review/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template** (sin sub-sección de auto-review — esta skill ES una review)

Valores específicos:

- **Qué hace:** corre un code review estructurado contra el plan, antes de claimar que el trabajo está listo o de pedir merge. Reporta issues por severidad (crítico bloquea, mayor pide aprobación, menor es nota).
- **Cuándo se activa:** cuando terminás de implementar el plan, antes de pasar a finishing-branch. También antes de mergear features grandes.
- **Por qué importa (autoral):** es la última pasada con ojos frescos antes de que el código salga de tu cabeza. El reviewer es otro agente — no carga el sesgo del que implementó. Los issues críticos efectivamente bloquean el avance; eso evita que cosas obvias se cuelen al PR.
- **El punto crítico:** los issues críticos se resuelven antes de avanzar. No se "anotan para después" — se arreglan ya.
- **Anti-patrones a evitar:**
  - Saltearse la skill porque "los tests pasan" — code-review encuentra cosas que los tests no encuentran (dead code, mismatch con el spec, ergonomía pésima de la API).
  - Tratar issues críticos como mayores — la severidad es informativa, no negociable.
  - Pedir review antes de que TDD haya pasado verde — no tiene sentido revisar código que no funciona.
- **Fuente canónica:** `semanas/05/source_material/superpowers/skills/requesting-code-review/SKILL.md`
- **Captura:** `<!-- Captura real: screenshot del report de review generado al ejecutar la skill sobre el feature implementado en el demo-repo de S04. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/11-requesting-code-review.md
git commit -m "feat(s05 §11): requesting-code-review"
```

---

## Task 14: 12-verification-before-completion.md

**Files:**
- Create: `semanas/05/source_material/12-verification-before-completion.md`
- Read first: `semanas/05/source_material/superpowers/skills/verification-before-completion/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template** (sin sub-sección de auto-review — esta skill ES la verificación)

Valores específicos:

- **Qué hace:** antes de afirmar que algo está listo/arreglado/pasa, corre los verification commands y cita el output. Bloquea las afirmaciones de éxito que no tengan evidencia ejecutable atrás.
- **Cuándo se activa:** justo antes de claimar completion — antes de commitear, abrir PR, cerrar una tarea o decir "está listo".
- **Por qué importa (autoral):** sin esta skill, los agentes claimean éxito porque "compiló" o "los cambios parecen razonables". Lo que cierra el ciclo de spec-driven dev es la evidencia: el plan dijo qué verificar, ahora se verifica y se cita el output. Es la diferencia entre "creo que funciona" y "acá está el comando y su salida".
- **El punto crítico:** evidencia antes de afirmaciones. Siempre. Sin excepción. Si no podés correr el comando, lo decís explícitamente — no asumís.
- **Anti-patrones a evitar:**
  - "Los tests deberían pasar" — correlos y citá el output.
  - "El feature funciona" sin correr el feature — correrlo en el flujo real, no sólo en tests unitarios.
  - Decir "listo" porque la implementación compila — compilar es necesario, no suficiente.
- **Fuente canónica:** `semanas/05/source_material/superpowers/skills/verification-before-completion/SKILL.md`
- **Captura:** `<!-- Captura real: screenshot de los comandos de verificación corridos al final del feature del demo-repo de S04 + el output citado en el commit/PR. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/12-verification-before-completion.md
git commit -m "feat(s05 §12): verification-before-completion"
```

---

## Task 15: 13-finishing-a-development-branch.md

**Files:**
- Create: `semanas/05/source_material/13-finishing-a-development-branch.md`
- Read first: `semanas/05/source_material/superpowers/skills/finishing-a-development-branch/SKILL.md`

- [ ] **Step 1: Escribir el archivo siguiendo la Shared Skill Section Template** (sin sub-sección de auto-review)

Valores específicos:

- **Qué hace:** cuando las tareas del plan están todas verificadas, esta skill estructura las opciones de cierre: merge directo, abrir PR, mantener la branch viva, o descartar. Limpia el workspace según la opción elegida.
- **Cuándo se activa:** al final del plan, después de que verification-before-completion pasó.
- **Por qué importa (autoral):** sin esta skill, el flujo termina en "ya está, mergeá si querés" — y el humano se queda decidiendo a ojo qué hacer con la branch. Esta skill cierra el ciclo con criterio: hace explícitas las opciones, recomienda según el contexto (qué tipo de cambio, qué tan probado está), y deja el workspace en estado conocido. Continuidad con §08: en GitHub Flow, "finishing" termina abriendo el PR.
- **El punto crítico:** no quedarse en estado intermedio. La branch o se mergea, o se manda a PR, o se decide explícitamente mantenerla. "Después decido" es deuda silenciosa.
- **Anti-patrones a evitar:**
  - Mergear directo a `main` sin PR cuando el cambio amerita revisión — el PR es donde el contrato se hace visible.
  - Dejar la branch viva sin razón explícita — si no hay seguimiento planeado, abrila como PR o cerrala.
  - Olvidarse del cleanup del workspace (worktrees, branches locales) — la próxima session te encontrás restos.
- **Fuente canónica:** `semanas/05/source_material/superpowers/skills/finishing-a-development-branch/SKILL.md`
- **Captura:** `<!-- Captura real: screenshot del PR final del feature en el demo-repo, mergeado o listo para mergear. -->`

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/13-finishing-a-development-branch.md
git commit -m "feat(s05 §13): finishing-a-development-branch"
```

---

## Task 16: 14-resto-del-cinturon.md

**Files:**
- Create: `semanas/05/source_material/14-resto-del-cinturon.md`
- Read first (para confirmar nombres y descripciones de una línea):
  - `semanas/05/source_material/superpowers/skills/systematic-debugging/SKILL.md`
  - `semanas/05/source_material/superpowers/skills/dispatching-parallel-agents/SKILL.md`
  - `semanas/05/source_material/superpowers/skills/writing-skills/SKILL.md`
  - `semanas/05/source_material/superpowers/skills/receiving-code-review/SKILL.md`
  - `semanas/05/source_material/superpowers/skills/executing-plans/SKILL.md`
  - `semanas/05/source_material/superpowers/skills/using-git-worktrees/SKILL.md`

- [ ] **Step 1: Escribir el archivo**

Cierre — skills off-path nombradas. Una frase por skill, no se desarrollan. Estructura sugerida (~4-5 slides):

1. `# El resto del cinturón`
2. `## Lo que no recorrimos en detalle` — un párrafo corto framing: el plugin trae más skills que las siete del happy-path. Las siguientes existen y se activan automáticamente cuando aplican, pero no las recorrimos porque no son centrales al flujo lineal.
3. Lista de skills con descripción de una línea cada una (acá bullets están bien — es lista enumerativa pura):

```markdown
- **`systematic-debugging`** — proceso de root-cause en cuatro fases cuando aparece un bug. Se activa cuando algo falla en lugar de adivinar el arreglo.
- **`dispatching-parallel-agents`** — despachar varios subagents en paralelo cuando hay tareas independientes que se pueden trabajar en simultáneo.
- **`writing-skills`** — crear o editar skills propias (incluida esta del curso). La skill que escribe skills.
- **`receiving-code-review`** — el lado opuesto de `requesting-code-review`: cómo responder a feedback de review sin agregar y sin defender ciegamente.
- **`executing-plans`** — alternativa a `subagent-driven-development`: ejecuta el plan en la misma sesión, con checkpoints humanos en lugar de subagents.
- **`using-git-worktrees`** — workflow de worktrees para trabajar en varias branches en paralelo en folders distintos (mencionado en §08).
```

4. `## Cómo se las invoca` — un párrafo: no necesitás memorizarlas. Cada una tiene su trigger en el frontmatter; cuando hagas algo que coincida, Claude las propone o las invoca solo. Si querés explorar una, abrí su `SKILL.md` en `~/.claude/plugins/cache/.../superpowers/skills/<nombre>/`.

- [ ] **Step 2: Commit**

```bash
git add semanas/05/source_material/14-resto-del-cinturon.md
git commit -m "feat(s05 §14): resto del cinturón — skills off-path"
```

---

## Task 17: 15-bajada-al-tp-final.md

**Files:**
- Create: `semanas/05/source_material/15-bajada-al-tp-final.md`
- Read first: `semanas/04/source_material/14-trabajo-final.md` (para no contradecir framing previo)

- [ ] **Step 1: Escribir el archivo**

Cierre — bajada al trabajo final. Estructura corta (~3-4 slides):

1. `# El flujo aplicado al trabajo final`
2. `## Lo que vieron en §14 de la clase pasada` — recap muy corto del framing del TP (sin reabrir consignas administrativas — eso ya está cerrado en S04 §14).
3. `## Cómo lo arman con este flujo` — el TP final se construye usando exactamente lo que recorrimos hoy:
   - Empezás con `brainstorming` para sacar el spec del proyecto. No saltees este paso — es donde se decide qué construís.
   - Cuando el spec está aprobado, `writing-plans` lo convierte en un plan de tareas chicas.
   - Arrancás la session con `git checkout -b feature/<descripcion>` (§08).
   - Dejás correr `subagent-driven-development` con el plan; revisás entre tareas.
   - TDD activa por defecto durante la implementación.
   - Cuando todo verifica, abrís el PR y lo entregás.
4. `## Lo que NO hace el flujo por vos` — recordatorio: las decisiones siguen siendo tuyas. Superpowers acelera la ejecución y disciplina el proceso; no decide qué construís, ni si la decisión arquitectónica es la correcta, ni si el feature sirve a un usuario real. Esa parte sigue siendo tu trabajo. El plugin te libera tiempo para esa parte.

Cierre: una oración. Sin recap general de la clase ni "espero que les haya gustado". Algo más como: "La próxima clase abrimos calidad y seguridad sobre lo que ya construyen así."

- [ ] **Step 2: Verificar términos prohibidos**

Run: `Select-String -Path semanas/05/source_material/15-bajada-al-tp-final.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless"`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add semanas/05/source_material/15-bajada-al-tp-final.md
git commit -m "feat(s05 §15): bajada al trabajo final"
```

---

## Task 18: Consistency check final

**Files:**
- Read: todos los archivos de `semanas/05/source_material/` recién creados.

Verificación editorial final sin escribir nada nuevo (salvo correcciones puntuales si aparecen).

- [ ] **Step 1: Verificar que los 16 archivos existen**

Run: `Get-ChildItem semanas/05/source_material/ -File | Select-Object Name`
Expected: 16 items — `index.md` + `01-...md` hasta `15-...md`.

- [ ] **Step 2: Verificar que el cache de research existe**

Run: `Test-Path semanas/05/source_material/_research/plugins-reference.md`
Expected: `True`

- [ ] **Step 3: Verificar placeholders de captura en las skills con plantilla**

Run:
```powershell
$skillFiles = @('06-brainstorming.md','07-writing-plans.md','09-subagent-driven-development.md','10-test-driven-development.md','11-requesting-code-review.md','12-verification-before-completion.md','13-finishing-a-development-branch.md','08-github-flow.md')
foreach ($f in $skillFiles) {
    $content = Get-Content "semanas/05/source_material/$f" -Raw
    if ($content -notmatch 'INSERT-USER-CAPTURE') { Write-Host "FALTA placeholder en $f" -ForegroundColor Red }
    else { Write-Host "OK $f" -ForegroundColor Green }
}
```
Expected: todos OK. Si falta alguno, agregarlo al final del archivo correspondiente con el comentario descriptivo.

- [ ] **Step 4: Grep global anti-filler**

Run:
```powershell
Select-String -Path semanas/05/source_material/*.md -Pattern "vibe coding|diplomatura|bisagra|payoff|leverage|seamless|streamline|empower|revolucionario|potenciar"
```
Expected: no matches. Si aparece alguno, abrir el archivo y reescribir la frase.

- [ ] **Step 5: Verificar que los links del index funcionan**

Run:
```powershell
$index = Get-Content semanas/05/source_material/index.md -Raw
$linkedFiles = [regex]::Matches($index, '\((\d+-[a-z0-9-]+\.md)\)') | ForEach-Object { $_.Groups[1].Value }
foreach ($f in $linkedFiles) {
    if (-not (Test-Path "semanas/05/source_material/$f")) { Write-Host "ROTO: $f referenciado en index pero no existe" -ForegroundColor Red }
    else { Write-Host "OK $f" -ForegroundColor Green }
}
```
Expected: todos OK.

- [ ] **Step 6: Self-review editorial de tono**

Leer rápidamente cada archivo en orden buscando:
- Referencias hacia adelante no declaradas en el spec (ej. "como veremos en §09" cuando el spec no lo pide).
- Repeticiones de la misma idea en archivos contiguos.
- Frases AI-filler que el grep no haya levantado.
- Bullets en lugares donde la convención pide prosa.

Arreglar inline lo que aparezca. Si algo requiere una decisión más profunda, parar y consultar al usuario.

- [ ] **Step 7: Commit final**

Si hubo correcciones:

```bash
git add semanas/05/source_material/
git commit -m "polish(s05): consistency check final del source material"
```

Si no hubo correcciones, no commitear (el plan está completo).

---

## Self-Review del plan

**Spec coverage:**

| Spec section | Plan task | OK |
|--------------|-----------|----|
| §01 apertura | Task 2 | ✓ |
| §02 plugins-que-son | Task 4 (depende de Task 3) | ✓ |
| §03 plugins-distribucion | Task 5 (depende de Task 3) | ✓ |
| §04 superpowers-que-es | Task 6 | ✓ |
| §05 instalar-superpowers | Task 7 | ✓ |
| §06 brainstorming (★) | Task 8 | ✓ |
| §07 writing-plans (★ + spec-driven) | Task 9 | ✓ |
| §08 github-flow (excepción) | Task 10 | ✓ |
| §09 subagent-driven-dev (★) | Task 11 | ✓ |
| §10 TDD | Task 12 | ✓ |
| §11 code-review | Task 13 | ✓ |
| §12 verification-before-completion | Task 14 | ✓ |
| §13 finishing-branch | Task 15 | ✓ |
| §14 resto-del-cinturon | Task 16 | ✓ |
| §15 bajada-al-TP | Task 17 | ✓ |
| index.md | Task 1 | ✓ |
| Fetch plugins doc | Task 3 | ✓ |
| Consistency final | Task 18 | ✓ |

Sin gaps.

**Placeholder scan:** ningún task tiene "TBD" / "TODO" / "fill in later". Cada placeholder `<!-- INSERT-USER-CAPTURE -->` es contenido intencional documentado en el spec, no un plan failure.

**Type consistency:** los nombres de skills se mantienen idénticos en todo el plan (`subagent-driven-development`, `requesting-code-review`, etc., siempre con guiones, siempre minúscula). Los paths a SKILL.md siguen el patrón uniforme `semanas/05/source_material/superpowers/skills/<skill-name>/SKILL.md`. Los nombres de archivo de output siguen el patrón `NN-name-with-hyphens.md`.
