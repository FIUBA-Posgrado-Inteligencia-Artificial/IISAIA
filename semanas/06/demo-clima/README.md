# Demo: server MCP de clima

Server MCP local (stdio) con una primitive de cada tipo. Datos de [Open-Meteo](https://open-meteo.com), sin API key.

| Primitive | Nombre | Quién la usa |
|-----------|--------|--------------|
| Tool | `clima_actual(ciudad)` | El modelo decide llamarla |
| Resource | `clima://ciudades` | El usuario la adjunta con `@` |
| Resource template | `clima://pronostico/{ciudad}` | El usuario la adjunta con `@` |
| Prompt | `reporte_clima(ciudad)` | El usuario lo dispara con `/` |

## Registrarlo en Claude Code

Requiere [uv](https://docs.astral.sh/uv/). El server ya viene registrado en el `.mcp.json` del repo (scope `project`):

```json
"clima": {
  "type": "stdio",
  "command": "uv",
  "args": ["run", "--script", "${CLAUDE_PROJECT_DIR:-.}/semanas/06/demo-clima/server.py"]
}
```

La primera vez que abras Claude Code en el repo te pide aprobarlo. Después verificá con `/mcp` que `clima` figure como conectado.

## Qué escribir en la demo

**Tool**: el modelo decide usarla.

```text
¿Qué temperatura hace en Montevideo?
```

**Resources**: los adjuntás vos con `@`, como si fueran archivos.

```text
Mirá @clima:clima://ciudades y decime cuál conviene visitar este fin de semana
Resumime @clima:clima://pronostico/Madrid
```

**Prompt**: aparece en `/` como `/clima:reporte_clima (MCP)`. Los argumentos se separan por espacios, así que las ciudades con espacio van con guion bajo.

```text
/mcp__clima__reporte_clima Buenos_Aires
```

## Probarlo sin Claude Code

```bash
npx @modelcontextprotocol/inspector uv run --script semanas/06/demo-clima/server.py
```
