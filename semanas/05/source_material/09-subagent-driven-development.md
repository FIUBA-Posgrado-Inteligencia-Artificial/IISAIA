# subagent-driven-development

## Qué hace

subagent-driven-development ejecuta el plan despachando un subagent fresco por cada tarea. Cada subagent arranca con contexto limpio, no hereda la sesión del coordinador ni arrastra decisiones tácitas de tareas anteriores. Recibe el texto completo de su tarea más el contexto que necesita, implementa, testea, commitea y devuelve un resumen.

Entre tarea y tarea, el coordinador no pasa directo a la siguiente: despacha un reviewer que devuelve dos veredictos en la misma pasada (spec compliance y code quality), y sólo cuando los dos pasan marca la tarea como hecha y despacha la siguiente. Al terminar todas, corre una review de toda la rama con el modelo más capaz. Cada dispatch nombra su modelo: tareas mecánicas a un modelo barato, la review final al más capaz (desde v6.0).

## Cuándo se activa

Con un plan aprobado en disco, cuando elegís ejecutarlo en este modo. La alternativa es `executing-plans`, que desde v6.4 es el modo **Native**: la misma sesión implementa todas las tareas sin pausas y hay una sola review al final con el modelo más capaz. Es más barato y más rápido; lo que resigna es la review independiente por tarea. writing-plans te ofrece los dos al terminar el plan y recomienda uno. Con pocas tareas muy dependientes, Native alcanza; con un plan largo, subagent-driven.

## Por qué importa

Es el corazón del autonomous coding de Superpowers. Cada subagent arranca limpio, así que no acumula context rot ni decisiones tácitas que se le filtraron en la Task 1 y le ensucian la Task 4. El coordinador es el único que mantiene la visión global: mira el plan, el spec y el estado del repo, y reparte tareas con foco quirúrgico.

Acá se cierra el callback a spec-driven development. El subagent no improvisa: lee el plan y el spec como contratos cerrados, y por eso podés correr el flujo casi autónomo durante una hora sin que se desvíe. Si el spec dice X y el plan dice cómo hacer X, el subagent hace X. Si en el medio surge una pregunta de diseño que no está en ninguno de los dos, no la inventa: se la devuelve al coordinador, que decide (ver rulings abajo).

## El punto crítico

Un subagent fresco por tarea, no un subagent que recibe varias tareas. El reset de contexto entre tareas es lo que hace que esto escale. Si reusás el mismo subagent para varias tareas seguidas, perdés el beneficio principal de la skill: arranca con todo el ruido de la tarea anterior, las decisiones intermedias, los falsos comienzos. Fresh subagent o no arranca.

## Punto de auto-review

Después de que el subagent reporta tarea completa, el coordinador no pasa directamente a la siguiente. Despacha un reviewer (desde v6.0, uno solo; antes eran dos en serie) que lee el diff una vez y devuelve dos veredictos: (1) spec compliance — ¿cumple lo que el plan pedía, implementó todo, agregó cosas no pedidas?, y lo que no puede verificar desde el diff lo marca aparte; (2) code quality — ¿sin dead code, sin shortcuts, sin sobre-engineering? Cada hallazgo con archivo y línea. El reviewer es de solo lectura y el coordinador no puede decirle qué ignorar.

Si el review encuentra issues, el fix vuelve al mismo implementer (rondas 1-3) y un re-review mira solo esos hallazgos; en las rondas 4-5 pasa a un implementer fresco con un modelo más capaz, y a la quinta corta. El coordinador no te para por cada ambigüedad: decide, la registra como *ruling* (qué decidió, por qué, cuánto cuesta si se equivocó) y sigue; al final te muestra la lista. Solo frena ante algo destructivo o irreversible, sensible de seguridad, con efectos fuera de tu máquina (merge, push), o un plan tan roto que todo camino es adivinar.

## Anti-patrones a evitar

- Reusar el subagent para varias tareas. Perdés el reset de contexto y volvés a la sesión sucia que la skill estaba evitando. Cada tarea arranca fresca o no arranca.
- Saltearse el review. Es lo que evita que el flujo derive. Sin review, dos tareas más adelante estás compensando errores que se podían atrapar al toque, y el costo de revertir crece exponencialmente.
- Intervenir demasiado pronto. La skill está diseñada para correr sola entre checkpoints. Si interrumpís en el medio de una tarea para "ayudar", rompés el patrón y perdés la productividad del modo autónomo.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/subagent-driven-development/SKILL.md`

## Caso real

Sesión auth0 sobre el tp-final (Superpowers 6.4.1): Task 1 haiku (62k tokens, 3m47s) → review sonnet; Task 2 sonnet (120k, 5m51s) → review sonnet; Task 3 haiku (58k, 2m5s) → review sonnet; review final de rama en opus (98k, 2m17s); una ronda de fix (sonnet) + re-review acotada (sonnet). Todas las tareas aprobadas en la primera vuelta. Contexto del coordinador: 132,6k → 175,7k tokens mientras los siete subagents del tramo usaron ~590k en sus propios contextos. Reporte final con "Rulings I made".
