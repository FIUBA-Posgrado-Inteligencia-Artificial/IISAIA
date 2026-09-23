---
name: agregar-juego
description: Use when adding a new game to the platform — creating a Phaser scene, seeding the game in the database and wiring it to the game page. Covers the order of the steps and the verification in the browser.
---

# Agregar un juego a la plataforma

Un juego nuevo toca las dos mitades del proyecto. El orden importa: si la escena
se escribe antes que el seed, la página de juego queda apuntando a un slug que la
API todavía no conoce y el ranking devuelve 404.

Antes de empezar, leé `.claude/rules/escenas-de-juego.md`. Las reglas de ahí no se
repiten en este archivo y son obligatorias.

## Fase 1 · Definir el juego

Preguntá, o proponé y confirmá, tres cosas: el **slug** (minúsculas, sin espacios;
es lo que viaja en el path de la API), el **nombre** visible y una **descripción**
de una línea en castellano, en el mismo tono que las de `GAMES`.

No sigas sin esos tres datos: el slug aparece en cuatro lugares y renombrarlo
después es más caro que decidirlo ahora.

## Fase 2 · Seed en el backend

Agregá la entrada al final de la constante `GAMES` en `backend/main.py`.

`seed_games()` es idempotente y compara por slug, así que alcanza con reiniciar la
app: inserta lo que falte y deja intacto lo que ya está. **No** toques `scores.db`
a mano ni escribas un script de migración.

## Fase 3 · La escena

Creá `frontend/js/games/<slug>.js` siguiendo "Forma de una escena nueva" en
`.claude/rules/escenas-de-juego.md`. Los tres puntos que más se olvidan:

- La escena no importa `api.js` ni hace `fetch`. Su única salida es `gameover`.
- El teclado va por `onKeys()` de `common.js`, nunca con `scene.input.keyboard.on()`.
- Al terminar la partida, `finishGame(scene, score, width, height)`.

## Fase 4 · Conectar la página

Agregá la entrada al `GAMES` de `frontend/js/game-page.js`: escena, tamaño y texto
de controles. Es el segundo de los dos lados que menciona el `CLAUDE.md` de la raíz,
y el único archivo más que hay que tocar: `score-panel.js` ya guarda el puntaje de
cualquier juego, porque el slug viaja en el path.

## Fase 5 · Verificar jugando

No hay tests: la verificación es jugar. Con la app levantada, y usando el MCP de
Playwright:

1. Abrir la home y confirmar que el juego nuevo aparece en la lista.
2. Entrar a su página, jugar hasta perder a propósito y ver el overlay de fin.
3. Guardar un puntaje con un nombre y confirmar que entra al ranking.
4. Recargar y confirmar que el puntaje sigue ahí.

Recién cuando los cuatro pasos salen bien, el juego está agregado.

## Anti-patterns

- **Escribir la escena primero.** Sin el seed, la página carga y el ranking tira 404.
- **Hacer `fetch` desde la escena.** Rompe el contrato que permite tocar un juego sin
  cargar el backend en contexto.
- **Dar por hecho que anda porque la página no muestra errores.** Una escena puede
  dibujarse bien y no emitir nunca `gameover`; eso solo se ve jugando hasta perder.
- **Cambiar el slug a mitad de camino.** Revisá los cuatro lugares antes de aceptar
  un cambio de nombre.
