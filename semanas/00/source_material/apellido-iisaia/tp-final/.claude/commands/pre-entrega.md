---
description: Revisa que el TP esté en condiciones de entregarse antes de commitear
---

Revisá el estado del trabajo y reportá, punto por punto, qué está listo y qué falta.
No arregles nada todavía: primero el diagnóstico.

1. `git status` y `git diff --stat`: qué cambió y qué quedó sin commitear.
2. El `README.md` es el informe. Si algún cambio invalidó una decisión narrada en
   "Qué decidí yo", "Cómo gestioné el contexto" o "Qué salió mal", decime qué
   sección hay que actualizar y con qué.
3. `docs/plan.md` está congelado a propósito: avisá si aparece modificado.
4. La app levanta con `uv run fastapi dev backend/main.py` y la home lista los juegos.
5. Los `CLAUDE.md` y las rules siguen describiendo el código como quedó.

Cerrá con una lista corta de lo que falta antes de entregar, en orden de importancia.
