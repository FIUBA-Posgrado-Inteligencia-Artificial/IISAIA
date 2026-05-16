# Claude Code es ese loop

Lo que describimos en §2 como pensar → actuar → observar → repetir hasta una condición de corte no era un diagrama abstracto. Era la descripción de algo que podés abrir ahora mismo en la terminal y dejar corriendo. Claude Code es una implementación de ese loop. No es un concepto nuevo: es el mismo de §2, con nombre propio y pantalla.

Cuando Claude Code trabaja en tu repo, no está "pensando en cómo ayudarte". Está ejecutando vueltas de un loop que ya conocés. El desafío la primera vez que lo veas no es entender qué hace — ya lo sabés. Es identificar en qué fase está.

## La pantalla mapeada al loop

Abrís Claude Code, le das una tarea, y la salida empieza a correr. ¿Qué estás mirando?

La primera cosa que aparece es texto del modelo razonando sobre el estado actual: qué sabe, qué hipótesis tiene, qué paso viene. Eso es **pensar**. No es una respuesta para vos — es el modelo formulando la próxima acción en función de lo que tiene en contexto.

Después aparece una tool call: `Edit`, `Bash`, `Read`, `Write`. El nombre de la herramienta, los argumentos, el archivo o el comando. Eso es **actuar**. Algo en el entorno cambia: un archivo se edita, un comando se ejecuta, una lectura se completa. El agente no imaginó la acción — la ejecutó.

Después aparece el resultado: la salida del comando, el contenido del archivo leído, el error del proceso. Eso es **observar**. Esa información nueva entra al contexto del agente y alimenta la próxima vuelta de pensar. Si la condición de corte no se cumplió, empieza otra vuelta.

La pantalla no es un log de actividad: es el loop expuesto, vuelta por vuelta. Pensar → actuar → observar → repetir. Exactamente como lo vimos en §2.

Si ya corriste el loop desnudo del §2, este es el momento de volver a señalarlo, ahora con nombre propio.

## Mismo modelo, mismas reglas

El §2 definió un agente como cuatro piezas: LLM + loop + tools + entorno. Las cuatro aparecen en Claude Code, y conviene identificarlas antes de seguir.

El **LLM** es Claude — decide qué hacer en cada vuelta a partir del contexto acumulado: tarea original, historial, última observación.

El **loop** es el motor. Claude Code no para después de la primera respuesta: sigue hasta que el objetivo se cumple o una condición de corte lo detiene. El loop convierte al LLM en algo que termina tareas en lugar de describirlas.

Las **tools** son las manos: editar archivos, ejecutar comandos, buscar en el código, leer outputs. Sin ellas el LLM razonaría sobre qué hacer en tu repo pero no podría tocar nada.

El **entorno** es tu repo real, tu terminal, tu filesystem. No una simulación: cuando Claude Code ejecuta `npm test`, los tests corren de verdad. El entorno es lo que el agente observa y modifica — y es tuyo.

Las cuatro piezas. El mismo diagrama del §2, con una herramienta concreta detrás de cada una.

## Lo que viene

El resto de la clase recorre las decisiones de diseño de Claude Code una por una. Pero todas responden la misma pregunta: ¿esto actúa sobre cómo corre el loop, o sobre qué hay en el contexto cuando el loop arranca?

- **§7 — CLAUDE.md jerárquico**: memoria persistente que entra al contexto antes de que el loop empiece.
- **§8 — Rules y auto memory**: instrucciones condicionales que entran al contexto solo cuando son relevantes, y la memoria que el agente se escribe solo entre sesiones.
- **§9 — Skills y slash commands**: capacidades invocables on-demand que no ocupan contexto hasta que se necesitan.
- **§10 — Sub-agents**: loops dentro del loop; el agente delega vueltas a agentes especializados.
- **§11 — Plan mode y control**: mecanismos para pausar el loop, revisar antes de actuar, retomar con contexto intacto.

Llevá esa pregunta a cada sección y las conexiones se hacen solas.
