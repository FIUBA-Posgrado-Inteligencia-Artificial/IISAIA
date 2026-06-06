# Demo: Playwright MCP

## Qué es

Playwright es el framework de Microsoft para automatizar browsers — el sucesor moderno de Selenium. Playwright MCP es un server que expone Playwright como tools para un agente. El agente, durante su razonamiento, puede pedirle al server "navegá a esta URL", "hacé click en este botón", "tomá una screenshot", "leé el HTML de la página".

Lo que vamos a ver es al agente actuando en un browser real, controlado por código, sin que vos copies o pegues nada del medio.

## Instalación

En Claude Code, el server se agrega con un comando o editando el archivo de configuración. La forma corta:

```bash
claude mcp add playwright npx -y @playwright/mcp
```

Eso registra el server en el host. La primera vez, `npx` baja el paquete; después arranca como subproceso cada vez que abrís una sesión.

## Demo 1 — Lectura

Pedido en lenguaje natural: "abrí https://news.ycombinator.com y traeme los títulos de los primeros 5 posts".

Qué pasa por dentro:

1. El LLM decide que esto necesita el tool `playwright.navigate`.
2. El cliente invoca el tool con la URL como parámetro.
3. El server lanza un browser, navega a la URL, espera a que la página cargue.
4. El LLM pide leer el contenido — otro tool.
5. El server devuelve el HTML; el LLM extrae los títulos y te los muestra.

Vos no copiaste el HTML. Vos no pegaste nada. El agente fue, miró y trajo.

## Demo 2 — Acción

Pedido: "andá a un form público (por ejemplo `https://httpbin.org/forms/post`) y completá los campos con datos de prueba".

Mismo patrón pero ahora con efecto. El agente navega, identifica los campos del form, llama tools de tipo `fill` para cada uno, llama un tool de tipo `click` para el submit y reporta lo que salió.

## Qué tenés que sacar de esto

No el cómo de Playwright. El cómo de Playwright lo busca el agente. Lo que tenés que sacar es la forma del intercambio: una capacidad externa, descripta por el server, invocada por el LLM, ejecutada del lado de afuera, con el resultado volviendo a la conversación. Ese patrón se repite igual con cualquier otro server. Cambia qué hace; no cambia cómo se habla.
