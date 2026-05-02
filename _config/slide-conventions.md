# Slide Conventions

Rules for generating and formatting reveal.js presentations.

## Language
- Spanish, technical but accessible for diploma-level students.
- No AI-sounding filler: "revolucionario", "potenciar", "de vanguardia".

## Slide Density
- One main concept per slide. If it needs scrolling, split it.
- Title slides: `h1` is the **topic title** (NOT "Semana NN"). The subtitle is a short tagline that captures the week's through-line. The week number lives in the document `<title>` tag only.
- Section divider slides: use `class="section-divider"` for major topic transitions.

## Headings
- Short, descriptive. No filler text.
- h1 for title slides only. h2 for slide headings. h3 for sub-points within a slide.

## Code Blocks
- Use reveal.js highlight plugin with language annotation.
- Add `data-line-numbers` attribute when highlighting specific lines.
- Keep code blocks under 15 lines per slide. Split into multiple slides if longer.

## Links
- Render as clickable `<a>` elements with descriptive text.
- Format: `<a href="URL" target="_blank">Descriptive Text</a>`

## Images
- Reference from `img/` folder relative to the slides directory.
- Use responsive sizing: `style="max-height: 50vh"`.
- Always include `alt` text.

## Speaker Notes
- Use `<aside class="notes">` inside each `<section>`.
- Contain the detailed explanation from the lecture draft.
- This is what the professor reads/says aloud. The slide shows only the key visual/concept.

## Progressive Reveals
- Use `class="fragment"` for building up concepts step by step.
- Use `class="fragment fade-in"` as default fragment style.

## Vertical Slides
- Use nested `<section>` for optional deep-dives.
- Example: a main slide introduces a paper, vertical slides show details.

## Transitions
- Use `none` or `fade`. No 3D or fancy transitions.

## Do NOT
- Add emojis to slides.
- Use gratuitous animations.
- Add placeholder or filler text.
- Use more than one font family.

## Related references

- `_config/theme/components.css` — CSS classes for slide components (pipeline, flow, chat-mockup, comparison, etc.).
- `shared/patterns/` — HTML snippet library for recurring slide patterns. See `shared/patterns/README.md`.
- `tools/skills/slide-generation/voice-and-didactics.md` — voice and didactic principles for slide content.
- `tools/skills/slide-generation/animation-pattern.md` — animation contract and reuse policy.
- `tools/skills/slide-generation/spine-template.md` — schema for the spine.md document produced by `/build-class`.
