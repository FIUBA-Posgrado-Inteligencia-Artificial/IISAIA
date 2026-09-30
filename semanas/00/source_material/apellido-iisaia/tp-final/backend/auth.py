import os
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlencode

from authlib.integrations.starlette_client import OAuth, OAuthError
from dotenv import load_dotenv
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, Response
from starlette.middleware.base import RequestResponseEndpoint

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

REQUIRED_VARS = ("AUTH0_DOMAIN", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET", "SESSION_SECRET")
PUBLIC_PATHS = {"/login", "/callback", "/logout", "/logged-out"}
LOGIN_FAILED_HTML = (
    '<!doctype html><html lang="es"><meta charset="utf-8">'
    "<title>No se pudo iniciar sesión</title>"
    '<p>No se pudo iniciar sesión. <a href="/login">Intentar de nuevo</a></p></html>'
)
LOGGED_OUT_HTML = (
    '<!doctype html><html lang="es"><meta charset="utf-8">'
    "<title>Sesión cerrada</title>"
    '<p>Cerraste sesión. <a href="/login">Iniciar sesión de nuevo</a></p></html>'
)


@dataclass(frozen=True)
class Settings:
    auth0_domain: str
    client_id: str
    client_secret: str
    session_secret: str


def load_settings() -> Settings:
    missing = [name for name in REQUIRED_VARS if not os.environ.get(name)]
    if missing:
        raise RuntimeError(
            f"Faltan variables de entorno: {', '.join(missing)}. "
            "Copiá .env.example a .env y completalas (ver README)."
        )
    return Settings(
        auth0_domain=os.environ["AUTH0_DOMAIN"],
        client_id=os.environ["AUTH0_CLIENT_ID"],
        client_secret=os.environ["AUTH0_CLIENT_SECRET"],
        session_secret=os.environ["SESSION_SECRET"],
    )


settings = load_settings()

oauth = OAuth()
oauth.register(
    "auth0",
    client_id=settings.client_id,
    client_secret=settings.client_secret,
    server_metadata_url=f"https://{settings.auth0_domain}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid profile email"},
)

router = APIRouter()


@router.get("/login")
async def login(request: Request) -> Response:
    redirect_uri = str(request.url_for("callback"))
    return await oauth.auth0.authorize_redirect(request, redirect_uri, connection="google-oauth2")


@router.get("/callback")
async def callback(request: Request) -> Response:
    try:
        token = await oauth.auth0.authorize_access_token(request)
    except OAuthError:
        return HTMLResponse(LOGIN_FAILED_HTML, status_code=400)
    userinfo = token["userinfo"]
    request.session["user"] = {
        "sub": userinfo["sub"],
        "name": userinfo.get("name", ""),
        "email": userinfo.get("email", ""),
    }
    return RedirectResponse("/", status_code=302)


@router.get("/logout")
async def logout(request: Request) -> Response:
    request.session.clear()
    params = urlencode(
        {"client_id": settings.client_id, "returnTo": str(request.url_for("logged_out"))}
    )
    return RedirectResponse(f"https://{settings.auth0_domain}/v2/logout?{params}", status_code=302)


@router.get("/logged-out")
async def logged_out() -> Response:
    return HTMLResponse(LOGGED_OUT_HTML)


async def require_login(request: Request, call_next: RequestResponseEndpoint) -> Response:
    if request.url.path in PUBLIC_PATHS or request.session.get("user"):
        return await call_next(request)
    if request.url.path.startswith("/api/"):
        return JSONResponse({"detail": "Tenés que iniciar sesión."}, status_code=401)
    return RedirectResponse("/login", status_code=302)
