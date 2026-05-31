# El flujo aplicado al trabajo final

## Lo que ya quedó enmarcado

El marco del trabajo final ya está puesto: qué forma tiene, por qué conecta
con el rol de supervisor, qué se evalúa en espíritu. No se re-discute acá.
Lo único que pasa en este cierre es conectar el flujo que recorrimos con esa
entrega: con qué herramientas concretas la vas a construir.

## Cómo lo arman con este flujo

El trabajo final se construye usando exactamente el mismo flujo que recorrimos.
No hay un modo especial para proyectos integradores; el plugin es el mismo y la
secuencia es la misma.

- Empezás con `brainstorming` para sacar el spec del proyecto. No saltees este
  paso: es donde se decide qué construís, antes de que la primera línea de
  código exista. El output queda como archivo en disco, no como conversación
  perdida.
- Cuando aprobás el spec, `writing-plans` lo convierte en un plan de tareas
  chicas, con criterios de aceptación por tarea. También sale al disco.
- Arrancás la sesión de trabajo con `git checkout -b feature/<descripcion>` —
  la convención de GitHub Flow. Toda la implementación vive en esa branch.
- Dejás correr `subagent-driven-development` con el plan; revisás entre
  tareas, no después de un bloque grande.
- TDD activa por defecto durante la implementación. Vas a ver el test rojo
  antes del cambio y verde después. Si nunca lo viste rojo, no estás midiendo
  nada — estás creyendo.
- `requesting-code-review` corre antes de cerrar el feature. Los críticos se
  resuelven en el momento; los nice-to-have quedan registrados como follow-up.
- `verification-before-completion` corre los comandos finales y cita el output
  real. Si decís "los tests pasan", tiene que estar el output pegado al lado.
- `finishing-a-development-branch` te ofrece abrir el PR. Lo abrís.
- El PR es la entrega visible. El repo en GitHub queda como evidencia del
  proceso entero: spec, plan, commits, review, merge.

## Lo que NO hace el flujo por vos

Esto es importante para que no llegues al trabajo final pensando que el plugin
construye el proyecto solo. No lo hace.

- Qué construir es decisión tuya, antes de abrir `brainstorming`.
- Si la decisión arquitectónica es la correcta es decisión tuya, durante
  `brainstorming` — cuando el agente te propone una estructura, vos decidís si
  la aceptás, la corregís o la rechazás.
- Si el feature sirve a un usuario real es decisión tuya, fuera del flujo.
  Ningún agente sabe si lo que pediste tiene sentido para quien lo va a usar.
- El plugin acelera la ejecución y disciplina el proceso. No decide por vos
  qué entregar.
- Te libera tiempo, justamente, para ocuparte de esa parte — que es la única
  que el plugin no puede hacer.

## Cierre

La próxima clase entramos a refactor y debugging asistidos sobre lo que ya
construyen con este flujo.
