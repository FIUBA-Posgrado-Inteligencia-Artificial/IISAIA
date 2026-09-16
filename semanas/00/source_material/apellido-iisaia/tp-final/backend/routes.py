from datetime import timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from backend.db import get_session
from backend.models import Game, Score
from backend.schemas import GameOut, ScoreInput, ScoreOut

router = APIRouter(prefix="/api")

SessionDep = Annotated[Session, Depends(get_session)]


def find_game(session: Session, slug: str) -> Game:
    game = session.exec(select(Game).where(Game.slug == slug)).first()
    if game is None:
        raise HTTPException(status_code=404, detail=f"El juego '{slug}' no existe")
    return game


def to_score_out(score: Score, game: Game) -> ScoreOut:
    # SQLite no guarda la zona horaria: el valor se escribió en UTC y vuelve naive.
    return ScoreOut(
        id=score.id,
        game=game.slug,
        player=score.player,
        points=score.points,
        created_at=score.created_at.replace(tzinfo=timezone.utc),
    )


@router.get("/games", response_model=list[GameOut])
def list_games(session: SessionDep) -> list[Game]:
    return list(session.exec(select(Game).order_by(Game.name)))


@router.get("/games/{slug}/scores", response_model=list[ScoreOut])
def list_scores(
    slug: str,
    session: SessionDep,
    limit: Annotated[int, Query(ge=1, le=50)] = 10,
) -> list[ScoreOut]:
    game = find_game(session, slug)
    query = (
        select(Score)
        .where(Score.game_id == game.id)
        .order_by(Score.points.desc(), Score.created_at.asc())
        .limit(limit)
    )
    return [to_score_out(score, game) for score in session.exec(query)]


@router.post("/games/{slug}/scores", response_model=ScoreOut, status_code=201)
def create_score(slug: str, data: ScoreInput, session: SessionDep) -> ScoreOut:
    game = find_game(session, slug)
    score = Score(game_id=game.id, player=data.player, points=data.points)
    session.add(score)
    session.commit()
    session.refresh(score)
    return to_score_out(score, game)
