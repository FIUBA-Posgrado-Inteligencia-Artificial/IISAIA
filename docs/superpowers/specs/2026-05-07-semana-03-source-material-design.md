# Semana 3 — Source material design

**Date:** 2026-05-07
**Author:** Enzo Pacilio (with brainstorming assist)
**Course:** Introducción a la ingeniería de software asistida por IA
**Week topic:** Arquitectura backend y datos

## Goal

Populate `semanas/03/source_material/` with content that `/build-class` can transform into a reveal.js presentation. The class is theory-heavy and closes with a live demo where Enzo uses Claude Code to spin up a backend + minimal frontend. Students do not code in class; their homework is to install Claude Code before semana 04.

## Context

- **Audience:** ~25 students, mixed prior backend exposure (most: none).
- **Class duration:** ~2 hours (120 min) on Google Meet.
- **Course thesis:** the student is "supervisor arquitectónico" — they direct AI, they don't write syntax.
- **Continuity with semana 02:** Semana 02 taught frontend vocabulary to direct AI in Canvas. Semana 03 mirrors that move on the backend side and pivots the course off the web sandbox onto the student's local machine.
- **Continuity with semana 04:** Semana 04 deepens AI-native IDEs (Cursor, Antigravity, agentic coding). Semana 03 does *not* compete with that — it sticks to Claude Code (CLI) as the honest, transparent first contact with local AI tooling.

## Non-goals

- Teaching students to hand-write FastAPI / Python / SQL. Same vocabulary-first stance as semana 02.
- The "single-file server" paradigm from the original `programa.md`. Dropped: forcing a single-file backend is contrived now that running a real local server with AI assistance is trivial. We embrace multi-file output from Claude Code.
- A graded group activity. Semana 02 had one because frontend in Canvas lent itself to it; backend in local + Claude Code does not, and there's no time once theory is properly dense.
- Security and authentication (4xx auth codes, injection, secrets). Owned by semana 07.
- IDE-AI features (rules files, composers, agentic planning). Owned by semana 04.

## Framing

**Vocabulary backend para supervisar.** Direct mirror of semana 02's framing. The student leaves the class able to *dictate contracts* (verb + path + input schema + output schema + status codes) to an AI, not able to write FastAPI. The class also performs the **bisagra to local**: it argues why a real backend pulls the work off Canvas and onto the student's machine, and why a CLI-based AI tool is the cleanest first step into that world.

## Class structure (120 min total)

| # | File | Topic | Min |
|---|------|-------|-----|
| 1 | `01-backend-y-el-supervisor.md` | Apertura. Why backend vocabulary matters when the AI writes the code. Mirror of semana 02's `01-frontend-y-el-supervisor.md`. Promise of the class: you'll learn to dictate contracts, not to type FastAPI. | 10 |
| 2 | `02-cliente-servidor-y-http.md` | Client-server model. HTTP as request/response protocol. Verbs (GET/POST/PUT/PATCH/DELETE) as the nouns of work. Status codes (2xx/4xx/5xx) as the vocabulary of failure. | 15 |
| 3 | `03-rest-como-estilo.md` | REST as architectural style. Resource as the central abstraction. URL hierarchy (`/users/123/posts`). Idempotency. Statelessness. Why most APIs you'll direct speak REST. | 12 |
| 4 | `04-rutas-controladores-y-contratos.md` | Endpoint = verb + path + input schema + output schema + possible status codes. The "contract" as the dictable unit you hand to the AI. Pseudocode, not Python. | 12 |
| 5 | `05-datos-relaciones-vs-documentos.md` | Why persist. SQL (tables, schemas, foreign keys) vs NoSQL (documents). Minimal domain modeling. SQLite as the honest entry point. | 15 |
| 6 | `06-errores-y-observabilidad.md` | When something fails: 4xx (client's fault) vs 5xx (server's fault), logs, stack traces. Vocabulary to *ask* the AI what went wrong. | 10 |
| 7 | `07-de-lo-local-al-stack.md` | Bisagra in two beats. **(a)** Why Canvas is no longer enough — your machine, processes, files, real persistence. Why CLI with AI (Claude Code) and not a web IDE for this first step. **(b)** Stack map: Python+FastAPI (what the demo uses) plus alternatives (Node+Express, Django/Flask, Go, Rails) — the point is to locate FastAPI as one choice among many. Homework: install Claude Code before semana 04. | 12–15 |
| 8 | `08-demo-en-vivo.md` | Live demo guion. Pre-planning (what Enzo will dictate), execution, deliberate pauses to point out each concept as it appears in the generated code (verbs, routes, schema, errors). Concrete app TBD. | 30–35 |

Total: ~115–125 min.

## File and artifact layout

```
semanas/03/source_material/
├── index.md                              # reading order, hilo conductor
├── 01-backend-y-el-supervisor.md
├── 02-cliente-servidor-y-http.md
├── 03-rest-como-estilo.md
├── 04-rutas-controladores-y-contratos.md
├── 05-datos-relaciones-vs-documentos.md
├── 06-errores-y-observabilidad.md
├── 07-de-lo-local-al-stack.md
└── 08-demo-en-vivo.md
```

No `demo.html`-equivalent artifact: the demo here is generated live by Claude Code in front of the class, not pre-built and dissected. The guion in `08-demo-en-vivo.md` is the only artifact; the actual code that comes out is ephemeral teaching material, not a take-home reference.

## Recurring slide patterns to apply

These come from `feedback_*` memories and are non-negotiable conventions:

- **Closing prompt-comparison per section.** Each conceptual block (02–06) ends with a "vago vs específico" pair of prompts framed around determinism / iteration / auditability, with honest LLM disclosure.
- **No bullet-point slides.** Visual structure required. Diagrams for the request/response cycle, REST resource trees, SQL vs NoSQL contrast, error flow.
- **Code-and-effect pattern.** When showing "this contract produces this response," show the route definition + a sample request + a sample response on the same slide, with the response fragment-hidden until reveal.
- **Hooks without jargon, without meta-narration.** No "in this section we will cover..." Each opening slide stands cold.
- **No "diplomatura", no "vibe coding", no "payoff" in slide content.** Use "este curso" / "estas ocho semanas" / "recompensa" or "sentido".

## Key decisions log

| Decision | Rationale |
|----------|-----------|
| Hilo conductor: vocabulary backend para supervisar | Direct mirror of semana 02. Keeps the course's thesis consistent and lets students re-use their semana 02 mental model. |
| Drop single-file server paradigm | Contrived now that local + AI tooling is trivial. Forced constraint solving a problem the student no longer has. |
| Drop graded group activity | Backend in local + CLI AI doesn't lend itself to a 60-min Canvas-style breakout. Time better spent on dense theory + a demo that delivers the punchline. |
| Bisagra (file 07) before the demo, not after | Justifies the local pivot while there's still conceptual air. After the demo it would feel like an afterthought. |
| REST as its own block, not folded into HTTP | REST is a distinct architectural style (resource, idempotency, statelessness). Conflating it with HTTP plumbing has been a source of confusion in students who later interact with non-REST APIs. |
| Errors as their own block | "Supervisar" includes reading failures. Students need vocabulary to converse with the AI when a POST returns 500. Not optional. |
| Claude Code (CLI) for the demo, not Cursor/Antigravity | Honesty: terminal shows every file created and every command run. Reinforces "vocabulary to supervise" because there's no UI magic. Frees semana 04 to present graphical IDE-AI as a real upgrade. |
| Demo app deferred | Requirements are fixed (3+ verbs, ≥1 inter-table relation, ≥1 visible error path, minimal frontend that consumes the API, non-trivial domain). Concrete domain decided at implementation time. |
| No mention of auth/security | Owned by semana 07. Mentioning in passing risks confusion and drains time budget. |

## Open items (resolved at implementation time)

- **Demo domain.** Constraints listed above. Should not be a to-do list ("trivial and boring", per Enzo). Should justify the class.
- **Per-block exact word counts and slide counts.** Determined when `/build-class` runs the spine phase.

## Success criteria

1. After the class a student can verbally specify a REST endpoint to an AI without writing code: "POST `/projects/{id}/tasks`, body has `title` and `due_date`, returns 201 with the created task or 400 if `title` is missing."
2. A student knows why their next class needs Claude Code installed locally and not a Canvas tab.
3. A student can read a 4xx vs 5xx response and tell the AI which side made the mistake.
4. The demo lands as the punchline of the theory, not as a separate "look what AI can do" interlude.
