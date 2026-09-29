# TP final sample: Auth0 login with Google — design

Target project: `semanas/00/source_material/apellido-iisaia/tp-final/`

## Goal

Users sign in with their Google account through Auth0. The whole site sits
behind login: without a session nothing is served, neither pages nor API.

## Decisions (agreed in brainstorming)

| Question | Decision |
|----------|----------|
| What does login gate? | Everything: pages and `/api/*` |
| Player name on a score | Still typed by the player; the scores contract does not change |
| Where the login flow lives | Server side: Authlib + signed session cookie (not SPA + JWT) |
| Identity provider | Auth0 `google-oauth2` social connection, sent as `connection=google-oauth2` so users skip the Auth0 picker |
| Automated tests | pytest is added now (reverses the documented "no tests" decision) |
| Browser verification | Playwright MCP, manual run; no `pytest-playwright`, no test-only login bypass |

## Backend

### New `backend/auth.py` (only file that knows about Auth0)

- `load_dotenv()` at import time (python-dotenv), so `.env` next to `pyproject.toml` is read.
- `load_settings()` reads `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`,
  `SESSION_SECRET` from `os.environ` only. If any is missing or empty it raises
  `RuntimeError` naming the missing variables, in Spanish. Called once at import,
  so the app refuses to start without config.
- Authlib `OAuth` client `auth0`, registered with
  `server_metadata_url=https://{AUTH0_DOMAIN}/.well-known/openid-configuration`
  and `scope="openid profile email"`.
- `router` (no prefix):
  - `GET /login` → `authorize_redirect` to `request.url_for("callback")`, with `connection="google-oauth2"`.
  - `GET /callback` → `authorize_access_token`; stores `{"sub", "name", "email"}` from `userinfo` in `request.session["user"]`; `302` to `/`. On an Authlib `OAuthError` (user cancelled, state mismatch) it returns `400` with a short Spanish message and a link to `/login`.
  - `GET /logout` → `request.session.clear()`; `302` to `https://{AUTH0_DOMAIN}/v2/logout?client_id=...&returnTo=<base url>`.
- `require_login` HTTP middleware:
  - Paths `/login`, `/callback`, `/logout` pass through.
  - No `request.session.get("user")`: `/api/*` → `401 {"detail": "Tenés que iniciar sesión."}`; any other path → `302 /login`.
  - Otherwise pass through.

### `backend/main.py`

- Middleware order: `require_login` added first, `SessionMiddleware(secret_key=SESSION_SECRET)` added second. Starlette runs the last-added middleware outermost, so the session is populated before `require_login` reads it.
- `app.include_router(auth_router)` goes before the static mount (the mount at `/` swallows anything registered after it).
- Lifespan and seed unchanged.

### `backend/db.py`

- The engine URL comes from `DATABASE_URL`, defaulting to `sqlite:///<repo>/scores.db`. This is the only change, and it exists so tests can point at a temp database before importing the app.

### Unchanged

`routes.py`, `schemas.py`, `models.py`. No schema change; no need to delete `scores.db`.

### Dependencies

Runtime: `authlib`, `itsdangerous`, `python-dotenv` (`httpx` already comes with `fastapi[standard]`).
Dev (`[dependency-groups] dev`): `pytest`.

## Frontend

- `index.html`, `game.html`: `<a href="/logout" class="logout-link">Cerrar sesión</a>` in `site-header`.
- `js/api.js`: in `request()`, a `401` sets `window.location.href = "/login"` and throws the usual `Error`.
- `css/styles.css`: `.logout-link` aligned right in the header.
- Out of scope: showing the user's name, `/api/me`, pre-filling the name field.

## Configuration

- `.env.example` (committed): the four variable names, empty values.
- `.gitignore`: add `.env`. The course repo is public.
- Auth0 dashboard (manual, documented in README): Regular Web Application; Allowed Callback URLs `http://127.0.0.1:8000/callback` (plus `:8765` if used); Allowed Logout URLs `http://127.0.0.1:8000`; `google-oauth2` connection enabled for the app.

## Tests (pytest)

`tests/conftest.py`:
- Before importing the app, sets `DATABASE_URL` to a temp-file SQLite and the four Auth0/session variables to dummy values (so a developer's real `.env` never leaks into tests; `load_dotenv` does not override existing variables).
- Monkeypatches `oauth.auth0.load_server_metadata` to return a fixed metadata dict (so no network call), and `oauth.auth0.authorize_access_token` to return a fake `userinfo`.
- Fixtures: `client` (anonymous `TestClient`, `follow_redirects=False`) and `logged_in_client` (goes through `/callback` once so the session cookie is set).

`tests/test_auth.py`:
- Anonymous: `/` and `/game.html?game=snake` → `302 /login`; `/api/games` → `401` with the Spanish detail.
- `/login` → `302` to `https://<domain>/authorize?...` containing `connection=google-oauth2`.
- `/callback` → `302 /`, then `/api/games` → `200`.
- `/callback` when `authorize_access_token` raises `OAuthError` → `400`.
- `/logout` → `302` to `https://<domain>/v2/logout` with `returnTo`; afterwards `/api/games` → `401`.
- `load_settings()` with a variable removed → `RuntimeError` naming it.

`tests/test_scores.py` (logged in): the existing contract still holds, meaning `GET` scores ordered `points desc, created_at asc`, `POST` → `201` with UTC `created_at`, unknown slug → `404`, empty name / negative points / `limit` out of range → `422`.

Run: `uv run pytest`.

## Browser verification (Playwright MCP, manual)

1. Anonymous visit to `/` lands on Auth0 → Google.
2. User completes the real Google login once (needs a real tenant in `.env`).
3. Catalog loads; play Snake; save a score; ranking shows it.
4. "Cerrar sesión" → Auth0 logout → back to login.

## Docs (same commit as the code they describe)

- `README.md`: "Cómo se ejecuta" (Auth0 setup, `.env`, `SESSION_SECRET` one-liner, `uv run pytest`) replaces "No hay variables de entorno"; tree adds `auth.py`, `tests/`, `.env.example`; endpoints table adds `/login`, `/callback`, `/logout` and `401` on every `/api` row; "Qué decidí yo" gets entries for server-side session vs SPA+JWT and for adding tests.
- `CLAUDE.md` (tp-final root): env vars, `uv run pytest`, drop the "no tests" line, middleware order.
- `backend/CLAUDE.md`: `auth.py` in the layers table, middleware order, route-before-mount now also covers the auth router, "Probar a mano" (curl now gets `401`; use the browser or pytest).
- `frontend/CLAUDE.md`: `401` handling in `api.js`, logout link.
- `docs/plan.md`: not touched (frozen on purpose).

## Git

Branch `feature/auth0-login` in the course repo. Commits in Spanish, one per working piece, each carrying its own doc updates:
1. backend auth + config + tests (+ README/CLAUDE.md backend parts),
2. frontend logout + 401 handling (+ `frontend/CLAUDE.md`, README bits).
