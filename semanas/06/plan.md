# Plan — Semana 06: Model Context Protocol (MCP)

> **For agentic workers:** REQUIRED SUB-SKILL: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar tarea por tarea. Steps usan checkbox `- [ ]`.

**Goal:** Generar `semanas/06/slides/index.html` con 10 secciones que cubran el arco **setup → mecánica → ecosistema → uso → calibración** del spine, ensambladas desde fragmentos `_section-N.html` vía el patrón establecido en S04/S05 (`_scaffold.html` + `_assemble.mjs`). Salida final: deck reveal.js corriente abrible desde `npm start`.

**Architecture:** Un fragmento HTML por sección. Setup (Task 0) clona el scaffold de S05 con markers para §§1-9. Cada sección sigue el slide arc definido por el spine. **Elementos visuales recurrentes:**

- **Diagrama de arquitectura host/client/server** introducido en §3 como contenedor visual reusable; re-iluminado en §4 (foco en server) y §5 (foco en handshake). Construcción CSS pura con clases `.mcp-arch` + modificadores de foco (`.focus-server`, `.focus-handshake`).
- **Matriz N×M → N+M** introducida en §2 como argumento estructural; reaparece en §6 como cierre del argumento de portabilidad. Construcción CSS pura con clases `.protocol-matrix` + estados (`.state-nm`, `.state-nplusm`). **Nota:** el concepto N×M ya se nombra verbalmente en §1 (slide del wrapper custom) — §2 lo formaliza visualmente.
- **Diagrama del intercambio** establecido formalmente en §5 (via animación `clickable-steps.js`); referenciado como slide-de-cierre "qué viste" en §7 y §8.

**Tech stack:** reveal.js, `_config/theme/components.css`, `shared/patterns/`. **Una sola animación JS:** `clickable-steps.js` adaptado para el handshake del §5 (4 steps: `initialize` / `tools/list` / catálogo→LLM / `notifications/tools/list_changed`). Si el budget no aguanta, fallback CSS-only con fragment-reveals (documentado en Task 5).

**Spine:** `semanas/06/spine.md`.
**Source material canónico:** `semanas/06/source_material/index.md` y los 9 archivos numerados.

---

## Conventions for execution

- **Diagrama host/client/server recurrente.** Pattern: constructo CSS `.mcp-arch` (definido en Task 0) con sub-elementos `.mcp-host`, `.mcp-client`, `.mcp-server-local`, `.mcp-server-remote`. Flechas bidireccionales etiquetadas JSON-RPC entre cliente y server. Tres estados de foco controlados por clase en `.mcp-arch`: `.focus-default` (§3), `.focus-server` (§4), `.focus-handshake` (§5). Re-iluminación es CSS puro.

- **Diagrama N×M → N+M.** Pattern: constructo CSS `.protocol-matrix` (definido en Task 0). Dos estados: `.state-nm` (matriz spaghetti) y `.state-nplusm` (con bus central etiquetado "MCP"). En §2: arranca con `.state-nm`, fragment-reveal cambia a `.state-nplusm`. En §6: se reusa `.state-nplusm` mostrando el server-central con flechas a N hosts.

- **Estilo (memorias activas):** Argentine Spanish, voseo. Inglés para términos técnicos (host, client, server, transport, primitive, tool, resource, prompt, schema, capability, handshake, discovery, notification, stdio, HTTP, JSON-RPC, MIME type, URI). Capitalización canónica: **MCP Host / MCP Client / MCP Server**, **Stdio transport / Streamable HTTP transport**, **data layer / transport layer**, **model-controlled / application-controlled / user-controlled**.
  **Prohibidos:** payoff, vibe coding, diplomatura, bisagra, dolores ("complicaciones" en su lugar), "esta clase / esta semana / del curso / la firma de esta clase / primer slide", scaffolding, andamiaje, mismatch ("desfasaje" en su lugar), diálogo socrático ("preguntas dirigidas" en su lugar). Sin emojis. Sin meta-referencias al curso. Sin marketing ("el más completo / popular"). Sin mención al TP final en texto visible.

- **Asumir nivel S04 + S05.** Los alumnos vienen sabiendo: cómo funciona una LLM, tools como forma de obtener info o interactuar con un ambiente, ReAct, runtimes (Claude Code), context engineering, harness engineering, skills, sub-agents. **No re-enseñar nada de esto.** El deck arranca asumiendo el modelo mental.

- **Demos solo en §§7-8.** Per memoria `feedback_demos_only_in_part_2`, los demos en vivo van en la Parte de demos. Las secciones §§1-6 son conceptuales (sin terminal/browser compartido). El §9 cierra; tampoco lleva demo.

- **Speaker notes (3-formato):** `<strong>` acciones / `<u>` descripción / `<em>` script entre comillas. Un `<p><em>...</em></p>` por reveal/fragmento (per memoria `feedback_speaker_notes_one_em_per_reveal`). Target: **~80–200 palabras por slide**; slides con demo o de apoyo a demo en vivo ~60–90.

- **Hooks decididos en el spine** (no negociar):
  - §1 — recap del set de tools + pregunta dirigida "¿qué hacés cuando lo que necesitás no está?".
  - §5 — la pregunta del cutoff como apertura ("¿cómo es que el LLM puede usar tools publicados después de su cutoff?").
  - §8 — las alucinaciones de API como apertura.

- **Openers SIEMPRE sin bullets**. Visual structure (comparison, flow, diagrama, frase grande). Bullets aceptables solo en slides "qué es" de definición o "tres cosas que" enumerativos del manual de voz.

- **Tamaños de body text** (per memoria `feedback_slide_text_sizing`): body principal ≥1.1rem, secundario ≥1.05rem, eyebrows ≥0.85rem.

- **Sin `<span>` dentro de `<pre><code>`** (per memoria `feedback_pre_code_no_inline_spans`): el highlight plugin escapa el HTML. Para terminal-output coloreado usar `<div>` con `white-space: pre-wrap`.

- **No mencionar otras semanas o el TP final** en slides visibles.

---

## Task 0 — Scaffold + assembler + stubs + diagramas CSS base

**Files:**
- Create: `semanas/06/slides/_scaffold.html`
- Create: `semanas/06/slides/_assemble.mjs`
- Create: `semanas/06/slides/_section-1.html` a `_section-9.html` (stubs)
- Create: `semanas/06/slides/clickable-steps.js`
- Verify/extend: `_config/theme/components.css` con clases `.mcp-arch`, `.protocol-matrix`

**Steps:**

- [x] **Step 1: Copiar `_scaffold.html` desde S05 como base.** Editar `<title>` a `Semana 06 — Model Context Protocol (MCP)`.

- [x] **Step 2: Reemplazar el title slide** por:
  ```html
  <section class="title-slide">
    <h1>Model Context Protocol</h1>
    <p class="subtitle">Cómo el LLM extiende lo que ve y lo que toca.</p>
    <p class="muted">Introducción al desarrollo de software asistido por IA</p>
  </section>
  ```

- [x] **Step 3: Markers §1-§10** con títulos cortos:
  1. Más allá del set que trae el host
  2. Protocolo, no API
  3. Arquitectura
  4. Las tres primitives
  5. Discovery dinámico
  6. Ecosistema + qué vale instalar
  7. Demo Playwright
  8. Demo context7
  9. Demo Blender
  10. Cuándo MCP, riesgos

- [x] **Step 4: `_assemble.mjs`** copiado desde S05 con `for (let n = 1; n <= 10; n++)`.

- [x] **Step 5: `clickable-steps.js`** copiado desde S05.

- [x] **Step 6: Stubs `_section-1.html` a `_section-10.html`** creados.

- [x] **Step 7: CSS para `.mcp-arch` y `.protocol-matrix`** agregadas a `_config/theme/components.css`.

- [x] **Step 8: Assembler corrido** — `sections: 24 open / 24 close`, `unfilled markers: 0`.

- [x] **Step 9: Probado en navegador**.

- [x] **Step 10: Commit hecho.**

---

## Task 1 — §1 Más allá del set que trae el host (5 slides)

**Subagent dispatch.** Inputs: spine §1 + `source_material/01-mas-alla-del-set-que-trae-el-host.md`. Re-leer el spine antes.

**Slide arc:**

1. **Recap — el set que ya tiene CC.** Pattern: grid 6-col con las tools nativas (Read, Write, Edit, Grep, Glob, Bash). Cada card: nombre en mono + frase corta de qué hace. Subtítulo del slide: "Vino con Claude Code. Vos lo venís usando." Takeaway debajo del grid: "Para el grueso del workflow de desarrollo local, te alcanza. Lo decidió Anthropic." Sin reveals — entra entero. Notas: no re-explicar qué es un tool; el alumno ya pasó por loop agentic + tools + harness. El slide ancla lo conocido y planta una observación nueva: el set es curado y no extensible.

2. **Tres cosas que NO están.** Pattern: grid 3-col con reveals progresivos. Cada card tiene eyebrow ("no está 1"), título, el pedido en mono, y la frase del gap. Las tres capacidades calibradas:
   - **Postgres de producción** — "Filas de users con email null, últimas 24 h" → "Bash con psql lo permite, pero el agente no sabe schema, tipos, ni qué columnas son sensibles."
   - **Browser controlado** — "Abrí esta URL, completá el form, sacame screenshot" → "curl no renderiza, no ejecuta JS, no clickea. No está."
   - **Docs de un SDK que salió ayer** — "Cómo se usa streamText en esta versión" → "Cutoff de entrenamiento. Si la API cambió, no se entera; sale de memoria y alucina."
   Notas en speaker: un `<em>` por reveal.

3. **Salida vieja 1 — wrapper custom por host.** Pattern: card grande con eyebrow ("salida vieja 1"), título, body explicativo, una grid 4-col con visual de wrappers duplicados (Claude Code, Cursor, Codex CLI, Gemini CLI), y un takeaway debajo: "Cada capacidad × cada host = trabajo nuevo. Eso es **N×M**, y crece feo." Notas: la primera salida instintiva, plantea N×M para que §2 lo formalice.

4. **Salida vieja 2 — pegar al prompt.** Pattern: card grande mismo formato. Eyebrow ("salida vieja 2"), título, body explicativo corto, y tres chips inline con las complicaciones (Costos / Frescura / Ruido), cada una con frase concreta. Takeaway: "Las skills, sub-agents y context engineering existen **para que no pegues todo el tiempo**. Acá el techo se ve." Notas: nombrar las tres complicaciones rápido — el alumno ya conoce context engineering, no se re-explica.

5. **Bridge — la salida estructural, MCP.** Slide-poster. Eyebrow chico ("La salida estructural"). Frase grande "MCP" como nombre. Tagline: "Un protocolo común que el host habla, los proveedores hablan, y N×M se vuelve N+M." Hint en itálicas: "Cómo está armado por dentro — viene ahora." Notas: el nombre cae, el aparato viene en §2. Importante: aclarar en notes que MCP es **estándar open-source**, no producto Anthropic — eso lo desarrolla §2 pero conviene plantar la mención.

**Patterns:** grid 6-col (recap), grid 3-col con reveals (las "no está"), cards grandes con visual interno (salidas viejas), slide-poster (bridge).
**Animations:** Ninguna JS. Reveals CSS only.
**Speaker-note target:** ~150–200 palabras por slide; slide 5 ~100.

---

## Task 2 — §2 Protocolo, no API (5–6 slides) **+ introducir matriz N×M**

**Subagent dispatch.** Inputs: spine §2 + `source_material/02-protocolo-no-api.md`. Re-leer spine antes.

**Slide arc:**

1. **El problema N×M.** Pattern: `.protocol-matrix.state-nm` (definido en Task 0). Visualiza N clientes (Claude Code, Cursor, Cline, Codex CLI) × M proveedores (Playwright, Postgres, GitHub), todos cruzados con todos. Notas: si cada cliente define su propia API de extensiones, el ecosistema tiene que mantener N×M integraciones. Esto ya se nombró en §1; acá se visualiza.

2. **El protocolo común.** Pattern: `.protocol-matrix.state-nplusm` (transición vía fragment-reveal del slide anterior o slide nuevo). El bus central etiquetado "MCP" aparece; las líneas spaghetti desaparecen; quedan N + M conexiones al bus. Notas: con un protocolo, las integraciones son N+M. Cliente nuevo → 1 integración, hereda todo. Capacidad nueva → 1 integración, queda disponible en todo.

3. **Los precedentes — HTTP y LSP.** Pattern: 2 cards horizontales:
   - **HTTP** — browsers ↔ servers. Cualquier browser habla con cualquier server.
   - **LSP** — IDEs ↔ lenguajes. Antes: cada IDE × cada lenguaje. Después: cada lenguaje publica un server, cada IDE lo consume.
   Notas: MCP es el mismo patrón para agentes ↔ capacidades. No inventa nada; aplica una idea conocida.

4. **MCP — la definición canónica.** Slide central con la definición:
   > **MCP (Model Context Protocol)** — estándar **open-source** para conectar aplicaciones de IA a sistemas externos.
   Atribución pequeña: "doc oficial de modelcontextprotocol.io". Subtexto: "Lo propuso Anthropic en 2024. Lo adoptaron Claude, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI." Notas: la definición no nombra a Anthropic — es deliberado.

5. **La analogía USB-C.** Slide con la analogía oficial:
   > "MCP es como un puerto **USB-C** para aplicaciones de IA."
   Subtexto: "Así como USB-C estandariza la forma de conectar dispositivos electrónicos, MCP estandariza la forma en que las aplicaciones de IA se conectan a sistemas externos." Visual: ícono USB-C grande. Notas: HTTP/LSP explican el *por qué estructural*; USB-C es la versión de bolsillo.

6. *(Opcional)* **Bridge a §3.** Slide muy chico: "Vimos el porqué. Veamos el cómo está armado." Prepara la arquitectura del §3.

**Patterns:** `.protocol-matrix` (nuevo, definido en Task 0), 2-card horizontal, slide-poster.
**Animations:** Ninguna JS. Transición `state-nm` → `state-nplusm` es CSS via fragment toggle.
**Speaker-note target:** ~150–200 palabras para slides 1, 2, 4; ~100–140 para 3, 5.

---

## Task 3 — §3 Arquitectura: host, cliente, servidor (6–7 slides) **+ introducir diagrama mcp-arch**

**Subagent dispatch.** Inputs: spine §3 + `source_material/03-arquitectura-mcp.md`. Re-leer spine antes.

**Slide arc:**

1. **Los tres participantes — introducción.** Pattern: `.mcp-arch.focus-default` con los tres roles revelados como fragments. Primera revelación: el host como contenedor. Segunda: dos clientes adentro del host (cada uno etiquetado con nombre de su server). Tercera: dos servers como procesos aparte (uno local stdio, uno remoto HTTP). Flechas JSON-RPC etiquetadas entre cada par cliente-server.

2. **Las definiciones canónicas.** Pattern: 3 cards verticales o `data-table` 3-row:
   - **MCP Host** — la aplicación de IA con la que interactuás. Coordina y administra clientes.
   - **MCP Client** — componente adentro del host que mantiene una conexión con **un** MCP Server. **Un cliente por server conectado.**
   - **MCP Server** — programa que provee contexto a clientes MCP. Vive como proceso aparte, local o remoto.

3. **La regla clave — un cliente por server.** Slide-poster con la regla destacada:
   > "Si el host está conectado a **tres servers**, corren **tres clientes** adentro del mismo host."
   Subtexto: "El cliente no es uno solo que habla con muchos servers. Son varios clientes, cada uno con su conexión dedicada." Visual: diagrama chico con un host conteniendo 3 clients, cada uno con flecha a un server.

4. **Las dos capas.** `comparison-2col`:
   - **Data layer (interna)** — JSON-RPC 2.0. Define **qué** se intercambia.
   - **Transport layer (externa)** — Define **por dónde** se intercambia.
   Notas: la separación significa que el mismo set de mensajes funciona idéntico sobre cualquier transporte. Vos no aprendés JSON-RPC para usar MCP.

5. **Los dos transports.** `comparison-2col`:
   - **Stdio transport** — server como proceso local. Mensajes por stdin/stdout. Modo "el server vive en tu máquina". Cero overhead de red.
   - **Streamable HTTP transport** — server remoto. HTTP POST + Server-Sent Events opcionales. Auth HTTP estándar. Modo "servicio compartido o tercero".
   Cierre: regla simple — disco/red local → Stdio; servicio compartido → Streamable HTTP.

6. **El diagrama mental que se llevan.** Vuelta a `.mcp-arch.focus-default` con todos los roles visibles, ahora etiquetados con todos los nombres que aprendieron. **Importante:** este diagrama queda guardado mentalmente para §§4-5.

7. *(Opcional)* **Bridge a §4.** "Vimos el aparato. Veamos qué se manda por las flechas." Prepara las primitives.

**Patterns:** `.mcp-arch` (nuevo, definido en Task 0), `comparison-2col`, 3 cards verticales, slide-poster.
**Animations:** Ninguna JS. Fragment-reveals para construir el diagrama paso a paso.
**Speaker-note target:** ~150–200 palabras para slides 1, 4, 5, 6; ~100–140 para 2, 3.

---

## Task 4 — §4 Las tres primitives (6–7 slides) **+ re-iluminar mcp-arch focus-server**

**Subagent dispatch.** Inputs: spine §4 + `source_material/04-tres-primitives.md`. Re-leer spine antes.

**Slide arc:**

1. **Opener — qué expone un server.** Pattern: `.mcp-arch.focus-server` (host y clients en `opacity: 0.45`, servers destacados). El foco visual prepara el contenido: vamos a hablar de lo que el server expone.

2. **Tools — model-controlled.** Pattern: card grande con la primitive desarrollada:
   - Eyebrow: "primitive 1 — **model-controlled**"
   - Título: **Tools**
   - Definición: "Funciones que el LLM puede invocar activamente."
   - Métodos: `tools/list` (discover) + `tools/call` (execute).
   - Ejemplos en mono: `searchFlights(origin, destination, date)`, `createCalendarEvent(...)`, `sendEmail(...)`.
   - Caja chica con la palabra clave: **acción con efecto**.

3. **Resources — application-controlled.** Mismo patrón de card grande:
   - Eyebrow: "primitive 2 — **application-controlled**"
   - Título: **Resources**
   - Definición: "Fuentes de datos pasivas, leíbles por URI."
   - Métodos: `resources/list` + `resources/read`.
   - Ejemplos: `file:///path/to/doc.md`, `postgres://db/schema/users`.
   - Caja chica: **lectura, sin efecto**.
   - Bloque adicional: **Direct resources** (URIs fijas) vs **Resource templates** (URIs parametrizadas).

4. **Prompts — user-controlled.** Mismo patrón:
   - Eyebrow: "primitive 3 — **user-controlled**"
   - Título: **Prompts**
   - Definición: "Templates reutilizables que el usuario invoca explícitamente."
   - Métodos: `prompts/list` + `prompts/get`.
   - Ejemplos: `plan-vacation(destination, duration)`, `explain-stack-trace(trace)`.
   - Caja chica: **template, no ejecución**.

5. **Por qué la separación.** Tabla 3-row × 2-col:
   - **Tools** — modelo decide → permisos de acción → UI con confirmación.
   - **Resources** — aplicación decide → permisos de lectura → UI de carga.
   - **Prompts** — usuario decide → invocación explícita → UI de slash command.
   Cierre: la diferencia de **iniciativa** determina la UI y los permisos.

6. **Y del otro lado — client primitives.** 4 cards horizontales (sin profundizar):
   - **Sampling** — server pide al cliente "pedile al LLM esto".
   - **Elicitation** — server pide al cliente "preguntale al usuario X dato".
   - **Roots** — cliente declara al server "estos directorios son tu scope".
   - **Logging** — server manda logs al cliente.

7. *(Opcional)* **Bridge a §5.** Slide chico: "Vimos qué expone el server. Falta cómo el LLM se entera."

**Patterns:** `.mcp-arch.focus-server`, cards grandes con estructura interna fija, tabla 3-col, 4 cards horizontales.
**Animations:** Ninguna JS.
**Speaker-note target:** ~150–200 palabras para slides 2, 3, 4 (cards grandes); ~100–140 para 5, 6.

---

## Task 5 — §5 Discovery dinámico (7–8 slides) **+ clickable-steps handshake animation**

**Subagent dispatch.** Inputs: spine §5 + `source_material/05-discovery-dinamico.md`. Re-leer spine antes. **Este es el clímax conceptual; máxima atención al budget visual.**

**Slide arc:**

1. **Hook — la pregunta del cutoff.** Slide-poster con la pregunta grande:
   > "¿Cómo es que el LLM puede usar tools que se publicaron **después de su cutoff**?"
   Subtexto: "Nunca los vio en entrenamiento. No los memorizó. No sabe que existen." Sin reveals.

2. **Opener — los dos mecanismos.** Cards verticales:
   - **Capability negotiation** — durante `initialize`. Sucede una vez al arrancar.
   - **Discovery** — vía `*/list`. Sucede cada vez que el cliente pregunta.
   Plus mención chica: **notifications** (`listChanged`) — cambios en vivo.

3. **El handshake — initialize + capability negotiation.** Pattern: `comparison-2col` con dos códigos JSON-RPC:
   - **Cliente dice:** `{ "method": "initialize", "params": { "protocolVersion": "...", "capabilities": { "elicitation": {} } } }`
   - **Server responde:** `{ "result": { "protocolVersion": "...", "capabilities": { "tools": {"listChanged": true}, "resources": {} } } }`
   Notas: MCP es **stateful** — la negociación queda registrada para toda la sesión.

4. **Discovery via `*/list` — el catálogo.** `code-walkthrough` con request `tools/list` y response con metadata (`name`, `title`, `description`, `inputSchema`).

5. **⭐ El insight clave — handshake animado.** Pattern: `clickable-steps.js` con 4 steps:
   - **Step 1: `initialize`** — handshake inicial con negociación de capabilities.
   - **Step 2: `tools/list`** — cliente pide catálogo.
   - **Step 3: Catálogo → LLM** — el catálogo se inyecta al system context. **El modelo ahora sabe los tools sin haberlos memorizado**.
   - **Step 4: `notifications/tools/list_changed`** — server avisa cambio. Loop visual.
   Detail panel debajo muestra mini-JSONs y explicación. Containerid único.
   **Fallback CSS-only:** si JS no entra en budget, 4 slides separados con `flow-with-arrows` y fragment-reveals.

6. **El insight, articulado.** Slide-poster:
   > "El LLM no **memoriza** tools. Los **descubre** en tiempo de conversación."
   Subtexto chico: "Por eso cualquier server nuevo, escrito hoy, es usable hoy." Notas: **Esta es la frase que más vale la pena que se lleven.**

7. **Notifications — el catálogo es dinámico.** Slide corto con mini-JSON de notificación + descripción.

8. **La consecuencia práctica — bridge a §6.** Slide-poster:
   > "El ecosistema crece **sin coordinación central**."
   Subtexto: "Nadie tiene que esperar a que el vendor del LLM 'soporte' un server nuevo. Lo soporta por construcción."

**Patterns:** slide-poster (hook + insight), `comparison-2col`, `code-walkthrough` (JSON-RPC), `clickable-steps` (handshake animado).
**Animations:** **`clickable-steps.js` para handshake** (slide 5).
**Speaker-note target:** ~150–220 palabras para slides 1, 5, 6 (clave); ~100–150 para el resto.

---

## Task 6 — §6 El ecosistema, qué viaja con vos, y qué vale instalar (8–10 slides) **+ reuso protocol-matrix + slide-bisagra crítica**

**Subagent dispatch.** Inputs: spine §6 + `source_material/06-ecosistema-vendor-neutral.md`. Re-leer spine antes. **Sección ampliada: tres movimientos — portabilidad / extiende-no-reemplaza / aplicación a CC.**

**Slide arc:**

1. **Un server, muchos hosts.** Pattern: `.protocol-matrix.state-nplusm` reusado de §2, ahora con el server al centro y N hosts a su alrededor (Claude Code, Claude Desktop, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI, MCPJam). Notas: el mismo binario corre en todos. Cierre del argumento que abrió en §2.

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
   Subtexto: "Mismo bloque (con variaciones cosméticas) en Claude Code, Cursor, Cline."

3. **Build once and integrate everywhere.** Slide-poster con la frase canónica grande.

4. **Tres consecuencias prácticas.** Pattern: grid 3×1 con reveals:
   - **Amortización** — aprender un server una vez sirve para todos los hosts.
   - **Portabilidad** — cambiar de host no te cuesta el setup.
   - **Durabilidad** — el conocimiento no caduca cuando aparezca el próximo IDE con IA.

5. **⚠ Slide-bisagra crítica — "¿pero todo MCP suma en todo host?"** Pattern: slide-poster con la pregunta grande:
   > "¿Pero todo MCP **suma en todo host**?"
   Subtexto: "No." Sin reveals. Notas: el resto de la sección es la pregunta cero. Cambio de movimiento.

6. **MCP extiende, no reemplaza.** `comparison-2col`:
   - **Tools nativas del host** (anteriores a MCP, parte del host) — ejemplo CC: `Read`, `Write`, `Edit`, `Grep`, `Glob`, `Bash` (callback explícito al recap de §1).
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
   Cierre: **mismo binario, distinto valor según el contenedor.**

9. **El mapa rápido (clasificado).** Pattern: grid 2-col con los servers populares clasificados:
   - **Tiene sentido en CC:** playwright, context7, postgres/sqlite, github MCP, slack.
   - **Redundante en CC, útil en hosts más finos:** filesystem, git, fetch.

10. **La pregunta cero — card central.** Slide-poster de cierre de la sección:
    > **"¿El host ya lo hace?"**
    Subtexto chico: "Primer filtro antes de cualquier otra evaluación. Si sí, no instales. Si no, recién ahí evaluás lo demás (lo vemos en §9)."

**Patterns:** `.protocol-matrix.state-nplusm` reusado, `code-walkthrough` (JSON), slide-poster (frase canónica + pregunta-bisagra + pregunta cero), grid 3×1, `comparison-2col`, tablas 2-col.
**Animations:** Ninguna JS.
**Speaker-note target:** ~150–200 palabras para slides 5, 6, 7, 10 (claves); ~100–140 para el resto.

---

## Task 7 — §7 Demo Playwright MCP (3–4 slides + demo)

**Subagent dispatch.** Inputs: spine §7 + `source_material/07-demo-playwright.md`. Re-leer spine antes. **Demo en vivo: prep ambient + plan B documentado.**

**Slide arc:**

1. **Slide marco — la pregunta cero aplicada.** Slide chico con:
   > "¿CC maneja un browser?" → **No** → corresponde MCP.
   Subtexto: "Playwright es ejemplo paradigmático de net-new sobre CC."

2. **Qué es Playwright MCP + comando de instalación.**
   - Frase: "Playwright = framework de Microsoft para automatizar browsers. **Playwright MCP** = Playwright como server."
   - Comando:
     ```bash
     claude mcp add playwright npx -y @playwright/mcp
     ```

3. **section-divider + demo en vivo.** Beats:
   - **Demo 1 (lectura):** "abrí https://news.ycombinator.com y traeme los títulos de los primeros 5 posts".
   - **Demo 2 (acción):** "andá a https://httpbin.org/forms/post y completá los campos con datos de prueba".
   **Plan B:** screenshots pre-armados en `semanas/06/img/demo-playwright-{1,2,3}.png`.

4. **Qué viste — mapeo al diagrama del §5.** Slide de cierre con el diagrama del intercambio en chico:
   > Server expone capacidades → LLM las descubre → invocación con argumentos → resultado vuelve.
   Cierre: "Cambia qué hace; no cambia cómo se habla."

**Patterns:** slide marco, `code-walkthrough` (comando), `section-divider`, `flow-with-arrows` (mapping de cierre).
**Animations:** Ninguna JS. Demo en vivo es el evento.
**Speaker-note target:** ~80–120 palabras para slides 1, 2; ~60–90 para el slide del demo; ~120–160 para el slide de cierre.

---

## Task 8 — §8 Demo context7 MCP (3–4 slides + demo)

**Subagent dispatch.** Inputs: spine §8 + `source_material/08-demo-context7.md`. Re-leer spine antes.

**Slide arc:**

1. **Hook — las alucinaciones de API.** Slide-poster:
   > "El agente escribe código contra un SDK que **no conoce**. Inventa funciones, usa firmas viejas, llama métodos deprecados."
   Subtexto chico: "El término técnico: **alucinación de API**."

2. **Slide marco — la pregunta cero aplicada.** Mismo formato que §7 slide 1:
   > "¿CC conoce esta API actualizada?" → **No** (cutoff date) → corresponde MCP.

3. **Qué es context7 + comando.**
   - Frase: "context7 = MCP server público que expone docs actualizadas de miles de librerías. Lo mantiene Upstash. Gratis."
   - Comando:
     ```bash
     claude mcp add context7 npx -y @upstash/context7-mcp
     ```

4. **section-divider + demo en vivo.** Beat:
   - Demo: "armame un endpoint de streaming con el SDK `ai` de Vercel, usando `streamText`".
   **Plan B:** screenshots pre-armados antes/después.

5. **Qué viste — cierre del círculo con §1.** Slide de cierre:
   > "Las alucinaciones de API no se resuelven 'pidiéndole al modelo que no alucine'. Se resuelven **dándole acceso a la info que falta**."
   Subtexto: "Eso es lo que MCP estandariza." Cierra el arco que abrió §1 (tercera "no está" — docs en vivo).

**Patterns:** slide-poster (hook + cierre), slide marco, `code-walkthrough` (comando), `section-divider`.
**Animations:** Ninguna JS. Demo en vivo es el evento.
**Speaker-note target:** ~100–140 palabras para slides 1, 2, 5; ~60–90 para slide 3 (demo).

---

## Task 9 — §9 Demo Blender MCP (4–5 slides + demo) **+ video plan B esencial**

**Subagent dispatch.** Inputs: spine §9 + `source_material/09-demo-blender.md`. Re-leer spine antes. **Demo en vivo con física: más riesgo que los anteriores, video pre-grabado de 30-40s es obligatorio.**

**Slide arc:**

1. **Hook — "¿y si no fuera código?"** Slide-poster:
   > "Los dos demos anteriores fueron sobre dominios de desarrollo.
   > **¿Y si no fuera código?**"
   Sin reveals. Notas: el alumno tiene que sentir el salto conceptual antes de ver el demo. MCP no se limita a devtools.

2. **Slide marco — la pregunta cero aplicada.** Slide chico:
   > "¿CC modela 3D, controla Blender, configura física?" → **No** → corresponde MCP.
   Subtexto: "Blender MCP es ejemplo de net-new en un dominio completamente distinto."

3. **Qué es Blender MCP + comando + nota de setup.**
   - Frase: "Blender MCP = Blender expuesto como server. Traduce llamadas MCP a comandos `bpy` (la API Python de Blender)."
   - Comando:
     ```bash
     claude mcp add blender npx -y blender-mcp
     ```
   - Nota chica de setup: "Necesita Blender abierto con el add-on `blender-mcp` activo. Más overhead que Playwright/context7."

4. **section-divider + demo en vivo.** Beats del demo:
   - **Pedido:** "creá una rampa inclinada 30 grados, dejá caer 6 esferas de colores arriba, activá física rigid body para que rueden por la rampa y choquen entre sí. Después corré la simulación."
   - **Qué hace el agente (visible en el viewport):**
     1. Crea plane + rota 30° + escala.
     2. Crea 6 UV spheres en posiciones distintas.
     3. Asigna material colorido a cada una.
     4. Configura rigid body passive al plane.
     5. Configura rigid body active a cada esfera.
     6. Setea bounciness y friction.
     7. Play timeline.
   - **Resultado visible:** 6 balls caen, rebotan en la rampa, ruedan, chocan entre sí y se dispersan.

   **Plan B obligatorio:** video pre-grabado de 30-40s del demo funcionando bien, listo en disco. Si la sim falla en vivo o el add-on se desconecta, pausamos y mostramos el video. **No es opcional** — el demo solo funciona si las balls se ven moverse.

5. **Qué viste — cierre del bloque entero de demos.** Slide de cierre que vale **el bloque completo de demos** (no solo este):
   - Visual de los **tres ángulos** como 3 cards:
     - **Playwright** — *actuar* sobre el browser.
     - **context7** — *informar* al modelo con docs reales.
     - **Blender** — *crear* en un dominio no-coding.
   - Diagrama del intercambio del §5 abajo, con la frase: "Server expone capacidades → LLM las descubre → invoca → resultado vuelve."
   - Cierre conceptual: "Tres dominios completamente distintos. Mismo aparato."

**Patterns:** slide-poster (hook + cierre), slide marco, `code-walkthrough` (comando), `section-divider`, grid 3-col para los tres ángulos en el cierre.
**Animations:** Ninguna JS. Demo en vivo (viewport de Blender + terminal) es el evento.
**Speaker-note target:** ~100–140 palabras para slides 1, 2, 5; ~60–90 para slide 3 (apoyo); slide 4 ~60 (el contenido lo lleva el demo).

---

## Task 10 — §10 Cuándo MCP, cuándo no, y riesgos (5–6 slides)

**Subagent dispatch.** Inputs: spine §10 + `source_material/10-cuando-mcp-y-riesgos.md`. Re-leer spine antes. **La pregunta cero al frente, cinco preguntas al cierre.**

**Slide arc:**

1. **Opener — la pregunta cero al frente.** Slide-poster:
   > "Antes de cualquier criterio fino: **¿el host ya lo hace?**"
   Subtexto chico: "Si sí, ahí termina la conversación." Notas: refuerza lo de §6.

2. **Cuándo conviene (las tres condiciones).** Pattern: grid 3×1 con reveals:
   - **Recurrencia** — la conexión se usa muchas veces.
   - **Datos vivos o grandes** — cambian o no entran en el prompt.
   - **Reuso entre proyectos o entre clientes** — amortiza el setup.

3. **Cuándo no.** Pattern: grid 4×1 (o 2×2) con reveals:
   - **Cuando el host ya lo hace** (la pregunta cero).
   - **Cosa de una vez**.
   - **Datos chicos y estáticos**.
   - **Cuando no tenés control del server**.

4. **Los tres riesgos.** Pattern: tabla 3×2 (riesgo / mitigación):
   - **Supply chain** — el server corre código en tu máquina. Mitigación: autores conocidos, leer código si es chico, fijar versiones.
   - **Permisos** — el server hereda tus permisos. Mitigación: calibrar caso por caso, no confiar por default.
   - **Observabilidad** — el server puede comportarse distinto sin que te enteres. Mitigación: log de tools llamadas, verificar resultados.

5. **El modelo mental — las cinco preguntas.** Pattern: `clickable-steps` (reusando `clickable-steps.js`) con 5 steps numerados, o cards numeradas 1-5 con la pregunta cero visualmente destacada:
   1. **¿El host ya lo hace?** — primer filtro.
   2. **¿Quién es el autor?** — reputación, mantenimiento, abierto/cerrado.
   3. **¿Qué hace exactamente?** — tools y resources, efectos posibles.
   4. **¿Qué le permito hacer?** — alcance, sandboxing, confirmaciones.
   5. **¿Cómo me entero si cambia?** — versioning, changelog, notificaciones.
   Cierre conceptual: "Si las cinco no te incomodan, conectalo."

6. **Cierre de clase.** Slide-poster final:
   > "MCP no es la respuesta a todo."
   Subtexto:
   > "Es infraestructura que vino para quedarse. Saber qué es, qué resuelve, cómo está armado y dónde tener cuidado es lo que separa al que lo usa bien del que lo usa mal o no lo usa."

**Patterns:** slide-poster, grid 3×1 y 4×1 con reveals, tabla 3×2, `clickable-steps` (5 preguntas).
**Animations:** Si se usa `clickable-steps.js` en slide 5, mismo wiring que §5.
**Speaker-note target:** ~140–200 palabras para slides 1, 5, 6 (claves); ~100–140 para el resto.

---

## Task 11 — Coherence pass

**Subagent dispatch.** Inputs: `semanas/06/slides/index.html` ensamblado + spine completo.

**Steps:**

- [ ] **Step 1: Ensamblar el deck completo.**
  ```bash
  node semanas/06/slides/_assemble.mjs
  ```
  Expected: `sections: ≥11 open / ≥11 close` (10 + título + preguntas), `unfilled markers: 0`.

- [ ] **Step 2: Recorrer transiciones entre secciones** y verificar bridges:
  - §1 → §2: bridge a "por qué tiene que ser protocolo".
  - §2 → §3: bridge a "cómo está armado por dentro".
  - §3 → §4: bridge a "qué se manda por las flechas".
  - §4 → §5: bridge a "cómo el LLM se entera".
  - §5 → §6: bridge a "qué implica esto para el ecosistema".
  - §6 → §7: bridge a "los demos prueban la pregunta cero".
  - §8 → §9: bridge a "y si no fuera código" (Blender).
  - §9 → §10: bridge a "calibración final".

- [ ] **Step 3: Verificar reuso visual.** Tres elementos recurrentes:
  - **`.mcp-arch`** aparece en §3 (`.focus-default`), §4 (`.focus-server`), §5 (`.focus-handshake` opcional en opener). Verificar continuidad — mismo diagrama, no re-dibujado.
  - **`.protocol-matrix`** aparece en §2 (`.state-nm` → `.state-nplusm`) y §6 slide 1 (`.state-nplusm` reusado).
  - **Diagrama del intercambio** del §5 se referencia en §7 slide 4, §8 slide 5 y §9 slide de cierre (donde cierra el bloque entero de demos con los tres ángulos: actuar / informar / crear).

- [ ] **Step 4: Verificar whole-week through-line.** El arco "setup → mecánica → ecosistema → uso → calibración" tiene que sentirse:
  - §1 cierra cuando entra el protocolo en §2.
  - Mecánica (§§2-5) cierra con el insight del §5 slide 6.
  - Ecosistema (§6) cierra con la pregunta cero.
  - Demos (§§7-9) materializan los tres ángulos (actuar / informar / crear).
  - Cierre (§10) calibra.

- [ ] **Step 5: Verificar la pregunta cero** en §1 (slide 1 — el "lo decidió Anthropic"), §6 (slides 5-10) y §10 (slide 1 y slide 5). Tiene que estar **destacada visualmente** y consistente.

- [ ] **Step 6: Verificar la animación `clickable-steps` del §5.** En el navegador, verificar:
  - Los 4 steps aparecen como row clicable.
  - Click en cada uno highlight + muestra detail panel debajo.
  - Mini-JSONs visibles en el detail panel.
  - Sin errores en console.

- [ ] **Step 7: Cazar bullet-list slides.** Grep por `<ul>` en todos los `_section-*.html`. Cada uso debe estar justificado per memoria `feedback_no_bullet_lists`.

- [ ] **Step 8: Cazar emojis y términos prohibidos.**
  ```bash
  grep -P '[\x{1F000}-\x{1FFFF}]' semanas/06/slides/_section-*.html
  ```
  Términos prohibidos: `payoff`, `vibe coding`, `diplomatura`, `bisagra`, `dolores`, `mismatch`, `diálogo socrático`, `scaffolding`, `andamiaje`, `esta clase`, `esta semana`, `del curso`, `primer slide`.

- [ ] **Step 9: Verificar speaker notes en three-format.** Spot-check 3 slides por sección: cada `<aside class="notes">` con `<strong>` / `<u>` / `<em>` apropiados. En slides con fragments, **un `<em>` por reveal**.

- [ ] **Step 10: Verificar tamaños de body text** (per memoria `feedback_slide_text_sizing`): body principal ≥1.1rem, secundario ≥1.05rem, eyebrows ≥0.85rem.

- [ ] **Step 11: Cazar `<span>` dentro de `<pre><code>`** (per memoria `feedback_pre_code_no_inline_spans`).

- [ ] **Step 12: Final check en navegador.** `npm start`, navegar slide por slide. Verificar:
  - Sin errores en console.
  - Sin slides clippeados.
  - `.mcp-arch` se re-ilumina correctamente entre §§3-5.
  - `.protocol-matrix` transiciona entre estados en §2.
  - `clickable-steps` del §5 funciona.
  - Demos placeholder se ven.

- [ ] **Step 13: Commit final.**
  ```bash
  git add semanas/06/slides/ _config/theme/components.css
  git commit -m "feat(s06 slides): coherence pass + deck completo §1-§10"
  ```

---

## Self-review (writing-plans)

**Spec coverage:**
- Whole-week through-line "setup → mecánica → ecosistema → uso → calibración" cubierto por la división del plan. ✓
- §1 colapsa lo que originalmente era §§1-3 sin re-enseñar tools/ReAct/context engineering. ✓
- Diagrama host/client/server recurrente cubierto en Task 0 (CSS base) + introducido en Task 3 + re-iluminado en Tasks 4, 5. ✓
- Matriz N×M nombrada verbalmente en Task 1 (slide del wrapper custom) + formalizada visualmente en Task 2 + reusada en Task 6 slide 1. ✓
- Pregunta cero ("¿el host ya lo hace?") en Task 1 (slide 1 implícito), Task 6 (formal) y Task 10 (modelo mental), verificado en Coherence Step 5. ✓
- Diagrama del intercambio del §5 referenciado en §7 slide 4, §8 slide 5, y §9 slide de cierre (donde cierra el bloque entero de demos con los tres ángulos). ✓
- Hooks decididos en spine respetados. ✓
- Demos solo en §§7-9 cubiertos; §§1-6 sin terminal compartido. ✓
- Vocabulario canónico (MCP Host/Client/Server, Stdio/Streamable HTTP, model/app/user-controlled) en Conventions + reiterado en tasks. ✓
- Animación `clickable-steps` del §5 con fallback documentado. ✓
- Plan B documentado para demos en vivo §§7-9; video pre-grabado obligatorio para Blender (§9). ✓
- Los tres demos forman triada conceptual (actuar / informar / crear) con slide de cierre conjunto en §9 slide 5. ✓

**Placeholder scan:** Sin "TBD". "TODO" aparece como contenido intencional de los stubs creados en Task 0 (que las Tasks 1-10 reemplazan).

**Type consistency:** Verificado:
- `.mcp-arch.focus-default/focus-server/focus-handshake` consistente entre Task 0 Step 7 y Tasks 3-5.
- `.protocol-matrix.state-nm/state-nplusm` consistente entre Task 0 Step 7, Task 2 y Task 6 Step 1.
- `clickable-steps.js` wiring consistente entre Task 0 Step 4-5 y Tasks 5, 10.
- Numeración de section markers `_section-1.html` a `_section-10.html` consistente.

Plan listo.

---

## Execution Handoff

Plan guardado en `semanas/06/plan.md`. Próximo paso: Fase 3 — ejecutar tarea por tarea. Per slide-generation skill override, **hand straight to phase 3** (no extra checkpoint — el gate del spine ya pasó).

Recomendación: usar `superpowers:executing-plans` (no `subagent-driven-development`) para mantener checkpoints humanos por sección.

---

# Plan de revisión 2026-10-05 — spec MCP 2026-07-28, harnesses y estilo

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar el deck de S06 al día con (1) la spec MCP 2026-07-28 (stateless, `server/discover`, Roots/Sampling/Logging deprecados) y el Claude Code actual (tool search, WebFetch/WebSearch nativos, `--chrome`); (2) los equivalentes de Codex y OpenCode donde se configura MCP y en los tips de §9; (3) las reglas de estilo acumuladas desde junio. Suma 1-2 slides de riesgos en §6.

**Architecture:** Se editan los fragmentos `slides/_section-N.html` (y `_scaffold.html`) y se regenera `slides/index.html` con `node semanas/06/slides/_assemble.mjs`. Sin JS nuevo: §5 reusa `clickable-steps.js`; los `harness-map` usan las clases de `_config/theme/components.css`. Cada sección es dueña de su fragmento, así que las tareas 1-9 son independientes entre sí.

**Tech Stack:** reveal.js, CSS por sección + `_config/theme/components.css`, Playwright (medición), Node.

**Spec:** `semanas/06/spine.md` — bloque "Revisión 2026-10-05" al principio (manda sobre el resto del spine). Los hechos técnicos salen **solo** de ese bloque o de una verificación nueva contra la doc oficial, citada en las notas `<u>`.

**Herramienta de medición:** `<scratchpad>/measure.mjs <index.html> [filtroTitulo]` — mide cada estado de fragments de cada slide a 1280×800 con el safety-net neutralizado. Línea base (2026-10-05): 54 slides; desbordan §1 "¿Cómo le damos Postgres…" (392px) y §4 Tools / Resources / Prompts (27-56px).

## Global Constraints

- Texto visible en español rioplatense (voseo); términos técnicos en inglés (server, client, host, transport, tool, schema, request, OAuth, scope…). Nada de "net-new" visible → "suma" / "nuevo".
- Nada de "payoff", "bisagra", "diplomatura", "vibe coding", "diálogo socrático", "dolores", "mismatch", "robusto"; **nada de meta-referencias en texto visible** ("vimos", "viene ahora", "al cierre", "de la sección", "de la clase", "hace semanas", "esta semana"). En notas se permiten.
- Sin marketing ni mención al TP en texto visible.
- Body principal ≥1.1rem, secundario ≥1.05rem, eyebrows/labels ≥0.85rem, mono en línea ≥0.95rem. Si el aumento desborda, se recorta texto, no se baja el tamaño.
- Texto centrado: un solo `max-width` por slide para h2/sub/caption, con `margin-left/right: auto` (no shorthand que pise otros márgenes).
- Speaker notes en tres formatos, cada uno en su `<p>`: `<strong>` acciones, `<u>` descripciones, `<p><em>"…"</em></p>` guion. **Un `<em>` por estado de reveal** (aterrizaje + uno por fragment). Slide sin fragments → un solo `<em>` (fusionar, no agregar fragments).
- Un aforismo de cierre por slide como máximo; prosa de notas ~80-200 palabras por slide.
- Nada de `<span>` dentro de `<pre><code>`. Sin emojis ni glifos decorativos (⚠ ✓ ⌘).
- Codex/OpenCode: solo hechos del bloque verificado del spine. La config V2 de OpenCode no se menciona.
- Los subagentes no commitean; el coordinador revisa el diff, ensambla, mide y commitea por sección con `tipo(s06 §N): descripción` + trailer `Co-Authored-By`.

## Review Focus

1. **Desborde por estado** a 1280×800 tras subir tamaños y sumar `harness-map`: medir cada sección con `measure.mjs`.
2. **Restos del modelo viejo** en cualquier slide o nota: `initialize` (fuera de la nota de compatibilidad de §5), "handshake", "stateful", "roots", "sampling", "cuatro primitives", "siete", "Notion", "context7" como demo, "§10", "cinco preguntas", "Aider", "MCPJam", "claude.ai" como host de servers locales, "CC no maneja un browser" sin matiz. Grep en la Task 11.
3. **`<em>` vs reveals**: contar fragments (por `data-fragment-index` distinto) vs `<p><em>` en cada slide tocada.
4. **Coherencia del discovery**: en ningún lado "el LLM descubre"; quien descubre y arma el contexto es el **cliente**.
5. **JS de §5**: el `initClickableSteps` reescrito carga sin errores de consola y la barra ilumina la dirección correcta en cada paso.

---

### Task 0: Setup — hecho

- [x] Branch `fix/semana06-revision-preclase`; spine delta commiteado (`fdaf32a`).
- [x] `measure.mjs` en el scratchpad + línea base.

### Task 1: §1 — el set nativo y lo que falta

**Files:** `slides/_section-1.html`.

- [ ] §1.1 set nativo: sumar WebFetch y WebSearch y una línea "y ~40 más: Agent, Skill, LSP…". Notas `<u>`: en macOS/Linux/WSL Glob y Grep no vienen por defecto (busca con `find`/`grep` vía Bash). Un solo max-width (1000px) para h2/sub/takeaway.
- [ ] §1.2 "Tres cosas que no están": reemplazar "Docs de un SDK que salió ayer" por **tu gestor de tareas (Linear, Jira)** — anticipa §8. Browser queda, con el matiz `--chrome` en `<u>`. Notas: 4 estados → 4 `<em>` (fusionar el cierre en el último).
- [ ] §1.3 "¿Cómo le damos Postgres…?": "Robusto" fuera; `.cursorrules` → `.cursor/rules/`; "Opencode" → "OpenCode" en todo el fragmento; nota de `deny` precisa (bloquea, no pregunta). Arreglar el desborde de 392px (medir por estado; aplicar las trampas de fragments de reveal si son fade-out que no liberan espacio).
- [ ] §1.5 poster MCP: fuera "Cómo está armado por dentro — viene ahora." y la tercera repetición de N×M.
- [ ] Tamaños (`.s1-tool-detail`, `.s1-nostá-gap`, `.s1-step-foot`) a mínimos; `<em>` fusionados en slides sin fragments.
- [ ] Assemble + measure + commit `fix(s06 §1): set nativo actual, ejemplos que de verdad faltan y estilo`.

### Task 2: §2 — protocolo, no API

**Files:** `slides/_section-2.html`.

- [ ] Definición: "propuesto por Anthropic en 2024; desde diciembre de 2025 lo gobierna la Agentic AI Foundation (Linux Foundation), co-fundada por Anthropic, OpenAI y Block".
- [ ] Bridge visible ("Vimos… / Veamos… / — viene ahora") → solo la línea conceptual; la narración a notas.
- [ ] §2.1 repite §1.4 casi literal: §2 queda como la formalización (matriz); recortar lo que §1 ya dijo, en texto visible y notas.
- [ ] Un aforismo por slide (caption de precedentes y bodies de las cards). Tamaños (`.s2-prec-body`, `.s2-usbc-attr`). `<em>` fusionados.
- [ ] Assemble + measure + commit `fix(s06 §2): gobernanza de MCP y estilo`.

### Task 3: §3 — arquitectura

**Files:** `slides/_section-3.html`.

- [ ] Data layer: "discovery (`server/discover`), primitives, notifications" — fuera "lifecycle". Streamable HTTP: sin sesiones de protocolo; auth: bearer, API keys, headers, OAuth recomendado.
- [ ] Ejemplos de servers sin sqlite (archivado).
- [ ] H2 "La regla clave." → la regla como h2 ("Un client por cada server."). Fuera "de memoria al final de la sección"; "Vimos qué participantes hay…" → "Falta qué viaja por esas flechas."
- [ ] "transporte" → "transport"; notas: unificar "server/client"; typo "Es el modo el server vive con vos".
- [ ] Labels del diagrama (0.65-0.8rem) → ≥0.85rem sin romper el diagrama (se re-ilumina en §4 y §5: no cambiar clases ni estructura). `<em>` fusionados.
- [ ] Assemble + measure + commit `fix(s06 §3): data layer de la spec actual y estilo`.

### Task 4: §4 — primitives

**Files:** `slides/_section-4.html`.

- [ ] §4.1: "El cliente expone otras cuatro — al cierre." → sin forward reference, coherente con la §4.6 nueva.
- [ ] §4.2 Tools: `browser_click` con params actuales (`element` opcional, `target`); descripciones actuales; prompt de permiso con el nombre real `mcp__playwright__browser_navigate`; fuera ⚠ ✓. Desborde 27px.
- [ ] §4.3 Resources: Postgres "oficial de Anthropic" (archivado) → server genérico o DBHub; en Claude Code un resource se pide con `@server:protocol://path` (y el modelo también puede leerlos con `ReadMcpResourceTool`), no un panel. "Net-new"/"llave-owner" fuera. Desborde 35px.
- [ ] §4.4 Prompts: fuera "Git MCP" con prompts inventados → ejemplo explícitamente genérico ("un server de code review podría exponer…"); invocación real `/mcp__server__prompt` (args separados por espacio); fuera ⌘; "Dialogo" → "Diálogo". Desborde 56px.
- [ ] §4.5: un aforismo como máximo.
- [ ] §4.6 reescrita: h2 "Y del otro lado: lo que pone el cliente." Elicitation como la activa (el server necesita un dato del usuario → devuelve `input_required`, el cliente pregunta y reintenta). Roots, Sampling y Logging en gris como **deprecadas en 2026-07-28** con su reemplazo en una línea (directorios por parámetro / integrar el LLM directo / stderr u OpenTelemetry). Fuera "Las nombramos para que sepan que existen…". Notas sin el framing del cutoff.
- [ ] Tamaños de cards, bloques spec/JSON y labels. `<em>` alineados.
- [ ] Assemble + measure + commit `fix(s06 §4): primitives según la spec 2026-07-28 y ejemplos reales`.

### Task 5: §5 — discovery sobre la spec actual

**Files:** `slides/_section-5.html` (incluye el bloque `INIT-SCRIPTS-§5`).

- [ ] Hook: sin "lo venís haciendo hace semanas" → "ya lo hacés".
- [ ] Timeline (5 nodos): conectás → el cliente le pregunta al server quién es y qué sabe (`server/discover`: versiones, capabilities, identidad) → pide `*/list` → **el cliente** arma el contexto del modelo (en Claude Code, con tool search: primero los nombres, el schema completo cuando hace falta) → el modelo ya sabe. Caption que responde el hook. Fuera "stateful / queda fijo toda la sesión": ahora **cada request lleva su tarjeta** (versión + capabilities del cliente en `_meta`). Notas: los servers en revisiones anteriores usan `initialize`; los clientes nuevos usan `server/discover` como sonda y caen al handshake viejo si hace falta. `<em>`: 8 estados → 8 bloques.
- [ ] Animación `clickable-steps` (barra Client⟷Server): 4 pasos — (1) `server/discover` →/← con mini-JSON real; (2) `tools/list` con `_meta` (`io.modelcontextprotocol/protocolVersion`, `clientCapabilities`) y result con `tools[]`, `ttlMs`, `resultType`; (3) **Cliente → contexto del LLM** (corrige "Server → contexto"); (4) `tools/call`. Verificar las formas exactas contra `modelcontextprotocol.io/specification/2026-07-28` antes de escribir el JSON.
- [ ] Poster del insight: "el contexto lo arma el cliente, solo" — se mantiene; la explicación "descubrir vs usar" queda solo acá (fuera de las notas del timeline).
- [ ] Notifications: el cliente se suscribe (`subscriptions/listen`, opt-in a `toolsListChanged`) → el server avisa `notifications/tools/list_changed` → el cliente vuelve a pedir `tools/list`. Fuera roots. `<em>`: 4 estados → 4 bloques.
- [ ] Consecuencia: un aforismo como máximo. Tamaños (`.s5-tl-desc` 0.86 etc.).
- [ ] Assemble + measure + clickear los 4 pasos de la animación en Playwright sin errores de consola + commit `feat(s06 §5): discovery sobre la spec 2026-07-28 — server/discover, sin handshake`.

### Task 6: §6 — ecosistema, harnesses y riesgos

**Files:** `slides/_section-6.html`.

- [ ] Hub "Un server, muchos hosts": Claude Code, Codex, OpenCode, Cursor, VS Code, Gemini CLI (fuera Aider y MCPJam). "Mismo server" en vez de "mismo binario"; notas: ChatGPT y claude.ai solo aceptan servers remotos.
- [ ] "Cómo se agrega un server" → `harness-map` (Claude Code `is-ref` / Codex / OpenCode): comando de Playwright + archivo que escribe y su forma (`mcpServers` con `"type": "stdio"` / `[mcp_servers.playwright]` en `config.toml` / `"mcp": {"playwright": {"type": "local", "command": [...]}}` en `opencode.json`). `harness-map-foot`: lo que comparten (un nombre + cómo arrancar el proceso). Forma canónica de CC con `--` en notas.
- [ ] "¿Dónde vive ese JSON?": tabla de CC intacta; notas `<u>` con los scopes de Codex (`~/.codex/config.toml`; `.codex/config.toml` solo si el proyecto es trusted) y OpenCode (global + proyecto, merge, gana el proyecto). Tamaños.
- [ ] "Una sesión nueva, antes y después": nativas actuales; las tools de MCP entran **diferidas** (tool search: nombres primero). Fuera "el discovery que vimos recién" y el "extiende, no reemplaza" adelantado. `<em>` 3 estados → 3 bloques. "~20 tools" → "~25".
- [ ] "Tres consecuencias": `<em>` 4 estados → 4 bloques.
- [ ] "Aplicado a Claude Code": redundantes = filesystem, git, **fetch (WebFetch)**; suman = Playwright (con `--chrome` como matiz en una línea), Linear/gestores de tareas, Postgres, GitHub; context7 fuera (zona gris en notas: WebFetch/WebSearch cubren buena parte). "Net-new" → "suma".
- [ ] "¿Y por qué existen, entonces?": claude.ai → **Claude Desktop**.
- [ ] Pregunta cero: fuera "lo vemos al cierre de la clase"; un solo max-width; notas sin §10, "cinco preguntas" ni context7-demo.
- [ ] **Slide nueva de riesgos**, después de la pregunta cero: tres cards con reveal — (1) **lo que la tool devuelve entra al contexto**: una página o un issue pueden traer instrucciones (prompt injection); (2) **el server actúa con tus credenciales**: alcance del token/OAuth (ej.: `mcp.linear.app/mcp/readonly`); (3) **un server local es código de terceros en tu máquina**: `npx …@latest` corre lo que se publicó hoy (versión fija, servers oficiales, MCP Registry). Línea de cierre: las reglas allow/deny/ask aplican a las tools de MCP (`mcp__server__tool`). Notas: "cuándo no" — si el host tiene Bash, un CLI + skill puede reemplazar a un server (Playwright CLI, `ctx7`). Sin bullets. 4 `<em>`.
- [ ] Tamaños de las clases `.s6-*` de la auditoría. `<em>` fusionados en slides sin fragments.
- [ ] Assemble + measure + commit `feat(s06 §6): harness-map, clasificación actual en CC y riesgos`.

### Task 7: §7 — demo local Playwright

**Files:** `slides/_section-7.html` (incluye `INIT-SCRIPTS-§7`).

- [ ] §7.1 pregunta cero reencuadrada: "¿Claude Code maneja un browser?" → "De fábrica, no" → "corresponde MCP", más una línea: la extensión Claude in Chrome lo hace con plan pago, y por dentro es un MCP server; Playwright es el portable (cualquier host, sin plan). Notas: Codex y OpenCode no manejan browser.
- [ ] §7.2: fuera "El comando que ya vimos, aplicado."; comando consistente con §6.
- [ ] §7.4 demo: `summary` de cada paso → bullets de acciones (`Terminal:`, `En Claude:`, `Mirar:`); Plan B al final del `example` del último paso; en notas, `<hr>` + "Acciones (copiables)" + Plan B (screenshots pre-armados).
- [ ] §7.5: "el LLM las descubre" → "el cliente las descubre"; fuera "del bloque de discovery" y el bridge visible (a notas); un solo aforismo.
- [ ] Tamaños (`.s7-transport-tag`, `.s7-flow-step`). `<em>` fusionados.
- [ ] Assemble + measure + commit `fix(s06 §7): pregunta cero con --chrome, demo boxes accionables y discovery correcto`.

### Task 8: §8 — demo remoto Linear

**Files:** `slides/_section-8.html` (incluye `INIT-SCRIPTS-§8`).

- [ ] §8.2 "Un remoto se agrega distinto" → `harness-map` del remoto: `claude mcp add --transport http linear-server https://mcp.linear.app/mcp` + `/mcp` o `claude mcp login` / `codex mcp add linear --url …` + `codex mcp login linear` / `opencode mcp add linear --url …` + `opencode mcp auth linear`. Foot: lo que comparten (URL + OAuth; el token queda guardado y se renueva). El contraste local/remoto (`type: stdio` vs `type: http`) se conserva si entra; si no, a notas. JSON consistente con §6.
- [ ] §8.4 demo: mismo formato de demo boxes que §7 + acciones copiables + Plan B.
- [ ] §8.5: "el LLM descubre" → "el cliente descubre". Tamaños (`.s8-close-body`, `.s8-cmp-row`). `<em>` fusionados.
- [ ] Assemble + measure + commit `feat(s06 §8): harness-map del server remoto y demo boxes accionables`.

### Task 9: §9 — día a día, en los tres harnesses

**Files:** `slides/_section-9.html`.

- [ ] Opener: fuera el eyebrow "Para cerrar" (y su inline style); h2 "Cuatro cosas del día a día."; sub con Claude Code como referencia y su equivalente en los otros dos.
- [ ] Grid 2×2: cada tip-card suma una línea "Codex: … · OpenCode: …" (`/btw` → `/side` o `/btw` · no tiene; `/rc` → vía la app de escritorio (`/app`) · `opencode serve`/`web` + `attach`; retomar → `codex resume --last` / `codex resume` · `opencode -c` / `/sessions`; `/rewind` → Esc Esc, solo la conversación · `/undo` revierte mensaje y archivos). Fuera `/compact`. 4 fragments → 5 `<em>` (el aterrizaje no narra el tip 1).
- [ ] Cierre temático intacto (sin puente a otra clase); notas sin "si se llevan una sola idea" repetido.
- [ ] Tamaños (`.s9-tip-what`, `.s9-tip-when`). Assemble + measure + commit `feat(s06 §9): tips del día a día con su equivalente en Codex y OpenCode`.

### Task 10: Scaffold + source material

**Files:** `slides/_scaffold.html`, `source_material/index.md`.

- [ ] `_scaffold.html`: comentario de §8 "Notion" → "Linear".
- [ ] `index.md`: nota de estado "Revisión 2026-10-05" — qué del source quedó superado (handshake `initialize`, client primitives, set nativo de CC, context7 como net-new) y que manda el spine.
- [ ] Commit `docs(s06): scaffold y source al día con la revisión`.

### Task 11: Coherence pass

- [ ] Grep de restos (Review Focus 2) en `semanas/06/slides/_section-*.html` y `_scaffold.html`.
- [ ] Conteo fragments vs `<em>` en todas las slides; `<p>` envolviendo cada `<strong>/<u>/<em>` de notas.
- [ ] `measure.mjs` sobre el deck completo: 0 desbordes, 0 errores de consola.
- [ ] Screenshots de las slides tocadas (último estado de fragments) y revisión visual.
- [ ] Spine: corregir la "Nota de escala" y la línea del whole-week through-line sobre §9.
- [ ] Commit `chore(s06): coherence pass de la revisión`.

## Self-review (writing-plans, revisión 2026-10-05)

- Cobertura del delta del spine: §1 (T1), §2 (T2), §3 (T3), §4 + §4.6 (T4), §5 (T5), §6 hub/harness-map/scopes/clasificación/Desktop/riesgos/cuándo-no (T6), §7 (T7), §8 (T8), §9 (T9), global + bridge (T10-T11).
- Sin placeholders: cada tarea nombra la slide, el texto que sale y el que entra, o el criterio verificable.
- Riesgo principal: §5 (JSON de la spec nueva). Mitigación: verificar contra la spec 2026-07-28 antes de escribir y probar la animación clickeando.
