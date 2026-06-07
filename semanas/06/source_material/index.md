# Semana 6 — Model Context Protocol (MCP)

Este es el material fuente de la clase de Semana 6. La presentación reveal.js se genera con `/build-class` a partir de estos archivos.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-mas-alla-del-set-que-trae-el-host.md](01-mas-alla-del-set-que-trae-el-host.md) | Más allá del set que trae el host | Setup (~15 min) |
| 2 | [02-protocolo-no-api.md](02-protocolo-no-api.md) | Protocolo, no API | Mecánica (~12 min) |
| 3 | [03-arquitectura-mcp.md](03-arquitectura-mcp.md) | Arquitectura: host / cliente / servidor | Mecánica (~13 min) |
| 4 | [04-tres-primitives.md](04-tres-primitives.md) | Las tres primitives | Mecánica (~13 min) |
| 5 | [05-discovery-dinamico.md](05-discovery-dinamico.md) | Discovery dinámico | Mecánica (~14 min) |
| 6 | [06-ecosistema-vendor-neutral.md](06-ecosistema-vendor-neutral.md) | El ecosistema y qué vale instalar | Mecánica (~14 min) |
| 7 | [07-demo-playwright.md](07-demo-playwright.md) | Demo: Playwright MCP | Demos (~10 min) |
| 8 | [08-demo-context7.md](08-demo-context7.md) | Demo: context7 MCP | Demos (~10 min) |
| 9 | [09-demo-blender.md](09-demo-blender.md) | Demo: Blender MCP (física) | Demos (~10 min) |
| 10 | [10-cuando-mcp-y-riesgos.md](10-cuando-mcp-y-riesgos.md) | Cuándo MCP, cuándo no, y riesgos | Cierre (~10 min) |

## Hilo conductor

Los agentes que vienen de S04 y S05 ya usan tools — `Read`, `Write`, `Bash`, `Grep`, `Glob`, `Edit`. Lo que no se discutió aún: ese set lo decidió Anthropic, y para todo lo que está afuera (DB de prod, browser, docs en vivo de un SDK nuevo) no hay tool. Las dos salidas instintivas — wrapper custom por host (N×M, no se reusa) y pegar al prompt (costos, frescura, ruido) — tienen techo. MCP es la salida estructural: un protocolo común que cualquier host habla y cualquier proveedor habla, donde el problema colapsa a N+M.

El bloque (§§2-6) desarma el protocolo en capas: por qué protocolo y no API (§2), arquitectura host/cliente/servidor (§3), las tres primitives expuestas por el server (§4), discovery dinámico como pieza más elegante del protocolo (§5), y el ecosistema vendor-neutral con la pregunta cero "¿el host ya lo hace?" (§6). Los demos (§§7-9) materializan con **tres ángulos distintos**: Playwright (actuar sobre browser), context7 (informar al modelo con docs reales), Blender con física (crear en un dominio no-coding). El cierre (§10) calibra cuándo MCP, cuándo no, y qué riesgos asumís.
