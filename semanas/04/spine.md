# Spine — Semana 04: Fundamentos de Agentic AI y Claude Code

**Whole-week through-line:** Una IA que *actúa* (no que sugiere) se dirige con un set de herramientas conceptuales más amplio que "escribir un buen prompt". La parte 1 (§1–§5) construye un marco de **tres ingenierías anidadas** — `prompt ⊂ context ⊂ harness` — sin nombrar ninguna herramienta. La parte 2 (§6–§13) baja el harness a configuración: primero los controles que se eligen al abrir una sesión (model, effort, permission mode), después las seis piezas configurables del runtime (mapa en §7.0), una por sección (§7–§12), cada una con su equivalente en Codex y OpenCode, y cierra con el trabajo final (§13). Prompt engineering ya lo venían practicando; lo que esta clase abre son los dos niveles nuevos.

**Dispositivos pedagógicos de toda la semana:**
- **Las tres ingenierías como marco**: se introducen anidadas en §3.3 (`prompt ⊂ context ⊂ harness`), §4 desarrolla **context engineering** completo, §5 desarrolla **harness engineering** completo, §5.4 cierra Parte 1 con el recap de los 3 niveles. §7.0 mapea las seis piezas del runtime a las dimensiones del harness.
- **Animación del loop (bespoke, nueva)**: una sola animación JS nueva en todo el deck (`four-loop-anim.js`). Cicla pensar → actuar → observar → repetir con las 4 condiciones de corte como chips de salida. Se introduce en §2.1 (ReAct) y se re-conduce en §2.2 (fragment-driven highlight de cada fase). El modo `cc` quedó sin uso tras el rediseño de §6.
- **Equivalencias entre harness (2026-09-16)**: cada pieza de la Parte 2 se muestra en Claude Code (donde corren las demos) y en Codex y OpenCode, con la clase compartida `.harness-map` de `_config/theme/components.css` (variante `is-large` cuando el mapa ocupa el slide solo). Las afirmaciones sobre Codex salen de `learn.chatgpt.com/docs` (la doc se mudó desde `developers.openai.com/codex`); las de OpenCode, de `opencode.ai/docs` y del código de `sst/opencode`. No entran a slides las que no se pudieron confirmar en documentación: el ciclo detallado de plan mode en Codex, el namespacing de commands en OpenCode, el orden de concatenación de `AGENTS.md` anidados y la carga de `AGENTS.md` anidados al leer archivos en OpenCode (está en el código, no en la doc).
- **Costura parte 1 / parte 2**: `section-divider` fuerte entre §5 y §6 ("Parte 2 — Configurar el harness"). §1–§5 nunca nombran Claude Code. §6 revela que el loop abstracto de §2 tiene nombre propio, presenta Claude Code como un harness entre varios y mapea sus piezas configurables al harness de §5.

**Nota de escala:** 13 secciones, 98 slides. Seis demos en vivo en la Parte 2, una por sección de §7 a §12; la de plan mode se eliminó con su sección el 2026-09-16. Es una clase larga, dictada en 2 sesiones. Desde el 2026-09-16 la primera sesión termina en §6 con la consigna del planteo del trabajo final (§6.9), y la segunda arranca en §7 con el mapa de las seis piezas.

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
**Through-line:** Acabamos de cerrar context engineering. **Falta el nivel exterior**: el entorno donde opera el agente. Harness — literalmente, el arnés del caballo: lo que canaliza la potencia del modelo en la dirección que querés. **No es pedirle al modelo que se comporte ("no cometas errores"), es diseñar el entorno para que tire de la carreta**. La disciplina se divide en 8 dimensiones y cada una tiene análogo en lo que se configura en un harness real, motivando la Parte 2.
**Hook (§5.1):** Metáfora del caballo en 3 tiempos. Entry: solo la etimología ("harness = arnés"). Primer reveal: imagen `caballo-descontrolado.png` + caption irónico "no cometas errores" (en mono, como prompt fallido). Segundo reveal: imagen `caballlo-harness.png` + caption "Harness Engineering". El contraste visual hace el argumento sin texto explicativo.
**What students walk away knowing:**
- Harness engineering = **diseñar el arnés que canaliza al modelo**, no pedirle que se comporte solo.
- **Ocho dimensiones** del harness (grid 4×2 con reveals progresivos), elegidas para que cada una tenga análogo directo en lo que se configura en un harness real (Claude Code, Codex, opencode): (1) instrucciones persistentes; (2) skills y comandos; (3) tools disponibles, incluidos servidores externos; (4) permisos; (5) selección de modelo; (6) selección de effort; (7) hooks (scripts que dispara el runtime ante eventos: antes/después de una tool, al abrir o cerrar sesión; ahí viven los tests y linters automáticos); (8) sub-agentes (qué se delega a otra ventana, con sus propias tools y modelo). "Manejo del contexto" se descartó el 2026-09-16 por ser context engineering, no harness. Rediseño del 2026-09-16: las anteriores eran abstractas ("estructurás el prompt", "armás feedback loops") y no mapeaban a nada configurable.
- **Cierre de Parte 1** (recap tres ingenierías): grilla con prompt / context / harness ("la capa de runtime que persiste entre sesiones") y la línea bridge: el programa externo que envuelve al modelo *se diseña*, y lo que persiste de una sesión a otra vive en archivos que podés leer y cambiar. Sin nombrar Claude Code: el mapeo harness → piezas del runtime vive en §7.0.
**Animations / interactive:** CSS-only. Reveals progresivos en la metáfora del caballo (las dos imágenes aparecen una por una), en la grilla de 8 dimensiones (una card por reveal) y en el recap final (las 3 cards + bridge revealed). Sin JS de animación nuevo. Imágenes en `../img/caballo-descontrolado.png` y `../img/caballlo-harness.png`.
**Slide budget actual:** 3 slides (opener caballo → 8 dimensiones → cierre tres ingenierías + bridge a Parte 2). La slide "Harness en Claude Code" se movió a §6.5 en la revisión del 2026-09-14; la slide "La frontera con context engineering" se eliminó el 2026-09-16: nombraba Claude Code antes del divider y mapeaba features que no se desarrollan (MCP, hooks, eval loops).

---

# Parte 2 — Configurar el harness (§6–§13)

> **Rediseño 2026-05-19.** Parte 2 recorre las piezas configurables del runtime, una por sección, con la plantilla documentation-walkthrough: *qué es / dónde vive / cuándo se carga / cómo se usa / qué confunde*, más una mini-demo como slide aparte. La tarjeta de 5 preguntas abre cada sección y se repite como mini-strip en los slides de contenido. **El `.lens-tracker` se eliminó.**
>
> **Rediseño 2026-09-16.** La Parte 2 deja de ser sobre Claude Code y pasa a ser sobre configurar un harness, con Claude Code como implementación de referencia (ahí corren las demos). Tres cambios: (1) model, effort y permission modes se presentan en §6, antes de las piezas, porque son lo primero que se ve al abrir una sesión; (2) plan mode deja de ser sección propia (era §13): es una posición del dial de modes, y lo portable de esa sección (cuál mode usar, qué debe contener un plan, la definición de deriva) pasó a §6; la demo de plan mode no se rescató; (3) cada sección §7–§12 suma un slide "§N.3b" después de "Dónde vive" con la misma pieza en Codex y OpenCode. El trabajo final pasó de §14 a §13.

## Section 6: Claude Code es ese loop, y un harness entre varios
**Source material:** `source_material/06-claude-code-es-el-loop.md`. No cubre effort, modes ni equivalencias: esas slides salen de la doc oficial de los tres harness, verificada el 2026-09-16.
**Through-line:** Claude Code no es un concepto nuevo: es el loop pensar → actuar → observar con nombre propio, y uno de varios harness (Codex y OpenCode corren el mismo loop con sus propios archivos). Qué es, qué carga al arrancar, qué es una sesión. Después, los tres controles que elegís al abrir la sesión: model, effort y permission mode. Recién entonces el mapa de las seis piezas que viven en archivos.
**What students walk away knowing:**
- **Qué es, qué carga, qué es una sesión (§6.2–§6.4), con equivalencias desde 2026-09-16:** §6.2 describe cada tool en una línea, aclara que en macOS, Linux y WSL `Grep` y `Glob` no vienen por defecto (Claude busca con `grep` y `find` vía `Bash`; `code.claude.com/docs/en/tools-reference`) y que en otro harness cambian los nombres de las tools (Codex edita con `apply_patch`) pero no las categorías. §6.3 suma qué carga al arrancar cada harness (`AGENTS.md` + `config.toml` en Codex; `AGENTS.md` + `opencode.json` en OpenCode, sin memoria). §6.4 suma los comandos de sesión: `/compact` en los tres; ventana limpia `/new` en Codex y OpenCode; retomar con `codex resume --last` o `/resume`, y `opencode --continue` o `/sessions`.
- **Model y effort (§6.5):** model = qué modelo corre el loop; effort = cuánto razona antes de cada acción (más effort, más tokens de razonamiento: ocupan ventana y se cobran como salida; conecta con §4). Claude Code: `/model`, `/effort`, `--model`, `--effort`, `model` y `effortLevel` en settings; niveles `low` · `medium` · `high` · `xhigh` · `max`, default `high` (verificado en `code.claude.com/docs/en/model-config`; `ultracode` es un setting aparte, no un nivel). Codex: `/model` elige modelo y effort, `model_reasoning_effort` en `config.toml`, y `plan_mode_reasoning_effort` aparte. OpenCode: `/models`, `"model": "proveedor/modelo"`, effort como variants del modelo que se ciclan con `ctrl+t`.
- **El dial de modes (§6.6, movido de §10.9):** tabla de dos columnas (mode / qué corre sin preguntar) con los seis modes; `auto` es el arranque en Pro/Max/Team. Equivalencias: Claude Code `Shift+Tab` cicla `default` → `acceptEdits` → `plan` (desde `auto`, el primer toque va a `default`; la barra de estado muestra `⏸ plan mode on`, `⏵⏵ accept edits on`, etc., verificado en `code.claude.com/docs/en/permission-modes`); Codex parte el dial en dos ejes (`--sandbox` y `--ask-for-approval`) y tiene `/plan`; en OpenCode `plan` es un agente que se cambia con `Tab`, y deja bash abierto por defecto. Callout: plan mode no es sandbox, frena la edición y no la ejecución.
- **Cuál mode usar (§6.7, de la §13 vieja):** criterio por costo del error, no por velocidad.
- **Lo que un plan debería contener (§6.8, de la §13 vieja):** deriva como motivación (se define acá; §13.4 la usa como criterio de evaluación), Objetivo / Archivos / Pasos / Verificación sobre la tarea get-or-404 del demo-repo. En notas, las tres opciones de aprobación de Claude Code ("Yes, and use auto mode" / "Yes, manually approve edits" / "No, keep planning").
- **Consigna (§6.9, cierre de la primera sesión):** para la próxima clase, en grupos de 2, cada grupo presenta en 5 minutos la idea de su trabajo final (una aplicación con interfaz, servidor y datos que persisten): problema, usuarios, MVP y stack. Se presenta la idea, o como mucho un avance; no una versión terminada. La devolución es sobre alcance y viabilidad. La slide se entiende sola porque llega antes que §13, que desarrolla el trabajo final.
**Animations / interactive:** CSS-only, sin fragments. `section-divider` fuerte para abrir la Parte 2. `.s6-ctrl` (dos cards) + `.harness-map` en §6.5; tabla `.s6-modes-table` + `.harness-map.s6-dial-map` + callout en §6.6 (el slide más alto de la sección: 717 px de 800).
**Slide budget actual:** 9 slides (divider → qué es → qué pasa al ejecutar `claude` → qué es una sesión → model y effort → dial de modes → cuál mode usar → qué debe contener un plan → consigna del planteo del trabajo final). El mapa de las seis piezas pasó a §7.0 el 2026-09-16.

## Section 7: CLAUDE.md y memoria automática
**Source material:** `source_material/07-CLAUDE-md.md`
**Through-line:** Archivos markdown leídos al arranque de cada sesión; texto tuyo que entra a la ventana como mensaje después del system prompt (no es el system prompt). Cuatro ubicaciones concatenadas (no override). Auto memory como sistema distinto que escribe Claude.
**What students walk away knowing:**
- **Mapa de las seis piezas (§7.0, movido desde §6.9 el 2026-09-16):** `CLAUDE.md`, Rules, `settings.json`, Permisos, Skills y slash commands, Sub-agents, cada una con su dimensión del harness. Abre la segunda sesión de la clase. Hooks y servidores externos quedan para las clases siguientes.
- CLAUDE.md siempre cuesta contexto. Orden de carga: managed (path fijo por OS) → user (`~/.claude/CLAUDE.md`) → CLAUDE.md de cada directorio ancestro desde la raíz hasta el CWD → `CLAUDE.local.md`. Los de subdirectorios debajo del CWD cargan bajo demanda.
- `@import` no ahorra contexto (hasta 4 saltos). Comentarios HTML descartados. Guía <200 líneas.
- Auto memory: directorio `~/.claude/projects/<project>/memory/` con `MEMORY.md` como índice (se cargan las primeras 200 líneas o 25 KB) y archivos por tema leídos bajo demanda.
- **Equivalencias (§7.3b):** Codex y OpenCode usan `AGENTS.md`. Codex lee uno en `~/.codex/` y uno por directorio desde la raíz del repo hasta el CWD, y los concatena, sin `@import`. OpenCode lee `CLAUDE.md` si no encuentra `AGENTS.md`, y suma archivos con `instructions` en `opencode.json`. Memoria automática: Claude Code sí; Codex sí, apagada por defecto; OpenCode no tiene.
**Animations / interactive:** Tarjeta de plantilla. Tabla de las 4 ubicaciones y diagrama del orden de carga. Extracto del `CLAUDE.md` del demo-repo. `.harness-map.is-large`.
**Mini-demo (único bloque al final):** setup común (copia fuera del repo del curso, `git init`, `cp .env.example .env`, `uv sync`, `claude --permission-mode default`). `/context` muestra qué está cargado; `/memory` muestra las ubicaciones posibles; carpeta de auto memory (arranca vacía en la copia). Plan B en notas.
**Slide budget actual:** 12 slides (mapa de las seis piezas + opener + 10).

## Section 8: Rules (`.claude/rules/`)
**Source material:** `source_material/08-rules.md`
**Through-line:** Archivos `.md` modulares de instrucciones. Sin `paths:` = siempre cargados (ventaja organizativa sobre CLAUDE.md monolítico). Con `paths:` + globs = path-scoped: entran cuando Claude lee un archivo que matchea. **Reencuadre 2026-09-16:** el concepto que se enseña es la carga condicional (instrucciones que entran solo cuando importan); la forma declarativa por glob es, hoy, exclusiva de Claude Code, y eso se dice.
**What students walk away knowing:**
- Estructura de `.claude/rules/` con un archivo por tema (`code-style.md`, `testing.md`, `security.md`, `api.md`); `~/.claude/rules/` a nivel usuario.
- Frontmatter `paths:` activa la rule al leer un archivo en el glob (en el demo-repo, un `.py` bajo `backend/`).
- **Equivalencias (§8.3b):** la única pieza sin equivalente directo. Codex aproxima con `AGENTS.md` por carpeta (scope por directorio, decidido al arrancar); OpenCode con `instructions`, cuyos globs eligen qué archivos cargar pero no cuándo (entran todos al arrancar).
- La compatibilidad entre herramientas es parcial (§8.7, caso 1): Cursor usa `.cursor/rules/`; OpenCode lee `CLAUDE.md` y las skills, pero no `.claude/rules/`.
**Plantilla obligatoria:** misma de 5 preguntas + demo.
**Animations / interactive:** Tarjeta de plantilla. Extracto textual de `api.md` con frontmatter. Lista con las 4 rules del demo-repo y su comportamiento. `.harness-map.is-large`.
**Mini-demo:** `/context` antes, durante y después de leer `backend/routers/users.py`. Plan B por comportamiento: la instrucción de regenerar `openapi.yaml` vive solo en `api.md` (se sacó del `CLAUDE.md` del demo-repo para que el contraste funcione).
**Slide budget actual:** 10 slides.

## Section 9: `settings.json` (config del runtime)
**Source material:** `source_material/09-settings-json.md`
**Through-line:** Archivo JSON que configura el runtime de Claude Code. NO son instrucciones para el agente (eso es CLAUDE.md/rules); son parámetros del programa que envuelve al LLM, aplicados sin interpretación.
**What students walk away knowing:**
- Precedencia: managed → línea de comandos → local (gitignored) → project → user. Escalares: gana el nivel más alto. Listas de `permissions`: se suman entre niveles.
- Casi todo aplica al guardar (recarga en caliente); `model` se fija al abrir la sesión.
- Campos típicos: `model` (acepta alias), `env`, `permissions` (con `defaultMode`), `hooks`, `attribution` (reemplaza a `includeCoAuthoredBy`), `cleanupPeriodDays`. Ojo: `defaultMode: "auto"` no tiene efecto desde el `settings.json` del proyecto, solo desde el de usuario o managed.
- MCP no se configura acá: `.mcp.json` en la raíz del repo.
- **Equivalencias (§9.3b):** Codex usa `config.toml` (TOML; el de proyecto solo carga si el repo está marcado como confiable); OpenCode usa `opencode.json` (JSON con comentarios, global y proyecto se mergean, acepta `{env:VAR}` y `{file:ruta}`). Cambia el formato, no la cascada.
**Plantilla obligatoria:** misma de 5 preguntas + demo.
**Animations / interactive:** Tarjeta de plantilla. Campos top del `.claude/settings.json` del demo-repo. `.harness-map.is-large`.
**Mini-demo:** abrir user / project / local (copiado del `.example`), cambiar `model` de `sonnet` a `haiku` y abrir sesión nueva, `git status` no muestra el local.
**Slide budget actual:** 10 slides.

## Section 10: Permisos (control de tools)
**Source material:** `source_material/10-permisos.md`
**Through-line:** Reglas del runtime que deciden qué tools corren sin preguntar. Viven en `permissions` dentro de settings. Tres listas: `allow` / `deny` / `ask`, evaluadas **deny → ask → allow** (la primera coincidencia decide). Un deny cubre una tool y un patrón, no una intención.
**What students walk away knowing:**
- Sintaxis `Tool(pattern)`: exacto, `Bash(git push *)` (también matchea `git push` a secas), `Bash`/`Bash(*)` = todo, globs de archivo, `WebFetch(domain:…)`.
- Sin coincidencia decide el mode (el dial de §6.6; en Manual, pregunta). Las lecturas no piden permiso. La tabla de modes se movió a §6 el 2026-09-16.
- Bloque `permissions` real del demo-repo (8 allow / 3 deny / 2 ask).
- **Equivalencias (§10.3b), la más importante de la Parte 2:** el gate antes de ejecutar es universal; la resolución de conflictos no. Claude Code: `deny` gana siempre. Codex: tres sistemas (sandbox, `approval_policy`, archivos `.rules`). OpenCode: gana la última regla que matchea, así que `"rm *": "deny", "*": "allow"` deja pasar `rm -rf`.
**Plantilla obligatoria:** misma de 5 preguntas + demo.
**Animations / interactive:** Tarjeta de plantilla. Code block JSON del bloque `permissions`. `.harness-map.is-large`.
**Mini-demo:** "corré los tests" → prompt de `uv run pytest` (no está en allow) → "Yes, and don't ask again" escribe la regla en local → repetir pasa sin prompt → deny local `Edit(./openapi.yaml)` le gana al allow del proyecto.
**Slide budget actual:** 11 slides.

## Section 11: Skills y slash commands
**Source material:** `source_material/11-skills-y-slash-commands.md`
**Through-line:** Un mismo mecanismo, dos formas. Skill = directorio con SKILL.md (procedimiento completo, archivos de soporte, Claude puede cargarla por relevancia). Command = un solo archivo en `.claude/commands/`. Ambos crean `/nombre`; si comparten nombre gana la skill. Al arranque solo entra el índice (nombre + descripción); el cuerpo entra a la misma ventana al invocarla (difiere la carga, no aísla). Una skill no es una garantía: el enforcement determinístico está en settings/permisos.
**What students walk away knowing:**
- Estructura del SKILL.md (frontmatter + fases + anti-patterns). Ejemplo: `.claude/skills/add-endpoint/` del demo-repo.
- Command de un archivo como atajo corto. Ejemplo: `.claude/commands/pre-pr.md`.
- `/memory`, `/context`, `/permissions` son built-ins del CLI, no archivos.
- **Equivalencias (§11.3b):** la pieza donde más convergieron. Mismo formato `SKILL.md` en los tres. Codex en `.agents/skills/`, invocación con `$nombre`, custom prompts deprecados en favor de skills. OpenCode en `.opencode/skills/` y además lee `.claude/skills/`; commands en `.opencode/commands/`.
**Plantilla obligatoria:** misma de 5 preguntas + demo.
**Animations / interactive:** Tarjeta de plantilla. Tabla skill vs command. SKILL.md y `pre-pr.md` como código. `.harness-map.is-large`.
**Mini-demo:** `/context` muestra la skill en el índice; pedido en prosa "agregá un endpoint GET /users/{user_id}/posts…" activa la skill y recorre las fases; contraste parcial en una copia sin `.claude/skills/` (CLAUDE.md y rules siguen cubriendo parte). Plan B: `/add-endpoint …` directo.
**Slide budget actual:** 10 slides.

## Section 12: Sub-agents
**Source material:** `source_material/12-sub-agents.md`
**Through-line:** Instancia separada del loop con su propia ventana de contexto. Al padre solo vuelve el resultado.
**What students walk away knowing:**
- Sub-agent NO es "otra IA": por default usa el modelo del padre y hereda sus tools, aislado en otra ventana.
- Definición con frontmatter: `name`, `description`, `tools` (si se omite hereda todas; si se declara, restringe), `model` opcional. Ejemplo: `.claude/agents/researcher.md` (Read, Grep, Glob).
- Built-in: `Explore`, `Plan`, `general-purpose`. El padre invoca con la tool `Agent`, a pedido tuyo o por su cuenta según la `description`.
- El padre ve solo el resultado, no el razonamiento → la delegación no exime de supervisar. Paralelización es beneficio secundario; el motivo principal es proteger el contexto.
- **Equivalencias (§12.3b):** mismo aislamiento en los tres. Codex define cada sub-agent en `.codex/agents/*.toml` como una capa de config completa (modelo, effort y sandbox propios; built-in `explorer`, `worker`). OpenCode en `.opencode/agents/*.md`, invocación con `@nombre` y sesiones hijas que se pueden recorrer mientras trabajan.
**Plantilla obligatoria:** misma de 5 preguntas + demo.
**Animations / interactive:** Tarjeta de plantilla. Diagrama del padre + sub-loop con flechas "baja la tarea" / "sube solo el resultado". `.harness-map.is-large`.
**Mini-demo:** `/context` como línea base; "sin usar sub-agents, explicame cómo funciona la auth de punta a punta" inline vs la misma pregunta delegada a `researcher`; delta chico porque el repo es chico. Mostrar `tools:` en `researcher.md`.
**Cierre:** el bridge apunta al trabajo final (antes apuntaba a plan mode).
**Slide budget actual:** 10 slides.

## Section 13: El trabajo final
**Source material:** `source_material/14-trabajo-final.md`
**Through-line:** Modelo + rol + runtime (+ el flujo y las integraciones de las clases 6–7) se usan al mismo tiempo en un proyecto real. El trabajo final no examina sintaxis: examina si sabés *dirigir*. Apropiación = poder explicar, corregir y extender lo que el agente escribió.
**What students walk away knowing:**
- **Modalidad (cambio 2026-09-14):** grupos de 2. La carpeta `tp-final/` vive en el repo de uno de los integrantes; el otro es colaborador. Defensa conjunta. (`programa.md` y S00 todavía dicen "individual": pendiente deliberado.)
- Qué se entrega: `tp-final/` con el producto, el README como informe, la evidencia del proceso (commits, branches, PRs) y la configuración del agente versionada (`.claude/` o el equivalente de otra herramienta).
- **Checklist de la configuración (§13.3), por concepto desde 2026-09-16:** instrucciones del proyecto (`CLAUDE.md` o `AGENTS.md`), instrucciones por tema con scope por path si la herramienta lo permite, config del runtime con permisos pensados para el proyecto, al menos una skill propia, un sub-agent si se justifica, plan mode durante el desarrollo. Ya no exige `paths:` literal.
- Criterios alineados con el Demo Day del programa: especificación, gestión de contexto, detección y corrección de la deriva, evidencia del flujo en el repo.
- Exposición de la idea (clase 5): cada grupo presenta problema, usuarios, MVP y stack en 5 minutos y recibe devolución sobre alcance y viabilidad.
**Animations / interactive:** Arco del curso sin etiquetas de semana (modelo → rol → runtime → flujo e integraciones → trabajo final). No es la última clase: cierra la unidad.
**Slide budget actual:** 6 slides.
