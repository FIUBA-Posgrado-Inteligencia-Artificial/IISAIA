# La estructura: HTML como sustantivos

El HTML no se trata de hacer que algo "se vea bien" — eso es trabajo del CSS. Se trata de nombrar las partes de tu página con la palabra correcta.

El **HTML semántico** es eso: usar la **etiqueta** (tag) que describe qué *es* cada bloque, no qué *parece*. Cada **elemento** de la página tiene un rol, y ese rol se expresa con un nombre. Si el nombre es preciso, todo lo demás se vuelve más fácil: el CSS, la accesibilidad, el SEO, y sobre todo el diálogo con la IA.

## Por qué los nombres importan

Una página HTML la leen muchos lectores al mismo tiempo, y casi ninguno es humano. La leen los navegadores para renderizarla, los lectores de pantalla para narrarla a personas con discapacidad visual, los buscadores para indexarla, las IAs para entenderla y modificarla, y los desarrolladores que vienen detrás tuyo a tocar el código en seis meses. Todos ellos se hacen la misma pregunta cuando abren tu archivo: ¿de qué *trata* esta página, y qué hace cada parte?

Si cada bloque está nombrado `<div>`, la respuesta es: no se sabe. Un `<div>` no significa nada. Es una caja sin etiqueta.

Compará estas dos líneas. Visualmente son idénticas:

```html
<header>...</header>
<div class="header">...</div>
```

Para el navegador no son lo mismo. La primera dice "esto es un encabezado de página". La segunda dice "esto es una caja, y le puse de apodo header, pero podría llamarse cualquier cosa". El **outline del documento**, que es el árbol de qué contiene qué, solo se construye con etiquetas semánticas. Si no las usás, no existe.

## Los doce sustantivos que importan

No hace falta memorizar las cien etiquetas que existen. Con doce alcanza para describir cualquier página razonable. Las agrupo en tres familias.

### Contenedores estructurales

Estas son las cajas grandes que dividen la página. Son las primeras que vas a nombrar cuando le pidas estructura a un LLM.

| Etiqueta | Qué representa | Ejemplo |
|---|---|---|
| `<header>` | encabezado de página o sección: logo, título, navegación principal | `<header>Mi sitio</header>` |
| `<main>` | el contenido principal de la página, único por documento | `<main>...</main>` |
| `<section>` | un bloque temático con título propio | `<section><h2>Precios</h2>...</section>` |
| `<article>` | una unidad de contenido autocontenida (post, tarjeta, comentario) | `<article>...</article>` |
| `<nav>` | un grupo de enlaces de navegación | `<nav><a href="/">Inicio</a></nav>` |
| `<footer>` | pie de página o sección: copyright, enlaces secundarios | `<footer>© 2026</footer>` |
| `<aside>` | contenido lateral o tangencial al principal | `<aside>Artículos relacionados</aside>` |

Los nombres de **header**, **main**, **section**, **article**, **nav**, **footer** y **aside** son las siete piezas con las que se arma el esqueleto de casi cualquier página. Si las usás bien, el resto se ordena solo.

### Contenido

Adentro de los contenedores va el contenido en sí: texto, listas, links, imágenes.

- `<h1>` a `<h6>`: encabezados de seis niveles, jerárquicos. Un `<h1>` por página.
- `<p>`: un párrafo de texto.
- `<ul>` / `<ol>` / `<li>`: listas no ordenadas, ordenadas, y sus ítems.
- `<a href="...">`: un enlace a otra página o a un ancla interna.
- `<img src="..." alt="...">`: una imagen, siempre con texto alternativo.

### Interacción

Cuando la página le pide algo al usuario, aparecen estas cuatro:

- `<button>`: un botón clickeable que dispara una acción.
- `<input>`: un campo de entrada (texto, número, email, checkbox, según el `type`).
- `<form>`: un formulario que agrupa inputs y los envía.
- `<label>`: la etiqueta visible asociada a un input. Sin label no hay accesibilidad.

## El mal hábito: la sopa de divs

Hay un atajo tentador: usar **div** para todo. `<div>` es la caja genérica, sin significado, que sirve para cualquier cosa. Cuando alguien empieza a programar HTML, o cuando un LLM genera código sin instrucciones precisas, el resultado suele ser una *div soup*: páginas donde el header es un `<div class="header">`, el main es un `<div class="main">`, la nav es un `<div class="navigation">` y así hasta el infinito.

Pasa porque es el camino fácil. No tenés que pensar qué etiqueta corresponde; metés `<div>` y seguís. El navegador no se queja, la página se ve igual. Pero el outline del documento queda vacío y la página, semánticamente, no le dice nada a nadie.

En `demo.html` tenés un toggle directo en la sección §1 Estructura: el mismo bloque visual, dos veces, una con etiquetas semánticas y otra como div soup. Se ven idénticos. Internamente son dos páginas distintas.

## Cómo le pedís estructura a un LLM

Acá es donde el vocabulario te paga. Mirá la diferencia entre dos prompts.

Prompt vago:

> *"Hacé una página de contacto."*

El modelo va a inventar una estructura. Te puede salir cualquier cosa, probablemente con div soup.

Prompt con vocabulario:

> *"Hacé una página de contacto. Estructura: `<header>` con `<nav>` (Inicio, Sobre mí, Contacto); `<main>` con un `<section>` introductorio (h1 + p) y un `<form>` con `<label>` + `<input>` para nombre y email, más un `<textarea>` para el mensaje; `<footer>` con copyright."*

El segundo prompt no es más largo en intención, es más *preciso*. La precisión nace del vocabulario. Vos le diste al modelo el outline; ahora solo tiene que rellenar.

El HTML es el esqueleto. Si está mal nombrado, ningún CSS lo arregla. Próximo archivo: vestimos el esqueleto.
