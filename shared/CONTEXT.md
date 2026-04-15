# Shared Resources

## Contents
- `templates/week-template.html` — Base reveal.js template. Copy to `semanas/NN/slides/index.html` and replace placeholders (NN, TOPIC_TITLE) to start a new week.

## How to Use
1. Create `semanas/NN/` with subfolders: `source_material/`, `slides/`, `img/`
2. Add source material markdown files to `source_material/` with an `index.md` listing the structure
3. Copy `templates/week-template.html` to `semanas/NN/slides/index.html`
4. Replace `NN` with the week number (e.g., `01`)
5. Replace `TOPIC_TITLE` with the week's topic from `programa.md`
6. Add slide `<section>` elements following `_config/slide-conventions.md`
