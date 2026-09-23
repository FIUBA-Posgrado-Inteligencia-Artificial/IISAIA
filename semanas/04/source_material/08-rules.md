# Rules: instrucciones modulares por tema

> **Estado (2026-09-23).** El deck ya no sigue este archivo al pie de la letra; la descripción canónica de qué hay en cada slide es [`spine.md`](../spine.md). Los ejemplos de abajo (`code-style.md`, `testing.md`, `security.md`, `api.md`) son del demo-repo eliminado. El tp-final tiene dos rules: `api-y-datos.md` (sin frontmatter, siempre cargada) y `escenas-de-juego.md` (`paths:` a `frontend/js/games/**`). La slide "Qué confunde" se eliminó; su caso sobre compatibilidad entre herramientas vive ahora en el slide de equivalencias.

## §1 Qué es

`.claude/rules/` es el siguiente paso después de un CLAUDE.md monolítico. En lugar de un único archivo que crece sin control, el mecanismo permite archivos `.md` independientes, uno por tema — `code-style.md`, `testing.md`, `security.md`, `api.md` — que el runtime descubre y aplica sin configuración adicional. La modularidad es organizativa desde el arranque, y condicional cuando le agregás frontmatter YAML.

## §2 Dónde viven

Las reglas pueden vivir en dos lugares, descubiertos en orden de menor a mayor scope:

| Ubicación | Alcance | Versionado |
|---|---|---|
| `.claude/rules/` | Solo el proyecto actual | Sí (commiteado al repo) |
| `~/.claude/rules/` | Todos tus proyectos | No (local a tu máquina) |

El descubrimiento es recursivo en ambos casos: subdirectorios como `rules/backend/`, `rules/testing/`, `rules/deploy/` se procesan igual que la raíz. No hace falta ningún índice ni registro: si el archivo está ahí y tiene extensión `.md`, el runtime lo conoce.

## §3 Cuándo se cargan

El comportamiento de carga depende de si el archivo tiene frontmatter YAML o no.

**Sin frontmatter:** la regla se carga al arranque de cada sesión, con el mismo costo de contexto que CLAUDE.md. Siempre presente, siempre gastando tokens, sin condición.

**Con frontmatter `paths:`:** la regla es **path-scoped**. No entra al contexto al arranque. Entra cuando Claude toca un archivo que matchea alguno de los globs declarados — específicamente al leer, editar o escribir ese archivo. Si la sesión entera transcurre en el frontend, una regla de `backend/**` nunca aparece. Costo cero hasta que es relevante.

La diferencia de costo es concreta: una rule sin `paths:` se comporta exactamente como CLAUDE.md. La ventaja sobre CLAUDE.md monolítico es organizativa — un archivo por tema en lugar de un bloque gigante — pero el costo en tokens es el mismo. Para reducir ese costo, necesitás `paths:`.

## §4 Cómo se usan

El repo de demo tiene cuatro archivos en `.claude/rules/`:

| Archivo | Tipo | Se carga |
|---|---|---|
| `code-style.md` | Sin frontmatter | Al arranque, siempre |
| `testing.md` | Sin frontmatter | Al arranque, siempre |
| `security.md` | Sin frontmatter | Al arranque, siempre |
| `api.md` | Path-scoped | Solo al tocar `backend/**/*.py` |

Las tres primeras aplican a todo el codebase desde el inicio de sesión. `api.md` aplica exclusivamente cuando Claude accede a archivos del backend. Su frontmatter completo:

```yaml
---
paths:
  - "backend/**/*.py"
---
```

Seguido del cuerpo de la regla, que prescribe entre otras cosas que al tocar o agregar un endpoint hay que regenerar `openapi.yaml` con `uv run python scripts/export_openapi.py` y commitearlo en el mismo PR. Esa instrucción solo tiene sentido cuando se trabaja en el backend — y solo entonces llega al contexto.

Los globs soportados cubren los patrones habituales:

- `**/*.py` — todos los `.py` del árbol, sin importar profundidad
- `src/**/*` — todo lo que esté bajo `src/`
- `*.md` — markdown solo en la raíz del proyecto
- `src/**/*.{ts,tsx}` — expansión de llaves para TypeScript con JSX

El trigger es preciso: Read, Edit o Write sobre un archivo cuyo path matchee el glob. No cualquier herramienta sobre cualquier archivo — el match es por el path del archivo accedido.

## §5 Casos límite / cosas que confunden

**No es `.cursorrules`.** Cursor tiene su propio sistema de reglas con ese nombre, y no es compatible con Claude Code. Si encontrás tutoriales que mezclan `.cursorrules` con Claude Code, están confundiendo dos herramientas distintas con mecanismos independientes.

**Sin `paths:`, el costo en contexto es igual al de CLAUDE.md.** La ventaja de dividir `code-style.md`, `testing.md` y `security.md` en archivos separados es que el repo queda organizado por tema y es más fácil de mantener — no que los tokens bajan. Para reducir costo de contexto, necesitás `paths:`.

**El trigger es leer un archivo que matchee, no cualquier operación sobre el directorio.** Si le pedís a Claude que liste el directorio `backend/` o que corra un comando de shell que produzca output sobre archivos del backend, eso no activa una path-scoped rule. El trigger es acceder al contenido de un archivo — Read, Edit, Write — sobre un path que cae dentro del glob.

**`~/.claude/rules/` se carga antes que `.claude/rules/`.** Las reglas de usuario tienen prioridad en el orden de carga, aunque en la práctica ambas coexisten en el contexto sin conflicto explícito.

## §6 Mini-demo en vivo

Vamos a crear una regla que no está cargada y ver exactamente cuándo aparece.

---

**Beat 1 — La regla existe, pero no está cargada**

Abrir el árbol de `.claude/rules/` del repo demo. Los cuatro archivos están ahí. Abrir `api.md` para mostrar el frontmatter `paths: ["backend/**/*.py"]` y el cuerpo de la regla — especialmente la instrucción de regenerar `openapi.yaml`.

Ejecutar `/memory` antes de tocar ningún archivo. La salida lista las fuentes de instrucción cargadas en la sesión actual. `api.md` no aparece — está en el disco, pero no en el contexto.

*"La regla existe. Está en el directorio. Pero miren: no está cargada."*

---

**Beat 2 — Tocar un archivo que no matchea**

Pedirle a Claude que lea un archivo de `frontend/` — por ejemplo, `frontend/index.html`. Repetir `/memory`.

`api.md` sigue ausente. El acceso a un archivo fuera del glob no activó el trigger.

*"Tocó un archivo. Trabajó. Pero no era un archivo del backend. Sigue sin cargarse."*

---

**Beat 3 — Tocar un archivo que sí matchea**

Pedirle a Claude que lea `backend/routers/users.py`. Repetir `/memory`.

`api.md` ahora aparece cargada en la lista de fuentes. Si Claude edita código en ese archivo, va a incluir el `response_model` y el `status_code` explícito que la regla prescribe — y va a proponer regenerar `openapi.yaml`.

*"Ahora sí. Apareció cuando fue relevante. Costó cero contexto hasta ese momento. Eso es lo que CLAUDE.md no puede hacer."*

---

**Plan B si `/memory` no expone el detalle:** Si el comando no muestra la lista de fuentes con suficiente granularidad para ver el cambio, demostrar por comportamiento. `api.md` prescribe que al tocar o agregar un endpoint hay que regenerar `openapi.yaml`. Pedirle a Claude que modifique un archivo de `frontend/` — no propone regenerar el schema. Luego pedirle que toque `backend/routers/users.py` — ahora sí lo propone. El trigger condicional se demuestra por el efecto, no por la lista de fuentes.

---

Hasta acá, todo el mecanismo de contexto que cubrimos son instrucciones: archivos Markdown que le dicen al agente qué hacer y cómo hacerlo. Lo que viene en §9 es diferente en naturaleza. `settings.json` no le habla al agente — le habla al runtime. No es "cuando trabajes en el backend, hacé esto"; es "cuando Claude termine una sesión, ejecutá este hook". No instrucciones para el agente, sino configuración para el sistema que lo corre.

---

*Referencia: documentación oficial de memory en Claude Code — https://docs.claude.ai/en/docs/claude-code/memory*
