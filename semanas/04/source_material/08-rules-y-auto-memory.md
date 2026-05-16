# Rules y auto memory: contexto que no siempre está

§7 cerró con una pregunta directa: ¿y si una instrucción pudiera estar en el contexto *solo cuando hace falta*, y no ocupar espacio el resto del tiempo? La pregunta no era retórica. Existen dos mecanismos en Claude Code que la responden, y los dos viven en una categoría diferente a CLAUDE.md. Este archivo los cubre.

Los dos mecanismos son `.claude/rules/` — instrucciones modulares, algunas de las cuales entran al contexto condicionalmente — y la memoria automática, donde el agente escribe sus propios aprendizajes sin que vos toques ningún archivo. Juntos cubren dos de las tres estrategias que nombramos en §4: **condicional** y **autocurado**.

## .claude/rules/ : instrucciones modulares

Además de CLAUDE.md, Claude Code tiene su propio mecanismo de instrucciones en archivos separados: cualquier archivo `.md` dentro de `.claude/rules/` se trata como una regla independiente. La ubicación se descubre recursivamente, así que podés organizar subdirectorios — `rules/backend/`, `rules/testing/`, `rules/deploy/` — y Claude los encuentra igual.

Un detalle que vale aclarar porque suele generar confusión: `.claude/rules/` es el mecanismo nativo de Claude Code, no `.cursorrules`. Cursor tiene su propio sistema de reglas, con ese nombre, y no es compatible. Si llegás a leer tutoriales que hablen de `.cursorrules` en el contexto de Claude Code, lo están mezclando con otra herramienta.

Las reglas sin frontmatter YAML se cargan al arranque, con la misma prioridad que `.claude/CLAUDE.md`. En términos de contexto, se comportan exactamente igual que un CLAUDE.md de proyecto: siempre presentes, siempre costando tokens. La ventaja sobre CLAUDE.md es organizativa — un archivo por tema (`testing.md`, `api-design.md`, `deploy.md`) en lugar de un archivo monolítico — pero el costo en contexto es el mismo.

También existe `~/.claude/rules/` a nivel de usuario: reglas que aplican a todos tus proyectos, cargadas antes de las reglas del proyecto. Mismo mecanismo, alcance más amplio.

Hasta acá, nada cambia respecto a §7. El cambio viene cuando le agregás frontmatter.

## Path-scoped rules: contexto condicional

Una regla puede declarar a qué archivos aplica. El mecanismo es YAML frontmatter con el campo `paths:`, que acepta globs estándar:

```
---
paths:
  - "src/api/**/*.ts"
---

Cuando trabajés con archivos de la API, asegurate de que cada endpoint tenga un comentario JSDoc con su método HTTP y ruta completa. Nunca uses `any` en los tipos de request o response.
```

Una regla con `paths:` no entra al contexto en el arranque. Entra cuando Claude toca un archivo que matchea alguno de los patrones. Si la sesión entera transcurre trabajando en el frontend, esa regla de API nunca aparece. Si en un momento Claude lee `src/api/users.ts`, la regla entra. Cuando la tarea en esa área termina, el contexto puede seguir adelante sin arrastrarla.

Los globs soportados cubren lo habitual: `**/*.ts` para todos los `.ts` del árbol, `src/**/*` para todo lo que esté bajo `src/`, `*.md` para markdown en la raíz, y expansión de llaves como `src/**/*.{ts,tsx}` para TypeScript con JSX. El trigger es leer un archivo que matchee — no cualquier herramienta, sino específicamente acceder a ese archivo.

La diferencia conceptual con §7 es precisa: CLAUDE.md siempre cuesta contexto, con o sin relevancia para la tarea del momento. Una path-scoped rule cuesta cero hasta que es relevante. Para instrucciones que solo aplican a una parte del codebase — las reglas de la API, las convenciones del sistema de autenticación, los criterios de los tests de integración — ese costo diferido es exactamente lo que querés.

## Auto memory: la memoria que el agente se escribe

Hay un segundo sistema de memoria, completamente distinto de CLAUDE.md. La diferencia no es dónde vive el archivo: es quién lo escribe.

CLAUDE.md lo escribís vos. La memoria automática la escribe Claude.

A lo largo de las sesiones, Claude Code observa correcciones, preferencias y descubrimientos — qué gestor de paquetes usa el proyecto, cómo se corren los tests, qué convención de nombrado preferís, qué error se repitió y cómo se resolvió — y decide qué vale la pena recordar. Sin que vos lo pidas, lo guarda. En la próxima sesión, ese aprendizaje ya está disponible.

El almacenamiento vive en `~/.claude/projects/<project>/memory/`. Hay un archivo principal `MEMORY.md` que funciona como índice, y archivos de tema opcionales. Claude genera uno por cada git repo; si trabajás con worktrees, todos comparten la misma carpeta de memoria. Es local a tu máquina — no viaja al repositorio, no se comparte con el equipo.

El mecanismo de carga tiene un límite concreto: las primeras **200 líneas o 25 KB** de `MEMORY.md` — lo que se alcance primero — entran al contexto al inicio de cada sesión. Los archivos de tema se cargan bajo demanda, cuando son relevantes para la tarea.

Para auditar qué recuerda Claude, el comando es `/memory`. Lista los archivos de instrucción cargados en la sesión — CLAUDE.md, rules, archivos locales — y da acceso a la carpeta de memoria automática. También desde ahí podés activar o desactivar el sistema. Si le decís explícitamente "recordá que en este proyecto usamos `npm`, no `yarn`", Claude lo guarda. Si la sesión terminó y no lo pediste pero Claude aprendió algo relevante por tus correcciones, puede igualmente guardarlo solo.

Un punto operativo: auto memory es relativamente reciente, así que si no lo ves disponible, verificá que tu versión de Claude Code esté actualizada.

## La tricotomía (cierre del adelanto del §4)

§4 plantó un adelanto con tres rótulos. Es hora de cerrarlo.

En esa sección dijimos que cualquier estrategia de manejo de contexto se puede clasificar por cómo trata la información que el agente necesita. Los tres rótulos eran **siempre cargado**, **condicional** y **autocurado**. §7 cubrió el primero. Este archivo cubre los otros dos.

El mapa queda así:

- **Siempre cargado** — CLAUDE.md y `@import`. Lo que el agente necesita en cada sesión, sin excepción: arquitectura del proyecto, convenciones globales, restricciones que nunca cambian. Costo constante; presencia garantizada.
- **Condicional** — Path-scoped rules (y las skills, que veremos en §9). Lo que aplica solo a ciertas áreas del codebase. Costo cero hasta que es relevante; entra cuando hace falta y no antes.
- **Autocurado** — Auto memory. Es exactamente lo que §4 anticipó con este rótulo: el sistema detecta aprendizajes, correcciones y preferencias mientras trabaja y los conserva entre sesiones por su cuenta. No es el supervisor quien decide cada vez qué persistir ni lo escribe a mano; el sistema lo hace.

Esto no es taxonomía por el gusto de clasificar. §4 decía que "gestionar el contexto es la habilidad central" de quien dirige agentes de manera efectiva. La tricotomía es exactamente esa habilidad hecha operacional: saber en qué categoría cae cada instrucción, y usar el mecanismo que corresponde.

Lo que siempre aplica va en CLAUDE.md. Lo que aplica a un área va en una path-scoped rule. Lo que el agente descubre solo va en auto memory. Poner instrucciones en el mecanismo equivocado tiene un costo concreto: o pagás contexto que no necesitabas pagar, o la instrucción no está cuando la tarea la necesita.

Con esto el adelanto de §4 queda cerrado.

## Mini-demo en vivo: la rule condicional

Este demo (D8) muestra el mecanismo condicional más claro que existe: una instrucción que entra al contexto solo cuando toca los archivos correctos. El movimiento es medible en pantalla.

**Intro para el aula:** Vamos a crear una regla que no está cargada. Y vamos a ver exactamente cuándo aparece.

---

**Beat 1 — La regla existe, pero no está cargada**

*Qué hago:* Crear `.claude/rules/api.md` con el siguiente contenido:

```
---
paths:
  - "src/api/**"
---

En todos los archivos de la API, incluí un comentario al inicio de cada función con el método HTTP y la ruta que maneja. Formato: `// [METHOD] /ruta`.
```

Ejecutar `/memory` (o `/context` si está disponible) para mostrar qué archivos de instrucción están cargados en la sesión actual.

*Qué digo:* *"La regla existe. Está en el directorio. Pero miren: no está cargada."*

*Qué mirar:* La regla `api.md` no aparece en la lista de fuentes de instrucción cargadas.

---

**Beat 2 — Tocar un archivo que no matchea**

*Qué hago:* Pedirle a Claude que edite un archivo fuera de `src/api/` — por ejemplo, que mejore el `README.md` del proyecto. Volver a ejecutar `/memory`.

*Qué digo:* *"Tocó un archivo. Trabajó. Pero no era un archivo de la API. Sigue sin cargarse."*

*Qué mirar:* La regla sigue ausente de la lista de fuentes. El trabajo en README no activó el trigger.

---

**Beat 3 — Tocar un archivo que sí matchea**

*Qué hago:* Pedirle a Claude que lea o modifique un archivo dentro de `src/api/` — por ejemplo, `src/api/users.ts`. Volver a ejecutar `/memory`.

*Qué digo:* *"Ahora sí. Apareció cuando fue relevante. Costó cero contexto hasta ese momento. Eso es lo que CLAUDE.md no puede hacer."*

*Qué mirar:* La regla `api.md` ahora aparece cargada. Y si Claude generó o editó código en ese archivo, debería incluir los comentarios que la regla prescribía.

---

**Plan B si `/memory` no expone el detalle:** Si el comando no muestra la lista de fuentes con suficiente granularidad para ver el cambio, demostrar por comportamiento. La regla prescribe un comentario observable: `// [METHOD] /ruta` al inicio de cada función. Pedir a Claude que toque un archivo fuera de `src/api/` y verificar que no agrega el comentario. Luego pedir que toque uno dentro de `src/api/` y verificar que sí lo agrega. El trigger condicional se demuestra por el efecto, no por la lista de fuentes.

---

## Mini-demo en vivo: auto memory

Este demo (D9) muestra el mecanismo opuesto al condicional: la memoria que nadie configuró explícitamente. El agente la escribe solo.

**Intro para el aula:** CLAUDE.md lo escribiste vos. Esto lo escribe Claude. No editaste ningún archivo.

---

**Beat 1 — La corrección que Claude recuerda**

*Qué hago:* En una sesión activa, corregirle algo concreto a Claude. Por ejemplo, si propone `yarn install`, responder: *"En este proyecto usamos `npm`, no `yarn`. Siempre."* Observar si aparece el indicador "Writing memory" en la respuesta.

*Qué mirar:* El indicador de que Claude está guardando algo en su memoria automática. No siempre es visible con ese texto exacto — depende de la versión — pero la sesión debería mostrar alguna señal de escritura.

---

**Beat 2 — Nueva sesión, misma corrección aplicada**

*Qué hago:* Cerrar la sesión y abrir una nueva en el mismo directorio. Pedirle algo que normalmente induciría el error corregido — por ejemplo, "¿cómo instalo las dependencias?" o pedirle que agregue una dependencia nueva.

*Qué digo:* *"No edité ningún CLAUDE.md. No escribí ninguna regla. Igual se acordó. Eso lo escribió él, no yo."*

*Qué mirar:* Claude responde con `npm`, no con `yarn`, sin que nadie lo haya puesto en ningún archivo de instrucción manual.

---

**Beat 3 — Abrir la carpeta de memoria**

*Qué hago:* Ejecutar `/memory` y navegar hasta la carpeta de memoria automática (`~/.claude/projects/<project>/memory/`). Abrir `MEMORY.md`.

*Qué digo:* *"Acá está. Markdown plano. Lo podés leer, editar o borrar. No es una caja negra: es un archivo como cualquier otro."*

*Qué mirar:* El contenido real de `MEMORY.md`. Debería contener la preferencia de `npm` sobre `yarn`, posiblemente con contexto adicional que Claude decidió incluir.

---

**Plan B si la memoria automática no se dispara en vivo:** Auto memory depende de que Claude decida que algo vale la pena recordar. No es determinístico. Si el demo en vivo no produce escritura observable, tener una sesión anterior guardada donde la memoria sí se escribió. Abrir `/memory` y mostrar ese `MEMORY.md` preparado. El punto pedagógico — que el archivo existe, es editable y fue escrito por Claude — se sostiene igual con un archivo de sesión previa.

---

Rules y auto memory mostraron dos propiedades que CLAUDE.md no tiene: la condicionalidad — una instrucción que entra al contexto solo cuando es relevante — y el autocurado — un sistema que acumula aprendizajes sin intervención del supervisor. Las skills, que cubrimos en §9, llevan la idea de condicional un paso más lejos: no solo instrucciones que aparecen cuando tocás ciertos archivos, sino capacidades completas que el agente invoca cuando la tarea lo requiere.
