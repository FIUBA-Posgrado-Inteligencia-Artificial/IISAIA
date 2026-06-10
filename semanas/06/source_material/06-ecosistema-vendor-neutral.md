# El ecosistema y por qué viaja con vos

## Un server, muchos hosts

Si un MCP server expone tools y resources hablando el protocolo, cualquier host que también hable el protocolo lo puede consumir. Eso, en la práctica, significa esto:

El mismo binario de Playwright MCP, sin cambiar una línea, corre en Claude Code, Claude Desktop, ChatGPT, Visual Studio Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI y otros hosts. La doc oficial lo resume así: **"build once and integrate everywhere"**. La configuración cambia un poco entre hosts — cada uno tiene su archivo de settings — pero el server es el mismo.

## El config se ve casi igual en todos

Para meter un server en un host, el host suele leer un JSON parecido a este:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

Ese bloque, con variaciones cosméticas, es lo que ponés en Claude Code, en Cursor, en Cline. La estructura es estándar: el server tiene un nombre, un comando que lo arranca y opcionalmente argumentos y variables de entorno.

## Qué significa esto para vos

Tres cosas concretas.

**El esfuerzo de aprender a usar un server se amortiza en todos los hosts.** Si aprendiste a usar Playwright MCP en Claude Code, no tenés que reaprenderlo cuando pruebes Cursor. Es el mismo server, los mismos tools, los mismos nombres.

**El cambio de host no te cuesta tu ecosistema.** Si en algún momento querés probar otro agente, no perdés tu setup de MCP servers. Te llevás el JSON, lo pegás en el nuevo host y todo lo que ya tenías sigue funcionando.

**Lo que aprendiste sobre MCP no caduca cuando aparezca el próximo IDE con IA.** Mientras los nuevos hablen MCP — y lo van a hablar, porque es donde está el ecosistema — la mecánica sigue aplicando.

## MCP extiende, no reemplaza

Hay un equívoco común que vale aclarar antes de salir al ecosistema: **cada host trae su propio set de tools nativas, anteriores a MCP**. Claude Code, por ejemplo, viene de fábrica con tools para leer y escribir archivos (`Read`, `Write`, `Edit`), buscar contenido (`Grep`, `Glob`), ejecutar comandos (`Bash`), navegar el repo. Esas tools no son MCP — son parte del host, no se agregan ni se sacan.

Lo que MCP agrega es **extensión**: capacidades que el host no trae nativamente. La pregunta correcta antes de instalar cualquier MCP server es siempre la misma:

> **¿El host ya hace esto?**

Si la respuesta es sí, instalar el MCP server **duplica** y, peor, agrega complejidad (un proceso aparte, otra dependencia, otra superficie de seguridad). Si la respuesta es no, el MCP server **extiende** y vale la pena.

## Aplicado a Claude Code

Claude Code trae nativamente lo que cubre el grueso de las operaciones locales de un workflow de desarrollo: lectura, escritura, búsqueda, ejecución de comandos, navegación de repo, edición. Sobre esa base, algunos servers populares se vuelven **redundantes** y otros son **net-new**:

**Redundantes en CC** (el host ya lo hace):

- **filesystem** MCP — `Read` y `Write` ya están.
- **git** MCP — `Bash` con `git` ya está, y es más flexible.
- **fetch** MCP — `Bash` con `curl` ya está.

**Net-new sobre CC** (capacidad que el host no tiene):

- **playwright** — CC no maneja un browser.
- **context7** — CC tiene cutoff de entrenamiento, no conoce docs de SDKs nuevos.
- **postgres / sqlite** — CC no se conecta a tu base sin un puente.
- **slack** — CC no habla con Slack.
- **github** (versión MCP) — agrega operaciones que `gh` CLI no expone igual.

## ¿Por qué entonces existen filesystem y git como MCP?

Porque otros hosts no tienen lo que CC trae de fábrica. claude.ai (el chat), por ejemplo, no tiene `Bash`, no tiene `Read`, no tiene `Grep`. Un MCP `filesystem` en ese contexto es net-new: le da capacidades que el host no tenía.

La misma pieza, distinto valor según dónde la conectes. Esto es la consecuencia práctica de "build once and integrate everywhere": un server vale **lo que aporta sobre el host concreto que lo aloja**, no en abstracto. Mismo binario, distinto valor según el contenedor.

## El mapa rápido

Servers populares que ya existen, ordenados por valor en Claude Code:

**Tiene sentido instalar en CC:**

- **playwright** — controlar un browser (lo vemos en el demo)
- **context7** — docs actualizados de miles de SDKs (lo vemos en el demo)
- **postgres / sqlite** — query y schema introspection contra una base
- **github** — operaciones contra issues, PRs, repos
- **slack** — leer canales, mandar mensajes

**Redundante en CC, útil en hosts más finos:**

- **filesystem** — leer y escribir archivos
- **git** — leer historia, hacer commits, mirar diffs
- **fetch** — hacer requests HTTP

La próxima sección agarra dos de los net-new y los ponemos a andar.
