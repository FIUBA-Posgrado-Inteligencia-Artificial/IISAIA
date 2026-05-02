# Estado, DOM y eventos: el triángulo dinámico

Una página estática se entiende sola: hay HTML, lo dibuja el navegador, listo. Una página que *hace algo* — un contador, una lista que crece, un juego — es más interesante: tiene un triángulo que vale la pena saber nombrar.

## Qué cambia cuando una página "hace algo"

Si lo único que hace tu página es mostrar texto e imágenes que nunca cambian, no necesitás **JavaScript**. El navegador lee el HTML, aplica el CSS, dibuja la pantalla, y listo. Pero en cuanto pasa cualquier otra cosa cuando el usuario interactúa, ya sea un click que suma uno, un input que filtra una lista, o un botón que cambia el tema, entran tres piezas en juego al mismo tiempo. Las tres tienen nombre, y saberlos es la diferencia entre pedirle a una IA "hacé que funcione" y pedirle algo que el modelo pueda traducir directo a código.

## Tres conceptos, una historia

### Estado: el dato que vive detrás

El **estado** es el *dato* que tu página recuerda. El número del contador, los items de la todo list, el modo dark/light, el usuario logueado, qué pestaña está activa. Vive en variables de JavaScript, no en la pantalla. Es invisible hasta que alguien decide dibujarlo. Si reiniciás la página y el dato se va, ese dato era estado en memoria. Persistirlo es otro problema; primero hay que verlo como una entidad propia, separada de cómo se muestra.

### DOM: la representación viva

El **DOM** (Document Object Model) es "el HTML, pero vivo". Cuando el navegador carga tu archivo, parsea el HTML una sola vez y construye en memoria un **árbol del DOM**: un grafo de nodos donde cada etiqueta es un objeto con atributos, hijos, y padres. Lo que ves en pantalla es el resultado de **render**, el dibujo de ese árbol. El JavaScript después puede tocar el árbol: agregar nodos, cambiar texto, esconder cosas, modificar clases. A esa modificación en vivo se la llama **mutación del DOM**, y es lo que hace que la página parezca cambiar sin recargar.

### Eventos: la voz del usuario

Cualquier cosa que el usuario hace genera un **evento**: un click, una tecla, un scroll, mover el mouse, enviar un formulario. El navegador los emite todo el tiempo; vos elegís cuáles te interesan. Para escuchar uno, registrás un **listener**, una función que el navegador va a invocar cuando el evento ocurra. La función que se ejecuta se llama **event handler**: "cuando se hace click en este botón, ejecutá esta función". El listener es la suscripción; el handler es la respuesta. Sin listeners, el usuario habla y nadie escucha.

## El ciclo: evento → estado → DOM

El patrón se repite en cada app dinámica que vas a tocar. Es un círculo de cinco pasos que se llama **ciclo evento-estado-render**. Mirálo en el contador clásico:

1. **Estado inicial**: `count = 0`. El DOM dibuja un `<span>0</span>`.
2. **El usuario hace click** en el botón "+1". Eso dispara un evento de tipo `click`.
3. **El listener se activa** y actualiza el estado: `count = 1`.
4. **El listener actualiza el DOM**: `span.textContent = count`. El navegador re-renderiza ese nodo.
5. **El usuario ve "1"** en pantalla.

Apenas el usuario haga otro click, vuelve a empezar el mismo ciclo: evento, estado, DOM, render. Lo que importa entender es que el estado y el DOM no son la misma cosa, aunque parezcan caminar en paralelo. El estado es la verdad; el DOM es el reflejo. Si te olvidás de actualizar uno de los dos, la pantalla miente. La sección §3 Estado de `demo.html` te muestra este ciclo tres veces en vivo: contador, todo list y event log, cada uno con el mismo esqueleto de evento → mutación de estado → mutación del DOM.

## Por qué "estado" es la palabra mágica

Si hay una palabra de este archivo que te tenés que llevar a tu próxima conversación con una IA, es ésta. Cuando le pedís a un modelo *"hacé que el botón cuente clicks"* sin nombrar el estado, la IA tiene tres atajos disponibles, y los tres son malos. Puede guardar el contador en un atributo del DOM (frágil: cualquier re-render lo borra). Puede usar una variable global flotante (difícil de extender el día que querés guardar también la fecha del último click). Puede mezclar el dato con su representación en una sola variable, y eso te explota cuando agregás una segunda vista del mismo dato.

Si en cambio nombrás el estado en el prompt, por ejemplo *"agregá un estado `count` que arranca en 0 y se incrementa en cada click"*, le estás diciendo a la IA: esto es un dato, separalo del DOM, ponelo donde corresponde. El código sale predecible y extensible. La palabra "estado" hace ese trabajo sola.

## Cómo le pedís comportamiento a un LLM

Mirá el contraste.

Vago:

> *"Hacé un botón que cuente."*

Específico:

> *"Agregá un estado `count` (número, inicial 0). Mostralo en un `<span id="count">`. Cuando se haga click en `<button id="inc">+1</button>`, registrá un listener que incremente `count` y actualice el `<span>` con el nuevo valor."*

El segundo nombra estado, listener, evento y mutación del DOM. La IA no improvisa porque no tiene que.

El estado es el corazón de cualquier app que valga la pena. El próximo archivo cierra la anatomía con el empaque: por qué todo esto cabe en un solo archivo.
