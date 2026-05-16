# Semana 04 Source Material — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Escribir los 13 archivos de `semanas/04/source_material/` (index.md + 12 archivos de contenido) que la fase `/build-class` convertirá en slides.

**Architecture:** Enfoque A "el loop y la memoria" (ver spec `docs/superpowers/specs/2026-05-16-semana-04-source-material-design.md`). Parte 1: fundamentos agentic agnósticos (§1-5). Parte 2: Claude Code como instancia concreta (§6-11). Cierre: framing trabajo final (§12). Cada archivo es **prosa**, no slides — sigue el formato de `semanas/03/source_material/`. Las 9 mini-demos viven como subsección "## Mini-demo en vivo" (beat-sheet) dentro del archivo de su sección.

**Tech Stack:** Markdown. Sin build ni tests automatizados — la verificación es un checklist editorial + un grep anti-filler runnable. El downstream (`/build-class` → spine → slides) está **fuera de alcance** de este plan.

---

## Convenciones (aplican a TODOS los archivos de contenido)

Tomadas de `tools/skills/slide-generation/voice-and-didactics.md` y del patrón de `semanas/03/source_material/`:

- **Voz:** español rioplatense, técnico-accesible, segunda persona ("podés", "fijate"), imperativo para acciones, preguntas retóricas para enganchar, primera persona plural para descubrimiento compartido.
- **Estructura:** `# Título` (sin numerar), prosa en párrafos cortos, subsecciones con `## Header` específico (nunca "Introducción"/"Resumen"). Modelo exacto: `semanas/03/source_material/01-backend-y-el-supervisor.md`.
- **Hook antes de explicación; why antes de what; capa sobre capa sin referencias hacia adelante** (salvo el "adelanto" explícito del §4 → §8, que es intencional).
- **Números concretos sobre abstracciones.** Una analogía solo si gana su lugar.
- **Prohibido:** vocabulario AI-filler ("revolucionario", "potenciar", "robusto", "leverage", "seamless", "increíble" como muletilla), emojis, em-dash más de uno por párrafo, texto placeholder, boilerplate de bienvenida, el término **"palanca"** (usar "actúa sobre el loop / el contexto").
- **Sin marcas en §1-5** (parte 1 agnóstica; categorías genéricas OK: "un CLI agentic", "un IDE con chat"). Marcas concretas recién en §6-12.
- Los archivos NO llevan `<aside class="notes">` ni HTML de slides — eso lo genera `/build-class`. Son prosa fuente.

## Mapeo mini-demo → archivo

| Demo | Archivo host | Subsección |
|------|--------------|------------|
| D1 El loop desnudo | `02-el-loop-agentic.md` | `## Mini-demo en vivo: el loop desnudo` (referenciada/reusada en §6) |
| D2 La observación entra al contexto | `03-tools-las-manos.md` | `## Mini-demo en vivo: la observación entra al contexto` |
| D4 Context rot + `/compact` | `04-la-ventana-es-todo.md` | `## Mini-demo en vivo: context rot y qué sobrevive a /compact` |
| D3 Ventana antes/después CLAUDE.md + `/memory` | `07-CLAUDE-md-jerarquico.md` | `## Mini-demo en vivo: la ventana antes y después` |
| D8 Path-scoped rule aparece/desaparece | `08-rules-y-auto-memory.md` | `## Mini-demo en vivo: la rule condicional` |
| D9 Auto memory en acción | `08-rules-y-auto-memory.md` | `## Mini-demo en vivo: auto memory` |
| D6 Skill on-demand | `09-skills-y-slash-commands.md` | `## Mini-demo en vivo: la skill on-demand` |
| D5 Sub-agent aísla | `10-sub-agents.md` | `## Mini-demo en vivo: el sub-agent aísla` |
| D7 Plan mode como freno | `11-plan-mode-y-control.md` | `## Mini-demo en vivo: plan mode como freno` |

Formato de cada beat-sheet (compacto, basado en `semanas/03/source_material/08-demo-en-vivo.md`): párrafo intro de qué muestra, lista de beats con **qué hago / qué digo (entre comillas) / qué tienen que mirar**, y un cierre **Plan B si no coopera**.

---

## Task 1: index.md

**Files:**
- Modify (overwrite): `semanas/04/source_material/index.md`

- [ ] **Step 1: Reescribir `index.md`**

Reemplazar el contenido actual (plan viejo Cursor/Antigravity) por la estructura del patrón de S2/S3: título, tabla de orden de lectura, hilo conductor. Contenido exacto a escribir:

```markdown
# Semana 4 — Fundamentos de Agentic AI y Claude Code

Este es el material fuente de la clase de Semana 4. La presentación reveal.js se genera con `/build-class` a partir de estos archivos.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-de-escribir-a-actuar.md](01-de-escribir-a-actuar.md) | De una IA que escribe a una que actúa | Apertura (~10 min) |
| 2 | [02-el-loop-agentic.md](02-el-loop-agentic.md) | El loop: pensar → actuar → observar | Fundamentos (~20 min) |
| 3 | [03-tools-las-manos.md](03-tools-las-manos.md) | Tools: las manos del agente (callback S1) | Fundamentos (~18 min) |
| 4 | [04-la-ventana-es-todo.md](04-la-ventana-es-todo.md) | La ventana de contexto es finita | Fundamentos (~22 min) |
| 5 | [05-cuando-el-agente-falla.md](05-cuando-el-agente-falla.md) | Modos de falla y el rol del supervisor | Fundamentos (~12 min) |
| 6 | [06-claude-code-es-el-loop.md](06-claude-code-es-el-loop.md) | Claude Code es ese loop, concreto | Claude Code (~12 min) |
| 7 | [07-CLAUDE-md-jerarquico.md](07-CLAUDE-md-jerarquico.md) | CLAUDE.md jerárquico (siempre cargado) | Claude Code (~18 min) |
| 8 | [08-rules-y-auto-memory.md](08-rules-y-auto-memory.md) | Rules path-scoped y auto memory | Claude Code (~20 min) |
| 9 | [09-skills-y-slash-commands.md](09-skills-y-slash-commands.md) | Skills y slash commands | Claude Code (~16 min) |
| 10 | [10-sub-agents.md](10-sub-agents.md) | Sub-agents: aislar contexto | Claude Code (~14 min) |
| 11 | [11-plan-mode-y-control.md](11-plan-mode-y-control.md) | Plan mode y control del loop | Claude Code (~12 min) |
| 12 | [12-trabajo-final.md](12-trabajo-final.md) | Trabajo final: framing y motivación | Cierre (~20 min) |

## Hilo conductor

La semana 1 te dio las piezas del modelo (tokens, ventana de contexto = working memory, tool use). Las semanas 2-3 te enseñaron a dirigir: nombrar piezas y dictar contratos a una IA que escribe pero no actúa. Esta semana cierra el salto: la IA ahora **actúa** — corre en un loop, usa herramientas, modifica tu repo. Para dirigir algo que actúa solo necesitás entender dos cosas: el loop que ejecuta y la memoria con la que trabaja.

Esos dos conceptos (parte 1, agnósticos) son la lente con la que después se entiende Claude Code (parte 2): cada CLAUDE.md, cada rule, cada skill, cada sub-agent, cada slash command, plan mode — todos actúan sobre el loop o sobre el contexto. La clase no es un tour de features: es entender dos cosas y ver cada herramienta como una forma de actuar sobre una de ellas.
```

- [ ] **Step 2: Verificar**

Confirmá: 12 filas en la tabla, links coinciden con nombres de archivo del plan, hilo conductor sin el término "palanca" y sin el bridge del yaml de S3. Correr el grep anti-filler global (Task 14, Step 1) más tarde lo cubre; acá solo revisión visual.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/index.md
git commit -m "docs(semana-04): index.md — estructura y hilo conductor"
```

---

## Task 2: 01-de-escribir-a-actuar.md (apertura, 5-6 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/01-de-escribir-a-actuar.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (del spec §1): apertura **autocontenida**, sin bridge del yaml de S3. Estructura sugerida:

- `# De escribir código a actuar sobre el código`
- Hook de apertura: *vos eras el loop*. Hasta ahora la IA escribía y vos hacías el ciclo a mano: pedías → copiabas → corrías → leías el error → volvías al chat → pedías el arreglo. Describí ese ciclo manual con un ejemplo concreto y cotidiano (un endpoint que devuelve 500; vos sos quien lee el log y vuelve a preguntar).
- `## Lo que cambia`: hoy la IA cierra ese loop sola — escribe, ejecuta, lee el error, corrige, reintenta, sin vos en cada vuelta. El cambio no es "escribe mejor": es que **actúa**.
- `## Dos paradigmas`: contraste conceptual sin marcas — (a) sugerencia/autocompletado en línea (la IA propone, vos seguís manejando el flujo); (b) agente que planifica y ejecuta en un loop (la IA maneja el flujo, vos supervisás). Mismo modelo abajo, relación distinta arriba.
- `## Por qué necesitás un modelo mental nuevo`: dirigir algo que actúa solo no es dirigir algo que solo escribe. Adelantá las dos cosas que hay que entender (el loop, la memoria) — son el mapa de la parte 1. Continuidad genérica con S2-3 (seguís siendo supervisor; cambia que ahora supervisás un proceso autónomo).
- Cierre: una frase que enmarque la clase ("hoy no aprendés una herramienta; aprendés cómo funciona la máquina que vas a dirigir el resto del curso").

Longitud: ~500-700 palabras. Sin mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Abre con hook (el ciclo manual), no con definición.
- [ ] Cero marcas de producto. Contraste de paradigmas presente y descrito como paradigmas.
- [ ] No menciona yaml, "IA local", ni "la próxima clase" como gancho de apertura.
- [ ] Adelanta loop + memoria como mapa de la parte 1.
- [ ] Voz segunda persona, sin AI-filler, sin "palanca".

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/01-de-escribir-a-actuar.md
git commit -m "docs(semana-04): §1 apertura — de escribir a actuar"
```

---

## Task 3: 02-el-loop-agentic.md (ReAct, 8-9 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/02-el-loop-agentic.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §2, actúa sobre: el loop). Estructura:

- `# El loop: pensar, actuar, observar`
- Hook: una sola respuesta del modelo no alcanza para "arreglá el bug" — ¿por qué? Porque el modelo no vio el error todavía. Necesita actuar y mirar el resultado antes de poder seguir.
- `## ReAct: razonar y actuar entrelazados`: el ciclo **pensar → actuar → observar → repetir** hasta una condición de corte. Explicá cada fase con un ejemplo concreto (tarea: "hacé que pasen los tests"): piensa (hipótesis), actúa (corre los tests / edita un archivo), observa (lee la salida), repite.
- `## Un agente = LLM + loop + tools + entorno`: las cuatro piezas. El LLM decide; el loop lo hace iterar; las tools le dan manos (se desarrolla en §3); el entorno es tu repo/terminal. Sin las cuatro no hay agente.
- `## Por qué un loop y no una respuesta`: comparar "pregunta → respuesta" (chat clásico) vs "objetivo → loop hasta lograrlo". El loop es lo que convierte un modelo de texto en algo que termina tareas.
- `## Goal y condiciones de corte`: el loop necesita saber cuándo parar (objetivo cumplido, límite de pasos, pide ayuda, falla). Sin condición de corte → el loop no termina (gancho a §5).
- Mini-demo (ver abajo).
- Cierre: el loop es el esqueleto; lo que el loop manipula es el contexto (gancho a §4).

`## Mini-demo en vivo: el loop desnudo` (D1):
> Intro: mostrar que el loop no es teoría — está pasando en pantalla, vuelta por vuelta.
> - **Beat 1.** Qué hago: dar una tarea chica y verificable (ej. "agregá un endpoint `GET /health` que devuelva `{"status":"ok"}` y probá que responde"). Qué digo: *"No le pedí que escriba código. Le pedí un resultado. Miren cómo se las arregla."* Qué mirar: la primera vuelta de pensamiento.
> - **Beat 2.** Qué hago: narrar en voz alta cada paso a medida que aparece, nombrándolo: *"esto es pensar… esto es actuar, está editando… esto es observar, está leyendo la respuesta."* Qué mirar: la correspondencia 1:1 con el diagrama pensar/actuar/observar.
> - **Beat 3.** Qué hago: señalar la vuelta donde corrige algo. Qué digo: *"Ahí. Falló, lo vio, y volvió a entrar al loop. Eso es lo que vos hacías a mano."* Qué mirar: el reintento como otra vuelta, no como una respuesta nueva.
> - **Plan B si no coopera:** si la tarea sale en una sola vuelta sin error, pedir algo apenas más ambiguo a propósito (ej. sin decir el shape exacto del JSON) para forzar al menos una iteración; o narrar sobre un transcript guardado de una corrida previa.

Longitud: ~700-900 palabras + mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Las 4 piezas (LLM + loop + tools + entorno) nombradas explícitamente.
- [ ] Las 3 fases del ciclo con un ejemplo concreto único hilado (no abstracto).
- [ ] Condiciones de corte presentes + gancho a §5.
- [ ] Mini-demo con beats (qué hago / qué digo / qué mirar) + Plan B.
- [ ] Sin marcas, sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/02-el-loop-agentic.md
git commit -m "docs(semana-04): §2 el loop agentic (ReAct) + mini-demo D1"
```

---

## Task 4: 03-tools-las-manos.md (callback S1, 7-8 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/03-tools-las-manos.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §3, actúa sobre: el loop). **Callback fuerte a Semana 1.** Estructura:

- `# Tools: las manos del agente`
- Hook + callback S1: "¿Se acuerdan de la semana 1, cuando el modelo emitía un token especial, el programa lo pausaba, hacía la búsqueda web, y pegaba el resultado de vuelta en el contexto? Eso era una tool. Hoy lo mismo, pero las manos llegan más lejos."
- `## Recontextualizar: de buscar a actuar`: en S1 la única tool era web search (refrescar working memory). En un agente de coding las tools son leer archivos, escribir archivos, correr comandos, ejecutar tests, hacer búsquedas en el repo. Mismo mecanismo (el modelo pide, el runtime ejecuta, el resultado vuelve), distinto alcance (ahora modifica el mundo, no solo lo consulta).
- `## El ciclo de una tool`: el modelo emite una llamada a tool → el runtime la ejecuta → la **observación** (salida) vuelve al contexto → el modelo sigue. Atar esto explícitamente a la fase "actuar/observar" del loop del §2.
- `## La observación vuelve al contexto`: punto bisagra hacia §4. Cada resultado de tool ocupa lugar en la ventana. Leer un archivo de 800 líneas = 800 líneas en la working memory. Esto prepara el problema del §4 sin resolverlo todavía.
- `## Leer vs. escribir`: distinción de riesgo — una tool que lee es reversible; una que escribe/ejecuta no siempre. El supervisor presta más atención a las que actúan sobre el mundo (gancho a §5 y §11).
- Mini-demo (abajo).
- Cierre: las tools son cómo el agente toca el mundo; el contexto es dónde el agente recuerda lo que tocó (puente a §4).

`## Mini-demo en vivo: la observación entra al contexto` (D2):
> Intro: hacer literal el callback de la semana 1 — el resultado de una herramienta entrando a la working memory.
> - **Beat 1.** Qué hago: pedir algo que obligue a leer un archivo concreto del repo (ej. "leé `package.json` y decime qué scripts hay"). Qué digo: *"Antes de responder no sabe nada de ese archivo. Miren qué hace primero."* Qué mirar: la llamada a la tool de lectura.
> - **Beat 2.** Qué hago: señalar la observación (el contenido del archivo) apareciendo en la conversación. Qué digo: *"Eso que entró ahí es exactamente el 'pegar el resultado en el contexto' de la semana 1. La working memory se acaba de refrescar."* Qué mirar: el contenido del archivo ahora en contexto.
> - **Beat 3.** Qué hago: opcional, correr `/context` (si la versión lo soporta) para mostrar que ese contenido ahora ocupa lugar. Qué digo: *"No es gratis. Lo que leyó, lo está cargando."* (gancho a §4).
> - **Plan B si no coopera:** si no querés depender de `/context`, alcanza con señalar el bloque de salida de la tool en el transcript y nombrarlo como "la observación".

Longitud: ~700-900 palabras + mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Callback explícito a S1 (tokens especiales → search → resultado al contexto), citado como repaso.
- [ ] Ciclo de tool atado a la fase actuar/observar del §2.
- [ ] "La observación ocupa contexto" planteado como gancho a §4 (sin resolverlo).
- [ ] Distinción leer/escribir presente.
- [ ] Mini-demo con beats + Plan B. Sin marcas, sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/03-tools-las-manos.md
git commit -m "docs(semana-04): §3 tools (callback S1) + mini-demo D2"
```

---

## Task 5: 04-la-ventana-es-todo.md (el corazón, 9-10 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/04-la-ventana-es-todo.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §4, actúa sobre: el contexto). **Callback fuerte S1 + sección más importante de la parte 1.** Estructura:

- `# La ventana de contexto es finita`
- Hook + callback S1: "Semana 1: el conocimiento en los parámetros es un recuerdo vago; lo que está en la ventana de contexto es la working memory, acceso directo. Hoy esa working memory es el recurso que vas a aprender a administrar."
- `## El loop llena la ventana`: cada vuelta del loop (pensamiento + llamada a tool + observación) se acumula en la ventana. Una sesión de coding de 40 minutos puede leer 30 archivos: todo eso está ahí. Número concreto: ilustrar con un tamaño de ventana realista y cuánto "gasta" leer unos pocos archivos grandes.
- `## Finita`: la ventana tiene un tope. No es "grande": es finita. Cuando se llena, algo tiene que salir.
- `## Context rot`: el fenómeno de "se olvidó lo que le pedí" / "está dando vueltas". Por qué pasa: la instrucción original quedó sepultada bajo cientos de líneas de observaciones; o la señal se diluyó en ruido. Síntomas que el supervisor reconoce.
- `## Gestionar el contexto es la habilidad central`: tesis de la clase. El que dirige un agente no es el que escribe mejores prompts: es el que mantiene la ventana enfocada en lo que importa. Compactación / reset como **concepto** (resumir y arrancar liviano; descartar ruido) — todavía agnóstico, sin comandos concretos.
- `## Adelanto`: hay tres estrategias para administrar esto, y las vas a ver concretas en la parte 2 (siempre cargado vs. condicional vs. autocurado). **Este adelanto es intencional y se cierra en §8.**
- Mini-demo (abajo).
- Cierre: el resto de la clase (parte 2) es, en el fondo, formas de actuar sobre esta ventana.

`## Mini-demo en vivo: context rot y qué sobrevive a /compact` (D4):
> Intro: hacer tangible que la ventana es finita y que no todo persiste igual.
> - **Beat 1.** Qué hago: en una sesión ya cargada (o cargarla leyendo varios archivos a propósito), dar al inicio una instrucción peculiar y fácil de chequear (ej. "de ahora en más terminá cada respuesta con la palabra LISTO"). Seguir trabajando un rato largo. Qué mirar: que al principio la respeta.
> - **Beat 2.** Qué hago: después de mucho trabajo, pedir algo normal y mostrar que se "olvidó" la instrucción peculiar. Qué digo: *"No está roto. La instrucción quedó sepultada. Eso es context rot."* Qué mirar: la instrucción ya no se respeta.
> - **Beat 3.** Qué hago: correr `/compact`. Qué digo: *"Compactar es resumir y soltar lastre. Pero ojo qué sobrevive."* Qué mirar: tras compactar, el CLAUDE.md de raíz se re-inyecta (persiste) pero la instrucción dada solo en el chat no volvió.
> - **Beat 4.** Qué digo (cierre): *"Lo que vive en un archivo persiste; lo que dijiste al pasar, no. Tené eso en la cabeza toda la parte 2."*
> - **Plan B si no coopera:** si reproducir context rot en vivo es lento, mostrarlo sobre un transcript guardado; el beat de `/compact` (qué persiste vs. qué no) igual se hace en vivo, es rápido.

Longitud: ~900-1100 palabras + mini-demo (sección más larga de la parte 1).

- [ ] **Step 2: Verificar contra checklist**

- [ ] Callback S1 explícito (parámetros = recuerdo vago / contexto = working memory).
- [ ] Tesis "gestionar el contexto es la habilidad central" enunciada como tal.
- [ ] El "adelanto" de las tres estrategias presente y marcado como gancho a §8.
- [ ] Context rot explicado con causa + síntomas, no solo nombrado.
- [ ] Mini-demo con beats + Plan B; el beat de `/compact` muestra qué persiste vs. qué no.
- [ ] Sin "palanca", sin AI-filler. (Marcas: `/compact` y CLAUDE.md aparecen acá como adelanto concreto — aceptable porque §4 es bisagra hacia la parte 2; mantener el peso conceptual, no explicar CLAUDE.md todavía.)

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/04-la-ventana-es-todo.md
git commit -m "docs(semana-04): §4 la ventana es finita (callback S1) + mini-demo D4"
```

---

## Task 6: 05-cuando-el-agente-falla.md (lean, 5-6 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/05-cuando-el-agente-falla.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §5, actúa sobre: ambas). Cierra la parte 1 conectando con el rol supervisor. Estructura:

- `# Cuando el agente falla (y qué hacés vos)`
- Hook: un agente que actúa solo puede fallar de formas que una IA que solo escribe no podía. Enumerar el problema antes de catalogar.
- `## Cuatro modos de falla nuevos`: (1) **loop infinito** — sin condición de corte efectiva, da vueltas (gancho de vuelta a §2). (2) **deriva de objetivo** — empieza con tu tarea y termina haciendo otra cosa que le pareció mejor. (3) **alucinar tools / resultados** — inventa que corrió algo, o malinterpreta una salida (callback S1: alucinaciones, ahora con consecuencias porque actúa). (4) **envenenar su propio contexto** — mete basura en la ventana (un log gigante, un error mal leído) y razona peor a partir de ahí (callback §4).
- `## El rol del supervisor: cuándo intervenir`: no es "revisar al final". Es reconocer estos síntomas en vivo y cortar/redirigir. Conectar con S3 (leer la evidencia: logs, salidas — no creerle al agente, creerle a la máquina). La autonomía no elimina al supervisor; cambia *cuándo* mira.
- Cierre + puente a la parte 2: ahora que sabés qué es el loop, cómo usa tools, por qué la ventana importa y cómo falla — bajemos esto a una herramienta concreta. Todo lo que sigue actúa sobre el loop o sobre el contexto.

Longitud: ~500-650 palabras. Sin mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Los 4 modos de falla, cada uno con su gancho (loop→§2, alucinar→S1, envenenar→§4, leer evidencia→S3).
- [ ] Rol del supervisor enmarcado como "cuándo mirar", no "revisar al final".
- [ ] Puente explícito a la parte 2 ("actúa sobre el loop o el contexto").
- [ ] Lean (~500-650 palabras). Sin marcas, sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/05-cuando-el-agente-falla.md
git commit -m "docs(semana-04): §5 modos de falla y rol supervisor"
```

---

## Task 7: 06-claude-code-es-el-loop.md (aterrizaje, 5-6 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/06-claude-code-es-el-loop.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §6, actúa sobre: el loop). Primer archivo de la parte 2 — aquí entran las marcas. Estructura:

- `# Claude Code es ese loop`
- Apertura: lo que viste en abstracto (pensar/actuar/observar) tiene un nombre y una pantalla. Claude Code **es** una implementación de ese loop. No es un concepto nuevo: es el del §2, concreto.
- `## La pantalla mapeada al loop`: recorrer qué ves cuando Claude Code trabaja y mapear cada cosa a pensar / actuar (tool calls visibles) / observar (resultados). Reusar el lenguaje exacto del §2.
- `## Mismo modelo, mismas reglas`: las cuatro piezas del §2 (LLM + loop + tools + entorno) identificadas en Claude Code una por una. El entorno es tu repo y tu terminal de verdad.
- `## Lo que viene`: el resto de la clase recorre las herramientas de Claude Code preguntando siempre lo mismo — ¿esto cambia cómo corre el loop, o qué hay en el contexto? Listar el orden: memoria persistente (§7), rules y auto memory (§8), skills y slash commands (§9), sub-agents (§10), plan mode y control (§11).
- Nota breve: reusar la mini-demo D1 del §2 ("el loop desnudo") aquí si se da la clase en vivo — no se redefine; se referencia. Una línea: *"Si ya corriste el loop desnudo del §2, este es el momento de volver a señalarlo, ahora con nombre propio."*

Longitud: ~450-600 palabras. Sin mini-demo propia (referencia D1).

- [ ] **Step 2: Verificar contra checklist**

- [ ] Mapea pantalla → pensar/actuar/observar usando el vocabulario exacto del §2 (sin reinventar términos).
- [ ] Las 4 piezas del §2 reidentificadas en Claude Code.
- [ ] Lista el recorrido de la parte 2 con la pregunta-lente (loop vs. contexto).
- [ ] Referencia (no redefine) D1. Marcas OK acá. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/06-claude-code-es-el-loop.md
git commit -m "docs(semana-04): §6 Claude Code es el loop concreto"
```

---

## Task 8: 07-CLAUDE-md-jerarquico.md (siempre cargado, 7-8 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/07-CLAUDE-md-jerarquico.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §7, actúa sobre: el contexto — propiedad: **siempre cargado**). Datos del doc oficial (`code.claude.com/docs/en/memory`). Estructura:

- `# CLAUDE.md: la memoria que vos escribís`
- Pregunta-lente: ¿esto cambia el loop o el contexto? El contexto. CLAUDE.md inyecta instrucciones en la ventana al arranque de cada sesión.
- `## La jerarquía`: cuatro niveles, de más amplio a más específico: **managed/policy** (org, no se puede excluir) → **user** (`~/.claude/CLAUDE.md`, todas tus sesiones) → **proyecto** (`./CLAUDE.md` o `./.claude/CLAUDE.md`, compartido por el equipo vía git) → **local** (`CLAUDE.local.md`, gitignored, tuyo). Para qué sirve cada uno (ejemplos del doc: estándares de la empresa / preferencias personales / arquitectura del proyecto / URLs de tu sandbox).
- `## Orden de carga`: Claude camina el árbol de directorios hacia arriba desde el cwd. Todos los archivos encontrados se **concatenan** (no se sobrescriben), ordenados de la raíz del filesystem hacia el cwd; `CLAUDE.local.md` se appendea último en cada nivel. Subdirectorios: se cargan **on-demand** cuando Claude lee archivos ahí, no al arranque. Si dos reglas se contradicen, Claude elige una arbitrariamente (consecuencia práctica: revisar y limpiar).
- `## @import`: un CLAUDE.md puede importar otros con `@path/to/file` (relativo o absoluto; recursivo hasta 5 hops). Caso de uso: AGENTS.md compartido, dividir instrucciones largas.
- `## La propiedad clave: siempre cuesta contexto`: **incluso los imports**. `@import` ayuda a organizar pero NO ahorra contexto — el archivo importado se expande y carga al arranque igual. Tamaño recomendado < 200 líneas por archivo, por adherencia. Esto contrasta directo con §8 (lo que SÍ ahorra contexto). Comentarios HTML `<!-- -->` se strippean antes de inyectar (notas para humanos sin gastar tokens).
- Conectar con este repo: el `CLAUDE.md` de IISAIA es un ejemplo vivo — mostrarlo como instancia concreta de "instrucciones de proyecto".
- Mini-demo (abajo).
- Cierre: CLAUDE.md siempre está en la ventana. La pregunta natural: ¿y si pudiera estar solo cuando hace falta? (gancho directo a §8).

`## Mini-demo en vivo: la ventana antes y después` (D3):
> Intro: hacer visible que CLAUDE.md ocupa contexto desde el arranque, y que la jerarquía es real, no un diagrama.
> - **Beat 1.** Qué hago: en un repo sin CLAUDE.md, abrir Claude Code y correr `/context`. Qué digo: *"Esto es lo que carga de entrada, sin instrucciones nuestras."* Qué mirar: el baseline de contexto.
> - **Beat 2.** Qué hago: agregar un `CLAUDE.md` de proyecto con unas instrucciones, reiniciar la sesión, correr `/context` de nuevo. Qué digo: *"Mismo repo, una sesión nueva. Miren qué cambió antes de que yo pida nada."* Qué mirar: el delta de contexto atribuible al CLAUDE.md.
> - **Beat 3.** Qué hago: correr `/memory`. Qué digo: *"La jerarquía no es un dibujo. Esta es la lista real de fuentes de instrucción cargadas en esta sesión."* Qué mirar: los niveles (user / proyecto / etc.) listados.
> - **Plan B si no coopera:** si `/context` no está disponible en la versión, usar `/memory` solo para mostrar la lista de archivos cargados; el punto "siempre cargado" se sostiene igual narrándolo.

Longitud: ~800-1000 palabras + mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Los 4 niveles de jerarquía con paths exactos y caso de uso de cada uno.
- [ ] Orden de carga descrito correctamente (concatenación, raíz→cwd, local último, subdir on-demand).
- [ ] `@import` cubierto **con** la aclaración "no ahorra contexto" (corrige el malentendido del spec).
- [ ] Propiedad "siempre cargado" enunciada explícitamente y contrastada como gancho a §8.
- [ ] Usa el CLAUDE.md de este repo como ejemplo vivo.
- [ ] Mini-demo con beats + Plan B. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/07-CLAUDE-md-jerarquico.md
git commit -m "docs(semana-04): §7 CLAUDE.md jerárquico + mini-demo D3"
```

---

## Task 9: 08-rules-y-auto-memory.md (condicional/autocurado — payoff, 7-8 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/08-rules-y-auto-memory.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §8, actúa sobre: el contexto — propiedades: **condicional** y **autocurado**). **Aquí cierra el adelanto del §4: la tricotomía es el payoff.** Datos del doc oficial. Estructura:

- `# Rules y auto memory: contexto que no siempre está`
- Apertura: el §7 cerró con una pregunta — ¿y si una instrucción pudiera estar solo cuando hace falta? Respuesta: dos mecanismos.
- `## .claude/rules/ : instrucciones modulares`: archivos `.md` en `.claude/rules/` (descubiertos recursivamente; subdirectorios OK). Sin frontmatter `paths`, se cargan al arranque con la misma prioridad que `.claude/CLAUDE.md`. Aclaración explícita (corrige malentendido): esto **es** un mecanismo de rules propio de Claude Code, distinto de `.cursorrules`, pero igual son archivos aparte. También `~/.claude/rules/` a nivel usuario.
- `## Path-scoped rules: contexto condicional`: con frontmatter YAML `paths:` (globs como `src/api/**/*.ts`), la rule entra al contexto **solo cuando Claude toca archivos que matchean** ese patrón. Mostrar un ejemplo de frontmatter real. Esta es la diferencia conceptual clave con §7: CLAUDE.md siempre cuesta contexto; una rule path-scoped cuesta cero hasta que es relevante.
- `## auto memory: la memoria que el agente se escribe`: segundo sistema de memoria, distinto de CLAUDE.md (vos lo escribís) — acá **Claude** escribe. `MEMORY.md` + topic files en `~/.claude/projects/<project>/memory/`. Se cargan las primeras 200 líneas / 25KB de `MEMORY.md` al arranque; los topic files on-demand. Claude decide qué vale la pena recordar (correcciones, comandos, preferencias). `/memory` para auditarlo.
- `## La tricotomía (payoff del §4)`: cerrar el adelanto. Tres formas de que algo esté en el contexto: **siempre cargado** (CLAUDE.md, @import — §7) / **condicional** (rules path-scoped, y skills que vienen en §9) / **autocurado** (auto memory). El que gestiona bien el contexto elige la forma correcta para cada cosa: lo que aplica siempre va a CLAUDE.md; lo que aplica a un área va a una rule path-scoped; lo que el agente descubre solo, lo deja en auto memory. Esto **es** "gestionar el contexto es la habilidad central" hecho operativo.
- Dos mini-demos (abajo).
- Cierre: rules y auto memory mostraron contexto condicional y autocurado. Skills llevan "condicional" un paso más allá (gancho a §9).

`## Mini-demo en vivo: la rule condicional` (D8):
> Intro: el ejemplo más limpio de contexto condicional, medible en pantalla.
> - **Beat 1.** Qué hago: crear `.claude/rules/api.md` con frontmatter `paths: ["src/api/**"]` y una instrucción reconocible. Correr `/context` o `/memory`. Qué digo: *"La rule existe pero miren: no está cargada."* Qué mirar: ausencia de la rule.
> - **Beat 2.** Qué hago: pedir a Claude que toque un archivo fuera de `src/api/` (ej. un README). Volver a chequear. Qué digo: *"Tocó un archivo, pero no uno que matchee. Sigue sin cargarse."* Qué mirar: la rule sigue ausente.
> - **Beat 3.** Qué hago: pedir que toque un archivo dentro de `src/api/`. Chequear de nuevo. Qué digo: *"Ahora sí. Costó cero contexto hasta que fue relevante. Eso es lo que CLAUDE.md no puede hacer."* Qué mirar: la rule ahora presente.
> - **Plan B si no coopera:** si `/context` no expone el detalle, demostrarlo por comportamiento — la rule dice algo observable (ej. "en archivos de api, agregá un comentario `// API`") y se ve aparecer recién al tocar `src/api/`.

`## Mini-demo en vivo: auto memory` (D9):
> Intro: el agente recuerda sin que vos toques ningún archivo.
> - **Beat 1.** Qué hago: corregir a Claude sobre algo concreto (ej. *"en este proyecto usamos `npm`, no `yarn`"*). Qué mirar: el indicador "Writing memory".
> - **Beat 2.** Qué hago: abrir una sesión nueva y pedir algo que normalmente dispararía el error corregido. Qué digo: *"No edité ningún CLAUDE.md. Igual se acordó. Eso lo escribió él, no yo."* Qué mirar: respeta la corrección sin instrucción explícita.
> - **Beat 3.** Qué hago: correr `/memory` y abrir la carpeta de auto memory. Qué digo: *"Acá está. Markdown plano. Lo podés leer, editar o borrar."* Qué mirar: el archivo de memoria real.
> - **Plan B si no coopera:** si auto memory no se dispara en el momento (decide qué guardar), tener un `MEMORY.md` preparado de una corrida previa y abrirlo con `/memory` para mostrar el formato y el contenido.

Longitud: ~900-1100 palabras + 2 mini-demos (sección más densa de la parte 2).

- [ ] **Step 2: Verificar contra checklist**

- [ ] Aclaración explícita: `.claude/rules/` es mecanismo propio de CC, distinto de `.cursorrules`, archivos aparte (corrige malentendido del spec).
- [ ] Ejemplo real de frontmatter `paths:`.
- [ ] auto memory descrito como segundo sistema (Claude lo escribe) con paths y límites (200 líneas/25KB).
- [ ] La **tricotomía** presente como payoff y atada explícitamente al adelanto del §4 ("gestionar el contexto es la habilidad central" hecho operativo).
- [ ] Ambas mini-demos con beats + Plan B. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/08-rules-y-auto-memory.md
git commit -m "docs(semana-04): §8 rules path-scoped + auto memory (tricotomía) + D8/D9"
```

---

## Task 10: 09-skills-y-slash-commands.md (6-7 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/09-skills-y-slash-commands.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §9, actúa sobre: el contexto / el loop). Estructura:

- `# Skills y slash commands`
- Apertura: §8 mostró contexto condicional con rules. Las skills lo llevan más lejos: un procedimiento entero que no está en el contexto hasta que se invoca o Claude decide que aplica.
- `## Skills: procedimientos on-demand`: una skill empaqueta un workflow repetible. No se carga al arranque — entra al contexto solo cuando se invoca o cuando Claude la considera relevante. Por eso **protege el contexto**: lo que no estás usando no te cuesta tokens. Ejemplo vivo: las skills de este repo en `tools/skills/` (incluida `slide-generation` que genera estas clases).
- `## Slash commands: atajos`: comandos `/nombre` para acciones frecuentes. Distinguir de skills (un slash command es un disparador/atajo; algunos invocan skills). Ejemplo vivo del repo: `/build-class` en `.claude/commands/`, que es literalmente cómo se construye esta presentación.
- `## La distinción que ordena todo`: tabla mental de tres — **CLAUDE.md** (siempre en contexto) vs **rule path-scoped** (entra al matchear un path) vs **skill** (entra al invocarse). Misma pregunta-lente del curso: ¿cuándo paga contexto? Atar de vuelta a la tricotomía del §8.
- Mini-demo (abajo).
- Cierre: skills aíslan *procedimiento* del contexto. Lo que sigue (§10) aísla *otro loop entero* del contexto.

`## Mini-demo en vivo: la skill on-demand` (D6):
> Intro: ver que una skill cuesta cero contexto hasta el momento exacto en que se usa.
> - **Beat 1.** Qué hago: en una sesión, correr `/context` y mostrar que la skill X no está. Qué digo: *"Tengo una skill instalada. No está en el contexto. No existe, para esta sesión, todavía."* Qué mirar: ausencia de la skill.
> - **Beat 2.** Qué hago: invocar la skill. Qué digo: *"Ahora la pedí. Recién ahora paga su lugar."* Qué mirar: el costo de la skill apareciendo recién aquí.
> - **Beat 3.** Qué digo (cierre): *"Una rule entra cuando tocás cierto archivo. Una skill, cuando la pedís. CLAUDE.md, siempre. Tres formas de actuar sobre el contexto."* (callback tricotomía §8).
> - **Plan B si no coopera:** si `/context` no da el detalle, usar una skill del repo (`tools/skills/`) y mostrar por su salida que el procedimiento no estaba "presente" hasta invocarlo.

Longitud: ~650-850 palabras + mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Skill vs slash command distinguidos claramente (skill = procedimiento on-demand; slash = atajo/disparador).
- [ ] Usa ejemplos vivos del repo (`tools/skills/`, `/build-class`).
- [ ] La distinción de tres (CLAUDE.md / rule path-scoped / skill) atada a la tricotomía del §8.
- [ ] Mini-demo con beats + Plan B. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/09-skills-y-slash-commands.md
git commit -m "docs(semana-04): §9 skills y slash commands + mini-demo D6"
```

---

## Task 11: 10-sub-agents.md (6-7 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/10-sub-agents.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §10, actúa sobre: el contexto — aislamiento). Estructura:

- `# Sub-agents: aislar un loop entero`
- Hook: una búsqueda exploratoria en el repo puede leer 40 archivos. Si eso entra al contexto del agente principal, lo envenenás (callback §4/§5). ¿Y si esos 40 archivos vivieran y murieran en otra ventana?
- `## Qué es un sub-agent`: el mismo agente corriendo un loop **propio**, con su **propia ventana de contexto**, sobre una sub-tarea. Cuando termina, devuelve al padre **solo el resultado** — no su contexto. Evitar la metáfora "otro empleado/otra IA" si confunde: es el mismo modelo, otro loop aislado.
- `## Por qué protege el contexto`: el ruido de la sub-tarea (40 archivos leídos) queda en la ventana del sub-agent y se descarta; al padre vuelve un resumen chico. La ventana del padre casi no crece. Atar a la tesis del §4.
- `## Paralelización`: como cada sub-agent tiene su propia ventana, varios pueden correr en paralelo sobre sub-tareas independientes. Beneficio secundario, pero el principal es el aislamiento de contexto.
- `## El costo`: el padre no ve *cómo* el sub-agent llegó al resultado — solo el resultado. Eso es bueno para el contexto y exige confiar/verificar el resumen (gancho al rol supervisor del §5).
- Mini-demo (abajo).
- Cierre: sub-agents aíslan contexto entre loops. Falta una herramienta sobre el loop mismo: cuánto lo dejás actuar antes de mirar (gancho a §11).

`## Mini-demo en vivo: el sub-agent aísla` (D5):
> Intro: medir en pantalla que el contexto del padre casi no crece.
> - **Beat 1.** Qué hago: hacer una búsqueda exploratoria amplia **inline** (sin sub-agent) — ej. "encontrá dónde se maneja la autenticación en todo el repo". Correr `/context` después. Qué digo: *"Miren cuánto creció el contexto. Todo lo que leyó quedó acá."* Qué mirar: el contexto inflado.
> - **Beat 2.** Qué hago: nueva sesión; misma búsqueda pero delegada a un sub-agent. Correr `/context` después. Qué digo: *"Misma tarea. Pero lo que leyó vivió en otra ventana. Acá solo volvió el resultado."* Qué mirar: el contexto del padre casi sin cambios.
> - **Beat 3.** Qué digo (cierre): *"Mismo resultado, una fracción del costo de contexto. Eso es aislar."*
> - **Plan B si no coopera:** si comparar `/context` es difícil en vivo, narrar la diferencia sobre dos transcripts preparados (uno inline, uno con sub-agent) señalando el tamaño de contexto final de cada uno.

Longitud: ~650-850 palabras + mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Sub-agent definido como mismo modelo / loop y ventana propios / devuelve solo el resultado.
- [ ] "Por qué protege el contexto" atado a la tesis del §4 y al envenenamiento del §5.
- [ ] El costo (no ves el cómo) conectado al rol supervisor del §5.
- [ ] Mini-demo comparativa (inline vs sub-agent) con beats + Plan B. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/10-sub-agents.md
git commit -m "docs(semana-04): §10 sub-agents (aislamiento de contexto) + mini-demo D5"
```

---

## Task 12: 11-plan-mode-y-control.md (5-6 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/11-plan-mode-y-control.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §11, actúa sobre: el loop — control). Última herramienta de la parte 2. Estructura:

- `# Plan mode y control del loop`
- Hook: todo lo anterior actuó sobre el contexto. Esto actúa sobre el loop: cuánta autonomía le das antes de mirar.
- `## Plan mode: pensar antes de actuar`: el agente arma un plan y lo presenta **antes** de tocar nada. Vos aprobás, corregís o rechazás. Es un freno deliberado al loop: separa "pensar" de "actuar" para que el supervisor entre entre las dos fases. Conectar con deriva de objetivo (§5): plan mode es la defensa barata contra que se vaya por las ramas.
- `## Permisos: gate antes de cada acción`: antes de una tool que actúa sobre el mundo (escribir, ejecutar), el runtime puede pedir confirmación. Callback §3 (leer vs escribir): los gates importan más en las que actúan, no en las que solo leen.
- `## El supervisor decide cuánta autonomía`: no hay un nivel correcto único. Tarea reversible y acotada → más autonomía. Tarea con consecuencias persistentes (callback S3: el backend persiste) → plan mode + gates. El criterio es el rol del §5 hecho perilla.
- `## Más controles, al pasar`: nombrar **hooks** (shell que corre en eventos del ciclo, enforcement real vs. CLAUDE.md que es solo contexto) y **MCP** (conectar tools externas) como "más formas de actuar sobre el loop o el contexto" — sin profundizar. Una o dos frases cada uno, explícitamente "esto se ve en otra clase".
- Cierre de la parte 2: recapitular la pregunta-lente. Cada herramienta vista respondía ¿loop o contexto? Listarlas mapeadas. El alumno ya no ve features sueltas: ve dos cosas y formas de actuar sobre ellas.
- Puente al §12: ahora tenés modelo (S1), rol (S2-3) y runtime (hoy). Falta para qué.

`## Mini-demo en vivo: plan mode como freno` (D7):
> Intro: ver el loop detenido a propósito antes de que toque un archivo.
> - **Beat 1.** Qué hago: dar una tarea ambigua **sin** plan mode (ej. "reorganizá los imports del proyecto"). Dejar que actúe. Qué digo: *"Sin freno, arranca y hace lo que le parece. Miren dónde toca."* Qué mirar: ediciones que quizá no querías.
> - **Beat 2.** Qué hago: misma tarea **con** plan mode. Qué digo: *"Ahora propone primero. No tocó nada todavía."* Qué mirar: el plan presentado, cero ediciones.
> - **Beat 3.** Qué hago: corregir el plan antes de aprobarlo. Qué digo: *"Acá entro yo, entre pensar y actuar. Eso es controlar el loop."* Qué mirar: el plan corregido ejecutándose acotado.
> - **Plan B si no coopera:** si la tarea sin plan mode sale bien por casualidad, elegir uno más amplio/destructivo-en-apariencia (que igual sea reversible en el repo de demo) para que el contraste se vea.

Longitud: ~600-800 palabras + mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Plan mode y permisos descritos como acción sobre el loop, con callbacks (§5 deriva, §3 leer/escribir, S3 persistencia).
- [ ] hooks y MCP solo nombrados al pasar, con "se ve en otra clase" explícito.
- [ ] Recap de la parte 2 mapeando cada herramienta a loop/contexto.
- [ ] Puente al §12 (modelo + rol + runtime → falta el para qué).
- [ ] Mini-demo con beats + Plan B. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/11-plan-mode-y-control.md
git commit -m "docs(semana-04): §11 plan mode y control del loop + mini-demo D7"
```

---

## Task 13: 12-trabajo-final.md (framing, 8-10 slides equiv.)

**Files:**
- Create: `semanas/04/source_material/12-trabajo-final.md`

- [ ] **Step 1: Escribir el archivo**

Núcleo (spec §12): **solo framing/motivación**, ~20 min, SIN condiciones administrativas (equipos, fechas, criterios, entregables — eso es verbal/otro canal). El deliverable concreto NO está decidido y NO debe inventarse; describir su *forma* genérica, no su contenido. Estructura:

- `# El trabajo final`
- Apertura: por qué ahora. Tenés tres cosas que hace cuatro semanas no tenías: el **modelo** (S1: cómo piensa un LLM), el **rol** (S2-3: supervisor arquitectónico, dictar contratos), y el **runtime** (hoy: el loop, las tools, la ventana, las herramientas para gestionarla). El trabajo final es donde las tres se juntan.
- `## Qué vas a construir (forma, no contenido)`: un producto con frontend + backend de algo. El dominio puede ser libre o acotado — **se define más adelante; no condiciona lo que aprendiste hoy**. Lo importante no es qué app: es que vas a dirigir un agente para construirla, no tipearla.
- `## Por qué conecta con todo`: enganchar cada pieza del curso al trabajo: vocabulario frontend/backend (S2-3) para dictar contratos; el loop y la gestión de contexto (hoy) para que el agente no se pierda en un proyecto de varios archivos; el rol supervisor para auditar lo que devuelve. El trabajo final es el examen del rol, no de la sintaxis.
- `## Qué se evalúa, en espíritu`: NO listar criterios formales. Enmarcar el espíritu: no se evalúa "que funcione" solamente — se evalúa que puedas explicar el proceso (cómo dirigiste, cómo gestionaste el contexto, cómo detectaste y corregiste fallas del agente). Apropiación, no magia. (Esto prepara el Demo Day sin definir su rúbrica.)
- `## Lo que NO se decide hoy`: ser explícito — equipos, fechas, entregables por semana, dominio exacto y rúbrica se comunican aparte. Hoy es el porqué y la forma, para que vayas pensando.
- Cierre: una frase que cierre la clase entera (el arco S1→S4: piezas → dirigir → runtime → ahora construí algo real con todo eso).

Longitud: ~700-900 palabras. Sin mini-demo.

- [ ] **Step 2: Verificar contra checklist**

- [ ] Cero condiciones administrativas concretas (sin fechas/equipos/rúbrica/entregables inventados).
- [ ] Conecta explícitamente modelo (S1) + rol (S2-3) + runtime (S4).
- [ ] "Lo que NO se decide hoy" presente y explícito.
- [ ] Cierra el arco del curso. Sin "palanca", sin AI-filler.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/12-trabajo-final.md
git commit -m "docs(semana-04): §12 trabajo final (framing y motivación)"
```

---

## Task 14: Verificación cruzada final

**Files:**
- Read-only: todos los `semanas/04/source_material/*.md`

- [ ] **Step 1: Grep anti-filler / anti-patrón (runnable)**

```bash
cd /Users/enzo/Documents/IISAIA
grep -rniE "revolucionari|potenci(ar|amos)|de vanguardia|seamless|robust|leverage|streamline|increíble|asombros|espectacular|palanca|🤖|✅|🚀" semanas/04/source_material/ ; echo "exit:$?"
```

Expected: `exit:1` (grep no encontró nada). Si imprime líneas (`exit:0`), corregir cada ocurrencia y re-correr. Nota: "palanca" no debe aparecer en ningún archivo de contenido.

- [ ] **Step 2: Chequeo de coherencia cruzada (manual, leer los 12)**

Verificar contra el spec:
- [ ] §4 contiene el "adelanto" de la tricotomía y §8 lo **cierra** explícitamente (mismo lenguaje a ambos lados).
- [ ] El vocabulario del loop (pensar/actuar/observar) es idéntico entre §2 y §6 (no se renombra).
- [ ] Callbacks a S1 presentes y explícitos en §3 (tool use) y §4 (parámetros vs working memory).
- [ ] Cada uno de los 9 mini-demos está en su archivo host (ver tabla de mapeo) con formato beat-sheet + Plan B.
- [ ] §1 abre sin el bridge del yaml de S3; continuidad con S2-3 es genérica.
- [ ] Parte 1 (§1-5) sin marcas de producto; marcas recién desde §6.
- [ ] La pregunta-lente ("¿actúa sobre el loop o sobre el contexto?") aparece en §6 (planteada) y se recapitula en §11.
- [ ] Ningún archivo referencia hacia adelante salvo el adelanto intencional §4→§8.

Corregir inline cualquier desincronización encontrada y commitear:

```bash
git add semanas/04/source_material/
git commit -m "docs(semana-04): pase de coherencia cruzada final"
```

(Si no hubo correcciones, omitir el commit.)

- [ ] **Step 3: Confirmar inventario de archivos**

```bash
ls -1 semanas/04/source_material/
```

Expected: exactamente `index.md` + `01-`…`12-` (13 archivos `.md`, sin `.gitkeep` sobrante en `source_material/`).

---

## Self-Review (autor del plan)

**1. Spec coverage:** spec §1→Task2, §2→Task3, §3→Task4, §4→Task5, §5→Task6, §6→Task7, §7→Task8, §8→Task9, §9→Task10, §10→Task11, §11→Task12, §12→Task13, index→Task1, coherencia/anti-filler→Task14. Las 9 mini-demos: D1→Task3, D2→Task4, D3→Task8, D4→Task5, D5→Task11, D6→Task10, D7→Task12, D8/D9→Task9, D1-reuse→Task7. Puntos de confusión del spec (rules≠.cursorrules, @import no ahorra contexto) → checklists Task8/Task9. Sin gaps.

**2. Placeholder scan:** sin "TBD/TODO"; cada task trae estructura concreta + beats verbatim + checklist verificable + comando de commit. El §12 declara explícitamente "no inventar condiciones" (es una restricción del spec, no un placeholder).

**3. Type consistency:** nombres de archivo idénticos entre index (Task1), tabla de mapeo y cada task. IDs de mini-demo (D1-D9) consistentes entre spec, tabla de mapeo y tasks. Vocabulario del loop fijado (pensar/actuar/observar) y verificado en Task14 Step2.

**Adaptación TDD:** no hay tests automatizados para prosa; el análogo "test" es el checklist editorial por task + el grep anti-filler runnable de Task14 (con exit code esperado). Verificación antes de cada commit, commits frecuentes (uno por archivo).
