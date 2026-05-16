# El loop: pensar, actuar, observar

"Arreglá el bug." Una sola línea. ¿Por qué eso no alcanza para que el agente termine?

Porque el modelo todavía no vio el error. No sabe qué stack trace aparece cuando corrés los tests. No sabe si el problema está en la función que escribió o en el test que la invoca. Le pediste que arregle algo que no puede ver todavía. La respuesta que te daría en ese momento sería una apuesta — y las apuestas son caras cuando el que actúa sobre tu repo es el agente, no vos.

La diferencia entre un chat que sugiere y un agente que resuelve no está en qué modelo corre adentro. Está en que el agente no da una respuesta: entra en un loop.

## ReAct: razonar y actuar entrelazados

El loop tiene tres fases. Se repiten hasta que se cumple una condición de corte.

**Pensar.** El agente razona sobre el estado actual. Qué sabe, qué le falta saber, qué hipótesis tiene. No es una línea de pensamiento lineal: es el modelo formulando el próximo paso en función de lo que observó antes.

**Actuar.** El agente usa una herramienta: corre un comando, edita un archivo, llama a una API, lee un directorio. La acción produce un efecto en el entorno.

**Observar.** El agente lee el resultado de esa acción. El output del comando, el contenido del archivo, la respuesta HTTP. Eso nuevo entra a su contexto y alimenta la próxima vuelta de pensar.

Y después repite, hasta que se cumple la condición de corte.

Veámoslo concreto. La tarea: "hacé que pasen los tests".

*Pensar:* el agente analiza lo que tiene. Ve el código existente, la consola vacía. Hipótesis: no sé si los tests corren o de qué fallan. Necesito correr el suite primero.

*Actuar:* ejecuta `pytest` o `npm test`, lo que corresponda al proyecto.

*Observar:* lee la salida. Dos tests fallan. `AssertionError: expected 200, got 404`. El path del endpoint tiene un slash de más.

*Pensar:* ya sé qué falla y dónde. Corrijo el path en el router.

*Actuar:* edita el archivo del router, cambia `/tasks//` por `/tasks/`.

*Observar:* corre los tests de nuevo. Pasan los dos. El tercero también. Suite verde.

*Condición de corte alcanzada:* todos los tests pasan. El loop termina.

Cada vuelta produjo información nueva. La primera vuelta no resolvió nada: identificó el problema. La segunda lo corrigió. La tercera confirmó. Un agente que devuelve una respuesta de texto después del primer prompt no completó ninguna de esas vueltas — te delegó el trabajo a vos.

Este patrón tiene nombre: **ReAct** (razonar y actuar entrelazados). Lo importante del nombre no es el nombre — es que captura que pensar y actuar no son etapas separadas sino que se alternan, vuelta a vuelta, hasta terminar.

## Un agente = LLM + loop + tools + entorno

Cuatro piezas. Si falta una, no hay agente.

El **LLM** es el que decide. En cada vuelta, recibe lo que hay en el contexto — el objetivo original, la historia de lo que pasó, la última observación — y determina qué hacer a continuación. Sin el LLM, no hay razonamiento; sin razonamiento, el loop no sabe a dónde ir.

El **loop** es lo que hace que el LLM itere. Sin loop, el LLM da una respuesta y termina. Con loop, cada respuesta puede producir una acción, y cada acción produce una observación, y la observación alimenta la próxima respuesta. El loop convierte un generador de texto en algo que termina tareas.

Las **tools** son las manos del agente. Sin herramientas, el agente puede razonar sobre lo que haría pero no puede hacer nada. Con herramientas puede editar archivos, ejecutar comandos, leer outputs, llamar servicios. Las tools específicas que existen — y cómo elegirlas — las vemos en la próxima sección.

El **entorno** es lo que el agente observa y modifica: tu repo, tu terminal, tu filesystem. Es la realidad sobre la que actúa. Sin entorno, no hay nada que observar ni nada que cambiar; el agente estaría razonando en el vacío.

Las cuatro piezas son necesarias en conjunto. Un LLM con loop pero sin tools no puede actuar. Un LLM con tools pero sin loop da una sola respuesta y para. Un LLM con loop y tools pero sin entorno concreto no tiene nada que observar. Cuando algo no funciona como esperás, el diagnóstico empieza por acá: ¿cuál de las cuatro piezas está fallando?

## Por qué un loop y no una respuesta

El chat clásico tiene una forma: pregunta → respuesta. Vos aportás input; el modelo devuelve output. Listo. La sesión puede seguir, pero cada vuelta es independiente. El modelo no actúa entre una respuesta y la siguiente; esperás vos.

El agente tiene otra forma: objetivo → loop hasta lograrlo. Vos aportás el objetivo. El modelo actúa, observa, corrige, sigue. La sesión no termina hasta que el objetivo se cumple o algo lo interrumpe.

La diferencia no es cosmética. En el modelo de chat, "arreglá el bug" produce una respuesta de texto que describe cómo podría arreglarse el bug. En el modelo de agente, "arreglá el bug" produce una secuencia de acciones que termina — o debería terminar — con el bug arreglado. El valor entregado no es información sobre el problema: es el problema resuelto.

Eso requiere el loop. Sin él, el LLM sigue siendo un generador de texto muy capaz. Con él, el LLM se convierte en algo que puede trabajar en tu lugar sobre cosas verificables.

## Goal y condiciones de corte

Para que el loop funcione, tiene que saber cuándo parar. Sin condición de corte, el loop no termina — o peor, termina de maneras que no querías.

Las condiciones de corte que aparecen en la práctica son cuatro:

**Objetivo alcanzado.** El agente detectó que el estado del entorno coincide con lo que se le pidió. Los tests pasan, el archivo existe, el endpoint responde 200. Esta es la condición ideal.

**Límite de pasos.** Hay un techo configurado — cien pasos, doscientos — y el agente lo alcanzó sin resolver el objetivo. El loop para; el agente reporta qué hizo y hasta dónde llegó.

**El agente pide ayuda.** En alguna vuelta el agente determina que no puede continuar sin input humano: falta un secreto, no tiene permiso para escribir en un directorio, encontró una ambigüedad que no puede resolver solo. Llama a un humano. El loop se suspende.

**Falla no recuperable.** El agente detecta que una acción produjo un estado del que no sabe cómo salir. Para y reporta.

La condición de corte no es un detalle de implementación: es lo que separa un agente que trabaja de un agente que da vueltas. Sin ella, el loop puede seguir consumiendo recursos, tomando decisiones, modificando archivos — sin converger a ningún resultado útil. Qué pasa exactamente cuando el loop se descontrola, y cómo reconocerlo, lo vemos en la §5.

## Mini-demo en vivo: el loop desnudo

Este demo no es para mostrar que la herramienta "funciona". Es para mostrar que el loop que describimos es real, visible en pantalla, vuelta por vuelta. El alumno tiene que salir de este demo habiendo visto al agente pensar, actuar y observar — no haberlo leído en una diapositiva.

**Beat 1.**

Qué hago: dar al agente una tarea pequeña y verificable, por ejemplo: "Agregá un endpoint `GET /health` que devuelva `{"status": "ok"}` y probá que responde."

Qué digo: *"No le pedí que escriba código. Le pedí un resultado. Miren cómo se las arregla."*

Qué mirar: la primera vuelta — el agente empieza a razonar antes de editar nada. Eso es pensar.

**Beat 2.**

Qué hago: narrar en voz alta cada fase mientras aparece en pantalla, nombrándola: "esto es pensar… esto es actuar, está editando el archivo del router… esto es observar, está leyendo la respuesta del servidor."

Qué digo: *"Fijense que el agente no terminó cuando escribió el código. Siguió: corrió el servidor, hizo el request, leyó el resultado. Eso es el loop completo."*

Qué mirar: la correspondencia exacta entre lo que aparece en pantalla y el diagrama pensar → actuar → observar. Señalar con el puntero cada fase mientras ocurre.

**Beat 3.**

Qué hago: señalar el momento en que algo no salió bien a la primera — el servidor no levantó, el path estaba mal, el puerto estaba en uso. El agente detectó el error, volvió a pensar, tomó una acción correctiva.

Qué digo: *"Ahí. Falló, lo vio, y volvió a entrar al loop. Eso es lo que vos hacías a mano."*

Qué mirar: que la corrección es una vuelta más del loop, no una respuesta nueva. El agente no empezó de cero; actualizó su hipótesis con lo que observó y siguió.

**Plan B si no coopera:** si la tarea se resuelve en un solo turno sin ningún error, pedirle algo ligeramente más abierto — por ejemplo, el mismo endpoint pero sin especificar el shape exacto del JSON — para forzar al menos una iteración de verificación. Si el entorno del demo no está disponible, narrar sobre una grabación de una sesión anterior, nombrando las fases en voz alta mientras corre el video.

---

El loop es el esqueleto del agente. Define qué hace, en qué orden, y cuándo para. Pero el loop opera sobre algo concreto: la información que el agente tiene en un momento dado — qué vio, qué hizo, qué sabe. Ese conjunto de información tiene un tamaño, un límite, y una estructura propia. Es lo que llamamos contexto. Y gestionar ese contexto es la otra mitad de entender cómo funciona un agente — lo vemos en la §4.
