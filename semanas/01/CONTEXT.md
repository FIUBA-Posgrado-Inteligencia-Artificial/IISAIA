# Semana 1 — Funcionamiento de LLMs

## Inputs

| Source | Sections | Purpose |
|--------|----------|---------|
| `source_material/index.md` | All | Indice y estructura del contenido |
| `source_material/*.md` | All | Contenido de la clase |
| `../../programa.md` | Semana 1 row | Alcance y temas de la semana |
| `../../_config/slide-conventions.md` | All | Reglas de formato |
| `../../shared/templates/week-template.html` | All | Template base HTML |

## Process
1. Read `source_material/index.md` and then the referenced files to understand the content
2. Map sections to slides (one concept per slide)
3. Generate `slides/index.html` following conventions and template
4. Place detailed explanations in speaker notes
5. Use vertical slides for deep-dives (papers, datasets)
6. Reference images from `img/`

## Outputs

| Artifact | Location | Description |
|----------|----------|-------------|
| Presentation | `slides/index.html` | Reveal.js slide deck |
| Images | `img/` | Images referenced by slides |

## Topics
Introduccion al curso. Funcionamiento de LLMs. Tokens y tokenizacion. Naturaleza estocastica. Pre-training: escala de datos y deduplicacion, infraestructura de computo. Modelos base: autocompletado y cutoff date. Post-training: SFT, datasets conversacionales y de desarrollo de software. El "Yo" como simulacion. Alucinaciones: causas tecnicas y mitigacion (Search-grounding). RLHF. Razonamiento.
