# Plan: plataforma de juegos (TP final de ejemplo)

## Context

`semanas/00/source_material/apellido-iisaia/` es el repo de referencia que ven los alumnos. `tp1/` y `tp2/` ya tienen ejemplos resueltos y `tp-final/` sigue en blanco (solo la plantilla del README). Falta un TP final de ejemplo: una app completa con interfaz, servidor y datos que persisten.

El proyecto es una plataforma web con Tetris y Snake cuyo backend guarda los puntajes. Decisiones que ya tomaste:
- Frontend en HTML/CSS/JS vanilla con ES modules, sin paso de build, y **Phaser 3** para los juegos.
- El jugador se identifica con un **nickname libre**, sin login.
- Backend en FastAPI + SQLite con **listado de juegos**, **ranking top N por juego** y alta de puntaje. No lleva historial por jugador ni tests con pytest.
- El README de `tp-final/` es un **informe completo de ejemplo**, igual que tp1 y tp2.

Sin superpowers: no hay spec, plan de subagentes ni TDD formal.

## Estructura

Todo va dentro de `semanas/00/source_material/apellido-iisaia/tp-final/`:

```
tp-final/
├── README.md              informe completo (reemplaza la plantilla)
├── pyproject.toml         fastapi[standard], sqlmodel (uv)
├── uv.lock
├── .gitignore             *.db
├── docs/plan.md           copia de este plan (evidencia de "plan en disco")
├── backend/
│   ├── main.py            app, lifespan (crea tablas + seed), routers, StaticFiles
│   ├── db.py              engine SQLite, get_session
│   ├── models.py          tablas Game y Score (SQLModel)
│   ├── schemas.py         ScoreInput / ScoreOut / GameOut separados
│   └── routes.py          los 3 endpoints
└── frontend/
    ├── index.html         catálogo de juegos
    ├── game.html          canvas del juego + ranking + form de guardado
    ├── css/styles.css
    └── js/
        ├── api.js         fetch wrappers; lanzan Error con el detail del backend
        ├── home.js        arma el catálogo desde GET /api/games
        ├── game-page.js   lee ?game=slug, monta la escena, ranking, form
        └── games/
            ├── tetris.js  Phaser.Scene
            └── snake.js   Phaser.Scene
```

Límites de CLAUDE.md: cada archivo por debajo de 300 líneas, cada función por debajo de 50, sin emojis en la UI, con loading y error visibles en todo lo async.

## Backend

**Modelo de datos (SQLModel):**
- `Game`: `id`, `slug` (unique), `name`, `description`
- `Score`: `id`, `game_id` (FK), `player` (str), `points` (int), `created_at` (datetime UTC, lo pone el servidor)

Seed idempotente en el lifespan: si no existen, inserta `tetris` y `snake`. El archivo de la DB es `tp-final/scores.db`, con path fijo relativo al paquete y sin variables de entorno. Por eso no hace falta `.env.example`.

**Endpoints**, todos bajo `/api`:

| Method | Path | Respuesta |
|---|---|---|
| GET | `/api/games` | 200 `GameOut[]` |
| GET | `/api/games/{slug}/scores?limit=10` | 200 `ScoreOut[]` ordenado por `points` desc y después `created_at` asc / 404 si el juego no existe |
| POST | `/api/games/{slug}/scores` | 201 `ScoreOut` / 404 si el juego no existe / 422 si la validación falla |

Validación con Pydantic: `player` de 1 a 20 caracteres, con strip y sin vacíos; `points` ≥ 0; `limit` entre 1 y 50. `ScoreInput` lleva solo `{player, points}`. El juego viene en el path y no se repite en el body, que es la misma lección de tp2.

`main.py` monta `StaticFiles(directory="frontend", html=True)` en `/` **después** de incluir el router `/api`. Así un solo proceso sirve todo, sin CORS. La doc interactiva queda en `/docs`.

## Frontend

- **`index.html` + `home.js`**: muestra "Cargando juegos..." y después una card por juego con un link a `game.html?game=<slug>`. Si falla, muestra un mensaje de error con un botón para reintentar.
- **`game.html` + `game-page.js`**:
  - Carga Phaser 3 desde CDN con versión fija (`cdnjs .../phaser/3.90.0/phaser.min.js`). Antes de usarla verifico que la URL exista.
  - Según el `slug`, importa `games/tetris.js` o `games/snake.js`. Un slug desconocido muestra error y un link a la home.
  - **Contrato juego ↔ página**: cada escena emite `this.game.events.emit('gameover', score)` y la página escucha. Las escenas no saben nada de la API.
  - Al terminar, aparece el form con el nickname y el puntaje en solo lectura, y un botón "Guardar puntaje". Mientras envía queda deshabilitado con "Guardando..." y un error queda visible debajo. Si sale bien, refresca el ranking. También hay un botón "Jugar de nuevo" que reinicia la escena.
  - Ranking lateral con top 10, más sus estados de cargando, vacío ("Todavía no hay puntajes") y error.
- **`tetris.js`**: grilla de 10×20, los 7 tetrominós, rotación con wall kick simple, drop con timer que acelera por nivel, limpieza de líneas y puntaje de 100/300/500/800. Controles con flechas y espacio para hard drop.
- **`snake.js`**: grilla, cola de segmentos, comida en una celda libre al azar, choque con pared o consigo misma que termina la partida, +10 por comida y velocidad creciente. Controles con flechas, sin permitir el giro de 180°.
- Phaser resuelve el game loop, el input de teclado, los timers y el dibujo con `Graphics`. Las reglas de cada juego son propias, unas 150 a 200 líneas cada una.
- CSS: paleta sobria no violeta, una sola familia tipográfica y escala de espaciado 4/8/12/16/24/32/48.

## README (informe completo)

Reemplaza la plantilla y mantiene sus secciones: Cómo se ejecuta, Arquitectura (tabla de endpoints, modelo de datos y contrato `gameover`), Qué decidí yo, Cómo gestioné el contexto, Qué salió mal.
- **Qué decidí yo** sale de decisiones reales de este proyecto: Phaser en vez de juegos ya hechos, nickname sin login, `ScoreInput` sin `game`, 404 en vez de lista vacía, un solo proceso que sirve API y estáticos, escenas desacopladas de la API por evento, y `created_at` puesto por el servidor.
- **Qué salió mal** se escribe con los desvíos que aparezcan de verdad durante la implementación. Si no aparece ninguno que valga la pena, te aviso en vez de inventarlo.
- Mismo tono y registro que los informes de tp1 y tp2.

Además actualizo `apellido-iisaia/README.md`: la tabla pasa de "en blanco" a "ejemplo resuelto" y ajusto la frase "La del trabajo final viene en blanco".

## Git

- Branch `feature/tp-final-plataforma-juegos` desde `main`.
- Stage solo de paths de `tp-final/` y del README del índice. Los untracked ajenos (`.agents/`, `semanas/05/source_material/superpowers/`, etc.) y `tp-final/.claude/settings.local.json` no se tocan.
- Un commit por pieza que funcione:
  1. `feat: backend con endpoints de juegos y puntajes`
  2. `feat: catálogo de juegos en la home`
  3. `feat: snake con Phaser`
  4. `feat: tetris con Phaser`
  5. `feat: guardado de puntaje y ranking`
  6. `docs: informe del TP final`

## Verificación

1. `uv sync` y después `uv run fastapi dev backend/main.py` dentro de `tp-final/`.
2. Pruebas de la API con curl:
   - `GET /api/games` devuelve 2 juegos.
   - `POST /api/games/snake/scores` con `{player:"ana",points:50}` devuelve 201.
   - Slug inexistente devuelve 404.
   - `points:-1` o `player:""` devuelve 422.
   - `GET .../scores?limit=10` sale ordenado.
3. Prueba end-to-end con Playwright MCP, que ya está habilitado en `tp-final/.claude/settings.local.json`:
   - Abro la home, veo las 2 cards y entro a cada juego.
   - Mando flechas con `press_key` y saco screenshot para ver el tablero moviéndose.
   - Fuerzo el game over (dejando chocar la snake contra la pared, o con `browser_evaluate` emitiendo `gameover`), guardo con un nickname y confirmo que el ranking se actualiza.
   - Reviso `browser_console_messages` para descartar errores.
4. Estados de error: detengo el servidor con la página abierta, intento guardar y verifico que el error se vea en la UI.
5. Cuento líneas por archivo (menos de 300) y reviso que no queden emojis ni texto de relleno.
