# Voice and Didactic Principles

Loaded by the `slide-generation` skill at the start of phase 1 (brainstorm) and consulted at every per-section review checkpoint in phase 3.

## Voice

- **Spanish, technical-but-accessible** for diploma-level students.
- **Second-person collaborative.** Address the student. "Vamos a ver", "podés probar", "recordá que".
- **Imperative for actions.** "Abrí Tik Tokenizer", "ejecutá el script", "mirá la salida".
- **Rhetorical questions for engagement.** "¿Qué pasa si...?", "¿Por qué la red predice esto?".
- **First-person plural for shared discovery.** "Vamos a abrir la caja negra", "estamos viendo cómo".

## Anti-AI-filler vocabulary

Never use:
- "revolucionario", "potenciar", "de vanguardia", "seamless", "robusto", "leverage", "streamline"
- "increíble", "asombroso", "espectacular" as filler intensifiers
- "Bienvenidos a esta increíble jornada de aprendizaje" — no welcome boilerplate.

CTAs and headings must be specific: "Ver tokenización en vivo", not "Empezar".

## Didactic principles distilled from week 01

1. **Hook before explanation.** Open a section with a mystery, question, or visual surprise when the section warrants it. Not every section. Never start with a definition.

2. **Why before what.** Motivate the filter before showing the filter. Motivate the algorithm before naming it. The student should understand the *problem the technique solves* before learning the technique's name.

3. **Layer-by-layer concept building.** Each slide assumes only what came before. Don't reference forward.

4. **Concrete numbers over abstractions.** "15 trillion tokens" not "a lot of data". "100,277 tokens" not "many vocabulary entries". "405B parameters" not "huge".

5. **Analogies bridge to the familiar.** Book pages = learning modes. Spiders = web crawl. Use one when it earns its keep — when an abstract idea becomes graspable through a concrete familiar domain. SKIP when the topic is already concrete enough that an analogy would dilute, not clarify.

6. **No bullet-list slides.** A slide whose entire content is a `<ul>` (with or without fragments) is a code smell. Replace with: a comparison-2col, a flow-with-arrows, a data-table, an annotated diagram, an animated demo. Visual structure carries the meaning.

7. **Live demo > prose explanation** when the concept is observable. If you can show inference happening, run inference. If you can show a tokenizer's output, embed the tokenizer animation.

8. **Code-and-effect concepts: show HTML → CSS → rendered result on the same slide.** Whenever a slide teaches a CSS property, layout primitive, or any "this code produces this visual" concept, the slide must contain three pieces:
   - **HTML markup** showing the target element (with its class).
   - **CSS rule** that applies to that target.
   - **Rendered visual result** built with real HTML/CSS so the student sees the actual output, not a description of it.
   Multiple variants on the same slide (different values producing different results) make the property's effect obvious. Hide the rendered result behind a fragment so the speaker can introduce the concept before the demo lands. Closing line ties the pattern to the prompt-engineering takeaway when relevant.
   Examples in semana 02: §3.2 box model (three buttons with different padding/border/margin), §3.3 flex/grid (HTML target + CSS + rendered layout), §3.4 typography/color (heading+body fonts; styled button), §3.5 CSS variables (one variable rendered with three values across three element trios).

9. **Closing prompt-comparison slide: reframe around determinism, not "vague → bad code".** Every major topic section that teaches vocabulary (HTML structure, CSS, JavaScript state, etc.) ends with a "Cómo le pedís X a una IA" slide that contrasts two prompts expressing the *same* intent:
   - **Prompt sin vocabulario**: plain language, no technical terms.
   - **Prompt con vocabulario**: same length, names the section's primitivas/concepts.
   Closing tagline: *"Vago = lotería. Específico = determinismo."* (Spanish; adjust for other languages.)
   Speaker notes must:
   1. Open by acknowledging the prompts have the same intent.
   2. **Honestly disclose** that modern LLMs (Claude, ChatGPT, Gemini) often return decent code for vague prompts on textbook cases — *do not pretend vague always fails*.
   3. Pivot to three reasons vocabulary still matters: **determinismo** (LLM defaults vary on less-common asks), **iteración** (next prompts need vocabulary to be cheap), **auditoría** (reading returned code requires the vocabulary).
   4. Tie the right-card prompt to the section's primitivas explicitly (e.g., "esto nombra layout, tipografía, variables y modelo de caja").
   Examples in semana 02: §2.5 (estructura), §3.7 (estilo), §4.7 (estado/DOM/eventos).

## Speaker notes structure

Speaker notes go in `<aside class="notes">` blocks. **Three visual formats** separate three kinds of content:

```html
<aside class="notes">
  <p><strong>Acciones a realizar — terse, imperative, concrete.</strong></p>
  <p><u>Descripción de qué es este slide — terse, concrete, no fluff.</u></p>
  <p><em>"Lo que sale de tu boca, conversacional, entre comillas."</em></p>
</aside>
```

Format meanings:
- **Bold** (`<strong>`): actions you perform. "Click para revelar fragmento 2." "Abrí Tik Tokenizer en otra pestaña." "Esperar 5s antes de avanzar." Imperative.
- <u>Underline</u> (`<u>`): description of what this slide is about / context for you. NOT spoken aloud. Used to refresh your memory at a glance.
- *Italic* (`<em>`): the script — what comes out of your mouth. Always between quotes, conversational Spanish.

**Each `<p><em>...</em></p>` block corresponds to one "press down arrow" boundary.**
On slides with fragments (progressive reveals), split the script into multiple short `<em>` blocks, one per reveal action. The first block is what you say while landing on the slide; each subsequent block is what you say *after* triggering the next reveal. Never write a single monolithic `<em>` block on a slide that has fragments — the speaker would have to read ahead to figure out where to press the arrow. Split it. On slides with no fragments, one `<em>` block is fine.

Concision rules:
- **Bold and underlined parts must be glanceable in under 2 seconds.** Specific and terse — no full sentences if a phrase will do. The non-spoken content is consumed *while you're already talking* — if you have to stop and read it, it's too long. If it's vague, it's not useful.
- **Italic (script) can be longer.** It's what you actually say. Use natural conversational Spanish — second-person ("vamos a", "podés"), rhetorical questions, the actual phrasing.
- Each format goes in its own `<p>` block for visual separation. Order: actions (bold), then description (underline), then script (italic).
- **Not every note needs all three.** Some slides only have a script (italic only). Some only have an action and a script. Use what serves the slide.
- **Don't paraphrase on-slide content in the script** — students can read the slide. Speak the connective tissue: why this slide matters, what to emphasize, the transition.

## Tone calibration

The voice is "smart professor talking to capable students who are seeing this for the first time". It is NOT:
- A textbook (too distant, too dense).
- A blog post (too casual, too marketing).
- A whiteboard scribble (too sparse, too unstructured).

It IS:
- A live lecture script written down.
- The professor's voice as they would speak it, with hooks, analogies, demos, and calls to do something.

## Anti-patterns to refuse

- Bullet-list slides
- Emojis in slide content (anywhere)
- AI-sounding filler vocabulary (above)
- Placeholder text in committed files
- Em-dash overuse — one per slide max
- Gratuitous gradients, glassmorphism, purple-dominant palettes
- Headings that don't inform ("Introducción", "Resumen", "Conclusión" without specifics)
