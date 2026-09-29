from urllib.parse import parse_qs, urlparse

import pytest
from authlib.integrations.starlette_client import OAuthError

from backend.auth import REQUIRED_VARS, load_settings, oauth


@pytest.mark.parametrize(
    "path", ["/", "/index.html", "/game.html?game=snake", "/css/styles.css", "/docs"]
)
def test_anonimo_va_al_login(client, path):
    response = client.get(path)
    assert response.status_code == 302
    assert response.headers["location"] == "/login"


def test_api_anonima_devuelve_401(client):
    response = client.get("/api/games")
    assert response.status_code == 401
    assert response.json() == {"detail": "Tenés que iniciar sesión."}


def test_post_anonimo_no_guarda(client):
    anonymous = client.post("/api/games/snake/scores", json={"player": "Ana", "points": 10})
    assert anonymous.status_code == 401
    client.get("/callback")  # recién ahora inicia sesión, para poder leer el ranking
    assert client.get("/api/games/snake/scores").json() == []


def test_login_va_directo_a_google_por_auth0(client):
    response = client.get("/login")
    assert response.status_code == 302
    url = urlparse(response.headers["location"])
    query = parse_qs(url.query)
    assert (url.netloc, url.path) == ("test.auth0.com", "/authorize")
    assert query["connection"] == ["google-oauth2"]
    assert query["redirect_uri"] == ["http://testserver/callback"]
    assert "openid" in query["scope"][0].split()


def test_callback_guarda_la_sesion(client):
    response = client.get("/callback")
    assert response.status_code == 302
    assert response.headers["location"] == "/"
    assert client.get("/api/games").status_code == 200


def test_logueado_recibe_estaticos(user_client):
    assert user_client.get("/css/styles.css").status_code == 200


def test_callback_con_error_devuelve_400(client, monkeypatch):
    async def denied(request, **kwargs):
        raise OAuthError(error="access_denied")

    monkeypatch.setattr(oauth.auth0, "authorize_access_token", denied)
    response = client.get("/callback?error=access_denied")
    assert response.status_code == 400
    assert 'href="/login"' in response.text
    assert client.get("/api/games").status_code == 401


def test_logout_borra_la_sesion_y_sale_de_auth0(user_client):
    response = user_client.get("/logout")
    assert response.status_code == 302
    url = urlparse(response.headers["location"])
    query = parse_qs(url.query)
    assert (url.netloc, url.path) == ("test.auth0.com", "/v2/logout")
    assert query["client_id"] == ["test-client-id"]
    assert query["returnTo"] == ["http://testserver"]
    assert user_client.get("/api/games").status_code == 401


@pytest.mark.parametrize("name", REQUIRED_VARS)
def test_variable_faltante_frena_el_arranque(monkeypatch, name):
    monkeypatch.delenv(name)
    with pytest.raises(RuntimeError, match=name):
        load_settings()


@pytest.mark.parametrize("name", REQUIRED_VARS)
def test_variable_vacia_frena_el_arranque(monkeypatch, name):
    monkeypatch.setenv(name, "")
    with pytest.raises(RuntimeError, match=name):
        load_settings()
