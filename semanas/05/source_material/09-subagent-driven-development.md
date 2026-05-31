# subagent-driven-development

## Qué hace

subagent-driven-development ejecuta el plan despachando un subagent fresco por cada tarea. Cada subagent arranca con contexto limpio, no hereda la sesión del coordinador ni arrastra decisiones tácitas de tareas anteriores. Recibe el texto completo de su tarea más el contexto que necesita, implementa, testea, commitea y devuelve un resumen.

Entre tarea y tarea, el coordinador no pasa directo a la siguiente: corre un two-stage review (spec compliance primero, code quality después) y sólo cuando ambas pasan marca la tarea como hecha y despacha el subagent de la siguiente.

## Cuándo se activa

Con un plan aprobado en disco, cuando elegís ejecutarlo en este modo. La alternativa es `executing-plans`, que batchea las tareas en una sesión paralela con checkpoints humanos entre cada una. subagent-driven es más rápido y más autónomo: corre continuo entre checkpoints, sin pedirte permiso entre tareas. executing-plans es más conservador y te deja revisar a mano antes de seguir. Si querés delegar una hora entera y volver a ver el resultado, esta es la skill.

## Por qué importa

Es el corazón del autonomous coding de Superpowers. Cada subagent arranca limpio, así que no acumula context rot ni decisiones tácitas que se le filtraron en la Task 1 y le ensucian la Task 4. El coordinador es el único que mantiene la visión global: mira el plan, el spec y el estado del repo, y reparte tareas con foco quirúrgico.

Acá se cierra el callback a spec-driven development. El subagent no improvisa: lee el plan y el spec como contratos cerrados, y por eso podés correr el flujo casi autónomo durante una hora sin que se desvíe. Si el spec dice X y el plan dice cómo hacer X, el subagent hace X. Si en el medio surge una pregunta de diseño que no está en ninguno de los dos, no la inventa: se la devuelve al coordinador.

## El punto crítico

Un subagent fresco por tarea, no un subagent que recibe varias tareas. El reset de contexto entre tareas es lo que hace que esto escale. Si reusás el mismo subagent para varias tareas seguidas, perdés el beneficio principal de la skill: arranca con todo el ruido de la tarea anterior, las decisiones intermedias, los falsos comienzos. Fresh subagent o no arranca.

## Punto de auto-review

Después de que el subagent reporta tarea completa, el coordinador no pasa directamente a la siguiente. Corre un two-stage review antes. (1) Spec compliance review: ¿el código que produjo el subagent cumple lo que el plan pedía? ¿Implementó todo? ¿Agregó cosas que no estaban pedidas? El reviewer compara el diff contra el texto de la tarea, sin entrar a juzgar estilo. (2) Code quality review: ¿el código es razonable? ¿Sin dead code, sin shortcuts, sin sobre-engineering? Recién acá se mira calidad. El orden importa: si el código es lindo pero no hace lo que el plan pedía, hay que arreglar el qué antes que el cómo.

Si la spec compliance review encuentra issues, el coordinador vuelve a despachar al mismo implementer subagent con feedback puntual y el reviewer vuelve a revisar. Si la code quality review encuentra issues, lo mismo. Sólo cuando ambas etapas pasan, se marca la tarea como hecha y se despacha la siguiente. El humano interviene en dos momentos: cuando ambas etapas pasan y se le presenta el resumen, o cuando la skill explícitamente pide criterio que no está en el plan ni en el spec.

## Anti-patrones a evitar

- Reusar el subagent para varias tareas. Perdés el reset de contexto y volvés a la sesión sucia que la skill estaba evitando. Cada tarea arranca fresca o no arranca.
- Saltearse el two-stage review. Es lo que evita que el flujo derive. Sin review, dos tareas más adelante estás compensando errores que se podían atrapar al toque, y el costo de revertir crece exponencialmente.
- Intervenir demasiado pronto. La skill está diseñada para correr sola entre checkpoints. Si interrumpís en el medio de una tarea para "ayudar", rompés el patrón y perdés la productividad del modo autónomo.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/subagent-driven-development/SKILL.md`

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot de la terminal con subagents despachándose en serie + el output
     de un two-stage review entre dos tareas. Idealmente, mostrar dos casos contrastantes:
     uno donde la spec compliance review pasó al primer intento, y otro donde el reviewer
     encontró issues, el implementer subagent re-ejecutó con feedback puntual, y la segunda
     pasada quedó verde. -->
