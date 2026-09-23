# CLAUDE.md — backend

API FastAPI + SQLite que además sirve el frontend. Este archivo describe **cómo funciona**; las reglas de qué hacer y qué no están en `../.claude/rules/api-y-datos.md`.

## Arranque

`lifespan` en `main.py` corre dos cosas antes de aceptar requests: `create_tables()` (crea lo que falte, no migra lo existente) y `seed_games()` (inserta los juegos de la constante `GAMES` que todavía no estén, comparando por slug — es idempotente, se puede arrancar mil veces).

Después viene el orden que no se puede alterar:

```python
app.include_router(router)                                      # /api/...
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True))  # todo lo demás
```

El mount en `/` captura cualquier path que se registre después. Un endpoint nuevo agregado abajo del mount devolvería `index.html` en vez de JSON, sin error visible.

`FRONTEND_DIR` y `DB_PATH` se resuelven desde `__file__`, así que el servidor anda sin importar desde qué directorio lo levantes.

## Recorrido de un request

`routes.py` es el único archivo con endpoints. Los tres comparten la misma forma:

1. `SessionDep` inyecta la sesión (`Annotated[Session, Depends(get_session)]`). Nunca se abre `Session(engine)` a mano dentro de un endpoint.
2. `find_game(session, slug)` resuelve el juego o tira `404` con el detalle en castellano. Todo endpoint con `{slug}` empieza por acá.
3. La consulta se arma con `select()` de SQLModel.
4. La salida pasa por `to_score_out()`, que arma el `ScoreOut` y le estampa `timezone.utc` a `created_at` — SQLite devuelve el datetime naive. Es el único lugar donde se construye la respuesta de un puntaje.

El orden del ranking es `points desc, created_at asc`: a igual puntaje gana el que llegó primero.

## Capas

| Archivo | Qué es |
|---------|--------|
| `db.py` | engine de SQLite (`check_same_thread=False`) y `get_session()` |
| `models.py` | tablas `Game` y `Score`, con `created_at` por `default_factory` en UTC |
| `schemas.py` | `GameOut` / `ScoreInput` / `ScoreOut`, separados de las tablas |
| `routes.py` | los tres endpoints, `find_game()` y `to_score_out()` |
| `main.py` | app, `lifespan`, seed, montaje de estáticos |

La separación modelo/schema no es ceremonia: `ScoreInput` deliberadamente **no** tiene `game` ni `created_at`, y `ScoreOut` expone `game` como slug en vez de `game_id`. Devolver un modelo de tabla directamente filtraría ambas cosas.

La validación vive en los tipos de `schemas.py` y en los `Query(ge=..., le=...)`, no en `if` dentro de los endpoints. Por eso los `422` salen solos y con el cuerpo estándar de FastAPI.

## Cambiar el esquema

No hay Alembic. `create_tables()` no toca tablas que ya existen: si agregás o cambiás una columna, borrá `scores.db` y dejá que el `lifespan` la recree con el seed. `*.db` está en `.gitignore`, así que no se pierde nada versionado.

## Probar a mano

```bash
uv run fastapi dev backend/main.py
curl http://127.0.0.1:8000/api/games
curl -X POST http://127.0.0.1:8000/api/games/snake/scores \
  -H "Content-Type: application/json" -d '{"player":"Ana","points":70}'
```

`/docs` tiene la UI interactiva. Cuando toques fechas, **leé la respuesta cruda**: el bug de la zona horaria daba `201` y se veía bien en el ranking; sólo se notaba mirando el JSON.

Si un cambio "no tiene efecto", antes de volver a editar confirmá qué proceso está en el puerto: en Windows el reload de `fastapi dev` puede dejar vivo al worker viejo. Está contado en el README.
