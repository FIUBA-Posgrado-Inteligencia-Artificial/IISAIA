import os
import tempfile
from pathlib import Path

# Antes de importar la app: base temporal, así los tests nunca tocan scores.db.
os.environ["DATABASE_URL"] = f"sqlite:///{Path(tempfile.mkdtemp()) / 'test.db'}"

# Valores falsos: pisan cualquier .env real (load_dotenv no sobreescribe lo que ya está).
os.environ.update(
    {
        "AUTH0_DOMAIN": "test.auth0.com",
        "AUTH0_CLIENT_ID": "test-client-id",
        "AUTH0_CLIENT_SECRET": "test-client-secret",
        "SESSION_SECRET": "test-session-secret",
    }
)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlmodel import Session

from backend.auth import oauth
from backend.db import create_tables, engine
from backend.main import app
from backend.models import Score

create_tables()

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
    client.get("/callback")
    return client
