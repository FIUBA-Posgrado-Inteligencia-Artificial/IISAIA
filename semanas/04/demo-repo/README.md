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
