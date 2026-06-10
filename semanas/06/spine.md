# Spine — Semana 06: Model Context Protocol (MCP)

**Whole-week through-line:** Los agentes que viene usando el alumno desde S04 ya tienen tools nativas (`Read`, `Write`, `Bash`, `Grep`, `Glob`, `Edit` en Claude Code). Lo que no se discutió aún: ese set lo decidió Anthropic, y para todo lo que está afuera (DB de prod, browser, docs en vivo de un SDK que salió ayer) no hay tool. Las dos salidas instintivas tienen techo — **wrapper custom por host (N×M, no se reusa)** y **pegar al prompt (costos, frescura, ruido — lo que ya conocen desde context engineering)**. **MCP es la salida estructural: un protocolo común** donde el problema colapsa a N+M. §1 plantea el problema y nombra la solución en un golpe; §§2-6 desarman el protocolo en capas (por qué protocolo, arquitectura, primitives, discovery, ecosistema con la pregunta cero); §§7-8 materializan con **dos demos que contrastan los dos transports** (Playwright = server **local**/Stdio; Linear = server **remoto**/Streamable HTTP), mostrando que el patrón de intercambio es idéntico viva donde viva el server; §9 cierra con **recomendaciones prácticas de Claude Code** (`/btw`, `/rc`, retomar sesión, `/rewind`). La cadena es **setup → mecánica → ecosistema → uso → cierre**. (Rediseño 2026-06-09: antes eran tres demos + sección de riesgos.)

**Dispositivos pedagógicos de toda la semana:**

- **El diagrama host/client/server de §3 como ancla visual recurrente.** Se construye CSS-only en §3 y se re-ilumina en §4 (focus-server) y §5 (focus-handshake). Equivalente del pipeline-roadmap de S05.
- **La matriz N×M → N+M aparece dos veces.** Se introduce verbalmente en §1 (slide del wrapper custom, donde se nombra el problema sin formalizarlo) y se formaliza visualmente en §2 (`.protocol-matrix` con dos estados). En §6 reaparece cerrando el argumento de portabilidad.
- **La pregunta cero ("¿el host ya lo hace?")** introducida con peso en §6 y reforzada en §9. Es el modelo mental que más se llevan. Conecta directo con §1: la observación de "el set lo curó Anthropic, no es extensible" se vuelve criterio operativo en §6 y §9.
- **Vocabulario canónico sostenido a lo largo del deck.** MCP Host / MCP Client / MCP Server capitalizados; Stdio transport / Streamable HTTP transport; data layer / transport layer; model-controlled / application-controlled / user-controlled.
- **Cero animaciones JS reusables de semanas anteriores.** Deck CSS-heavy. Único candidato a JS: el diagrama del handshake en §5 (`clickable-steps.js` adaptado, o nuevo). Las dos demos en vivo (§§7-8) no son animación, son terminal real.

**Nota de escala:** 10 secciones, ~2h de clase (~85 min concepto, ~35 min demos). Estimado total **~50–60 slides** — más liviano que un planteo inicial de 11 secciones porque arrancamos directo desde un problema bien delimitado, sin re-enseñar tools/ReAct/context engineering que vienen de S04. Los tres demos en bloque (~25-30 min) son el corazón pedagógico — tres dominios completamente distintos con el mismo patrón de intercambio.

**Bridge con semana 05:** S05 cerró con "el TP final usa el flujo Superpowers". S06 retoma: los agentes que vinieron usando en S05 usan tools nativas del host. MCP es la forma estándar de **extender ese set sin atarse a un host**. El protocolo es transversal al flujo Superpowers, no lo reemplaza.

**Bridge con semana 07 / semana 08:** S06 es la última clase con material teórico formal. S07 será clínica/consultas para el TP, S08 es Demo Day. El §9 cierra con un modelo mental ("MCP server como una dependencia más", cinco preguntas con la pregunta cero al frente) deliberadamente portable — herramienta que se llevan más allá del curso.

---

# Setup del problema (§1)

## Section 1: Más allá del set que trae el host
**Source material:** `source_material/01-mas-alla-del-set-que-trae-el-host.md`
**Through-line:** Recap rápido de que Claude Code trae un set de tools de fábrica (`Read`, `Write`, `Edit`, `Grep`, `Glob`, `Bash`) que el alumno ya usó. **Lo que no se discutió:** ese set lo decidió Anthropic, es finito, y para todo lo que está afuera no hay tool. Tres ejemplos concretos de capacidades que no están (Postgres de prod, browser controlado, docs en vivo de SDK nuevo). Las dos salidas instintivas tienen techo: **wrapper custom por host** se duplica por (host × capacidad) — N×M; **pegar al prompt** sufre costos, frescura, ruido (el alumno ya conoce esto desde context engineering — se nombra rápido, no se re-explica). La salida estructural es un protocolo común: MCP. La sección nombra al cierre; el resto del bloque lo desarma.
**Hook:** El recap del set + la pregunta dirigida "¿qué hacés cuando lo que necesitás no está en el set?". No re-enseña tools/ReAct/context engineering — los asume y los redirige a una observación nueva: que el set es curado y no extensible.
**What students walk away knowing:**
- Claude Code trae un set finito y curado de tools (Read/Write/Edit/Grep/Glob/Bash). Ideal para el grueso del workflow local. **No lo extendés editando código de CC** — el set lo decide Anthropic.
- Tres ejemplos concretos de lo que **no** está en el set (DB de prod, browser, docs en vivo).
- Las dos salidas instintivas tienen techo: **wrapper custom no se mueve entre hosts (N×M)**; **pegar al prompt** no escala (costos, frescura, ruido — ya conocido desde S04).
- La salida estructural es **un protocolo común — MCP**. Lo que viene en las próximas secciones es cómo está armado y qué te resuelve.
**Animations / interactive:** Ninguna JS. CSS-only. Grid 6-col para las tools nativas (cards); grid 3-col con reveals para las tres "no está" concretas; card grande con visual de wrappers duplicados (4 cards horizontales — uno por host) para la salida vieja 1; chips chicos para las tres complicaciones de la salida vieja 2; slide-bridge tipo poster para "MCP".
**Slide budget:** 5 slides.

---

# Mecánica del protocolo (§§2-5)

## Section 2: Protocolo, no API
**Source material:** `source_material/02-protocolo-no-api.md`
**Through-line:** Si el LLM va a llamar cosas afuera de su set base, ¿cómo se las describimos? El problema N×M (cada cliente con su formato propio) colapsa a **N+M** con un protocolo común. Precedentes históricos del mismo patrón (HTTP entre browsers/servers, LSP entre IDEs/lenguajes). MCP es eso para agentes — **estándar open-source**, no producto Anthropic. Analogía oficial: **USB-C para aplicaciones de IA**.
**Key analogy:** **Dos analogías que cumplen funciones distintas, las dos van:**
- **HTTP / LSP** como precedentes estructurales — explican el *por qué* (N×M → N+M con datos históricos).
- **USB-C** (la analogía oficial de la doc) — metáfora rápida y memorable que se quedan.
**What students walk away knowing:**
- Por qué N×M es insostenible y cómo un protocolo común lo colapsa a N+M (la frase ya cayó en §1; acá se formaliza con la matriz visual).
- HTTP y LSP como precedentes del mismo patrón — ven que MCP no inventa nada nuevo conceptualmente.
- MCP = Model Context Protocol, **estándar open-source** (la definición canónica no menciona a Anthropic), propuesto en 2024 y adoptado por Claude, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI.
- USB-C como analogía rápida de la doc oficial.
**Animations / interactive:** Ninguna JS. Diagrama CSS del problema N×M (`.protocol-matrix.state-nm`: matriz de líneas cruzadas entre clientes y proveedores) → mismo diagrama con el protocolo (`.protocol-matrix.state-nplusm`: líneas que colapsan a N+M, con el bus central etiquetado "MCP"). Animación CSS de la matriz colapsando vía fragment-reveals. Slide del USB-C como metáfora rápida. **El diagrama de N×M/N+M reaparece visualmente en §6.**
**Slide budget:** 5–6 slides.

## Section 3: Arquitectura: host, cliente, servidor
**Source material:** `source_material/03-arquitectura-mcp.md`
**Through-line:** Los tres roles canónicos: **MCP Host** (la app), **MCP Client** (componente adentro del host), **MCP Server** (proceso externo). Regla clave: **un cliente por cada server conectado** — un host puede tener N clientes corriendo. Las **dos capas**: data layer (JSON-RPC) y transport layer. **Dos transports**: Stdio (local) y Streamable HTTP (remoto). El diagrama mental al final tiene que ser portable y reusable en §§4-5.
**What students walk away knowing:**
- Los tres roles con definiciones canónicas y capitalización oficial (MCP Host / MCP Client / MCP Server).
- La regla "un cliente por servidor conectado" — no es un cliente único que habla con muchos servers, son muchos clientes adentro del mismo host.
- Las dos capas (data / transport) y por qué la separación importa — el mismo set de mensajes funciona idéntico sobre cualquier transporte.
- Stdio vs Streamable HTTP: cuándo cada uno (regla simple: disco/red local → Stdio; servicio compartido → Streamable HTTP).
- El diagrama mental: host con varios clientes adentro, cada server como proceso aparte, flecha bidireccional JSON-RPC entre cada par cliente-server.
**Animations / interactive:** **Pieza visual central de la Parte 2.** Diagrama CSS animado de los tres roles (`.mcp-arch.focus-default`), **construido bespoke para reuso en §§4-5**. Host como contenedor visible, dos o tres MCP Clients adentro (uno por server), servers como rectángulos aparte (uno local "stdio", uno remoto "HTTP"), flechas bidireccionales etiquetadas JSON-RPC. Fragment-reveal para introducir un rol por vez. El diagrama se re-ilumina (focal-blur sobre distintas partes) en §4 (`.focus-server`) y en §5 (`.focus-handshake`).
**Slide budget:** 6–7 slides.

## Section 4: Las tres primitives
**Source material:** `source_material/04-tres-primitives.md`
**Through-line:** Un MCP Server expone tres primitives, cada una con **dueño distinto de iniciativa**: **tools (model-controlled)** = acciones con efecto; **resources (application-controlled)** = datos pasivos leíbles; **prompts (user-controlled)** = templates reutilizables. La separación importa porque cada dueño implica permisos y UI distintos. Y del otro lado, el **cliente** también expone primitives (Sampling, Elicitation, Roots, Logging) — los nombran al pasar para cerrar el panorama.
**What students walk away knowing:**
- Las tres server primitives con su nombre canónico, su intuición y **quién toma la iniciativa** (model / application / user). El framing "who controls it" es de la doc oficial.
- Por qué la separación importa: cada dueño de iniciativa implica permisos, presentación y garantías distintas.
- Direct resources vs resource templates (URIs parametrizadas tipo `travel://activities/{city}/{category}`).
- Que existen client primitives — **Sampling** (server le pide al cliente "pedile al LLM esto"), **Elicitation** (server le pide al cliente "preguntale al usuario"), **Roots** (cliente le declara al server "estos directorios son tu scope"), **Logging**. Los nombran al pasar; no se profundizan.
**Animations / interactive:** Ninguna JS. Re-iluminación del diagrama del §3 con foco en el server (`.mcp-arch.focus-server`). `data-table` 3-cols (nombre / dueño / ejemplos) para las tres server primitives. Slide por primitive con su definición + métodos canónicos (`tools/list` y `tools/call` etc.) en un `code-walkthrough`. Slide "Y del otro lado" con las 4 client primitives como cards horizontales.
**Slide budget:** 6–7 slides.

## Section 5: Discovery dinámico ⭐
**Source material:** `source_material/05-discovery-dinamico.md`
**Through-line:** **La pieza más elegante de MCP — el clímax conceptual de la clase.** La pregunta organizadora: *¿cómo es que el LLM puede usar tools que se publicaron después de su cutoff?* Respuesta en dos mecanismos canónicos: **capability negotiation** durante `initialize`, y **discovery** vía `*/list`. Plus **notifications** (`listChanged`) para cambios en vivo. El modelo no memoriza tools; los descubre en tiempo de conversación. Por eso el ecosistema crece sin coordinación central.
**Hook:** **La pregunta del cutoff** como apertura — pregunta que el alumno arrastra desde S04 ("¿cómo el agente usa tools que no vio?"). La sección entera es la respuesta a ese gancho. Funciona como "aha moment" de la clase.
**Key analogy:** El handshake como **presentación entre dos extraños** — cliente y server se cuentan qué versión del protocolo hablan y qué saben hacer. La analogía es liviana pero útil para evitar que JSON-RPC suene a magia.
**What students walk away knowing:**
- **Capability negotiation** durante `initialize` — el protocolo es **stateful**, la negociación queda registrada para toda la sesión.
- **Discovery via `*/list`** — el catálogo con metadata (name, description, inputSchema) se le pasa al LLM como parte del system context.
- **El insight clave:** el modelo no necesita memorizar tools; los descubre en tiempo de conversación. Por eso cualquier server nuevo, escrito hoy, es usable hoy, sin reentrenar.
- **Notifications** (`listChanged` + `notifications/tools/list_changed`) — el catálogo es dinámico, no una foto inicial.
- La consecuencia: el ecosistema crece sin coordinación central; MCP es infraestructura, no producto.
**Animations / interactive:** **Estructura timeline-first (rediseño aprobado 2026-06-07).** El medio NO re-explica `*/list` (§4 ya lo mostró tres veces con metadata) — se apoya en él para contar el *cuándo/quién*. Arco de 6 slides: (1) **hook** "¿quién arma el contexto, y cuándo?"; (2) **timeline estático** "qué pasa cuando conectás un server" — 5 nodos revelados de a uno (conectás → handshake/capability negotiation → cliente pide `*/list` → catálogo→system context → el modelo ya sabe), con caption que responde el hook; (3) **animación de apoyo** vía `clickable-steps.js` (barra Client⟷Server + 4 steps de detalle del protocolo con mini-JSON al click, `onChange` ilumina dirección del mensaje) — profundización opcional, no sustancia; (4) **insight poster** "el contexto lo arma el cliente, solo; vos no tocás nada"; (5) **notifications** (`listChanged`); (6) **consecuencia** "el ecosistema crece sin coordinación central". Se eliminan los dos volcados de JSON crudo sueltos (handshake + catálogo) — el JSON sobrevive sólo en el detalle clicable de la animación.
**Slide budget:** 6 slides.

---

# Ecosistema (§6)

## Section 6: El ecosistema, qué viaja con vos, y qué vale instalar
**Source material:** `source_material/06-ecosistema-vendor-neutral.md`
**Through-line:** Cierra el argumento que abrió en §2 — **pero con un giro crítico**. Mismo server, N hosts: portabilidad real, el mismo binario corre en Claude Code, Claude Desktop, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI, MCPJam. **Tres consecuencias prácticas:** amortización, portabilidad, durabilidad. **Pero no todo MCP suma en todo host:** la observación del §1 vuelve formalizada acá — cada host trae sus tools nativas. **La pregunta correcta antes de instalar cualquier MCP server es siempre la misma: "¿el host ya lo hace?"**. Aplicación concreta a Claude Code (callback explícito al recap de §1): el set Read/Write/Edit/Bash/Glob/Grep vuelve **redundantes** algunos MCPs populares (filesystem, git, fetch) y deja como **net-new** a otros (playwright, context7, postgres, slack, github MCP). La misma pieza, distinto valor según dónde la conectes.
**Key analogy:** **"Build once and integrate everywhere"** — frase canónica de la doc, con asterisco: el valor lo aporta el server **sobre lo que el host ya tenía**. Lo que vale en un host fino (claude.ai chat) puede no valer en uno rico (Claude Code).
**What students walk away knowing:**
- Un MCP server corre idéntico en cualquier host MCP — **portabilidad estructural**.
- Cómo se agrega un server: en CC con `claude mcp add ...` (atajo), y el JSON `mcpServers` que escribe por debajo — casi igual en todos los hosts (con variaciones cosméticas).
- Los tres scopes y dónde vive el JSON de cada uno: `local` (default, `~/.claude.json` sección del proyecto, privado), `project` (`.mcp.json` en la raíz del repo, versionado/compartido), `user` (`~/.claude.json` global, privado). Precedencia local > project > user.
- Cómo cambia el contexto de una sesión nueva antes/después de agregar un server: solo tools nativas → nativas + las del MCP server (concreta el discovery de §5 y el "extiende, no reemplaza").
- Las tres consecuencias prácticas: amortización, portabilidad, durabilidad.
- **Cada host trae sus tools nativas** — MCP **extiende, no duplica**. Callback explícito a la observación de §1 (set curado de CC).
- **La pregunta correcta antes de instalar cualquier MCP server**: "¿el host ya lo hace?".
- Aplicación concreta a CC: qué tools nativas trae y qué eso vuelve redundante (filesystem, git, fetch MCPs) vs net-new (playwright, context7, postgres, slack).
- Por qué entonces existen filesystem MCP y git MCP — porque otros hosts (claude.ai chat) no traen lo que CC trae de fábrica. **Mismo binario, distinto valor según el contenedor.**
- Mapa rápido de servers populares **clasificados por valor en CC**.
**Animations / interactive:** Ninguna JS. **Reuso visual del diagrama N×M de §2** — `.protocol-matrix.state-nplusm` con el server al centro y flechas a múltiples hosts (cierra el arco). `code-walkthrough` del mismo JSON de config con tabs por host. **Slide-bisagra crítica:** "¿pero todo MCP suma en todo host?" → no — `comparison-2col` con tools nativas de CC en una columna y MCP en otra. Aplicación a CC en `data-table` o grid 2-col: "redundante en CC" / "net-new en CC". Mapa de servers populares en grid 2-col con el mismo eje. Closing slide con la pregunta cero ("¿el host ya lo hace?") como card central.
**Slide budget:** 8–10 slides.

---

# Demos (§§7-8) + Cierre (§9)

> **Rediseño aprobado 2026-06-09.** El cierre de la semana se reorganizó: en vez de tres demos net-new (Playwright/context7/Blender) + sección de calibración/riesgos, son **dos demos contrastando los dos transports** (local Stdio vs remoto Streamable HTTP) + un cierre con **recomendaciones prácticas de Claude Code**. Materializa el eje Stdio/HTTP de §3 y deja un cierre útil para el día a día. Las secciones §9 (Blender) y §10 (riesgos) viejas se eliminaron del scaffold; el material `08-demo-context7.md`, `09-demo-blender.md`, `10-cuando-mcp-y-riesgos.md` queda sin usar.

## Section 7: Demo local — Playwright (Stdio)
**Source material:** `source_material/07-demo-playwright.md`
**Through-line:** Primer demo en vivo. La pregunta cero de §6 da "no" (CC no maneja un browser) → corresponde MCP. **Es un server local (Stdio):** corre como subproceso en tu máquina, sin red, sin auth. Dos casos (lectura: traer títulos de una página; acción: completar un form). Lo que tienen que sacar no es Playwright — es **la forma del intercambio**, mapeada al diagrama del §5. Planta el eje local/remoto que cierra en §8.
**What students walk away knowing:**
- Cómo se instala un server local con un comando (`claude mcp add playwright npx @playwright/mcp@latest`).
- Que un server **local** corre en tu máquina, transport Stdio, sin red ni auth.
- El patrón del intercambio aplicado: server expone → LLM descubre → invoca → resultado vuelve.
- Por qué Playwright **sí** se instala en CC: net-new, CC no maneja un browser.
**Animations / interactive:** **Demo en vivo, terminal + browser lado a lado.** Slides: marco con pregunta cero + tag "local · Stdio"; install (`claude mcp add` + tags de transport); section-divider; beats del demo en `clickable-steps` (lectura/acción/Plan B); "qué viste" con el intercambio de §5 + bridge a §8. Plan B: screenshots pre-armados.
**Slide budget:** 5 slides (incluye divider).

## Section 8: Demo remoto — Linear (Streamable HTTP)
**Source material:** datos verificados contra doc de Claude Code y Linear (no hay `.md` de source dedicado).
**Through-line:** Segundo demo, **mismo patrón, otro transport**. Pregunta cero da "no" (CC no habla con tu Linear) → MCP. **Es un server remoto (Streamable HTTP):** lo hostea Linear, vive en internet, te conectás por URL + OAuth. El **corazón** es el contraste local/remoto: comando+args (Stdio) vs URL+OAuth (HTTP), `type: stdio` vs `type: http`, `/mcp` para el OAuth. Cierra el arco de los dos transports de §3 con evidencia: cambia la plomería, el intercambio es idéntico.
**What students walk away knowing:**
- Cómo se agrega un server **remoto**: `claude mcp add --transport http linear-server https://mcp.linear.app/mcp`, y el OAuth vía `/mcp` (se abre el browser, token guardado y auto-renovado).
- La diferencia concreta local vs remoto: dónde vive el server, comando vs URL, sin auth vs OAuth, `type: stdio` vs `type: http`.
- Que el **patrón de intercambio es el mismo** viva donde viva el server — eso cierra §3.
**Animations / interactive:** **Demo en vivo, terminal + Linear lado a lado.** Slides: marco con pregunta cero + tag "remoto · HTTP"; el contraste local/remoto (`comparison-2col` + flow de OAuth); section-divider; beats en `clickable-steps`; cierre "dos servers, dos transports, un patrón". Plan B: screenshots.
**Slide budget:** 5 slides (incluye divider).

---

# Cierre — Recomendaciones de Claude Code (§9)

## Section 9: Claude Code en el día a día
**Source material:** comandos verificados contra la doc de Claude Code (no hay `.md` de source).
**Through-line:** Cambio de registro: se deja MCP y se cierra con **tips prácticos de Claude Code**, la herramienta que usan. Cuatro comandos/flujos poco obvios y de alto valor, más uno de yapa. Termina con un cierre temático de la semana en una sola idea (no un recap con bullets).
**What students walk away knowing:**
- `/btw <pregunta>` — pregunta al pasar que no entra al historial ni infla el contexto.
- `/rc` (alias de `/remote-control`) — controlar la sesión desde claude.ai (celular/browser).
- `claude -c` / `claude -r` — retomar la última sesión / elegir cuál de un picker.
- `/rewind` (o `Esc Esc`) — volver atrás conversación y código a un checkpoint.
- De yapa: `/compact` — resumir el contexto cuando se llena.
**Animations / interactive:** Ninguna JS. Opener; grid 2×2 de tip-cards con reveals (uno por tip) + línea de `/compact`; slide de cierre temático ("el agente ya no está limitado a lo que trae de fábrica · MCP es cómo lo extendés · la pregunta cero, cómo elegís"). Después, la slide de `¿Preguntas?` del scaffold.
**Slide budget:** 3 slides.

---

## Estimado total del deck

Sumando budgets: 5 + 5-6 + 6-7 + 6-7 + 7-8 + 8-10 + 3-4 + 3-4 + 4-5 + 5-6 = **52–62 slides** para 2h. Sostiene una buena densidad sin sentirse apurada — los tres demos en bloque sostienen 25-30 min y son el corazón pedagógico de la clase.
