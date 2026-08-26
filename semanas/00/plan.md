# Plan — Semana 00: Presentación del curso

> **Estado: ejecutado.** El deck está construido y verificado. Este documento
> queda como registro de cómo se armó y con qué reglas, para quien lo edite
> después. Refleja el deck **as-built** de 5 slides, no el plan original de 11
> (ver `spine.md` para por qué se recortó).

**Goal:** `semanas/00/slides/index.html` — 5 slides que cubren el arco **promesa → criterio → acción** para dictarse en ~10 minutos al inicio del primer encuentro, antes de entrar a Funcionamiento de LLMs.

**Architecture:** Un único `index.html` escrito desde `shared/templates/week-template.html`. **No** usa el patrón `_scaffold.html` + `_assemble.mjs` de S04–S06: ese existe para decks de 50+ slides repartidos en fragmentos. Sin JS propio, sin animaciones.

**Spine:** `semanas/00/spine.md`.
**Source material:** `semanas/00/source_material/` — `index.md`, los 3 archivos numerados, y la estructura de referencia `apellido-iisaia/`.

---

## Global Constraints

- **Audiencia de conocimiento cero.** Es el primer bloque del curso. Es el espejo de la convención de S06 ("asumir nivel S04+S05"): acá **no se puede asumir nada**. Prohibido usar sin glosa: token, ventana de contexto, agente, loop, endpoint, commit, branch, repositorio, prompt engineering.
- **Meta-referencias al curso: permitidas acá, y sólo acá.** La regla general del proyecto prohíbe ubicar al alumno en el calendario. En este bloque el curso **es** el tema, así que nombrar "las ocho semanas" o "la clase 6" es contenido, no meta-narración. Sigue prohibido etiquetar el rol pedagógico de la slide en la slide.
- **La densidad vive en las notas, no en pantalla.** Es un bloque hablado de 10 minutos: la slide sostiene una idea y el resto lo dice el profesor. Ante la duda de si algo va en pantalla o en la nota, va en la nota.
- **Prohibidos:** vibe coding, diplomatura, payoff, bisagra, dolores, mismatch, diálogo socrático, scaffolding, andamiaje. Sin emojis. Sin marketing. Sin filler de bienvenida.
- **Sin bullet lists como contenido**, salvo los pasos numerados de la última slide (excepción declarada del manual de voz para enumeraciones).
- **Prefijar las clases propias con `.reveal`.** Sin eso, `.reveal p` de `custom.css` gana por especificidad y se come el color y el centrado. Este bug ya ocurrió una vez.
- **Las listas necesitan `display: block`** para centrarse: reveal.js las pone en `inline-block` y los márgenes `auto` no centran un inline-block.
- **Texto centrado fuera de cajas:** `max-width: 1000px` + `margin: auto` + `text-align: center`, igual que el resto de los decks.
- **Speaker notes en 3 formatos:** `<strong>` acciones / `<u>` descripción y material de reserva / `<em>` script hablado entre comillas, un `<em>` por fragment.

---

## As-built: las 5 slides

| # | Slide | Pattern | Fragments |
|---|-------|---------|-----------|
| 1 | Portada — nombre completo del curso | `title-slide` | 0 |
| 2 | La promesa, con el golpe en fragment | statement centrado | 1 |
| 3 | Cómo llegás hasta ahí — los tres movimientos | `pipe-grid` | 6 |
| 4 | Cómo se aprueba — tres entregas + criterio | `flow-step` | 2 |
| 5 | Esta semana — los tres pasos | pasos numerados | 4 |

**El `h1` de la portada es el nombre completo de la materia**, no un título temático. Es lo primero que ven los alumnos del curso y tiene que identificarlo sin ambigüedad. El número de semana vive sólo en el `<title>` del documento.

**La estructura del repositorio no está en ninguna slide.** Vive como carpeta real en `source_material/apellido-iisaia/`, con un README por entrega ya redactado. La slide 5 sólo dice dónde encontrarla.

---

## Verificación

El deck se verifica con la herramienta del repo, no a ojo:

```bash
npm start                 # en otra terminal
npm run shots 00          # una PNG por slide + detección de desborde
```

Salida esperada: `5 slides capturadas` y `Ninguna slide desborda`. El script revela todos los fragments antes de capturar, que es el estado en el que el desborde aparece.

Chequeos que el script **no** cubre y hay que hacer a ojo o con Playwright MCP: que el texto se lea proyectado, que el arco narrativo se sostenga, y el cronometraje real leyendo las notas en voz alta.
