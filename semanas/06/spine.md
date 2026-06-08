# Spine — Semana 06: Model Context Protocol (MCP)

**Whole-week through-line:** Los agentes que viene usando el alumno desde S04 ya tienen tools nativas (`Read`, `Write`, `Bash`, `Grep`, `Glob`, `Edit` en Claude Code). Lo que no se discutió aún: ese set lo decidió Anthropic, y para todo lo que está afuera (DB de prod, browser, docs en vivo de un SDK que salió ayer) no hay tool. Las dos salidas instintivas tienen techo — **wrapper custom por host (N×M, no se reusa)** y **pegar al prompt (costos, frescura, ruido — lo que ya conocen desde context engineering)**. **MCP es la salida estructural: un protocolo común** donde el problema colapsa a N+M. §1 plantea el problema y nombra la solución en un golpe; §§2-6 desarman el protocolo en capas (por qué protocolo, arquitectura, primitives, discovery, ecosistema con la pregunta cero); §§7-9 materializan con **tres demos net-new sobre CC desde tres ángulos distintos** (Playwright = actuar sobre el browser; context7 = informar al modelo con docs reales; Blender con física = crear en un dominio no-coding); §10 calibra cuándo MCP y los tres riesgos. La cadena es **setup → mecánica → ecosistema → uso → calibración**.

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
- Cómo se agrega un server: en CC con `claude mcp add ...` (atajo), y el JSON `mcpServers` que escribe por debajo — casi igual en todos los hosts (con variaciones cosméticas) + nota de scope (`--scope project` → `.mcp.json` versionado).
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

# Demos (§§7-9)

## Section 7: Demo — Playwright MCP
**Source material:** `source_material/07-demo-playwright.md`
**Through-line:** Primer demo en vivo. Materializa la Parte 1 entera con un caso real: instalación de una línea, dos casos (lectura + acción), ver al agente actuar en un browser controlado. **Por qué Playwright como demo**: es ejemplo paradigmático de net-new sobre CC — CC sabe correr Bash pero no maneja un browser. La pregunta cero de §6 vuelve "no" → corresponde MCP. Lo que tienen que sacar **no es** el cómo de Playwright — **es la forma del intercambio**, que se mapea explícitamente al diagrama del §5.
**What students walk away knowing:**
- Cómo se instala un MCP server con un comando (`claude mcp add ...`).
- El patrón concreto del intercambio aplicado: server expone capacidades → LLM las descubre → invocación con argumentos → resultado vuelve a la conversación.
- Que el patrón es genérico — lo que cambia entre demos es qué hace el server, no cómo se habla.
- Por qué Playwright **sí** se instala en CC: capacidad que CC no tenía. La pregunta cero da "no" → MCP corresponde.
**Animations / interactive:** **Demo en vivo, terminal + browser lado a lado.** Slide-soporte mínima: un slide marco que arranca con "¿CC maneja un browser?" → no → corresponde MCP; un slide con el comando de instalación; el demo en vivo; slide de cierre "qué viste" que mapea explícitamente al diagrama del §5 (highlight del paso del catálogo y de la invocación). Plan B documentado: screenshots pre-armados del browser controlado + output, por si el demo en vivo falla.
**Slide budget:** 3–4 slides + slide de demo.

## Section 8: Demo — context7 MCP
**Source material:** `source_material/08-demo-context7.md`
**Through-line:** Segundo demo, mismo patrón, otro problema concreto: **alucinaciones de API** cuando el agente trabaja contra SDKs nuevos o versiones con breaking changes. La causa raíz ya la conocen desde §1 (no está en el set + cutoff de entrenamiento). La pregunta cero de §6 da "no" → corresponde MCP. context7 es la forma estándar de darle acceso a docs reales — open-source, vendor-neutral, gratis. La instalación se ve igual que Playwright; el intercambio sigue el mismo patrón.
**Hook:** **Las alucinaciones de API** como apertura — complicación concreta que cualquier alumno reconoció. Conecta directamente con la tercera "no está" de §1 (docs en vivo de SDK nuevo).
**What students walk away knowing:**
- Las alucinaciones de API tienen causa raíz estructural (cutoff date + cambios de SDK), no son magia ni mala suerte.
- Mismo comando de instalación, mismo patrón de intercambio que Playwright — refuerza la portabilidad del modelo mental.
- El takeaway estructural que cierra el círculo con §1: "más prompt" no era la solución; el server que trae info real, sí.
- Por qué context7 **sí** se instala en CC: net-new, CC no tiene conocimiento actualizado de SDKs ni mecanismo de fetch de docs.
**Animations / interactive:** **Demo en vivo, terminal + editor lado a lado.** Slide marco con la pregunta cero ("¿CC conoce esta API?") → no → corresponde MCP; slide con el comando de instalación; el demo en vivo; slide de cierre "qué viste" que cierra el círculo con §1 (la complicación tercera resuelta). Plan B: screenshots del antes/después del agente con y sin context7.
**Slide budget:** 3–4 slides + slide de demo.

## Section 9: Demo — Blender MCP (física)
**Source material:** `source_material/09-demo-blender.md`
**Through-line:** Tercer demo. Hasta acá los demos fueron sobre dominios de desarrollo (browser, docs de SDK). **Este es el wow del bloque: MCP no se limita a herramientas de desarrollo — cualquier programa que alguien empaquete como server queda al alcance del agente.** Blender MCP expone las primitives de Blender como tools; el agente arma una escena con rampa inclinada + 6 esferas de colores + física rigid body y corre la simulación. Las balls caen, ruedan, chocan, se dispersan. El resultado es kinético, visible, recognizable. El patrón del intercambio es **idéntico** a los dos demos anteriores; cambia solo el dominio.
**Hook:** Pregunta corta — *"¿y si no fuera código?"*. Captura el salto conceptual antes de pasar al pedido concreto.
**What students walk away knowing:**
- **MCP no es solo para devtools.** Cualquier programa que alguien empaquete como server queda al alcance del agente. Blender hoy, mañana Unity / Photoshop / Excel / CAD / DAW musical.
- El agente coordinó **una secuencia de pasos en un dominio que no conoce nativamente** — sin haber programado en `bpy` ni tocado Blender. Eso refuerza el insight del §5: el server le describe sus capacidades, y el agente combina.
- Por qué Blender MCP **sí** se instala en CC: net-new — CC no maneja 3D, no controla Blender, no setea física.
- El patrón del intercambio es el mismo de los tres demos. **Tres dominios completamente distintos, mismo aparato.**
**Animations / interactive:** **Demo en vivo, viewport de Blender + terminal lado a lado.** Slide marco con pregunta cero ("¿CC modela 3D?") → no → corresponde MCP; slide con comando de instalación + nota de setup overhead (Blender abierto con add-on); el demo en vivo con la simulación corriendo; slide de cierre "qué viste" que cierra **el bloque entero de demos** — los tres ángulos en un visual (actuar / informar / crear), mapeo al diagrama del §5. **Plan B esencial: video pre-grabado de 30-40s** del demo funcionando bien. No es opcional acá: si la sim falla en vivo, paramos y mostramos el video. La gracia es ver las balls moverse.
**Slide budget:** 4–5 slides + slide de demo (más que Playwright/context7 porque hay un slide de "qué viste" que cierra el bloque entero, no solo este demo).

---

# Cierre — Calibración (§10)

## Section 10: Cuándo MCP, cuándo no, y riesgos
**Source material:** `source_material/09-cuando-mcp-y-riesgos.md`
**Through-line:** Calibración final, con la **pregunta cero al frente**: antes de cualquier criterio fino, "¿el host ya lo hace?". Si sí, ahí termina la conversación. Si no, recién ahí aplican las tres condiciones (recurrencia + datos vivos/grandes + reuso) y las excepciones (one-off, chico/estático, server sin auditar). Los tres riesgos (supply chain, permisos, observabilidad). El modelo mental de cierre: un MCP server es una dependencia más — **cinco preguntas** que aplicás antes de conectar, empezando por la pregunta cero.
**Key analogy:** **MCP server como dependencia de tu entorno** — vale lo mismo que aplicás a cualquier librería que metés en un proyecto. Las cinco preguntas (con la pregunta cero como primer filtro) son el modelo mental que se llevan más allá del curso.
**What students walk away knowing:**
- **La pregunta cero ("¿el host ya lo hace?") va primero** — antes que cualquier otro criterio. Si el host trae la capacidad, no instales.
- Asumiendo que la pregunta cero da "no", las tres condiciones para que MCP rinda (recurrencia + datos vivos/grandes + reuso) y las cuatro excepciones donde no.
- Los tres riesgos concretos (supply chain / permisos / observabilidad) con su mitigación práctica para cada uno.
- El modelo mental "una dependencia más" — **cinco preguntas** en orden: ¿el host ya lo hace? ¿quién es el autor? ¿qué hace? ¿qué le permito? ¿cómo me entero si cambia?
- Cierre de clase: MCP no es la respuesta a todo, es infraestructura que vino para quedarse — el conocimiento se lleva.
**Animations / interactive:** Ninguna JS. **Slide-opener con la pregunta cero como card central destacada** (refuerza lo de §6). `comparison-2col` para cuándo sí / cuándo no. `data-table` 3×2 para los tres riesgos con su mitigación. Slide de cierre con las **cinco preguntas** del modelo mental como `clickable-steps` o cards numeradas (1 a 5), con la pregunta cero visualmente marcada como filtro previo.
**Slide budget:** 5–6 slides.

---

## Estimado total del deck

Sumando budgets: 5 + 5-6 + 6-7 + 6-7 + 7-8 + 8-10 + 3-4 + 3-4 + 4-5 + 5-6 = **52–62 slides** para 2h. Sostiene una buena densidad sin sentirse apurada — los tres demos en bloque sostienen 25-30 min y son el corazón pedagógico de la clase.
