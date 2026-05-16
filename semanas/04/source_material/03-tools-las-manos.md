# Tools: las manos del agente

¿Se acuerdan de la semana 1, cuando el modelo emitía un token especial, el programa lo pausaba, hacía la búsqueda web, y pegaba el resultado de vuelta en el contexto? Eso era una tool. Hoy lo mismo, pero las manos llegan más lejos.

## Recontextualizar: de buscar a actuar

En la semana 1 la única herramienta en juego era la búsqueda web. El mecanismo era concreto: el modelo emite tokens especiales que señalizan la llamada, el runtime pausa la generación, ejecuta la búsqueda, y pega el texto recuperado de vuelta en el contexto. El resultado entra al contexto como "working memory" — no como un recuerdo vago almacenado en los pesos, sino como datos que el modelo tiene directamente disponibles para razonar en ese momento.

En ese punto la herramienta tenía un rol bien acotado: refrescar el conocimiento. El modelo no cambiaba nada en el mundo; hacía una consulta y leía la respuesta.

Un agente de código opera sobre el mismo mecanismo pero con un set de herramientas más amplio: leer archivos, escribir archivos, ejecutar comandos, correr tests, buscar en el repositorio. El modelo sigue emitiendo una llamada con parámetros estructurados, el runtime sigue ejecutando y devolviendo el resultado, el resultado sigue entrando al contexto. La mecánica no cambió. Lo que cambió es que ahora el agente no solo consulta el mundo — lo modifica.

## El ciclo de una tool

Cada herramienta que usa el agente sigue el mismo ciclo de tres pasos, y esos tres pasos mapean directamente a las fases del loop que vimos en el §2.

El modelo emite una llamada a herramienta: es el momento de **actuar**. No es texto libre — es una estructura con nombre de tool y parámetros. Por ejemplo: `read_file("src/index.ts")` o `run_command("npm test")`.

El runtime intercepta esa llamada, la ejecuta fuera del modelo, y devuelve el resultado. Ese resultado es la **observación**. No lo inventa el modelo; lo produjo el entorno.

Esa observación entra al contexto del modelo, que la usa en la próxima vuelta para **pensar** qué hacer a continuación.

Después repite. El loop del §2 — pensar → actuar → observar → repetir hasta la condición de corte — es exactamente esto, pero ahora el "actuar" tiene nombre y los parámetros son concretos.

Sin tools, el agente puede razonar sobre lo que haría pero no puede hacer nada. El loop existe, pero está vaciado: no hay acción, y sin acción no hay observación, y sin observación la próxima vuelta de pensar no tiene nada nuevo sobre qué operar.

## La observación vuelve al contexto

Acá hay algo que conviene ver explícito, porque tiene consecuencias que vamos a explorar en la §4.

Cada observación ocupa espacio en el contexto. El resultado de `read_file` no "desaparece" después de que el modelo lo leyó: queda en el contexto como parte de la historia de la sesión. Si el agente leyó un archivo de 800 líneas, esas 800 líneas están en la "working memory" de la que habló Karpathy. El agente puede referirlas con precisión, sin depender de lo que podría recordar vagamente desde el preentrenamiento — pero las está cargando.

Eso aplica a cada herramienta que se usa. El output de `npm test` entra. La respuesta HTTP de una API entra. El directorio listado entra. A medida que el loop itera, el contexto crece.

Qué pasa cuando ese contexto se llena, y cómo el agente gestiona esa presión, lo vemos en el §4. Por ahora basta con ver que la observación no es gratuita: ocupa espacio, y ese espacio tiene un límite.

## Leer vs. escribir

No todas las tools tienen el mismo peso cuando algo sale mal. Hay una distinción que conviene tener presente desde ahora.

Una tool que lee — lee un archivo, lista un directorio, corre una búsqueda, llama un endpoint de solo lectura — es reversible en el sentido importante: no cambia el estado del entorno. Si el agente leyó el archivo equivocado, lo peor que pasó es que llenó el contexto con información irrelevante. Puede intentar otra lectura.

Una tool que escribe — edita un archivo, corre `git commit`, borra un directorio, llama un endpoint que muta estado — modifica el entorno. Si esa acción fue incorrecta, el entorno quedó en un estado diferente al esperado. Puede que sea recuperable; puede que no. Un archivo sobreescrito sin backup, un comando que eliminó datos, una API que procesó un pago — no hay "deshacer" automático.

Esta distinción es lo que hace que el supervisor preste más atención a las tools que actúan sobre el mundo. Cuando el agente lee, el riesgo es bajo; cuando escribe o ejecuta, cada acción merece revisión antes de confirmar. Qué pasa cuando esa revisión falla o no existe, lo vemos en detalle en el §5.

## Mini-demo en vivo: la observación entra al contexto

El objetivo de este demo es hacer literal el callback a la semana 1: que el alumno vea, en tiempo real, el resultado de una tool entrando al contexto como working memory.

**Beat 1.**

Qué hago: dar una tarea que obliga a leer un archivo concreto antes de responder. Por ejemplo: "Leé `package.json` y decime qué scripts tiene definidos."

Qué digo: *"Antes de responder no sabe nada de ese archivo. Fijense qué hace primero."*

Qué mirar: la llamada a la tool de lectura — el agente emite la acción antes de producir ningún texto de respuesta.

**Beat 2.**

Qué hago: apuntar al bloque de observación que aparece en la conversación — el contenido del archivo tal como lo devolvió el runtime.

Qué digo: *"Eso que entró ahí es exactamente el 'pegar el resultado en el contexto' de la semana 1. La working memory se acaba de refrescar. El modelo no lo estaba recordando: lo tiene acá, directo."*

Qué mirar: el contenido del archivo ahora visible en el contexto, antes de que el modelo produzca su respuesta.

**Beat 3.**

Qué hago: si la versión en uso soporta `/context` o algún indicador de uso del contexto, mostrarlo. Si no, apuntar directamente al bloque de tool output y nombrarlo.

Qué digo: *"No es gratis. Lo que leyó, lo está cargando. El archivo entero entró a la working memory. Si el archivo tuviera 800 líneas, serían 800 líneas ahí."*

Qué mirar: el tamaño del output de la tool en relación al contexto total. Es el primer indicio de la presión que vemos en el §4.

**Plan B si no coopera:** si no querés depender del `/context`, alcanza con apuntar al bloque de tool output en el transcript y nombrarlo: "esto es la observación." El punto pedagógico vive en ese bloque, no en la métrica.

---

Las tools son cómo el agente toca el mundo. El contexto es donde el agente recuerda qué tocó — qué leyó, qué ejecutó, qué observó en cada vuelta del loop. Esas dos piezas están conectadas: cada vez que el agente actúa, la observación entra al contexto. Y ese contexto tiene un tamaño. Qué implica ese tamaño, y cómo se gestiona cuando el loop itera muchas veces, es lo que vemos en el §4.
