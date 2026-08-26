# Semana 6 — Model Context Protocol (MCP)

Este es el material fuente de la clase de Semana 6. La presentación reveal.js se genera con `/build-class` a partir de estos archivos.

> **Estado:** el deck entregado sigue el rediseño aprobado el 2026-06-09 (documentado en `spine.md`). El cierre pasó de tres demos net-new + una sección de riesgos a **dos demos que contrastan los transports** (local Stdio vs remoto Streamable HTTP) más un cierre con recomendaciones prácticas de Claude Code. Las secciones §8 y §9 se escribieron directamente contra la documentación oficial y no tienen `.md` de source dedicado.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-mas-alla-del-set-que-trae-el-host.md](01-mas-alla-del-set-que-trae-el-host.md) | Más allá del set que trae el host | Setup (~15 min) |
| 2 | [02-protocolo-no-api.md](02-protocolo-no-api.md) | Protocolo, no API | Mecánica (~12 min) |
| 3 | [03-arquitectura-mcp.md](03-arquitectura-mcp.md) | Arquitectura: host / cliente / servidor | Mecánica (~13 min) |
| 4 | [04-tres-primitives.md](04-tres-primitives.md) | Las tres primitives | Mecánica (~13 min) |
| 5 | [05-discovery-dinamico.md](05-discovery-dinamico.md) | Discovery dinámico | Mecánica (~14 min) |
| 6 | [06-ecosistema-vendor-neutral.md](06-ecosistema-vendor-neutral.md) | El ecosistema, qué viaja con vos y la pregunta cero | Mecánica (~14 min) |
| 7 | [07-demo-playwright.md](07-demo-playwright.md) | Demo local: Playwright (Stdio) | Demos (~10 min) |
| 8 | — | Demo remoto: Linear (Streamable HTTP) | Demos (~10 min) |
| 9 | — | Claude Code en el día a día | Cierre (~10 min) |

## Material sin usar

Estos archivos quedaron del plan anterior al rediseño y **no** forman parte del deck entregado:

- `08-demo-context7.md` — context7 dejó de tener demo propio; sobrevive como ejemplo net-new dentro de §6.
- `09-demo-blender.md` — el demo de Blender se eliminó.
- `10-cuando-mcp-y-riesgos.md` — la calibración se absorbió en §6, alrededor de la pregunta cero "¿el host ya lo hace?".

## Hilo conductor

Los agentes que vienen de S04 y S05 ya usan tools — `Read`, `Write`, `Bash`, `Grep`, `Glob`, `Edit`. Lo que no se discutió aún: ese set lo decidió Anthropic, y para todo lo que está afuera (DB de prod, browser, docs en vivo de un SDK nuevo) no hay tool. Las dos salidas instintivas — wrapper custom por host (N×M, no se reusa) y pegar al prompt (costos, frescura, ruido) — tienen techo. MCP es la salida estructural: un protocolo común que cualquier host habla y cualquier proveedor habla, donde el problema colapsa a N+M.

El bloque (§§2-6) desarma el protocolo en capas: por qué protocolo y no API (§2), arquitectura host/cliente/servidor (§3), las tres primitives expuestas por el server (§4), discovery dinámico como pieza más elegante del protocolo (§5), y el ecosistema vendor-neutral con la pregunta cero "¿el host ya lo hace?" (§6).

Los demos (§§7-8) materializan el eje local/remoto que planta §3: **Playwright** como server local por Stdio —subproceso en tu máquina, sin red ni auth, actuando sobre un browser— y **Linear** como server remoto por Streamable HTTP —hosteado por el proveedor, se conecta por URL y OAuth—. Cambia la plomería; el patrón de intercambio es idéntico. Ese contraste es el corazón del bloque, no las herramientas en sí.

El cierre (§9) cambia de registro: se deja MCP y se baja a recomendaciones prácticas de Claude Code para el día a día, cerrando la semana en una sola idea — el agente ya no está limitado a lo que trae de fábrica, MCP es cómo lo extendés, y la pregunta cero es cómo elegís.
