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
