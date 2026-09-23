# §7 — CLAUDE.md

> **Estado (2026-09-23).** El deck ya no sigue este archivo al pie de la letra; la descripción canónica de qué hay en cada slide es [`spine.md`](../spine.md). Cambió el repo de las demos: los ejemplos de abajo son del `semanas/04/demo-repo/` eliminado. Hoy la demo corre sobre el tp-final de referencia (`semanas/00/source_material/apellido-iisaia/tp-final/`), que además tiene `CLAUDE.md` anidados en `backend/` y `frontend/`, así que la demo también muestra la carga bajo demanda. La slide "Qué confunde" de esta sección se eliminó.

## §1 Qué es

`CLAUDE.md` son archivos Markdown que Claude Code lee al arranque de cada sesión, antes del primer mensaje del usuario. Son texto que vos escribiste, inyectado directamente en la ventana de contexto.

## §2 Dónde vive

Cuatro niveles, concatenados en orden de más general a más específico:

| Nivel | Path | Quién lo escribe | ¿Se versiona? |
|-------|------|-----------------|---------------|
| Managed policy (admin) | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md` · Linux/WSL: `/etc/claude-code/CLAUDE.md` · Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Administrador de sistemas | — (fuera del repo) |
| User | `~/.claude/CLAUDE.md` | El desarrollador individual | — (personal) |
| Project | `./CLAUDE.md` o `./.claude/CLAUDE.md` | El equipo | Sí — va al repo |
| Local | `./CLAUDE.local.md` | El desarrollador, para ese proyecto | No — va al `.gitignore` |

El nivel managed policy lo establece un admin y el usuario no puede excluirlo. El nivel local es personal dentro de un proyecto específico: paths propios de la máquina, configuraciones que no querés en el repo, experimentos temporales.

## §3 Cuándo se carga

Al arranque de cada sesión, Claude camina hacia arriba desde el CWD hasta la raíz del sistema de archivos y recolecta cada `CLAUDE.md` que encuentra en el camino. El orden va de más general a más específico: primero lo que está cerca de la raíz, último lo que está más cerca del CWD. El resultado es **concatenación** — todos los niveles que aplican entran al contexto juntos.

Los `CLAUDE.md` que viven en **subdirectorios** del CWD no se cargan al arranque. Se cargan bajo demanda cuando Claude lee archivos que pertenecen a ese subdir.

## §4 Cómo se usa

**Imports.** Un `CLAUDE.md` puede incluir otros archivos con `@ruta/al/archivo`. La ruta puede ser relativa (se resuelve desde el archivo que importa) o absoluta. Los imports son recursivos hasta 5 niveles de profundidad.

**Comentarios HTML.** Los bloques `<!-- ... -->` se descartan antes de la inyección en contexto. Son útiles para notas a otros mantenedores del archivo sin gastar tokens.

**Guía de tamaño.** Menos de 200 líneas por archivo. Los archivos más largos tienden a reducir la adherencia de Claude a las instrucciones que contienen.

**Ejemplo concreto — `semanas/04/demo-repo/CLAUDE.md`.**

Este archivo es una instancia del nivel de proyecto. Cubre tres cosas: un folder map que mapea paths a responsabilidades, convenciones de código, y workflow de desarrollo. Algunos fragmentos representativos:

```markdown
## Folder map

| Path | Responsabilidad |
|------|-----------------|
| `backend/main.py`          | Entry point de FastAPI (CORS + routers) |
| `backend/routers/`         | Endpoints HTTP (`users.py`, `posts.py`) |
| `backend/middleware/auth.py` | Dependency de auth bearer |
| `backend/schemas/models.py` | Modelos Pydantic compartidos |

## Convenciones

- Python 3.11+. Type hints obligatorios en funciones públicas.
- Auth: bearer token leído de `DEMO_BEARER_TOKEN`. En tests, se setea `test-token`.

## Workflow

- Cambios en endpoints → regenerar `openapi.yaml` con `uv run python scripts/export_openapi.py`.
- Antes de un PR, correr `uv run pytest` y verificar que pasa.
```

Cuando Claude Code abre ese directorio, ya sabe que los routers viven en `backend/routers/`, cómo se llama el fixture de tests, y que no se hardcodea el bearer token — sin que el usuario se lo explique en el chat.

## §5 Casos límite / cosas que confunden

**Contradicciones entre niveles.** Si el nivel user dice "respondé en inglés" y el nivel project dice "respondé en español", ambas instrucciones entran al contexto. No hay error — hay comportamiento impredecible. Claude puede favorecer una u otra, o la que leyó último. La solución es revisar y limpiar instrucciones que se pisan entre niveles antes de que generen confusión.

**`@import` no ahorra contexto.** Este es el punto que más se confunde. Los archivos importados se expanden e inyectan en la ventana exactamente igual que el `CLAUDE.md` que los referencia. Dividir las instrucciones en varios archivos ayuda con la organización — un archivo por tema, más fácil de mantener — pero no reduce ni un token el costo en contexto.

**Auto memory es un sistema distinto.** Claude Code mantiene su propia memoria automática en `~/.claude/projects/<project-path>/memory/MEMORY.md`. A diferencia de `CLAUDE.md`, este archivo lo escribe Claude — no el usuario. Carga las primeras 200 líneas o 25 KB al inicio de cada sesión. Podés auditarlo con `/memory`.

## §6 Mini-demo en vivo

**Intro para el aula.** Vamos a ver que `CLAUDE.md` no es un diagrama de documentación: es texto real inyectado en la ventana antes de tu primer mensaje. Lo hacemos visible abriendo Claude Code en el demo-repo que ya tiene un `CLAUDE.md` de proyecto armado.

**Beat 1 — Qué hago / qué digo / qué mirar.**
Abro Claude Code dentro de `semanas/04/demo-repo/`. Ejecuto `/memory`.
*"Esto es la lista real de fuentes de instrucción cargadas en esta sesión, con sus rutas. Miren que aparece el CLAUDE.md del repo junto con el mío de usuario."*
Qué mirar: el nivel user (`~/.claude/CLAUDE.md`) y el nivel project (`demo-repo/CLAUDE.md`) listados con sus paths completos.

**Beat 2 — Qué hago / qué digo / qué mirar.**
Ejecuto `/context` si está disponible en la versión instalada.
*"Este es el delta de contexto atribuible a CLAUDE.md. El folder map, las convenciones, el workflow — todo aparece acá antes de que yo haya pedido cualquier cosa."*
Qué mirar: las líneas del folder map y las convenciones del demo-repo ocupando espacio en la ventana desde el inicio de la sesión.

**Beat 3 — Qué hago / qué digo / qué mirar.**
Navego a `~/.claude/projects/` y muestro la carpeta del demo-repo. Si existe `memory/MEMORY.md`, lo abro.
*"Este archivo lo escribió Claude, no yo. Es la auto memory — un sistema separado, auditable, pero completamente distinto a lo que yo puse en CLAUDE.md."*
Qué mirar: el contraste entre lo que escribiste vos (CLAUDE.md del proyecto) y lo que escribió Claude (MEMORY.md).

**Plan B.** Si `/context` no da el detalle esperado, quedarse con `/memory` solo. El punto de "siempre cargado" se sostiene narrando: *"todo lo que ven en esta lista entró a la ventana antes de este mensaje."*

---

`CLAUDE.md` cuesta contexto siempre — cada sesión, cada tarea, con o sin relevancia para lo que estás haciendo en ese momento. Si querés organización modular o costo cero hasta que la instrucción aplica, hay otra cosa: los Rules, que veremos en §8.

---

**Referencia:** https://code.claude.com/docs/en/memory
