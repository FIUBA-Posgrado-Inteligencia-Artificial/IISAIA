# Plan — Semana 06: Model Context Protocol (MCP)

> **For agentic workers:** REQUIRED SUB-SKILL: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar tarea por tarea. Steps usan checkbox `- [ ]`.

**Goal:** Generar `semanas/06/slides/index.html` con 11 secciones que cubran el arco **problema → insight → mecánica → ecosistema → uso → calibración** del spine, ensambladas desde fragmentos `_section-N.html` vía el patrón establecido en S04/S05 (`_scaffold.html` + `_assemble.mjs`). Salida final: deck reveal.js corriente abrible desde `npm start`.

**Architecture:** Un fragmento HTML por sección. Setup (Task 0) clona el scaffold de S05 con markers para §§1-11. Cada sección sigue el slide arc definido por el spine. **Elementos visuales recurrentes:**

- **Diagrama de arquitectura host/client/server** introducido en §5 como contenedor visual reusable; re-iluminado en §6 (foco en server) y §7 (foco en handshake). Construcción CSS pura con clases `.mcp-arch` + modificadores de foco (`.focus-server`, `.focus-handshake`).
- **Matriz N×M → N+M** introducida en §4 como argumento estructural; reaparece en §8 como cierre del argumento de portabilidad. Construcción CSS pura.
- **Diagrama del intercambio** establecido formalmente en §7 (via animación `clickable-steps.js`); referenciado como slide-de-cierre "qué viste" en §9 y §10.

**Tech stack:** reveal.js, `_config/theme/components.css`, `shared/patterns/`. **Una sola animación JS:** `clickable-steps.js` adaptado para el handshake del §7 (4 steps: `initialize` / `tools/list` / catálogo→LLM / `notifications/tools/list_changed`). Si el budget no aguanta, fallback CSS-only con fragment-reveals (documentado en Task 7).

**Spine:** `semanas/06/spine.md`.
**Source material canónico:** `semanas/06/source_material/index.md` y los 11 archivos numerados.

---

## Conventions for execution

- **Diagrama host/client/server recurrente.** Pattern: nuevo constructo CSS `.mcp-arch` con sub-elementos `.mcp-host` (contenedor exterior), `.mcp-client` (cards adentro del host, uno por server), `.mcp-server-local` y `.mcp-server-remote` (rectángulos aparte). Flechas bidireccionales etiquetadas JSON-RPC entre cliente y server. **Tres estados de foco** controlados por clase en `.mcp-arch`:
  - **`.mcp-arch.focus-default`** — todos los elementos opacos (estado §5).
  - **`.mcp-arch.focus-server`** — host y clientes en `opacity: 0.45`, servers destacados (estado §6, cuando hablamos de primitives expuestas por el server).
  - **`.mcp-arch.focus-handshake`** — flechas JSON-RPC destacadas; host/client/server en plano (estado §7, opener cuando hablamos del handshake).
  Definir las clases en `_config/theme/components.css` en Task 0 Step 7. Re-iluminación es CSS puro (no JS).

- **Diagrama N×M → N+M.** Pattern: nuevo constructo CSS `.protocol-matrix`. Dos estados:
  - **`.protocol-matrix.state-nm`** — N clientes × M proveedores, líneas cruzadas todas con todas (visual de "spaghetti").
  - **`.protocol-matrix.state-nplusm`** — N clientes + M proveedores, todas pasando por un bus central etiquetado "MCP" (visual de "hub").
  En §4: arranca con `.state-nm`, fragment-reveal cambia a `.state-nplusm`. En §8: se reusa `.state-nplusm` mostrando el server-central con flechas a N hosts, cerrando el argumento.

- **Estilo (memorias activas):** Argentine Spanish, voseo. Inglés para términos técnicos (host, client, server, transport, primitive, tool, resource, prompt, schema, capability, handshake, discovery, notification, stdio, HTTP, JSON-RPC, MIME type, URI). Capitalización canónica: **MCP Host / MCP Client / MCP Server**, **Stdio transport / Streamable HTTP transport**, **data layer / transport layer**, **model-controlled / application-controlled / user-controlled**.
  **Prohibidos:** payoff, vibe coding, diplomatura, bisagra, dolores ("complicaciones" en su lugar), "esta clase / esta semana / del curso / la firma de esta clase / primer slide", scaffolding, andamiaje, mismatch ("desfasaje" en su lugar), diálogo socrático ("preguntas dirigidas" en su lugar). Sin emojis. Sin meta-referencias al curso. Sin marketing ("el más completo / popular"). Sin mención al TP final en texto visible.

- **Demos solo en §§9-10.** Per memoria `feedback_demos_only_in_part_2`, los demos en vivo van en la Parte 4 del deck. Las secciones §§1-8 son conceptuales (sin terminal/browser compartido). El §11 cierra; tampoco lleva demo.

- **Speaker notes (3-formato):** `<strong>` acciones / `<u>` descripción / `<em>` script entre comillas. Un `<p><em>...</em></p>` por reveal/fragmento (per memoria `feedback_speaker_notes_one_em_per_reveal`). Target: **~80–200 palabras por slide**; slides con demo o de apoyo a demo en vivo ~60–90.

- **Hooks decididos en el spine** (no negociar):
  - §1 — los tres "no puedo" concretos como apertura.
  - §3 — pregunta dirigida "¿cómo programás vos cuando usás una librería que conocés a medias?"
  - §7 — la pregunta del cutoff como apertura ("¿cómo es que el LLM puede usar tools publicados después de su cutoff?").
  - §10 — las alucinaciones de API como apertura.

- **Openers SIEMPRE sin bullets**. Visual structure (comparison, flow, diagrama, frase grande). Bullets aceptables solo en slides "qué es" de definición o "tres cosas que" enumerativos del manual de voz.

- **Tamaños de body text** (per memoria `feedback_slide_text_sizing`): body principal ≥1.1rem, secundario ≥1.05rem, eyebrows ≥0.85rem.

- **Sin `<span>` dentro de `<pre><code>`** (per memoria `feedback_pre_code_no_inline_spans`): el highlight plugin escapa el HTML. Para terminal-output coloreado usar `<div>` con `white-space: pre-wrap`.

- **No mencionar otras semanas o el TP final** en slides visibles.

---

## Task 0 — Scaffold + assembler + stubs + diagramas CSS base

**Files:**
- Create: `semanas/06/slides/_scaffold.html`
- Create: `semanas/06/slides/_assemble.mjs`
- Create: `semanas/06/slides/_section-1.html` a `_section-11.html` (stubs)
- Create: `semanas/06/slides/clickable-steps.js`
- Verify/extend: `_config/theme/components.css` con clases `.mcp-arch`, `.protocol-matrix`

**Steps:**

- [ ] **Step 1: Copiar `_scaffold.html` desde S05 como base.**
  ```bash
  cp semanas/05/slides/_scaffold.html semanas/06/slides/_scaffold.html
  ```
  Editar `<title>` a `Semana 06 — Model Context Protocol (MCP)`. Mantener el block de `<style>` safety net (overflow + pre/code wrapping). **Quitar** los `<style>` específicos de S05 que no se usen acá (las clases de `.pipe-grid.highlight-sN` siguen vivas en `components.css` global pero no se usan en S06).

- [ ] **Step 2: Reemplazar el title slide** por:
  ```html
  <section class="title-slide">
    <h1>Model Context Protocol</h1>
    <p class="subtitle">Cómo el LLM extiende lo que ve y lo que toca, sin atarse a un vendor.</p>
    <p class="muted">Introducción al desarrollo de software asistido por IA</p>
  </section>
  ```
  El `<h1>` es el topic (sin "Semana 06" — esa info vive solo en `<title>`).

- [ ] **Step 3: Reemplazar los markers `<!-- INJECT_SECTION_N -->`.** El scaffold de S05 tiene `INJECT_SECTION_1` a `_15`. Editar a `_1` a `_11`. Cada bloque queda como:
  ```html
  <!-- ===== §N — <título corto> ===== -->
  <!-- INJECT_SECTION_N -->
  <!-- /§N -->
  ```
  Títulos cortos en orden:
  1. El LLM no ve tu mundo
  2. La trampa del context window
  3. Separar conocimiento de acción
  4. Protocolo, no API
  5. Arquitectura
  6. Las tres primitives
  7. Discovery dinámico
  8. Ecosistema + qué vale instalar
  9. Demo Playwright
  10. Demo context7
  11. Cuándo MCP, riesgos

- [ ] **Step 4: Copiar `_assemble.mjs` desde S05** y editar:
  - Cambiar `for (let n = 1; n <= 15; n++)` por `for (let n = 1; n <= 11; n++)`.
  - Mantener el wiring de `clickable-steps.js` (se usa en §7).

- [ ] **Step 5: Copiar `clickable-steps.js`** desde S05 o S04:
  ```bash
  cp semanas/05/slides/clickable-steps.js semanas/06/slides/clickable-steps.js
  ```
  No editar todavía — la adaptación al handshake del §7 vive dentro del fragment de §7 (parametriza por contenido, no por modificación de la JS).

- [ ] **Step 6: Crear stubs `_section-1.html` a `_section-11.html`** — cada uno con `<section><h2>§N — TODO</h2></section>` para que el assembler corra sin warnings.

- [ ] **Step 7: Agregar CSS para `.mcp-arch` y `.protocol-matrix`** en `_config/theme/components.css`.

  **`.mcp-arch`** — diagrama host/client/server recurrente. Spec:
  ```css
  .mcp-arch {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 2rem;
    align-items: center;
    padding: 1.5rem;
  }
  .mcp-arch .mcp-host {
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 1.25rem;
    background: var(--surface-1);
  }
  .mcp-arch .mcp-host > .label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }
  .mcp-arch .mcp-clients {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .mcp-arch .mcp-client {
    border: 1px dashed var(--muted);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.95rem;
  }
  .mcp-arch .mcp-servers {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .mcp-arch .mcp-server-local,
  .mcp-arch .mcp-server-remote {
    border: 2px solid var(--accent-2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    background: var(--surface-2);
  }
  .mcp-arch .mcp-server-local::before { content: "stdio"; ... }
  .mcp-arch .mcp-server-remote::before { content: "HTTP"; ... }
  .mcp-arch .jsonrpc-arrow { /* línea SVG o ::before/::after, bidireccional, label "JSON-RPC" */ }

  /* Estados de foco */
  .mcp-arch.focus-default .mcp-host,
  .mcp-arch.focus-default .mcp-client,
  .mcp-arch.focus-default .mcp-server-local,
  .mcp-arch.focus-default .mcp-server-remote { opacity: 1; }

  .mcp-arch.focus-server .mcp-host,
  .mcp-arch.focus-server .mcp-client { opacity: 0.45; }
  .mcp-arch.focus-server .mcp-server-local,
  .mcp-arch.focus-server .mcp-server-remote {
    opacity: 1;
    box-shadow: 0 0 0 3px var(--accent);
  }

  .mcp-arch.focus-handshake .jsonrpc-arrow {
    /* destacar las flechas: animación pulse o color brillante */
  }
  .mcp-arch.focus-handshake .mcp-host,
  .mcp-arch.focus-handshake .mcp-server-local,
  .mcp-arch.focus-handshake .mcp-server-remote { opacity: 0.7; }
  ```
  (Variables `--accent`, `--accent-2`, `--surface-1`, `--surface-2`, `--muted` ya existen en `variables.css` de S04/S05; verificar y reusar.)

  **`.protocol-matrix`** — matriz N×M / N+M. Spec mínima:
  ```css
  .protocol-matrix {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 2rem;
    padding: 1.5rem;
  }
  .protocol-matrix .matrix-clients,
  .protocol-matrix .matrix-providers {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .protocol-matrix .matrix-item {
    border: 1px solid var(--muted);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }
  .protocol-matrix .matrix-hub {
    /* el bus central etiquetado "MCP" — solo visible en .state-nplusm */
    display: none;
    border: 2px solid var(--accent);
    border-radius: 10px;
    padding: 0.75rem 1.25rem;
    background: var(--surface-2);
    font-weight: 600;
  }
  .protocol-matrix.state-nplusm .matrix-hub { display: block; }
  .protocol-matrix svg.matrix-lines { /* líneas dibujadas con SVG, position absolute */ }
  .protocol-matrix.state-nm svg .lines-spaghetti { opacity: 1; }
  .protocol-matrix.state-nm svg .lines-hub { opacity: 0; }
  .protocol-matrix.state-nplusm svg .lines-spaghetti { opacity: 0; }
  .protocol-matrix.state-nplusm svg .lines-hub { opacity: 1; }
  ```
  El SVG con las líneas vive **dentro** del fragment de §4 (no en CSS global) — más simple para autoría. Las clases CSS solo controlan visibilidad.

- [ ] **Step 8: Correr el assembler** y verificar:
  ```bash
  node semanas/06/slides/_assemble.mjs
  ```
  Expected: `sections: 12 open / 12 close` (11 secciones + título), `unfilled markers: 0`.

- [ ] **Step 9: Probar en navegador** que `index.html` carga (`npm start`, abrir `http://localhost:3000/semanas/06/slides/`). Deberías ver title slide + 11 stubs "§N — TODO". Navegación funciona.

- [ ] **Step 10: Commit.**
  ```bash
  git add semanas/06/slides/ _config/theme/components.css
  git commit -m "feat(s06): scaffold + assembler + stubs + diagramas CSS para §1-§11"
  ```

---

## Task 1 — §1 El LLM no ve tu mundo (3–4 slides)

**Subagent dispatch.** Inputs: spine §1 + `source_material/01-llm-no-ve-tu-mundo.md`. Re-leer el spine antes.

**Slide arc:**

1. **Hook — los tres "no puedo".** Pattern: opener visual sin bullets. Tres cards horizontales (grid 3-col), cada una con un mini-escenario:
   - **No puedo abrir este archivo** — "Revisame `services/auth.py:42`" → respuesta vacía.
   - **No puedo tirar esta query** — "Por qué hay nulls en `users.email`" → adivinanza.
   - **No puedo ver esta página** — link a una URL → respuesta basada en URLs parecidas.
   Las tres cards entran como reveals progresivos. Sin meta-narración ("hoy vamos a ver"). Speaker notes leen los escenarios como diálogo con el alumno.

2. **Lo que sabe y lo que ve.** `comparison-2col`:
   - **Sabe** (del entrenamiento) — sintaxis, frameworks, algoritmos.
   - **Ve** (de tu presente) — nada. Empieza vacío cada conversación.
   Sin reveals o uno solo para la asimetría. Notas: el LLM no es ignorante; es ciego al contexto presente.

3. **La asimetría — vos sos el courier.** Slide CSS-only con diagrama simple: tu pantalla ↔ el agente, con vos en el medio copiando-pegando. La frase "el cuello de botella sos vos" como cierre conceptual. Bridge implícito al §2: el patrón que veníamos usando es pegar al prompt.

4. *(Opcional, si el budget aguanta)* **Bridge cortado.** Slide muy chico con frase de transición: "¿Y si no fueras vos el courier? Hace falta otra cosa." Prepara el callejón de §2.

**Patterns:** opener visual 3-col, `comparison-2col`, diagrama CSS simple. Sin `pipeline-roadmap`, sin `mcp-arch` (esa llega en §5).
**Animations:** Ninguna JS. Reveals CSS only.
**Speaker-note target:** ~140–180 palabras por slide; slide 4 ~80.

---

## Task 2 — §2 La trampa del context window (3–4 slides)

**Subagent dispatch.** Inputs: spine §2 + `source_material/02-trampa-del-context-window.md`. Re-leer spine antes.

**Slide arc:**

1. **La solución que veníamos usando.** Slide con la respuesta intuitiva: "pegar al prompt". Diagrama CSS simple: archivo → prompt → respuesta. Notas: funciona para tareas chicas, todo el mundo arranca así. Sin reveals.

2. **Donde se cae — las tres complicaciones.** Pattern: grid 3×1 con reveals progresivos. Cada card es título + ejemplo concreto + número:
   - **Costos** — "Cada token se factura. Repo entero × Opus = caro."
   - **Frescura** — "Pegás un archivo, lo editás 10 min después, la conversación tiene la versión vieja."
   - **Ruido** — "Más texto = peor atención. Pegar 'por las dudas' empeora respuestas."
   Speaker notes desarrollan cada complicación; en `<em>` por reveal.

3. **El callejón — "pegale más" no escala.** `comparison-2col` o slide con frase grande: izquierda "context window de 200k, 1M, 2M…" / derecha "ninguna de las tres complicaciones se resuelve con tamaño". Notas: aumentar la ventana ayuda pero no resuelve estructuralmente.

4. *(Opcional)* **Bridge a §3.** Slide muy chico: "El problema no es que entren más tokens. El problema es que el LLM tiene que tener adentro lo que pertenece afuera." Prepara el reframe.

**Patterns:** opener visual, grid 3×1 con reveals, `comparison-2col`.
**Animations:** Ninguna JS.
**Speaker-note target:** ~140–180 palabras por slide; slide 4 ~70.

---

## Task 3 — §3 Separar conocimiento de acción (3–4 slides)

**Subagent dispatch.** Inputs: spine §3 + `source_material/03-separar-conocimiento-de-accion.md`. Re-leer spine antes.

**Slide arc:**

1. **Hook — pregunta dirigida.** Slide con la pregunta grande:
   > "¿Cómo programás vos cuando usás una librería que conocés a medias?"
   Subtexto chico: "No te memorizás la API. La llamás." Sin reveals. Notas: dejar 2-3 segundos para que la pregunta aterrice antes de avanzar.

2. **El insight central.** Frase ancla en el centro, formato slide-poster:
   > "El LLM no necesita **saber**. Necesita **poder llamar**."
   La frase ocupa el slide. Notas: leerla en voz alta, sin parafrasear. **Esta frase reaparece en §7** — dejar un atisbo de presagio en las notes.

3. **Qué se queda adentro, qué se va afuera.** `comparison-2col`:
   - **Adentro** (lo que el modelo aprendió a hacer bien) — razonamiento, gramáticas, patrones, sentido común sobre estructura.
   - **Afuera** (lo específico, vivo, efectoso) — tu repo, tu base, la API, el browser, las docs actuales.
   Sin reveals o uno solo. Notas: el reparto es estable, no negociable.

4. **La idea sin nombre todavía.** Slide CSS-only con un diagrama del "puente vacío": razonamiento ↔ acción/datos, con el bloque del medio explícitamente etiquetado "?". Notas: hace falta una capa intermedia uniforme. En §4 le ponemos nombre. **Pero antes** — *por qué necesariamente tiene forma de protocolo*.

**Patterns:** slide-poster (frase grande), `comparison-2col`, diagrama CSS del puente.
**Animations:** Ninguna JS.
**Speaker-note target:** ~140–200 palabras para slides 2 y 3 (centrales); ~80–120 para 1 y 4.

---

## Task 4 — §4 Protocolo, no API (5–6 slides) **+ introducir matriz N×M**

**Subagent dispatch.** Inputs: spine §4 + `source_material/04-protocolo-no-api.md`. Re-leer spine antes.

**Slide arc:**

1. **El problema N×M.** Pattern: `.protocol-matrix.state-nm` (definido en Task 0). Visualiza N clientes (Claude Code, Cursor, Cline, Codex CLI) × M proveedores (Playwright, Postgres, GitHub), todos cruzados con todos. Notas: si cada cliente define su propia API de extensiones, el ecosistema tiene que mantener N×M integraciones. Cliente nuevo → M nuevas. Capacidad nueva → N nuevas. Insostenible.

2. **El protocolo común.** Pattern: `.protocol-matrix.state-nplusm` (transición vía fragment-reveal del slide anterior o slide nuevo). El bus central etiquetado "MCP" aparece; las líneas spaghetti desaparecen; quedan N + M conexiones al bus. Notas: con un protocolo, las integraciones son N+M, no N×M. Cliente nuevo → 1 integración, hereda todo. Capacidad nueva → 1 integración, queda disponible en todo.

3. **Los precedentes — HTTP y LSP.** Pattern: `comparison-2col` (no, mejor: 2 cards horizontales, una HTTP, otra LSP). Cada card explica el patrón:
   - **HTTP** — browsers ↔ servers. Cualquier browser habla con cualquier server.
   - **LSP** — IDEs ↔ lenguajes. Antes: cada IDE × cada lenguaje. Después: cada lenguaje publica un server, cada IDE lo consume.
   Notas: MCP es el mismo patrón para agentes ↔ capacidades. No inventa nada; aplica una idea conocida.

4. **MCP — la definición canónica.** Slide central con la definición:
   > **MCP (Model Context Protocol)** — estándar **open-source** para conectar aplicaciones de IA a sistemas externos.
   Atribución pequeña: "doc oficial de modelcontextprotocol.io". Subtexto: "Lo propuso Anthropic en 2024. Lo adoptaron Claude, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI." Notas: la definición no nombra a Anthropic — es deliberado.

5. **La analogía USB-C.** Slide con la analogía oficial:
   > "MCP es como un puerto **USB-C** para aplicaciones de IA."
   Subtexto: "Así como USB-C estandariza la forma de conectar dispositivos electrónicos, MCP estandariza la forma en que las aplicaciones de IA se conectan a sistemas externos." Visual: ícono USB-C grande. Notas: es la metáfora rápida que se quedan. HTTP/LSP explican el *por qué estructural*; USB-C es la versión de bolsillo.

6. *(Opcional)* **Bridge a §5.** Slide muy chico: "Vimos el porqué. Veamos el cómo está armado." Prepara la arquitectura del §5.

**Patterns:** `.protocol-matrix` (nuevo, definido en Task 0), 2-card horizontal, slide-poster.
**Animations:** Ninguna JS. Transición `state-nm` → `state-nplusm` es CSS via fragment toggle.
**Speaker-note target:** ~150–200 palabras para slides 1, 2, 4; ~100–140 para 3, 5.

---

## Task 5 — §5 Arquitectura: host, cliente, servidor (6–7 slides) **+ introducir diagrama mcp-arch**

**Subagent dispatch.** Inputs: spine §5 + `source_material/05-arquitectura-mcp.md`. Re-leer spine antes.

**Slide arc:**

1. **Los tres participantes — introducción.** Pattern: `.mcp-arch.focus-default` con los tres roles revelados como fragments. Primera revelación: el host como contenedor. Segunda: dos clientes adentro del host (cada uno etiquetado con nombre de su server). Tercera: dos servers como procesos aparte (uno local stdio, uno remoto HTTP). Flechas JSON-RPC etiquetadas entre cada par cliente-server.

2. **Las definiciones canónicas.** Pattern: 3 cards verticales o `data-table` 3-row:
   - **MCP Host** — la aplicación de IA con la que interactuás. Coordina y administra clientes.
   - **MCP Client** — componente adentro del host que mantiene una conexión con **un** MCP Server. **Un cliente por server conectado.**
   - **MCP Server** — programa que provee contexto a clientes MCP. Vive como proceso aparte, local o remoto.
   Notas: la regla "un cliente por server" no es obvia y vale repetirla.

3. **La regla clave — un cliente por server.** Slide-poster con la regla destacada:
   > "Si el host está conectado a **tres servers**, corren **tres clientes** adentro del mismo host."
   Subtexto: "El cliente no es uno solo que habla con muchos servers. Son varios clientes, cada uno con su conexión dedicada." Visual: diagrama chico con un host conteniendo 3 clients, cada uno con flecha a un server.

4. **Las dos capas.** `comparison-2col`:
   - **Data layer (interna)** — JSON-RPC 2.0. Define **qué** se intercambia: mensajes, métodos, primitives, lifecycle, notifications.
   - **Transport layer (externa)** — Define **por dónde** se intercambia: canal físico, framing, autenticación.
   Notas: la separación significa que el mismo set de mensajes funciona idéntico sobre cualquier transporte. Vos no aprendés JSON-RPC para usar MCP.

5. **Los dos transports.** `comparison-2col`:
   - **Stdio transport** — server como proceso local. Mensajes por stdin/stdout. Modo "el server vive en tu máquina". Cero overhead de red.
   - **Streamable HTTP transport** — server remoto. HTTP POST + Server-Sent Events opcionales. Auth HTTP estándar. Modo "servicio compartido o tercero".
   Cierre: regla simple — disco/red local → Stdio; servicio compartido → Streamable HTTP.

6. **El diagrama mental que se llevan.** Vuelta a `.mcp-arch.focus-default` con todos los roles visibles, ahora etiquetados con todos los nombres que aprendieron (incluyendo el JSON-RPC en las flechas, la indicación de transport de cada server). **Importante:** este diagrama queda guardado mentalmente para §§6-7. Notas: lo que tiene que poder dibujar mentalmente al terminar la sección.

7. *(Opcional)* **Bridge a §6.** "Vimos el aparato. Veamos qué se manda por las flechas." Prepara las primitives.

**Patterns:** `.mcp-arch` (nuevo, definido en Task 0), `comparison-2col`, 3 cards verticales, slide-poster.
**Animations:** Ninguna JS. Fragment-reveals para construir el diagrama paso a paso.
**Speaker-note target:** ~150–200 palabras para slides 1, 4, 5, 6; ~100–140 para 2, 3.

---

## Task 6 — §6 Las tres primitives (6–7 slides) **+ re-iluminar mcp-arch focus-server**

**Subagent dispatch.** Inputs: spine §6 + `source_material/06-tres-primitives.md`. Re-leer spine antes.

**Slide arc:**

1. **Opener — qué expone un server.** Pattern: `.mcp-arch.focus-server` (host y clients en `opacity: 0.45`, servers destacados). El foco visual prepara el contenido: vamos a hablar de lo que el server expone. Notas: las tres primitives, cada una con un dueño distinto de iniciativa.

2. **Tools — model-controlled.** Pattern: card grande con la primitive desarrollada. Estructura:
   - Eyebrow: "primitive 1 — **model-controlled**"
   - Título: **Tools**
   - Definición: "Funciones que el LLM puede invocar activamente."
   - Métodos: `tools/list` (discover) + `tools/call` (execute).
   - Ejemplos en mono: `searchFlights(origin, destination, date)`, `createCalendarEvent(...)`, `sendEmail(...)`.
   - Caja chica con la palabra clave: **acción con efecto**.
   Notas: la iniciativa la tiene el modelo, pero hosts piden confirmación al usuario antes de ejecutar.

3. **Resources — application-controlled.** Mismo patrón de card grande:
   - Eyebrow: "primitive 2 — **application-controlled**"
   - Título: **Resources**
   - Definición: "Fuentes de datos pasivas, leíbles por URI."
   - Métodos: `resources/list` + `resources/read`.
   - Ejemplos: `file:///path/to/doc.md`, `postgres://db/schema/users`.
   - Caja chica: **lectura, sin efecto**.
   - Bloque adicional: **Direct resources** (URIs fijas) vs **Resource templates** (URIs parametrizadas tipo `travel://activities/{city}/{category}`).
   Notas: la aplicación decide cuándo cargarlos — manualmente, por embeddings, automático.

4. **Prompts — user-controlled.** Mismo patrón:
   - Eyebrow: "primitive 3 — **user-controlled**"
   - Título: **Prompts**
   - Definición: "Templates reutilizables que el usuario invoca explícitamente."
   - Métodos: `prompts/list` + `prompts/get`.
   - Ejemplos: `plan-vacation(destination, duration)`, `explain-stack-trace(trace)`.
   - Caja chica: **template, no ejecución**.
   Notas: se exponen típicamente como slash commands en el host.

5. **Por qué la separación.** `comparison-3col` o tabla 3-row × 2-col:
   - **Tools** — modelo decide → permisos de acción → UI con confirmación.
   - **Resources** — aplicación decide → permisos de lectura → UI de carga.
   - **Prompts** — usuario decide → invocación explícita → UI de slash command.
   Cierre: la diferencia de **iniciativa** determina la UI y los permisos. No es lujo arquitectónico.

6. **Y del otro lado — client primitives.** Pattern: 4 cards horizontales (sin profundizar, solo nombrar):
   - **Sampling** — server pide al cliente "pedile al LLM esto".
   - **Elicitation** — server pide al cliente "preguntale al usuario X dato".
   - **Roots** — cliente declara al server "estos directorios son tu scope".
   - **Logging** — server manda logs al cliente.
   Notas: las nombramos para que sepan que existen. La idea: la comunicación no es de una sola dirección. **Mantener corto** — esta no es una sección sobre client primitives; es un cierre de panorama.

7. *(Opcional)* **Bridge a §7.** Slide chico: "Vimos qué expone el server. Falta cómo el LLM se entera." Prepara discovery dinámico.

**Patterns:** `.mcp-arch.focus-server`, cards grandes con estructura interna fija, tabla/grid 3-col, 4 cards horizontales.
**Animations:** Ninguna JS. CSS-only.
**Speaker-note target:** ~150–200 palabras para slides 2, 3, 4 (cards grandes); ~100–140 para 5, 6.

---

## Task 7 — §7 Discovery dinámico (7–8 slides) **+ clickable-steps handshake animation**

**Subagent dispatch.** Inputs: spine §7 + `source_material/07-discovery-dinamico.md`. Re-leer spine antes. **Este es el clímax conceptual; máxima atención al budget visual.**

**Slide arc:**

1. **Hook — la pregunta del cutoff.** Slide-poster con la pregunta grande:
   > "¿Cómo es que el LLM puede usar tools que se publicaron **después de su cutoff**?"
   Subtexto: "Nunca los vio en entrenamiento. No los memorizó. No sabe que existen." Sin reveals. Notas: dejar el silencio. La sección entera es la respuesta a esta pregunta.

2. **Opener — los dos mecanismos.** Frase intro: "La respuesta vive en dos mecanismos canónicos." Cards verticales:
   - **Capability negotiation** — durante `initialize`. Sucede una vez al arrancar.
   - **Discovery** — vía `*/list`. Sucede cada vez que el cliente pregunta.
   Plus mención chica: **notifications** (`listChanged`) — cambios en vivo. Notas: vamos a desarrollar los dos mecanismos en orden.

3. **El handshake — initialize + capability negotiation.** Pattern: `comparison-2col` o slide con dos códigos JSON-RPC.
   - **Cliente dice:** `{ "method": "initialize", "params": { "protocolVersion": "...", "capabilities": { "elicitation": {} } } }`
   - **Server responde:** `{ "result": { "protocolVersion": "...", "capabilities": { "tools": {"listChanged": true}, "resources": {} } } }`
   Notas: MCP es **stateful** — la negociación queda registrada para toda la sesión.

4. **Discovery via `*/list` — el catálogo.** `code-walkthrough` con un ejemplo concreto:
   ```json
   { "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
   ```
   Y la respuesta:
   ```json
   { "result": { "tools": [
     { "name": "searchFlights", "title": "Search Flights",
       "description": "Search for available flights",
       "inputSchema": { ... } }
   ] } }
   ```
   Notas: el catálogo trae `name`, `title`, `description`, `inputSchema` — toda la metadata.

5. **⭐ El insight clave — handshake animado.** Pattern: `clickable-steps.js` con 4 steps, embeded en el slide. **Esta es la animación más cara del deck — vale el budget.** Spec de los 4 steps:
   - **Step 1: `initialize`** — handshake inicial. Muestra cliente↔server con la negociación de capabilities. Mini-JSON cliente/server.
   - **Step 2: `tools/list`** — el cliente pide el catálogo. Muestra la request y un fragmento de la response con metadata.
   - **Step 3: Catálogo → LLM** — el catálogo se inyecta al system context. Visualización: el bloque de tools viaja hacia "LLM context". El highlight visual hace explícito que **el modelo ahora sabe los tools sin haberlos memorizado**.
   - **Step 4: `notifications/tools/list_changed`** — el server avisa que su catálogo cambió. El cliente reacciona pidiendo de nuevo. Loop visual.
   El detail panel debajo del row de steps muestra mini-JSONs y la explicación de cada paso. **Spec del JS:** instanciar `clickable-steps.js` con `containerId` único + array de 4 step configs. Si la spec original de `clickable-steps.js` requiere adaptación (e.g., para soportar mini-JSONs en detail), documentarla aquí y editarla en `clickable-steps.js`.

   **Fallback CSS-only:** si la animación JS no entra en el budget, reemplazar por 4 slides separados (uno por paso) con `flow-with-arrows` y fragment-reveals. La métrica de "insight clave" sufre un poco pero se sostiene.

6. **El insight, articulado.** Slide-poster con la frase ancla del §3 cerrando el círculo:
   > "El LLM no **memoriza** tools. Los **descubre** en tiempo de conversación."
   Subtexto chico: "Por eso cualquier server nuevo, escrito hoy, es usable hoy." Notas: ata la frase de §3 con la mecánica de §7. **Esta es la frase que más vale la pena que se lleven.**

7. **Notifications — el catálogo es dinámico.** Slide corto con mini-JSON de notificación + descripción:
   ```json
   { "jsonrpc": "2.0", "method": "notifications/tools/list_changed" }
   ```
   Notas: server puede agregar tools cuando el usuario amplía permisos, cambiar scope según roots, etc. Discovery es dinámica, no foto inicial.

8. **La consecuencia práctica — bridge a §8.** Slide-poster:
   > "El ecosistema crece **sin coordinación central**."
   Subtexto: "Nadie tiene que esperar a que el vendor del LLM 'soporte' un server nuevo. Lo soporta por construcción." Notas: prepara la sección §8 — qué implica esto para el ecosistema y para vos.

**Patterns:** slide-poster (hook + insight), `comparison-2col`, `code-walkthrough` (JSON-RPC), `clickable-steps` (handshake animado).
**Animations:** **`clickable-steps.js` para handshake** (slide 5). Verificar wiring en `_assemble.mjs` (heredado de Task 0).
**Speaker-note target:** ~150–220 palabras para slides 1, 5, 6 (clave); ~100–150 para el resto.

---

## Task 8 — §8 El ecosistema, qué viaja con vos, y qué vale instalar (8–10 slides) **+ reuso protocol-matrix + slide-bisagra crítica**

**Subagent dispatch.** Inputs: spine §8 + `source_material/08-ecosistema-vendor-neutral.md`. Re-leer spine antes. **Sección ampliada: tres movimientos — portabilidad / extiende-no-reemplaza / aplicación a CC.**

**Slide arc:**

1. **Un server, muchos hosts.** Pattern: `.protocol-matrix.state-nplusm` reusado de §4, ahora con el server al centro y N hosts a su alrededor (Claude Code, Claude Desktop, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI, MCPJam). Notas: el mismo binario corre en todos. Cierre del argumento que abrió en §4.

2. **El config se ve casi igual en todos.** `code-walkthrough` con el JSON canónico:
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@playwright/mcp"]
       }
     }
   }
   ```
   Subtexto: "Mismo bloque (con variaciones cosméticas) en Claude Code, Cursor, Cline." Notas: nombre + comando + args + env. Estándar.

3. **Build once and integrate everywhere.** Slide-poster con la frase canónica grande. Atribución chica: "doc oficial de modelcontextprotocol.io". Notas: el resumen de un solo renglón.

4. **Tres consecuencias prácticas.** Pattern: grid 3×1 con reveals:
   - **Amortización** — aprender un server una vez sirve para todos los hosts.
   - **Portabilidad** — cambiar de host no te cuesta el setup.
   - **Durabilidad** — el conocimiento no caduca cuando aparezca el próximo IDE con IA.

5. **⚠ Slide-bisagra crítica — "¿pero todo MCP suma en todo host?"** Pattern: slide-poster con la pregunta grande:
   > "¿Pero todo MCP **suma en todo host**?"
   Subtexto: "No." Sin reveals. Notas: el resto de la sección es la pregunta cero. Cambio de movimiento.

6. **MCP extiende, no reemplaza.** `comparison-2col`:
   - **Tools nativas del host** (anteriores a MCP, parte del host, no se agregan ni sacan) — ejemplo CC: `Read`, `Write`, `Edit`, `Grep`, `Glob`, `Bash`.
   - **MCP servers** (extienden capacidades que el host no tiene).
   Cierre: la pregunta correcta antes de instalar **cualquier** MCP server: **"¿el host ya lo hace?"**. Notas: si la respuesta es sí, instalar duplica.

7. **Aplicado a Claude Code.** Pattern: tabla 2-col con dos categorías:
   - **Redundantes en CC** (el host ya lo hace):
     - `filesystem` — `Read`/`Write` ya están.
     - `git` — `Bash` con `git` ya está.
     - `fetch` — `Bash` con `curl` ya está.
   - **Net-new en CC** (capacidad que CC no tiene):
     - `playwright` — CC no maneja un browser.
     - `context7` — CC tiene cutoff, no conoce docs nuevas.
     - `postgres / sqlite` — CC no se conecta a tu DB.
     - `slack` — CC no habla con Slack.
     - `github` (MCP) — agrega operaciones que `gh` CLI no expone igual.
   Notas: la clasificación es **respecto a CC**. La pregunta cero se aplica a cualquier host.

8. **¿Por qué entonces existen filesystem y git como MCP?** Slide explicativo:
   > "Porque otros hosts no tienen lo que CC trae de fábrica."
   Subtexto: "claude.ai (el chat) no tiene Bash, no tiene Read, no tiene Grep. Un MCP `filesystem` en ese contexto es net-new."
   Cierre: **mismo binario, distinto valor según el contenedor.** Notas: build once + integrate everywhere — pero el valor lo aporta el server *sobre lo que el host ya tenía*.

9. **El mapa rápido (clasificado).** Pattern: grid 2-col con los servers populares clasificados:
   - **Tiene sentido en CC:** playwright, context7, postgres/sqlite, github MCP, slack.
   - **Redundante en CC, útil en hosts más finos:** filesystem, git, fetch.
   Cierre: este mapa cambia según el host. La pregunta cero no.

10. **La pregunta cero — card central.** Slide-poster de cierre de la sección:
    > **"¿El host ya lo hace?"**
    Subtexto chico: "Primer filtro antes de cualquier otra evaluación. Si sí, no instales. Si no, recién ahí evaluás lo demás (lo vemos en §11)." Notas: este es el slide-summary que vale la pena que se queden mirando un par de segundos.

**Patterns:** `.protocol-matrix.state-nplusm` reusado, `code-walkthrough` (JSON), slide-poster (frase canónica + pregunta-bisagra + pregunta cero), grid 3×1, `comparison-2col`, tablas 2-col.
**Animations:** Ninguna JS.
**Speaker-note target:** ~150–200 palabras para slides 5, 6, 7, 10 (claves); ~100–140 para el resto.

---

## Task 9 — §9 Demo Playwright MCP (3–4 slides + demo)

**Subagent dispatch.** Inputs: spine §9 + `source_material/09-demo-playwright.md`. Re-leer spine antes. **Demo en vivo: prep ambient + plan B documentado.**

**Slide arc:**

1. **Slide marco — la pregunta cero aplicada.** Slide chico con:
   > "¿CC maneja un browser?" → **No** → corresponde MCP.
   Subtexto: "Playwright es ejemplo paradigmático de net-new sobre CC." Notas: amarra el demo a la pregunta cero de §8.

2. **Qué es Playwright MCP + comando de instalación.** Slide con texto chico + code block:
   - Frase: "Playwright = framework de Microsoft para automatizar browsers. **Playwright MCP** = Playwright como server."
   - Comando:
     ```bash
     claude mcp add playwright npx -y @playwright/mcp
     ```
   Notas: una línea, baja el paquete, arranca como subproceso cuando abrís sesión.

3. **section-divider + demo en vivo.** Marker visual de transición a demo. Beats del demo:
   - **Demo 1 (lectura):** "abrí https://news.ycombinator.com y traeme los títulos de los primeros 5 posts". Mostrar al agente invocar `playwright.navigate` + leer HTML + extraer.
   - **Demo 2 (acción):** "andá a https://httpbin.org/forms/post y completá los campos con datos de prueba". Mostrar al agente llenar el form y hacer submit.
   Slide-soporte mínima durante el demo: un slide con el comando del demo 1 + un slide con el del demo 2 (para que el alumno los vea grandes).
   **Plan B documentado:** si el live demo falla (red caída, npx falla, etc.), pasar a screenshots pre-armados de un session log. Las screenshots viven en `semanas/06/img/demo-playwright-{1,2,3}.png` con placeholder `<img>` (notas en el HTML aclaran que son TODO).

4. **Qué viste — mapeo al diagrama del §7.** Slide de cierre con el diagrama del intercambio en chico:
   > Server expone capacidades → LLM las descubre → invocación con argumentos → resultado vuelve.
   Cuatro chips horizontales con cada paso. Cierre conceptual: "Cambia qué hace; no cambia cómo se habla." Notas: este slide **cierra el ciclo** — el alumno conecta el demo con la mecánica de §7.

**Patterns:** slide marco, `code-walkthrough` (comando), `section-divider`, `flow-with-arrows` (mapping de cierre).
**Animations:** Ninguna JS. Demo en vivo (terminal + browser) es el evento principal.
**Speaker-note target:** ~80–120 palabras para slides 1, 2; ~60–90 para el slide del demo (el contenido lo lleva el demo); ~120–160 para el slide de cierre.

---

## Task 10 — §10 Demo context7 MCP (3–4 slides + demo)

**Subagent dispatch.** Inputs: spine §10 + `source_material/10-demo-context7.md`. Re-leer spine antes.

**Slide arc:**

1. **Hook — las alucinaciones de API.** Slide-poster:
   > "El agente escribe código contra un SDK que **no conoce**. Inventa funciones, usa firmas viejas, llama métodos deprecados."
   Subtexto chico: "El término técnico: **alucinación de API**." Notas: dolor concreto que el alumno reconoció. Pregunta socrática implícita: ¿por qué pasa? La respuesta es la causa raíz de §1.

2. **Slide marco — la pregunta cero aplicada.** Mismo formato que §9 slide 1:
   > "¿CC conoce esta API actualizada?" → **No** (cutoff date) → corresponde MCP.
   Notas: context7 es net-new sobre CC. La pregunta cero filtra a favor.

3. **Qué es context7 + comando.**
   - Frase: "context7 = MCP server público que expone docs actualizadas de miles de librerías como resources/tools. Lo mantiene Upstash. Gratis."
   - Comando:
     ```bash
     claude mcp add context7 npx -y @upstash/context7-mcp
     ```
   Notas: mismo formato que Playwright. Mismo patrón.

4. **section-divider + demo en vivo.** Beat:
   - Demo: "armame un endpoint de streaming con el SDK `ai` de Vercel, usando `streamText`". Mostrar al agente pedir docs reales a context7 antes de escribir; el código resultante usa la API correcta de la versión vigente.
   Slide-soporte mínima durante el demo.
   **Plan B:** screenshots pre-armados de un session log mostrando el antes/después con y sin context7.

5. **Qué viste — cierre del círculo con §§1-2.** Slide de cierre:
   > "Las alucinaciones de API no se resuelven 'pidiéndole al modelo que no alucine'. Se resuelven **dándole acceso a la info que falta**."
   Subtexto: "Eso es lo que MCP estandariza." Cierre conceptual visual con la asimetría del §1 ahora **resuelta**: el courier ya no sos vos. Notas: este slide cierra el arco abierto en §1.

**Patterns:** slide-poster (hook + cierre), slide marco, `code-walkthrough` (comando), `section-divider`, diagrama de cierre que reusa visual de §1.
**Animations:** Ninguna JS. Demo en vivo es el evento.
**Speaker-note target:** ~100–140 palabras para slides 1, 2, 5; ~60–90 para slide 3 (demo).

---

## Task 11 — §11 Cuándo MCP, cuándo no, y riesgos (5–6 slides)

**Subagent dispatch.** Inputs: spine §11 + `source_material/11-cuando-mcp-y-riesgos.md`. Re-leer spine antes. **La pregunta cero al frente, cinco preguntas al cierre.**

**Slide arc:**

1. **Opener — la pregunta cero al frente.** Slide-poster:
   > "Antes de cualquier criterio fino: **¿el host ya lo hace?**"
   Subtexto chico: "Si sí, ahí termina la conversación." Notas: refuerza lo de §8. El resto de la sección **asume** que la pregunta cero dio "no".

2. **Cuándo conviene (las tres condiciones).** Pattern: grid 3×1 con reveals:
   - **Recurrencia** — la conexión se usa muchas veces. One-off no.
   - **Datos vivos o grandes** — cambian o no entran en el prompt.
   - **Reuso entre proyectos o entre clientes** — amortiza el setup.
   Cierre: las tres condiciones aplican **asumiendo que la pregunta cero dio "no"**.

3. **Cuándo no.** Pattern: grid 4×1 (o 2×2) con reveals:
   - **Cuando el host ya lo hace** (la pregunta cero).
   - **Cosa de una vez** — query puntual, archivo único, web una vez.
   - **Datos chicos y estáticos** — entra en el prompt sin esfuerzo.
   - **Cuando no tenés control del server** — auditar puede ser más caro que reescribir.

4. **Los tres riesgos.** Pattern: tabla 3×2 (riesgo / mitigación):
   - **Supply chain** — el server corre código en tu máquina. Mitigación: autores conocidos, leer código si es chico, fijar versiones.
   - **Permisos** — el server hereda tus permisos. Mitigación: calibrar caso por caso, no confiar por default.
   - **Observabilidad** — el server puede comportarse distinto sin que te enteres. Mitigación: log de tools llamadas, verificar resultados.

5. **El modelo mental — las cinco preguntas.** Pattern: `clickable-steps` (reusando `clickable-steps.js`) con 5 steps numerados, o cards numeradas 1-5 con la pregunta cero visualmente destacada como filtro previo:
   1. **¿El host ya lo hace?** — primer filtro. Si sí, no instales.
   2. **¿Quién es el autor?** — reputación, mantenimiento, abierto/cerrado.
   3. **¿Qué hace exactamente?** — tools y resources, efectos posibles.
   4. **¿Qué le permito hacer?** — alcance, sandboxing, confirmaciones.
   5. **¿Cómo me entero si cambia?** — versioning, changelog, notificaciones.
   Cierre conceptual: "Si las cinco no te incomodan, conectalo."

6. **Cierre de clase.** Slide-poster final:
   > "MCP no es la respuesta a todo."
   Subtexto:
   > "Es infraestructura que vino para quedarse. Saber qué es, qué resuelve, cómo está armado y dónde tener cuidado es lo que separa al que lo usa bien del que lo usa mal o no lo usa."
   Sin meta-referencias al curso. Sin mención al TP. Notas: cierra el deck. El profesor agradece, pregunta si hay preguntas, cierra.

**Patterns:** slide-poster (apertura + cierre), grid 3×1 y 4×1 con reveals, tabla 3×2, `clickable-steps` (5 preguntas).
**Animations:** Si se usa `clickable-steps.js` en slide 5, mismo wiring que §7 (ya disponible). Si no, reemplazar por cards numeradas estáticas con reveals.
**Speaker-note target:** ~140–200 palabras para slides 1, 5, 6 (claves); ~100–140 para el resto.

---

## Task 12 — Coherence pass

**Subagent dispatch.** Inputs: `semanas/06/slides/index.html` ensamblado + spine completo.

**Steps:**

- [ ] **Step 1: Ensamblar el deck completo.**
  ```bash
  node semanas/06/slides/_assemble.mjs
  ```
  Expected: `sections: ≥12 open / ≥12 close` (11 + título), `unfilled markers: 0`.

- [ ] **Step 2: Recorrer las transiciones entre secciones** (slide final de cada una + slide opener de la siguiente). Verificar bridges:
  - §2 → §3: bridge a "reformular el problema desde otro ángulo".
  - §3 → §4: bridge a "por qué tiene que ser protocolo".
  - §4 → §5: bridge a "cómo está armado por dentro".
  - §5 → §6: bridge a "qué se manda por las flechas".
  - §6 → §7: bridge a "cómo el LLM se entera".
  - §7 → §8: bridge a "qué implica esto para el ecosistema".
  - §8 → §9: bridge a "los demos prueban la pregunta cero".
  - §10 → §11: bridge a "calibración final".

- [ ] **Step 3: Verificar reuso visual.** Tres elementos recurrentes:
  - **`.mcp-arch`** aparece en §5 (`.focus-default`), §6 (`.focus-server`), §7 (`.focus-handshake` opcional en opener). Verificar que el diagrama es **el mismo** (mismas etiquetas, mismos roles) — no re-dibujado.
  - **`.protocol-matrix`** aparece en §4 (`.state-nm` → `.state-nplusm`) y §8 slide 1 (`.state-nplusm` reusado). Verificar continuidad visual.
  - **Diagrama del intercambio** del §7 se referencia en §9 slide 4 ("qué viste") y §10 slide 5. Verificar que el mapping es explícito.

- [ ] **Step 4: Verificar que la whole-week through-line es visible.** El arco "problema → insight → mecánica → ecosistema → uso → calibración" tiene que sentirse:
  - Parte 1 (§§1-3) cierra cuando entra el protocolo en §4.
  - Parte 2 (§§4-7) cierra con el insight del §7 slide 6.
  - Parte 3 (§8) cierra con la pregunta cero.
  - Parte 4 (§§9-10) materializa con demos.
  - Cierre (§11) calibra.
  Si algún bridge queda flojo, ajustar el slide opener/cierre afectado.

- [ ] **Step 5: Verificar la frase ancla "el LLM no necesita saber, necesita poder llamar"** en §3 y §7. Tiene que estar **literal** en los dos lugares (no parafraseada), y las speaker notes del §7 slide 6 tienen que hacer explícito el callback.

- [ ] **Step 6: Verificar la pregunta cero** apareciendo en §8 (slides 5-10) y §11 (slide 1 y slide 5). Tiene que estar **destacada visualmente** como elemento distintivo (no enterrada en prosa).

- [ ] **Step 7: Verificar la animación `clickable-steps` del §7.** En el navegador, navegar al §7 slide 5 y verificar:
  - Los 4 steps aparecen como row clicable.
  - Click en cada uno highlight + muestra detail panel debajo.
  - Mini-JSONs visibles en el detail panel.
  - Sin errores en console.
  Si el JS no se inicializa, debuggear el wiring en `_assemble.mjs` o el `containerId` único del slide.

- [ ] **Step 8: Cazar bullet-list slides.** Grep por `<ul>` en todos los `_section-*.html`. Cada uso debe estar justificado per memoria `feedback_no_bullet_lists`: tabla disfrazada de lista (`<ul>` con CSS de grid), "qué es" de definición, "tres decisiones" de howto. Cualquier `<ul>` con 3+ `<li>` plain como contenido principal del slide → re-estructurar.

- [ ] **Step 9: Cazar emojis y términos prohibidos.**
  ```bash
  grep -P '[\x{1F000}-\x{1FFFF}]' semanas/06/slides/_section-*.html
  ```
  Y por términos prohibidos: `payoff`, `vibe coding`, `diplomatura`, `bisagra`, `dolores`, `mismatch`, `diálogo socrático`, `scaffolding`, `andamiaje`, `esta clase`, `esta semana`, `del curso`, `primer slide`. Reemplazar cualquier hit.

- [ ] **Step 10: Verificar speaker notes en three-format.** Spot-check 3 slides por sección: cada `<aside class="notes">` tiene `<p><strong>...</strong></p>` (acciones, si aplica), `<p><u>...</u></p>` (descripción), `<p><em>"..."</em></p>` (script). En slides con fragments, **un `<em>` por reveal** (per memoria `feedback_speaker_notes_one_em_per_reveal`).

- [ ] **Step 11: Verificar tamaños de body text** (per memoria `feedback_slide_text_sizing`): body principal ≥1.1rem, secundario ≥1.05rem, eyebrows ≥0.85rem. Spot-check 5 slides al azar.

- [ ] **Step 12: Cazar `<span>` dentro de `<pre><code>`** (per memoria `feedback_pre_code_no_inline_spans`). Grep:
  ```bash
  grep -E '<pre[^>]*>.*<code[^>]*>.*<span' semanas/06/slides/_section-*.html
  ```
  Si aparece, refactor a `<div>` con `white-space: pre-wrap`.

- [ ] **Step 13: Final check en navegador.** `npm start`, abrir `http://localhost:3000/semanas/06/slides/`, navegar slide por slide. Verificar:
  - Sin errores en console.
  - Sin slides clippeados (la safety net de overflow funciona).
  - `.mcp-arch` se re-ilumina correctamente entre §§5-7.
  - `.protocol-matrix` transiciona entre estados en §4.
  - `clickable-steps` del §7 funciona.
  - Demos placeholder se ven (aunque sean rotos — el `alt` aparece).

- [ ] **Step 14: Commit final.**
  ```bash
  git add semanas/06/slides/ _config/theme/components.css
  git commit -m "feat(s06 slides): coherence pass + deck completo §1-§11"
  ```

---

## Self-review (writing-plans)

**Spec coverage:**
- Whole-week through-line "problema → insight → mecánica → ecosistema → uso → calibración" cubierto por la división Parte 1/2/3/4/Cierre del plan. ✓
- Diagrama host/client/server recurrente cubierto en Task 0 (CSS base) + introducido en Task 5 + re-iluminado en Tasks 6, 7. ✓
- Matriz N×M cubierta en Task 0 (CSS base) + introducida en Task 4 + reusada en Task 8 slide 1. ✓
- Frase ancla "el LLM no necesita saber, necesita poder llamar" en §3 y §7, verificado en Coherence Step 5. ✓
- Pregunta cero ("¿el host ya lo hace?") en §8 y §11, verificado en Coherence Step 6. ✓
- Diagrama del intercambio del §7 referenciado en §9 slide 4 y §10 slide 5. ✓
- Hooks decididos en spine respetados en cada task. ✓
- Demos solo en §§9-10 cubiertos; §§1-8 sin terminal compartido. ✓
- Vocabulario canónico (MCP Host/Client/Server, Stdio/Streamable HTTP, model/app/user-controlled) en Conventions + reiterado en tasks. ✓
- Animación `clickable-steps` del §7 con fallback documentado. ✓
- Plan B documentado para demos en vivo §§9-10. ✓

**Placeholder scan:** Releyendo, no encuentro "TBD" como pendientes legítimos. "TODO" aparece como contenido intencional de los stubs creados en Task 0 Step 6 (placeholders del bootstrap que las Tasks 1-11 reemplazan). Aceptable.

**Type consistency:** Verificado:
- `.mcp-arch`, `.mcp-arch.focus-default/focus-server/focus-handshake` consistente entre Task 0 Step 7 y Tasks 5-7.
- `.protocol-matrix.state-nm/state-nplusm` consistente entre Task 0 Step 7, Task 4, y Task 8 Step 1.
- `clickable-steps.js` wiring consistente entre Task 0 Step 4-5 y Tasks 7, 11.
- Numeración de section markers `_section-1.html` a `_section-11.html` consistente entre Task 0 Step 3, Step 6, y todas las Tasks 1-11.
- Paths de imágenes de demos siempre `semanas/06/img/demo-{playwright,context7}-N.png` (relativos al repo root, no a slides/).

Plan listo.

---

## Execution Handoff

Plan guardado en `semanas/06/plan.md`. Próximo paso: Fase 3 — ejecutar tarea por tarea. Per slide-generation skill override, **hand straight to phase 3** (no extra checkpoint — el gate del spine ya pasó).

Recomendación: usar `superpowers:executing-plans` (no `subagent-driven-development`) para mantener checkpoints humanos por sección. El output visual de cada section task necesita aprobación humana antes de pasar a la siguiente, y esa fricción es deseada en slide work.
