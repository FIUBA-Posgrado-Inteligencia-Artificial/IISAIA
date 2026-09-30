# Spine — Semana 05: Plugins de Claude Code y Superpowers

> **Revisión 2026-09-29 — delta sobre el spine original.** Dos motivos: (1) alumnos que usan otro harness (Codex, OpenCode) y (2) Superpowers pasó de v5.1.0 a **v6.4.1** (2026-09-18). Donde este bloque contradice el resto del spine, manda este bloque. Las secciones de abajo se corrigieron inline en los puntos marcados.
>
> **Decisiones tomadas con el docente:**
> - **Plugins en otros harnesses → solo speaker notes + §5.** Sin slides nuevas en §§1-3. Las notas de §2-§3 agregan el equivalente en Codex y OpenCode; §5 suma cómo instalar Superpowers en esos dos.
> - **Superpowers → corregir lo falso + novedades clave.** Sin bajar a internals de SDD (ledger, task-brief, circuit breaker, batching).
> - **Caso real → todos los slides de captura (§§6-7, §§9-13) pasan a la sesión auth0 sobre tp-final** (log `2bd2fa5d-65dd-4040-a593-5b6b3553122d.jsonl`, 2026-09-29, Superpowers 6.4.1). Coherente con S04, que ya mudó sus demos del demo-repo al tp-final. La sesión está en inglés: se traduce al español y las notas lo aclaran.
>
> **Hechos verificados para las notas de plugins (§§2-3):**
> - **El estándar compartido es el `SKILL.md`** (Agent Skills). Claude Code, Codex y OpenCode lo leen. Codex busca en `.agents/skills` y `~/.agents/skills`; OpenCode en `.opencode/skills`, `~/.config/opencode/skills`, y también `.claude/skills` y `.agents/skills`. **El envoltorio "plugin" es de cada harness.**
> - **Codex:** mismo modelo que Claude Code: carpeta con manifest (`.codex-plugin/plugin.json`, o `plugin.json` en la raíz), marketplaces (`codex plugin marketplace add owner/repo`), instalación con `/plugins` o `codex plugin add x@mkt`, cache en `~/.codex/plugins/cache/<mkt>/<plugin>/<versión>/`. Se habilita por repo o por usuario en `config.toml`.
> - **OpenCode:** otro modelo: el plugin es un **módulo JS/TS**, sin marketplace; se declara como paquete npm o git en `opencode.json` (`"plugin": [...]`), global en `~/.config/opencode/` o por proyecto. Cache en `~/.cache/opencode/node_modules/`. OpenCode 2.0 cambia la API y todavía no tiene doc: no se enseña.
> - **Superpowers como ejemplo:** un solo `skills/` compartido y un manifest por harness (`.claude-plugin/`, `.codex-plugin/`, `.opencode/`, `.cursor-plugin/`, …).
>
> **Correcciones por v6.4.1 (lo que el deck decía y ya no es cierto):**
> - **§4 roadmap / §13 finishing:** el menú tiene **3 opciones** (merge local / push + PR / dejar la branch). **Descartar** ya no se ofrece: solo si lo pedís explícitamente, y confirmás tipeando `discard`.
> - **§6 brainstorming:** primero pregunta **para qué / para quién**, devuelve lo que entendió para que lo corrijas y **clasifica el pedido en voz alta**: *spike* (pregunta de factibilidad → prueba descartable), *bounded* (cambio acotado → diseño corto en el chat, sin archivo), *architectural* (proyecto nuevo, subsistema nuevo → spec escrito). La aprobación sigue siendo obligatoria en los tres. La regla del 1% se mantiene; lo que escala es la ceremonia, no la aprobación.
> - **§7 writing-plans:** el plan trae `Spec:` (puntero al spec), **Global Constraints** (reglas que atan a todas las tareas), **Interfaces** por tarea y **Review Focus** (hasta 5 casos borde que el spec implica y ninguna tarea testea, cada uno clavado a un test). **Vos revisás el plan guardado** antes de que corra nada. El cierre ofrece **dos modos de ejecución** (Subagent-driven / Native), dice cuánto cuesta cada uno y **recomienda uno con una razón**. "Tareas de 2-5 min" → los *steps* son de 2-5 min; la tarea tiene el tamaño de su propio ciclo de test.
> - **§9 subagent-driven-development:** **un reviewer por tarea con dos veredictos** (spec + calidad) en una sola pasada, no dos reviewers. Al final, **una review de toda la rama con el modelo más capaz**. Cada dispatch nombra su modelo (tareas mecánicas → modelo barato). El coordinador **no para a preguntarte por cada ambigüedad**: decide, lo registra y te lo muestra al final como *rulings*; solo frena ante lo destructivo o irreversible. `executing-plans` ya no es "pausa cada N tareas": es el **modo Native**, la sesión implementa todo y una sola review al final; más barato.
> - **§10 TDD:** "verde" = **toda la suite del proyecto**, no solo tu archivo; se reporta cada falla por nombre, incluso las que no causaste.
> - **§11 requesting-code-review:** Important = arreglar antes de seguir; Minor = se anota (no "aprobación humana"). El reviewer juzga lo que el spec no dice **por lo que esperaría un usuario razonable**. Nueva lista **"Declined to judge"**: lo que decidió no evaluar, para que lo decidas vos. La review final ya viene incorporada en SDD y en Native.
> - **§14:** skill nueva **`diagnosing-superpowers`** (cuando una sesión salió mal, lee los transcripts y reporta con evidencia). Path del cache con versión: `…/superpowers/<versión>/skills/<nombre>/SKILL.md`. El plugin trae 15 skills.
> - **§5:** versión esperada `6.4.1`. Windows: el hook de inicio corre con Git Bash; si falta, Claude Code pide instalarlo.
> - **§15:** mencionar Native como la opción barata al lado de SDD.
>
> **Caso real por sección (sesión auth0 → tp-final):**
> - **§6:** el pedido ("agregar auth0 al tp-final para login con Google") → *Classification: architectural* dicho en voz alta → primera pregunta por el propósito → 3 preguntas de alcance (qué cambia al loguearse → todo el sitio; de dónde sale el nombre → lo sigue tipeando el jugador) → 2 approaches (A: login en el servidor con cookie / B: SDK en el browser + JWT), recomienda A → diseño en 3 secciones, cada una aprobada → el usuario agrega pytest a mitad de camino → spec commiteado, y la skill marca lo que difiere de lo charlado.
> - **§7:** plan de 3 tareas (tests del API actual → login en backend → frontend + navegador), `Spec:` + Global Constraints + Review Focus con 5 casos borde (4 con pytest, 1 en navegador). Cierra con la elección: **recomienda Native** ("solo 3 tareas, cada una depende de la anterior, el plan ya trae el código") y el usuario elige Subagent-driven.
> - **§9:** Tarea 1 → implementer **haiku** → reviewer **sonnet** "spec + quality" → aprobada con 1 Minor. Tarea 2 → **sonnet** → aprobada. Tarea 3 → **haiku** → aprobada. Review final de rama → **opus**. Después, una ronda de fix y una re-review acotada solo a esos hallazgos. Reporte final con **"Rulings I made"** (ej.: "la verificación en navegador la corro con vos, no con un subagent, porque un subagent no puede hablarte").
> - **§10:** RED/GREEN reales: Tarea 2 `ModuleNotFoundError: backend.auth` → 31 passed; Tarea 3 2 failed → 33 passed; fix final 2 failed → 34 passed, sin warnings.
> - **§11:** la review final (opus) no encuentra Critical, sí un **Important**: el logout vuelve a `/`, que redirige a login y Google te re-loguea en silencio: "un usuario razonable espera terminar deslogueado". Los tests pasaban. Minors triados ("ninguno bloquea el merge") + **Declined to judge** (deploy/HTTPS, mostrar el nombre, logout por GET…). La prueba en navegador lo confirmó → página pública `/logged-out`.
> - **§12:** tres momentos de evidencia: (1) el brief de la Tarea 3 traía un commit que decía "Verificado en el navegador" y **el commit real dice "Próximo paso: verificar en el navegador"**, porque todavía no había pasado; el reviewer lo marcó como acierto. (2) La re-review: "el bug se confirmó arreglado solo vía TestClient, no en un navegador real". (3) El cierre cita `uv run pytest` → **34 passed, no warnings** y el recorrido real en navegador (login, sesión expirada → vuelve a login, logout → "Cerraste sesión").
> - **§13:** el menú real de 3 opciones (1 merge local / 2 push + PR / 3 dejarla) → el usuario elige merge local + push → fast-forward, 34 passed en `main` antes del push, branch borrada, chequeo de que no subió el `.env` (repo público).

**Whole-week through-line:** Semana 04 te dio las piezas escribibles del runtime de Claude Code. Semana 05 hace un zoom-out en tres tiempos. **Parte 1 (§§1-3)**: existe un formato común — el **plugin** — que junta esas piezas en un paquete instalable y resuelve tres complicaciones predecibles (descubrimiento, bajada, mantenimiento). **Parte 2 (§§4-5)**: usamos ese formato para instalar el plugin más completo que existe — **Superpowers** — y vemos el happy-path entero como mapa. **Parte 3 (§§6-13)**: bajamos a cada skill del happy-path como **metodología en acción** sobre el demo-repo de semana 04. **Cierre (§§14-15)**: el resto del cinturón al pasar y la bajada al trabajo final. La cadena es *pieza → paquete → metodología*, y cada bloque cierra cuando entra el siguiente.

**Dispositivos pedagógicos de toda la semana:**

- **El happy-path como pipeline-roadmap re-iluminado**: se introduce en §4 como mapa de las 7 skills + GitHub Flow (callback al `pipeline-roadmap` de semana 01 "Construyamos un LLM" y al `.lens-tracker` de semana 04). En §§6-13 reaparece como mini-header en cada slide de apertura de skill, con la pieza correspondiente iluminada y el resto en gris. Es el ancla visual que mantiene al alumno orientado dentro del flujo en todo momento.
- **Plantilla de skill recurrente (§§6-13, menos §8)**: cada skill se trata con la misma plantilla — *qué hace / cuándo se activa / por qué importa / punto crítico / anti-patrones a evitar* — más una captura real del flujo aplicado al demo-repo de semana 04 al cierre. La plantilla viene del source_material; el deck la respeta como contrato. §8 (git refresher + GitHub Flow) usa una plantilla distinta porque no es una skill.
- **Self-application como meta-ejemplo (§7)**: el material del §7 ya revela que la propia clase fue construida usando el flujo (el spec en `docs/superpowers/specs/2026-05-21-...` y el plan en `docs/superpowers/plans/2026-05-21-...`). Esa revelación entra como slide de cierre del §7 y opera como prueba de que el flujo es realmente la metodología, no un ejercicio académico.
- **Capturas reales del tp-final** *(rev. 2026-09-29; antes: demo-repo)*: cada skill §§6-7 y §§9-13 cierra con una captura de la sesión que agregó login con Google vía Auth0 al tp-final de referencia, corrida con Superpowers 6.4.1. Cumple doble función: prueba de funcionamiento y costura con S04, que ya usa el tp-final.
- **Sin animaciones JS nuevas**: reuso de `pipeline-roadmap` (CSS + Reveal listeners para re-iluminación, mismo patrón que el `.lens-tracker` de S04) y `clickable-steps.js` adaptable cuando una sección lo pide. La heavy-lift visual está en componentes CSS y reveals.

**Nota de escala:** 15 secciones, ~3h de clase. Estimado total ~70–85 slides — más liviano que S04 (~120) porque §§6-13 comparten plantilla, lo que reduce variación por sección.

**Bridge con semana 04:** Las capturas del demo-repo cierran el callback. La clase pasada vimos las piezas; esta clase las recibimos empaquetadas y aprendemos el flujo que las opera. La cadena del curso pasa a tener tres niveles: **runtime (S04) → empaquetado y distribución (S05 Parte 1) → metodología sobre ese runtime (S05 Parte 2 y 3)**.

**Bridge con semana 06:** §15 explicita el contrato: el TP se construye con este flujo. La próxima clase entra a refactor + debugging asistidos sobre lo que ya construyen con el flujo.

---

# Parte 1 — De piezas a paquetes (§§1-3)

## Section 1: De piezas sueltas a paquetes
**Source material:** `source_material/01-de-piezas-a-paquetes.md`
**Through-line:** Semana 04 te enseñó a *escribir* las piezas del runtime. La pregunta inversa abre la clase: *¿tenés que escribirlas siempre vos?* Hay gente que ya empaquetó su solución, pero sin un formato común aparecen tres complicaciones predecibles (**descubrimiento**, **bajada**, **mantenimiento**). El plugin es el nombre del formato común que las resuelve.
**Hook:** La pregunta-inversa apenas se abre la sección — *"Sabés que podés escribir cada una. ¿Tenés que escribirlas siempre vos?"* — funciona como apertura cognitiva: invierte la dirección de la pregunta de S04 y hace explícito que el supuesto "lo escribo yo" es opcional.
**What students walk away knowing:**
- La pregunta inversa: las piezas del runtime de S04 no siempre las escribís vos, y hay un ecosistema que ya las publica.
- Tres complicaciones predecibles sin formato común: descubrimiento (no sabés dónde buscar), bajada (cada autor organiza distinto), mantenimiento (no hay versión, tenés una foto inmóvil).
- El **plugin** es el nombre del formato que resuelve los tres. Los detalles de cómo los resuelve llegan en §§2-3.
**Animations / interactive:** Ninguna. CSS-only. Recap visual del runtime de S04 (las 7 piezas como cards en gris claro, callback discreto al deck anterior) + grid 3×1 de las tres complicaciones con reveals progresivos.
**Slide budget:** 3–4 slides.

## Section 2: Qué es un plugin de Claude Code
**Source material:** `source_material/02-plugins-que-son.md`
**Through-line:** Un plugin es un **directorio autocontenido de componentes** con layout estandarizado (`.claude-plugin/`, `skills/`, `agents/`, `hooks/`, `commands/`). El `plugin.json` es opcional y sólo `name` es obligatorio. Ese formato común resuelve las tres complicaciones que aparecieron en §1: descubrimiento (habilita marketplaces), bajada (layout único), mantenimiento (versión explícita).
**What students walk away knowing:**
- La definición literal de la doc (*directorio autocontenido + componentes*) y por qué cada palabra importa.
- La anatomía mínima del folder y qué va dónde. El `plugin.json` es opcional; sólo `name` es obligatorio cuando se incluye.
- El mapping explícito **tres complicaciones → tres respuestas del formato**: descubrimiento ↔ marketplaces (preview de §3), bajada ↔ layout estandarizado, mantenimiento ↔ versión declarada (con el detalle del SHA-fallback).
**Animations / interactive:** Ninguna. CSS-only. `code-walkthrough` del árbol de directorios y del manifest mínimo. Tabla o `comparison` para el mapping complicación → respuesta del formato.
**Slide budget:** 4–5 slides.

## Section 3: Marketplaces e instalación
**Source material:** `source_material/03-plugins-distribucion.md`
**Through-line:** Los plugins llegan al disco por comando, no por clonado manual. Ese comando se apoya en un **marketplace** — el registro consultable que tiene la metadata. Hay un marketplace oficial pre-registrado (`claude-plugins-official`) y los comunitarios se agregan con un comando. Cuatro comandos cubren todo el ciclo de vida (`install` / `update` / `uninstall` / `list`) y tres scopes definen alcance (`user` default / `project` versionado / `local` gitignored).
**Key analogy:** *Un marketplace es a Claude Code lo que npm es a Node, o el extension store a VS Code.* Está literal en el material, vale la pena un slide para que el alumno aterrice rápido.
**What students walk away knowing:**
- Marketplace como registro consultable; oficial pre-registrado vs comunitarios que se agregan con `/plugin marketplace add`.
- Los cuatro comandos del ciclo de vida con su sintaxis exacta (`install <plugin>@<marketplace>`, `update`, `uninstall`, `list`).
- Los tres scopes de instalación y cuándo usar cada uno (user para uso personal, project para equipos, local para cosas que no querés que viajen).
- La anatomía del §2 efectivamente existe en disco: el plugin instalado es un folder real bajo `~/.claude/plugins/cache/<marketplace>/<plugin>/`.
**Animations / interactive:** Reuse opcional de `clickable-steps.js` para los cuatro comandos del ciclo de vida (cada step muestra sintaxis + qué hace + cuándo lo usás). Si no, CSS-only con cuatro cards.
**Mini-demo en vivo:** abrir el cache del marketplace oficial en VS Code y mostrar que el folder se ve igual al árbol del §2. Plan B documentado en el source. **Es el primer demo de la clase, va con cuidado especial: terminal grande, browser/VS Code lado a lado.**
**Slide budget:** 5–6 slides + slide de demo.

---

# Parte 2 — Instalamos el plugin más completo (§§4-5)

## Section 4: Superpowers — qué problema resuelve
**Source material:** `source_material/04-superpowers-que-es.md`
**Through-line:** Superpowers se autodefine como *"metodología completa de desarrollo + skills componibles"*. El problema clásico que ataca: el agente arranca a tipear código antes de saber qué estás construyendo, y el desfasaje entre tu intención y su interpretación aparece tarde, cuando ya hay archivos, tests y veinte mensajes de conversación. El plugin fuerza un proceso con puntos de control. Cuatro principios filosóficos lo guían y tres cosas que NO hace evitan inflar expectativas.
**Hook:** La frase del README — *"apenas ve que estás construyendo algo, no salta a escribir código. En vez de eso, da un paso atrás y te pregunta qué estás tratando de hacer realmente."* — abre la sección. Carga el contraste con el problema diagnosticado (desfasaje tardío).
**What students walk away knowing:**
- El problema que ataca: detectar desfasaje en palabras es barato, detectarlo en código ya escrito es caro.
- El **happy-path completo** como mapa visual: brainstorming → writing-plans → (GitHub Flow) → subagent-driven-development → test-driven-development → requesting-code-review → verification-before-completion → finishing-a-development-branch. **Este mapa es el `pipeline-roadmap` que va a re-iluminarse en §§6-13.**
- Los cuatro principios declarados en el README (TDD, sistemático antes que improvisado, complexity reduction, evidence over claims).
- Lo que NO hace: no escribe código sin que vos decidas qué construir, no reemplaza tu criterio arquitectónico, no funciona en piloto automático.
**Animations / interactive:** Ninguna JS. El **pipeline-roadmap del happy-path** se construye CSS-only — 7 piezas + GitHub Flow integrado — y queda preparado para que en §§6-13 se re-ilumine pieza por pieza vía clases CSS toggleadas por Reveal. Mismo patrón visual que el `.lens-tracker` de S04.
**Slide budget:** 6–7 slides.

## Section 5: Instalar Superpowers en vivo
**Source material:** `source_material/05-instalar-superpowers.md`
**Through-line:** Un único comando (`/plugin install superpowers@claude-plugins-official`) baja el plugin y registra sus skills. Se verifica con `/plugin list`. Plan B documentado por si el marketplace o el comando fallan.
**What students walk away knowing:**
- El comando exacto, sin pasos intermedios (el marketplace oficial está pre-registrado, no hace falta `marketplace add`).
- Cómo verificar la instalación (`/plugin list` muestra el plugin con su versión y origen).
- Que existe Plan B: marketplace comunitario alternativo y `/reload-plugins` si las skills no aparecen.
**Animations / interactive:** Ninguna. Este es **demo en vivo puro** — slide soporte mínima (un code block con el comando, otra con `/plugin list`). Las clickable-steps no aplican: el flujo es lineal, dos comandos.
**Mini-demo en vivo:** instalar Superpowers contra el oficial, listar y mostrar que cargó. Plan B = screenshot pre-armado de antes/después de `/plugin list`. **Segundo demo de la clase; arranca el ritmo de Parte 3 que va a tener demos por skill.**
**Slide budget:** 2–3 slides.

---

# Parte 3 — Metodología en acción (§§6-13)

> **Plantilla común para §§6-7 y §§9-13** (las 7 skills del happy-path):
> 1. **Pipeline-roadmap iluminado**: slide de apertura con el mapa del §4, con la skill actual destacada y las demás en gris.
> 2. **Qué hace** — cómo opera la skill.
> 3. **Cuándo se activa** — el trigger.
> 4. **Por qué importa** — el problema que resuelve.
> 5. **Punto crítico** — la regla no negociable.
> 6. *(Cuando aplica)* **Artefacto en disco** — para skills con output persistente (brainstorming, writing-plans).
> 7. *(Cuando aplica)* **Punto de auto-review** — para skills que lo tienen (brainstorming, writing-plans, subagent-driven-development).
> 8. **Anti-patrones a evitar** — qué NO hacer.
> 9. **Captura del flujo aplicado al demo-repo de S04** — slide de cierre con screenshot real.
>
> §8 (git refresher + GitHub Flow) usa una plantilla distinta porque no es una skill — refresca conceptos primero, después el workflow concreto.

## Section 6: brainstorming
**Source material:** `source_material/06-brainstorming.md`
**Through-line:** Convierte una idea cruda en un design spec a través de preguntas dirigidas. Arranca preguntando para qué y para quién, y clasifica el pedido (spike / bounded / architectural) para escalar la ceremonia. NO toca código antes de que vos apruebes el diseño; la aprobación aplica a todo proyecto sin importar cuán simple parezca (regla del 1% del frontmatter). En trabajo architectural el spec aprobado se persiste en disco (`docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`) y queda como contrato versionado.
**Hook:** La regla deliberadamente paranoica del frontmatter — *"si hay un 1% de probabilidad de que el pedido implique construir algo, la skill se invoca"*. Es contraintuitiva y engancha (todo proyecto va por el flujo, incluso los "simples" — sobre todo los simples).
**What students walk away knowing:**
- Qué hace concretamente: diálogo de una pregunta por vez para explorar propósito, restricciones y criterios de éxito, antes de proponer approaches y armar el spec.
- Cuándo se activa: cualquier trabajo creativo. Cuándo NO: tareas exploratorias (leer / explicar / debug) y correcciones mecánicas.
- El **artefacto en disco** como contrato versionado, no como mensaje perdido en la conversación.
- El **punto de auto-review** previo (Spec Self-Review): la skill caza placeholders, contradicciones, scope creep y ambigüedad antes de pedirte que revises.
- Anti-patrones: "esto es muy simple", combinar varias preguntas en un mensaje, invocar implementación antes de aprobación.
**Animations / interactive:** Pipeline-roadmap re-iluminado en el opener. `code-walkthrough` del path del spec en disco. Si hace falta, `clickable-steps` para el flow exploración → approaches → spec → self-review → aprobación.
**Captura del flujo:** sesión auth0 → tp-final (ver bloque de revisión).
**Slide budget:** 7–8 slides.

## Section 7: writing-plans (+ spec-driven development)
**Source material:** `source_material/07-writing-plans.md`
**Through-line:** Antes de writing-plans, el **marco**: spec-driven development separa QUÉ/POR QUÉ (decisiones humanas) del CÓMO (delegado al agente). Regla de dirección: si cambia el spec, cambia el plan; si cambia el plan, cambia el código — nunca al revés. La cadena Superpowers que lo operacionaliza: brainstorming → writing-plans → subagent-driven-development. **writing-plans** convierte spec en plan markdown con tareas de 2–5 minutos, paths exactos y código completo en cada step.
**Hook:** *Self-application como hook de cierre.* La meta-revelación está literal en el source: *"el archivo que estás leyendo fue escrito ejecutando esa misma cadena"*. Va al final de la sección como twist: el spec real (`docs/superpowers/specs/2026-05-21-semana-05-source-material-design.md`) y el plan real (`docs/superpowers/plans/2026-05-21-semana-05-source-material.md`) abiertos en VS Code, con el comentario "esto que estás leyendo salió de ese plan". Es el callback que ata todo el resto del deck.
**What students walk away knowing:**
- **Spec-driven development como marco**: la dirección unidireccional spec → plan → código, y por qué nunca al revés.
- **Cómo Superpowers lo operacionaliza**: la cadena de 3 skills y cómo cada una mira el artefacto previo como contrato cerrado. Si la entrada está mal, subís al paso anterior — no compensás hacia adelante.
- Qué hace writing-plans: tareas de 2–5 min con archivos exactos y código completo. Asunción agresiva (el ejecutor no conoce el codebase).
- **Artefacto en disco**: `docs/superpowers/plans/...` se commitea junto al spec; ese par lo lee después subagent-driven-development.
- **Punto crítico**: nada de "TBD", "TODO", "similar to Task N" sin código. Vago = no implementable.
- **Plan Self-Review** previo: spec coverage / placeholder scan / type consistency / Review Focus.
- *(rev. 2026-09-29)* Estructura nueva del plan (`Spec:`, Global Constraints, Review Focus) y la elección Subagent-driven / Native al cierre.
- **El twist meta-pedagógico**: el spec y el plan que produjeron este deck están commiteados en el repo del curso. La clase es prueba de que el flujo funciona.
**Animations / interactive:** Pipeline-roadmap re-iluminado. Posible reuse de `flow-with-arrows` o construcción CSS para mostrar la dirección **spec → plan → código** con la flecha que sólo va para un lado. El cierre meta es CSS-only con captura del spec + plan abiertos.
**Captura del flujo:** el plan de la sesión auth0 → tp-final (ver bloque de revisión).
**Slide budget:** 8–9 slides.

## Section 8: git refresher + GitHub Flow
**Source material:** `source_material/08-github-flow.md`
**Through-line:** Las próximas skills (subagent-driven-development, code-review, finishing-branch) operan dentro de una branch. Si el modelo mental de git no está cómodo, esas skills se sienten mágicas o aterradoras. Mini-refresher de **commit / branch / pull request**, después el flow concreto que se usa con Superpowers: `checkout main → pull → checkout -b feature/<descripcion> → trabajar → push → PR`. Por qué este patrón se lleva bien con Superpowers: aislamiento natural, PR como contrato visible, `main` siempre estable.
**Hook:** Opcional. La frase del source — *"si no tenés cómodo el modelo mental de git, esas skills se sienten mágicas o aterradoras según el día"* — funciona si hay alumnos nuevos en git. Si el grupo ya viene con git, mejor saltearlo y entrar directo al refresher.
**What students walk away knowing:**
- Los tres conceptos base con definición práctica: commit (foto del repo con diff + autor + mensaje, commits chicos), branch (línea paralela), PR (propuesta visible en GitHub).
- El flow paso a paso de GitHub Flow integrado con Superpowers, con los comandos exactos.
- Por qué este patrón encaja bien con Superpowers (aislamiento por sesión, PR visible, `main` estable, sin necesidad de stash/rebase/cherry-pick).
- Que existe `using-git-worktrees` y la honest disclosure de por qué no la usamos en el curso.
**Animations / interactive:** Ninguna JS. Diagrama CSS de branches (línea principal + línea de feature divergiendo y volviendo). `code-walkthrough` para los comandos del flow.
**Captura del flujo:** screenshot del PR del demo-repo de S04 con los commits generados durante la sesión.
**Slide budget:** 7–8 slides.

## Section 9: subagent-driven-development
**Source material:** `source_material/09-subagent-driven-development.md`
**Through-line:** Ejecuta el plan despachando un **subagent fresco por cada tarea** — contexto limpio, sin arrastrar decisiones tácitas. Entre tarea y tarea corre **un reviewer con dos veredictos** (spec compliance y code quality, en una sola pasada) y al final una review de toda la rama con el modelo más capaz *(rev. 2026-09-29; antes: two-stage review con dos reviewers)*. Corre continuo: las ambigüedades las decide el coordinador y te las reporta como rulings. La alternativa (`executing-plans`, modo **Native**) ejecuta todo en la misma sesión con una sola review al final — más barata; se menciona, no se profundiza.
**Hook:** *"Fresh subagent o no arranca."* Es la punch line del source y captura la disciplina central: el reset de contexto es lo que escala el flujo, no la ejecución en paralelo.
**What students walk away knowing:**
- Subagent fresco por tarea — qué significa "fresco" (sin la sesión del coordinador, sin decisiones tácitas previas).
- Por qué el reset de contexto importa: evita context rot y compensación de errores entre tareas.
- **Un reviewer, dos veredictos**: spec compliance (¿cumple lo pedido?) y code quality (¿está bien escrito?) en la misma pasada; más la review final de rama.
- Cuándo elegir esta skill vs Native (`executing-plans`): review independiente por tarea vs costo.
- Anti-patrones: reusar el subagent, saltearse el review, intervenir demasiado pronto.
**Animations / interactive:** Pipeline-roadmap iluminado. Reuse de `clickable-steps.js` para el flow Task₁ → review → Task₂ → review (cuatro steps clicables que iluminan cada momento). Posible diagrama CSS del coordinador + subagents efímeros.
**Captura del flujo:** sesión auth0 → tp-final: implementer/reviewer por tarea con su modelo, review final en opus, ronda de fix (ver bloque de revisión).
**Slide budget:** 7–8 slides.

## Section 10: test-driven-development
**Source material:** `source_material/10-test-driven-development.md`
**Through-line:** Ciclo **RED-GREEN-REFACTOR** forzado en cada feature o bugfix. Regla de hierro: cualquier código de producción escrito antes de su test se borra y se reescribe. La razón en el contexto de subagent-driven-dev: cuando el agente corre solo durante una hora, TDD es lo que evita que "ya funciona" termine siendo "compila".
**Hook:** La frase del §15 del source — *"Si nunca lo viste rojo, no estás midiendo nada — estás creyendo."* Es punzante, corta y queda. Buena para abrir o cerrar.
**What students walk away knowing:**
- El ciclo RED → GREEN → REFACTOR y qué pasa en cada etapa.
- Por qué ver el RED primero no es opcional: garantiza que el test efectivamente testea algo.
- La regla de borrar y reescribir el código pre-test (es disciplina, no perfeccionismo).
- Anti-patrones: test post-hoc, test que pasa en RED, test con mocks de todo (no atrapa regresiones reales).
**Animations / interactive:** Pipeline-roadmap iluminado. `code-walkthrough` del ciclo RED-GREEN-REFACTOR (un slide muestra los tres estados — test rojo, código mínimo, test verde — uno por reveal). CSS-only.
**Captura del flujo:** RED/GREEN reales de la sesión auth0 → tp-final.
**Slide budget:** 6–7 slides.

## Section 11: requesting-code-review
**Source material:** `source_material/11-requesting-code-review.md`
**Through-line:** Code review estructurado contra el plan, antes de claimar listo. El **reviewer es un agente separado** del que implementó — recibe sólo el diff y el spec, no tu historial. Devuelve strengths + issues clasificados por severidad (críticos / mayores / menores). Los críticos bloquean el avance.
**Hook:** Opcional. *"La última pasada con ojos frescos antes de que el código salga de tu cabeza"* — funciona como cierre del trío TDD + review + verification.
**What students walk away knowing:**
- El reviewer como agente separado del implementer; sin sesgo del autor, sin "ya lo discutimos y quedó así".
- Las tres severidades y qué hacer con cada una *(rev. 2026-09-29)*: Critical se arregla ya, Important se arregla antes de seguir, Minor se anota. Lo que el spec no dice se juzga por lo que esperaría un usuario razonable; lo que el reviewer no evalúa va a "Declined to judge".
- Qué encuentra code review que los tests no encuentran: dead code, desfasaje spec-código, ergonomía pésima de API.
- Anti-patrones: saltearlo porque "los tests pasan", degradar críticos a mayores para no atrasar el merge, pedir review antes de que TDD pase verde.
**Animations / interactive:** Pipeline-roadmap iluminado. `data-table` o grid 3×1 para las tres severidades con ejemplos.
**Captura del flujo:** review final de rama de la sesión auth0 → tp-final (Important del logout).
**Slide budget:** 6–7 slides.

## Section 12: verification-before-completion
**Source material:** `source_material/12-verification-before-completion.md`
**Through-line:** Antes de claimar listo, **correr los verification commands** y **citar el output** en la misma afirmación de éxito. Bloquea claims sin evidencia. La regla: si no corriste el comando en este turno, no podés afirmar que pasa. "Evidencia antes de afirmaciones, siempre, sin excepción."
**Hook:** *"Compilar es la barrera más baja del éxito. Tu trabajo es verificar comportamiento, no sintaxis."* Punzante. Funciona porque el alumno ya escuchó "los tests pasan" sin evidencia muchas veces.
**What students walk away knowing:**
- Claim sin evidencia es claim falso — política, no opcional.
- La oración correcta tiene la forma "los tests pasan: [output pegado]".
- Si no podés correr el comando, lo decís explícitamente — no asumís, no minimizás, no extrapolás.
- Por qué fue promovida al happy-path: lo que distingue "trabajo terminado" de "probablemente terminado".
- Anti-patrones: "deberían pasar" sin correr, "el feature funciona" sin end-to-end, "listo" porque compila.
**Animations / interactive:** Pipeline-roadmap iluminado. CSS-only — un `comparison-2col` con la forma incorrecta ("los tests pasan") vs la correcta ("los tests pasan: \[output pegado\]") puede aterrizar la regla rápido.
**Captura del flujo:** los tres momentos de evidencia de la sesión auth0 → tp-final.
**Slide budget:** 5–6 slides.

## Section 13: finishing-a-development-branch
**Source material:** `source_material/13-finishing-a-development-branch.md`
**Through-line:** Cuando todas las tareas están implementadas y verificadas, estructura **tres opciones de cierre** (merge local / **push + PR (default en GitHub Flow)** / dejar la branch) *(rev. 2026-09-29; descartar ya no se ofrece, solo a pedido explícito)*. El menú aparece solo con la suite en verde. No decide por vos pero ordena el cleanup según el workspace. **No quedarse en estado intermedio** — "después decido" es deuda silenciosa.
**Hook:** Opcional. *"O se mergea, o se manda a PR, o se mantiene viva con plan. Después decido = deuda silenciosa."*
**What students walk away knowing:**
- Las tres opciones explícitas y cuándo recomendarse cada una. En GitHub Flow, el default es PR.
- El cleanup tiene orden: mergear primero, después remover worktree (si aplica), después borrar branch local. Saltearse el orden produce errores.
- Anti-patrones: mergear directo a `main` algo que amerita revisión, dejar branches vivas sin razón, olvidarse del cleanup.
**Animations / interactive:** Pipeline-roadmap iluminado (cierre del pipeline). CSS-only — grid con las tres opciones, cada una con recomendación de contexto.
**Captura del flujo:** el menú real de 3 opciones y el merge local + push de la sesión auth0 → tp-final.
**Slide budget:** 5–6 slides.

---

# Cierre (§§14-15)

## Section 14: El resto del cinturón
**Source material:** `source_material/14-resto-del-cinturon.md`
**Through-line:** El plugin trae más skills que las que recorrimos en detalle. Las que no entran al happy-path lineal existen y se activan automáticamente cuando aplican — sólo hace falta reconocerlas para saber dónde buscar. Se nombran al pasar: `systematic-debugging`, `dispatching-parallel-agents`, `writing-skills`, `receiving-code-review`, `using-git-worktrees` y, desde v6.4.1, `diagnosing-superpowers`. (`executing-plans` ya se cubre en §9 como modo Native.)
**What students walk away knowing:**
- Existen seis skills más que ya están instaladas y se activan solas.
- Una frase por skill alcanza para reconocerla cuando aparezca.
- Dónde encontrar el archivo SKILL.md de cada una si quieren explorar (`~/.claude/plugins/cache/claude-plugins-official/superpowers/<versión>/skills/<nombre>/SKILL.md`).
**Animations / interactive:** Ninguna. CSS-only. `data-table` o grid 3×2 con las seis skills, una línea por cada una.
**Slide budget:** 3 slides.

## Section 15: Bajada al trabajo final
**Source material:** `source_material/15-bajada-al-tp-final.md`
**Through-line:** El TP se construye con **exactamente este flujo**, sin modo especial para proyectos integradores. La secuencia entera (brainstorming → spec → plan → branch → subagent-driven + TDD → code-review → verification → PR) se aplica como vimos. **Lo que el flujo NO hace por vos**: qué construir, criterio arquitectónico, si el feature sirve a un usuario real. El plugin acelera la ejecución y disciplina el proceso — no decide qué entregar. Justamente te libera tiempo para esa parte.
**What students walk away knowing:**
- El flujo entero se aplica al TP, paso por paso.
- Las decisiones humanas no delegables: qué construir, criterio arquitectónico, criterio de utilidad real.
- Bridge a semana 06: refactor + debugging asistidos sobre lo que ya construyen con este flujo.
**Animations / interactive:** **Reuse del pipeline-roadmap del §4** aplicado entero al TP — el mismo mapa que se fue iluminando section by section, ahora completo y aplicado. Cierre satisfactorio del arco visual de toda la clase.
**Slide budget:** 3–4 slides.
