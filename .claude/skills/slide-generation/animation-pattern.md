# Animation Pattern

Loaded by the `slide-generation` skill. Defines the contract that every interactive animation in a week's slide deck must follow, the catalogue of week 01 animations available for reuse, and the default policy for "reuse vs. build new".

## Contract

Every interactive animation lives in its own `.js` file inside the week's `slides/` directory. The file:

1. **Exports a single init function** named `init<Name>` (e.g., `initTokenizerAnim`, `initClickableSteps`).
2. **Accepts a config object** with at least `containerId`. Other options as needed.
3. **Listens to reveal.js lifecycle events** as needed: `Reveal.on('slidechanged', ...)`, `Reveal.on('fragmentshown', ...)`, `Reveal.on('fragmenthidden', ...)`.
4. **Manipulates the DOM directly.** No framework, no virtual DOM, no build step. Vanilla JS.

## Wiring into a slide

```html
<section>
  <h2>Título</h2>
  <div id="my-anim-container"></div>
  <aside class="notes">...</aside>
</section>
<script src="my-anim.js"></script>
<script>
  initMyAnim({ containerId: 'my-anim-container' });
</script>
```

## Catalogue of week 01 animations

Each entry: file → what it does → reusability.

| File | What it does | Reusable for |
|---|---|---|
| `tokenizer-anim.js` | Multi-stage explainer that loads a text file and walks through: plain text → UTF-8 codes → BPE chunks → token IDs. Manual prev/next buttons or auto-reveal. | Any "watch the data transform step by step" pattern. Generic. |
| `training-anim.js` | Plots loss curve over training steps and shows generated text at each checkpoint. | Any "live chart updates over time" pattern. Loss curve specifics are content; the chart-with-checkpoint pattern is reusable. |
| `inference-anim.js` | Simulates token-by-token generation with stochastic regeneration. | Any "token-by-token generation" or "stochastic process simulation". Generic. |
| `base-model-chat.js` | Connects to a vLLM endpoint and runs a 70B base model in real-time. Renders both pretty chat and raw token stream. | Content-specific (week 01 demo). Don't reuse without major adaptation. |
| `instruct-model-chat.js` | Same as base-model-chat but for the instruct-tuned variant. | Content-specific. Don't reuse. |
| `sft-anim.js` | Animated explainer of SFT: conversation serialization, loss masking, parameter updates. | Content-specific. Pattern of "step-by-step animation explainer" is reusable; SFT specifics are not. |
| `rl-anim.js` | Interactive walkthrough of RL verification loop. | Content-specific. The "step-by-step explainer with verification" pattern can inspire similar ideas in other weeks. |
| `deepseek-anim.js` | Visualizes DeepSeek R1 results — RL improving reasoning with longer chains of thought. | Content-specific. Don't reuse. |
| `clickable-steps.js` | Reusable component: row of clickable boxes; clicking one highlights it and shows a detail panel below. Tracks `activeIdx`. | Highly generic. Reuse for any "multi-step explainer with detail-on-click". |

## Default policy: reuse first, build new only when needed

When the spine says a section needs an animation:

1. **First check the catalogue.** Does `tokenizer-anim`, `clickable-steps`, or `inference-anim` fit the spine's description? If yes, copy the file into the new week's `slides/` directory and adapt the content (the data being transformed, the steps, the labels).
2. **If no existing animation fits, only then build new.** Build it as a new `.js` file in the new week's `slides/` following the contract above.
3. **Do not modify week 01 animations to be more "generic".** They're stable canonical examples; making them parametric would break week 01.

## When to flag an animation as a separate task in the plan

If a section's spine specifies a bespoke animation (not a copy-and-adapt of an existing one), the writing-plans phase should split it into its own task. Animations are higher-effort than slide markup; chunking them separately makes review easier.
