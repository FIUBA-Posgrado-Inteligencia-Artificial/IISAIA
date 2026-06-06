# Separar conocimiento de acción

## El insight

Pensá cómo programás vos cuando usás una librería que conocés a medias. No te memorizás la API. Tenés un modelo mental de qué hace la librería, abrís la doc cuando necesitás un argumento, ejecutás `dir()` o `help()` cuando dudás, probás en el REPL cuando no estás seguro. Vos no *sabés* la API; vos *podés llamarla*.

Lo mismo aplica al LLM. El modelo no necesita haber memorizado en entrenamiento cada función que va a invocar. Lo que necesita es razonar sobre el problema, decidir qué hace falta, y tener un mecanismo para invocar la cosa que necesita y leer la respuesta.

Esta es la inversión conceptual que sostiene todo lo que viene en la clase: **el LLM no necesita saber, necesita poder llamar**.

## Qué se queda adentro y qué se va afuera

Si separás conocimiento de acción, el reparto queda claro.

**Adentro del LLM** quedan las cosas que sí están bien tenidas en peso: razonamiento, gramáticas de programación, patrones, sentido común sobre estructura de software. Cosas que no cambian rápido y que el modelo aprendió a usar bien.

**Afuera del LLM** queda todo lo que es específico, vivo o efectoso: tu repo, tu base, la API que estás consumiendo, el browser que querés controlar, las docs reales y actualizadas de la librería que estás usando.

La pregunta es cómo se hace el puente. Cómo el LLM, en medio de su razonamiento, le pide al mundo "leeme esto" o "ejecutame aquello" y recibe la respuesta de vuelta de forma que la pueda incorporar a la conversación.

## La idea, todavía sin nombre

Hace falta una capa intermedia. Un lugar donde:

- El mundo exterior expone capacidades de forma estructurada — qué cosas hay disponibles y cómo se invocan.
- El LLM puede consultar esa lista de capacidades y decidir cuál usar.
- La invocación se hace de forma uniforme, no inventando una integración por cada caso.

Esa capa existe y tiene nombre. Pero antes de nombrarla vale la pena ver por qué necesariamente tiene forma de protocolo, y no de "una librería más".
