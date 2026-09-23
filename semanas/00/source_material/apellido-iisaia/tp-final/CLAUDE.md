# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Plataforma web con dos juegos (Tetris y Snake) que guarda puntajes y muestra un ranking por juego. Frontend vanilla sin paso de build + Phaser por CDN; backend FastAPI + SQLite en un único proceso.

Vive dentro del repo del curso, en `semanas/00/source_material/apellido-iisaia/tp-final/`, al lado de `tp1/` y `tp2/`. Es **material de referencia que leen los alumnos**: el código y el `README.md` son una sola entrega. El README no es documentación de uso, es el informe del TP — incluye "Qué decidí yo", "Cómo gestioné el contexto" y "Qué salió mal". Si un cambio invalida una decisión o un bug narrado ahí, hay que actualizar esa sección en el mismo commit.

`docs/plan.md` es el plan original **congelado a propósito**. No coincide del todo con lo construido y esas diferencias están explicadas en el README. No lo actualices para "sincronizarlo".

## Comandos

```bash
uv sync                                    # instalar dependencias
uv run fastapi dev backend/main.py         # levantar API + frontend en :8000
uv run fastapi dev backend/main.py --port 8765   # si el 8000 está ocupado
```

- App en `http://127.0.0.1:8000`, docs interactivas en `/docs`.
- No hay variables de entorno. `scores.db` se crea al arrancar con los dos juegos ya cargados; **borrar el archivo** vacía el ranking.
- **No hay suite de tests.** La verificación es jugar en el navegador y leer el estado de la escena desde el DOM. El MCP de Playwright está habilitado en `.claude/settings.local.json` para eso. No agregues pytest sin pedirlo: la ausencia de tests es una decisión del TP.

## Dónde seguir leyendo

Este archivo es el panorama. El detalle de cada mitad vive al lado del código y se carga solo al trabajar ahí:

| Archivo | Qué cubre |
|---------|-----------|
| `backend/CLAUDE.md` | arranque y seed, recorrido de un request, capas, cambiar el esquema, probar con curl |
| `frontend/CLAUDE.md` | por qué no hay build, las dos páginas, quién llama a quién, ids del DOM, errores, CSS, `games/` |
| `.claude/rules/escenas-de-juego.md` | reglas para escribir una `Phaser.Scene` |
| `.claude/rules/api-y-datos.md` | reglas de endpoints, fechas, capas y migraciones |

Los `CLAUDE.md` describen cómo funciona el código; las reglas dicen qué hacer y qué no.

Además hay tres piezas de configuración del agente, versionadas con el código:

| Pieza | Qué hace |
|-------|----------|
| `.claude/settings.json` | Modelo y permisos: qué corre solo, qué pregunta y qué está bloqueado en este proyecto |
| `.claude/skills/agregar-juego/` | El procedimiento completo para sumar un juego, en orden y con la verificación |
| `.claude/agents/explorador.md` | Sub-agent de solo lectura para preguntas que cruzan backend y frontend |

Y dos comandos, que son atajos y no procedimientos: `/explicar <archivo>` resume en cinco líneas qué hace un archivo y quién lo llama, y `/pre-entrega` revisa que el trabajo esté en condiciones de entregarse.

## Arquitectura

**Un solo proceso sirve todo.** `backend/main.py` registra el router de `/api` y recién después hace `app.mount("/", StaticFiles(...))`. El orden es obligatorio: el mount en `/` atrapa todo lo que se registre después. Por eso no hay CORS ni dos servidores.

Backend por capas: `db.py` (engine + sesión por request) → `models.py` (tablas `Game` y `Score`) → `schemas.py` (entrada/salida de la API, separadas de las tablas) → `routes.py` (los tres endpoints) → `main.py` (app, `lifespan` que crea tablas y hace el seed, montaje de estáticos).

Frontend sin build: ES modules nativos del navegador y Phaser `3.90.0` pinneado por CDN en `frontend/game.html`. Si Phaser no carga, `game-page.js` muestra un mensaje en vez de dejar la página en blanco.

### Los dos contratos que sostienen el diseño

1. **Las escenas no conocen la API.** Cada juego es una `Phaser.Scene` que al terminar emite `gameover` con el puntaje y no hace nada más. `game-page.js` escucha ese evento y se lo pasa a `score-panel.js`, que es el **único** archivo que escribe en la API. Gracias a esto se puede tocar un juego sin cargar el backend en contexto.
2. **El juego va en el path, no en el body.** `ScoreInput` tiene sólo `player` y `points`. Si el body también llevara el slug podría contradecir al path.

### Agregar un juego toca dos lados

La base dice **qué** juegos existen y el frontend dice **cómo** se juegan. Hay que tocar los dos:

- la fila en `GAMES` de `backend/main.py` (el seed), y
- la entrada en `GAMES` de `frontend/js/game-page.js` (escena, tamaño y texto de controles).

Es un acoplamiento conocido y aceptado: sin escena registrada no hay nada que mostrar.

## Trampas ya pagadas

- **Teclado de Phaser.** Phaser re-despacha la cola entera de teclado con cada evento del DOM y la vacía recién al final del frame: dos teclas en el mismo frame disparan handlers repetidos. Usá siempre `onKeys()` de `frontend/js/games/common.js`, nunca `keyboard.on("keydown-X")` directo. Probar con pausas entre teclas **esconde** el bug; hay que contar llamadas con pulsaciones seguidas.
- **Fechas sin zona.** SQLite no guarda timezone y `created_at` vuelve naive. `to_score_out()` en `routes.py` le estampa UTC. Cualquier respuesta nueva que devuelva un datetime tiene que pasar por ahí o hacer lo mismo.
- **Reload huérfano en Windows.** `fastapi dev` avisa que recarga, el proceso que recarga muere y el worker viejo queda vivo ocupando el puerto con el código anterior. Antes de volver a tocar código porque "el arreglo no anda", confirmá con `netstat` qué proceso está respondiendo en el puerto.
- **Huecos del plan, no del código.** Snake arrancaba sola porque el plan describía las reglas pero nunca decía cuándo empieza la partida. Ante un comportamiento raro, revisá si la especificación lo definía.

## Convenciones

- Archivos por debajo de 300 líneas, funciones por debajo de 50. `score-panel.js` se separó de `game-page.js` justamente por eso.
- Todo en español: código de UI, comentarios, mensajes de error de cara al usuario y mensajes de commit (`tipo: descripción en minúscula`).
- Un commit por pieza que funciona y se puede abrir y probar (backend, home, Snake, Tetris, ranking), no por feature completa.
- Los errores de red y de API se traducen a mensajes en castellano en `frontend/js/api.js`; el resto del frontend sólo muestra `error.message`.

