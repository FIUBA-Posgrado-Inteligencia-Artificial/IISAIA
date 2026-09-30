# brainstorming

## Qué hace

Convierte una idea cruda en un diseño aprobado a través de un diálogo colaborativo. En vez de saltar a escribir código apenas escucha "quiero que la app haga X", la skill toma esa frase, explora el contexto del proyecto y empieza a hacer preguntas dirigidas para refinar la idea.

Lo primero no son las features: pregunta para qué querés lo que pedís y te devuelve lo que entendió, para que lo corrijas. Después clasifica el pedido en voz alta (ver abajo), explora restricciones y criterios de éxito, propone dos o tres approaches con sus trade-offs, y recién al final arma el diseño. Vos lo aprobás antes de que se toque una sola línea de código.

## Cuándo se activa

Antes de cualquier trabajo creativo: features nuevas, componentes nuevos, agregar funcionalidad, modificar comportamiento existente. La regla del frontmatter es deliberadamente paranoica — si hay un 1% de probabilidad de que el pedido implique "construir o cambiar algo", la skill se invoca. Esto incluye cosas que parecen triviales: un script de utilidad de una función, un cambio de configuración, una todo list. La skill no se saltea por simplicidad aparente.

### Tres caminos según el tamaño (desde v6.3)

- **Spike** — una pregunta de factibilidad ("¿se puede…?"): la respuesta es una prueba descartable.
- **Bounded** — un cambio acotado sobre algo que ya existe: diseño corto en el chat, sin archivo de spec.
- **Architectural** — proyecto nuevo, subsistema nuevo, cambios de contrato: spec escrito en disco.

En los tres caminos vos aprobás antes de que haya código. Lo que escala es la ceremonia, no la aprobación.

No se activa para tareas puramente exploratorias (leer código, explicar cómo funciona algo, debug) ni para correcciones mecánicas donde el diseño ya está fijado.

## Por qué importa

Sin esta skill, el modelo arranca a codear con la primera interpretación plausible del pedido. Esa interpretación viene cargada de suposiciones no examinadas — del modelo y tuyas — que recién se manifiestan cuando ves el resultado y no es lo que querías. El trabajo desechado en esos rebotes es el costo real que la skill ataca.

El otro problema que resuelve es el de scope: pedidos que en realidad son cinco proyectos disfrazados de uno. Si no detectás eso antes de empezar, terminás con un spec inejecutable o con un sistema que mezcla cinco responsabilidades en el mismo archivo.

El spec que sale de esta skill es el contrato; en la próxima skill vemos por qué tener ese contrato separado del código importa.

## El punto crítico

Una pregunta por vez. Multiple choice cuando se puede. Nunca implementar nada — ni un esqueleto del proyecto, ni un archivo vacío — antes de que vos hayas aprobado el diseño. Esto aplica a los tres caminos, sin importar cuán simple parezca el pedido.

## El artefacto: el spec en disco

En trabajo architectural, el spec aprobado se persiste en `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` y se commitea al repo. No es un mensaje más de la conversación que se pierde cuando cerrás la sesión: es un archivo de primera clase, versionado igual que el código. Las próximas skills del happy-path (writing-plans, subagent-driven-development) lo leen desde ese path, no de la conversación. Si querés cambiar el rumbo del feature, editás ese archivo y volvés a correr el flujo.

## Punto de auto-review

Después de escribir el spec en disco y antes de pedirte que lo revises, la skill corre un Spec Self-Review interno: escanea placeholders ("TBD", "TODO", secciones incompletas), busca contradicciones entre secciones, verifica scope (¿esto es un spec o son cinco?) y detecta ambigüedades donde un mismo requisito se puede interpretar de dos maneras. Lo arregla en el momento, sin pedirte input. Vos nunca deberías leer un "TBD" en tu propio spec.

## Anti-patrones a evitar

- "Esto es muy simple, no necesita diseño." Todo proyecto pasa por el flujo — los proyectos "simples" son donde las suposiciones no examinadas hacen más daño.
- Combinar varias preguntas en un solo mensaje. Si un tema necesita más exploración, se rompe en preguntas separadas.
- Invocar cualquier skill de implementación (writing-plans incluida) antes de que vos hayas aprobado el diseño.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/brainstorming/SKILL.md`

## Caso real

Sesión auth0 sobre el tp-final (2026-09-29, Superpowers 6.4.1): clasificación architectural en voz alta, primera pregunta por el propósito, dos preguntas de alcance, dos approaches (login en el servidor con cookie vs. SDK en el browser + JWT), diseño aprobado en tres partes y spec en `tp-final/docs/superpowers/specs/2026-09-29-tp-final-auth0-design.md`.
