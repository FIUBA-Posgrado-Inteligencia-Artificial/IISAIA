---
description: Reglas para escribir o modificar una Phaser.Scene de la plataforma. Aplicar al tocar frontend/js/games/.
paths:
  - "frontend/js/games/**/*.js"
  - "frontend/js/game-page.js"
---

# Escenas de juego

## La escena no conoce la API

Una `Phaser.Scene` no importa `api.js`, no hace `fetch` y no sabe que existe un ranking. Su única salida hacia afuera es:

```js
scene.game.events.emit("gameover", score);
```

que ya hace `finishGame()` en `common.js`. Quien escucha es `game-page.js`, y el único que escribe en la API es `score-panel.js`. Si una escena necesita datos del servidor, el pedido va en `game-page.js` y entra a la escena por su config.

## El teclado va por `onKeys()`

Nunca `scene.input.keyboard.on("keydown-LEFT", ...)` directo. Siempre:

```js
import { onKeys } from "./common.js";

onKeys(this, {
  LEFT: () => this.move(-1),
  RIGHT: () => this.move(1),
});
```

`onKeys()` filtra con un `WeakSet` los eventos que Phaser re-despacha cuando dos teclas caen en el mismo frame. Sin ese filtro una tecla mueve dos o tres casillas y el bug **no aparece** si al probar se deja una pausa entre pulsación y pulsación.

## Al terminar la partida

Llamar a `finishGame(scene, score, width, height)`. Hace tres cosas en orden: libera la captura global del teclado, dibuja el overlay de fin de partida y emite `gameover`. No repliques esas tres cosas a mano en cada juego.

## Forma de una escena nueva

- Exportar la clase y una constante `<JUEGO>_SIZE = { width, height }` calculada desde el tamaño de celda, no valores mágicos sueltos.
- Todo el estado se arma en `create()`, porque el botón "Volver a jugar" hace `scene.restart()` y tiene que dejar la partida como nueva.
- Constantes de tuning (delays, puntajes, colores) arriba del archivo en mayúsculas, no incrustadas en la lógica.
- Definir explícitamente **cuándo arranca** la partida. Snake espera la primera flecha; Tetris puede arrancar solo porque la pieza tarda 800 ms en bajar. Arrancar al crear la escena sin margen de reacción es un bug.
- Registrar la escena en el mapa `GAMES` de `game-page.js` **y** agregar la fila en el seed de `backend/main.py`. Con uno solo de los dos el juego no funciona.
