# Diseño — Rediseño de Parte 2, Semana 04

**Fecha:** 2026-05-19
**Alcance:** §7–§13 del spine de Semana 04 + crear `semanas/04/demo-repo/`
**Fuera de alcance:** §1–§6, §14 (era §12 trabajo final), animaciones existentes (`four-loop-anim.js`, `.lens-tracker`), pipeline `slide-generation` (lo invoca el plan de implementación).

---

## Contexto y motivación

La Parte 2 actual de la Semana 04 cubre 5 secciones (§7–§11): CLAUDE.md jerárquico, rules + auto memory, skills + slash commands, sub-agents, plan mode + permisos. Está organizada con el dispositivo `.lens-tracker` que aterriza cada feature en *context* o *harness* (el flip ocurre en §11).

El profesor pidió **rehacer Parte 2** con tres cambios sustanciales:

1. **Inventario de features ampliado.** Pasar de 5 features a 7 features tratados como secciones independientes:
   CLAUDE.md, rules, **settings.json**, **permisos** (separado), skills, sub-agents, plan mode. Settings.json y permisos pasan a ser secciones propias (hoy permisos vive como sub-tema de §11; settings.json no aparece).
2. **Estructura "documentation walkthrough" por sección.** Cada sección sigue la misma plantilla de 5 preguntas — *qué es / dónde vive / cuándo se carga / cómo se usa / casos límite* — con anclaje fuerte en la documentación oficial de Claude Code (`code.claude.com/docs`).
3. **Repo demo nuevo, abierto en VS Code.** Un repo aparte (`semanas/04/demo-repo/`) FastAPI + frontend que se llena con configuración de Claude Code sección a sección. Una sola incursión a VS Code por sección — el profesor solo tiene una pantalla y alterna en Google Meet entre compartir el navegador (slides) y compartir VS Code.

El profesor explícitamente acepta romper la coherencia con la lente `context ⊂ harness` plantada en §3.3, §5.5 y §6.5 — Parte 2 ya no recoge esa lente. El `.lens-tracker` introducido en §6.5 queda sin recoger; aceptado como costo de scope.

## Through-line de Parte 2 (nuevo)

Claude Code es un runtime configurable. Tiene siete piezas concretas que cualquiera puede tocar — cada una vive en un archivo, se carga en un momento, tiene un alcance acotado. Esta parte de la clase recorre las siete con la misma plantilla, anclada en la documentación oficial y verificada con un demo en un repo abierto en VS Code. Al final, el alumno puede abrir cualquier proyecto y ubicar las piezas; no aprende features, aprende a auditar un runtime.

## Plantilla por sección

Cada una de las 7 secciones (§7–§13) sigue esta plantilla:

1. **Qué es** — definición en una línea, libre de jerga.
2. **Dónde vive** — rutas concretas; jerarquía si aplica (con tabla).
3. **Cuándo se carga / se aplica** — momento del ciclo de vida y trigger que lo activa.
4. **Cómo se usa** — sintaxis, ejemplos extraídos del repo demo (`semanas/04/demo-repo/`).
5. **Casos límite / cosas que confunden** — anti-patterns, precedencias, gotchas, comparaciones que se prestan a confusión.
6. **Demo en VS Code** — un único bloque de demo al cierre de la sección, no fragmentado a lo largo de la sección.

## Dispositivos pedagógicos recurrentes

- **Tarjeta de 5 preguntas como divider de sección.** Cada sección abre con una tarjeta visual que muestra las 5 preguntas de la plantilla, con la pregunta activa resaltada. Este dispositivo reemplaza al `.lens-tracker` como elemento recurrente de Parte 2.
- **Repo demo siempre disponible.** Las rutas, archivos y contenidos referenciados en los slides son los del `semanas/04/demo-repo/`. Cuando el profesor cambia el share de Meet a VS Code, la audiencia reconoce lo que vio en los slides.
- **Citas verbatim de la doc oficial.** Bloques tipográficamente marcados como cita, con URL al pie. Anclan afirmaciones precisas: "primeras 200 líneas o 25 KB de `MEMORY.md`", "los `deny` tienen precedencia sobre los `allow`", "4 niveles de jerarquía", etc. Las URLs canónicas son `https://code.claude.com/docs/en/memory`, `https://code.claude.com/docs/en/permission-modes`, y las páginas hermanas para cada feature.

## Restricciones de presentación

- **Una sola incursión a VS Code por sección.** El profesor solo tiene una pantalla. Alterna en Meet entre compartir browser (slides) y compartir VS Code. La audiencia paga un costo cognitivo en cada cambio. Por eso, dentro de cada sección, el contenido de archivos (CLAUDE.md, rules, settings.json, etc.) se muestra **primero en los slides** vía `code-walkthrough` / `code-quote`, y la incursión a VS Code es **un solo bloque al final de la sección** que ya verifica en vivo lo que la audiencia vio.
- **Slides info-densos pero todo texto relevante.** Cada slide carga información útil — tablas, code blocks con archivos reales, jerarquías visuales — sin bullet lists planas. Memorias del profesor que aplican: no bullet-point slides, no jargon ni meta-narration en hooks, no anglicismos como "payoff", inglés para términos técnicos (status code, path, schema, etc.), no meta-referencias al curso ("esta semana", "esta clase").

## Estructura final del deck

| # | Sección | Estado |
|---|---------|--------|
| §1 | De escribir a actuar | Sin cambios |
| §2 | El loop — pensar, actuar, observar | Sin cambios |
| §3 | Las tres ingenierías | Sin cambios |
| §4 | Context engineering | Sin cambios |
| §5 | Harness engineering | Sin cambios |
| §6 | Claude Code es ese loop | Sin cambios (tracker neutral queda colgado, aceptado) |
| §7 | **CLAUDE.md y memoria automática** | **Rediseñada** |
| §8 | **Rules (`.claude/rules/`)** | **Rediseñada** |
| §9 | **settings.json** | **NUEVA** |
| §10 | **Permisos** | **NUEVA** (era sub-tema de §11) |
| §11 | **Skills y slash commands** | **Rediseñada** |
| §12 | **Sub-agents** | **Rediseñada** (era §10) |
| §13 | **Plan mode (+ permission modes)** | **Rediseñada** (era §11) |
| §14 | El trabajo final | Sin cambios (era §12) |

## Especificación de cada sección rediseñada

Cada sección abajo lista los seis bloques de la plantilla. El contenido de cada bloque es el *qué tiene que estar*, no la redacción literal — esa la produce el pipeline `slide-generation` cuando se invoque.

### §7 — CLAUDE.md y memoria automática

- **Qué es:** archivos markdown leídos en cada sesión antes del primer mensaje del usuario; texto del profesor inyectado en la ventana de contexto.
- **Dónde vive:** 4 niveles concatenados:
  - Managed policy (admin, macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux/WSL `/etc/claude-code/CLAUDE.md`, Windows `C:\Program Files\ClaudeCode\CLAUDE.md`)
  - User (`~/.claude/CLAUDE.md`)
  - Project (`./CLAUDE.md` o `./.claude/CLAUDE.md`)
  - Local (`./CLAUDE.local.md`, va al `.gitignore`)
- **Cuándo se carga:** arranque de cada sesión. Caminata hacia arriba desde el CWD recolectando cada CLAUDE.md encontrado. CLAUDE.md de subdirectorios se cargan bajo demanda (al leer archivos de ese subdir).
- **Cómo se usa:**
  - `@ruta/al/archivo` para imports (recursivo hasta 5 niveles).
  - Recomendación: <200 líneas por archivo.
  - Comentarios HTML (`<!-- ... -->`) se descartan antes de inyectar al contexto — útiles para notas a otros mantenedores.
- **Casos límite / confusiones:**
  - Contradicciones entre niveles ≠ error; producen comportamiento impredecible. Hay que revisar y limpiar.
  - **`@import` no ahorra contexto.** Los archivos importados se expanden y se inyectan igual.
  - **Auto memory.** Sistema distinto, escrito por Claude, no por el profesor. Vive en `~/.claude/projects/<project>/memory/`. Carga las primeras 200 líneas o 25 KB de `MEMORY.md` al inicio (lo que se alcance primero). Auditable con `/memory`. Local a la máquina del usuario.
- **Demo VS Code (único bloque):**
  - Abrir el repo demo (`semanas/04/demo-repo/`) con un `CLAUDE.md` raíz ya escrito (mostrado en slides previos).
  - Ejecutar `/memory` en la sesión — mostrar la lista con los niveles efectivamente cargados (user `~/.claude/CLAUDE.md` + project `./CLAUDE.md`).
  - Ejecutar `/context` si está disponible para mostrar el delta de la ventana atribuible a CLAUDE.md.
  - Mostrar la carpeta de auto memory `~/.claude/projects/<demo-repo>/memory/` con `MEMORY.md` si tiene contenido; si no, explicar que aparece después de que Claude aprenda algo.
  - **Plan B** si `/context` no da el detalle: solo `/memory` lista las fuentes, suficiente para el punto.

### §8 — Rules (`.claude/rules/`)

- **Qué es:** archivos `.md` modulares de instrucciones, organizables por tema (a diferencia del CLAUDE.md monolítico).
- **Dónde viven:**
  - `.claude/rules/` (proyecto, versionado)
  - `~/.claude/rules/` (user, todos los proyectos)
  - Subdirectorios descubiertos recursivamente (`rules/backend/`, `rules/testing/`)
- **Cuándo se cargan:**
  - Sin frontmatter YAML: arranque de cada sesión (igual costo que CLAUDE.md de proyecto).
  - Con frontmatter `paths: [...]` y globs: **path-scoped** — solo cuando Claude toca un archivo que matchea el glob.
- **Cómo se usa:**
  - Ejemplo concreto: `.claude/rules/code-style.md`, `testing.md`, `security.md` (organización por tema).
  - Frontmatter YAML con `paths: ["src/api/**"]`.
  - Globs soportados: `**/*.py`, `backend/**/*.{py,yaml}`, expansión de llaves.
- **Casos límite / confusiones:**
  - **No es `.cursorrules`** — mecanismo distinto, no compatible. Si llegan tutoriales que lo mezclan, están confundidos.
  - Sin `paths:`, una rule cuesta lo mismo que CLAUDE.md. La ventaja es **organizativa**, no de costo.
  - El trigger es leer un archivo que matchee, no cualquier tool — Edit, Read o Write sobre el archivo activan la rule.
- **Demo VS Code (único bloque):**
  - Mostrar el árbol `.claude/rules/` con los 4 archivos: `code-style.md`, `testing.md`, `security.md`, `api.md`.
  - Abrir `api.md` con frontmatter `paths: ["backend/**/*.py"]`.
  - Ejecutar `/memory` antes de cualquier toque a archivos — `api.md` no aparece.
  - Pedirle a Claude que lea un archivo de `frontend/`. Repetir `/memory` — `api.md` sigue sin aparecer.
  - Pedirle a Claude que lea `backend/routers/users.py`. Repetir `/memory` — `api.md` ahora aparece cargada.
  - **Plan B:** si `/memory` no muestra el detalle suficiente, demostrar por comportamiento — la rule prescribe un comentario JSDoc-like al inicio de cada endpoint; mostrar que Claude lo agrega solo cuando edita archivos en `backend/`.

### §9 — `settings.json` (configuración del runtime)

- **Qué es:** archivo JSON que configura el runtime de Claude Code. **No son instrucciones para el agente** (eso es CLAUDE.md/rules) — son parámetros del programa que envuelve al LLM: modelo, hooks, permisos, environment.
- **Dónde vive:**
  - `~/.claude/settings.json` (user)
  - `.claude/settings.json` (proyecto, versionado)
  - `.claude/settings.local.json` (proyecto, **va al `.gitignore`**)
  - Managed enterprise (admin, paths como CLAUDE.md managed)
- **Cuándo se carga:** arranque. Merge entre niveles.
- **Cómo se usa:**
  - Campos típicos: `model`, `env`, `permissions`, `hooks`, `includeCoAuthoredBy`, `cleanupPeriodDays`, `permissionMode`.
  - Slide-walkthrough campo por campo de un `settings.json` real del repo demo.
- **Casos límite / confusiones:**
  - Precedencia: managed > local > project > user para resolver overlaps; los niveles más altos pueden bloquear escalas más bajas en permisos.
  - **`.local.json` siempre al `.gitignore`** — la convención: lo que es específico de tu máquina o tu identidad va ahí.
  - No confundir con `mcp.json` (config de servidores MCP, mecanismo distinto, se ve en otra clase).
  - `permissions` es el campo más impactante; se desarrolla en §10.
- **Demo VS Code (único bloque):**
  - Abrir los 3 archivos de settings simultáneamente: `~/.claude/settings.json` (user), `.claude/settings.json` (project), `.claude/settings.local.json` (local).
  - Cambiar `model` en uno de los niveles. Mostrar que toma efecto en la próxima sesión (o con un `/restart` si existe).
  - Mostrar `cleanupPeriodDays` para hablar de retención.
  - **Plan B:** si no hay diferencia visible inmediata, mostrar la convención de qué va en cada archivo y por qué el `local.json` debe estar en `.gitignore` (probar abriendo `.gitignore` y mostrando la entrada).

### §10 — Permisos (control de tools)

- **Qué es:** sistema que decide qué tools puede ejecutar Claude **sin pedir confirmación**.
- **Dónde viven:** `permissions` dentro de `settings.json` (cualquier nivel). Comando interactivo `/permissions` para ajustar durante una sesión.
- **Cuándo se evalúan:** antes de cada tool call.
  - Si matchea un `deny` → bloqueado.
  - Si no matchea `deny` y matchea un `allow` → ejecuta sin preguntar.
  - Si solo matchea `ask` o nada → pide confirmación.
  - **`deny` tiene precedencia sobre `allow`.**
- **Cómo se usa:**
  - Sintaxis `Tool(pattern)`.
  - Ejemplos del repo demo:
    - `"Bash(uv run pytest)"` (allow)
    - `"Bash(uvicorn backend.main:app *)"` (allow con wildcard)
    - `"Edit(./backend/**)"` (allow)
    - `"Read(./.env)"` (deny)
    - `"WebFetch(domain:github.com)"` (allow)
  - Slide-walkthrough de un bloque `permissions` real con allow / deny / ask separados visualmente.
- **Casos límite / confusiones:**
  - **Permission modes** como overlay sobre las listas: `default`, `acceptEdits`, `plan`, `bypassPermissions`. Se mencionan acá brevemente; `plan` se desarrolla en §13.
  - La sintaxis `Bash(*)` no existe — hay que ser explícito sobre el comando o patrón.
  - Default = preguntar, no negar (modo `default`).
  - Wildcards `*` matchean argumentos pero no a través de `;`/`&&` (no se puede colar otro comando).
- **Demo VS Code (único bloque):**
  - Sesión nueva sin permisos configurados. Pedirle a Claude que corra los tests: aparece el prompt "¿permitir Bash `uv run pytest`?".
  - Negar el prompt. Mostrar `/permissions` y agregar el comando a `allow`.
  - Repetir la corrida — ahora pasa sin prompt.
  - Cerrar agregando un `deny` para `Read(./.env)` y mostrar que es bloqueado.
  - **Plan B:** si el flujo no coopera, mostrar el `.claude/settings.json` con bloque `permissions` completo y narrar las reglas; el comportamiento se sostiene con la lectura.

### §11 — Skills y slash commands

- **Qué es:**
  - **Skill** = procedimiento completo (fases, verificaciones, anti-patterns) que se invoca cuando hace falta.
  - **Slash command** = atajo. Puede invocar una skill o solo ejecutar instrucciones inline.
  - **Skill ≠ slash command** — distinción central de la sección.
- **Dónde viven:**
  - Skills: `.claude/skills/<nombre>/SKILL.md` (proyecto) + `~/.claude/skills/<nombre>/` (user) + plugins.
  - Slash commands: `.claude/commands/<nombre>.md` (proyecto) + `~/.claude/commands/<nombre>.md` (user) + plugins.
- **Cuándo se cargan:**
  - **Skills no están en el contexto al arranque.** Solo nombre + descripción aparecen al inicio. La skill entra cuando se invoca explícitamente o cuando la descripción matchea la tarea por relevancia.
  - Slash commands se muestran en autocomplete con `/`, no consumen contexto hasta invocación.
- **Cómo se usan:**
  - SKILL.md con frontmatter (`name`, `description`); archivos auxiliares (`references/`, plantillas, anti-patterns).
  - Slash command file: instrucciones que pueden invocar una skill o ejecutar acciones inline.
  - Ejemplo concreto y meta: `tools/skills/slide-generation/` + `.claude/commands/build-class.md` — este último solo invoca la skill. El procedimiento vive en la skill, no en el comando.
- **Casos límite / confusiones:**
  - Algunos slash commands no invocan skills (`/memory`, `/context`, `/permissions`).
  - El frontmatter `description` de la skill es lo que Claude lee para decidir si activarla por relevancia: tiene que ser preciso ("Use when X" no "X").
  - Skills pueden tener checklists; el flow es "invoco → leo el SKILL.md → ejecuto los pasos".
- **Demo VS Code (único bloque):**
  - Skill chica en el repo demo: una que agregue un endpoint REST con su test de smoke (~40 líneas en SKILL.md).
  - Sesión nueva. Ejecutar `/context` — la skill no aparece referenciada.
  - Invocar la skill (vía `/agregar-endpoint <recurso>` o describiendo la tarea).
  - Mostrar que Claude empieza a seguir las fases definidas en el SKILL.md.
  - Cerrar comparando: la misma tarea sin la skill = Claude inventa el flow; con la skill = sigue el procedimiento documentado.
  - **Plan B:** si la skill no se activa por relevancia, usar el slash command que la invoca directo.

### §12 — Sub-agents

- **Qué es:** instancia separada del loop con su propia ventana de contexto. Mismo LLM + loop + tools + entorno instanciado aparte para una sub-tarea. Al padre solo le vuelve el resultado final.
- **Dónde viven:**
  - `.claude/agents/<nombre>.md` (proyecto)
  - `~/.claude/agents/<nombre>.md` (user)
  - Plugins (varios sub-agents vienen built-in: `Explore`, `Plan`, etc.)
- **Cuándo se invocan:** el supervisor llama el tool `Agent` con un `subagent_type`. Algunas skills lo hacen automático.
- **Cómo se usa:**
  - Definición con frontmatter: `name`, `description`, `tools` (lista restringida — el sub-agent NO tiene acceso a todas las tools por default), `model` opcional.
  - El cuerpo del archivo es el system prompt del sub-agent.
  - Llamada paralela: enviar múltiples `Agent` calls en una sola respuesta para que corran concurrentemente.
- **Casos límite / confusiones:**
  - **No es "otra IA"** — es la misma lógica, aislada.
  - El padre recibe solo el resultado, no el razonamiento intermedio → la delegación no exime de supervisar.
  - Paralelización es beneficio secundario; el motivo principal es proteger el contexto del padre.
  - El sub-agent puede leer 50 archivos y razonar mil tokens, todo vive en su ventana y desaparece al terminar.
- **Demo VS Code (único bloque):**
  - Dos versiones de la misma pregunta — "¿dónde se maneja la auth en este repo?":
    1. Inline: pedirle a Claude que busque. `/context` después: la ventana del padre tiene los archivos leídos.
    2. Delegada: invocar el `Explore` sub-agent con la misma pregunta. `/context` después: el padre solo tiene el resumen, no los archivos.
  - Cerrar mostrando un sub-agent custom en `.claude/agents/researcher.md` definido para el repo demo (o usar `Explore` directo si la skill `Explore` ya cubre el caso).
  - **Plan B:** si la diferencia en `/context` no es dramática, narrar la lógica con el archivo `.claude/agents/researcher.md` abierto y mostrar `tools:` restringido.

### §13 — Plan mode (+ permission modes)

- **Qué es:** modo de operación que **separa "pensar" de "actuar"**. Claude puede leer, buscar, razonar — pero no puede escribir, editar ni ejecutar comandos con efecto hasta que el supervisor aprueba el plan.
- **Dónde vive:** uno de los 4 permission modes:
  - `default` — pregunta cuando es necesario
  - `acceptEdits` — auto-acepta Edit/Write (no Bash)
  - `plan` — solo lectura hasta aprobar
  - `bypassPermissions` — sin gates (peligroso)
- **Cuándo se activa:**
  - Al arranque: flag `--permission-mode plan` o `permissionMode: "plan"` en `settings.json`.
  - Durante la sesión: `Shift+Tab` cicla entre modos. La UI muestra el modo activo.
- **Cómo se usa:**
  - Activar plan mode → describir la tarea → Claude propone el plan → revisarlo, corregirlo, y aprobar con `ExitPlanMode`.
  - El plan es el contrato: una vez aprobado, Claude ejecuta sin volver a parar (a menos que toque un `deny`).
- **Casos límite / confusiones:**
  - **Cuándo elegir cada modo** (decisión del supervisor, depende de reversibilidad):
    - `plan` para tareas grandes, multi-archivo, cuando no estás seguro del enfoque.
    - `acceptEdits` para tareas chicas con tests que corren rápido.
    - `bypassPermissions` solo en containers/sandboxes efímeros.
    - `default` en el resto.
  - Plan mode es la defensa más barata contra la deriva (corregís antes de que el loop acumule consecuencias).
  - Plan mode no protege contra `Bash` riesgoso si tras aprobar el plan algo lo ejecuta; es un freno deliberado, no un sandbox.
- **Demo VS Code (único bloque):**
  - Tarea de refactor multi-archivo en el repo demo: "extraé el middleware de auth de cada router a un módulo compartido".
  - Primera corrida en modo `default`: Claude empieza a editar archivos casi de inmediato. Cancelar.
  - Segunda corrida con `Shift+Tab` hasta llegar a `plan` (la UI muestra el modo): pedirle la misma tarea. Claude responde con un plan, no edita.
  - Revisar el plan, corregir si hace falta (e.g., "no toques `users.py`"), aprobar.
  - Claude ahora ejecuta la versión aprobada.
  - **Plan B:** si la UI de modo no es visible en la grabación, narrar el cambio y mostrar el banner / indicador. La diferencia conductual ("editó vs propuso") se ve igual.

## Repo demo: `semanas/04/demo-repo/`

### Stack y forma

- **Backend:** Python con FastAPI. API REST.
- **Documentación de API:** `openapi.yaml` versionado (puede ser autogenerado por FastAPI y exportado, o escrito a mano — decisión del plan de implementación).
- **Frontend:** mínimo, suficiente para interactuar con algunos endpoints. Vanilla JS/HTML o algo equivalente (no se necesita SPA framework; la decisión final la toma el plan de implementación).
- **Tests:** pytest, suite mínima que pase.

### Estructura propuesta

```
semanas/04/demo-repo/
├── README.md
├── pyproject.toml
├── openapi.yaml
├── .env.example
├── .gitignore
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── users.py
│   │   └── posts.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── db/
│   │   ├── __init__.py
│   │   └── client.py
│   └── schemas/
│       ├── __init__.py
│       └── models.py
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── tests/
    ├── test_users.py
    └── test_posts.py
```

### Mecánica del demo: Opción 1 (estado final committed + narrativa de construcción)

**El repo committed al repositorio del curso tiene el `.claude/` completo en estado final desde el inicio.** El framing pedagógico de "lo vamos construyendo sección a sección" vive **en los slides**, no en el estado real del disco.

| Sección | Pieza que la sección presenta (ya existe en el repo committed) |
|---------|-----------------------------------------------------------------|
| §7  | `CLAUDE.md` raíz (instrucciones del proyecto) + referencia a `~/.claude/CLAUDE.md` que ya existe en la máquina del profesor |
| §8  | `.claude/rules/code-style.md`, `testing.md`, `security.md` (siempre cargadas), `api.md` con `paths: ["backend/**/*.py"]` (condicional) |
| §9  | `.claude/settings.json` (project) y `.claude/settings.local.json` (gitignore) — campos `model`, `env`, `hooks` chico |
| §10 | Bloque `permissions` dentro del `.claude/settings.json` |
| §11 | Una skill chica + un slash command que la invoca |
| §12 | Un sub-agent custom en `.claude/agents/researcher.md` (o se usa `Explore` built-in) |
| §13 | Sin archivo nuevo — se usa `--permission-mode plan` al arranque y `Shift+Tab` durante la sesión |

Durante la clase, en cada sección el profesor:
1. Muestra el archivo de la pieza en los slides (vía `code-walkthrough`) — la audiencia ve el contenido sin cambiar de share.
2. Al final de la sección, una sola incursión a VS Code para abrir ese archivo (ya existente) y correr los comandos de verificación (`/memory`, `/context`, `/permissions`, etc.).

No hay creación de archivos en vivo durante la clase. La narrativa "lo agregamos cuando empezamos a configurar este repo" la hacen los slides.

### Ubicación del repo demo

El repo demo se crea y se mantiene en `semanas/04/demo-repo/` dentro de este repositorio del curso — es la **fuente canónica** para mantenimiento y versionado.

**Antes de cada clase**, el profesor copia el directorio fuera del repositorio del curso (a una carpeta independiente en su máquina) y lo abre desde esa ubicación en VS Code. Razón: aislar el repo demo del repo del curso así Claude Code no ve el `CLAUDE.md` ni la configuración del curso cuando está corriendo en el demo. Esto también permite que `git init` corra limpio en la copia.

**Implicación operacional:** los slides nunca referencian la ruta `semanas/04/demo-repo/` literalmente. Las rutas mostradas en slides son relativas a la raíz del repo demo (e.g., `./CLAUDE.md`, `.claude/rules/api.md`).

### Decisiones que toma el plan de implementación

- Stack exacto del frontend (vanilla vs lit-html vs preact build-less).
- Si `openapi.yaml` se escribe a mano o se exporta del FastAPI.
- Si la skill de §11 va al `.claude/skills/` del repo demo o se hace una skill juguete inline.
- Si el sub-agent custom de §12 hace falta o alcanza con `Explore` built-in.
- Datos de seed para el frontend (mock vs DB real con SQLite en memoria).

## Transiciones entre secciones (un slide cada una)

- §7 → §8: CLAUDE.md cuesta contexto siempre. Si querés organización modular o costo cero hasta que aplica, hay otra cosa.
- §8 → §9: Hasta acá, instrucciones (markdown). Lo que viene es config (JSON) — no le decís al agente qué hacer, le decís al runtime cómo correrlo.
- §9 → §10: El campo más impactante de `settings.json` es `permissions`. Vale una sección propia.
- §10 → §11: Los permisos limitan qué tools usa el agente. Las skills hacen lo contrario: le dan procedimientos que no traía.
- §11 → §12: Las skills aíslan un procedimiento. Los sub-agents aíslan un loop entero.
- §12 → §13: Sub-agents aíslan el contexto. Plan mode hace algo distinto: detiene el loop antes de actuar.
- §13 → §14: Tenés el runtime. La última sección cierra el arco completo del curso.

## Slide budget

| Sección | Slides | Notas |
|---------|--------|-------|
| §7 CLAUDE.md + auto memory | 10 | Incluye 1 slide intro a la plantilla de 5 preguntas (abre Parte 2) |
| §8 Rules | 9 | |
| §9 settings.json | 9 | |
| §10 Permisos | 11 | Más slides por matriz allow/deny/ask + permission modes intro |
| §11 Skills + slash commands | 11 | Distinción skill ≠ slash command necesita slides propios |
| §12 Sub-agents | 9 | |
| §13 Plan mode + permission modes | 11 | Los 4 modes + criterios |
| **Total Parte 2 nueva** | **~70** | |

Cada sección además tiene su slide de transición al cierre.

## Outputs concretos del rediseño

Cuando este spec → plan → implementación se ejecute, los outputs son:

1. **`semanas/04/source_material/`** — siete archivos nuevos o reescritos:
   - `07-CLAUDE-md.md` (reescrito)
   - `08-rules.md` (reescrito; auto memory ya integrada en §7)
   - `09-settings-json.md` (NUEVO)
   - `10-permisos.md` (NUEVO; o reescrito si conviene reciclar partes del actual `11-plan-mode-y-control.md`)
   - `11-skills-y-slash-commands.md` (reescrito)
   - `12-sub-agents.md` (reescrito desde el actual `10-sub-agents.md`)
   - `13-plan-mode.md` (reescrito desde el actual `11-plan-mode-y-control.md`)
   - El archivo `12-trabajo-final.md` se renombra a `14-trabajo-final.md`, sin cambios de contenido.
   - `index.md` actualizado.

2. **`semanas/04/spine.md`** — actualizado: Parte 2 lista §6–§13, §14 = trabajo final, dispositivos pedagógicos reflejan la plantilla de 5 preguntas en lugar del lens-tracker para Parte 2. Parte 1 sin cambios. Nota explícita sobre la decisión de aceptar el dangling del tracker en §6.5.

3. **`semanas/04/demo-repo/`** — repo FastAPI + frontend chico + openapi.yaml + tests, con la estructura descrita arriba. **Sin `.claude/`** — esa estructura se va armando en clase, no en el repo committed.

4. **`semanas/04/plan.md`** — regenerado o ampliado por el pipeline `slide-generation` cuando se ejecute Phase 2 sobre el nuevo spine.

5. **`semanas/04/slides/_section-{7..13}.html`** — slides nuevos generados por Phase 3 del pipeline. Reemplazan los actuales `_section-7..11.html`. `_section-12.html` se renombra al nuevo `_section-14.html`.

## Open questions / decisiones diferidas al plan

- ¿Renombre de archivos `_section-N.html` se hace por copia o por git mv? (default: git mv para preservar history.)
- ¿El `openapi.yaml` se escribe a mano o se exporta del FastAPI? (default: exportado, más realista.)
- ¿La skill de §11 vive en `.claude/skills/` del repo demo (recomendado por simetría) o en `tools/skills/` del repo de la clase?
- ¿Cuántos endpoints tiene el repo demo? (default: 2 recursos × CRUD básico → ~8 endpoints; suficiente para que `paths:` tenga material, no tanto que cargue.)

Estas decisiones las cierra el plan de implementación, no este spec.
