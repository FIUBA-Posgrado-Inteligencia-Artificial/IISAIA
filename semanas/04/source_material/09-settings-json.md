# settings.json: configuración del runtime

## §1 Qué es

`settings.json` configura el **runtime** de Claude Code. No son instrucciones para el agente — eso es CLAUDE.md y `.claude/rules/`. Son parámetros del programa que envuelve al LLM: qué model usar, qué permisos tiene para ejecutar comandos, qué environment variables inyectar, qué scripts correr en cada evento del ciclo de vida.

La distinción es central. CLAUDE.md le dice a Claude *cómo comportarse*. `settings.json` le dice al runtime *cómo ejecutar a Claude*. Si CLAUDE.md es el contrato entre vos y el agente, `settings.json` es el contrato entre vos y el programa que corre ese agente.

Un ejemplo concreto: si querés que Claude nunca ejecute `git push` sin pedirte confirmación, no lo ponés en CLAUDE.md como instrucción de texto. Lo ponés en `settings.json` como regla de permiso — el runtime la aplica antes de que Claude siquiera intente ejecutar el comando. Una instrucción textual puede ser ignorada o mal interpretada; una regla de runtime no puede.

## §2 Dónde vive

El runtime carga `settings.json` desde cuatro niveles, en este orden de precedencia (de mayor a menor):

| Nivel | Path | Versionado | Scope |
|---|---|---|---|
| Managed (enterprise) | Administrado por la organización | No aplica | Todos los usuarios de la org |
| Local del proyecto | `.claude/settings.local.json` | **No** — va al `.gitignore` | El proyecto, solo en tu máquina |
| Proyecto | `.claude/settings.json` | Sí — commiteado al repo | El proyecto, todos los colaboradores |
| Usuario | `~/.claude/settings.json` | No — local a tu máquina | Todos tus proyectos |

Los cuatro niveles se mergean al arranque. Cuando un mismo campo aparece en más de un nivel, el nivel más alto gana. El nivel Managed puede bloquear completamente los niveles inferiores en materia de permisos — esto es relevante en equipos corporativos donde el administrador fija una política base.

## §3 Cuándo se carga

Al arranque de cada sesión. Claude Code lee todos los archivos `settings.json` disponibles, los mergea, y aplica la configuración resultante antes de procesar cualquier instrucción. No hay recarga en caliente: un cambio en `settings.json` toma efecto en la próxima sesión.

El merge sigue las reglas de precedencia de la tabla anterior. Si `~/.claude/settings.json` define `"model": "claude-haiku-4-5"` y `.claude/settings.json` del proyecto define `"model": "claude-sonnet-4-6"`, el proyecto gana — el nivel de proyecto es más alto que el de usuario en la jerarquía de merge.

## §4 Cómo se usa

Los campos más comunes son cinco. El primero es el más visible; el quinto impacta tanto que tiene sección propia (§10).

**`model`** — Define qué modelo usar en este contexto. El demo-repo usa `"model": "claude-sonnet-4-6"`, lo que garantiza que cualquier colaborador que abra el proyecto trabaje con el mismo modelo, sin depender de su configuración personal.

**`env`** — Environment variables inyectadas a Claude Code y a los tools que ejecuta. Útil para tokens de autenticación o URLs de servicios que el agente necesita para correr tests o llamar APIs. En el demo-repo:

```json
"env": {
  "DEMO_BEARER_TOKEN": "changeme-in-real-env"
}
```

El valor en el proyecto es un placeholder. El valor real va en `.claude/settings.local.json` — el archivo que no se commitea. Esa es la convención: el campo existe en el proyecto para documentar que la variable es necesaria; el valor sensible vive solo en la máquina de cada persona.

**`includeCoAuthoredBy`** — Booleano. Cuando es `true`, Claude agrega la línea `Co-Authored-By: Claude` en cada commit que genera. El demo-repo lo tiene en `true`; si preferís commits limpios sin esa línea, lo ponés en `false`.

**`cleanupPeriodDays`** — Retención de logs y transcripts locales, en días. El demo-repo usa `30`. Afecta solo el almacenamiento local; no tiene impacto en el comportamiento del agente.

**`hooks`** — Scripts del ciclo de vida del runtime: ejecutar algo antes de que Claude corra un comando, después de que termine una sesión, o cuando ocurra algún evento específico. Se mencionan acá; tienen documentación y configuración propia fuera del alcance de esta sección.

**`permissionMode`** — Modo de permisos default para la sesión: `default`, `acceptEdits`, `plan`, o `bypassPermissions`. Controla qué tan autónomo opera Claude Code al arranque. Se desarrolla en §13.

**`permissions`** — El campo más impactante. Define listas `allow`, `deny` y `ask` para operaciones específicas: comandos Bash, operaciones de archivo, dominios web. Se desarrolla en §10.

El `.claude/settings.json` completo del demo-repo:

```json
{
  "model": "claude-sonnet-4-6",
  "env": {
    "DEMO_BEARER_TOKEN": "changeme-in-real-env"
  },
  "includeCoAuthoredBy": true,
  "cleanupPeriodDays": 30,
  "permissions": {
    "allow": [
      "Bash(uv run pytest)",
      "Bash(uv run pytest *)",
      "Bash(uv run uvicorn *)",
      "Bash(uv run python *)",
      "Bash(uv sync)",
      "Bash(uv sync *)",
      "Read(./**)",
      "Edit(./backend/**)",
      "Edit(./frontend/**)",
      "Edit(./tests/**)",
      "Edit(./openapi.yaml)",
      "WebFetch(domain:fastapi.tiangolo.com)"
    ],
    "deny": [
      "Read(./.env)",
      "Bash(rm -rf *)",
      "Bash(git push *)"
    ],
    "ask": [
      "Bash(uv add *)",
      "Bash(uv remove *)"
    ]
  }
}
```

Y el `.claude/settings.local.json.example`, que documenta qué va en el nivel local sin exponer valores reales:

```json
{
  "permissions": {
    "allow": [
      "Bash(open http://localhost:8000)"
    ]
  }
}
```

El ejemplo muestra un permiso de abrir el browser — una operación específica de la máquina del desarrollador, sin sentido en un servidor de CI ni en la máquina de otro colaborador. Por eso va en el nivel local, no en el proyecto.

## §5 Casos límite / cosas que confunden

**Precedencia en permisos.** El nivel Managed puede marcar un permiso como denegado y los niveles inferiores no pueden sobreescribirlo. Un administrador que fija `"deny": ["Bash(rm -rf *)"]` en el nivel Managed está poniendo un techo que ningún proyecto ni usuario puede levantar. En proyectos personales esto no importa, pero en equipos corporativos define la política de seguridad base.

**`.local.json` siempre al `.gitignore`.** La convención es que todo lo específico de tu máquina — tokens reales, permisos de herramientas locales, paths absolutos — va en `.claude/settings.local.json`. El `.gitignore` del demo-repo ya tiene esa línea. Si accidentalmente commiteás ese archivo con un token real, ese token queda en el historial de git y hay que rotarlo.

**No confundir con `mcp.json`.** Los servidores MCP tienen su propio archivo de configuración (`mcp.json`), con un mecanismo distinto al de `settings.json`. Los dos archivos coexisten; ninguno reemplaza al otro. Los MCP servers se configuran y habilitan por separado — no son un campo de `settings.json`.

**`permissions` es el campo más impactante de todo el archivo.** La diferencia entre un agente que puede hacer `git push` sin confirmación y uno que siempre pide permiso está en tres líneas de `settings.json`. Vale una sección propia.

## §6 Mini-demo en vivo

Vamos a abrir los tres archivos de settings del demo-repo y ver cómo se mergean los niveles.

---

**Beat 1 — Los tres archivos, simultáneamente**

Abrir en VS Code, en paneles lado a lado: `~/.claude/settings.json` (nivel usuario), `semanas/04/demo-repo/.claude/settings.json` (nivel proyecto) y `semanas/04/demo-repo/.claude/settings.local.json` — o el `.example` si el `.local` no existe todavía en tu máquina.

Narrar qué campo va en cada nivel y por qué. `model` en el proyecto porque todos los colaboradores deberían usar el mismo. `DEMO_BEARER_TOKEN` con valor real en local, con placeholder en el proyecto. Los permisos de `open http://localhost:8000` en local porque abrir el browser es una operación de tu máquina, no del servidor de CI.

*"Tres niveles, tres responsabilidades. El proyecto define la base. Local agrega lo tuyo. Usuario te sigue a todos los repos."*

---

**Beat 2 — Cambiar un campo y ver que toma efecto**

Cambiar `cleanupPeriodDays` de `30` a `7` en `.claude/settings.json`. Reiniciar Claude Code — o abrir una nueva sesión. El campo nuevo está activo. Revertir el cambio.

La idea no es el campo en sí — es la mecánica: el runtime lee el archivo al arranque, no en caliente.

*"Un cambio, una nueva sesión, toma efecto. No hace falta reiniciar el sistema ni correr ningún comando."*

---

**Beat 3 — El `.gitignore`**

Abrir el `.gitignore` del demo-repo y buscar la línea `.claude/settings.local.json`. Está ahí desde el inicio. Mostrar que si corrés `git status` con el archivo local presente, no aparece en el output — git lo ignora.

Explicar por qué: ese archivo puede contener tokens reales, paths de tu máquina, permisos que solo tienen sentido en tu entorno. Si viajara al repo, contaminaría la configuración de todos los colaboradores y podría exponer credenciales.

*"La convención no es una opinión — es la única forma de que el esquema de niveles funcione bien en equipo."*

---

**Plan B si el demo se traba:** El argumento se sostiene solo con los archivos abiertos. Leer cada uno en voz alta y narrar la convención: proyecto define la base compartida, local agrega lo específico de la máquina, usuario persiste entre proyectos. No hace falta ejecutar ningún comando para que el punto quede claro.

---

El campo más impactante de todo lo que vimos en `settings.json` es `permissions`. Define exactamente qué puede hacer el agente sin pedirte confirmación, qué requiere tu aprobación explícita, y qué está bloqueado sin importar lo que Claude proponga. Vale una sección propia.

---

*Referencia: documentación oficial de settings en Claude Code — https://docs.claude.ai/en/docs/claude-code/settings*
