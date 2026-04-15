# Intro al Desarrollo de Software Asistido por IA

Presentaciones HTML (reveal.js) para un curso introductorio de 8 semanas sobre desarrollo de software asistido por IA.

## Setup

Requiere [Node.js](https://nodejs.org/) y [uv](https://docs.astral.sh/uv/).

```bash
# Dependencias del servidor de desarrollo
npm install

# Herramientas Python (yt-transcript, etc.)
uv sync
```

## Run

```bash
npm start
```

Abrir `http://localhost:3000/semanas/NN/slides/` en el navegador (reemplazar `NN` por el numero de semana, ej. `01`).

## Estructura del proyecto

```
semanas/NN/           # Contenido por semana
  slides/             # Presentacion reveal.js
  notas.md            # Guion de la clase
  img/                # Imagenes
_config/theme/        # CSS del tema visual
shared/templates/     # Template base de reveal.js
tools/                # Scripts utilitarios
```
