# API y datos

## Contrato de los endpoints

El slug del juego viaja en el path y **no se repite en el body**. `ScoreInput` lleva `player` y `points`, nada más. Agregar el juego al body abriría la posibilidad de que contradiga al path.

`created_at` lo pone el servidor, nunca el cliente. Si el cliente mandara la fecha, cualquiera podría fechar un puntaje como quisiera.

Si el juego del path no existe, `404` con el detalle en castellano — no una lista vacía. `[]` significa "el juego existe y nadie jugó todavía", que es otra situación.

Status codes en uso: `201` al crear un puntaje, `422` para validación (nombre vacío o de más de 20 caracteres, puntaje negativo, `limit` fuera de 1 a 50), `404` para juego inexistente. Empatados en puntaje, arriba queda el que se guardó primero (`points desc, created_at asc`).

## Fechas

SQLite no guarda zona horaria: `created_at` se escribe en UTC y vuelve naive. `to_score_out()` le estampa `timezone.utc` antes de serializar. Toda respuesta que devuelva un datetime tiene que pasar por ahí o hacer lo mismo, o el navegador la va a leer como hora local.

Este bug no rompe nada visible: el `POST` devuelve `201` y el ranking se ve bien. Sólo se ve leyendo la respuesta cruda.

## Capas

- `models.py` son las tablas. `schemas.py` es lo que entra y sale por la API. No devuelvas un `SQLModel` de tabla directamente como respuesta: cada endpoint declara su `response_model`.
- La sesión se inyecta con `SessionDep` (`Annotated[Session, Depends(get_session)]`). No abras `Session(engine)` dentro de un endpoint.
- Un router nuevo se registra **antes** de `app.mount("/", StaticFiles(...))` en `main.py`. El mount en `/` captura todo lo que se registre después y el endpoint nuevo devolvería el frontend.
- Juegos nuevos entran por la lista `GAMES` del seed en `main.py`. El seed es idempotente: compara por slug y sólo inserta los que faltan.

## Migraciones

No hay Alembic. `create_tables()` sólo crea lo que no existe; cambiar una columna de una tabla ya creada no se refleja en una `scores.db` existente. Si cambiás un modelo, borrá `scores.db` y dejá que el `lifespan` la vuelva a crear con el seed.
