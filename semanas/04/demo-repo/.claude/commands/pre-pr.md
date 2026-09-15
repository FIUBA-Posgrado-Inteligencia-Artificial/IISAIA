---
description: Chequeo antes de abrir un PR (tests + openapi + diff)
---

Antes de abrir un PR:

1. Corré `uv run pytest` y reportá si pasa.
2. Regenerá `openapi.yaml` con `uv run python scripts/export_openapi.py`.
3. Mostrá `git diff --stat`.

No hagas commits ni push.
