# CLAUDE.md — frontend

HTML, CSS y ES modules servidos tal cual por FastAPI. Este archivo describe **cómo funciona**; las reglas para escribir escenas están en `../.claude/rules/escenas-de-juego.md`.

## Sin paso de build

No hay Node, ni bundler, ni `npm install`, ni `package.json`. Los módulos se cargan con `<script type="module">` y los imports llevan la extensión `.js` explícita porque los resuelve el navegador. Phaser entra por CDN con versión fija (`3.90.0`) en `game.html`, antes del módulo que lo usa.

Consecuencia: **un archivo nuevo no se registra en ningún lado**, pero tampoco hay tree-shaking ni transpilación. Lo que escribís es lo que corre. Si agregás una dependencia, es otro `<script>` pinneado o nada.

Sin internet Phaser no carga. `game-page.js` chequea `typeof Phaser === "undefined"` y muestra el aviso en `#page-error` en vez de dejar la página en blanco.

## Las dos páginas

| Página | Entrada | Qué hace |
|--------|---------|----------|
| `index.html` | `js/home.js` | catálogo armado con `GET /api/games` |
| `game.html` | `js/game-page.js` | lee `?game=slug`, monta la escena, panel de partida y ranking |

`game.html` es genérico: el título, el texto de controles y el tamaño del canvas los completa `game-page.js` desde su mapa `GAMES`. No hay una página por juego.

## Quién llama a quién

```
game-page.js ──monta──> Phaser.Game(scene)
     │                        │
     │                   emite "gameover"
     │<───────────────────────┘
     └──showResult(score)──> score-panel.js ──> api.js ──> /api
```

`score-panel.js` es el **único** módulo que escribe en la API. Las escenas no la conocen. Ese corte es lo que permite tocar un juego sin cargar el backend en contexto.

`createScorePanel(slug)` devuelve `showResult()` / `hideResult()` y se encarga solo del ranking y del form. "Jugar de nuevo" en `game-page.js` hace tres cosas en orden: `blur()` del botón (si no, la próxima flecha la recibe el botón y no la escena), `panel.hideResult()` y `scene.restart()`.

## El DOM se busca por id

Los módulos no crean la estructura de la página: la buscan con `document.getElementById`. Los ids viven en `game.html` e `index.html`, y `score-panel.js` y `game-page.js` los leen por nombre. **Renombrar un id rompe el módulo en silencio**, sin error hasta que se ejecuta esa línea. Si tocás uno, tocá los dos lados.

Mostrar y ocultar se hace con el atributo `hidden` (`el.hidden = true`), nunca con `style.display`. El CSS tiene `[hidden] { display: none !important; }` para que gane sobre los `display: flex` de las clases.

## Errores

`api.js` es la única capa que interpreta respuestas: convierte fallas de red y status codes en un `Error` con mensaje en castellano (`describeError`). El resto del frontend sólo muestra `error.message`.

El patrón de la UI es siempre el mismo: un `<p class="status">` para el estado, `.status.error` cuando falla, y un botón "Reintentar" que se revela al fallar. `setStatus()` en `score-panel.js` lo encapsula.

## CSS

Un solo `css/styles.css`, sin framework. Los colores y espacios son custom properties en `:root` (`--accent`, `--space-4`, etc.): usá los tokens, no valores sueltos. Las clases son pocas y semánticas (`.panel`, `.button`, `.ranking`, `.game-card`); el layout se rearma en una columna con el `@media (max-width: 720px)` del final.

Los colores de los juegos **no** salen de acá: son constantes hexadecimales dentro de cada escena, porque Phaser dibuja en canvas.

## games/

`common.js` tiene lo compartido: `onKeys()` (filtra los eventos repetidos que Phaser re-despacha cuando dos teclas caen en el mismo frame) y `finishGame()` (libera el teclado, dibuja el overlay y emite `gameover`).

Cada escena mantiene su propio estado y redibuja entera con un `Phaser.Graphics` en `draw()`, en vez de mover sprites. Los timers son `time.addEvent({ loop: true })` y se recrean con `startTimer()` cada vez que cambia la velocidad — Snake acelera al comer, Tetris al subir de nivel.

Detalle del overlay: Tetris se lo pasa a `finishGame()` con el ancho del tablero (`COLS * CELL`), no con `TETRIS_SIZE.width`, para no tapar el panel lateral con el puntaje final.
