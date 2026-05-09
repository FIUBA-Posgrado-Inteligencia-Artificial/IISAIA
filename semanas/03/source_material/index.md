# Semana 3 — Arquitectura Backend y Datos

Este es el material fuente de la clase de Semana 3. La presentación reveal.js se genera con `/build-class` a partir de estos archivos.

## Orden de lectura

| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-backend-y-el-supervisor.md](01-backend-y-el-supervisor.md) | Por qué hace falta vocabulario backend cuando la IA escribe el código | Apertura (~10 min) |
| 2 | [02-cliente-servidor-y-http.md](02-cliente-servidor-y-http.md) | Cliente-servidor, verbos HTTP y códigos de estado | Anatomía (~15 min) |
| 3 | [03-rest-como-estilo.md](03-rest-como-estilo.md) | REST como estilo: recurso, jerarquía, idempotencia | Anatomía (~12 min) |
| 4 | [04-rutas-controladores-y-contratos.md](04-rutas-controladores-y-contratos.md) | El endpoint como contrato dictable | Anatomía (~12 min) |
| 5 | [05-datos-relaciones-vs-documentos.md](05-datos-relaciones-vs-documentos.md) | SQL vs NoSQL: cuándo conviene cada uno | Anatomía (~15 min) |
| 6 | [06-errores-y-observabilidad.md](06-errores-y-observabilidad.md) | Leer fallas: 4xx, 5xx, logs, stack traces | Anatomía (~10 min) |
| 7 | [07-de-lo-local-al-stack.md](07-de-lo-local-al-stack.md) | Bisagra al stack local; FastAPI y alternativas; tarea para semana 04 | Bisagra (~12 min) |
| 8 | [08-demo-en-vivo.md](08-demo-en-vivo.md) | Guion del demo en vivo con Claude Code | Demo (~30 min) |

## Hilo conductor

Esta clase enseña vocabulario backend para que el alumno pueda **dirigir** una IA cuando el código que se genera ya no vive en una pestaña del navegador. Es el espejo simétrico de la semana 02: igual que ahí aprendiste a nombrar las piezas del frontend, acá aprendés a nombrar las piezas del backend — verbos, rutas, contratos, datos, errores — y a pedirlas con precisión.

La clase también marca la bisagra del curso: dejamos atrás los entornos web (Canvas) y nos preparamos para trabajar en local. El cierre es un demo en vivo donde el profesor levanta un servidor con Claude Code; los alumnos no escriben código en clase, pero llegan a semana 04 con la herramienta instalada.
