# writing-plans

## Antes de la skill: qué es spec-driven development

### El spec como source of truth

Spec-driven development separa el QUÉ y el POR QUÉ —decisiones humanas— del CÓMO, que se delega al agente. El spec se discute con vos hasta que lo aprobás, y recién después se derivan el plan y el código. La regla de dirección es simple: si cambia el spec, cambia el plan; si cambia el plan, cambia el código. Nunca al revés. El código no le dicta nada al spec.

### Cómo Superpowers lo operacionaliza

La cadena concreta es brainstorming (produce el spec) → writing-plans (convierte spec en plan) → subagent-driven-development (ejecuta el plan en código). Cada skill mira el artefacto del paso anterior como contrato cerrado. La implicación práctica es que si en cualquier paso descubrís que la entrada está mal, subís al paso anterior y lo arreglás ahí; no compensás hacia adelante metiendo decisiones de spec dentro del plan, ni decisiones de plan dentro del código.

## Qué hace

writing-plans toma un spec aprobado y lo convierte en un implementation plan listo para ejecutar. El output es un documento markdown con tareas chicas —cada step de 2 a 5 minutos—, con los paths exactos de los archivos que se tocan, el código completo en cada step, los comandos de verificación al lado y los commits cada pocos pasos. La asunción de la skill es agresiva: el ingeniero que va a ejecutar el plan no conoce el codebase ni el dominio y necesita tener todo a mano.

## Cuándo se activa

Se activa después del brainstorming y antes de tocar código. Si tenés un spec, esta skill lo convierte en plan ejecutable. También se activa si vos pedís un plan para una tarea grande sin haber pasado por brainstorming; en ese caso, lo primero que hace es recomendar volver atrás y producir el spec, porque sin spec el plan no tiene contra qué validarse.

## Por qué importa

El plan es lo que permite que cualquier agente —vos mañana, un subagente, un colega que toma la posta— ejecute la implementación sin re-deducir nada. Es el contrato técnico que cierra la brecha entre la intención del spec y la ejecución en código. Sin esta skill, el plan queda en tu cabeza: se pierde cuando se acaba la ventana de contexto, cuando cambia el agente, cuando volvés al proyecto tres semanas después. Persistirlo en disco lo hace auditable y retomable.

## El punto crítico

Tareas de 2 a 5 minutos con archivos exactos y código completo en cada step. Nada de "implementar similar al Task N" sin repetir el código, porque el ingeniero puede leer las tareas fuera de orden y necesita tener todo a mano en cada una. Nada de "agregar error handling apropiado" sin mostrar qué error handling concreto. Si un step describe qué hacer pero no muestra cómo, no es un step, es un placeholder.

## El artefacto: el plan en disco

El plan se persiste en `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` y se commitea junto al spec. Ese par —spec más plan— es lo que después lee subagent-driven-development para ejecutar autónomamente. Un ejemplo concreto a mano: el spec del rediseño del source material está en `docs/superpowers/specs/2026-05-21-semana-05-source-material-design.md` y el plan que se está ejecutando vive en `docs/superpowers/plans/2026-05-21-semana-05-source-material.md`. Son los mismos archivos que Superpowers produjo para armar esta clase; el archivo que estás leyendo fue escrito ejecutando esa misma cadena.

## Punto de auto-review

Después de escribir el plan y antes de pasártelo, la skill corre un Plan Self-Review interno con tres chequeos. Spec coverage: recorre cada requisito del spec y se pregunta si hay una tarea que lo implementa, listando gaps si los hay. Placeholder scan: busca en el plan red flags tipo "TBD", "TODO", "implement later", "add appropriate error handling", "similar to Task N" sin código repetido. Type consistency: verifica que los nombres de funciones, métodos y propiedades sean iguales entre tareas —si en la Task 3 llamaste a algo `clearLayers()`, en la Task 7 no puede aparecer como `clearFullLayers()`. Los issues encontrados se arreglan inline; no hay segunda vuelta de review.

## Anti-patrones a evitar

- "TBD", "TODO", "implement later" son fallas del plan, no pendientes legítimos. El plan se completa o se reduce su scope; no se deja con huecos.
- "Add appropriate error handling" sin mostrar qué error handling concreto. Vago equivale a no implementable; mostrá el código exacto que va.
- "Similar to Task N" sin repetir el código. La gente lee tareas fuera de orden, y un subagente arranca cada task con contexto fresco. Repetí el código en cada step que lo necesita.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/writing-plans/SKILL.md`

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot del archivo de plan resultante abierto en VS Code
     (path docs/superpowers/plans/YYYY-MM-DD-<feature>.md), mostrando la estructura
     task-by-task con archivos exactos y steps. -->
