# brainstorming

## Qué hace

Convierte una idea cruda en un design spec a través de un diálogo colaborativo. En vez de saltar a escribir código apenas escucha "quiero que la app haga X", la skill toma esa frase, explora el contexto del proyecto y empieza a hacer preguntas dirigidas para refinar la idea.

El output es un documento de diseño escrito y aprobado por vos antes de que se toque una sola línea de código. La skill explora propósito, restricciones y criterios de éxito; propone dos o tres approaches con sus trade-offs; y recién después arma el spec.

## Cuándo se activa

Antes de cualquier trabajo creativo: features nuevas, componentes nuevos, agregar funcionalidad, modificar comportamiento existente. La regla del frontmatter es deliberadamente paranoica — si hay un 1% de probabilidad de que el pedido implique "construir o cambiar algo", la skill se invoca. Esto incluye cosas que parecen triviales: un script de utilidad de una función, un cambio de configuración, una todo list. La skill no se saltea por simplicidad aparente.

No se activa para tareas puramente exploratorias (leer código, explicar cómo funciona algo, debug) ni para correcciones mecánicas donde el diseño ya está fijado.

## Por qué importa

Sin esta skill, el modelo arranca a codear con la primera interpretación plausible del pedido. Esa interpretación viene cargada de suposiciones no examinadas — del modelo y tuyas — que recién se manifiestan cuando ves el resultado y no es lo que querías. El trabajo desechado en esos rebotes es el costo real que la skill ataca.

El otro problema que resuelve es el de scope: pedidos que en realidad son cinco proyectos disfrazados de uno. Si no detectás eso antes de empezar, terminás con un spec inejecutable o con un sistema que mezcla cinco responsabilidades en el mismo archivo.

El spec que sale de esta skill es el contrato; en la próxima skill vemos por qué tener ese contrato separado del código importa.

## El punto crítico

Una pregunta por vez. Multiple choice cuando se puede. Nunca implementar nada — ni un esqueleto del proyecto, ni un archivo vacío — antes de que vos hayas aprobado el diseño escrito. Esto aplica a todo proyecto sin importar cuán simple parezca.

## El artefacto: el spec en disco

El spec aprobado se persiste en `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` y se commitea al repo. No es un mensaje más de la conversación que se pierde cuando cerrás la sesión: es un archivo de primera clase, versionado igual que el código. Las próximas skills del happy-path (writing-plans, subagent-driven-development) lo leen desde ese path, no de la conversación. Si querés cambiar el rumbo del feature, editás ese archivo y volvés a correr el flujo.

## Punto de auto-review

Después de escribir el spec en disco y antes de pedirte que lo revises, la skill corre un Spec Self-Review interno: escanea placeholders ("TBD", "TODO", secciones incompletas), busca contradicciones entre secciones, verifica scope (¿esto es un spec o son cinco?) y detecta ambigüedades donde un mismo requisito se puede interpretar de dos maneras. Lo arregla en el momento, sin pedirte input. Vos nunca deberías leer un "TBD" en tu propio spec.

## Anti-patrones a evitar

- "Esto es muy simple, no necesita diseño." Todo proyecto pasa por el flujo — los proyectos "simples" son donde las suposiciones no examinadas hacen más daño.
- Combinar varias preguntas en un solo mensaje. Si un tema necesita más exploración, se rompe en preguntas separadas.
- Invocar cualquier skill de implementación (writing-plans incluida) antes de que vos hayas aprobado el diseño escrito.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/brainstorming/SKILL.md`

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot de las preguntas socráticas recibidas al pedir un feature al
     demo-repo de S04 + el archivo de spec resultante abierto en VS Code
     (path docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md). Opcional: notas del
     Spec Self-Review previo a entregar. -->
