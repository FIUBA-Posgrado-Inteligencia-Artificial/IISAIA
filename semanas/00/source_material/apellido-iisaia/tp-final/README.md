# Trabajo Práctico Final — Plataforma de juegos

Una plataforma web con dos juegos, Tetris y Snake, que guarda el puntaje de cada partida y muestra el ranking de cada juego. El frontend es HTML, CSS y JavaScript sin paso de build, con Phaser para los juegos. El backend es FastAPI con SQLite.

## Cómo se ejecuta

Hace falta Python 3.11 o superior, [uv](https://docs.astral.sh/uv/) y conexión a internet, porque Phaser se carga desde un CDN.

```bash
cd tp-final
uv sync
uv run fastapi dev backend/main.py
```

Abrir `http://127.0.0.1:8000`. La documentación interactiva de la API está en `http://127.0.0.1:8000/docs`.

Si el servidor no arranca y muestra `[WinError 10013]` o `address already in use`, es que otro programa está usando el puerto 8000. En ese caso hay que levantarlo en otro puerto y abrir esa dirección:

```bash
uv run fastapi dev backend/main.py --port 8765
```

No hay variables de entorno. La base `scores.db` se crea al arrancar, con los dos juegos ya cargados. Para vaciar el ranking alcanza con borrar ese archivo.

## Arquitectura

Un solo proceso sirve la API bajo `/api` y los archivos del frontend desde `/`.

```
tp-final/
├── backend/
│   ├── main.py         app, creación de tablas, seed de juegos, montaje de estáticos
│   ├── db.py           engine de SQLite y sesión por request
│   ├── models.py       tablas Game y Score
│   ├── schemas.py      lo que entra y lo que sale por la API
│   └── routes.py       los tres endpoints
├── frontend/
│   ├── index.html      catálogo de juegos
│   ├── game.html       tablero, panel de partida y ranking
│   ├── css/styles.css
│   └── js/
│       ├── api.js          fetch y mensajes de error
│       ├── home.js         arma el catálogo
│       ├── game-page.js    monta la escena según ?game=slug
│       ├── score-panel.js  form de guardado y ranking
│       └── games/
│           ├── common.js   teclado y fin de partida
│           ├── snake.js
│           └── tetris.js
└── docs/plan.md        el plan con el que arranqué
```

### Endpoints

| Method | Path | Respuestas |
|--------|------|------------|
| `GET` | `/api/games` | `200` lista de juegos |
| `GET` | `/api/games/{slug}/scores?limit=10` | `200` mejores puntajes, de mayor a menor · `404` el juego no existe · `422` `limit` fuera de 1 a 50 |
| `POST` | `/api/games/{slug}/scores` | `201` puntaje creado · `404` el juego no existe · `422` nombre vacío o de más de 20 caracteres, o puntaje negativo |

A igual puntaje, queda arriba el que se guardó primero.

### Datos

Dos tablas. `Game` tiene `id`, `slug` (único), `name` y `description`. `Score` tiene `id`, `game_id` (foreign key a `Game`), `player`, `points` y `created_at`.

### Contrato entre la interfaz y el servidor

```
POST /api/games/snake/scores
{ "player": "Ana", "points": 70 }

201
{ "id": 4, "game": "snake", "player": "Ana", "points": 70, "created_at": "2026-09-16T21:40:12.512000Z" }
```

### Contrato entre los juegos y la página

Cada juego es una `Phaser.Scene`. Al terminar la partida, la escena emite `gameover` con el puntaje y no hace nada más. `game-page.js` escucha ese evento y le pasa el puntaje a `score-panel.js`, que es el único archivo que guarda en la API.

## Qué decidí yo

**Phaser para el loop y el teclado, con reglas propias.** Consideré otros dos caminos. Uno era usar juegos ya hechos, como blockrain.js para Tetris: casi no hay código propio, pero depende de jQuery y de plugins sin mantenimiento. El otro era React con Vite, que suma Node y un paso de build, y las librerías de juegos para React también están abandonadas. Con Phaser, el game loop, los timers, el input y el dibujo vienen resueltos. Lo que escribí son las reglas de cada juego: unas 200 líneas en Tetris y 140 en Snake. Es más código que con juegos ya hechos, pero lo puedo leer entero y explicar.

**Sin paso de build.** Uso ES modules del navegador y Phaser por CDN con versión fija (`3.90.0`), así que para levantar el proyecto no hace falta Node. El costo es que sin internet los juegos no cargan. En ese caso la página lo avisa en vez de quedar en blanco.

**Nickname libre, sin cuentas.** Para un ranking alcanza con un nombre. Un login habría duplicado el proyecto con algo que no es el tema.

**El juego va en el path y no se repite en el body.** `ScoreInput` tiene `player` y `points`, nada más. Si el body también llevara el juego, podría contradecir al path y habría que decidir cuál gana.

**`404` si el juego no existe, no una lista vacía.** Pedir el ranking de `pong` y recibir `[]` sugiere que `pong` existe y nadie jugó todavía. Son dos situaciones distintas.

**`created_at` lo pone el servidor.** Si lo mandara el cliente, cualquiera podría fechar un puntaje como quisiera. Por eso tampoco está en `ScoreInput`.

**Un solo proceso para la API y el frontend.** FastAPI monta los estáticos en `/`, así que no hay CORS ni dos servidores que levantar. El orden importa: el router de `/api` se registra antes del montaje en `/`, porque ese montaje atrapa todo lo que llega después.

**Las escenas no conocen la API.** El evento `gameover` es toda la interfaz entre un juego y la página. Gracias a eso pude escribir y probar Snake antes de que existiera el ranking, y un juego nuevo no tiene que saber cómo se guarda un puntaje.

**La base dice qué juegos existen y el frontend dice cómo se juegan.** La home arma el catálogo con `GET /api/games`, pero `game-page.js` tiene su propio mapa de slug a escena. Para agregar un juego hay que tocar los dos lados: la fila en el seed y la escena registrada. Lo dejé así porque sin escena no hay nada que mostrar, pero es un acoplamiento que conviene tener presente.

## Cómo gestioné el contexto

Antes de escribir código trabajé en modo plan. El agente leyó la estructura del repo y los informes de tp1 y tp2, y me hizo cuatro preguntas: stack del frontend, cómo se identifica al jugador, qué endpoints hacían falta y qué hacer con este README. Con las respuestas escribió el plan, que está sin editar en [docs/plan.md](docs/plan.md). Durante la implementación ese archivo fue la referencia para la estructura de carpetas, los status codes y el orden de los commits.

Hice un commit por cada pieza que funcionaba: backend, home, Snake, Tetris y ranking. Cada uno deja algo que se puede abrir y probar, así que si algo se rompía había un punto conocido al que volver. Los mensajes explican por qué se hizo el cambio, porque es lo único que queda cuando la conversación ya no está.

Mantuve los archivos por debajo de 300 líneas y las funciones por debajo de 50. `score-panel.js` se pasó y lo partí antes de seguir. Con archivos chicos alcanza con cargar el que hace falta: para arreglar Tetris no necesité tener la API en contexto, gracias al contrato de `gameover`.

La verificación la hizo el agente con el MCP de Playwright, habilitado en `.claude/settings.local.json`. Jugó las partidas, leyó el estado de cada escena desde el navegador (posición de la pieza, largo de la snake, puntaje), guardó puntajes y cortó el servidor para ver los mensajes de error.

El plan y lo construido no coinciden del todo. El plan tenía un `finish.js`, que pasó a ser `common.js` cuando apareció el problema del teclado, y no tenía `score-panel.js`, que salió de separar el ranking de `game-page.js`. Dejé el plan como estaba y las diferencias quedan explicadas acá.

## Qué salió mal

**Tetris movía la pieza de más.** Dos flechas seguidas corrían la pieza tres casillas. La primera prueba no lo detectó: apretaba una tecla, esperaba 100 ms y apretaba otra, y cada pulsación movía una casilla. Apareció cuando el agente contó cuántas veces se llamaba a `move` con pulsaciones sin pausa: 5 llamadas para 2 teclas, siempre. La causa estaba en el código fuente de Phaser. Con cada evento de teclado del DOM, Phaser recorre toda la cola de eventos del frame, y esa cola se vacía recién al terminar el frame. Si dos teclas llegan en el mismo frame, los eventos ya atendidos se emiten de nuevo. La corrección es `onKeys` en `common.js`, que guarda cada evento atendido en un `WeakSet` y descarta los repetidos. A alguien que juega rápido le pasa todo el tiempo, y la prueba lo escondía justamente porque dejaba tiempo entre tecla y tecla.

**La fecha volvía sin zona horaria.** El servidor guardaba `created_at` en UTC, pero la API lo devolvía como `2026-09-16T21:28:29`, sin la `Z`. SQLite no guarda la zona horaria, y el valor vuelve sin ella. Nada fallaba: el `POST` daba `201` y el ranking se veía bien. Lo encontré leyendo la respuesta del `curl`. Un navegador en Argentina habría interpretado esa hora como local, con tres horas de diferencia. Lo corregí en `to_score_out`, que es donde se arma la respuesta.

**El arreglo que parecía no andar.** Después de corregir la fecha, la API la seguía devolviendo sin zona. `fastapi dev` había detectado el cambio y avisado que recargaba, pero en Windows el proceso que recarga murió y dejó vivo al worker viejo, que siguió ocupando el puerto con el código anterior. Por eso un servidor nuevo tampoco podía arrancar. `netstat` mostró que el puerto figuraba a nombre de un proceso que ya no existía. Al cerrar el worker huérfano, el arreglo funcionó sin cambiar una línea. Antes de volver a tocar el código conviene confirmar qué proceso está respondiendo.

**Snake arrancaba sola.** Al abrir la página la snake ya se movía, y si no reaccionabas en menos de dos segundos chocaba contra la pared. Se vio en una captura: la partida había terminado antes de tocar una tecla. El plan describía las reglas pero nunca decía cuándo empieza la partida, y el agente hizo lo más literal, que era arrancar al crear la escena. El hueco estaba en el plan, no en el código. Ahora la partida espera la primera flecha. En Tetris no hizo falta porque la pieza tarda 800 ms en bajar cada fila y hay tiempo para ubicarse.
