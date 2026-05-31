# Diseño — Source material Semana 05: Plugins de Claude Code y Superpowers

**Fecha:** 2026-05-21
**Output esperado:** `semanas/05/source_material/` (index.md + 15 archivos numerados) que la fase `/build-class` convierte en slides.
**Reemplaza:** el `semanas/05/source_material/index.md` placeholder (heredado de `programa.md` como "Proyecto Integrador I: Ideación e Ingeniería de Prompts"), descartado de común acuerdo. La bajada al TP final queda en la sección de cierre como callback a §14 de S04, no como eje central de la clase.

## Contexto del curso

- **Semana 04 (recién cerrada):** runtime de Claude Code desmenuzado pieza por pieza — CLAUDE.md jerárquico + auto memory, `.claude/rules/` path-scoped, `settings.json`, permisos, skills + slash commands, sub-agents, plan mode. §14 framing del trabajo final.
- **S05 se posiciona como continuación directa de S04:** lo que en S04 eran piezas sueltas del runtime, en S05 son el **contenido** de un plugin. Plugins = el envoltorio que distribuye todo eso.
- **Conocimiento de git en la cohorte:** disperso. Muchos saben muy poco. La clase **no asume** que sepan worktrees ni stash; sí incluye un mini-refresher (commit/branch/PR) antes de enseñar GitHub Flow.
- **Trabajo final:** ya enmarcado en §14 de S04. Esta clase no re-define consignas administrativas; cierra con la bajada "el flujo que aprendiste lo usás para el TP".

## Decisiones de la sesión de brainstorming

| Tema | Decisión |
|------|----------|
| Cobertura de skills | **Workflow narrativo** (no panorámico): 7 skills del happy-path recorridas en orden, las demás se nombran al cierre como "el resto del cinturón". |
| Estrategia demo | Vista general del flujo primero, luego skill-por-skill con énfasis en utilidad. **Capturas reales** del propio uso de Enzo aplicando Superpowers para agregar un feature al demo-repo de S04. Los slides de cada skill terminan en una imagen con esa evidencia. El source material deja **placeholders explícitos** para esas capturas; Enzo las inserta al momento de armar los slides. |
| Skills al recorrido detallado | Los 7 del happy-path: brainstorming, writing-plans, **(reemplazo de worktrees por GitHub Flow)**, subagent-driven-development, test-driven-development, requesting-code-review, finishing-a-development-branch. |
| Reemplazo git | `using-git-worktrees` **no** se enseña — es confuso para una cohorte con poco git. Se sustituye por una sección de **GitHub Flow** (branch → commits → push → PR via UI), que es además el flujo que Enzo usa en su día a día con Superpowers. La skill `using-git-worktrees` se menciona honestamente como "alternativa avanzada que existe en el plugin". |
| Nivel git en §08 | Mini-refresher (qué es commit, branch, PR) + GitHub Flow. Sección un poco más larga (~15-18 min) para compensar el spread de niveles. |
| Profundidad plugins | **Intermedia** (dos secciones, no una): §02 concepto + anatomía mínima, §03 marketplaces + `/plugin install`. Suficiente para que el alumno pueda explorar otros plugins después, sin entrar a crear uno propio. |
| Spec-driven development | Concepto meta que une brainstorming + writing-plans + subagent-driven-dev. **Semilla** en §06 (brainstorming, una línea), **desarrollo completo** en §07 (writing-plans, dos sub-bloques), **callback** en §09 (subagent-driven-dev). No tiene sección propia. |
| Cierre | "Resto del cinturón" (§14) nombrando skills off-path + bajada al TP final (§15) con callback explícito a §14 de S04. |
| Fuente de verdad | Cada SKILL.md del plugin clonado en `semanas/05/source_material/superpowers/skills/` es la fuente canónica para la skill correspondiente. Para §§02-03 (plugins genérico) la fuente es la doc oficial `https://code.claude.com/docs/en/plugins-reference`. |
| Visibilidad de auto-review | Las etapas de self-review son disciplina central de Superpowers y reciben tratamiento explícito: (a) sub-sección **"Punto de auto-review"** en la plantilla de skill, presente sólo cuando la skill tenga una auto-review interna (aplica a §06 brainstorming, §07 writing-plans, §09 subagent-driven-dev); (b) `verification-before-completion` **promovida del "resto del cinturón" al happy-path** como §12 (entre code-review y finishing-branch). |
| Artefactos en disco | `brainstorming` y `writing-plans` producen **archivos persistentes** que se commitean al repo: spec en `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`, plan en `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`. §06 y §07 mencionan estos paths explícitamente — son evidencia tangible, no abstracción. Las capturas reales de Enzo en esas secciones pueden ser literalmente sus propios archivos de spec/plan generados al armar el feature del demo-repo. |

## Hilo conductor

> Semana 04 te dio las piezas sueltas del runtime de Claude Code: CLAUDE.md, rules, skills, sub-agents, plan mode. Semana 05 las recibe ya empaquetadas en un **plugin** — el envoltorio que las distribuye, instala y versiona. Para no quedarte sólo en "qué es un plugin", instalás el más completo que existe (**Superpowers**) y aprendés el flujo de trabajo que opera sobre Claude Code: brainstorming → spec → plan → ejecución autónoma → review → merge. Es la metodología con la que vas a armar tu trabajo final.

**Disciplina del enfoque:** las skills no se presentan como catálogo de features. Cada sección de skill responde tres preguntas: *qué hace, cuándo se activa, por qué importa* — y termina con una captura real del propio uso de Enzo aplicándola al demo-repo de S04. El alumno ve la skill como herramienta de un flujo, no como ítem aislado.

## Mapa de secciones (`source_material/`)

Mismo esquema que S02-S04: `index.md` + archivos numerados. Budget total ~170 min de material para una clase de 180 min (con buffer mínimo). Slides per file los afina la fase spine de `/build-class`.

### Apertura (~10 min)

| # | Archivo | Núcleo | Slides |
|---|---------|--------|--------|
| 1 | `01-de-piezas-a-paquetes.md` | Callback a S04 (las siete piezas del runtime). Por qué ahora necesitamos un envoltorio: cómo se distribuye una skill que escribiste, cómo se versionan, cómo se comparten con un equipo. Apertura del concepto "plugin" como respuesta natural. | 4-5 |

### Plugins (~25 min, 2 secciones)

| # | Archivo | Núcleo | Slides |
|---|---------|--------|--------|
| 2 | `02-plugins-que-son.md` | Concepto: un plugin es un paquete que junta varios de los componentes de S04 — skills, slash commands, sub-agents, hooks, MCP servers. Anatomía mínima (`plugin.json`, folder layout). Fuente: `code.claude.com/docs/en/plugins-reference`. | 6-7 |
| 3 | `03-plugins-distribucion.md` | Marketplaces (oficial + comunitarios). Comandos: `/plugin marketplace add`, `/plugin install`. Demo en vivo: inspeccionar un plugin ya instalado para ver su estructura. | 5-6 |

### Superpowers — introducción (~20 min)

| # | Archivo | Núcleo | Slides |
|---|---------|--------|--------|
| 4 | `04-superpowers-que-es.md` | Qué problema resuelve (de ad-hoc a metodología). El happy-path como diagrama. Filosofía del plugin: TDD, evidencia sobre claims, simplicidad como objetivo. Fuente: README de Superpowers + `skills/using-superpowers/SKILL.md`. | 5-6 |
| 5 | `05-instalar-superpowers.md` | Demo en vivo: `/plugin install superpowers@claude-plugins-official`. Verificar que las skills cargaron. | 3-4 |

### Recorrido happy-path (~100 min, ~12-14 min cada una)

Todas siguen la plantilla uniforme (ver sección "Plantilla de secciones de skill" abajo). Las skills marcadas con ★ tienen sub-sección "Punto de auto-review".

| # | Archivo | Núcleo | Notas |
|---|---------|--------|-------|
| 6 | `06-brainstorming.md` ★ | Refinación socrática del diseño. Una pregunta por vez. Produce el spec. **Planta la semilla de spec-driven dev** (una línea, "en la próxima skill vemos por qué tener un spec separado del código importa"). Sub-sección de auto-review: el **Spec Self-Review** interno (escaneo de placeholders, contradicciones, scope, ambigüedad) antes de mostrar el spec al usuario. | Fuente: `skills/brainstorming/SKILL.md`. Captura: screenshot de las preguntas socráticas recibidas + opcional, las notas del Spec Self-Review. |
| 7 | `07-writing-plans.md` ★ | Convierte spec → implementation plan. Tareas de 2-5 min, archivos exactos, verificación. **Desarrolla spec-driven development completo:** (a) qué es (spec como source of truth, separa qué/por qué del cómo); (b) cómo Superpowers lo operacionaliza concretamente. Sub-sección de auto-review: el **Plan Self-Review** interno antes de entregarlo. | Fuente: `skills/writing-plans/SKILL.md`. Captura: implementation plan generado. |
| 8 | `08-github-flow.md` | **Sustituye `using-git-worktrees`.** Mini-refresher de git (commit, branch, PR). GitHub Flow: `git checkout -b feature/foo` antes de la session → commits granulares → push → PR via UI de GitHub. Por qué este patrón se lleva bien con Superpowers (cada session tiene su branch, el PR queda como contrato visible). Mención honesta: "Superpowers trae `using-git-worktrees` para flujos paralelos avanzados — no lo usamos en este curso". | ~15-18 min, un poco más larga que el resto para compensar nivel disperso de git. Captura: PR de Enzo en el demo-repo. |
| 9 | `09-subagent-driven-development.md` ★ | Despacha un subagent fresco por tarea con review en dos etapas (spec compliance + calidad). El corazón del "autonomous coding" de Superpowers. **Callback a spec-driven dev** ("el subagent lee el plan y el spec — por eso podés correr el flujo casi autónomo"). Sub-sección de auto-review: el **two-stage review** (spec compliance, después calidad) que corre el agente coordinador antes de pasar a la siguiente tarea. | Fuente: `skills/subagent-driven-development/SKILL.md`. Captura: terminal con subagents ejecutando tareas y el output de un two-stage review. |
| 10 | `10-test-driven-development.md` | RED-GREEN-REFACTOR sin excepciones. Borra código escrito antes de los tests. Por qué es central en el flujo Superpowers. | Fuente: `skills/test-driven-development/SKILL.md`. Captura: ciclo TDD en acción durante el demo. |
| 11 | `11-requesting-code-review.md` | Pre-merge checklist por severidad. Issues críticos bloquean progreso. | Fuente: `skills/requesting-code-review/SKILL.md`. Captura: report de review generado. |
| 12 | `12-verification-before-completion.md` | **Promovida del "resto del cinturón" al happy-path.** Disciplina central: no claimear "está listo / arreglado / pasa" sin evidencia. Correr los verification commands y citar el output antes de afirmar éxito. Por qué este beat no se puede saltear (cierra el ciclo de spec-driven dev: el plan dijo qué verificar, ahora se verifica). | Fuente: `skills/verification-before-completion/SKILL.md`. Captura: comandos de verificación corridos + output citado. |
| 13 | `13-finishing-a-development-branch.md` | Opciones (merge / PR / keep / discard) + cleanup. Continuidad de vocabulario con §08 (en GitHub Flow, "finishing" = abrir el PR). | Fuente: `skills/finishing-a-development-branch/SKILL.md`. Captura: PR final mergeado en el demo-repo. |

### Cierre (~15 min)

| # | Archivo | Núcleo | Slides |
|---|---------|--------|--------|
| 14 | `14-resto-del-cinturon.md` | Skills off-path nombradas con una frase cada una: `systematic-debugging` (4 fases de root cause), `dispatching-parallel-agents`, `writing-skills` (crear las tuyas), `receiving-code-review`, `executing-plans`, `using-git-worktrees`. Mensaje: "existe esto, lo abrís cuando lo necesitás". No se desarrollan. (`verification-before-completion` ya **no** aparece acá: pasó al happy-path como §12.) | 4-5 |
| 15 | `15-bajada-al-tp-final.md` | "El TP final lo arman con este flujo". Callback explícito a §14 de S04. Sin re-definir consignas — solo conectar la herramienta con el deliverable que ya conocen. | 3-4 |

## Plantilla de las secciones de skill (§§06-13)

Cada archivo de skill sigue el mismo molde. **Se apoya fuertemente en el SKILL.md canónico, no en paráfrasis.**

```
# NN - <skill-name>

## Qué hace
[1-2 líneas. Cita literal del campo `description` del frontmatter de SKILL.md]

## Cuándo se activa
[Triggers del frontmatter + cualquier condición del body que sea no-obvia]

## Por qué importa
[2-4 oraciones de utilidad pedagógica — la única parte 100% del autor del source material.
La pregunta que responde: "si saco esta skill del flujo, qué se rompe?"]

## El punto crítico
[1 idea central. Para brainstorming: "una pregunta a la vez". Para writing-plans:
"tareas de 2-5 min con archivos exactos". Para TDD: "RED antes de GREEN, sin excepciones".
Extraído de SKILL.md.]

## Punto de auto-review            ← OPCIONAL (sólo si la skill tiene una)
[Qué se autorrevisa, cuándo (en qué momento del flujo de la skill), y qué se busca
(placeholders / contradicciones / scope / ambigüedad / spec compliance).
Aplica a §06 brainstorming (Spec Self-Review), §07 writing-plans (Plan Self-Review),
§09 subagent-driven-dev (two-stage review). En las demás skills esta sub-sección
se omite directamente.]

## Anti-patrones a evitar
[2-3 bullets concretos sacados de SKILL.md — qué NO hacer]

## Fuente canónica
[Path al SKILL.md exacto dentro del plugin clonado]

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: <descripción de qué captura va acá>
     Ej. brainstorming: screenshot de las preguntas socráticas
     Ej. writing-plans: screenshot del implementation plan generado
     Esta marca queda como hueco para que Enzo la rellene al generar slides -->
```

**Justificación:** la parte "Por qué importa" es la única 100% del autor; el resto es cita/extracción del SKILL.md. Esto hace que el source material **enmarque** la fuente canónica en lugar de competir con ella. El placeholder `<!-- INSERT-USER-CAPTURE -->` queda explícito en el markdown para que la fase de generación de slides lo encuentre y lo trate como "image-and-text slide vacía a rellenar". La sub-sección "Punto de auto-review" es opcional y se omite limpiamente cuando la skill no tenga una auto-review interna definida en su SKILL.md.

## Excepciones a la plantilla

- **§04 (`04-superpowers-que-es.md`):** no es una skill, es overview. Sigue otro molde — diagrama del happy-path, problema que resuelve, filosofía. Sin placeholder de captura.
- **§05 (`05-instalar-superpowers.md`):** demo de instalación. Formato beat-sheet tipo S04 (qué hago / qué digo / qué mirar), no plantilla de skill.
- **§08 (`08-github-flow.md`):** no es una skill de Superpowers — es un workflow externo. Sigue otro molde — mini-refresher + workflow + por qué encaja con Superpowers. Cita honesta de que `using-git-worktrees` existe en el plugin pero no se enseña.

**Skills con sub-sección de auto-review activa:** §06 brainstorming, §07 writing-plans, §09 subagent-driven-dev. Las demás skills del happy-path (§10 TDD, §11 code-review, §12 verification-before-completion, §13 finishing-branch) **omiten** esa sub-sección — code-review y verification-before-completion **son** ellas mismas pasos de review, así que reduplicar internamente sería ruido. (§08 no usa la plantilla, ver excepción anterior.)

## Fuentes canónicas

**Para §§02-03 (plugins genérico):**
- Doc oficial: `https://code.claude.com/docs/en/plugins-reference` (fetch al momento de generar el contenido del archivo)

**Para §§04-13 (Superpowers y skills):**
- `semanas/05/source_material/superpowers/README.md` (visión general)
- `semanas/05/source_material/superpowers/skills/<skill-name>/SKILL.md` (uno por skill)
- Los SKILL.md son la fuente de verdad — el source material los **cita y enmarca**, no los reemplaza

**Para §14 (bajada al TP):**
- `semanas/04/source_material/14-trabajo-final.md` (no se contradice, solo callback)

## Out of scope

- Crear plugins propios — fuera de alcance, queda para curiosidad del alumno.
- Worktrees como técnica git — explícitamente excluido por nivel de la cohorte.
- Skills off-path en detalle (debugging, parallel agents, writing-skills) — sólo se nombran en §13.
- Re-definir consignas del TP final — ya quedó en S04 §14.
- Cualquier referencia al título original "Proyecto Integrador I: Ideación e Ingeniería de Prompts" — la semana se rediseña con foco propio; el bridge al TP queda implícito por la skill `brainstorming` (que ES ingeniería de prompts aplicada a diseño) y por §14 de cierre.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Las capturas de Enzo no están listas el día de armar slides | Los placeholders quedan visibles. Si falta una, la sección de la skill puede dictarse igual sólo con el contenido conceptual. La captura es enriquecimiento, no infraestructura. |
| 15 secciones puede ser denso (lo fue en S04 con 14) | El target es ~170 min de material para 180 min de clase, buffer ajustado. Las secciones de skill son cortas (~12 min cada una) por la repetición de plantilla. Si en spine se ve muy apretado, candidatos a comprimir: §05 instalación (3 min mínimos) o §14 resto del cinturón. |
| Plugins de Claude Code es feature relativamente reciente; la doc puede cambiar | Fetch de `code.claude.com/docs/en/plugins-reference` se hace al generar el contenido, no se cachea en el spec. |
| `using-git-worktrees` se menciona en la README pero no se enseña | Mensaje explícito en §08: "existe en el plugin, no lo usamos en este curso, acá tenés el link si querés explorar después". Disclosure honesta, sin esconder. |
