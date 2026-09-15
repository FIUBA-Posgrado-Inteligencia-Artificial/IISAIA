# demo-repo

API REST con FastAPI + frontend chico para demostrar features del runtime de Claude Code.

## Folder map

| Path | Responsabilidad |
|------|-----------------|
| `backend/main.py` | Entry point de FastAPI (CORS + routers) |
| `backend/routers/` | Endpoints HTTP (`users.py`, `posts.py`) |
| `backend/middleware/auth.py` | Dependency de auth bearer |
| `backend/schemas/models.py` | Modelos Pydantic compartidos |
| `backend/db/client.py` | Store en memoria (singleton `store`) |
| `frontend/` | HTML + vanilla JS, sin build step |
| `tests/` | pytest, usa TestClient de FastAPI |
| `openapi.yaml` | Schema de la API exportado |
| `scripts/export_openapi.py` | Regenera `openapi.yaml` desde el FastAPI |

## Convenciones

- Python 3.11+. Type hints obligatorios en funciones públicas.
- Tests con pytest + TestClient. El fixture `reset_store` limpia estado entre tests.
- Auth: bearer token leído de `DEMO_BEARER_TOKEN`. En tests, se setea `test-token`.
- Frontend sin frameworks; usá `fetch` directo. No agregar build step.

## Workflow

- Antes de un PR, correr `uv run pytest` y verificar que pasa.
- `settings.local.json` siempre al `.gitignore` (ya está).
