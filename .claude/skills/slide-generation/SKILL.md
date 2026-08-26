---
name: slide-generation
description: Use when working in semanas/NN/ directories to generate or refine reveal.js presentation slides for the AI-assisted development course. Wraps the superpowers pipeline (brainstorming → writing-plans → executing-plans → verification → finishing-branch) with slide-specific scaffolding for each phase. Triggered by /build-class. Includes a hard checkpoint at semanas/NN/spine.md before any slide HTML is generated.
---

# Slide Generation

Wraps the superpowers pipeline to turn `semanas/NN/source_material/` into `semanas/NN/slides/index.html` matching the course's established style and didactic voice.

## When to use

- User typed `/build-class` and the current working directory is `semanas/NN/`.
- User asked to "build slides for week N" or "generate the deck for semana N".
- User asked to refine an existing week's slides — in which case, skip phases 1-2 and go straight to phase 3 (execute) on the existing spine and plan, OR run a new spine if the request is large.

## Required context — load these BEFORE phase 1

Read these files at the start of every invocation:
- `semanas/NN/source_material/index.md` and the `.md` files it references
- `programa.md` — find the row for week NN (alcance + temas)
- `_config/slide-conventions.md` — formatting rules
- `.claude/skills/slide-generation/voice-and-didactics.md` — voice + didactic principles
- `.claude/skills/slide-generation/spine-template.md` — schema for spine.md
- `.claude/skills/slide-generation/animation-pattern.md` — animation contract + reuse policy
- `shared/patterns/README.md` — pattern catalogue

## Phase 1: Spine (wraps superpowers:brainstorming)

Invoke `superpowers:brainstorming` with these overrides:

1. **Design-doc target:** `semanas/NN/spine.md`. NOT `docs/superpowers/specs/`.
2. **Schema:** copy the structure from `spine-template.md` exactly. Whole-week through-line first, then per-section.
3. **Question order:**
   - First: propose 2-3 candidate **whole-week through-lines** (different framings of the arc), recommend one, get user agreement.
   - Then: per section in source-material order, ask spine-schema questions (through-line — required; hook — only if it serves the section; analogy — only if one fits; walk-aways — required; animation needs — required; slide budget — required).
4. **Skip these standard brainstorming questions:** "what's the architecture / how will it scale / what tech stack", which don't apply to slide work.
5. **Skip the per-section approach question.** The spine schema fields ARE the structured prompts at section level.

After spine.md is written, ask the user: *"Review and edit `spine.md`. Reply 'go' (or similar) when ready to plan."* This is the **hard checkpoint**. Do not proceed to phase 2 without explicit user approval.

## Phase 2: Plan (wraps superpowers:writing-plans)

Invoke `superpowers:writing-plans` with these overrides:

1. **Plan target:** `semanas/NN/plan.md`. NOT `docs/superpowers/plans/`.
2. **Task chunking:** one task per section in spine order. Plus:
   - First task: setup (verify `slides/index.html` exists or copy from `shared/templates/week-template.html`; verify `img/` exists).
   - Last task: coherence pass (verify section transitions, whole-week through-line is visible, no orphan animations).
3. **Per-task body:** references the corresponding spine entry; lists patterns from `shared/patterns/` likely to apply (concrete suggestions, not exhaustive); calls out any animations needed (reuse-existing or build-new); names speaker-note word target (~80–200 words/slide).
4. Hand straight to phase 3. No extra checkpoint here — the spine.md gate already happened.

## Phase 3: Execute (wraps superpowers:executing-plans)

Invoke `superpowers:executing-plans`. For each section task:

1. Re-read spine.md before starting (anti-drift).
2. Generate the section's slides into `semanas/NN/slides/index.html` (append, or insert at the right structural position).
3. Run the **per-section review checklist** below.
4. Show the section to the user; on approval, move to the next section.

### Per-section review checklist

- [ ] No bullet-list slides — every slide has visual structure (comparison / flow / pattern from `shared/patterns/`). Bullet lists with reveals are NOT acceptable.
- [ ] Voice matches `voice-and-didactics.md` — second-person collaborative ("vamos a", "podés", "recordá"), Spanish technical-but-accessible, no AI filler.
- [ ] One concept per slide.
- [ ] No emojis.
- [ ] Speaker notes follow the three-format structure: `<strong>` for actions (terse, glanceable), `<u>` for descriptions (terse, glanceable), `<em>` for spoken script (between quotes, conversational, can be longer). See voice-and-didactics.md.
- [ ] Section opens with hook from spine if spine specifies one.
- [ ] Key analogy from spine appears as a slide if spine specifies one.
- [ ] All "what students walk away knowing" bullets are addressed somewhere in the section.
- [ ] Patterns used are from `shared/patterns/` (or a new pattern is introduced AND added to the catalogue, not silently inlined).
- [ ] Inline `style="..."` is minimized — uses `_config/theme/components.css` classes where one exists.
- [ ] Animations follow the `init{Name}({ containerId })` contract from `animation-pattern.md`.

## Phase 4: Verify and finish

Invoke `superpowers:verification-before-completion` (open `slides/index.html` locally, walk through, check fragments fire, animations load, no console errors).

Invoke `superpowers:finishing-a-development-branch` (commit any final changes, optionally PR).

## Anti-patterns

- DO NOT generate slides without first writing spine.md and getting user approval.
- DO NOT skip the brainstorming phase even if user says "just generate the slides for week N". Push back: spine first, then slides. The spine is what makes the slides good.
- DO NOT replace any superpowers skill's behavior. Only override targets, schemas, and question scope.
- DO NOT silently invent new slide patterns. Add them to `shared/patterns/` with a row in the catalogue.
- DO NOT touch JS animations unless the spine explicitly calls for a new one.
