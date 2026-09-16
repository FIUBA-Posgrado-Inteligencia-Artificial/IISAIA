from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Game(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    description: str


class Score(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    game_id: int = Field(foreign_key="game.id", index=True)
    player: str
    points: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
