# Prompts — TP 1

El registro del proceso, en orden. Tres prompts en una sola conversación de Canvas. El artefacto quedó terminado en el tercero.

---

## 1 — Prompt inicial

```
Construí un captcha de verificación que funciona con una máquina de Galton.

Estructura:
- <header> con el título "Verificación de seguridad" y el captcha objetivo:
  3 letras que el usuario tiene que ingresar, generadas al azar al cargar.
- <main> con el tablero: un triángulo de pegs de 4 filas (1, 2, 3 y 4 pegs por fila) y, debajo, una fila de 5 canaletas. Cada canaleta muestra
  una letra (A a E, de izquierda a derecha).
- <footer> con lo ingresado hasta ahora, un <button> "Soltar bola" y un
  <button> "Borrar último".

Estilo:
- Estética de captcha viejo: fondo gris claro, bordes duros, tipografía
  monoespaciada, cero redondeo.
- Pegs como círculos chicos grises. La bola, un círculo naranja.
- Las canaletas del centro y las de los bordes se ven iguales: la
  probabilidad está escrita, no señalizada con color.

Comportamiento:
- Estado: objetivo (3 letras), ingresados (array de letras, máximo 3),
  cayendo (booleano que bloquea la interacción durante la animación).
- Al click en "Soltar bola": si cayendo es false y ingresados tiene menos
  de 3 letras, arranca la caída. La bola aparece arriba del primer peg y
  baja fila por fila. En cada fila decide al azar 50/50 izquierda o
  derecha, y se desplaza media columna hacia ese lado mientras baja una
  fila. Cada paso dura 220ms. Después de la sexta fila cae en la canaleta
  correspondiente y su letra se agrega a ingresados.
- Al click en "Borrar último": saca la última letra de ingresados. No hace
  falta soltar ninguna bola para borrar.
- Cuando ingresados llega a 3 letras, comparar con objetivo y mostrar en el
  footer si la verificación pasó o falló, con un botón para reiniciar que
  genera un objetivo nuevo y vacía ingresados.

Constraints:
- Un solo archivo HTML, con el CSS en un <style> y el JS en un <script>.
- Vanilla JS, sin frameworks ni dependencias externas.
- Los pegs, la bola y las canaletas son elementos del DOM posicionados con
  CSS. No usar <canvas>: quiero poder ver el estado reflejado en el DOM.
```

**Qué intentaba lograr:** el artefacto entero de una sola vez, nombrando las cinco capas — estructura con etiquetas semánticas, estilo, comportamiento expresado como estado, y constraints de empaque.

**Qué devolvió:** el tablero funcionando, con las 4 filas de pegs, las 5 canaletas y la animación de caída. Respetó los tres constraints: un solo archivo, sin dependencias, y pegs y bola como elementos del DOM en lugar de `<canvas>`.

**Qué hice con eso:** lo acepté. Pero el prompt tenía dos ambigüedades que no vi al escribirlo y que el modelo resolvió por su cuenta — están detalladas en el README, porque son lo más interesante de esta entrega.

---

## 2 — Iterar sobre el estado: reordenar las canaletas

```
Agregale al captcha dos estados: `letras` (el array de 5 letras de las
canaletas, hoy fijas en el HTML) y `seleccionada` (el índice de la canaleta
tocada primero, o null).

Click en una canaleta con `seleccionada` en null: pasa a ser ese índice y la
canaleta se marca.
Click en otra canaleta: se intercambian las dos letras dentro de `letras`,
`seleccionada` vuelve a null y se sacan las marcas.
Click en la canaleta ya seleccionada: `seleccionada` vuelve a null sin
intercambiar nada.

Dos reglas: mientras `cayendo` es true los clicks en canaletas no hacen
nada, y los porcentajes pertenecen a la posición, no a la letra — al
intercambiar, los números no se mueven.
```

**Qué intentaba lograr:** devolverle agencia al usuario. Sin esto el captcha es una tragamonedas: mirás caer la bola y no podés hacer nada. Con esto podés poner en el centro la letra que necesitás, que es donde la probabilidad es más alta.

**Por qué está escrito así:** las tres líneas de click son la ida y **dos** vueltas distintas — completar el intercambio, y cancelar la selección. Nombrar solo la ida deja al modelo inventando cómo se sale del estado, y lo más común es que no haya forma de cancelar.

Las dos reglas del final previenen bugs concretos. Sin la primera, reordenar con la bola en el aire la hace aterrizar sobre una letra distinta de la que había cuando soltaste. Sin la segunda, el modelo mueve el porcentaje junto con la letra, porque están renderizados en el mismo elemento — es la confusión clásica entre el estado y su reflejo en el DOM.

**Qué devolvió:** las tres transiciones correctas y las dos reglas respetadas. Los porcentajes se quedaron en su posición al intercambiar.

---

## 3 — Envolver el captcha en una página anfitriona

```
Envolvé el captcha en una página que sea sobre otra cosa.

La página es un formulario para reservar un turno: <header> con el nombre
del lugar, <main> con un <form> de nombre, email y fecha y un <button>
"Reservar turno", <footer> con una línea de contacto.

Agregá un estado `paso` con tres valores: "formulario", "captcha" y
"confirmado".
- Arranca en "formulario": se ve el form, el captcha no.
- Al enviar el form: `paso` pasa a "captcha", el form se oculta y aparece
  el tablero de Galton.
- Si la verificación pasa: `paso` pasa a "confirmado" y se ve el turno
  reservado con los datos que cargó.
- Si falla: se queda en "captcha" con un objetivo nuevo.

El captcha no cambia por dentro: mismo tablero, mismos estados, misma
lógica. Solo deja de ser la página y pasa a ser un paso.
```

**Qué intentaba lograr:** que el captcha apareciera donde aparece un captcha de verdad — cortando una tarea que el usuario quiere terminar. Una página que es solo el captcha no frustra a nadie, porque nadie llegó ahí queriendo otra cosa.

**Por qué la última línea:** un pedido estructural como este es el caso donde el modelo tiende a reescribir lo que ya funcionaba, y ahí se pierde el trabajo de los dos prompts anteriores. Decirlo explícito lo evitó.

**Qué devolvió:** los tres pasos funcionando, con el captcha intacto adentro del segundo. El formulario quedó como un centro médico pidiendo turno.

---

## Conversación completa

Una sola conversación de Canvas, sin reiniciar el hilo. El artefacto final tiene 828 líneas en un archivo.
