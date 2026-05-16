# Diseño — Source material Semana 04: Fundamentos de Agentic AI + Claude Code

**Fecha:** 2026-05-16
**Output esperado:** `semanas/04/source_material/` (index.md + 12 archivos numerados) que la fase `/build-class` convierte en slides.
**Reemplaza:** el plan viejo de `semanas/04/source_material/index.md` (Cursor/Antigravity/full-stack), descartado de común acuerdo.

## Contexto del curso

Curso de 8 semanas sobre desarrollo de software asistido por IA. Estado relevante:

- **Semana 1 (Karpathy):** modelo mental del LLM — tokens, **ventana de contexto = working memory**, **tool use** (tokens especiales → search → resultado vuelve al contexto), parámetros vs contexto, alucinaciones.
- **Semanas 2-3:** rol **supervisor arquitectónico** — nombrar piezas (frontend/backend) y dictar contratos a una IA que *escribe pero no actúa* (ChatGPT Canvas / openapi.yaml).
- **Continuidad con S2-3 (genérica, sin bridge específico):** venís dirigiendo una IA que *escribe* código — vos corrés, leés el error, volvés a pedir el arreglo. La S4 **no** depende de ninguna línea de cierre de la S3 ni del yaml; abre por sí sola con el cambio de paradigma (la IA ahora cierra ese loop sola).
- **Semanas 5-8:** ideación/prompting, refactor+CLI, calidad/seguridad/testing, Demo Day. No condicionan esta clase (el plan de las otras semanas puede moverse dentro de cierto rango).

## Decisiones de la sesión de brainstorming

| Tema | Decisión |
|------|----------|
| Anchor | **No** hay demo único grande ni el trabajo final como eje. El anchor es la progresión conceptual + **mini-demos en vivo** embebidas. |
| Reparto | **50/50** parte conceptual (agentic agnóstico) / parte Claude Code. Duración ~2.5-3hs, target ~60-65 slides. |
| Sinergia S1 | **Callback fuerte + recontextualizar**: asumir que vieron ventana de contexto y tool use; callback corto y recontextualizar en el mundo agentic. Poco re-teach. |
| "Sin productos" en parte 1 | **Flexible**: categorías genéricas OK ("un IDE con chat", "un CLI agentic"), incluido el contraste autocompletado-vs-agentic como paradigmas. Marcas concretas recién en parte 2. |
| Scope Claude Code | CLAUDE.md jerárquico + `.claude/rules/` (path-scoped) + auto memory + skills + slash commands (incl. los del repo) + sub-agents + plan mode/permisos + gestión de contexto. Hooks/MCP **solo nombrados al pasar**. |
| Mini-demos | **En vivo**; el slide es solo el guión/beat sheet (formato del demo de S3: qué hago / qué digo / qué mirar / plan B). |
| Bloque trabajo final | **Solo framing/motivación** (~20 min), sin condiciones administrativas. El deliverable (frontend+backend de algo, libre o semi-libre) se decide después y **no** condiciona el contenido. |

## Enfoque elegido: A — "El loop y la memoria"

**Hilo conductor (whole-week through-line):**

> La semana 1 te dio las piezas del modelo (tokens, ventana de contexto = working memory, tool use). Las semanas 2-3 te enseñaron a dirigir: nombrar piezas y dictar contratos a una IA que escribe pero no actúa. La semana 4 cierra el salto: la IA ahora **actúa** — corre en un loop, usa herramientas, modifica tu repo. Para dirigir algo que actúa solo necesitás entender dos cosas: **el loop que ejecuta** y **la memoria con la que trabaja**. Esos dos conceptos (parte 1, agnóstica) son la lente con la que después se entiende Claude Code (parte 2): cada CLAUDE.md, cada rule, cada skill, cada sub-agent, cada slash command, plan mode — todos **actúan sobre el loop o sobre el contexto**.

**Disciplina del enfoque (tomada del enfoque C):** ninguna feature de la parte 2 se presenta como ítem de catálogo. Cada una entra respondiendo una pregunta-lente: *"¿esto cambia **cómo corre el loop**, o cambia **qué hay en el contexto**?"*. Esto fuerza el mapeo explícito parte 2 → parte 1. (No se usa el término "palanca"; se nombra directamente el eje sobre el que actúa.)

**Por qué A y no B/C:** B ("de dictar a delegar") da continuidad con S2-3 pero sinergia débil con la mecánica de S1 (contexto/tools), que es justo lo que se pidió enfatizar. C ("anatomía") es consistente con la pedagogía del curso pero tiende a catálogo de features. A maximiza la sinergia con S1, hace de las mini-demos "ventana de contexto antes/después" el clímax natural de cada beat, y le da a la parte 2 un orden no arbitrario. Se conserva la continuidad con el rol supervisor de S2-3 sin que el spine dependa de eso.

## Mapa de secciones (`source_material/`)

Mismo esquema que las otras semanas: `index.md` + archivos numerados. Budget de slides **provisional**; la fase spine de `/build-class` lo afina (target global ~60-65; la parte 1 se comprime ahí si hace falta).

### Parte 1 — Fundamentos agentic (agnóstico, ~50%)

| # | Archivo | Núcleo | Actúa sobre | Slides |
|---|---------|--------|-------------|--------|
| 1 | `01-de-escribir-a-actuar.md` | Apertura autocontenida: *vos eras el loop* (escribías → corrías → leías el error → volvías al chat); hoy la IA cierra el loop sola (escribe, ejecuta, lee el error, corrige, reintenta) sin vos en cada vuelta. Contraste de paradigmas: sugerencia/autocompletado en línea **vs** agente que planifica y ejecuta en loop (sin marcas). Por qué dirigir algo autónomo exige un modelo mental nuevo. | — | 5-6 |
| 2 | `02-el-loop-agentic.md` | ReAct: pensar → actuar → observar → repetir hasta *done*. Agente = LLM + loop + tools + entorno. Por qué un loop y no una respuesta única; goal y stop conditions. | El loop | 8-9 |
| 3 | `03-tools-las-manos.md` | **Callback fuerte S1** (tokens especiales → search → resultado al contexto). Recontextualizado: las tools ahora son leer/escribir archivos, correr comandos, ejecutar tests. La observación vuelve al contexto. | El loop | 7-8 |
| 4 | `04-la-ventana-es-todo.md` | **Callback fuerte S1** (working memory vs parámetros). El corazón. Cada thought/action/observation llena la ventana; la ventana es finita; context rot / "se olvidó lo que le pedí". Gestionar el contexto = LA habilidad del director. **Adelanta** que en la parte 2 hay tres estrategias para gestionar esto (payoff en §8). | El contexto | 9-10 |
| 5 | `05-cuando-el-agente-falla.md` | Modos de falla *nuevos* porque la IA actúa: loop infinito, deriva de objetivo, alucinar tools, envenenar su propio contexto. Rol del supervisor: cuándo intervenir. Conecta S1 (alucinaciones) y S3 (leer evidencia). Lean. | Ambas | 5-6 |

### Parte 2 — Claude Code (concreto, ~50%)

| # | Archivo | Núcleo | Propiedad de contexto | Slides |
|---|---------|--------|------------------------|--------|
| 6 | `06-claude-code-es-el-loop.md` | Aterriza el modelo: Claude Code **es** ese loop. Lo que se ve en pantalla mapeado a thought/action/observation. | El loop | 5-6 |
| 7 | `07-CLAUDE-md-jerarquico.md` | Jerarquía managed → user (`~/.claude`) → proyecto (`./CLAUDE.md` o `./.claude/CLAUDE.md`) → subdir. Orden de carga (raíz→cwd; `CLAUDE.local.md` se appendea último; subdir carga on-demand). `@import` recursivo (≤5 hops, rel/abs). Comentarios HTML se strippean. **Propiedad clave: siempre cuesta contexto, incluso los imports.** | Siempre cargado | 7-8 |
| 8 | `08-rules-y-auto-memory.md` | (a) `.claude/rules/*.md` modular + **path-scoped** (`paths:` glob frontmatter) → entra al contexto solo al tocar archivos que matchean; `~/.claude/rules/` a nivel usuario. (b) **auto memory**: Claude escribe `MEMORY.md` + topic files solo; primeras 200 líneas / 25KB cargadas; topic files on-demand. **Slide-payoff: la tricotomía** — *siempre cargado* (CLAUDE.md, @import) vs *condicional* (rules path-scoped, skills) vs *autocurado* (auto memory). Cierra el "adelanto" del §4. | Condicional / autocurado | 7-8 |
| 9 | `09-skills-y-slash-commands.md` | Skills = procedimientos invocables on-demand (no en contexto hasta invocarse → protegen el contexto). Slash commands = atajos, incl. los del repo (`/build-class`). Distinción skill (carga condicional) vs rule (carga al matchear path) vs CLAUDE.md (siempre). | El contexto / el loop | 6-7 |
| 10 | `10-sub-agents.md` | Actúa sobre **el contexto** (aislamiento): un sub-agent corre su propio loop con su propia ventana y devuelve solo el resultado → no infla el contexto del padre. Paralelización. | El contexto | 6-7 |
| 11 | `11-plan-mode-y-control.md` | Actúa sobre **el loop** (control): plan mode (pensar antes de actuar), permisos (gate antes de cada action). El supervisor decide cuánta autonomía. Hooks/MCP nombrados al pasar como "más controles del loop/contexto". | El loop | 5-6 |

### Cierre

| # | Archivo | Núcleo | Slides |
|---|---------|--------|--------|
| 12 | `12-trabajo-final.md` | Framing/motivación (~20 min). Qué van a construir (frontend+backend de algo), por qué *este* es el momento (ya tienen modelo + rol + runtime), cómo conecta todo lo aprendido. **Sin** condiciones administrativas (esas van verbal/otro canal). | 8-10 |

## Set de mini-demos en vivo

Cada slide-guión sigue el formato del demo de S3: **qué hago / qué digo / qué tienen que mirar / plan B si no coopera**. Anclados a su sección y al eje (loop / contexto) que ilustran.

| # | Demo | Sección | Qué hace tangible |
|---|------|---------|--------------------|
| D1 | **El loop desnudo** — tarea chica, narrar cada thought→action→observation contra la pizarra del loop ReAct. | §2 / §6 | El loop existe y es visible. |
| D2 | **La observación entra al contexto** — pedir algo que obligue a leer un archivo; ver el resultado de la tool entrar al contexto. | §3 | Callback literal a S1: la tool refresca la working memory. |
| D3 | **La ventana antes/después de CLAUDE.md** + **`/memory` revela la jerarquía** — repo limpio, `/context`; agregar CLAUDE.md; reiniciar; `/memory` lista las fuentes cargadas. | §7 | Contexto persistente; la jerarquía deja de ser un diagrama. |
| D4 | **Context rot + reset + qué sobrevive a `/compact`** — sesión larga que depende de una instrucción inicial, se degrada; `/compact`; CLAUDE.md de raíz se re-inyecta pero una instrucción dada solo en chat se perdió. | §4 | "La ventana es finita" + qué persiste. |
| D5 | **Sub-agent aísla** — misma búsqueda inline vs. con sub-agent; comparar `/context` del agente principal. | §10 | Aislamiento de contexto, medible en pantalla. |
| D6 | **Skill on-demand** — la skill NO está en contexto hasta invocarla; invocarla; ver el costo aparecer recién ahí. | §9 | Skills protegen el contexto. |
| D7 | **Plan mode como freno** — misma tarea sin plan mode (actúa y se equivoca) vs. con plan mode (propone, se corrige antes de tocar un archivo). | §11 | Control sobre el loop, visible. |
| D8 | **Path-scoped rule aparece/desaparece** — rule con `paths: src/api/**`; `/context` sin ella; tocar archivo fuera del glob (ausente); tocar archivo que matchea → entra. | §8 | El control de contexto más limpio: contexto condicional. |
| D9 | **Auto memory en acción** — corregir a Claude; ver "Writing memory"; sesión nueva; lo recuerda sin tocar CLAUDE.md. | §8 | La memoria autocurada. |

## Puntos de confusión anticipados (a desarmar en el material)

- **"rules = .cursorrules"**: aclarar que `.claude/rules/` es un mecanismo propio de Claude Code (archivos modulares, opcionalmente path-scoped), distinto de `.cursorrules`. (Corrección de un error introducido durante el brainstorming.)
- **`@import` "ahorra contexto"**: NO. Los imports se expanden y cargan en launch igual que el CLAUDE.md que los referencia. Lo que ahorra contexto es el path-scoping de rules y las skills (carga condicional). Esta distinción es el corazón del §8.
- **CLAUDE.md como configuración dura**: es contexto, no enforcement. Para enforcement va settings/hooks. Mencionar al pasar en §7/§11.
- **Loop = una llamada al modelo**: no; el loop son múltiples turnos modelo↔tools hasta una stop condition. Reforzar en §2 con la pizarra.
- **Sub-agent = "otra IA"**: es el mismo agente corriendo un loop aislado con su propia ventana; lo que vuelve al padre es solo el resultado. Evitar la metáfora "otro empleado" si confunde.

## Fuera de alcance / diferido

- Hooks y MCP en profundidad (solo nombrados al pasar en §11 como controles adicionales del loop/contexto).
- Condiciones administrativas del trabajo final (equipos, fechas, criterios, entregables) — verbal/otro canal; el deliverable concreto se decide después.
- Otras herramientas concretas (Codex, Gemini CLI, Cursor) — la parte 1 las cubre como *categorías* genéricas; no hay tour de productos.
- Instalación/setup de Claude Code paso a paso (no es una clase práctica; el setup se resuelve en S5 según el plan vigente).
- Implementación real, base de datos, deploy, tests automatizados del trabajo final.

## Criterio de éxito (qué se lleva el alumno)

1. Puede explicar qué es un agente como **LLM + loop + tools + ventana de contexto**, y por qué el loop (no una respuesta única).
2. Entiende que la ventana de contexto es finita y que **gestionarla es la habilidad central** del que dirige un agente.
3. Reconoce los modos de falla nuevos (loop, deriva, alucinar tools, envenenar contexto) y cuándo intervenir como supervisor.
4. Puede ubicar cada mecanismo de Claude Code (CLAUDE.md, rules, skills, sub-agents, slash commands, plan mode) según **si actúa sobre el loop o sobre el contexto**, y distinguir *siempre cargado* vs *condicional* vs *autocurado*.
5. Sale con ganas y marco para el trabajo final (qué va a construir y por qué este es el momento).
