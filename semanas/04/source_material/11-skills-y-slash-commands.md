# Skills y slash commands

§10 mostró cómo las path-scoped rules cargan instrucciones cuando Claude toca ciertos archivos. Hay algo que ningún path puede capturar: un procedimiento completo — las fases, verificaciones y anti-patterns que definen cómo se hace un trabajo entero. Para eso existen las skills.

---

## §1 Qué es

Una **skill** es un procedimiento completo empaquetado como objeto de conocimiento. Tiene fases numeradas, checkpoints de verificación y una lista de anti-patterns explícita. No es una instrucción suelta ni una preferencia de estilo: es la descripción exhaustiva de cómo ejecutar un tipo de tarea específico.

Un **slash command** es un atajo. Puede invocar una skill, puede ejecutar instrucciones inline directamente, o puede disparar un comportamiento built-in del runtime. Su cuerpo es mínimo por diseño.

La distinción central: **skill ≠ slash command**. Una skill puede existir sin slash command (se activa por relevancia de tarea). Un slash command puede existir sin skill (instrucciones inline, o atajos a features del sistema). Cuando se usan juntos, la skill lleva el procedimiento y el slash command lleva solo la orden de invocación.

---

## §2 Dónde viven

| Artefacto | Scope de proyecto | Scope de usuario | Plugins |
|---|---|---|---|
| **Skill** | `.claude/skills/<nombre>/SKILL.md` | `~/.claude/skills/<nombre>/` | disponibles vía plugin |
| **Slash command** | `.claude/commands/<nombre>.md` | `~/.claude/commands/<nombre>.md` | disponibles vía plugin |

Las skills de usuario (`~/.claude/skills/`) están disponibles en cualquier proyecto donde trabajes. Las de proyecto (`.claude/skills/`) solo en ese repo. Lo mismo aplica a slash commands.

Este repo de curso tiene sus propias skills en `tools/skills/` — se instalan con `cp -r tools/skills/* ~/.claude/skills/`. El demo-repo tiene la suya en `.claude/skills/add-endpoint/`.

---

## §3 Cuándo se cargan

El punto que más importa para entender el modelo de contexto: **las skills no están cargadas al arranque**.

Al iniciar una sesión, Claude recibe solo el nombre y la descripción de cada skill disponible. El cuerpo de la skill — las fases, los checklists, los anti-patterns — no entra al contexto hasta que se invoca, o hasta que Claude determina por relevancia que la tarea la requiere.

Los slash commands aparecen en el autocomplete del input cuando escribís `/`. Tampoco consumen contexto hasta que los invocás.

Esto es diseño, no limitación. Lo que no usás no paga tokens. Si tenés cinco skills instaladas y estás haciendo debug de una ruta específica, las cuatro skills que no aplican no existen para esa sesión.

---

## §4 Cómo se usan

### Estructura de una skill: `add-endpoint`

El demo-repo tiene una skill concreta en `.claude/skills/add-endpoint/SKILL.md`. Su frontmatter:

```yaml
---
name: add-endpoint
description: Use when the user asks to add a new REST endpoint to the demo-repo backend. Adds the route, the schema if missing, the test, and regenerates openapi.yaml.
---
```

El cuerpo define seis fases ordenadas: confirmar verbo y path con el usuario, agregar schemas en `models.py` si hacen falta, agregar la función en el router con `response_model` y `status_code` explícito, agregar tests (happy path + error esperado), regenerar `openapi.yaml` con `uv run python scripts/export_openapi.py`, y verificar que `uv run pytest -v` pasa entero.

El bloque de anti-patterns lista exactamente qué no hacer: crear el endpoint sin test, olvidar regenerar el schema, dejar el endpoint sin `response_model`, hardcodear constantes que pertenecen a `models.py` o a una env var.

El slash command correspondiente vive en `.claude/commands/add-endpoint.md`:

```markdown
---
description: Agregá un endpoint nuevo siguiendo la skill add-endpoint
---

El usuario quiere agregar un endpoint al backend del demo-repo. Invocá la skill
`add-endpoint` y seguí sus fases.

Si el usuario no especificó verbo, path o body, preguntale antes de empezar.
```

Eso es todo el slash command. Nueve líneas. El procedimiento vive en la skill; el comando solo sabe que tiene que invocarlo.

### El mismo patrón a mayor escala: `build-class`

El repo del curso repite el mismo patrón. `.claude/commands/build-class.md` es mínimo — ordena invocar la skill `slide-generation`. El procedimiento completo (cuatro fases, checkpoint duro en `spine.md`, checklists de revisión por sección, lista de anti-patterns) vive en `tools/skills/slide-generation/`. Si mañana cambia el pipeline de generación de slides, se actualiza la skill — no el comando.

La separación no es cosmética: la skill es el conocimiento, el slash command es el disparador.

---

## §5 Casos límite y cosas que confunden

**No todo slash command invoca una skill.** `/memory`, `/context`, `/permissions` son atajos a comportamientos built-in del runtime. No hay ninguna skill detrás de ellos. El mecanismo es el mismo — un archivo en `.claude/commands/` — pero el cuerpo ejecuta instrucciones directas o llama features del sistema.

**El `description` de la skill determina la activación por relevancia.** Cuando Claude decide si una skill aplica a la tarea actual, lee el campo `description` del frontmatter. Una descripción vaga como "add endpoint" puede activar la skill cuando no corresponde, o no activarla cuando sí corresponde. La skill del demo-repo dice "Use when the user asks to add a new REST endpoint to the demo-repo backend" — específico. La convención "Use when X" no es estilo: es el contrato de activación.

**El flow de ejecución es lineal.** Cuando Claude entra en una skill, lee `SKILL.md` completo y ejecuta las fases en orden. Si la skill tiene seis fases, Claude ejecuta las seis. No saltea, no reordena, no improvisa dentro del procedimiento. Esa garantía es la razón de usar una skill en lugar de un prompt libre.

---

## §6 Mini-demo en vivo

**Intro para el aula:** La skill `add-endpoint` existe en el demo-repo, pero esta sesión no la conoce todavía. Vamos a ver el momento exacto en que entra.

---

**Beat 1 — La skill existe, la sesión no la conoce**

Abrir una sesión nueva en el directorio del demo-repo. Ejecutar `/context` para mostrar qué está cargado.

*Qué decir:* "Hay una skill instalada. No está en el contexto. No existe, para esta sesión, hasta que la pidamos. La ventana de contexto tiene el nombre y la descripción — no las seis fases."

*Qué mirar:* `SKILL.md` no aparece como fuente de instrucción cargada. Solo están `CLAUDE.md` y las reglas activas (`code-style.md`, `security.md`, `testing.md`).

---

**Beat 2 — Invocar la skill**

Escribir `/add-endpoint POST /comments` o describir la tarea en prosa: "agregá un endpoint `POST /comments` con body `title` y `body`, con dependencia auth".

*Qué decir:* "Ahora la pedí. Recién ahora paga su lugar en el contexto."

*Qué mirar:* Claude ejecuta las fases del `SKILL.md` en orden. Confirma el verbo y path, pregunta si el schema `CommentIn` existe en `models.py`, agrega el router, agrega los tests, regenera `openapi.yaml`, corre pytest. No inventa un orden propio.

---

**Beat 3 — La misma tarea sin la skill**

Abrir una sesión limpia, sin skills instaladas, y pedir lo mismo: "agregá un endpoint `POST /comments`".

*Qué decir:* "Sin la skill, Claude inventa un flow propio. Puede agregar el endpoint. Puede olvidar los tests. Puede olvidar regenerar el `openapi.yaml`. La skill no es una preferencia — es un procedimiento garantizado."

*Qué mirar:* La ausencia de fases explícitas. Claude puede dar un resultado correcto o puede no darlo, pero el procedimiento no está garantizado.

---

**Plan B:** Si la activación por relevancia no responde al pedido en prosa, usar el slash command directo `/add-endpoint` — fuerza la entrada de la skill al contexto sin depender del match por descripción.

---

## Transición a §12

Las skills aíslan un procedimiento: entran cuando se necesitan, no existen para el resto de la sesión. En §12 vamos a ver algo de distinta escala: no un procedimiento aislado del contexto, sino un loop completo corriendo separado del loop principal. Las skills aíslan un procedimiento. Los sub-agents aíslan un loop entero.

---

**Referencia:** https://docs.claude.ai/en/docs/claude-code/skills-and-slash-commands
