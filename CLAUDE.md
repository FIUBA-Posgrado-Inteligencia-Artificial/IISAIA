# Intro al Desarrollo de Software Asistido por IA

Presentaciones HTML (reveal.js) para un curso de 8 semanas.

## Folder Map

| Path | Purpose |
|------|---------|
| `programa.md` | Programa oficial del curso (fuente canonica de temas semanales) |
| `.claude/commands/` | Slash commands committed to the repo (e.g., `/build-class`) |
| `_config/` | Tema visual y convenciones de slides (estable, compartido) |
| `_config/slide-conventions.md` | Reglas de formato y estructura de slides |
| `_config/theme/` | CSS del tema (variables.css, custom.css, components.css) |
| `_config/theme/components.css` | Reusable CSS classes for slide components |
| `shared/templates/` | Template base de reveal.js para todas las semanas |
| `shared/patterns/` | HTML snippet library, one per recurring slide pattern |
| `semanas/NN/` | Contenido de cada semana (notas, slides, imagenes) |
| `semanas/NN/source_material/` | Material fuente para generar slides (index.md + contenido) |
| `semanas/NN/slides/` | Presentacion reveal.js generada |
| `semanas/NN/img/` | Imagenes de la semana |
| `semanas/NN/spine.md` | Spine didactico (output del Phase 1 de `/build-class`) |
| `semanas/NN/plan.md` | Plan de implementación (output del Phase 2 de `/build-class`) |
| `docs/` | Documentos de diseno y planes |
| `docs/superpowers/specs/` | Design specs producidos por brainstorming |
| `docs/superpowers/plans/` | Implementation plans producidos por writing-plans |
| `tools/` | Scripts utilitarios (yt-transcript.py, runpod-llama.py, etc.) |
| `tools/skills/` | Skills de proposito general, para instalar en `~/.claude/skills/` |
| `.claude/commands/` | Slash commands del proyecto (`/build-class`) |
| `.claude/skills/slide-generation/` | Skill de proyecto: envuelve el pipeline de superpowers para generar slides |

## Routing Table

| Task | Read |
|------|------|
| Build slides for a new week | Run `/build-class` inside `semanas/NN/` (after dropping content into `source_material/`) |
| Edit existing slides for week N | `semanas/NN/slides/index.html` + `_config/theme/components.css` + `shared/patterns/` |
| Pick a slide pattern | `shared/patterns/README.md` |
| Slide formatting rules | `_config/slide-conventions.md` |
| Slide voice + didactic principles | `.claude/skills/slide-generation/voice-and-didactics.md` |
| Speaker notes structure (3-format) | `.claude/skills/slide-generation/voice-and-didactics.md` |
| Animation contract + reuse policy | `.claude/skills/slide-generation/animation-pattern.md` |
| Spine schema (for Phase 1) | `.claude/skills/slide-generation/spine-template.md` |
| Change theme or styling | `_config/theme/` |
| Set up a new week's directory | `programa.md` + `shared/templates/week-template.html` |
| Understand weekly topics | `programa.md` (schedule table at bottom) |

## Git Workflow

- Default branch: `main`. All work on feature branches, merge back to `main`.
- Never commit directly to `main`.

## Setup

After cloning:

```bash
# Python tools (yt-transcript)
uv sync

# Skills de proposito general (opcional; slide-generation NO va aca,
# vive en .claude/skills/ y Claude Code la toma sola al abrir el repo)
cp -r tools/skills/* ~/.claude/skills/
```

## Run

```bash
npm start
```

Then open `http://localhost:3000/semanas/NN/slides/` in a browser.
