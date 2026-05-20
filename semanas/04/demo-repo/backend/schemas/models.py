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
