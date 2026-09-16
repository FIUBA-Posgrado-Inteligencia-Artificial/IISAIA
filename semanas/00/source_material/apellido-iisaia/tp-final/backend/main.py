from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select

from backend.db import create_tables, engine
from backend.models import Game
from backend.routes import router

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

GAMES = [
    {"slug": "tetris", "name": "Tetris", "description": "Encajá las piezas y completá líneas antes de que la pila llegue arriba."},
    {"slug": "snake", "name": "Snake", "description": "Comé sin chocar contra las paredes ni contra tu propia cola."},
]


def seed_games() -> None:
    with Session(engine) as session:
        existing = set(session.exec(select(Game.slug)))
        for game in GAMES:
            if game["slug"] not in existing:
                session.add(Game(**game))
        session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    create_tables()
    seed_games()
    yield


app = FastAPI(title="Plataforma de juegos", lifespan=lifespan)
app.include_router(router)
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
