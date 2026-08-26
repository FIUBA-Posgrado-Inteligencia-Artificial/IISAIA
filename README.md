# Intro al Desarrollo de Software Asistido por IA

Presentaciones HTML (reveal.js) para un curso introductorio de 8 semanas sobre desarrollo de software asistido por IA.

## Ver las presentaciones

Para estudiantes que solo quieren abrir los slides en el navegador.

Requiere [Node.js](https://nodejs.org/).

```bash
npm install
npm start
```

Abrir `http://localhost:3000/semanas/NN/slides/` en el navegador (reemplazar `NN` por el numero de semana, ej. `01`).

Controles dentro de la presentación: flechas para navegar, `S` para abrir las notas del orador, `F` para pantalla completa, `Esc` para ver el overview.

---

## Desarrollo del curso

Setup adicional para generar nuevos slides o modificar los existentes con Claude Code.

### Instalación

Requiere además [uv](https://docs.astral.sh/uv/) y [Claude Code](https://claude.com/claude-code).

```bash
# Herramientas Python (yt-transcript, runpod-llama, etc.)
uv sync

# Skills de propósito general (opcional)
cp -r tools/skills/* ~/.claude/skills/
```

### Generar slides para una nueva semana

1. Crear `semanas/NN/` con `source_material/`, `slides/`, `img/`.
2. Agregar el contenido fuente en `source_material/` (un `index.md` con la estructura + archivos `.md` por sección).
3. Adentro de `semanas/NN/`, ejecutar `/build-class` en Claude Code. El skill `slide-generation` brainstormea el spine didactico (escrito a `spine.md` como checkpoint), escribe el plan, y genera `slides/index.html` sección por sección con review checkpoints.

### Estructura del proyecto

```
.claude/commands/        # Slash commands (/build-class)
.claude/skills/          # Skills de proyecto (slide-generation)
_config/theme/           # CSS del tema visual + components.css
docs/superpowers/        # Design specs e implementation plans
semanas/NN/
  source_material/       # Material fuente (markdown) que alimenta la generación
  slides/                # Presentación reveal.js generada
  img/                   # Imágenes
shared/patterns/         # Snippet library de patrones de slide
shared/templates/        # Template base de reveal.js
tools/runpod-llama.py    # Manager del pod con modelo Llama 70B
tools/skills/            # Skills de propósito general
```
