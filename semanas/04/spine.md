# Spine — Semana 04: Fundamentos de Agentic AI y Claude Code

**Whole-week through-line:** Una IA que *actúa* (no que sugiere) se dirige con un set de herramientas conceptuales más amplio que "escribir un buen prompt". La parte 1 (§1–§5) construye un marco de **tres ingenierías anidadas** — `prompt ⊂ context ⊂ harness` — sin nombrar ninguna herramienta. La parte 2 (§6–§14) presenta las siete piezas configurables del runtime de Claude Code como piezas concretas del harness (§6.5), las recorre una por sección (§7–§13) y cierra con el trabajo final (§14). Prompt engineering ya lo venían practicando; lo que esta clase abre son los dos niveles nuevos.

**Dispositivos pedagógicos de toda la semana:**
- **Las tres ingenierías como marco**: se introducen anidadas en §3.3 (`prompt ⊂ context ⊂ harness`), §4 desarrolla **context engineering** completo, §5 desarrolla **harness engineering** completo, §5.4 cierra Parte 1 con el recap de los 3 niveles. §6.5 mapea las siete piezas de Claude Code a las dimensiones del harness.
- **Animación del loop (bespoke, nueva)**: una sola animación JS nueva en todo el deck (`four-loop-anim.js`). Cicla pensar → actuar → observar → repetir con las 4 condiciones de corte como chips de salida. Se introduce en §2.1 (ReAct) y se re-conduce en §2.2 (fragment-driven highlight de cada fase). El modo `cc` quedó sin uso tras el rediseño de §6.
- **Costura parte 1 / parte 2**: `section-divider` fuerte entre §5 y §6 ("Parte 2 — Claude Code"). §1–§5 nunca nombran Claude Code. §6 revela que el loop abstracto de §2 tiene nombre propio y mapea sus piezas configurables al harness de §5.

**Nota de escala:** 14 secciones, ~220 min de contenido. Con tratamiento estructurado de 7 demos en vivo (uno por feature de Parte 2) el deck es grande (~120–140 slides). Es una clase larga, dictada en 2 sesiones; la costura parte 1 / parte 2 entre §5 y §6 es el corte natural.

**Nota sobre el rediseño de Parte 2 (2026-05-19):** la Parte 2 se rediseñó para cubrir 7 features de Claude Code como secciones independientes (§7–§13) siguiendo una plantilla documentation-walkthrough (qué es / dónde vive / cuándo se carga / cómo se usa / casos límite / mini-demo). El `.lens-tracker` se eliminó del deck (foco en cada feature por su propia anatomía, no por su ubicación en una taxonomía). El dispositivo recurrente nuevo es la **tarjeta de 5 preguntas** que abre cada sección. El demo se hace en un repo aparte (`semanas/04/demo-repo/`, FastAPI + frontend) que el profesor copia fuera del repo del curso antes de dictar para aislarlo.

**Nota sobre relación con `source_material/index.md`:** el material fuente todavía organiza Parte 1 alrededor de "loop + contexto" y trata §3 como "Tools — las manos del agente" y §5 como "Modos de falla". El deck reorganizó esos contenidos: las tools entraron en §2 (como bridge de single-turn → ReAct), §3 pasó a ser "Las tres ingenierías" (un slide marco nuevo), y §5 pasó a ser "Harness engineering" (el otro nivel nuevo). El espíritu del material fuente sobrevive (loop, finitud, tools como manos, supervisión, etc.) pero la organización es distinta — el spine es el contrato canónico de qué hay en cada sección.

---

## Section 1: De escribir a actuar
**Source material:** `source_material/01-de-escribir-a-actuar.md` (+ callback a S1)
**Through-line:** El cambio de paradigma no es "una IA que escribe mejor" — eso sería más de lo mismo. Es que la IA ahora *actúa*: cierra el loop sobre tu repo sin que vos intervengas en cada vuelta. Para dirigir algo que actúa hay que abrir la caja del "programa que envuelve al LLM" — esa caja se va a llenar de piezas en las próximas secciones.
**Hook:** La última vez que le pediste a una IA que arreglara un endpoint: copiaste el error, lo pegaste, copiaste el código, lo pegaste, corriste, viste un 500 distinto, volviste al chat. Cada vuelta de esa rueda la hacías vos. *Vos eras el que corría el loop.*
**What students walk away knowing:**
- Recap S1 expandido en 5 estados: la unidad del LLM es predecir un token, pero alrededor siempre hay un **programa externo** que (1) lo mete en un loop con `max_tokens`, (2) le envuelve la entrada con tokens de rol (SFT), (3) filtra los tokens de razonamiento del output (RL), y (4) ensambla `system + historial + mensaje nuevo` turno a turno. La caja punteada es el protagonista de toda la semana.
- Son dos paradigmas distintos, no versiones mejor/peor: IA que sugiere + vos conducís, vs. agente que planifica y ejecuta en loop; el LLM debajo puede ser el mismo, lo que cambia es la arquitectura encima — el programa externo evoluciona.
- El rol de supervisor (semanas 2–3) no desaparece; lo que cambia es qué hay para supervisar. Hoy no aprendés una herramienta — aprendés la máquina que vas a dirigir el resto del curso.
**Animations / interactive:** El recap S1 usa fragments para revelar progresivamente los 5 estados (el primero arranca visible; los stages 2-4 aparecen al costado uno por uno; el stage 5 reemplaza la fila completa para mostrar el ensamblaje conversacional con system / historial / mensaje nuevo). `comparison-2col` para los dos paradigmas + diagrama cíclico CSS de la rueda copy-paste manual con la caja "Chat" dashed que representa al subsistema del slide anterior. Sin animación JS — la del loop entra en §2.
**Slide budget actual:** 3 slides.

## Section 2: El loop — pensar, actuar, observar
**Source material:** `source_material/02-el-loop-agentic.md` + `source_material/03-tools-las-manos.md` (las tools entran acá como bridge desde S1)
**Through-line:** La diferencia entre un chat que sugiere y un agente que resuelve no está en el modelo de adentro: está en que el agente no da una respuesta, entra en un loop (pensar → actuar → observar) que se repite vuelta a vuelta hasta una condición de corte. Las tools — ya conocidas de S1 — eran **una vuelta sola**; ReAct es el paso al **loop**. Un agente = LLM + loop + tools + entorno; sin condición de corte el loop no converge.
**Hook:** No hay slide puente. Las tools ya aparecen en el punto 5 del recap de §1.1, dentro del programa externo ("llama tools: pausa, ejecuta e inyecta el resultado"), usadas para consultar y redactar una respuesta. §2.1 arranca directo en ReAct y contrasta con ese chat con tools.
**What students walk away knowing:**
- Tools = otra responsabilidad del programa externo (callback explícito a S1, se muestra en el punto 5 de §1.1): cuando el LLM emite un token de tool call, el programa pausa la generación, ejecuta, inyecta el resultado, el LLM sigue generando. El uso clásico es **consultar para responder**: el modelo lee resultados para redactar una respuesta, y termina cuando termina el texto.
- ReAct = **actuar hasta terminar**. Las tools actúan sobre un entorno (leen y modifican), dentro de un loop que sigue hasta una condición de corte; entre vuelta y vuelta el modelo decide la próxima acción a partir de lo observado. La distinción consultar vs. modificar el mundo prepara el "rm equivocado" de §3.2.
- Tres fases que se *alternan* (Reasoning + Acting entrelazados), no etapas separadas; cada fase tiene una salida concreta: pensar → decisión; actuar → cambio en el entorno; observar → información nueva en el contexto. Slide consolidado: misma animación, tres iluminaciones por fragment.
- El trace concreto (404 en `/tasks/`, local): 2 vueltas — la primera identifica (curl + lectura del router → slash duplicado), la segunda corrige y verifica (edit → curl local 200). La condición de corte es "objetivo alcanzado".
- Un agente son 4 piezas necesarias en conjunto (LLM + loop + tools + entorno); cuando algo falla, el diagnóstico empieza por "¿cuál de las 4?". Cierre operativo de la sección.
- Cuatro condiciones de corte que aparecen en la práctica: objetivo alcanzado / límite de pasos / pide ayuda / falla no recuperable. Ya se adelantaron como chips en la animación al introducir ReAct; este slide las abre.
**Animations / interactive:** **Bespoke loop animation — NUEVA, se introduce acá** (`four-loop-anim.js`, mode `intro`). Dos instancias en la sección: (a) §2.1 ReAct intro — animación completa con chips de corte, escalada 1.4×, fragment-mounted; (b) §2.2 Tres fases — la misma animación con `phase` cambiando por fragment (pensar → actuar → observar). Trace concreto (§2.3) es CSS-only — un trace de 6 filas con color por fase y conectores verticales, sin animación; el puntero del docente lo navega.
**Slide budget actual:** 5 slides (ReAct intro → tres fases consolidado → trace 404 → 4 piezas → condiciones de corte). La slide puente de tools se eliminó el 2026-09-15; su contenido pasó al punto 5 de §1.1.

## Section 3: Las tres ingenierías
**Source material:** **No mapea a un archivo único del source_material** — es un slide marco nuevo que organiza el resto de la clase. Recoge motivación de `03-tools-las-manos.md` (el abanico de capacidades) y `05-cuando-el-agente-falla.md` (gran poder, gran responsabilidad) para justificar por qué prompt engineering ya no alcanza.
**Through-line:** ReAct + tools no son piezas técnicas aisladas — combinadas abren un rango operativo enorme (escribir código de cero, correr tests, diagnosticar bugs, refactorizar, sintetizar docs, encadenar tools). Ese abanico cambia la pregunta de la clase: ya no es "¿cómo escribo un buen prompt?", es "¿cómo dirijo algo que puede hacer todo eso?". La respuesta es un marco de **tres ingenierías anidadas por alcance** — `prompt ⊂ context ⊂ harness` — donde prompt engineering es lo que ya conocen y los dos niveles exteriores son lo que abre esta clase y la parte 2.
**Hook (§3.1):** Recorrido visual del abanico de capacidades — seis cards de capacidades concretas (escribir, correr tests, diagnosticar, refactorizar, sintetizar docs, encadenar tools), revelado de una con cierre punzante: "casi cualquier cosa que un developer hace en una terminal y un editor, el agente la puede hacer".
**What students walk away knowing:**
- Cuando un sistema puede modificar tu repo, ejecutar comandos y tomar decisiones por su cuenta, **lo que sale bien escala — y lo que sale mal también**. Un fix automático vale por diez horas tuyas; un `rm` equivocado las cuesta. Slide de salto: el alcance abierto por ReAct + tools exige una disciplina más amplia que prompt engineering.
- **Tres ingenierías por alcance creciente**: (a) **prompt engineering** — alcance: una interacción; ya lo conocen de S2–S3, sigue siendo la base, no desaparece. (b) **context engineering** — alcance: una sesión; la ventana de contexto como recurso a gestionar (qué se carga, qué se mantiene, qué se descarta). (c) **harness engineering** — alcance: múltiples sesiones; el entorno completo (tools disponibles, guardrails, scripts deterministas, feedback loops).
- Los tres alcances **se anidan**: `prompt ⊂ context ⊂ harness`. Cualquier prompt vive dentro de una sesión, cualquier sesión vive dentro de un harness. Esta línea es la que monta el resto del deck — §4 abre context, §5 abre harness, y toda la Parte 2 ubica cada feature de Claude Code en uno de los tres niveles.
**Animations / interactive:** CSS-only. §3.1 grilla 3×2 + reveal de la línea de cierre. §3.2 quote slide con peso tipográfico + dos reveals (la línea media, el punch). §3.3 grilla 1×3 con reveals progresivos (prompt → context → harness → línea del anidamiento). Sin JS nuevo.
**Slide budget actual:** 3 slides (abanico → gran poder, gran responsabilidad → tres ingenierías anidadas).

## Section 4: Context engineering
**Source material:** `source_material/04-la-ventana-es-todo.md`
**Through-line:** La working memory del agente es finita por diseño y no arranca vacía: el runtime carga instrucciones antes de tu primer mensaje y el loop la llena más rápido de lo que intuís. Sobre esa misma barra se muestra el **context rot** (la instrucción del arranque sigue ahí y el modelo la contradice igual), después el costo (el contexto se reenvía entero en cada vuelta; el cache lo abarata pero no lo elimina) y la respuesta operativa: compactar o resetear.
**Hook:** Slide opener con la definición operativa (`alcance: una sesión completa`) y la tesis revelada por fragment.
**What students walk away knowing:**
- **La sesión no arranca vacía, y se llena sola** (7 clicks sobre una sola barra CSS): ~15k al arranque (instrucciones del proyecto, reglas, memoria) / ~500k sesión normal / ~900k sesión larga sobre 1M → ventanas más grandes desplazan el límite, no lo eliminan → **el ejemplo del rot en la misma barra**: aparece `"no uses dependencias externas"` dentro del bloque de ~15k y un codo lleva de la ventana a una caja LLM cuya salida es `$ uv add requests pandas sqlalchemy` → se nombra **context rot** y entran los cuatro síntomas del supervisor → **límite duro**: la barra llega al tope, se pone roja y aparece el error de ventana llena (la sesión no puede seguir).
- **Cómo se paga una sesión** (5 clicks): arriba el mecanismo (precio por 1M de entrada y de salida, precios reales de Claude Fable 5.1: $10 / $50, verificados contra platform.claude.com el 2026-09-15). Después cuatro columnas, cada una con su barra de contexto: mensaje suelto 10k+10k ($0,60, donde la salida es el grueso) → el mismo mensaje con 500k de contexto ($5,05) → la vuelta siguiente, 501k ($5,06) → pregunta: "¿cuanto más grande la ventana, más caro sale cada mensaje?" → la misma vuelta con el prefijo cacheado ($0,19: 500k leídos a $0,25/1M). Cierre: sí, salvo que el prefijo esté cacheado; y el cache vale mientras el principio del contexto no cambie.
- **Dos operaciones**: compactar (la sesión sigue sobre un resumen; lo que no entró se pierde) y resetear (ventana limpia con solo lo necesario). Las dos reescriben el contexto, así que la vuelta siguiente se paga sin cache. Cierre de sección + bridge al harness.
**Animations / interactive:** CSS-only. La slide de la barra lleva `min-height` fijo (reveal centra una sola vez y si no el contenido crece fuera de pantalla) y los fragments colapsan su espacio con `.s4-collapse-in` / `.s4-collapse-out`. **Una sola** barra de relleno (5/50/90% desde los `data-fill` visibles, con listeners de `fragmentshown`/`fragmenthidden`/`slidechanged`); el codo hacia la caja LLM es CSS puro.
**Slide budget actual:** 4 slides (opener + tesis → la sesión no arranca vacía + context rot → costo y cache → compactar/resetear + cierre). Recorte del 2026-09-15: se eliminaron "Parámetros vs ventana", "Finita por diseño", "Síntomas" y la slide propia de context rot con su diagrama de capas; el ejemplo vive ahora sobre la barra.

## Section 5: Harness engineering
**Source material:** **Reorganiza fuerte respecto a `source_material/05-cuando-el-agente-falla.md`.** El archivo del source_material trataba "modos de falla y el rol del supervisor"; el deck lo reemplazó por harness engineering. La motivación de "falla = entorno que ya cambió" sobrevive distribuida (en §3.2 "gran poder, gran responsabilidad", y en el lenguaje de guardrails / verificación de §5.2). No hay sección dedicada a los 4 modos de falla con el detalle del source.
**Through-line:** Acabamos de cerrar context engineering. **Falta el nivel exterior**: el entorno donde opera el agente. Harness — literalmente, el arnés del caballo: lo que canaliza la potencia del modelo en la dirección que querés. **No es pedirle al modelo que se comporte ("no cometas errores"), es diseñar el entorno para que tire de la carreta**. La disciplina se divide en 6 dimensiones y cada una mapea a una feature concreta de Claude Code, motivando la Parte 2.
**Hook (§5.1):** Metáfora del caballo en 3 tiempos. Entry: solo la etimología ("harness = arnés"). Primer reveal: imagen `caballo-descontrolado.png` + caption irónico "no cometas errores" (en mono, como prompt fallido). Segundo reveal: imagen `caballlo-harness.png` + caption "Harness Engineering". El contraste visual hace el argumento sin texto explicativo.
**What students walk away knowing:**
- Harness engineering = **diseñar el arnés que canaliza al modelo**, no pedirle que se comporte solo.
- **Ocho dimensiones** del harness (grid 4×2 con reveals progresivos), elegidas para que cada una tenga análogo directo en lo que se configura en un harness real (Claude Code, Codex, opencode): (1) instrucciones persistentes; (2) skills y comandos; (3) tools disponibles, incluidos servidores externos; (4) permisos; (5) selección de modelo; (6) selección de effort; (7) hooks (scripts que dispara el runtime ante eventos: antes/después de una tool, al abrir o cerrar sesión; ahí viven los tests y linters automáticos); (8) sub-agentes (qué se delega a otra ventana, con sus propias tools y modelo). "Manejo del contexto" se descartó el 2026-09-16 por ser context engineering, no harness. Rediseño del 2026-09-16: las anteriores eran abstractas ("estructurás el prompt", "armás feedback loops") y no mapeaban a nada configurable.
- **La frontera con context engineering** (slide de honestidad disciplinaria): los límites son difusos — "qué contexto cargás" es parte del harness *y* es lo que define context engineering. La lectura específica que sirve para Claude Code: harness = la capa de runtime que rodea al modelo (system prompt, definiciones de tools, lógica de reintentos, orquestación de sub-agentes, pasos de verificación) — distinta del modelo en sí y de un prompt suelto.
- **Cierre de Parte 1** (recap tres ingenierías): grilla con prompt / context / harness ("la capa de runtime que persiste entre sesiones") y la línea bridge: el programa externo que envuelve al modelo *se diseña*, y lo que persiste de una sesión a otra vive en archivos que podés leer y cambiar. Sin nombrar Claude Code: el mapeo harness → piezas del runtime vive en §6.5.
**Animations / interactive:** CSS-only. Reveals progresivos en la metáfora del caballo (las dos imágenes aparecen una por una), en la grilla de 8 dimensiones (una card por reveal) y en el recap final (las 3 cards + bridge revealed). Sin JS de animación nuevo. Imágenes en `../img/caballo-descontrolado.png` y `../img/caballlo-harness.png`.
**Slide budget actual:** 4 slides (opener caballo → 8 dimensiones → frontera con context → cierre tres ingenierías + bridge a Parte 2). La slide "Harness en Claude Code" se movió a §6.5 en la revisión del 2026-09-14: nombraba Claude Code antes del divider y mapeaba features que no se desarrollan (MCP, hooks, eval loops).

---

# Parte 2 — Claude Code (§6–§14)

> **Rediseño 2026-05-19.** Parte 2 cubre las 7 piezas configurables del runtime de Claude Code, una por sección (§7–§13), siguiendo plantilla documentation-walkthrough: *qué es / dónde vive / cuándo se carga / cómo se usa / casos límite / mini-demo*. La fuente canónica del contenido es `source_material/06-claude-code-es-el-loop.md` y `source_material/07-...md` a `13-...md`. **El `.lens-tracker` se eliminó.** El dispositivo recurrente es la tarjeta de 5 preguntas como divider de cada sección.

## Section 6: Claude Code es ese loop
**Source material:** `source_material/06-claude-code-es-el-loop.md`
**Through-line:** Claude Code no es un concepto nuevo: es el loop pensar → actuar → observar con nombre propio. Qué es (CLI; tools que el modelo pide y el runtime ejecuta), qué carga al arrancar (instrucciones, settings, índices de skills y sub-agents, índice de memoria), qué es una sesión (ventana propia; `/compact` y `/clear` como bajada de las dos operaciones de §4.7; `--continue`/`--resume`; lo que persiste entre sesiones vive en archivos, y eso es el harness), y el mapa de las siete piezas configurables con la dimensión del harness que llena cada una.
**Animations / interactive:** CSS-only. `section-divider` fuerte para abrir la Parte 2. Grid 4+3 centrado en §6.5.
**Slide budget actual:** 5 slides (divider → qué es → qué pasa al ejecutar `claude` → qué es una sesión → siete piezas del runtime).

## Section 7: CLAUDE.md y memoria automática
**Source material:** `source_material/07-CLAUDE-md.md`
**Through-line:** Archivos markdown leídos al arranque de cada sesión; texto tuyo que entra a la ventana como mensaje después del system prompt (no es el system prompt). Cuatro ubicaciones concatenadas (no override). Auto memory como sistema distinto que escribe Claude.
**What students walk away knowing:**
- CLAUDE.md siempre cuesta contexto. Orden de carga: managed (path fijo por OS) → user (`~/.claude/CLAUDE.md`) → CLAUDE.md de cada directorio ancestro desde la raíz hasta el CWD → `CLAUDE.local.md`. Los de subdirectorios debajo del CWD cargan bajo demanda.
- `@import` no ahorra contexto (hasta 4 saltos). Comentarios HTML descartados. Guía <200 líneas.
- Auto memory: directorio `~/.claude/projects/<project>/memory/` con `MEMORY.md` como índice (se cargan las primeras 200 líneas o 25 KB) y archivos por tema leídos bajo demanda.
**Plantilla obligatoria (6 sub-secciones):** Qué es / Dónde vive / Cuándo se carga / Cómo se usa / Casos límite / Mini-demo. Tarjeta de 5 preguntas como divider de apertura.
**Animations / interactive:** Tarjeta de plantilla. Tabla de las 4 ubicaciones y diagrama del orden de carga. Extracto del `CLAUDE.md` del demo-repo.
**Mini-demo (único bloque al final):** setup común (copia fuera del repo del curso, `git init`, `cp .env.example .env`, `uv sync`, `claude --permission-mode default`). `/context` muestra qué está cargado; `/memory` muestra las ubicaciones posibles; carpeta de auto memory (arranca vacía en la copia). Plan B en notas.
**Slide budget actual:** 10 slides.

## Section 8: Rules (`.claude/rules/`)
**Source material:** `source_material/08-rules.md`
**Through-line:** Archivos `.md` modulares de instrucciones. Sin `paths:` = siempre cargados (ventaja organizativa sobre CLAUDE.md monolítico). Con `paths:` + globs = path-scoped: entran cuando Claude lee un archivo que matchea.
**What students walk away knowing:**
- Estructura de `.claude/rules/` con un archivo por tema (`code-style.md`, `testing.md`, `security.md`, `api.md`); `~/.claude/rules/` a nivel usuario.
- Frontmatter `paths:` activa la rule al leer un archivo en el glob (en el demo-repo, un `.py` bajo `backend/`).
- Otras herramientas tienen su equivalente con formato propio (p. ej. `.cursor/rules/`); no son compatibles entre sí.
**Plantilla obligatoria:** misma de 6 sub-secciones.
**Animations / interactive:** Tarjeta de plantilla. Extracto textual de `api.md` con frontmatter. Lista con las 4 rules del demo-repo y su comportamiento.
**Mini-demo:** `/context` antes, durante y después de leer `backend/routers/users.py`. Plan B por comportamiento: la instrucción de regenerar `openapi.yaml` vive solo en `api.md` (se sacó del `CLAUDE.md` del demo-repo para que el contraste funcione).
**Slide budget actual:** 9 slides.

## Section 9: `settings.json` (config del runtime)
**Source material:** `source_material/09-settings-json.md`
**Through-line:** Archivo JSON que configura el runtime de Claude Code. NO son instrucciones para el agente (eso es CLAUDE.md/rules); son parámetros del programa que envuelve al LLM, aplicados sin interpretación.
**What students walk away knowing:**
- Precedencia: managed → línea de comandos → local (gitignored) → project → user. Escalares: gana el nivel más alto. Listas de `permissions`: se suman entre niveles.
- Casi todo aplica al guardar (recarga en caliente); `model` se fija al abrir la sesión.
- Campos típicos: `model` (acepta alias), `env`, `permissions` (con `defaultMode`), `hooks`, `attribution` (reemplaza a `includeCoAuthoredBy`), `cleanupPeriodDays`.
- MCP no se configura acá: `.mcp.json` en la raíz del repo.
**Plantilla obligatoria:** misma de 6 sub-secciones.
**Animations / interactive:** Tarjeta de plantilla. Campos top del `.claude/settings.json` del demo-repo.
**Mini-demo:** abrir user / project / local (copiado del `.example`), cambiar `model` de `sonnet` a `haiku` y abrir sesión nueva, `git status` no muestra el local.
**Slide budget actual:** 9 slides.

## Section 10: Permisos (control de tools)
**Source material:** `source_material/10-permisos.md`
**Through-line:** Reglas del runtime que deciden qué tools corren sin preguntar. Viven en `permissions` dentro de settings. Tres listas: `allow` / `deny` / `ask`, evaluadas **deny → ask → allow** (la primera coincidencia decide). Un deny cubre una tool y un patrón, no una intención.
**What students walk away knowing:**
- Sintaxis `Tool(pattern)`: exacto, `Bash(git push *)` (también matchea `git push` a secas), `Bash`/`Bash(*)` = todo, globs de archivo, `WebFetch(domain:…)`.
- Sin coincidencia decide el modo (en Manual, pregunta). Las lecturas no piden permiso.
- Bloque `permissions` real del demo-repo (8 allow / 3 deny / 2 ask).
- Seis permission modes en una sola tabla (`plan`, `default`/Manual, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`); `auto` es el arranque en planes Pro/Max/Team; los deny bloquean en todos los modos. `plan` se desarrolla en §13.
**Plantilla obligatoria:** misma de 6 sub-secciones.
**Animations / interactive:** Tarjeta de plantilla. Code block JSON del bloque `permissions`. Tabla de los 6 modes.
**Mini-demo:** "corré los tests" → prompt de `uv run pytest` (no está en allow) → "Yes, and don't ask again" escribe la regla en local → repetir pasa sin prompt → deny local `Edit(./openapi.yaml)` le gana al allow del proyecto.
**Slide budget actual:** 11 slides.

## Section 11: Skills y slash commands
**Source material:** `source_material/11-skills-y-slash-commands.md`
**Through-line:** Un mismo mecanismo, dos formas. Skill = directorio con SKILL.md (procedimiento completo, archivos de soporte, Claude puede cargarla por relevancia). Command = un solo archivo en `.claude/commands/`. Ambos crean `/nombre`; si comparten nombre gana la skill. Al arranque solo entra el índice (nombre + descripción); el cuerpo entra a la misma ventana al invocarla (difiere la carga, no aísla). Una skill no es una garantía: el enforcement determinístico está en settings/permisos.
**What students walk away knowing:**
- Estructura del SKILL.md (frontmatter + fases + anti-patterns). Ejemplo: `.claude/skills/add-endpoint/` del demo-repo.
- Command de un archivo como atajo corto. Ejemplo: `.claude/commands/pre-pr.md`.
- `/memory`, `/context`, `/permissions` son built-ins del CLI, no archivos.
**Plantilla obligatoria:** misma de 6 sub-secciones.
**Animations / interactive:** Tarjeta de plantilla. Tabla skill vs command. SKILL.md y `pre-pr.md` como código.
**Mini-demo:** `/context` muestra la skill en el índice; pedido en prosa "agregá un endpoint GET /users/{user_id}/posts…" activa la skill y recorre las fases; contraste parcial en una copia sin `.claude/skills/` (CLAUDE.md y rules siguen cubriendo parte). Plan B: `/add-endpoint …` directo.
**Slide budget actual:** 9 slides.

## Section 12: Sub-agents
**Source material:** `source_material/12-sub-agents.md`
**Through-line:** Instancia separada del loop con su propia ventana de contexto. Al padre solo vuelve el resultado.
**What students walk away knowing:**
- Sub-agent NO es "otra IA": por default usa el modelo del padre y hereda sus tools, aislado en otra ventana.
- Definición con frontmatter: `name`, `description`, `tools` (si se omite hereda todas; si se declara, restringe), `model` opcional. Ejemplo: `.claude/agents/researcher.md` (Read, Grep, Glob).
- Built-in: `Explore`, `Plan`, `general-purpose`. El padre invoca con la tool `Agent`, a pedido tuyo o por su cuenta según la `description`.
- El padre ve solo el resultado, no el razonamiento → la delegación no exime de supervisar. Paralelización es beneficio secundario; el motivo principal es proteger el contexto.
**Plantilla obligatoria:** misma de 6 sub-secciones.
**Animations / interactive:** Tarjeta de plantilla. Diagrama del padre + sub-loop con flechas "baja la tarea" / "sube solo el resultado".
**Mini-demo:** `/context` como línea base; "sin usar sub-agents, explicame cómo funciona la auth de punta a punta" inline vs la misma pregunta delegada a `researcher`; delta chico porque el repo es chico. Mostrar `tools:` en `researcher.md`.
**Slide budget actual:** 9 slides.

## Section 13: Plan mode
**Source material:** `source_material/13-plan-mode.md`
**Through-line:** Un alto deliberado antes de editar. Claude lee, corre comandos para explorar y propone; no edita hasta que aprobás. Uno de los seis permission modes (la tabla vive en §10).
**What students walk away knowing:**
- Activación: `Shift+Tab` (default → acceptEdits → plan), `/plan <prompt>`, `claude --permission-mode plan`, `permissions.defaultMode: "plan"`.
- Flujo: Claude presenta el plan con `ExitPlanMode`; vos elegís "Yes, and use auto mode" / "Yes, manually approve edits" / "No, keep planning"; `Ctrl+G` edita el plan. Aprobar cambia al modo elegido; deny/ask siguen aplicando.
- Criterios para elegir modo según el costo de un error. Plan mode = defensa más barata contra la deriva.
- Plan mode no es sandbox; aprobar el plan no aprueba cada comando.
**Plantilla obligatoria:** misma de 6 sub-secciones.
**Animations / interactive:** Tarjeta de plantilla. Tabla de criterios por costo de error. Ejemplo de plan sobre la tarea real de la demo.
**Mini-demo:** "extraé el patrón get-or-404 de users.py y posts.py a un helper compartido". En Manual edita de inmediato (`Edit(./backend/**)` está en allow) → Esc y `git checkout .`. En plan propone → "No, keep planning" con una corrección → "Yes, manually approve edits".
**Slide budget actual:** 10 slides.

## Section 14: El trabajo final
**Source material:** `source_material/14-trabajo-final.md`
**Through-line:** Modelo + rol + runtime (+ el flujo y las integraciones de las clases 6–7) se usan al mismo tiempo en un proyecto real. El trabajo final no examina sintaxis: examina si sabés *dirigir*. Apropiación = poder explicar, corregir y extender lo que el agente escribió.
**What students walk away knowing:**
- **Modalidad (cambio 2026-09-14):** grupos de 2. La carpeta `tp-final/` vive en el repo de uno de los integrantes; el otro es colaborador. Defensa conjunta. (`programa.md` y S00 todavía dicen "individual": pendiente deliberado.)
- Qué se entrega: `tp-final/` con el producto, el README como informe, la evidencia del proceso (commits, branches, PRs) y la configuración del agente versionada (`.claude/` o el equivalente de otra herramienta).
- Criterios alineados con el Demo Day del programa: especificación, gestión de contexto, detección y corrección de la deriva, evidencia del flujo en el repo.
- Exposición de la idea (clase 5): cada grupo presenta problema, usuarios, MVP y stack en 5 minutos y recibe devolución sobre alcance y viabilidad.
**Animations / interactive:** Arco del curso sin etiquetas de semana (modelo → rol → runtime → flujo e integraciones → trabajo final). No es la última clase: cierra la unidad.
**Slide budget actual:** 6 slides.
