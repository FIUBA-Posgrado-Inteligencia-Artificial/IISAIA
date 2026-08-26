# Spine Template

The schema for `semanas/NN/spine.md`. Phase 1 of the `slide-generation` skill produces this document. It is the hard checkpoint between brainstorm and generation.

## Template (copy verbatim, then fill in)

```markdown
# Spine — Semana NN: <Topic>

**Whole-week through-line:** <One paragraph. The single arc connecting all sections.>

## Section 1: <Title>
**Source material:** `source_material/01-...md`
**Through-line:** <One sentence — the section's argument or arc.>
**Hook:** <Optional. Only when it serves the section. Otherwise omit this line entirely.>
**Key analogy:** <Optional. Only when one fits naturally. Otherwise omit this line entirely.>
**What students walk away knowing:**
- <Bullet 1>
- <Bullet 2>
- <Bullet 3 — keep to 1–3 bullets>
**Animations / interactive:** <None | bespoke (describe what to build) | reuse-existing (which from week 01: tokenizer-anim / training-anim / inference-anim / clickable-steps / etc.)>
**Slide budget:** <rough count, e.g., 4–6>

## Section 2: <Title>
...

## Section N: <Title>
...
```

## Field meanings

- **Whole-week through-line:** The narrative spine of the entire week. The one sentence/paragraph a student would say if asked "what was this week about?" It's NOT a list of topics — it's the argument or arc.
- **Through-line (per section):** Same idea but for the section. What's the one thing this section is making the student understand?
- **Hook:** A specific question, mystery, or visual that opens the section and makes students lean in. OPTIONAL. Don't force one on every section.
- **Key analogy:** A bridge from a familiar concrete domain to the abstract concept. OPTIONAL. Only when one earns its keep.
- **What students walk away knowing:** 1–3 concrete take-aways. Concrete enough that you could test for them.
- **Animations / interactive:** Be specific. If reusing a week 01 animation, name the file. If building new, describe what it shows.
- **Slide budget:** A rough count to keep sections balanced. Not enforced — the executing phase may go over or under.

## What does NOT belong in the spine

- **Pattern sequence** ("section-divider, then comparison-2col, then..."). Generation-time decision; the executing phase picks patterns based on content.
- **Slide titles**. Same reason.
- **Speaker note drafts**. Same reason.
- **Code samples**. Generation-time.

The spine is *pedagogy*, not HTML structure.
