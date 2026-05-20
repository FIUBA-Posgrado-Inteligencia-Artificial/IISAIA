# Semana 04 Parte 2 — Rediseño Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir §7–§13 de Semana 04, crear el repo demo FastAPI en `semanas/04/demo-repo/`, y actualizar spine + index. Salida final: source_material listo para que `/build-class` regenere los slides.

**Architecture:** Tres entregables encadenados: (1) repo demo standalone con backend FastAPI + frontend chico + tests + `.claude/` completo; (2) siete archivos de source_material reescritos siguiendo plantilla documentation-walkthrough con ejemplos del demo-repo; (3) spine.md actualizado + rename `12-trabajo-final.md → 14-trabajo-final.md`. Los slides los regenera el pipeline `slide-generation` después de este plan.

**Tech Stack:** Python 3.11+, FastAPI, uvicorn, pytest, uv (package manager). Frontend: HTML + vanilla JS + CSS, sin build step. Docs: markdown.

**Spec base:** `docs/superpowers/specs/2026-05-19-semana-04-parte2-redesign-design.md`

---

## Phase A — Demo repo: infraestructura

### Task 1: Crear skeleton del demo-repo

**Files:**
- Create: `semanas/04/demo-repo/README.md`
- Create: `semanas/04/demo-repo/.gitignore`
- Create: `semanas/04/demo-repo/.env.example`
- Create: `semanas/04/demo-repo/pyproject.toml`
- Create: `semanas/04/demo-repo/backend/__init__.py`
- Create: `semanas/04/demo-repo/backend/routers/__init__.py`
- Create: `semanas/04/demo-repo/backend/middleware/__init__.py`
- Create: `semanas/04/demo-repo/backend/schemas/__init__.py`
- Create: `semanas/04/demo-repo/backend/db/__init__.py`
- Create: `semanas/04/demo-repo/tests/__init__.py`
- Create: `semanas/04/demo-repo/frontend/.gitkeep`

- [ ] **Step 1: Verify parent directory existe**

Run: `ls semanas/04/`
Expected: lista que contiene `source_material`, `spine.md`, etc. (no `demo-repo/` todavía).

- [ ] **Step 2: Crear estructura de directorios**

```bash
mkdir -p semanas/04/demo-repo/backend/routers
mkdir -p semanas/04/demo-repo/backend/middleware
mkdir -p semanas/04/demo-repo/backend/schemas
mkdir -p semanas/04/demo-repo/backend/db
mkdir -p semanas/04/demo-repo/frontend
mkdir -p semanas/04/demo-repo/tests
```

- [ ] **Step 3: Crear `pyproject.toml`**

```toml
[project]
name = "demo-repo"
version = "0.1.0"
description = "Demo repo para Semana 04 — Claude Code runtime features"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.110",
    "uvicorn[standard]>=0.27",
    "pydantic>=2.6",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "httpx>=0.27",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]
```

- [ ] **Step 4: Crear `.gitignore`**

```
__pycache__/
*.pyc
.venv/
.env
.pytest_cache/
*.egg-info/
.claude/settings.local.json
```

- [ ] **Step 5: Crear `.env.example`**

```
# API auth
DEMO_BEARER_TOKEN=changeme-in-real-env
```

- [ ] **Step 6: Crear `README.md`**

```markdown
# demo-repo — Semana 04

Repo de demostración para la Parte 2 de la Semana 04: features del runtime
de Claude Code (CLAUDE.md, rules, settings.json, permisos, skills, sub-agents,
plan mode).

## Stack
- Backend: FastAPI
- Frontend: HTML + vanilla JS
- Tests: pytest + httpx
- Package manager: uv

## Setup
```
uv sync
cp .env.example .env
```

## Run
```
uv run uvicorn backend.main:app --reload
```
Abrir `frontend/index.html` en el navegador.

## Test
```
uv run pytest
```
```

- [ ] **Step 7: Crear archivos `__init__.py` vacíos**

Crear archivos vacíos en `backend/`, `backend/routers/`, `backend/middleware/`, `backend/schemas/`, `backend/db/`, `tests/`. Crear `frontend/.gitkeep` placeholder.

- [ ] **Step 8: Commit**

```bash
git add semanas/04/demo-repo/
git commit -m "feat(s04 demo-repo): skeleton inicial (FastAPI + pytest)"
```

---

### Task 2: Schemas y store en memoria

**Files:**
- Create: `semanas/04/demo-repo/backend/schemas/models.py`
- Create: `semanas/04/demo-repo/backend/db/client.py`

- [ ] **Step 1: Schemas Pydantic**

Create `backend/schemas/models.py`:

```python
from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: str


class User(UserCreate):
    id: int
    created_at: datetime


class PostCreate(BaseModel):
    title: str
    body: str
    author_id: int


class Post(PostCreate):
    id: int
    created_at: datetime
```

- [ ] **Step 2: Store en memoria**

Create `backend/db/client.py`:

```python
from datetime import datetime, timezone
from typing import Optional
from backend.schemas.models import User, UserCreate, Post, PostCreate


class InMemoryStore:
    def __init__(self):
        self.users: dict[int, User] = {}
        self.posts: dict[int, Post] = {}
        self._user_seq = 0
        self._post_seq = 0

    def create_user(self, data: UserCreate) -> User:
        self._user_seq += 1
        user = User(id=self._user_seq, created_at=datetime.now(timezone.utc), **data.model_dump())
        self.users[user.id] = user
        return user

    def get_user(self, user_id: int) -> Optional[User]:
        return self.users.get(user_id)

    def list_users(self) -> list[User]:
        return list(self.users.values())

    def create_post(self, data: PostCreate) -> Optional[Post]:
        if data.author_id not in self.users:
            return None
        self._post_seq += 1
        post = Post(id=self._post_seq, created_at=datetime.now(timezone.utc), **data.model_dump())
        self.posts[post.id] = post
        return post

    def get_post(self, post_id: int) -> Optional[Post]:
        return self.posts.get(post_id)

    def list_posts(self) -> list[Post]:
        return list(self.posts.values())


store = InMemoryStore()
```

- [ ] **Step 3: Commit**

```bash
git add semanas/04/demo-repo/backend/schemas/ semanas/04/demo-repo/backend/db/
git commit -m "feat(s04 demo-repo): schemas Pydantic + store en memoria"
```

---

### Task 3: Middleware de auth bearer

**Files:**
- Create: `semanas/04/demo-repo/backend/middleware/auth.py`

- [ ] **Step 1: Implementar dependency de auth**

Create `backend/middleware/auth.py`:

```python
import os
from fastapi import Header, HTTPException, status


def require_bearer(authorization: str | None = Header(default=None)) -> None:
    expected = os.getenv("DEMO_BEARER_TOKEN", "changeme-in-real-env")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    if token != expected:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="invalid bearer token")
```

- [ ] **Step 2: Commit**

```bash
git add semanas/04/demo-repo/backend/middleware/
git commit -m "feat(s04 demo-repo): bearer-token auth dependency"
```

---

### Task 4: Routers users y posts (TDD)

**Files:**
- Create: `semanas/04/demo-repo/backend/routers/users.py`
- Create: `semanas/04/demo-repo/backend/routers/posts.py`
- Create: `semanas/04/demo-repo/backend/main.py`
- Create: `semanas/04/demo-repo/tests/test_users.py`
- Create: `semanas/04/demo-repo/tests/test_posts.py`

- [ ] **Step 1: Tests primero — `tests/test_users.py`**

```python
import os
import pytest
from fastapi.testclient import TestClient

os.environ["DEMO_BEARER_TOKEN"] = "test-token"

from backend.main import app
from backend.db.client import store


@pytest.fixture(autouse=True)
def reset_store():
    store.users.clear()
    store.posts.clear()
    store._user_seq = 0
    store._post_seq = 0
    yield


client = TestClient(app)
headers = {"Authorization": "Bearer test-token"}


def test_list_users_empty():
    r = client.get("/users")
    assert r.status_code == 200
    assert r.json() == []


def test_create_user_requires_auth():
    r = client.post("/users", json={"name": "Ana", "email": "ana@example.com"})
    assert r.status_code == 401


def test_create_user_ok():
    r = client.post("/users", json={"name": "Ana", "email": "ana@example.com"}, headers=headers)
    assert r.status_code == 201
    body = r.json()
    assert body["id"] == 1
    assert body["name"] == "Ana"


def test_get_user_by_id():
    client.post("/users", json={"name": "Ana", "email": "ana@example.com"}, headers=headers)
    r = client.get("/users/1")
    assert r.status_code == 200
    assert r.json()["name"] == "Ana"


def test_get_user_not_found():
    r = client.get("/users/999")
    assert r.status_code == 404
```

- [ ] **Step 2: Tests `tests/test_posts.py`**

```python
import os
import pytest
from fastapi.testclient import TestClient

os.environ["DEMO_BEARER_TOKEN"] = "test-token"

from backend.main import app
from backend.db.client import store


@pytest.fixture(autouse=True)
def reset_store():
    store.users.clear()
    store.posts.clear()
    store._user_seq = 0
    store._post_seq = 0
    yield


client = TestClient(app)
headers = {"Authorization": "Bearer test-token"}


def test_create_post_requires_existing_author():
    r = client.post("/posts", json={"title": "Hola", "body": "Mundo", "author_id": 1}, headers=headers)
    assert r.status_code == 404


def test_create_post_ok():
    client.post("/users", json={"name": "Ana", "email": "ana@example.com"}, headers=headers)
    r = client.post("/posts", json={"title": "Hola", "body": "Mundo", "author_id": 1}, headers=headers)
    assert r.status_code == 201
    assert r.json()["id"] == 1


def test_list_posts():
    client.post("/users", json={"name": "Ana", "email": "ana@example.com"}, headers=headers)
    client.post("/posts", json={"title": "Hola", "body": "Mundo", "author_id": 1}, headers=headers)
    r = client.get("/posts")
    assert r.status_code == 200
    assert len(r.json()) == 1
```

- [ ] **Step 3: Correr tests, ver que fallan**

Run: `cd semanas/04/demo-repo && uv run pytest -v`
Expected: FAIL (no existe `backend.main`).

- [ ] **Step 4: Router `backend/routers/users.py`**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from backend.db.client import store
from backend.middleware.auth import require_bearer
from backend.schemas.models import User, UserCreate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[User])
def list_users():
    return store.list_users()


@router.post("", response_model=User, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_bearer)])
def create_user(payload: UserCreate):
    return store.create_user(payload)


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int):
    user = store.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="user not found")
    return user
```

- [ ] **Step 5: Router `backend/routers/posts.py`**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from backend.db.client import store
from backend.middleware.auth import require_bearer
from backend.schemas.models import Post, PostCreate

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("", response_model=list[Post])
def list_posts():
    return store.list_posts()


@router.post("", response_model=Post, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_bearer)])
def create_post(payload: PostCreate):
    post = store.create_post(payload)
    if post is None:
        raise HTTPException(status_code=404, detail="author not found")
    return post


@router.get("/{post_id}", response_model=Post)
def get_post(post_id: int):
    post = store.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="post not found")
    return post
```

- [ ] **Step 6: App principal `backend/main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users, posts

app = FastAPI(title="demo-repo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(posts.router)


@app.get("/")
def root():
    return {"name": "demo-repo", "version": "0.1.0"}
```

- [ ] **Step 7: Correr tests, ver que pasan**

Run: `cd semanas/04/demo-repo && uv sync && uv run pytest -v`
Expected: 7 PASS, 0 FAIL.

- [ ] **Step 8: Commit**

```bash
git add semanas/04/demo-repo/backend/ semanas/04/demo-repo/tests/
git commit -m "feat(s04 demo-repo): routers users/posts con tests (TDD)"
```

---

### Task 5: Frontend mínimo

**Files:**
- Create: `semanas/04/demo-repo/frontend/index.html`
- Create: `semanas/04/demo-repo/frontend/app.js`
- Create: `semanas/04/demo-repo/frontend/styles.css`
- Delete: `semanas/04/demo-repo/frontend/.gitkeep`

- [ ] **Step 1: `frontend/index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>demo-repo</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>
    <h1>demo-repo</h1>
    <section>
      <h2>Users</h2>
      <ul id="user-list"></ul>
      <form id="user-form">
        <input name="name" placeholder="Name" required>
        <input name="email" type="email" placeholder="Email" required>
        <input name="token" placeholder="Bearer token">
        <button type="submit">Create user</button>
      </form>
    </section>
    <section>
      <h2>Posts</h2>
      <ul id="post-list"></ul>
      <form id="post-form">
        <input name="title" placeholder="Title" required>
        <textarea name="body" placeholder="Body" required></textarea>
        <input name="author_id" type="number" placeholder="Author ID" required>
        <input name="token" placeholder="Bearer token">
        <button type="submit">Create post</button>
      </form>
    </section>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: `frontend/app.js`**

```javascript
const API = "http://localhost:8000";

async function refreshUsers() {
  const r = await fetch(`${API}/users`);
  const data = await r.json();
  document.querySelector("#user-list").innerHTML =
    data.map(u => `<li>#${u.id} — ${u.name} (${u.email})</li>`).join("");
}

async function refreshPosts() {
  const r = await fetch(`${API}/posts`);
  const data = await r.json();
  document.querySelector("#post-list").innerHTML =
    data.map(p => `<li>#${p.id} — ${p.title} (author ${p.author_id})</li>`).join("");
}

function bindForm(formId, path, refresh) {
  document.querySelector(formId).addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const token = form.get("token");
    form.delete("token");
    const payload = Object.fromEntries(form.entries());
    if (payload.author_id) payload.author_id = Number(payload.author_id);
    const r = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!r.ok) alert(`Error ${r.status}: ${await r.text()}`);
    else { e.target.reset(); refresh(); }
  });
}

bindForm("#user-form", "/users", refreshUsers);
bindForm("#post-form", "/posts", refreshPosts);
refreshUsers();
refreshPosts();
```

- [ ] **Step 3: `frontend/styles.css`**

```css
body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
section { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 6px; }
form { display: grid; gap: .5rem; margin-top: 1rem; }
input, textarea, button { padding: .5rem; font-size: 1rem; }
ul { list-style: none; padding: 0; }
li { padding: .25rem 0; border-bottom: 1px solid #eee; }
```

- [ ] **Step 4: Eliminar el placeholder**

```bash
rm semanas/04/demo-repo/frontend/.gitkeep
```

- [ ] **Step 5: Commit**

```bash
git add semanas/04/demo-repo/frontend/
git commit -m "feat(s04 demo-repo): frontend HTML+JS para interactuar con la API"
```

---

### Task 6: `openapi.yaml` exportado del FastAPI

**Files:**
- Create: `semanas/04/demo-repo/openapi.yaml`
- Create: `semanas/04/demo-repo/scripts/export_openapi.py`

- [ ] **Step 1: Crear directorio scripts**

```bash
mkdir -p semanas/04/demo-repo/scripts
```

- [ ] **Step 2: Script exportador**

Create `scripts/export_openapi.py`:

```python
"""Export the FastAPI schema to openapi.yaml.

Usage: uv run python scripts/export_openapi.py
"""
import yaml
from backend.main import app

if __name__ == "__main__":
    schema = app.openapi()
    with open("openapi.yaml", "w", encoding="utf-8") as f:
        yaml.safe_dump(schema, f, sort_keys=False, allow_unicode=True)
    print("openapi.yaml updated")
```

- [ ] **Step 3: Agregar PyYAML a deps de dev en `pyproject.toml`**

Edit `pyproject.toml`, sección `[project.optional-dependencies] dev`, agregar `"pyyaml>=6.0"`. Resultado:

```toml
dev = [
    "pytest>=8.0",
    "httpx>=0.27",
    "pyyaml>=6.0",
]
```

- [ ] **Step 4: Correr el script y generar `openapi.yaml`**

```bash
cd semanas/04/demo-repo
uv sync --extra dev
uv run python scripts/export_openapi.py
```
Expected: archivo `openapi.yaml` creado con paths para `/`, `/users`, `/users/{user_id}`, `/posts`, `/posts/{post_id}`.

- [ ] **Step 5: Verificar contenido del openapi**

Run: `head -30 semanas/04/demo-repo/openapi.yaml`
Expected: empieza con `openapi: 3.x.y`, `info:` con title `demo-repo API`, `paths:` con los 5 endpoints.

- [ ] **Step 6: Commit**

```bash
git add semanas/04/demo-repo/openapi.yaml semanas/04/demo-repo/scripts/ semanas/04/demo-repo/pyproject.toml
git commit -m "feat(s04 demo-repo): openapi.yaml exportado + script de export"
```

---

### Task 7: Verificación end-to-end del demo-repo

- [ ] **Step 1: Tests pasan**

Run: `cd semanas/04/demo-repo && uv run pytest -v`
Expected: 7 PASS.

- [ ] **Step 2: Servidor arranca**

Run en una terminal aparte (o `run_in_background`): `cd semanas/04/demo-repo && uv run uvicorn backend.main:app --port 8000`
Expected: `Application startup complete`.

- [ ] **Step 3: Smoke test con curl**

```bash
curl -s http://localhost:8000/users
curl -s -H "Authorization: Bearer changeme-in-real-env" -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@example.com"}' http://localhost:8000/users
curl -s http://localhost:8000/users/1
```
Expected: `[]`, luego el user creado con id 1, luego ese user de vuelta.

- [ ] **Step 4: Matar el servidor**

Detener el background process del Step 2.

- [ ] **Step 5: No hay archivos sin commitear**

Run: `git status semanas/04/demo-repo/`
Expected: working tree clean (a menos que el openapi se regenere distinto — si pasa, commitear el cambio).

---

## Phase B — Demo repo: `.claude/`

### Task 8: `CLAUDE.md` del demo-repo

**Files:**
- Create: `semanas/04/demo-repo/CLAUDE.md`

- [ ] **Step 1: Escribir `CLAUDE.md` del demo-repo**

```markdown
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

- Cambios en endpoints → regenerar `openapi.yaml` con `uv run python scripts/export_openapi.py`.
- Antes de un PR, correr `uv run pytest` y verificar que pasa.
- `settings.local.json` siempre al `.gitignore` (ya está).
```

- [ ] **Step 2: Commit**

```bash
git add semanas/04/demo-repo/CLAUDE.md
git commit -m "feat(s04 demo-repo): CLAUDE.md raíz"
```

---

### Task 9: Rules en `.claude/rules/`

**Files:**
- Create: `semanas/04/demo-repo/.claude/rules/code-style.md`
- Create: `semanas/04/demo-repo/.claude/rules/testing.md`
- Create: `semanas/04/demo-repo/.claude/rules/security.md`
- Create: `semanas/04/demo-repo/.claude/rules/api.md`

- [ ] **Step 1: `code-style.md` (siempre cargada)**

```markdown
# Code style

- Líneas <100 caracteres.
- Funciones <50 líneas; si una crece, extraé helpers.
- Imports en orden: stdlib → terceros → proyecto. Una línea en blanco entre grupos.
- Strings con doble comilla por default.
- Sin `print()` en producción; usá `logging` si hace falta debug.
```

- [ ] **Step 2: `testing.md` (siempre cargada)**

```markdown
# Testing

- Todo endpoint público necesita al menos un test de happy path y uno de error esperado.
- Tests usan `TestClient` de FastAPI + fixture `reset_store` autouse.
- Nombres: `test_<funcion>_<situacion>` — `test_create_user_ok`, `test_get_user_not_found`.
- No mockear el store en memoria — es el comportamiento real que queremos verificar.
```

- [ ] **Step 3: `security.md` (siempre cargada)**

```markdown
# Security

- Nunca hardcodear el bearer token. Leerlo de `os.getenv("DEMO_BEARER_TOKEN")`.
- No loggear el contenido del header `Authorization`.
- `.env` siempre al `.gitignore`. Versionamos solo `.env.example`.
- No exponer trazas internas en respuestas de error. `HTTPException` con detail genérico.
```

- [ ] **Step 4: `api.md` (path-scoped, condicional)**

```markdown
---
paths:
  - "backend/**/*.py"
---

# API conventions

Cuando trabajes con código del backend:

- Cada endpoint declara su `response_model` y `status_code` explícito.
- Para endpoints con escritura (POST, PUT, DELETE), agregar `dependencies=[Depends(require_bearer)]`.
- Si tocás un endpoint o agregás uno nuevo, regenerar `openapi.yaml` con
  `uv run python scripts/export_openapi.py` y commitear el cambio en el mismo PR.
- Errores que vuelven al cliente: `HTTPException` con código HTTP correcto (`404` para no encontrado,
  `401` para falta de auth, `403` para auth inválida).
```

- [ ] **Step 5: Crear directorio si hace falta**

```bash
mkdir -p semanas/04/demo-repo/.claude/rules
```

- [ ] **Step 6: Commit**

```bash
git add semanas/04/demo-repo/.claude/rules/
git commit -m "feat(s04 demo-repo): .claude/rules — 3 siempre cargadas + 1 path-scoped"
```

---

### Task 10: `settings.json` del demo-repo

**Files:**
- Create: `semanas/04/demo-repo/.claude/settings.json`
- Create: `semanas/04/demo-repo/.claude/settings.local.json.example`

- [ ] **Step 1: `.claude/settings.json` (project, versionado)**

```json
{
  "model": "claude-sonnet-4-6",
  "env": {
    "DEMO_BEARER_TOKEN": "changeme-in-real-env"
  },
  "includeCoAuthoredBy": true,
  "cleanupPeriodDays": 30,
  "permissions": {
    "allow": [
      "Bash(uv run pytest)",
      "Bash(uv run pytest *)",
      "Bash(uv run uvicorn *)",
      "Bash(uv run python *)",
      "Bash(uv sync)",
      "Bash(uv sync *)",
      "Read(./**)",
      "Edit(./backend/**)",
      "Edit(./frontend/**)",
      "Edit(./tests/**)",
      "Edit(./openapi.yaml)",
      "WebFetch(domain:fastapi.tiangolo.com)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(rm -rf *)",
      "Bash(git push *)"
    ],
    "ask": [
      "Bash(uv add *)",
      "Bash(uv remove *)"
    ]
  }
}
```

- [ ] **Step 2: `.claude/settings.local.json.example` como referencia**

```json
{
  "permissions": {
    "allow": [
      "Bash(open http://localhost:8000)"
    ]
  }
}
```

(El archivo real `.claude/settings.local.json` está en `.gitignore`. Este `.example` es la referencia para quien clone el repo.)

- [ ] **Step 3: Verificar que `.gitignore` ignora `settings.local.json`**

Confirmar que `semanas/04/demo-repo/.gitignore` contiene `.claude/settings.local.json` (ya agregado en Task 1).

- [ ] **Step 4: Commit**

```bash
git add semanas/04/demo-repo/.claude/settings.json semanas/04/demo-repo/.claude/settings.local.json.example
git commit -m "feat(s04 demo-repo): .claude/settings.json con permissions completo"
```

---

### Task 11: Skill + slash command

**Files:**
- Create: `semanas/04/demo-repo/.claude/skills/add-endpoint/SKILL.md`
- Create: `semanas/04/demo-repo/.claude/commands/add-endpoint.md`

- [ ] **Step 1: Crear directorios**

```bash
mkdir -p semanas/04/demo-repo/.claude/skills/add-endpoint
mkdir -p semanas/04/demo-repo/.claude/commands
```

- [ ] **Step 2: `SKILL.md`**

```markdown
---
name: add-endpoint
description: Use when the user asks to add a new REST endpoint to the demo-repo backend. Adds the route, the schema if missing, the test, and regenerates openapi.yaml.
---

# add-endpoint

Procedimiento para agregar un endpoint nuevo al backend con su test y la
regeneración de la especificación OpenAPI.

## Fases

1. **Decidir verbo y path**
   - Confirmar con el usuario verbo HTTP, path y body si aplica.
   - Para escritura (POST/PUT/DELETE), agregar `dependencies=[Depends(require_bearer)]`.

2. **Schemas**
   - Si el endpoint usa un body o response no existente, agregar el modelo en
     `backend/schemas/models.py`.

3. **Router**
   - Agregar la función en el router correspondiente (`backend/routers/<resource>.py`).
   - Declarar `response_model` y `status_code` explícito.

4. **Test**
   - Agregar al menos dos tests en `tests/test_<resource>.py`: happy path + error
     esperado (404, 401, o similar).
   - Usar el fixture `reset_store` y el cliente `TestClient` ya configurados.

5. **OpenAPI**
   - Correr `uv run python scripts/export_openapi.py` para regenerar `openapi.yaml`.
   - Verificar que el endpoint nuevo aparece en el schema.

6. **Verificación**
   - `uv run pytest -v` debe pasar entero.
   - Mostrar al usuario el diff del openapi.yaml.

## Anti-patterns

- Crear el endpoint sin test.
- Olvidar regenerar `openapi.yaml`.
- Dejar el endpoint sin `response_model` (perdés la validación de salida).
- Hardcodear constantes que pertenecen a `models.py` o a una env var.
```

- [ ] **Step 3: Slash command `.claude/commands/add-endpoint.md`**

```markdown
---
description: Agregá un endpoint nuevo siguiendo la skill add-endpoint
---

El usuario quiere agregar un endpoint al backend del demo-repo. Invocá la skill
`add-endpoint` y seguí sus fases.

Si el usuario no especificó verbo, path o body, preguntale antes de empezar.
```

- [ ] **Step 4: Commit**

```bash
git add semanas/04/demo-repo/.claude/skills/ semanas/04/demo-repo/.claude/commands/
git commit -m "feat(s04 demo-repo): skill add-endpoint + slash command /add-endpoint"
```

---

### Task 12: Sub-agent `researcher`

**Files:**
- Create: `semanas/04/demo-repo/.claude/agents/researcher.md`

- [ ] **Step 1: Crear directorio**

```bash
mkdir -p semanas/04/demo-repo/.claude/agents
```

- [ ] **Step 2: `researcher.md`**

```markdown
---
name: researcher
description: Use when the user asks where something is implemented, how a concept is wired across files, or any exploratory question that requires reading many files. Returns a concise answer; does not modify code.
tools:
  - Read
  - Grep
  - Glob
---

Sos un investigador de código de solo-lectura del demo-repo.

Cuando recibís una pregunta exploratoria ("¿dónde se maneja X?", "¿cómo se
conecta Y con Z?"), tu trabajo es:

1. Buscar con `Grep` y `Glob` los archivos relevantes.
2. Leer con `Read` los archivos necesarios para confirmar la respuesta.
3. Devolver una respuesta corta: dónde está, en qué función/línea, una frase de
   cómo se conecta con el resto.

No edites código. No corras comandos. No describas tu razonamiento — devolvé el
resultado directo.
```

- [ ] **Step 3: Commit**

```bash
git add semanas/04/demo-repo/.claude/agents/
git commit -m "feat(s04 demo-repo): sub-agent researcher read-only"
```

---

### Task 13: Verificación final del demo-repo

- [ ] **Step 1: Estructura del `.claude/` completa**

Run: `find semanas/04/demo-repo/.claude -type f`
Expected: 4 rules, 1 settings.json, 1 settings.local.json.example, 1 SKILL.md, 1 slash command, 1 agents.

- [ ] **Step 2: Tests siguen pasando**

Run: `cd semanas/04/demo-repo && uv run pytest -v`
Expected: 7 PASS.

- [ ] **Step 3: JSON / YAML válidos**

```bash
cd semanas/04/demo-repo
python -c "import json; json.load(open('.claude/settings.json'))"
python -c "import yaml; yaml.safe_load(open('openapi.yaml'))"
```
Expected: ningún error.

- [ ] **Step 4: Working tree limpio**

Run: `git status semanas/04/demo-repo/`
Expected: clean.

---

## Phase C — Source material rewrite

Cada archivo en esta fase sigue la **plantilla documentation-walkthrough** del spec:
1. Qué es
2. Dónde vive
3. Cuándo se carga / se aplica
4. Cómo se usa (con ejemplos del `demo-repo/`)
5. Casos límite / cosas que confunden
6. Mini-demo en vivo (un solo bloque al final)

**Estilo obligatorio para todos los archivos:**
- Argentine Spanish, voz directa.
- Inglés para términos técnicos: status code, path, schema, method, controller, frontmatter, glob, bearer, etc.
- Prohibidos: "payoff", "vibe coding", "diplomatura", "bisagra", "esta clase / esta semana", "scaffolding / andamiaje".
- No bullet-list slides (escribir prosa que un slide pueda visualizar con tablas / code blocks / jerarquías).
- Cada cita verbatim de docs lleva URL al pie: `https://code.claude.com/docs/en/<page>`.
- Largo objetivo: ~100–180 líneas por archivo.

**Cierre de cada archivo (transición):** después de la sección §6 (mini-demo), agregar un párrafo final corto (1–3 oraciones) que conecte con la siguiente sección. Ese párrafo es lo que el pipeline `slide-generation` usa para generar el slide de transición entre secciones. Las transiciones canónicas vienen del spec (sección "Transiciones entre secciones") — usar esas líneas como semilla.

---

### Task 14: `07-CLAUDE-md.md` (rewrite del existente)

**Files:**
- Modify: `semanas/04/source_material/07-CLAUDE-md-jerarquico.md` → renombrar a `07-CLAUDE-md.md` y reescribir
- Reference: `docs/superpowers/specs/2026-05-19-semana-04-parte2-redesign-design.md` (sección §7)

- [ ] **Step 1: Renombrar el archivo**

```bash
git mv semanas/04/source_material/07-CLAUDE-md-jerarquico.md semanas/04/source_material/07-CLAUDE-md.md
```

- [ ] **Step 2: Reemplazar el contenido siguiendo plantilla**

Reescribir el archivo desde cero con las 6 secciones obligatorias. Contenido mínimo obligatorio por sección:

- **§1 Qué es** — definir CLAUDE.md como archivo markdown leído en cada sesión antes del primer mensaje; texto del profesor inyectado en la ventana de contexto. Una línea.
- **§2 Dónde vive** — los 4 niveles concatenados (managed policy con rutas por OS, user `~/.claude/CLAUDE.md`, project `./CLAUDE.md` o `./.claude/CLAUDE.md`, local `./CLAUDE.local.md`). Tabla.
- **§3 Cuándo se carga** — arranque de cada sesión. Caminata hacia arriba desde el CWD recolectando cada CLAUDE.md. CLAUDE.md de subdirectorios se cargan bajo demanda al leer archivos de ese subdir.
- **§4 Cómo se usa** — sintaxis `@ruta/al/archivo` para imports, recursivo hasta 5 niveles, comentarios HTML descartados, recomendación <200 líneas. Ejemplo concreto: el `CLAUDE.md` del demo-repo (folder map + convenciones + workflow).
- **§5 Casos límite** — contradicciones entre niveles ≠ error (comportamiento impredecible), `@import` NO ahorra contexto, **auto memory** como sistema distinto: `~/.claude/projects/<project>/memory/`, primeras 200 líneas o 25 KB, lo escribe Claude, auditable con `/memory`.
- **§6 Mini-demo** — único bloque al final. Abrir el repo demo, ejecutar `/memory`, mostrar la lista de fuentes cargadas (user + project), ejecutar `/context` si disponible, mostrar el delta de la ventana atribuible a CLAUDE.md. Mostrar carpeta de auto memory. Plan B si `/context` no da detalle.

URLs requeridas en citas verbatim: `https://code.claude.com/docs/en/memory`.

- [ ] **Step 3: Verificar largo y prohibidos**

```bash
wc -l semanas/04/source_material/07-CLAUDE-md.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje" semanas/04/source_material/07-CLAUDE-md.md
```
Expected: largo entre 100 y 200 líneas. Grep: sin matches.

- [ ] **Step 4: Commit**

```bash
git add semanas/04/source_material/07-CLAUDE-md.md
git commit -m "docs(s04 §7): reescribir CLAUDE.md con plantilla documentation-walkthrough"
```

---

### Task 15: `08-rules.md` (rewrite)

**Files:**
- Modify: `semanas/04/source_material/08-rules-y-auto-memory.md` → renombrar a `08-rules.md` y reescribir (sin auto memory — esa va a §7)

- [ ] **Step 1: Renombrar**

```bash
git mv semanas/04/source_material/08-rules-y-auto-memory.md semanas/04/source_material/08-rules.md
```

- [ ] **Step 2: Reescribir siguiendo plantilla**

Contenido obligatorio:

- **§1 Qué es** — archivos `.md` modulares de instrucciones, organizables por tema; el siguiente paso después de un CLAUDE.md monolítico.
- **§2 Dónde viven** — `.claude/rules/` (proyecto, versionado), `~/.claude/rules/` (user, todos los proyectos), subdirectorios descubiertos recursivamente.
- **§3 Cuándo se cargan** — sin frontmatter = arranque (igual que CLAUDE.md), con frontmatter `paths: [...]` y globs = path-scoped, solo cuando Claude toca un archivo que matchea.
- **§4 Cómo se usan** — ejemplos concretos del demo-repo: `.claude/rules/code-style.md`, `testing.md`, `security.md`, `api.md` (este último con `paths: ["backend/**/*.py"]`). Sintaxis del frontmatter YAML. Globs soportados (`**/*.py`, expansión de llaves).
- **§5 Casos límite** — **NO es `.cursorrules`** (mecanismo distinto). Sin `paths:` cuestan contexto igual que CLAUDE.md — ventaja es organizativa. El trigger es **leer un archivo que matchea**, no cualquier tool sobre cualquier archivo.
- **§6 Mini-demo** — mostrar el árbol `.claude/rules/` con los 4 archivos. Abrir `api.md` con frontmatter. Ejecutar `/memory` (no aparece). Pedirle a Claude que lea archivo de `frontend/` (sigue sin aparecer). Pedirle que lea `backend/routers/users.py` (ahora aparece). Plan B por comportamiento.

URLs requeridas: doc oficial de rules (page específica de docs/memory si la hay, sino `https://code.claude.com/docs/en/memory`).

- [ ] **Step 3: Verificación**

```bash
wc -l semanas/04/source_material/08-rules.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje|auto memory|automemory" semanas/04/source_material/08-rules.md
```
Expected: 100–200 líneas. `auto memory` no debe aparecer (ya vive en §7).

- [ ] **Step 4: Commit**

```bash
git add semanas/04/source_material/08-rules.md
git commit -m "docs(s04 §8): rules — extraer auto memory a §7, agregar plantilla"
```

---

### Task 16: `09-settings-json.md` (NUEVO)

**Files:**
- Create: `semanas/04/source_material/09-settings-json.md`

- [ ] **Step 1: Crear el archivo desde cero**

Contenido obligatorio:

- **§1 Qué es** — archivo JSON que configura el **runtime** de Claude Code. NO son instrucciones para el agente (eso es CLAUDE.md/rules) — son parámetros del programa que envuelve al LLM: model, hooks, permissions, environment.
- **§2 Dónde vive** — 4 niveles: `~/.claude/settings.json` (user), `.claude/settings.json` (project versionado), `.claude/settings.local.json` (project gitignored), managed enterprise. Tabla.
- **§3 Cuándo se carga** — arranque. Merge entre niveles.
- **§4 Cómo se usa** — campos típicos: `model`, `env`, `permissions`, `hooks`, `includeCoAuthoredBy`, `cleanupPeriodDays`, `permissionMode`. Slide-walkthrough del `.claude/settings.json` real del demo-repo, campo por campo. Mostrar también `.local.json.example` y por qué el `.local.json` va al `.gitignore`.
- **§5 Casos límite** — precedencia (managed > local > project > user para resolver overlaps; los niveles más altos pueden bloquear escalas más bajas en permisos). No confundir con `mcp.json` (config de MCP, otra cosa). `permissions` es el campo más impactante; se desarrolla en §10.
- **§6 Mini-demo** — abrir los 3 archivos de settings simultáneamente en VS Code. Cambiar `model` en uno. Mostrar que toma efecto en la próxima sesión. Mostrar `cleanupPeriodDays`. Plan B: leer los archivos y narrar la convención.

URL requerida: `https://code.claude.com/docs/en/settings` (o la página equivalente).

- [ ] **Step 2: Verificación**

```bash
wc -l semanas/04/source_material/09-settings-json.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje" semanas/04/source_material/09-settings-json.md
```

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/09-settings-json.md
git commit -m "docs(s04 §9 NEW): settings.json — config del runtime"
```

---

### Task 17: `10-permisos.md` (NUEVO; reutiliza parte del 11 existente)

**Files:**
- Create: `semanas/04/source_material/10-permisos.md`

- [ ] **Step 1: Crear el archivo**

Contenido obligatorio:

- **§1 Qué es** — sistema que decide qué tools puede ejecutar Claude **sin pedir confirmación**.
- **§2 Dónde viven** — `permissions` dentro de `settings.json` (cualquier nivel). Comando interactivo `/permissions` para ajustar durante la sesión.
- **§3 Cuándo se evalúan** — antes de cada tool call. Si matchea `deny` → bloqueado. Si no matchea `deny` y matchea `allow` → ejecuta sin preguntar. Si solo matchea `ask` o nada → pide confirmación. **`deny` tiene precedencia sobre `allow`.**
- **§4 Cómo se usa** — sintaxis `Tool(pattern)`. Ejemplos del demo-repo:
  - `"Bash(uv run pytest)"` (allow)
  - `"Bash(uv run uvicorn *)"` (allow con wildcard)
  - `"Edit(./backend/**)"` (allow)
  - `"Read(./.env)"` (deny)
  - `"WebFetch(domain:fastapi.tiangolo.com)"` (allow)
  - Walkthrough del bloque `permissions` real con allow / deny / ask separados visualmente.
- **§5 Casos límite** — **permission modes** como overlay: `default`, `acceptEdits`, `plan`, `bypassPermissions` (se introducen acá, `plan` se desarrolla en §13). La sintaxis `Bash(*)` no existe — hay que ser explícito. Default = preguntar, no negar. Wildcards no atraviesan `;` o `&&`.
- **§6 Mini-demo** — sesión nueva sin permisos configurados. Pedirle a Claude correr los tests → aparece el prompt. Negar el prompt, agregar el comando a `allow` con `/permissions`. Repetir corrida → pasa sin prompt. Cerrar con un `deny` para `Read(./.env)` que se bloquea. Plan B: leer el `.claude/settings.json` y narrar.

URLs requeridas: `https://code.claude.com/docs/en/permission-modes`, `https://code.claude.com/docs/en/permissions` (o equivalente).

- [ ] **Step 2: Verificación**

```bash
wc -l semanas/04/source_material/10-permisos.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje" semanas/04/source_material/10-permisos.md
```

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/10-permisos.md
git commit -m "docs(s04 §10 NEW): permisos — control de tools con allow/deny/ask"
```

---

### Task 18: `11-skills-y-slash-commands.md` (rewrite)

**Files:**
- Modify: `semanas/04/source_material/09-skills-y-slash-commands.md` → mover y reescribir a `11-skills-y-slash-commands.md`

- [ ] **Step 1: Mover el archivo**

```bash
git mv semanas/04/source_material/09-skills-y-slash-commands.md semanas/04/source_material/11-skills-y-slash-commands.md
```

- [ ] **Step 2: Reescribir con plantilla**

Contenido obligatorio:

- **§1 Qué es** — distinguir desde la primera línea: **skill = procedimiento completo** (fases, verificaciones, anti-patterns); **slash command = atajo**. Puede invocar una skill o solo ejecutar instrucciones inline. Skill ≠ slash command.
- **§2 Dónde viven** — skills en `.claude/skills/<nombre>/SKILL.md` (proyecto), `~/.claude/skills/<nombre>/` (user), plugins. Slash commands en `.claude/commands/<nombre>.md` (proyecto), `~/.claude/commands/<nombre>.md` (user), plugins.
- **§3 Cuándo se cargan** — **skills NO están en el contexto al arranque**. Solo nombre + descripción aparecen al inicio. La skill entra cuando se invoca o cuando matchea la tarea por relevancia. Slash commands en autocomplete con `/`, no consumen contexto hasta invocación.
- **§4 Cómo se usan** — ejemplo del demo-repo: `.claude/skills/add-endpoint/SKILL.md` con frontmatter `name` + `description`; `.claude/commands/add-endpoint.md` invoca la skill. También ejemplo meta: `tools/skills/slide-generation/` + `.claude/commands/build-class.md` (este último solo invoca la skill — el procedimiento vive en la skill). Mostrar estructura de SKILL.md: frontmatter, fases, anti-patterns.
- **§5 Casos límite** — algunos slash commands no invocan skills (`/memory`, `/context`, `/permissions`). El `description` de la skill es lo que Claude lee para decidir si activarla por relevancia → tiene que ser preciso ("Use when X" no "X").
- **§6 Mini-demo** — sesión nueva en el demo-repo. Ejecutar `/context` — la skill no aparece referenciada (solo nombre+description si acaso). Invocar `/add-endpoint` o describir la tarea. Mostrar que Claude empieza a seguir las fases del SKILL.md. Comparar con misma tarea sin la skill (Claude inventa el flow). Plan B: si la activación por relevancia no responde, usar el slash command directo.

URLs requeridas: `https://code.claude.com/docs/en/skills`, `https://code.claude.com/docs/en/slash-commands` (o equivalentes).

- [ ] **Step 3: Verificación**

```bash
wc -l semanas/04/source_material/11-skills-y-slash-commands.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje" semanas/04/source_material/11-skills-y-slash-commands.md
```

- [ ] **Step 4: Commit**

```bash
git add semanas/04/source_material/11-skills-y-slash-commands.md
git commit -m "docs(s04 §11): skills+slash — renombrar y aplicar plantilla"
```

---

### Task 19: `12-sub-agents.md` (rewrite)

**Files:**
- Modify: `semanas/04/source_material/10-sub-agents.md` → mover y reescribir a `12-sub-agents.md`

- [ ] **Step 1: Mover**

```bash
git mv semanas/04/source_material/10-sub-agents.md semanas/04/source_material/12-sub-agents.md
```

- [ ] **Step 2: Reescribir con plantilla**

Contenido obligatorio:

- **§1 Qué es** — instancia separada del loop con su propia ventana de contexto. Mismo LLM + loop + tools + entorno instanciado aparte. Al padre solo vuelve el resultado final.
- **§2 Dónde viven** — `.claude/agents/<nombre>.md` (proyecto), `~/.claude/agents/<nombre>.md` (user), plugins (varios built-in: `Explore`, `Plan`).
- **§3 Cuándo se invocan** — el supervisor llama el tool `Agent` con un `subagent_type`. Algunas skills lo hacen automático.
- **§4 Cómo se usa** — definición con frontmatter: `name`, `description`, `tools` (lista restringida — el sub-agent NO tiene acceso a todas las tools por default), `model` opcional. Cuerpo del archivo = system prompt del sub-agent. Ejemplo: `.claude/agents/researcher.md` del demo-repo (tools restringidos a Read/Grep/Glob). Mencionar paralelización (múltiples `Agent` calls en una respuesta).
- **§5 Casos límite** — **NO es "otra IA"** — es la misma lógica, aislada. El padre recibe solo el resultado, no el razonamiento intermedio → la delegación no exime de supervisar. Paralelización es beneficio secundario; el motivo principal es proteger el contexto del padre. El sub-agent puede leer 50 archivos y razonar mil tokens; todo vive en su ventana.
- **§6 Mini-demo** — dos versiones de "¿dónde se maneja la auth en este repo?": (a) inline — Claude busca, `/context` muestra ventana cargada; (b) delegada al `researcher` (o `Explore`) — `/context` muestra ventana del padre limpia. Cerrar mostrando `.claude/agents/researcher.md` con `tools:` restringido. Plan B: si el delta de `/context` no es dramático, narrar con el archivo abierto.

URLs requeridas: `https://code.claude.com/docs/en/sub-agents` (o equivalente).

- [ ] **Step 3: Verificación**

```bash
wc -l semanas/04/source_material/12-sub-agents.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje" semanas/04/source_material/12-sub-agents.md
```

- [ ] **Step 4: Commit**

```bash
git add semanas/04/source_material/12-sub-agents.md
git commit -m "docs(s04 §12): sub-agents — renombrar y aplicar plantilla"
```

---

### Task 20: `13-plan-mode.md` (rewrite, sin la sección de permisos que migró a §10)

**Files:**
- Modify: `semanas/04/source_material/11-plan-mode-y-control.md` → mover y reescribir a `13-plan-mode.md`

- [ ] **Step 1: Mover**

```bash
git mv semanas/04/source_material/11-plan-mode-y-control.md semanas/04/source_material/13-plan-mode.md
```

- [ ] **Step 2: Reescribir con plantilla**

Contenido obligatorio:

- **§1 Qué es** — modo de operación que separa "pensar" de "actuar". Claude puede leer/buscar/razonar; las escrituras esperan aprobación.
- **§2 Dónde vive** — uno de los 4 permission modes (`default`, `acceptEdits`, `plan`, `bypassPermissions`). Activación: flag `--permission-mode plan` al arranque, campo `permissionMode` en `settings.json`, o `Shift+Tab` durante la sesión.
- **§3 Cuándo se activa** — al inicio (para tareas grandes) o on-the-fly cuando ves que el agente está por hacer algo costoso.
- **§4 Cómo se usa** — correr el agente normal en plan mode, describir la tarea, Claude propone el plan, revisar/corregir, aprobar con `ExitPlanMode`. El plan es el contrato: una vez aprobado, Claude ejecuta sin volver a parar (a menos que toque un `deny` de §10). Otros permission modes: `default` (default, pregunta cuando es necesario), `acceptEdits` (auto-acepta Edit/Write, no Bash), `bypassPermissions` (sin gates — solo entornos efímeros).
- **§5 Casos límite** — criterios para elegir cada modo según reversibilidad: `plan` para tareas grandes multi-archivo o cuando no estás seguro del enfoque; `acceptEdits` para tareas chicas con tests que corren rápido; `bypassPermissions` solo en containers/sandboxes; `default` en el resto. Plan mode = defensa más barata contra la deriva, pero **no es sandbox**: si tras aprobar el plan algo ejecuta `Bash` riesgoso, sigue siendo riesgoso.
- **§6 Mini-demo** — tarea de refactor multi-archivo en demo-repo ("extraé el middleware de auth a un módulo compartido"). Primera corrida en `default`: Claude edita casi de inmediato; cancelar. Segunda corrida con `Shift+Tab` hasta `plan` (la UI muestra el modo): misma tarea; Claude responde con un plan, no edita. Revisar, corregir ("no toques tests/"), aprobar. Claude ejecuta versión aprobada. Plan B: si el modo no es visible en grabación, narrar el banner.

Cierre de Parte 2 incluido al final (no extender — solo bridge a §14): "Tenés el runtime. La última sección cierra el arco completo del curso."

URLs requeridas: `https://code.claude.com/docs/en/permission-modes`.

- [ ] **Step 3: Verificación**

```bash
wc -l semanas/04/source_material/13-plan-mode.md
grep -iE "payoff|vibe coding|diplomatura|bisagra|esta clase|esta semana|scaffolding|andamiaje" semanas/04/source_material/13-plan-mode.md
```
La sección original de "Permisos: gate antes de cada acción" debe haber desaparecido (migró a §10).

- [ ] **Step 4: Commit**

```bash
git add semanas/04/source_material/13-plan-mode.md
git commit -m "docs(s04 §13): plan-mode — renombrar, plantilla, extraer permisos a §10"
```

---

### Task 21: Renombrar `12-trabajo-final.md` → `14-trabajo-final.md`

**Files:**
- Modify: rename only

- [ ] **Step 1: Rename con git**

```bash
git mv semanas/04/source_material/12-trabajo-final.md semanas/04/source_material/14-trabajo-final.md
```

- [ ] **Step 2: Verificar que el contenido no referencia números de sección que cambien**

```bash
grep -nE "§[0-9]+|sección [0-9]+|Section [0-9]+" semanas/04/source_material/14-trabajo-final.md
```
Expected: si aparece alguna referencia a `§12` (autoreferencia anterior) o a otro número que ahora cambió, ajustarla. Las referencias `S1`, `S2-3`, `S4` (semanas, no secciones) deben quedar.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/14-trabajo-final.md
git commit -m "docs(s04 §14): renumerar trabajo-final 12→14 (+ refs internas)"
```

---

## Phase D — Wiring + finalización

### Task 22: Actualizar `source_material/index.md`

**Files:**
- Modify: `semanas/04/source_material/index.md`

- [ ] **Step 1: Reescribir la tabla de orden de lectura**

Editar `semanas/04/source_material/index.md`. Reemplazar la tabla por:

```markdown
| # | Archivo | Tema | Bloque de clase |
|---|---------|------|-----------------|
| 1 | [01-de-escribir-a-actuar.md](01-de-escribir-a-actuar.md) | De una IA que escribe a una que actúa | Apertura (~10 min) |
| 2 | [02-el-loop-agentic.md](02-el-loop-agentic.md) | El loop: pensar → actuar → observar | Fundamentos (~20 min) |
| 3 | [03-tools-las-manos.md](03-tools-las-manos.md) | Tools: las manos del agente (callback S1) | Fundamentos (~18 min) |
| 4 | [04-la-ventana-es-todo.md](04-la-ventana-es-todo.md) | La ventana de contexto es finita | Fundamentos (~22 min) |
| 5 | [05-cuando-el-agente-falla.md](05-cuando-el-agente-falla.md) | Modos de falla y el rol del supervisor | Fundamentos (~12 min) |
| 6 | [06-claude-code-es-el-loop.md](06-claude-code-es-el-loop.md) | Claude Code es ese loop, concreto | Claude Code (~12 min) |
| 7 | [07-CLAUDE-md.md](07-CLAUDE-md.md) | CLAUDE.md jerárquico + auto memory | Claude Code (~18 min) |
| 8 | [08-rules.md](08-rules.md) | Rules path-scoped en `.claude/rules/` | Claude Code (~16 min) |
| 9 | [09-settings-json.md](09-settings-json.md) | settings.json del runtime | Claude Code (~12 min) |
| 10 | [10-permisos.md](10-permisos.md) | Permisos: allow / deny / ask | Claude Code (~16 min) |
| 11 | [11-skills-y-slash-commands.md](11-skills-y-slash-commands.md) | Skills y slash commands | Claude Code (~14 min) |
| 12 | [12-sub-agents.md](12-sub-agents.md) | Sub-agents: aislar contexto | Claude Code (~12 min) |
| 13 | [13-plan-mode.md](13-plan-mode.md) | Plan mode + permission modes | Claude Code (~12 min) |
| 14 | [14-trabajo-final.md](14-trabajo-final.md) | Trabajo final: framing y motivación | Cierre (~20 min) |
```

Actualizar también el "Hilo conductor" si menciona números de sección concretos — debería seguir siendo válido, pero confirmar que no dice "parte 2 (§6–§11)" sino "parte 2 (§6–§13)".

- [ ] **Step 2: Verificación**

```bash
wc -l semanas/04/source_material/index.md
grep -E "07-CLAUDE-md|08-rules|09-settings|10-permisos|11-skills|12-sub-agents|13-plan-mode|14-trabajo-final" semanas/04/source_material/index.md
```
Expected: las 8 entradas presentes.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/source_material/index.md
git commit -m "docs(s04): index.md — actualizar tabla a §7–§14 con nuevos nombres"
```

---

### Task 23: Actualizar `semanas/04/spine.md`

**Files:**
- Modify: `semanas/04/spine.md`

- [ ] **Step 1: Leer estado actual y editar Parte 2**

Abrir `semanas/04/spine.md`. Mantener §1–§6 sin cambios. Reemplazar el contenido de la Parte 2 (a partir de la línea `# Parte 2 — Claude Code (§6–§12)`) por la versión nueva. Estructura obligatoria de la nueva Parte 2:

- Encabezado actualizado: `# Parte 2 — Claude Code (§6–§13)`.
- Nota de framing: el lens-tracker NO se usa en Parte 2 (decisión del rediseño del 2026-05-19). Se reemplaza por la **plantilla de 5 preguntas** como dispositivo recurrente. La cita conceptual de la Parte 1 (`context ⊂ harness`) queda colgada — aceptado como costo de scope.
- §6 sin cambios (mantiene su entry actual; nota explícita: el tracker neutral introducido acá queda sin recoger).
- §7 a §13: una entry por feature con plantilla documentation-walkthrough resumida (no replicar la doc — referenciar el archivo `source_material/NN-*.md` y listar las 6 sub-secciones obligatorias). Mismo formato que las entradas actuales: Source material, Through-line, What students walk away knowing, Animations/interactive (placeholder neutro porque las animaciones nuevas las decide el pipeline `slide-generation`), Mini-demo, Slide budget actual.
- §14: trabajo final, mismo contenido que el §12 actual del spine, solo renumerado.

Las 7 entradas nuevas siguen el orden:
1. §7 CLAUDE.md y memoria automática — source_material `07-CLAUDE-md.md`
2. §8 Rules — source_material `08-rules.md`
3. §9 settings.json — source_material `09-settings-json.md`
4. §10 Permisos — source_material `10-permisos.md`
5. §11 Skills y slash commands — source_material `11-skills-y-slash-commands.md`
6. §12 Sub-agents — source_material `12-sub-agents.md`
7. §13 Plan mode + permission modes — source_material `13-plan-mode.md`

Cada entry incluye el slide budget objetivo (10/9/9/11/11/9/11 respectivamente, del spec).

También actualizar la "Nota de escala" al inicio del spine: pasa de 12 secciones a 14; ~210–230 min de contenido; deck estimado ~120–135 slides.

- [ ] **Step 2: Verificación**

```bash
grep -nE "§7|§8|§9|§10|§11|§12|§13|§14|Section 7|Section 8|Section 9|Section 10|Section 11|Section 12|Section 13|Section 14" semanas/04/spine.md
```
Expected: las 8 secciones presentes con sus encabezados.

- [ ] **Step 3: Commit**

```bash
git add semanas/04/spine.md
git commit -m "docs(s04): spine — actualizar Parte 2 a 7 secciones + renumerar §12→§14"
```

---

### Task 24: Verificación end-to-end del rediseño

- [ ] **Step 1: Lista de source material**

Run: `ls semanas/04/source_material/`
Expected: 14 archivos (`01-...md` a `14-...md`) + `index.md`. **Ningún** archivo huérfano del esquema anterior (`07-CLAUDE-md-jerarquico.md`, `08-rules-y-auto-memory.md`, `09-skills-y-slash-commands.md`, `10-sub-agents.md`, `11-plan-mode-y-control.md`, `12-trabajo-final.md` ya no existen).

- [ ] **Step 2: Demo-repo entero válido**

```bash
cd semanas/04/demo-repo
uv run pytest -v
python -c "import json; json.load(open('.claude/settings.json'))"
python -c "import yaml; yaml.safe_load(open('openapi.yaml'))"
cd -
```
Expected: tests pasan, JSON y YAML válidos.

- [ ] **Step 3: Spine y index referencian a los nuevos archivos**

```bash
grep -c "07-CLAUDE-md\|08-rules\|09-settings-json\|10-permisos\|11-skills-y-slash-commands\|12-sub-agents\|13-plan-mode\|14-trabajo-final" semanas/04/source_material/index.md
```
Expected: ≥ 8.

- [ ] **Step 4: Git tree limpio en `semanas/04/`**

Run: `git status semanas/04/`
Expected: working tree clean.

- [ ] **Step 5: Resumen al usuario**

Mensaje al usuario:
```
Implementación lista. Outputs:
- semanas/04/demo-repo/ — FastAPI + frontend + tests + .claude/ completo
- semanas/04/source_material/ — 7 archivos nuevos/reescritos (07-13) + 14 renombrado
- semanas/04/source_material/index.md — actualizado
- semanas/04/spine.md — Parte 2 con 7 secciones

Próximo paso (no parte de este plan): correr /build-class para que el pipeline
slide-generation regenere _section-7.html .. _section-14.html.
```

---

## Notas operativas para el ejecutor

- **No commitear `.env`** del demo-repo si por error se crea localmente (está en `.gitignore`).
- **No commitear `.claude/settings.local.json`** del demo-repo (también en `.gitignore`).
- **Antes de correr `uv` por primera vez:** `cd semanas/04/demo-repo && uv sync` instala las deps. `uv sync --extra dev` instala también pyyaml para Task 6.
- **Si la rama actual no es `feature/semana-04-source-material`:** asumir que se trabaja en esa rama (corresponde al estado del repo).
- **No correr `/build-class` como parte de este plan.** Es trabajo posterior, lo decide el profesor.
- **Las URLs de docs oficiales** en cada source_material deben verificarse que existan al momento de escribir (la doc puede haber movido páginas; ajustar a la URL canónica vigente).
