import os
import tempfile
from pathlib import Path

# Antes de importar la app: base temporal, así los tests nunca tocan scores.db.
os.environ["DATABASE_URL"] = f"sqlite:///{Path(tempfile.mkdtemp()) / 'test.db'}"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlmodel import Session

from backend.db import create_tables, engine
from backend.main import app
from backend.models import Score

create_tables()


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
    return client
