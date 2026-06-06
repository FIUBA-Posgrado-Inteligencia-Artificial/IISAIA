# La trampa del context window

## La solución que veníamos usando

Si el LLM no ve tu mundo, la respuesta intuitiva es pegárselo al prompt. ¿Querés que entienda este archivo? Lo copiás. ¿Querés que vea la salida de un comando? La pegás. ¿Querés que conozca el schema de tu base? Lo describís en texto.

Funciona. Es el patrón con el que arranca todo el mundo y, para tareas chicas, es suficiente.

## Donde se empieza a caer

Tres complicaciones aparecen apenas la tarea crece.

**Costos.** Cada token que pegás se factura. Pegar un repo entero, un dump de logs o una documentación larga sale caro y, en modelos premium, sale muy caro. El precio escala lineal con el volumen.

**Frescura.** Pegás un archivo y diez minutos después editás ese mismo archivo. La conversación tiene la versión vieja; el agente razona sobre código que ya no existe. Lo mismo con datos: la query que pegaste hace una hora ya no representa el estado actual de la base.

**Ruido.** Cuanto más texto metés en la ventana, más cuesta encontrar la señal. El modelo tiene que decidir qué parte importa, y los benchmarks muestran que la atención se degrada con tamaño. Pegar "todo por las dudas" empeora las respuestas.

## El callejón

A medida que la cosa crece, la respuesta natural es "pegale más". Pegale todo el repo. Pegale la doc entera. Pegale los últimos cien commits. Llega un momento en que ya no entra, o entra pero el modelo se pierde, o entra pero el costo te detiene.

El patrón "context window grande" se vendió durante años como la salida — modelos con 200k, 1M, 2M tokens de contexto. Ayuda, pero no resuelve. No resuelve la frescura: lo que pegás se congela. No resuelve el costo: pagás por cada token cada vez. Y no resuelve el ruido: más espacio no es más enfoque.

## Lo que falta

Lo que viene en las próximas secciones es a reformular el problema desde otro ángulo. En vez de meter más cosas adentro de la ventana, dejamos lo que vive afuera — afuera — pero con una conexión clara para que el agente lo pueda alcanzar cuando lo necesita.
