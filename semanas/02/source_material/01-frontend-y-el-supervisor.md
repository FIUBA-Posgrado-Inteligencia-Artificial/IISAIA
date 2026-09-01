# Frontend y el supervisor arquitectónico

## Qué es un frontend

El **frontend** es la capa de un sistema con la que trata una persona: recibe lo que el usuario hace —un click, algo que escribe— y le devuelve algo que puede ver. Los datos, las reglas del negocio y el servidor viven detrás, y el usuario nunca los toca directamente.

Frontend no quiere decir "página web". Hay de varios tipos:

- **Web**: corre dentro de un navegador. No se instala, se abre una dirección.
- **Móvil**: aplicación nativa de Android o iOS, instalada desde una tienda.
- **Escritorio**: programa instalado en la máquina. Photoshop, Excel, Spotify.
- **Terminal**: texto como interfaz. También es un frontend, aunque no tenga un solo botón.

Los cuatro resuelven el mismo problema —traducir lo que una persona quiere en algo que el sistema entiende— y se diferencian en cómo llegan al usuario. Vamos a trabajar sobre el web por una razón práctica: es el único que se abre con doble click, sin instalar nada y sin una tienda de por medio.

## La pregunta incómoda

Si una IA puede escribir el código, ¿por qué seguimos aprendiendo qué es un `flexbox` o qué hace un `<section>`? La respuesta corta: porque el cuello de botella ya no es la sintaxis, es la decisión.

La pregunta incomoda porque parece honesta. Si Claude o ChatGPT te resuelven el `display: grid` en dos segundos, ¿qué sentido tiene memorizarlo? Ninguno. Memorizar sintaxis nunca fue el punto, ni siquiera antes de la IA.

Lo que sí tiene sentido es entender qué le estás pidiendo a la máquina que haga. En este curso ustedes vienen del programa de la Diplomatura en desarrollo de aplicaciones utilizando inteligencia artificial, y el rol que vamos a practicar durante ocho semanas no es el de programador clásico que tipea cada llave. Es otro: el de **supervisor arquitectónico**. Tu trabajo es decidir qué se construye, en qué orden, con qué piezas y por qué. La IA escribe; vos dirigís.

Y para dirigir hace falta una cosa básica que ningún modelo te puede regalar: saber cómo se llaman las cosas. Necesitás **vocabulario técnico** propio para pedir lo que querés con precisión.

## Lo que cambia cuando la IA escribe el código

Cuando delegás la sintaxis a un modelo, tres cosas se mueven al mismo tiempo.

Primero, la velocidad de iteración explota. Lo que antes te llevaba una tarde de Stack Overflow ahora son tres prompts. Eso es real, y es bueno, pero tiene un efecto secundario: el ciclo de prueba y error se acelera tanto que las decisiones malas también se aceleran. Producís más basura en menos tiempo si no sabés qué estás pidiendo.

Segundo, el costo de equivocarte al especificar es altísimo. La IA no hace lo que querías; hace exactamente lo que pediste. Si decís "centrado", el modelo no sabe si querés centrado horizontal con `flex`, centrado vertical con `grid`, o un `margin: 0 auto` sobre un bloque. Va a elegir uno. Si vos no podés leer el código que devuelve y notar la diferencia, ya estás aceptando una decisión que no tomaste.

Tercero, leer código se vuelve más importante que escribirlo. Antes pasabas el 80% del tiempo escribiendo y el 20% leyendo. Ahora se invierte. Cada respuesta de la IA es un texto que tenés que auditar antes de pegarlo en producción. Si no lo entendés, no lo podés auditar.

Para hacer las tres cosas bien, necesitás vocabulario.

## La anatomía en cinco partes

El resto de la clase la vamos a pasar mirando una página real, `demo.html`, que está armada como un showroom de las cinco capas que componen cualquier interfaz web. Una frase por capa, suficiente para anclarte:

1. **Estructura** (**HTML**): los sustantivos de la página. Cada bloque de contenido tiene un nombre semántico: encabezado, sección, artículo, botón.
2. **Estilo** (**CSS**): cómo se ve cada sustantivo. Tamaños, colores, espacios, posiciones.
3. **Comportamiento** (**JavaScript**): qué pasa cuando el usuario interactúa. Click, scroll, tipeo.
4. **Estado**: el dato que vive detrás de la pantalla. Lo que la página recuerda entre un click y el siguiente.
5. **Empaque** (**single-file platform**): cómo distribuís todo eso. Un solo archivo `.html` que contiene las cinco capas y se abre en cualquier navegador, sin servidor, sin compilación.

Cada uno de los archivos siguientes desarma una de estas capas en detalle, con ejemplos extraídos de `demo.html`. El orden no es arbitrario: estructura primero, estilo después, comportamiento y estado encima, empaque al final.

## A qué prestamos atención esta clase

Quiero ser explícito con lo que no es esta clase. No te estoy enseñando a escribir HTML, CSS o JavaScript de producción. Para eso hay carreras enteras y no caben en noventa minutos.

Te estoy enseñando a *nombrar las cosas*. A reconocer las piezas cuando aparecen en la respuesta de un modelo, y a pedirlas con el término correcto cuando todavía no aparecieron. Cada concepto que veas hoy está acá porque tiene un payoff directo en cómo dialogás con un LLM: o te ayuda a escribir un prompt mejor, o te ayuda a leer la respuesta sin tragarte un error.

Volvé al rol cuando dudes: sos supervisor arquitectónico. La IA es tu equipo de implementación. En unos minutos vamos a abrir `demo.html` en el navegador y empezar a separar las cinco capas con la mano. La página se enseña a sí misma; nosotros ponemos las palabras.
