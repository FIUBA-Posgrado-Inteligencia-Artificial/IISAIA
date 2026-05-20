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
