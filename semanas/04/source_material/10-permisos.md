# Permisos: control de tools con allow/deny/ask

> **Estado (2026-09-23).** El deck ya no sigue este archivo al pie de la letra; la descripción canónica de qué hay en cada slide es [`spine.md`](../spine.md). El bloque `permissions` de abajo es el del demo-repo eliminado. El del tp-final tiene 7 allow, 4 deny y 2 ask, y sus deny cuidan la base de puntajes y el plan congelado. La demo ya no usa `uv run pytest` (ese proyecto no tiene tests) sino `git commit`. La tabla de los seis permission modes se movió a §6 y la slide "Qué confunde" se eliminó.

## §1 Qué es

El sistema de permisos de Claude Code es el mecanismo que decide qué tools puede ejecutar el agente **sin pedirte confirmación**. Antes de cada tool call — antes de escribir un archivo, correr un comando Bash, o hacer un fetch a una URL — el runtime evalúa las reglas configuradas y toma una decisión: ejecuta solo, pregunta, o bloquea.

No es una lista de deseos ni una instrucción en texto para que Claude "sea cuidadoso". Es una regla aplicada por el runtime, fuera del control del modelo. Si una operación cae en `deny`, no importa que Claude haya decidido ejecutarla: no pasa.

La distinción importa porque el sistema de permisos actúa sobre el **loop**, no sobre el contexto. CLAUDE.md le dice al modelo cómo comportarse — instrucciones que el modelo lee y puede, en deriva, olvidar o malinterpretar. Los permisos actúan antes de que el modelo tenga chance de decidir: si la regla bloquea la herramienta, la herramienta no corre.

## §2 Dónde viven

Las reglas de permisos se definen dentro del campo `permissions` en cualquier `settings.json`, sin importar el nivel:

| Nivel | Path | Scope |
|---|---|---|
| Managed (enterprise) | Administrado por la organización | Todos los usuarios de la org |
| Local del proyecto | `.claude/settings.local.json` | El proyecto, solo en tu máquina |
| Proyecto | `.claude/settings.json` | El proyecto, todos los colaboradores |
| Usuario | `~/.claude/settings.json` | Todos tus proyectos |

Los cuatro niveles se mergean al arranque. Cuando un mismo permiso aparece en más de un nivel, el nivel Managed tiene precedencia absoluta: puede fijar un deny que ningún proyecto ni usuario puede levantar.

Además del archivo, existe el comando interactivo `/permissions` que permite ajustar la configuración durante una sesión activa — útil para habilitar un permiso puntual sin editar el archivo y reiniciar.

## §3 Cuándo se evalúan

Antes de cada tool call, el runtime aplica esta lógica en orden:

| Condición | Resultado |
|---|---|
| Matchea una regla `deny` | Bloqueado. Sin confirmación posible. |
| No matchea `deny` y matchea `allow` | Ejecuta sin preguntar. |
| No matchea `deny`, no matchea `allow`, matchea `ask` | Pide confirmación. |
| No matchea ninguna regla | Pide confirmación (el default es preguntar). |

**`deny` tiene precedencia sobre `allow`.** Si una operación matchea ambas listas a la vez — porque tenés un `allow` amplio y un `deny` más específico, o al revés — `deny` gana siempre. El orden de evaluación lo garantiza el runtime, no el modelo.

Un punto que confunde: el default **no es denegar**, es preguntar. Sin ninguna regla configurada, Claude pide confirmación para cualquier acción que actúe sobre el mundo. Eso puede volverse lento en proyectos donde corrés tests decenas de veces por sesión. El propósito de las listas `allow` es eliminar esos prompts donde ya sabés que querés darle autonomía.

## §4 Cómo se usa

La sintaxis es `Tool(pattern)`. El tool puede ser `Bash`, `Edit`, `Read`, `WebFetch`, entre otros. El pattern puede ser un comando exacto, un prefijo, o un glob de path.

El demo-repo tiene el bloque `permissions` completo en `.claude/settings.json`. Las tres listas, separadas visualmente:

**allow** — ejecuta sin preguntar:

```json
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
]
```

**deny** — bloqueado incondicionalmente:

```json
"deny": [
  "Read(./.env)",
  "Bash(rm -rf *)",
  "Bash(git push *)"
]
```

**ask** — pide confirmación antes de ejecutar:

```json
"ask": [
  "Bash(uv add *)",
  "Bash(uv remove *)"
]
```

Cada entrada tiene una razón concreta. `Bash(uv run pytest)` y su variante con wildcard de args cubren tanto la corrida sin parámetros como `uv run pytest tests/test_users.py -v`. `Edit(./backend/**)` le da autonomía para editar cualquier archivo dentro del backend, pero no fuera de él — un glob que no cruza el directorio raíz del proyecto. `Read(./.env)` en `deny` es la regla que impide que el agente lea el archivo con credenciales reales, sin importar lo que Claude proponga. `Bash(git push *)` también en `deny`: un push accidental puede ser muy costoso de revertir, y la confirmación manual vale la pena.

`Bash(uv add *)` y `Bash(uv remove *)` en `ask` son el punto intermedio: querés que el agente pueda agregar o quitar dependencias, pero no sin avisarte primero.

## §5 Casos límite / cosas que confunden

**Permission modes como overlay.** Por encima de las listas `allow/deny/ask`, Claude Code tiene un `permissionMode` que actúa como un dial de autonomía para toda la sesión. Los cuatro valores son `default`, `acceptEdits`, `plan` y `bypassPermissions`. Con `default`, las reglas de `settings.json` se aplican normalmente. Con `acceptEdits`, el agente puede editar archivos sin confirmación adicional. Con `plan`, el agente no ejecuta ninguna acción antes de presentarte un plan — esto se desarrolla en §13. Con `bypassPermissions`, saltea todas las reglas, incluyendo `deny`. Este último modo existe para entornos automatizados donde el código de control ya garantiza seguridad por otro mecanismo; usarlo en desarrollo interactivo elimina todas las protecciones.

**`Bash(*)` no existe como wildcard total.** No hay una entrada que le dé al agente permiso para ejecutar cualquier comando Bash sin restricciones. El wildcard `*` solo matchea el patrón donde está ubicado — matchea argumentos de un comando específico, no cualquier comando. Para darle autonomía en Bash, hay que ser explícito: `Bash(uv run pytest *)`, `Bash(git status)`, `Bash(uv sync)`. Si intentás usar `Bash(*)` esperando cubrir todo, el comportamiento no va a ser el que esperás.

**Wildcards no atraviesan `;` o `&&`.** Un wildcard en el pattern no le permite al agente encadenar comandos adicionales. Si `Bash(uv run pytest *)` está en `allow`, eso no cubre `uv run pytest && rm -rf .`. El runtime valida el comando exacto contra el pattern antes de ejecutar; la inyección de comandos por concatenación no funciona.

**El nivel Managed bloquea hacia abajo.** En un entorno corporativo, un administrador puede fijar un `deny` en el nivel Managed que ningún proyecto ni usuario puede sobreescribir. Si tu organización bloqueó `Bash(git push *)` a nivel Managed, no hay forma de habilitarlo desde el `settings.json` del proyecto. En proyectos personales esto no importa; en equipos con políticas de seguridad, define el techo.

## §6 Mini-demo en vivo

Vamos a ver el ciclo completo: un comando bloqueado, agregado al `allow`, y que ya pasa sin confirmación.

---

**Beat 1 — Sin permiso configurado: el prompt aparece**

*Qué hago:* Abrir una sesión nueva en el demo-repo con el `settings.json` simplificado — o uno vacío sin ninguna regla en `permissions`. Pedirle a Claude que corra los tests: `"corré los tests"`. El agente intenta `uv run pytest` y el runtime muestra el prompt de confirmación: `¿Permitir Bash(uv run pytest)?`. Negar.

*Qué digo:* *"Sin configuración, el default es preguntar. No bloqueó — preguntó. Esa es la diferencia entre deny y ausencia de allow."*

*Qué mirar:* El prompt exacto del runtime, el comando que propone Claude, y el hecho de que la negación no produjo error — simplemente no ejecutó.

---

**Beat 2 — Agregar el allow: pasa sin prompt**

*Qué hago:* Ejecutar `/permissions` para agregar `Bash(uv run pytest)` a la lista `allow`. Repetir el pedido: `"corré los tests"`. Esta vez el agente ejecuta directamente, sin prompt.

*Qué digo:* *"Un cambio en la configuración, y el agente tiene autonomía sobre ese comando específico. No sobre Bash en general — sobre ese comando."*

*Qué mirar:* La corrida de tests sin interrupción. El contraste con el Beat 1 es el punto: misma tarea, mismo agente, distinto nivel de autonomía configurado.

---

**Beat 3 — Agregar un deny: la precedencia**

*Qué hago:* Agregar `Read(./.env)` al `deny` vía `/permissions`. Pedirle a Claude que lea el archivo `.env`: `"mostrá el contenido de .env"`. El runtime bloquea la operación sin pedir confirmación.

*Qué digo:* *"Deny es distinto de ask. No pregunta. Bloquea. Y bloquea aunque haya un allow más amplio como `Read(./**)` — deny tiene precedencia."*

*Qué mirar:* El mensaje de bloqueo del runtime, y que Claude recibe ese bloqueo como respuesta — no puede ignorarlo ni rodearlo.

---

**Plan B si el flujo en vivo no coopera:** Abrir el `.claude/settings.json` del demo-repo y leer las tres listas en voz alta. Para cada entrada, explicar qué cubre y por qué está en esa lista. El comportamiento se sostiene con la lectura: el punto no es ver el runtime en acción, es entender la lógica de allow/deny/ask y la precedencia de deny.

---

Los permisos limitan qué tools usa el agente. Las skills hacen lo contrario: le dan procedimientos que no traía. El agente sabe correr comandos — las skills le enseñan cuándo y en qué orden. Eso es §11.
