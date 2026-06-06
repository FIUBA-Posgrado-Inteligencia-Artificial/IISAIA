# Semana 6 — Model Context Protocol (MCP)

Este es el material fuente de la clase de Semana 6. La presentación reveal.js se genera con `/build-class` a partir de estos archivos.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-llm-no-ve-tu-mundo.md](01-llm-no-ve-tu-mundo.md) | El LLM no ve tu mundo | Concepto (~10 min) |
| 2 | [02-trampa-del-context-window.md](02-trampa-del-context-window.md) | La trampa del context window | Concepto (~10 min) |
| 3 | [03-separar-conocimiento-de-accion.md](03-separar-conocimiento-de-accion.md) | Separar conocimiento de acción | Concepto (~11 min) |
| 4 | [04-protocolo-no-api.md](04-protocolo-no-api.md) | Protocolo, no API | Concepto (~12 min) |
| 5 | [05-arquitectura-mcp.md](05-arquitectura-mcp.md) | Arquitectura: host / cliente / servidor | Concepto (~12 min) |
| 6 | [06-tres-primitives.md](06-tres-primitives.md) | Las tres primitives | Concepto (~12 min) |
| 7 | [07-discovery-dinamico.md](07-discovery-dinamico.md) | Discovery dinámico | Concepto (~12 min) |
| 8 | [08-ecosistema-vendor-neutral.md](08-ecosistema-vendor-neutral.md) | El ecosistema y por qué viaja con vos | Concepto (~11 min) |
| 9 | [09-demo-playwright.md](09-demo-playwright.md) | Demo: Playwright MCP | Demos (~12 min) |
| 10 | [10-demo-context7.md](10-demo-context7.md) | Demo: context7 MCP | Demos (~13 min) |
| 11 | [11-cuando-mcp-y-riesgos.md](11-cuando-mcp-y-riesgos.md) | Cuándo MCP, cuándo no, y riesgos | Cierre (~10 min) |

## Hilo conductor

Hasta ahora los agentes que vimos razonan sobre lo que está en su context window. Cuando hay que mirar afuera — un archivo del repo, una query a la base, una página web, las docs actuales de un SDK — el patrón fue copiar al prompt o esperar que el modelo ya lo sepa. Eso se cae en costos, frescura y ruido. MCP es la abstracción que separa lo que el LLM razona de lo que el LLM acciona, mediante un protocolo abierto que cualquier cliente puede hablar.

La parte 1 (§§01-08) construye la intuición por capas: el problema (§§01-02), el insight estructural (§§03-04), la mecánica (§§05-07), y el ecosistema vendor-neutral que cierra el arco del curso (§08). La parte 2 (§§09-10) materializa todo con dos demos cortos: Playwright para acción en el browser, context7 para docs reales sobre cualquier SDK. El cierre (§11) calibra: cuándo conviene MCP, cuándo no, y qué riesgos asumís cada vez que conectás un server.
