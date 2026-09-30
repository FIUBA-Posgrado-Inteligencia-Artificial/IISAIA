# TP final sample: Auth0 login with Google — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the whole TP final sample site behind a Google login through Auth0, and add a pytest suite for the API and the login flow.

**Architecture:** FastAPI runs the OIDC flow server side with Authlib and keeps the user in a signed session cookie (`SessionMiddleware`). A `require_login` middleware redirects anonymous page requests to `/login` and answers anonymous `/api/*` requests with `401`. The frontend only gains a logout link and a `401` → `/login` redirect in `api.js`.

**Tech Stack:** FastAPI, SQLModel/SQLite, Authlib (Starlette client), itsdangerous, python-dotenv, pytest + FastAPI `TestClient`; vanilla ES modules frontend; Playwright MCP for browser verification.

**Spec:** `docs/superpowers/specs/2026-09-29-tp-final-auth0-design.md`

All paths below are relative to the project root
`tp-final/` (call it `TP`), and every
command runs from there. Git branch: `feature/auth0-login` (already created, spec committed).

## Global Constraints

- The whole site requires login: pages, static files, `/docs`, and `/api/*`. Only `/login`, `/callback`, `/logout` are public.
- The player still types the name on a score; `routes.py`, `schemas.py`, `models.py` do not change.
- Anonymous `/api/*` → `401 {"detail": "Tenés que iniciar sesión."}`; anonymous anything else → `302 /login`.
- `/login` sends `connection=google-oauth2`.
- Env vars: `AUTH0_DOMAIN` (no `https://`), `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `SESSION_SECRET`. Missing or empty → `RuntimeError` at startup naming them, in Spanish.
- `.env` gitignored; `.env.example` committed with names only. The course repo is public.
- `docs/plan.md` is frozen: never edit it.
- UI text, error messages, comments, and commit messages in Spanish; commits `tipo: descripción en minúscula`.
- Files under 300 lines, functions under 50.
- Docs (README, CLAUDE.md files, rules, skill) are updated in the same commit as the code they describe. The README is the student's TP report, written in first person.
- No `pytest-playwright`, no test-only login bypass in app code.

## Review Focus

1. User cancels on Google or denies consent: Auth0 returns to `/callback?error=access_denied`; expect `400` with a "try again" link to `/login`, not a `500`. Pinned in Task 2 (`test_callback_con_error_devuelve_400`).
2. Anonymous requests for static assets and `/docs`: expect `302 /login`, never the file. Pinned in Task 2 (`test_anonimo_va_al_login` parametrized).
3. Anonymous `POST` of a score: expect `401` and nothing saved. Pinned in Task 2 (`test_post_anonimo_no_guarda`).
4. `.env` copied from `.env.example` but a value left empty (`SESSION_SECRET=`): expect the startup error naming it, not a working app with an empty secret. Pinned in Task 2 (`test_variable_vacia_frena_el_arranque`).
5. Session cookie gone while a page is open (expired, cleared): the next API call should send the browser to `/login`, not show a raw error. No JS test harness exists, so it's pinned as a Playwright MCP step in Task 3 (Step 7).

---

### Task 1: pytest suite for the existing API

Adds pytest and a temp database, and pins the current scores contract before auth touches anything.

**Files:**
- Modify: `pyproject.toml` (via `uv add`, plus `[tool.pytest.ini_options]`)
- Modify: `backend/db.py`
- Create: `tests/conftest.py`
- Create: `tests/test_scores.py`
- Modify: `CLAUDE.md`, `backend/CLAUDE.md`, `README.md`, `.claude/skills/agregar-juego/SKILL.md`

**Interfaces:**
- Produces: env var `DATABASE_URL` read by `backend/db.py` (default `sqlite:///<TP>/scores.db`); fixtures `client` (anonymous `TestClient`, `follow_redirects=False`, lifespan run) and `user_client` (in this task identical to `client`; Task 2 makes it log in). Autouse fixture `empty_scores` wipes the `Score` table before each test.

- [ ] **Step 1: Add pytest and its config**

```bash
uv add --dev pytest
```

Then append to `pyproject.toml`:

```toml
[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]
```

- [ ] **Step 2: Make the database URL configurable**

Replace `backend/db.py` lines 1-11 (imports through the `engine` definition) with:

```python
import os
from collections.abc import Iterator
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

DB_PATH = Path(__file__).resolve().parent.parent / "scores.db"
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
```

`create_tables()` and `get_session()` stay as they are.

- [ ] **Step 3: Write `tests/conftest.py`**

```python
import os
import tempfile
from pathlib import Path

# Antes de importar la app: base temporal, así los tests nunca tocan scores.db.
os.environ["DATABASE_URL"] = f"sqlite:///{Path(tempfile.mkdtemp()) / 'test.db'}"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlmodel import Session

from backend.db import create_tables, engine
from backend.main import app
from backend.models import Score

create_tables()


@pytest.fixture(autouse=True)
def empty_scores():
    with Session(engine) as session:
        session.execute(delete(Score))
        session.commit()


@pytest.fixture
def client():
    with TestClient(app, follow_redirects=False) as test_client:
        yield test_client


@pytest.fixture
def user_client(client):
    return client
```

- [ ] **Step 4: Write `tests/test_scores.py`**

```python
from datetime import datetime, timedelta

import pytest


def post_score(client, slug, player, points):
    return client.post(f"/api/games/{slug}/scores", json={"player": player, "points": points})


def test_lista_los_juegos_del_seed(user_client):
    response = user_client.get("/api/games")
    assert response.status_code == 200
    assert {"snake", "tetris"} <= {game["slug"] for game in response.json()}


def test_guardar_puntaje_devuelve_201_con_fecha_utc(user_client):
    response = post_score(user_client, "snake", "Ana", 70)
    assert response.status_code == 201
    body = response.json()
    assert (body["game"], body["player"], body["points"]) == ("snake", "Ana", 70)
    assert datetime.fromisoformat(body["created_at"]).utcoffset() == timedelta(0)


def test_ranking_de_mayor_a_menor_y_empate_para_el_primero(user_client):
    post_score(user_client, "snake", "Ana", 50)
    post_score(user_client, "snake", "Beto", 70)
    post_score(user_client, "snake", "Caro", 50)
    response = user_client.get("/api/games/snake/scores")
    assert response.status_code == 200
    assert [score["player"] for score in response.json()] == ["Beto", "Ana", "Caro"]


def test_ranking_respeta_limit(user_client):
    for points in (10, 20, 30):
        post_score(user_client, "tetris", "Ana", points)
    response = user_client.get("/api/games/tetris/scores?limit=2")
    assert [score["points"] for score in response.json()] == [30, 20]


def test_juego_inexistente_devuelve_404(user_client):
    assert user_client.get("/api/games/pong/scores").json() == {"detail": "El juego 'pong' no existe"}
    assert post_score(user_client, "pong", "Ana", 10).status_code == 404


@pytest.mark.parametrize(
    "player, points",
    [("", 10), ("   ", 10), ("x" * 21, 10), ("Ana", -1)],
)
def test_puntaje_invalido_devuelve_422(user_client, player, points):
    assert post_score(user_client, "snake", player, points).status_code == 422


@pytest.mark.parametrize("limit", [0, 51])
def test_limit_fuera_de_rango_devuelve_422(user_client, limit):
    assert user_client.get(f"/api/games/snake/scores?limit={limit}").status_code == 422
```

- [ ] **Step 5: Run the suite**

Run: `uv run pytest -v`
Expected: all tests PASS. They describe existing behavior, so a failure means the contract drifted: stop and report it. Also confirm `scores.db` was not touched by comparing `ls -l scores.db` before and after the run (the file is gitignored, so `git status` won't show it).

- [ ] **Step 6: Update docs for tests**

`CLAUDE.md`: in the commands block add a line after the `--port 8765` one:

```bash
uv run pytest                              # tests de la API (base temporal, no toca scores.db)
```

and replace the bullet starting `- **No hay suite de tests.**` with:

```markdown
- **Tests:** `uv run pytest` cubre la API con una base SQLite temporal (`tests/conftest.py` fija `DATABASE_URL` antes de importar la app). Los juegos se siguen verificando en el navegador leyendo el estado de la escena desde el DOM, con el MCP de Playwright habilitado en `.claude/settings.local.json`.
```

In the "Dónde seguir leyendo" table, change `probar con curl` to `probar con pytest y curl`.

`backend/CLAUDE.md`: replace the `## Probar a mano` heading and its code block with:

````markdown
## Probar

```bash
uv run pytest
```

Los tests usan `TestClient` y una base temporal: `DATABASE_URL` se fija en `tests/conftest.py` antes de importar la app, así que `scores.db` no se toca. `tests/test_scores.py` fija el contrato de los endpoints, incluida la zona horaria de `created_at`.

A mano:

```bash
uv run fastapi dev backend/main.py
curl http://127.0.0.1:8000/api/games
curl -X POST http://127.0.0.1:8000/api/games/snake/scores \
  -H "Content-Type: application/json" -d '{"player":"Ana","points":70}'
```
````

(Keep the two paragraphs after it: `/docs` + fechas, and the Windows reload note.)

`README.md`: after the line `No hay variables de entorno. La base ...` add:

```markdown
Los tests de la API se corren con `uv run pytest`. Usan una base temporal, así que no tocan `scores.db`.
```

and in the architecture tree replace `└── docs/plan.md        el plan con el que arranqué` with:

```
├── tests/              pytest sobre la API
└── docs/plan.md        el plan con el que arranqué
```

`.claude/skills/agregar-juego/SKILL.md`: replace `No hay tests: la verificación es jugar. Con la app levantada, y usando el MCP de` / `Playwright:` with:

```markdown
Primero `uv run pytest`: confirma que la API sigue cumpliendo su contrato con el
juego nuevo en el seed. Pero lo que valida el juego es jugarlo. Con la app
levantada, y usando el MCP de Playwright:
```

- [ ] **Step 7: Commit**

```bash
git add pyproject.toml uv.lock backend/db.py tests/ CLAUDE.md backend/CLAUDE.md README.md .claude/skills/agregar-juego/SKILL.md
git commit -m "test: agregar pytest sobre la API con base temporal

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Auth0 login on the backend

**Files:**
- Create: `backend/auth.py`
- Modify: `backend/main.py`
- Create: `.env.example`
- Modify: `.gitignore`
- Modify: `pyproject.toml` (via `uv add`)
- Modify: `tests/conftest.py`
- Create: `tests/test_auth.py`
- Modify: `README.md`, `CLAUDE.md`, `backend/CLAUDE.md`, `.claude/rules/api-y-datos.md`, `.claude/skills/agregar-juego/SKILL.md`

**Interfaces:**
- Consumes: fixtures `client`, `user_client`, `empty_scores` from Task 1.
- Produces (`backend/auth.py`): `REQUIRED_VARS: tuple[str, ...]`; `Settings` frozen dataclass (`auth0_domain`, `client_id`, `client_secret`, `session_secret`); `load_settings() -> Settings`; module-level `settings: Settings`; `oauth: OAuth` with client `oauth.auth0`; `router: APIRouter` with routes named `login`, `callback`, `logout`; `async def require_login(request: Request, call_next: RequestResponseEndpoint) -> Response`.
- Produces (tests): `user_client` now goes through `/callback` and holds a session cookie. Fake user `{"sub": "google-oauth2|123", "name": "Ana Test", "email": "ana@example.com"}`.

- [ ] **Step 1: Add runtime dependencies**

```bash
uv add authlib itsdangerous python-dotenv
```

- [ ] **Step 2: Update `tests/conftest.py` for auth**

After the `os.environ["DATABASE_URL"] = ...` line add:

```python
# Valores falsos: pisan cualquier .env real (load_dotenv no sobreescribe lo que ya está).
os.environ.update(
    {
        "AUTH0_DOMAIN": "test.auth0.com",
        "AUTH0_CLIENT_ID": "test-client-id",
        "AUTH0_CLIENT_SECRET": "test-client-secret",
        "SESSION_SECRET": "test-session-secret",
    }
)
```

Add to the imports:

```python
from backend.auth import oauth
```

Add these constants and fixture after `create_tables()`:

```python
AUTH0_METADATA = {
    "issuer": "https://test.auth0.com/",
    "authorization_endpoint": "https://test.auth0.com/authorize",
    "token_endpoint": "https://test.auth0.com/oauth/token",
    "jwks_uri": "https://test.auth0.com/.well-known/jwks.json",
}
FAKE_USER = {"sub": "google-oauth2|123", "name": "Ana Test", "email": "ana@example.com"}


@pytest.fixture(autouse=True)
def fake_auth0(monkeypatch):
    async def load_server_metadata():
        return AUTH0_METADATA

    async def authorize_access_token(request, **kwargs):
        return {"userinfo": FAKE_USER}

    monkeypatch.setattr(oauth.auth0, "load_server_metadata", load_server_metadata)
    monkeypatch.setattr(oauth.auth0, "authorize_access_token", authorize_access_token)
```

Replace the `user_client` fixture with:

```python
@pytest.fixture
def user_client(client):
    client.get("/callback")
    return client
```

- [ ] **Step 3: Write `tests/test_auth.py`**

```python
from urllib.parse import parse_qs, urlparse

import pytest
from authlib.integrations.starlette_client import OAuthError

from backend.auth import REQUIRED_VARS, load_settings, oauth


@pytest.mark.parametrize(
    "path", ["/", "/index.html", "/game.html?game=snake", "/css/styles.css", "/docs"]
)
def test_anonimo_va_al_login(client, path):
    response = client.get(path)
    assert response.status_code == 302
    assert response.headers["location"] == "/login"


def test_api_anonima_devuelve_401(client):
    response = client.get("/api/games")
    assert response.status_code == 401
    assert response.json() == {"detail": "Tenés que iniciar sesión."}


def test_post_anonimo_no_guarda(client):
    anonymous = client.post("/api/games/snake/scores", json={"player": "Ana", "points": 10})
    assert anonymous.status_code == 401
    client.get("/callback")  # recién ahora inicia sesión, para poder leer el ranking
    assert client.get("/api/games/snake/scores").json() == []


def test_login_va_directo_a_google_por_auth0(client):
    response = client.get("/login")
    assert response.status_code == 302
    url = urlparse(response.headers["location"])
    query = parse_qs(url.query)
    assert (url.netloc, url.path) == ("test.auth0.com", "/authorize")
    assert query["connection"] == ["google-oauth2"]
    assert query["redirect_uri"] == ["http://testserver/callback"]
    assert "openid" in query["scope"][0].split()


def test_callback_guarda_la_sesion(client):
    response = client.get("/callback")
    assert response.status_code == 302
    assert response.headers["location"] == "/"
    assert client.get("/api/games").status_code == 200


def test_logueado_recibe_estaticos(user_client):
    assert user_client.get("/css/styles.css").status_code == 200


def test_callback_con_error_devuelve_400(client, monkeypatch):
    async def denied(request, **kwargs):
        raise OAuthError(error="access_denied")

    monkeypatch.setattr(oauth.auth0, "authorize_access_token", denied)
    response = client.get("/callback?error=access_denied")
    assert response.status_code == 400
    assert 'href="/login"' in response.text
    assert client.get("/api/games").status_code == 401


def test_logout_borra_la_sesion_y_sale_de_auth0(user_client):
    response = user_client.get("/logout")
    assert response.status_code == 302
    url = urlparse(response.headers["location"])
    query = parse_qs(url.query)
    assert (url.netloc, url.path) == ("test.auth0.com", "/v2/logout")
    assert query["client_id"] == ["test-client-id"]
    assert query["returnTo"] == ["http://testserver"]
    assert user_client.get("/api/games").status_code == 401


@pytest.mark.parametrize("name", REQUIRED_VARS)
def test_variable_faltante_frena_el_arranque(monkeypatch, name):
    monkeypatch.delenv(name)
    with pytest.raises(RuntimeError, match=name):
        load_settings()


@pytest.mark.parametrize("name", REQUIRED_VARS)
def test_variable_vacia_frena_el_arranque(monkeypatch, name):
    monkeypatch.setenv(name, "")
    with pytest.raises(RuntimeError, match=name):
        load_settings()
```

- [ ] **Step 4: Run to verify it fails**

Run: `uv run pytest -v`
Expected: collection ERROR in `conftest.py`: `ModuleNotFoundError: No module named 'backend.auth'`.

- [ ] **Step 5: Write `backend/auth.py`**

```python
import os
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlencode

from authlib.integrations.starlette_client import OAuth, OAuthError
from dotenv import load_dotenv
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, Response
from starlette.middleware.base import RequestResponseEndpoint

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

REQUIRED_VARS = ("AUTH0_DOMAIN", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET", "SESSION_SECRET")
PUBLIC_PATHS = {"/login", "/callback", "/logout"}
LOGIN_FAILED_HTML = (
    '<!doctype html><html lang="es"><meta charset="utf-8">'
    "<title>No se pudo iniciar sesión</title>"
    '<p>No se pudo iniciar sesión. <a href="/login">Intentar de nuevo</a></p></html>'
)


@dataclass(frozen=True)
class Settings:
    auth0_domain: str
    client_id: str
    client_secret: str
    session_secret: str


def load_settings() -> Settings:
    missing = [name for name in REQUIRED_VARS if not os.environ.get(name)]
    if missing:
        raise RuntimeError(
            f"Faltan variables de entorno: {', '.join(missing)}. "
            "Copiá .env.example a .env y completalas (ver README)."
        )
    return Settings(
        auth0_domain=os.environ["AUTH0_DOMAIN"],
        client_id=os.environ["AUTH0_CLIENT_ID"],
        client_secret=os.environ["AUTH0_CLIENT_SECRET"],
        session_secret=os.environ["SESSION_SECRET"],
    )


settings = load_settings()

oauth = OAuth()
oauth.register(
    "auth0",
    client_id=settings.client_id,
    client_secret=settings.client_secret,
    server_metadata_url=f"https://{settings.auth0_domain}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid profile email"},
)

router = APIRouter()


@router.get("/login")
async def login(request: Request) -> Response:
    redirect_uri = str(request.url_for("callback"))
    return await oauth.auth0.authorize_redirect(request, redirect_uri, connection="google-oauth2")


@router.get("/callback")
async def callback(request: Request) -> Response:
    try:
        token = await oauth.auth0.authorize_access_token(request)
    except OAuthError:
        return HTMLResponse(LOGIN_FAILED_HTML, status_code=400)
    userinfo = token["userinfo"]
    request.session["user"] = {
        "sub": userinfo["sub"],
        "name": userinfo.get("name", ""),
        "email": userinfo.get("email", ""),
    }
    return RedirectResponse("/", status_code=302)


@router.get("/logout")
async def logout(request: Request) -> Response:
    request.session.clear()
    params = urlencode(
        {"client_id": settings.client_id, "returnTo": str(request.base_url).rstrip("/")}
    )
    return RedirectResponse(f"https://{settings.auth0_domain}/v2/logout?{params}", status_code=302)


async def require_login(request: Request, call_next: RequestResponseEndpoint) -> Response:
    if request.url.path in PUBLIC_PATHS or request.session.get("user"):
        return await call_next(request)
    if request.url.path.startswith("/api/"):
        return JSONResponse({"detail": "Tenés que iniciar sesión."}, status_code=401)
    return RedirectResponse("/login", status_code=302)
```

- [ ] **Step 6: Wire it into `backend/main.py`**

Add imports (keep the existing ones):

```python
from starlette.middleware.sessions import SessionMiddleware

from backend.auth import require_login, settings
from backend.auth import router as auth_router
```

Replace the last three lines (`app = FastAPI(...)` through `app.mount(...)`) with:

```python
app = FastAPI(title="Plataforma de juegos", lifespan=lifespan)
# Starlette corre primero el último middleware agregado: la sesión tiene que
# estar cargada antes de que require_login la lea.
app.middleware("http")(require_login)
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
app.include_router(auth_router)
app.include_router(router)
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
```

- [ ] **Step 7: Run to verify it passes**

Run: `uv run pytest -v`
Expected: all tests in `test_scores.py` and `test_auth.py` PASS.

- [ ] **Step 8: Config files**

Create `.env.example`:

```
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
SESSION_SECRET=
```

Append `.env` to `.gitignore` (after `*.db`).

Check that the server refuses to start without config, and names what's missing. Make sure there is no `TP/.env` yet (`ls .env` fails), then run:

`uv run python -c "import backend.main"`
Expected: `RuntimeError: Faltan variables de entorno: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, SESSION_SECRET. ...`

- [ ] **Step 9: README**

Replace the whole `## Cómo se ejecuta` section (from the heading up to, not including, `## Arquitectura`) with:

````markdown
## Cómo se ejecuta

Hace falta Python 3.11 o superior, [uv](https://docs.astral.sh/uv/), conexión a internet, porque Phaser se carga desde un CDN, y una cuenta de [Auth0](https://auth0.com/), porque todo el sitio pide iniciar sesión con Google.

En el dashboard de Auth0, una sola vez:

1. Crear una aplicación de tipo *Regular Web Application*.
2. En *Settings*, poner `http://127.0.0.1:8000/callback` en *Allowed Callback URLs* y `http://127.0.0.1:8000` en *Allowed Logout URLs*. Si usás el puerto 8765, agregá las mismas dos direcciones con ese puerto.
3. En *Authentication → Social*, activar Google (`google-oauth2`) para la aplicación.

Después copiar `.env.example` a `.env` y completarlo. `AUTH0_DOMAIN` es el dominio del tenant sin `https://`, y el client ID y el secret están en *Settings*. `SESSION_SECRET` firma la cookie de sesión y puede ser cualquier texto largo al azar:

```bash
uv run python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Si falta alguna de las cuatro variables, el servidor no arranca y dice cuál.

```bash
cd tp-final
uv sync
uv run fastapi dev backend/main.py
```

Abrir `http://127.0.0.1:8000`. Sin sesión, cualquier página lleva al login de Google. La documentación interactiva de la API está en `http://127.0.0.1:8000/docs`, también detrás del login.

Si el servidor no arranca y muestra `[WinError 10013]` o `address already in use`, es que otro programa está usando el puerto 8000. En ese caso hay que levantarlo en otro puerto y abrir esa dirección:

```bash
uv run fastapi dev backend/main.py --port 8765
```

La base `scores.db` se crea al arrancar, con los dos juegos ya cargados. Para vaciar el ranking alcanza con borrar ese archivo.

Los tests se corren con `uv run pytest`. Usan una base temporal y un Auth0 simulado, así que no tocan `scores.db` ni necesitan el `.env`.
````

In the tree, replace the `main.py` line and add `auth.py` right after it:

```
│   ├── main.py         app, middlewares, creación de tablas, seed de juegos, montaje de estáticos
│   ├── auth.py         login con Auth0 y middleware que exige sesión
```

and replace the `├── tests/` line from Task 1 with:

```
├── tests/              pytest sobre la API y el login, con Auth0 simulado
├── .env.example        las variables que necesita Auth0
```

Replace the endpoints table (header through the `POST` row) with:

```markdown
| Method | Path | Respuestas |
|--------|------|------------|
| `GET` | `/api/games` | `200` lista de juegos · `401` sin sesión |
| `GET` | `/api/games/{slug}/scores?limit=10` | `200` mejores puntajes, de mayor a menor · `401` sin sesión · `404` el juego no existe · `422` `limit` fuera de 1 a 50 |
| `POST` | `/api/games/{slug}/scores` | `201` puntaje creado · `401` sin sesión · `404` el juego no existe · `422` nombre vacío o de más de 20 caracteres, o puntaje negativo |
| `GET` | `/login` | `302` a Auth0, que va directo a Google |
| `GET` | `/callback` | `302` a `/` con la sesión iniciada · `400` si el login falló o se canceló |
| `GET` | `/logout` | `302` a Auth0 para cerrar la sesión, que vuelve a `/` |

Sin sesión, cualquier otra ruta, páginas y `/docs` incluidas, redirige a `/login`.
```

In `## Qué decidí yo`, replace the whole paragraph starting `**Nickname libre, sin cuentas.**` with these three:

```markdown
**Login con Google, pero el nombre del ranking lo elige cada uno.** Todo el sitio pide iniciar sesión con Google a través de Auth0. El nombre que aparece en el ranking lo sigue escribiendo el jugador al guardar, así que el contrato de `POST /scores` no cambió.

**El login vive en el servidor, no en el navegador.** Auth0 tiene un SDK para que el navegador haga el login y le mande un token a la API. Lo descarté porque así las páginas siguen siendo públicas y sólo se protegen los datos. Como un solo proceso sirve la API y el frontend, FastAPI hace el login con Authlib y guarda el usuario en una cookie de sesión firmada. Un middleware manda a `/login` cualquier request sin sesión, páginas incluidas.

**Tests para la API.** Antes verificaba todo jugando en el navegador. Con el login, probar un endpoint a mano implica pasar por Google cada vez, así que sumé tests con pytest. Usan una base temporal y reemplazan las dos llamadas a Auth0, así que corren sin red y sin `.env`. Los juegos los sigo probando jugando.
```

- [ ] **Step 10: CLAUDE.md, backend/CLAUDE.md, rules, skill**

`CLAUDE.md`: replace the bullet `- No hay variables de entorno. ...` with:

```markdown
- Necesita un `.env` con `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` y `SESSION_SECRET` (ver `.env.example` y el README). Sin esas variables el servidor no arranca. `scores.db` se crea al arrancar con los dos juegos ya cargados; **borrar el archivo** vacía el ranking.
```

In the `**Tests:**` bullet, replace `cubre la API con una base SQLite temporal (` with `cubre la API y el login con una base SQLite temporal y Auth0 simulado (`, and replace `fija \`DATABASE_URL\` antes de importar la app)` with `fija \`DATABASE_URL\` y las variables de Auth0 antes de importar la app)`. Append to that bullet: ` El login real con Google no se automatiza: lo hace la persona en el navegador.`

In `## Arquitectura`, after the `**Un solo proceso sirve todo.**` paragraph add:

```markdown
**Todo pide sesión.** `backend/auth.py` es el único archivo que conoce a Auth0: registra `/login`, `/callback` y `/logout`, y define `require_login`, el middleware que manda a `/login` cualquier request sin sesión y responde `401` en `/api/*`. El usuario vive en una cookie firmada por `SessionMiddleware`. En `main.py` el orden importa: Starlette corre primero el último middleware agregado, así que `SessionMiddleware` va después de `require_login` en el código. El router de auth, como el de `/api`, se registra antes del mount.
```

In the backend layers sentence, replace `→ \`main.py\` (app, \`lifespan\`` with `→ \`auth.py\` (login con Auth0 y middleware que exige sesión) → \`main.py\` (app, middlewares, \`lifespan\``.

`backend/CLAUDE.md`: replace the order code block in `## Arranque` with:

````markdown
```python
app.middleware("http")(require_login)                           # exige sesión
app.add_middleware(SessionMiddleware, secret_key=...)           # carga la sesión; corre antes que require_login
app.include_router(auth_router)                                 # /login, /callback, /logout
app.include_router(router)                                      # /api/...
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True))  # todo lo demás
```

Starlette corre primero el último middleware agregado. Si `SessionMiddleware` se agregara antes que `require_login`, el middleware leería `request.session` sin sesión cargada y Starlette tiraría un `AssertionError`.

`auth.py` llama a `load_settings()` al importarse: sin las cuatro variables del `.env` el proceso no arranca y el error dice cuáles faltan.
````

Add a row to the `## Capas` table, after `routes.py`:

```markdown
| `auth.py` | settings de Auth0, cliente OAuth, `/login` `/callback` `/logout` y el middleware `require_login` |
```

In `## Probar`, replace the sentence starting `Los tests usan \`TestClient\` y una base temporal:` with:

```markdown
Los tests usan `TestClient`, una base temporal y un Auth0 simulado: `tests/conftest.py` fija `DATABASE_URL` y las variables de Auth0 antes de importar la app, y reemplaza `load_server_metadata` y `authorize_access_token` del cliente OAuth. No necesitan `.env` ni red. El fixture `user_client` pasa por `/callback` y queda con la sesión iniciada. `tests/test_scores.py` fija el contrato de los endpoints, incluida la zona horaria de `created_at`, y `tests/test_auth.py` el login.
```

and replace the `A mano:` line plus its code block with:

````markdown
A mano, `curl` ya no alcanza: sin la cookie de sesión la API responde `401`.

```bash
curl -i http://127.0.0.1:8000/api/games   # 401 {"detail": "Tenés que iniciar sesión."}
```

Para ver respuestas crudas con sesión, iniciá sesión en el navegador y usá `/docs`.
````

`.claude/rules/api-y-datos.md`: in the status codes paragraph, after `` `404` para juego inexistente`` insert `, \`401\` sin sesión (lo responde el middleware de \`auth.py\`, no los endpoints)`. In `## Capas`, change `Un router nuevo se registra **antes**` to `Un router nuevo (también el de \`auth.py\`) se registra **antes**`.

`.claude/skills/agregar-juego/SKILL.md`: after `Playwright:` (end of the intro paragraph edited in Task 1) add a line:

```markdown
Todo el sitio pide login con Google. Si Playwright cae en la pantalla de Google, pedile a la persona que inicie sesión en esa ventana: el login real no se automatiza.
```

- [ ] **Step 11: Final run and commit**

Run: `uv run pytest -v`
Expected: all PASS.
Run: `git status --short` and confirm no `.env` is listed.

```bash
git add pyproject.toml uv.lock backend/auth.py backend/main.py .env.example .gitignore tests/ README.md CLAUDE.md backend/CLAUDE.md .claude/rules/api-y-datos.md .claude/skills/agregar-juego/SKILL.md
git commit -m "feat: exigir login con google via auth0 en todo el sitio

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Frontend logout link, 401 handling, and browser verification

**Files:**
- Modify: `frontend/index.html`, `frontend/game.html`
- Modify: `frontend/css/styles.css`
- Modify: `frontend/js/api.js`
- Modify: `tests/test_auth.py`
- Modify: `frontend/CLAUDE.md`

**Interfaces:**
- Consumes: `user_client` fixture; `/logout` route from Task 2.
- Produces: `<nav class="header-links">` in both headers, holding the existing link and `<a href="/logout">Cerrar sesión</a>`. (The spec's `.logout-link` class is replaced by styling the `nav` wrapper: the header is `justify-content: space-between`, so a third direct child would land in the middle.)

- [ ] **Step 1: Write the failing test**

Append to `tests/test_auth.py`:

```python
@pytest.mark.parametrize("path", ["/", "/game.html?game=snake"])
def test_paginas_tienen_cerrar_sesion(user_client, path):
    response = user_client.get(path)
    assert response.status_code == 200
    assert '<a href="/logout">Cerrar sesión</a>' in response.text
```

- [ ] **Step 2: Run to verify it fails**

Run: `uv run pytest tests/test_auth.py -k cerrar_sesion -v`
Expected: 2 FAILED on the `in response.text` assertion.

- [ ] **Step 3: Add the link to both headers**

`frontend/index.html`, replace `    <a href="/docs">Documentación de la API</a>` with:

```html
    <nav class="header-links">
      <a href="/docs">Documentación de la API</a>
      <a href="/logout">Cerrar sesión</a>
    </nav>
```

`frontend/game.html`, replace `    <a href="index.html">Volver a los juegos</a>` with:

```html
    <nav class="header-links">
      <a href="index.html">Volver a los juegos</a>
      <a href="/logout">Cerrar sesión</a>
    </nav>
```

`frontend/css/styles.css`, after the `.site-header a { text-decoration: none; }` line add:

```css
.header-links { display: flex; gap: var(--space-4); }
```

- [ ] **Step 4: Run to verify it passes**

Run: `uv run pytest -v`
Expected: all PASS.

- [ ] **Step 5: Send the browser to login on a 401**

In `frontend/js/api.js`, inside `request()`, right after the `try { ... } catch { ... }` block and before `const body = ...`, add:

```js
  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Tu sesión terminó. Te llevamos a iniciar sesión.");
  }
```

- [ ] **Step 6: Update `frontend/CLAUDE.md`**

After the table in `## Las dos páginas` add:

```markdown
Las dos páginas están detrás del login: sin sesión el servidor redirige a `/login` antes de mandar el HTML, así que ningún módulo tiene que chequear si hay usuario. El header de las dos lleva `<a href="/logout">Cerrar sesión</a>`, un link común: el servidor borra la sesión y redirige a Auth0.
```

In `## Errores`, after the first paragraph add:

```markdown
La excepción es el `401`: significa que la sesión se terminó con la página abierta. `request()` manda al navegador a `/login` y tira el `Error` igual, para que el código que llamó se corte sin seguir.
```

- [ ] **Step 7: Browser verification with Playwright MCP (needs the human)**

Ask the person to create `TP/.env` from `.env.example` with their real Auth0 tenant and to finish the dashboard setup from the README. Then start the server in the background: `uv run fastapi dev backend/main.py` (check with `netstat -ano | findstr :8000` that the right process is listening; see the Windows reload trap in `CLAUDE.md`).

1. `browser_navigate` to `http://127.0.0.1:8000/`. Expect to land on `accounts.google.com` (through `*.auth0.com`), not on the Auth0 provider picker.
2. Ask the person to complete the Google login in that Playwright window. Wait for their confirmation.
3. `browser_snapshot`: the catalog shows Tetris and Snake, and the header shows "Cerrar sesión".
4. Open Snake, play until game over, save a score as "Prueba", confirm it's in the ranking.
5. **Review Focus 5:** clear cookies with `browser_run_code_unsafe` (`async (page) => { await page.context().clearCookies(); }`), then submit another score. Expect the browser to go to `/login` → Auth0, not an error message in the panel.
6. Log in again (person), click "Cerrar sesión". Expect a redirect through `*.auth0.com/v2/logout` and then back to `/`, which redirects to login again.

If any step fails, stop and use superpowers:systematic-debugging. Don't patch blindly.

- [ ] **Step 8: Commit**

Confirm `git status --short` doesn't list `.env`.

```bash
git add frontend/index.html frontend/game.html frontend/css/styles.css frontend/js/api.js tests/test_auth.py frontend/CLAUDE.md
git commit -m "feat: agregar cerrar sesión y redirigir al login ante un 401

Verificado en el navegador con login real de Google. Próximo paso: merge a main.

Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>"
```
