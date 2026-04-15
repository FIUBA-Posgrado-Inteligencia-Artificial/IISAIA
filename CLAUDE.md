# Intro al Desarrollo de Software Asistido por IA

Presentaciones HTML (reveal.js) para un curso de 8 semanas.

## Folder Map

| Path | Purpose |
|------|---------|
| `programa.md` | Programa oficial del curso (fuente canonica de temas semanales) |
| `_config/` | Tema visual y convenciones de slides (estable, compartido) |
| `_config/slide-conventions.md` | Reglas de formato y estructura de slides |
| `_config/theme/` | CSS del tema (variables.css, custom.css) |
| `shared/templates/` | Template base de reveal.js para todas las semanas |
| `semanas/NN/` | Contenido de cada semana (notas, slides, imagenes) |
| `semanas/NN/CONTEXT.md` | Contrato de la semana: inputs, proceso, outputs |
| `semanas/NN/source_material/` | Material fuente para generar slides (index.md + contenido) |
| `semanas/NN/slides/` | Presentacion reveal.js generada |
| `semanas/NN/img/` | Imagenes de la semana |
| `docs/` | Documentos de diseno y planes |
| `tools/` | Scripts utilitarios (yt-transcript.py, etc.) |
| `tools/skills/` | Skill definitions para Claude Code (copiar a ~/.claude/skills/) |

## Routing Table

| Task | Read |
|------|------|
| Generate/edit slides for week N | `semanas/NN/CONTEXT.md` |
| Change theme or styling | `_config/theme/` |
| Check slide rules | `_config/slide-conventions.md` |
| Set up a new week | `shared/CONTEXT.md` + `programa.md` |
| Understand weekly topics | `programa.md` (schedule table at bottom) |

## Git Workflow

- Default branch: `main`. All work on feature branches, merge back to `main`.
- Never commit directly to `main`.

## Setup

After cloning:

```bash
# Install Claude Code skills
cp -r tools/skills/* ~/.claude/skills/

# Python tools (yt-transcript)
uv sync
```

## Run

```bash
npm start
```

Then open `http://localhost:3000/semanas/NN/slides/` in a browser.
