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
