# Git y GitHub Flow

Hablamos de git acá porque las próximas skills del flujo (subagent-driven-development, code-review, finishing-branch) operan dentro de una branch. Si no tenés cómodo el modelo mental de git, esas skills se sienten mágicas o aterradoras según el día. Vamos a hacer un refresher rápido de tres conceptos y después el workflow concreto que se usa todos los días con Superpowers.

## Mini-refresher: tres conceptos

### commit

Un commit es una foto de tu repo en un momento. Guarda QUÉ cambió (el diff), QUIÉN lo hizo, CUÁNDO, y POR QUÉ (mensaje del commit). La práctica es hacer commits chicos y frecuentes: uno por idea cerrada, no uno por jornada entera de trabajo. La regla práctica es directa: si el commit no se puede describir en una sola oración corta, probablemente sean dos commits.

### branch

Una branch es una línea paralela de commits. `main` es la línea principal del proyecto. Cuando empezás a trabajar en algo nuevo, te abrís una branch propia (`feature/<descripcion>`) para no contaminar `main` mientras experimentás. El comando para crear y saltar a la nueva branch es uno solo:

```bash
git checkout -b feature/<descripcion>
```

Mientras la branch está abierta y separada de `main`, podés romper, deshacer, reintentar — nadie más se entera. Cuando está lista, se integra de vuelta a `main` mediante un PR.

### pull request

Un PR es la propuesta de mergear tu branch a `main`. No es un comando: es un evento en GitHub. Lo abrís desde la UI, le ponés un título y una descripción, y queda visible para vos o para el equipo. Hasta que no se mergea, la branch existe pero `main` no tiene esos cambios. El PR es el contrato visible del feature: cualquiera puede mirar el diff, comentar, aprobar o pedir cambios.

## GitHub Flow paso a paso

El flujo concreto que se usa con Superpowers. Sin teorizar más — la secuencia exacta es esta.

**Antes de arrancar la sesión:**

```bash
git checkout main
git pull
git checkout -b feature/<descripcion>
```

Empezás desde `main` actualizado y abrís tu branch.

**Durante el trabajo:** Superpowers, vía `subagent-driven-development` (la próxima skill), commitea por tarea automáticamente. Tu trabajo es revisar los commits que va generando entre tareas y aceptarlos. Si querés modificar algo a mano, podés; el flujo no te bloquea.

**Cuando el feature está listo** (después de que `verification-before-completion` pasó):

```bash
git push origin feature/<descripcion>
```

**En la UI de GitHub:** abrís el PR. Título y descripción claros. Superpowers ya generó los commits con buenos mensajes; ahora vos contás la historia general en la descripción del PR.

## Por qué este patrón se lleva bien con Superpowers

Cada sesión tiene su branch, así que el aislamiento es natural y el contexto del próximo trabajo no se contamina con cambios a medio terminar. El PR queda como contrato visible —revisable por humanos antes de que el código entre a `main`. `main` siempre permanece estable: si algo de la sesión sale mal, descartás la branch y volvés a empezar sin romper nada del proyecto. Y no necesitás stash, rebase complicado, ni cherry-pick. Sólo branch, commit, push, PR.

## Existe también `using-git-worktrees`, no la usamos

Superpowers incluye una skill llamada `using-git-worktrees` que automatiza un workflow más avanzado. Worktrees permite trabajar en varias branches en paralelo, cada una en su propio folder físico del mismo repo. No la usamos en este curso porque agrega fricción cognitiva sobre git base, y el flujo simple de branch más PR alcanza para el TP y para la mayoría del trabajo de equipo real. Si en algún momento querés explorarla, el archivo está en `semanas/05/source_material/superpowers/skills/using-git-worktrees/SKILL.md`. La idea de fondo es la misma: aislar trabajo en branches. Worktrees lleva la idea un paso más allá permitiendo que cada branch viva en su propio folder físico.

## Cierre

Ya sabés cómo enmarcar el trabajo en branches y PRs. La próxima skill es la que ejecuta el plan que escribiste, y lo hace dentro de la branch que abriste recién.

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot del PR de Enzo en el demo-repo de S04, abierto con
     los commits que Superpowers generó durante la sesión, mostrando la lista de
     commits + el diff resumen. -->
