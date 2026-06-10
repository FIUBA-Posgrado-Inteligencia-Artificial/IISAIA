# Más allá del set que trae el host

## El set que ya tenés

Claude Code trae un set de tools de fábrica. `Read` y `Write` para tocar archivos, `Grep` y `Glob` para buscar, `Edit` para modificar, `Bash` para correr lo que necesites. Para el grueso del workflow de desarrollo local — leer código, modificar código, correr comandos — ese set te alcanza, y lo venís usando.

Quién lo decidió fue Anthropic. Vos no podés agregarle un tool nuevo a Claude Code editando su código fuente. El set es finito y curado.

## Lo que no está

Pensá tres cosas concretas que querrías que el agente haga y que no están en ese set:

- **Tirar una query contra Postgres de producción** y traerte las filas que matchean cierto patrón. Sí, `Bash` con `psql` te lo deja hacer si las credenciales están en el entorno. Pero el agente no sabe cuándo conviene un `SELECT` chico o un `EXPLAIN` antes, ni qué columnas son sensibles. Querrías un tool con tipos, schema declarado, y permisos.
- **Controlar un browser** — abrir una página, hacer click en un botón, sacar una screenshot, completar un form. Eso no lo hace `Bash` con `curl`: ni ejecuta JS, ni renderiza, ni interactúa. No está.
- **Traer la doc actualizada de un SDK que salió ayer.** El modelo tiene cutoff de entrenamiento. Si la API cambió después, no se entera. Querrías que el agente pueda *consultar* docs reales antes de tipear código, no salir de memoria.

Tres cosas concretas que no están en el set por default y que en el mundo real aparecen seguido.

## Las dos salidas viejas, y por qué no escalan

Cuando te topás con una capacidad que el host no trae, hay dos respuestas instintivas. Las dos tienen techo.

**Wrapper custom por host.** Te armás un script de Bash, un agente paralelo que invoca tu API, un binario que el agente ejecuta. Funciona en este Claude Code. Pero si mañana querés probar Cursor, o Codex CLI, o Gemini CLI, el wrapper no se mueve con vos — lo escribiste para *este* host. Cada capacidad nueva × cada host nuevo es trabajo nuevo. Eso es N×M, y crece feo.

**Pegar al prompt.** La salida vaga: copiás el schema de Postgres, copiás el HTML de la página, copiás el README del SDK. Si lo necesitás una vez, te alcanza. Si lo necesitás todas las sesiones, pasás todo el tiempo copiando y pegando. Pegás tokens (costos), perdés frescura (el dato refleja un momento, no el actual), y agregás ruido (la atención del modelo se degrada con tamaño). Esto ya lo viste pasar — es por qué existen las skills, los sub-agents y el harness.

Las dos salidas funcionan en chico. Ninguna escala.

## La salida nueva — un protocolo común

Lo que falta no es un wrapper más. Es un **protocolo común** que el host hable, los proveedores hablen, y vos no tengas que escribir un wrapper por host cada vez. Un protocolo que diga "así describe un proveedor de capacidades lo que ofrece, así lo invoca un host". Si el protocolo existe y todos lo hablan, el problema N×M colapsa a N+M.

Ese protocolo existe, se llama **Model Context Protocol (MCP)**, y lo que viene en las próximas secciones es cómo está armado y qué te resuelve.
