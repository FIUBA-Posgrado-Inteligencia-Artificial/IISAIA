# Semana 4 — Fundamentos de Agentic AI y Claude Code

Este es el material fuente de la clase de Semana 4. La presentación reveal.js se generó con `/build-class` a partir de estos archivos.

> **Estado (2026-09-23).** El deck se siguió editando después de generarse y ya no coincide con este material; la descripción canónica de qué hay en cada slide es [`spine.md`](../spine.md). Lo principal que cambió: la Parte 2 pasó a ser "Configurar el harness" y muestra cada pieza también en Codex y OpenCode; plan mode dejó de ser sección propia (`13-plan-mode.md`) y el trabajo final es §13; se eliminó la slide "Qué confunde" de cada pieza; y las demos corren sobre el tp-final de referencia en vez del `demo-repo`, que se eliminó. Cada archivo de abajo tiene su propia nota.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-de-escribir-a-actuar.md](01-de-escribir-a-actuar.md) | De una IA que escribe a una que actúa | Apertura (~10 min) |
| 2 | [02-el-loop-agentic.md](02-el-loop-agentic.md) | El loop: pensar → actuar → observar | Fundamentos (~20 min) |
| 3 | [03-tools-las-manos.md](03-tools-las-manos.md) | Tools: las manos del agente (callback S1) | Fundamentos (~18 min) |
| 4 | [04-la-ventana-es-todo.md](04-la-ventana-es-todo.md) | La ventana de contexto es finita | Fundamentos (~22 min) |
| 5 | [05-cuando-el-agente-falla.md](05-cuando-el-agente-falla.md) | Modos de falla y el rol del supervisor | Fundamentos (~12 min) |
| 6 | [06-claude-code-es-el-loop.md](06-claude-code-es-el-loop.md) | Claude Code es ese loop, concreto | Claude Code (~12 min) |
| 7 | [07-CLAUDE-md.md](07-CLAUDE-md.md) | CLAUDE.md jerárquico + auto memory | Claude Code (~18 min) |
| 8 | [08-rules.md](08-rules.md) | Rules path-scoped en `.claude/rules/` | Claude Code (~16 min) |
| 9 | [09-settings-json.md](09-settings-json.md) | settings.json del runtime | Claude Code (~12 min) |
| 10 | [10-permisos.md](10-permisos.md) | Permisos: allow / deny / ask | Claude Code (~16 min) |
| 11 | [11-skills-y-slash-commands.md](11-skills-y-slash-commands.md) | Skills y slash commands | Claude Code (~14 min) |
| 12 | [12-sub-agents.md](12-sub-agents.md) | Sub-agents: aislar contexto | Claude Code (~12 min) |
| 13 | [13-plan-mode.md](13-plan-mode.md) | Plan mode + permission modes | Claude Code (~12 min) |
| 14 | [14-trabajo-final.md](14-trabajo-final.md) | Trabajo final: framing y motivación | Cierre (~20 min) |

## Hilo conductor

La semana 1 te dio las piezas del modelo (tokens, ventana de contexto = working memory, tool use). Las semanas 2-3 te enseñaron a dirigir: nombrar piezas y dictar contratos a una IA que escribe pero no actúa. Esta semana cierra el salto: la IA ahora **actúa** — corre en un loop, usa herramientas, modifica tu repo. Para dirigir algo que actúa solo necesitás entender dos cosas: el loop que ejecuta y la memoria con la que trabaja.

La parte 2 (§7–§13) recorre las siete piezas configurables del runtime de Claude Code — CLAUDE.md, rules, settings.json, permisos, skills, sub-agents, plan mode — con la misma plantilla (qué es / dónde vive / cuándo se carga / cómo se usa / casos límite / mini-demo), anclada en la documentación oficial y verificada en un repo demo abierto en VS Code. La clase no es un tour de features: es entender la arquitectura del runtime de modo que se pueda abrir cualquier proyecto y ubicar las piezas.
