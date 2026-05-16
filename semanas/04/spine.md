# Spine — Semana 04: Fundamentos de Agentic AI y Claude Code

**Whole-week through-line:** Una IA que *actúa* (no que sugiere) se dirige entendiendo solo **dos cosas**: el loop que ejecuta (pensar → actuar → observar, hasta una condición de corte) y el contexto finito con el que trabaja. La parte 1 (§1–§5) las enseña agnósticas, sin nombrar ninguna herramienta. La parte 2 (§6–§12) revela que cada feature de Claude Code — CLAUDE.md, rules, skills, sub-agents, plan mode, permisos — **no es una feature más en una lista: es una palanca sobre el loop o sobre el contexto**. El alumno sale de la clase pudiendo clasificar cualquier herramienta nueva con una sola pregunta: *¿actúa sobre el loop o sobre el contexto?*

**Dispositivos pedagógicos de toda la semana:**
- **Tracker "¿loop o contexto?"**: a partir de §6, cada sección de la parte 2 abre con el mismo visual donde la pregunta-lente aterriza en *contexto* (§7–§10) o *loop* (§11). El flip a *loop* en §11 — el primero de la parte 2 — es deliberado y es el hook de esa sección. Funciona igual que el `pipeline-roadmap` reusado de semana 03: un visual que se re-ilumina por sección.
- **Animación del loop (bespoke, nueva)**: una sola animación JS nueva en todo el deck. Cicla pensar → actuar → observar → repetir y muestra las 4 condiciones de corte como salidas. Se introduce en §2 y se re-conduce (resaltando otra fase / otro estado) en §3, §4, §5, §6, §10, §11. Es su propia tarea de plan.
- **Tricotomía construida en 3 tiempos**: §4 planta los 3 rótulos (siempre cargado / condicional / autocurado), §8 cierra dos, §9 completa la tabla con el tercero. Mismo visual, se llena progresivamente entre secciones.
- **Costura parte 1 / parte 2**: `section-divider` fuerte entre §5 y §6. §1–§5 no nombran Claude Code; §6 revela que el loop abstracto del §2 era Claude Code todo el tiempo.

**Nota de escala:** 12 secciones, ~194 min de contenido (suma de bloques de `source_material/index.md`). Con tratamiento estructurado de demos (~9 demos en vivo, cada una divider + beats + cierre) el deck será grande (~100–125 slides). Es una clase larga, probablemente dictada en 2 sesiones; la costura parte 1 / parte 2 es el corte natural si se parte.

---

## Section 1: De escribir a actuar
**Source material:** `source_material/01-de-escribir-a-actuar.md`
**Through-line:** El cambio de paradigma no es que "la IA escriba mejor" — eso sería más de lo mismo. Es que la IA ahora *actúa*: cierra el loop sobre tu repo sin que vos intervengas en cada vuelta. Dirigir algo que actúa exige dos conceptos nuevos (el loop y el contexto), que son el mapa de toda la clase.
**Hook:** La última vez que le pediste a una IA que arreglara un endpoint: copiaste el error, lo pegaste, copiaste el código, lo pegaste, corriste, viste un 500 distinto, volviste al chat. Cada vuelta de esa rueda la hacías vos. *Vos eras el que corría el loop.*
**What students walk away knowing:**
- Son dos paradigmas distintos, no versiones mejor/peor de lo mismo: IA que sugiere + vos conducís, vs. agente que planifica y ejecuta en loop; el LLM debajo puede ser el mismo, lo que cambia es la arquitectura encima.
- Traer el modelo mental del chat al agente es peligroso: en el chat el peor caso es alucinar una función inexistente; en el agente, alucinar y ejecutar un comando de borrado.
- El rol de supervisor (semanas 2–3) no desaparece; se le agregan dos conceptos: el loop y el contexto. Hoy no aprendés una herramienta — aprendés la máquina que vas a dirigir el resto del curso.
**Animations / interactive:** None new. `comparison-2col` para los dos paradigmas. La animación del loop se introduce recién en §2 (acá todavía no se nombra el ciclo en detalle).
**Slide budget:** 5–7

## Section 2: El loop — pensar, actuar, observar
**Source material:** `source_material/02-el-loop-agentic.md`
**Through-line:** La diferencia entre un chat que sugiere y un agente que resuelve no está en el modelo de adentro: está en que el agente no da una respuesta, entra en un loop (pensar → actuar → observar) que se repite hasta una condición de corte. Un agente = LLM + loop + tools + entorno; sin condición de corte el loop no converge.
**Hook:** "Arreglá el bug." Una sola línea. ¿Por qué eso no alcanza para que el agente termine? Porque el modelo todavía no vio el error — le pediste que arregle algo que no puede ver.
**What students walk away knowing:**
- El loop tiene 3 fases que se *alternan* (ReAct: razonar y actuar entrelazados), no etapas separadas; se ven concretas en un trace real (correr tests → `AssertionError 200/404` → corregir el path → suite verde).
- Un agente son 4 piezas necesarias en conjunto (LLM + loop + tools + entorno); cuando algo falla, el diagnóstico empieza por "¿cuál de las 4?".
- Cuatro condiciones de corte que aparecen en la práctica: objetivo alcanzado / límite de pasos / el agente pide ayuda / falla no recuperable. Sin condición de corte el loop da vueltas sin converger.
**Animations / interactive:** **Bespoke loop animation — NUEVA, se introduce acá.** Ciclo pensar → actuar → observar → repetir con las 4 salidas (condiciones de corte). Es su propia tarea de plan. El trace concreto (ejemplo pytest) puede ir como `code-walkthrough` o `flow-with-arrows` paso a paso.
**Mini-demo (estructurado):** "El loop desnudo" (3 beats: tarea verificable → narrar fases en pantalla → señalar la corrección como otra vuelta). Plan B: tarea más abierta o grabación.
**Slide budget:** 11–14

## Section 3: Tools — las manos del agente
**Source material:** `source_material/03-tools-las-manos.md`
**Through-line:** Una tool es el mismo mecanismo de la semana 1 (el modelo emite una llamada estructurada → el runtime la ejecuta → el resultado vuelve al contexto), ahora con un set más amplio que no solo *consulta* el mundo sino que lo *modifica*. El ciclo de una tool mapea exactamente a actuar → observar → pensar del loop del §2.
**Hook:** Callback semana 1: ¿se acuerdan del token especial que pausaba la generación, hacía la búsqueda web y pegaba el resultado de vuelta al contexto? Eso era una tool. Hoy lo mismo, pero las manos llegan más lejos.
**Key analogy:** Tools = las manos del agente. Sin manos, el agente razona sobre lo que haría pero no toca nada.
**What students walk away knowing:**
- La mecánica no cambió desde S1 (llamada estructurada → runtime ejecuta → resultado al contexto); lo que cambió es que ahora el agente *modifica* el entorno, no solo lo consulta.
- El ciclo de una tool *es* el loop del §2: la llamada es "actuar", el resultado es "observar", y eso alimenta el próximo "pensar".
- Cada observación ocupa contexto y no desaparece (semilla del §4); leer = reversible/bajo riesgo, escribir o ejecutar = puede no ser reversible/alto riesgo → el supervisor mira más las tools que actúan sobre el mundo.
**Animations / interactive:** Reusa la animación del loop (re-conducida, resaltando actuar/observar). `flow-with-arrows` para el ciclo de la tool; `comparison-2col` para leer vs. escribir.
**Mini-demo (estructurado):** "La observación entra al contexto" (3 beats: tarea que obliga a leer un archivo → señalar el bloque de observación → tamaño del output vs. contexto total). Plan B: apuntar al bloque de tool output sin `/context`.
**Slide budget:** 9–12

## Section 4: La ventana de contexto es finita
**Source material:** `source_material/04-la-ventana-es-todo.md`
**Through-line:** La working memory del agente (la ventana de contexto) es finita; el loop la llena vuelta a vuelta. Cuando se llena, algo se va o algo para. El context rot — instrucciones del inicio sepultadas bajo observaciones recientes que pesan más — es la consecuencia. Tesis de la clase: dirigir bien un agente no es escribir el mejor prompt de entrada, es mantener la ventana enfocada en lo que importa.
**Hook:** ¿Por qué un agente que venía funcionando de maravilla de repente "olvida" lo que le pediste? ¿Por qué después de treinta herramientas ejecutadas empieza a girar en círculos? La respuesta no está en el modelo: está en el espacio donde el modelo trabaja.
**Key analogy:** Callback semana 1: el conocimiento en los parámetros es un recuerdo vago (algo que leíste hace un mes); lo que está en la ventana es working memory, acceso directo.
**What students walk away knowing:**
- La ventana es finita por propiedad estructural (no un defecto a corregir en la próxima versión); el loop la consume más rápido de lo que intuís — números concretos: ~300 líneas ≈ 1.5–2.5k tokens, ventana ≈ 200k, 20 archivos ≈ 30–50k solo en observaciones.
- Context rot: la instrucción del inicio queda sepultada bajo observaciones recientes que dominan; síntomas reconocibles (contradice restricciones explícitas, repite trabajo hecho, respuestas genéricas, "no recuerda" lo que está en el contexto).
- Gestionar el contexto es la habilidad central. Dos operaciones: compactación (resumir y soltar lastre, no borrar) y reset (empezar limpio cargando solo lo necesario). Adelanto de la tricotomía: **siempre cargado / condicional / autocurado**.
**Animations / interactive:** Reusa la animación del loop, anotada para mostrar que cada vuelta deposita tokens (la ventana se llena). Barra de llenado en HTML/CSS (sin JS nuevo). `data-table` para los números de tokens. El adelanto de la tricotomía planta el visual que §8 y §9 completan.
**Mini-demo (estructurado):** "Context rot y qué sobrevive a /compact" (4 beats: plantar instrucción LISTO → context rot en acto → qué sobrevive a `/compact` → cierre archivo vs. dicho al pasar). Plan B: transcripción guardada; el beat de `/compact` siempre en vivo.
**Slide budget:** 12–15

## Section 5: Cuando el agente falla
**Source material:** `source_material/05-cuando-el-agente-falla.md`
**Through-line:** Un agente que actúa falla de maneras que uno que solo escribe no puede, y la falla deja rastro en el entorno. Cuatro modos nuevos, cada uno conectado a una pieza ya vista. El supervisor no desaparece con la autonomía: cambia *cuándo* mira. Revisión al final es auditoría, no supervisión. Cierre de la parte 1 y montaje de la lente para la parte 2.
**Hook:** Cuando el modelo sugería, el peor caso era una sugerencia mala — la rechazabas. Cuando el agente actúa sobre tu repo, el peor caso es un entorno que ya cambió.
**What students walk away knowing:**
- Cuatro modos de falla nuevos, cada uno anclado a lo anterior: loop infinito (ninguna condición de corte del §2 se cumple), deriva de objetivo, alucinar tools/resultados (la alucinación de S1 ahora *actúa* sobre la premisa falsa), envenenar el propio contexto (la versión activa del context rot del §4).
- El rol del supervisor no se quita con la autonomía: cambia *cuándo* mira. Callback semana 3: "no le creés a la IA, creale a la máquina" — ¿los archivos que dice haber editado cambiaron? ¿el test que dice haber pasado corre? Revisión al final = auditoría, no supervisión.
- Cierre de la parte 1: las 4 piezas (loop / tools con leer-escribir / ventana finita / modos de falla); **todo lo que sigue actúa sobre el loop o sobre el contexto** — esta frase monta la lente de la parte 2.
**Animations / interactive:** Reusa `clickable-steps` para los 4 modos de falla (click → detalle). Reusa la animación del loop para mostrar "loop infinito" (ninguna salida se dispara) y "deriva" (se va del objetivo). Sin demo (el material fuente no tiene una).
**Slide budget:** 7–9

## Section 6: Claude Code es ese loop
**Source material:** `source_material/06-claude-code-es-el-loop.md`
**Through-line:** Claude Code no es un concepto nuevo: es el loop del §2 con nombre propio y pantalla. El desafío la primera vez no es entender qué hace — ya lo sabés — es identificar en qué fase está. Las 4 piezas del §2 mapean 1:1. A partir de acá, cada feature responde la misma pregunta: ¿actúa sobre el loop o sobre el contexto?
**Hook:** Lo que describimos en §2 como pensar → actuar → observar no era un diagrama abstracto. Era la descripción de algo que podés abrir ahora mismo en la terminal y dejar corriendo.
**What students walk away knowing:**
- La pantalla de Claude Code es el loop expuesto vuelta por vuelta: texto razonando (pensar) → tool call `Edit`/`Bash`/`Read`/`Write` (actuar) → resultado (observar) → repetir. No es un log de actividad.
- Las 4 piezas del §2 con herramienta concreta detrás: LLM = Claude; loop = el motor que no para tras la 1ra respuesta; tools = `Edit`/`Bash`/`Read`/`Write`; entorno = tu repo real (cuando corre `npm test`, los tests corren de verdad).
- La pregunta-lente para todo lo que viene: ¿esto actúa sobre cómo corre el loop, o sobre qué hay en el contexto cuando el loop arranca? — se introduce el tracker visible.
**Animations / interactive:** Reusa la animación del loop, ahora anotada con los nombres reales de tools de Claude Code (`Edit`/`Bash`/`Read`). Se **introduce el tracker "¿loop o contexto?"** (dispositivo recurrente del resto de la parte 2). `section-divider` fuerte "Parte 2 — Claude Code" abre la sección (costura parte 1/2).
**Slide budget:** 6–8

## Section 7: CLAUDE.md jerárquico
**Source material:** `source_material/07-CLAUDE-md-jerarquico.md`
**Through-line:** ¿Loop o contexto? **Contexto.** CLAUDE.md es el mecanismo "siempre cargado": texto tuyo inyectado en la ventana antes del primer mensaje, en cada sesión, con o sin relevancia para la tarea. Jerarquía de 4 niveles concatenados (no sobreescritura). `@import` organiza pero no ahorra ni un token. Costo constante.
**Hook:** El tracker "¿loop o contexto?" aterriza en CONTEXTO / siempre cargado (este es el dispositivo que abre cada sección de la parte 2, en lugar de un hook narrativo propio).
**What students walk away knowing:**
- CLAUDE.md = "siempre cargado": todo lo que ponés ahí cuesta contexto en cada sesión sin excepción → es la herramienta más directa para moldear el comportamiento y la que más disciplina exige.
- Jerarquía de 4 niveles (managed policy / usuario / proyecto / local) combinados por concatenación caminando hacia arriba en el árbol; las contradicciones entre niveles no dan error, dan comportamiento impredecible.
- `@import` ayuda a organizar (un archivo por tema, guía <200 líneas) pero los imports se expanden e inyectan igual: no reduce contexto. El CLAUDE.md raíz de este repo como ejemplo vivo.
**Animations / interactive:** Reusa el tracker (aterriza CONTEXTO / siempre cargado). `pipeline-roadmap` o `flow-with-arrows` para los 4 niveles + orden de carga (caminata hacia la raíz); `code-walkthrough` para `@import`.
**Mini-demo D3 (estructurado):** "La ventana antes y después" (3 beats: `/context` sin CLAUDE.md → con CLAUDE.md, delta → `/memory` lista de fuentes). Plan B: solo `/memory`.
**Slide budget:** 8–11

## Section 8: Rules y auto memory
**Source material:** `source_material/08-rules-y-auto-memory.md`
**Through-line:** ¿Loop o contexto? **Contexto.** Dos mecanismos que CLAUDE.md no tiene: condicional (path-scoped rules: cuesta cero contexto hasta que tocás un archivo que matchea el glob) y autocurado (auto memory: el agente escribe sus propios aprendizajes entre sesiones). Juntos cierran el adelanto de la tricotomía del §4.
**Hook:** Tracker en CONTEXTO + reabre la pregunta con la que cerró §7: ¿y si una instrucción pudiera estar en el contexto solo cuando hace falta, y no ocupar espacio el resto del tiempo?
**What students walk away knowing:**
- `.claude/rules/` sin frontmatter = igual que CLAUDE.md (siempre cargado, mismo costo, ventaja solo organizativa) y **no** es `.cursorrules` (mecanismo distinto, no compatible). Con frontmatter `paths:` = condicional: entra solo cuando Claude toca un archivo que matchea el glob; cero contexto hasta entonces.
- Auto memory: la diferencia con CLAUDE.md no es dónde vive el archivo, es *quién lo escribe* (vos vs. Claude). Vive en `~/.claude/projects/<project>/memory/`, local a tu máquina, primeras 200 líneas / 25 KB de `MEMORY.md` al inicio; `/memory` para auditar.
- La tricotomía operacional: lo que siempre aplica → CLAUDE.md; lo que aplica a un área → path-scoped rule; lo que el agente descubre solo → auto memory. Mecanismo equivocado = pagás contexto de más o la instrucción no está cuando hace falta.
**Animations / interactive:** Reusa el tracker (CONTEXTO / condicional + autocurado). `code-walkthrough` para el frontmatter `paths:`. **Visual de la tricotomía construida** (cierra 2 de los 3 rótulos plantados en §4) — reusa `clickable-steps` o `data-table` que se llena progresivamente.
**Mini-demos (estructurado, dos en esta sección):** D8 "La rule condicional" (3 beats: regla existe sin cargar → tocar archivo que no matchea → tocar archivo que matchea); D9 "Auto memory" (3 beats: la corrección que Claude recuerda → nueva sesión, misma corrección aplicada → abrir la carpeta de memoria). Plan B de cada uno: demostrar por comportamiento / sesión previa.
**Slide budget:** 13–16

## Section 9: Skills y slash commands
**Source material:** `source_material/09-skills-y-slash-commands.md`
**Through-line:** ¿Loop o contexto? **Contexto.** Las skills llevan lo condicional un paso más lejos que las path-scoped rules: no instrucciones que aparecen por archivo, sino un *procedimiento completo* que se activa por invocación o relevancia de tarea. No cargada al arranque = cero tokens hasta que se usa. Slash command ≠ skill. La tabla de los 3 mecanismos completa la tricotomía.
**Hook:** Tracker en CONTEXTO + hilo de §8: ¿puede el contexto condicional ir más lejos? Una path-scoped rule entra por archivo; un procedimiento completo no matchea ningún path.
**What students walk away knowing:**
- Una skill = un procedimiento repetible completo (fases, verificaciones, anti-patterns), no una instrucción suelta; no cargada al arranque, cero tokens hasta invocación/relevancia. Ejemplo concreto y meta: `tools/skills/slide-generation/` es la skill que generó esta misma clase.
- Skill ≠ slash command: la skill es la capacidad/procedimiento; el slash command es el disparador/atajo. `/build-class` es una línea que solo invoca la skill — si cambia el pipeline, actualizás la skill, no el comando. Algunos slash commands (`/memory`, `/context`) no invocan ninguna skill.
- La tabla que ordena todo: CLAUDE.md (arranque, siempre) | path-scoped rule (al tocar archivo que matchea) | skill (por invocación/relevancia de tarea) = la tricotomía del §8 completa, con un trigger distinto (archivo vs. procedimiento).
**Animations / interactive:** Reusa el tracker (CONTEXTO / condicional por invocación). **Completa el visual de la tricotomía** del §8 con la tercera fila (mismo visual, ahora cerrado — payoff del adelanto del §4).
**Mini-demo D6 (estructurado):** "La skill on-demand" (3 beats: skill instalada que la sesión no conoce → invocarla → mapa completo de los 3 mecanismos). Momento meta: el demo puede referenciar este mismo deck siendo generado por slide-generation. Plan B: demostrar por comportamiento con una skill del repo.
**Slide budget:** 9–11

## Section 10: Sub-agents — aislar un loop entero
**Source material:** `source_material/10-sub-agents.md`
**Through-line:** ¿Loop o contexto? **Contexto.** Los sub-agents aíslan un *loop entero*: el mismo LLM + loop + tools + entorno instanciado aparte, con su propia ventana que nace y muere con la tarea; al padre solo le vuelve el resultado, no lo que leyó en el camino. Protege contra el modo de falla "envenenar el contexto" del §5. Paralelización = beneficio secundario.
**Hook:** Le pedís a Claude Code que encuentre dónde se maneja la autenticación en un repo mediano. Cuarenta archivos, fácil. ¿Qué pasaría si todo lo que leyó para responder eso viviera en *otra* ventana, y al terminar te diera solo el resultado?
**What students walk away knowing:**
- Un sub-agent es el mismo LLM + loop + tools + entorno instanciado aparte con ventana propia; al padre vuelve solo el resultado, no el contexto. No es "otra IA": es la misma lógica de siempre, aislada para una tarea acotada.
- Protege el contexto contra el "envenenar el contexto" del §5: la sub-tarea puede leer 50 archivos y razonar mil tokens, todo vive en su ventana y desaparece al terminar. Paralelización es beneficio secundario, no el motivo principal.
- El costo: el padre ve el resumen, no el razonamiento → la delegación no te exime de supervisar (callback §5: no le creés a ciegas, leés la evidencia, evaluás si el resultado es coherente).
**Animations / interactive:** Reusa el tracker (CONTEXTO / aísla el contexto de un loop entero). Reusa la animación del loop mostrando una instancia separada (sub-loop en su propia ventana que devuelve solo el resultado). Visual `/context` antes/después para el demo.
**Mini-demo (estructurado):** "El sub-agent aísla" (3 beats: búsqueda inline + `/context` → misma búsqueda delegada + `/context` → cierre mismo resultado, fracción del costo). Plan B: dos transcripts preparados.
**Slide budget:** 8–10

## Section 11: Plan mode y control del loop
**Source material:** `source_material/11-plan-mode-y-control.md`
**Through-line:** Cambio de eje. Todo lo de §7–§10 actuaba sobre el *contexto*; plan mode y permisos actúan sobre el *loop*. No es "¿qué entra al agente?" sino "¿cuánto le dejás hacer antes de mirar?". Plan mode separa "pensar" de "actuar" (la defensa más barata contra la deriva del §5). Los permisos son un gate por herramienta (callback §3). El nivel de autonomía es un dial que ajustás según reversibilidad. Cierre de la parte 2.
**Hook:** El tracker, por primera vez en toda la parte 2, **flipea a LOOP**. Hasta acá todo aterrizó en contexto; este flip visible es el hook: "Hoy la pregunta cambia."
**Key analogy:** El nivel de autonomía como un *dial* que el supervisor ajusta según cuánto cuesta deshacer si el agente se equivoca.
**What students walk away knowing:**
- Plan mode actúa sobre el LOOP: un alto deliberado entre "pensar" y "actuar" donde el supervisor entra *antes* de la primera acción; es la defensa más barata contra la deriva de objetivo del §5 (corregís antes de que el loop acumule consecuencias).
- Los permisos = gate por herramienta antes de cada acción que actúa sobre el mundo; el criterio es la distinción leer/escribir del §3 (reversible vs. no). El dial de autonomía se ajusta según reversibilidad (callback semana 3: el backend persiste).
- Hooks y MCP nombrados al pasar (se ven en otra clase). Cierre de la parte 2: no son 15 features sueltas, son **dos cosas** (loop + contexto) y formas de entrar al proceso — la tabla maestra que clasifica §7–§11.
**Animations / interactive:** Tracker con **flip a LOOP** (primer flip de la parte 2, momento visual deliberado). Reusa la animación del loop mostrando la pausa entre pensar/actuar (plan mode) y el gate antes de actuar (permisos). `data-table` para la tabla maestra "Herramienta → Actúa sobre" (el payoff "dos cosas, no quince" hecho literal).
**Mini-demo D7 (estructurado):** "Plan mode como freno" (3 beats: sin plan mode el agente actúa → con plan mode propone primero → corrección antes de aprobar). Plan B: tarea con más superficie, reversible con `git checkout .`.
**Slide budget:** 11–14

## Section 12: El trabajo final
**Source material:** `source_material/12-trabajo-final.md`
**Through-line:** El cierre del arco completo del curso: modelo (S1) + rol (S2–3) + runtime (S4) se usan al mismo tiempo en un proyecto real. El trabajo final no examina sintaxis: examina si sabés *dirigir*. Apropiación = poder explicar, corregir y extender, no cuántas líneas tecleaste. Lo administrativo no se decide hoy; hoy es el por qué y la forma.
**Hook:** Hace cuatro semanas no sabías qué era un token. Hoy terminaste de armar tres cosas que, juntas, cambian cómo podés construir software.
**What students walk away knowing:**
- Las tres piezas del curso y por qué cada una es necesaria: el modelo (sin él el agente es caja negra), el rol/vocabulario (sin él aceptás lo primero que el modelo tira), el runtime (sin él el proyecto largo da vueltas). El trabajo final las usa a la vez.
- La forma del proyecto (frontend + backend + persistencia; el dominio se define aparte) activa exactamente las decisiones aprendidas: vocabulario de S2/S3 para dictar, herramientas de hoy (CLAUDE.md persiste arquitectura, sub-agents aíslan, plan mode muestra antes de tocar) cuando el proyecto crece.
- Apropiación: el producto es tuyo aunque el agente escriba la mayoría del código; se mide en explicar/corregir/extender. Lo administrativo (equipos, fechas, dominio exacto, rúbrica) se comunica aparte — hoy es el por qué y la forma.
**Animations / interactive:** None new. Reusa `pipeline-roadmap` para el arco del curso (modelo → rol → runtime convergiendo en el trabajo final). Posible última aparición del tracker loop/contexto junto al arco, como síntesis.
**Slide budget:** 6–8
