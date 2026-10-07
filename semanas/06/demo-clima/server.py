# /// script
# requires-python = ">=3.10"
# dependencies = ["mcp>=2.3,<3", "httpx"]
# ///
"""Server MCP mínimo de clima: una primitive de cada tipo.

- Tool      clima_actual        -> la decide el modelo
- Resource  clima://ciudades    -> la adjunta el usuario con @
- Resource  clima://pronostico/{ciudad}
- Prompt    reporte_clima       -> lo dispara el usuario con /

Datos: Open-Meteo (https://open-meteo.com), sin API key.
"""

import httpx
from mcp.server import MCPServer

mcp = MCPServer(
    "clima",
    instructions="Clima actual y pronóstico de ciudades vía Open-Meteo.",
)

CIUDADES = ["Montevideo", "Buenos Aires", "Madrid", "Tokyo"]

# Códigos WMO que devuelve Open-Meteo, agrupados.
WMO = {
    0: "despejado", 1: "mayormente despejado", 2: "parcialmente nublado",
    3: "nublado", 45: "niebla", 48: "niebla", 51: "llovizna", 53: "llovizna",
    55: "llovizna", 61: "lluvia débil", 63: "lluvia", 65: "lluvia fuerte",
    71: "nieve", 73: "nieve", 75: "nieve", 80: "chaparrones", 81: "chaparrones",
    82: "chaparrones fuertes", 95: "tormenta", 96: "tormenta con granizo",
    99: "tormenta con granizo",
}


def _ubicar(ciudad: str) -> dict:
    # Los argumentos de un prompt llegan separados por espacios: Buenos_Aires.
    nombre = ciudad.replace("_", " ")
    r = httpx.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={"name": nombre, "count": 1, "language": "es"},
        timeout=10,
    )
    r.raise_for_status()
    resultados = r.json().get("results")
    if not resultados:
        raise ValueError(f"No encontré la ciudad '{nombre}'.")
    return resultados[0]


def _pronostico(lugar: dict, **params) -> dict:
    r = httpx.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": lugar["latitude"],
            "longitude": lugar["longitude"],
            "timezone": "auto",
            **params,
        },
        timeout=10,
    )
    r.raise_for_status()
    return r.json()


@mcp.tool()
def clima_actual(ciudad: str) -> str:
    """Devuelve el clima actual de una ciudad: temperatura, viento y estado del cielo."""
    lugar = _ubicar(ciudad)
    actual = _pronostico(
        lugar, current="temperature_2m,wind_speed_10m,weather_code"
    )["current"]
    return (
        f"{lugar['name']}, {lugar.get('country', '')}: "
        f"{actual['temperature_2m']} °C, viento {actual['wind_speed_10m']} km/h, "
        f"{WMO.get(actual['weather_code'], 'sin dato')}."
    )


@mcp.resource("clima://ciudades", mime_type="text/plain")
def ciudades() -> str:
    """Ciudades sugeridas para la demo."""
    return "\n".join(CIUDADES)


@mcp.resource("clima://pronostico/{ciudad}", mime_type="text/plain")
def pronostico(ciudad: str) -> str:
    """Pronóstico de los próximos 3 días para una ciudad."""
    lugar = _ubicar(ciudad)
    diario = _pronostico(
        lugar,
        daily="temperature_2m_max,temperature_2m_min,weather_code",
        forecast_days=3,
    )["daily"]
    filas = [
        f"{dia}: {tmin}–{tmax} °C, {WMO.get(codigo, 'sin dato')}"
        for dia, tmin, tmax, codigo in zip(
            diario["time"],
            diario["temperature_2m_min"],
            diario["temperature_2m_max"],
            diario["weather_code"],
        )
    ]
    return f"Pronóstico para {lugar['name']}:\n" + "\n".join(filas)


@mcp.prompt()
def reporte_clima(ciudad: str) -> str:
    """Arma un reporte del clima de una ciudad, con recomendación de qué ponerse."""
    return (
        f"Usá la tool clima_actual para consultar el clima de {ciudad.replace('_', ' ')}. "
        "Después escribí un reporte de tres líneas: cómo está ahora, "
        "qué conviene ponerse para salir y si hace falta paraguas."
    )


if __name__ == "__main__":
    mcp.run()  # stdio por defecto
