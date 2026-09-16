from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, StringConstraints, Field


class GameOut(BaseModel):
    slug: str
    name: str
    description: str


class ScoreInput(BaseModel):
    player: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=20)]
    points: Annotated[int, Field(ge=0)]


class ScoreOut(BaseModel):
    id: int
    game: str
    player: str
    points: int
    created_at: datetime
