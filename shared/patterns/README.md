# Slide Pattern Library

Reusable HTML snippets for slide patterns extracted from semana 01. Drop a snippet into a week's `slides/index.html`, replace the placeholder content, and adjust as needed.

All snippets assume `_config/theme/components.css` is loaded by the page.

## Catalogue

| Pattern | When to use | Snippet | Canonical week 01 example |
|---|---|---|---|
| Title slide | Week opener | `title-slide.html` | line 256 |
| Section divider | Major topic transition | `section-divider.html` | line 420 (and 7 others) |
| Comparison 2-col | Contrasting two concepts | `comparison-2col.html` | line 917 ("Supervised vs Self-supervised") |
| Pipeline roadmap | Multi-stage process diagram with re-highlighting | `pipeline-roadmap.html` | line 319 ("Construyamos un LLM") |
| Flow with arrows | Sequential process | `flow-with-arrows.html` | line 1616 ("Conversaciones como datos") |
| Code walkthrough | Code block with optional line highlights | `code-walkthrough.html` | line 818 (tokenizer animation embed) |
| Chat mockup | Chat UI mockup with typing animation | `chat-mockup.html` | line 266 (hook slide) |
| Clickable steps | Multi-step explainer with click-to-reveal detail | `clickable-steps.html` | line 1895 ("Mitigación: enseñar a decir 'no sé'") |
| Data table | Numerical comparison | `data-table.html` | line 1261 ("Mismo stack, otra escala") |
| Metaphor pages | Concrete-domain metaphor (book pages) | `metaphor-pages.html` | line 2243 ("Del libro de texto a la práctica") |
| Five-questions card | Opener for documentation-walkthrough sections (qué es / dónde vive / cuándo se carga / cómo se usa / qué confunde) — full + mini variants | `five-questions-card.html` | semanas/04 §7 (`_section-7.html`, slides 1 & 2) |

## Adding a new pattern

When generating slides for a new week, if no existing pattern fits a slide, you may invent a new one — but:
1. Add a snippet file in this directory.
2. Add a row to the catalogue table above.
3. Add a leading HTML comment to the snippet file explaining when to use it and pointing to the first real-world example.

This keeps the catalogue growing instead of fragmenting.
