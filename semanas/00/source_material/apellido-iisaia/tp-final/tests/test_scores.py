from datetime import datetime, timedelta

import pytest


def post_score(client, slug, player, points):
    return client.post(f"/api/games/{slug}/scores", json={"player": player, "points": points})


def test_lista_los_juegos_del_seed(user_client):
    response = user_client.get("/api/games")
    assert response.status_code == 200
    assert {"snake", "tetris"} <= {game["slug"] for game in response.json()}


def test_guardar_puntaje_devuelve_201_con_fecha_utc(user_client):
    response = post_score(user_client, "snake", "Ana", 70)
    assert response.status_code == 201
    body = response.json()
    assert (body["game"], body["player"], body["points"]) == ("snake", "Ana", 70)
    assert datetime.fromisoformat(body["created_at"]).utcoffset() == timedelta(0)


def test_ranking_de_mayor_a_menor_y_empate_para_el_primero(user_client):
    post_score(user_client, "snake", "Ana", 50)
    post_score(user_client, "snake", "Beto", 70)
    post_score(user_client, "snake", "Caro", 50)
    response = user_client.get("/api/games/snake/scores")
    assert response.status_code == 200
    assert [score["player"] for score in response.json()] == ["Beto", "Ana", "Caro"]


def test_ranking_respeta_limit(user_client):
    for points in (10, 20, 30):
        post_score(user_client, "tetris", "Ana", points)
    response = user_client.get("/api/games/tetris/scores?limit=2")
    assert [score["points"] for score in response.json()] == [30, 20]


def test_juego_inexistente_devuelve_404(user_client):
    assert user_client.get("/api/games/pong/scores").json() == {"detail": "El juego 'pong' no existe"}
    assert post_score(user_client, "pong", "Ana", 10).status_code == 404


@pytest.mark.parametrize(
    "player, points",
    [("", 10), ("   ", 10), ("x" * 21, 10), ("Ana", -1)],
)
def test_puntaje_invalido_devuelve_422(user_client, player, points):
    assert post_score(user_client, "snake", player, points).status_code == 422


@pytest.mark.parametrize("limit", [0, 51])
def test_limit_fuera_de_rango_devuelve_422(user_client, limit):
    assert user_client.get(f"/api/games/snake/scores?limit={limit}").status_code == 422
