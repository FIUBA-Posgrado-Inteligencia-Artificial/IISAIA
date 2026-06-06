# Spine — Semana 06: Model Context Protocol (MCP)

**Whole-week through-line:** El LLM razona bien pero no ve nada de tu mundo presente. La salida vieja (pegar todo al prompt) no escala — costos, frescura, ruido. La salida nueva separa **razonamiento adentro** de **acción/datos afuera**, y para que esa separación sea reusable tiene que ser **protocolo, no librería**. Las §§5-7 desarman el aparato (host/cliente/servidor + primitives + discovery dinámico); §8 lo proyecta a la portabilidad vendor-neutral; §§9-10 lo materializan en dos demos cortos; §11 calibra cuándo conviene y qué riesgos asumís. La cadena es **problema → insight → mecánica → ecosistema → uso → calibración**, y cada bloque cierra cuando entra el siguiente.

**Dispositivos pedagógicos de toda la semana:**

- **El diagrama mental host/client/server (§5) como ancla visual recurrente.** Se construye CSS-only en §5 y se re-ilumina en §6 (para mostrar dónde viven las primitives — del lado del server, y del lado del cliente) y en §7 (para mostrar dónde sucede el handshake y el discovery). Equivalente del pipeline-roadmap de S05.
- **La matriz N×M → N+M de §4 como argumento que se cierra en §8.** En §4 introduce la razón estructural del protocolo; en §8 reaparece visualmente para cerrar el argumento — el mismo server con flechas a N hosts.
- **El "patrón del intercambio" como contrato visible en cada demo.** El intercambio (server expone capacidades → cliente las pasa al LLM → invocación → resultado vuelve) se establece formalmente en §7 y reaparece como slide-de-cierre en §§9 y §10 con un mapping explícito "qué viste" → "qué diagrama del §7".
- **La frase ancla "el LLM no necesita saber, necesita poder llamar" (§3) reaparece en §7** como confirmación del insight: el discovery dinámico es exactamente eso, hecho protocolo.
- **Vocabulario canónico de la doc oficial sostenido a lo largo del deck.** MCP Host / MCP Client / MCP Server capitalizados; Stdio transport / Streamable HTTP transport; data layer / transport layer; model-controlled / application-controlled / user-controlled. La consistencia en el vocabulario es parte del deck — no se mezclan términos propios con canónicos.
- **Cero animaciones JS reusables de semanas anteriores.** El deck es CSS-heavy. Único candidato a JS: el diagrama del handshake en §7 (`clickable-steps.js` adaptado, o nuevo). Las dos demos en vivo (§§9-10) no son animación, son terminal real.

**Nota de escala:** 11 secciones, ~2h de clase (90 min concepto, 30 min demos). Estimado total **~45–55 slides** — proporcionalmente más liviano que S05 porque hay menos secciones y porque las §§9-10 son demos en vivo con slide-soporte mínima.

**Bridge con semana 05:** S05 cerró con "el TP final usa el flujo Superpowers". S06 retoma: los agentes que vieron en S05 razonan sobre lo que tienen adentro de su context window; MCP es la forma estándar de **extender lo que pueden ver y tocar** sin romper ese flujo. El protocolo es transversal al flujo, no lo reemplaza.

**Bridge con semana 07 / semana 08:** S06 es la última clase con material teórico formal. S07 será clínica/consultas para el TP, S08 es Demo Day. El §11 cierra con un modelo mental ("MCP server como una dependencia más") deliberadamente portable — herramienta que se llevan más allá del curso.

---

# Parte 1 — El problema y el insight (§§1-3)

## Section 1: El LLM no ve tu mundo
**Source material:** `source_material/01-llm-no-ve-tu-mundo.md`
**Through-line:** Establece la asimetría que motiva toda la clase: el LLM razona bien pero no ve nada de tu mundo presente. Tres "no puedo" concretos (archivo del repo, query a la base, página web actual) materializan el problema. Vos sos el courier — el cuello de botella que el resto de la clase va a romper.
**Hook:** Las tres situaciones específicas tipo "no puedo" abren la sección como hook. Cualquier alumno las vivió la semana pasada en su TP. No hace falta jargon ni meta-narración.
**What students walk away knowing:**
- El LLM sabe muchísimo (del entrenamiento) pero ve cero de tu presente (esta máquina, esta sesión).
- "Tu mundo" se rompe en tres ejes concretos: archivos del repo, datos vivos (DB/API), web actual.
- Vos sos el courier — copiar/pegar el contexto es lo que estás haciendo todo el tiempo, y ese cuello de botella es lo que la clase va a romper.
**Animations / interactive:** Ninguna JS. CSS-only. `data-table` o grid 3×1 con los tres "no puedo", cada celda con un mini-ejemplo concreto. Posible slide de cierre tipo "vos sos el courier" con un diagrama CSS de las flechas yendo de tu pantalla al agente y viceversa.
**Slide budget:** 3–4 slides.

## Section 2: La trampa del context window
**Source material:** `source_material/02-trampa-del-context-window.md`
**Through-line:** La salida vieja era "pegale más al prompt". Tres complicaciones específicas la rompen: costos lineales, frescura congelada, ruido que degrada la atención. Aumentar la ventana no resuelve ninguna de las tres — el problema es estructural, no de tamaño.
**What students walk away knowing:**
- Pegar al prompt funciona hasta cierto tamaño y después se cae.
- Las tres complicaciones específicas (costos, frescura, ruido) con un ejemplo concreto cada una.
- Aumentar el context window ayuda pero no resuelve estructuralmente — prepara el reframe del §3.
**Animations / interactive:** Ninguna JS. `data-table` 3×1 con las tres complicaciones (cada celda con su ejemplo). Posible `comparison-2col` cerrando: "context window más grande" vs "lo que realmente hace falta" — donde el lado derecho queda vacío, preparando §3.
**Slide budget:** 3–4 slides.

## Section 3: Separar conocimiento de acción
**Source material:** `source_material/03-separar-conocimiento-de-accion.md`
**Through-line:** Reformulación del problema desde otro ángulo. El LLM no necesita *saber*; necesita *poder llamar*. Adentro queda razonamiento; afuera queda todo lo específico/vivo/efectoso. La salida necesita una capa intermedia uniforme — todavía sin nombre. Define el problema que MCP resuelve en §4.
**Hook:** Pregunta dirigida — *"¿Cómo programás vos cuando usás una librería que conocés a medias?"* — antes de proponer el insight. La autoanalogía aterriza la inversión conceptual mejor que una definición.
**Key analogy:** **El REPL + `help()` + `dir()`**. Vos no memorizás pandas, lo *llamás*. Es la analogía estructural que sostiene todo lo que sigue.
**What students walk away knowing:**
- **El insight central**: el LLM no necesita saber, necesita poder llamar. **Esta frase reaparece en §7.**
- El reparto adentro/afuera: razonamiento adentro, datos/acciones vivas afuera.
- Falta una capa intermedia uniforme — define el problema que va a resolver MCP. Sin nombrarlo todavía.
**Animations / interactive:** Ninguna JS. `comparison-2col`: "antes (todo adentro)" vs "ahora (razonamiento adentro / acción afuera)". Diagrama CSS de la división con el espacio del "puente" explícitamente vacío — preparando §4. Posible slide-pivote con la frase-ancla resaltada visualmente para que se lea como leitmotiv.
**Slide budget:** 3–4 slides.

---

# Parte 2 — La mecánica del protocolo (§§4-7)

## Section 4: Protocolo, no API
**Source material:** `source_material/04-protocolo-no-api.md`
**Through-line:** Si el LLM va a llamar cosas, ¿cómo se las describimos? El problema N×M (cada cliente con su formato propio) colapsa a **N+M** con un protocolo común. Precedentes históricos del mismo patrón (HTTP entre browsers/servers, LSP entre IDEs/lenguajes). MCP es eso para agentes — **estándar open-source**, no producto Anthropic. Analogía oficial: **USB-C para aplicaciones de IA**.
**Key analogy:** **Dos analogías que cumplen funciones distintas, las dos van:**
- **HTTP / LSP** como precedentes estructurales — explican el *por qué* (N×M → N+M con datos históricos).
- **USB-C** (la analogía oficial de la doc) — metáfora rápida y memorable que se quedan.
**What students walk away knowing:**
- Por qué N×M es insostenible y cómo un protocolo común lo colapsa a N+M.
- HTTP y LSP como precedentes del mismo patrón — ven que MCP no inventa nada nuevo conceptualmente.
- MCP = Model Context Protocol, **estándar open-source** (la definición canónica no menciona a Anthropic), propuesto en 2024 y adoptado por Claude, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI.
**Animations / interactive:** Ninguna JS. Diagrama CSS del problema N×M (matriz de líneas cruzadas entre clientes y proveedores) → mismo diagrama con el protocolo (líneas que colapsan a N+M). Animación CSS de la matriz colapsando vía fragment-reveals. Slide del USB-C como metáfora rápida. **El diagrama de N×M/N+M reaparece visualmente en §8.**
**Slide budget:** 5–6 slides.

## Section 5: Arquitectura — host, cliente, servidor
**Source material:** `source_material/05-arquitectura-mcp.md`
**Through-line:** Los tres roles canónicos: **MCP Host** (la app), **MCP Client** (componente adentro del host), **MCP Server** (proceso externo). Regla clave: **un cliente por cada server conectado** — un host puede tener N clientes corriendo. Las **dos capas**: data layer (JSON-RPC) y transport layer. **Dos transports**: Stdio (local) y Streamable HTTP (remoto). El diagrama mental al final tiene que ser portable y reusable en §§6-7.
**What students walk away knowing:**
- Los tres roles con definiciones canónicas y capitalización oficial (MCP Host / MCP Client / MCP Server).
- La regla "un cliente por servidor conectado" — no es un cliente único que habla con muchos servers, son muchos clientes adentro del mismo host.
- Las dos capas (data / transport) y por qué la separación importa — el mismo set de mensajes funciona sobre cualquier transporte.
- Stdio vs Streamable HTTP: cuándo cada uno (regla simple: disco/red local → Stdio; servicio compartido → Streamable HTTP).
- El diagrama mental: host con varios clientes adentro, cada server como proceso aparte, flecha bidireccional JSON-RPC entre cada par cliente-server.
**Animations / interactive:** **Pieza visual central de la Parte 2.** Diagrama CSS animado de los tres roles, **construido bespoke para reuso en §§6-7**. Recommendation: host como contenedor visible, dos o tres MCP Clients adentro (uno por server), servers como rectángulos aparte (uno local "stdio", uno remoto "HTTP"), flechas bidireccionales etiquetadas JSON-RPC. Fragment-reveal para introducir un rol por vez. El diagrama se re-ilumina (focal-blur sobre distintas partes) en §6 (para resaltar el server cuando hablamos de primitives) y en §7 (para resaltar el client-server handshake).
**Slide budget:** 6–7 slides.

## Section 6: Las tres primitives
**Source material:** `source_material/06-tres-primitives.md`
**Through-line:** Un MCP Server expone tres primitives, cada una con **dueño distinto de iniciativa**: **tools (model-controlled)** = acciones con efecto; **resources (application-controlled)** = datos pasivos leíbles; **prompts (user-controlled)** = templates reutilizables. La separación importa porque cada dueño implica permisos y UI distintos. Y del otro lado, el **cliente** también expone primitives (Sampling, Elicitation, Roots, Logging) — los nombran al pasar para cerrar el panorama.
**What students walk away knowing:**
- Las tres server primitives con su nombre canónico, su intuición y **quién toma la iniciativa** (model / application / user). El framing "who controls it" es de la doc oficial.
- Por qué la separación importa: cada dueño de iniciativa implica permisos, presentación y garantías distintas. No es lujo arquitectónico, es lo que permite un modelo de permisos coherente.
- Direct resources vs resource templates (URIs parametrizadas tipo `travel://activities/{city}/{category}`).
- Que existen client primitives — **Sampling** (server le pide al cliente "pedile al LLM esto"), **Elicitation** (server le pide al cliente "preguntale al usuario"), **Roots** (cliente le declara al server "estos directorios son tu scope"), **Logging**. Los nombran al pasar; no se profundizan.
**Animations / interactive:** Ninguna JS. Re-iluminación del diagrama del §5 con foco en el server. `data-table` 3-cols (nombre / dueño / ejemplos) para las tres server primitives. Slide por primitive con su definición + métodos canónicos (`tools/list` y `tools/call` etc.) en un `code-walkthrough`. Slide "Y del otro lado" con las 4 client primitives como cards horizontales.
**Slide budget:** 6–7 slides.

## Section 7: Discovery dinámico ⭐
**Source material:** `source_material/07-discovery-dinamico.md`
**Through-line:** **La pieza más elegante de MCP — el clímax conceptual de la clase.** La pregunta organizadora: *¿cómo es que el LLM puede usar tools que se publicaron después de su cutoff?* Respuesta en dos mecanismos canónicos: **capability negotiation** durante `initialize`, y **discovery** vía `*/list`. Plus **notifications** (`listChanged`) para cambios en vivo. El modelo no memoriza tools; los descubre en tiempo de conversación. Por eso el ecosistema crece sin coordinación central.
**Hook:** **La pregunta del cutoff** como apertura — es la pregunta que probablemente quedó dando vueltas desde §3. La sección entera es la respuesta a ese gancho. Funciona como "aha moment" de la clase.
**Key analogy:** El handshake como **presentación entre dos extraños** — cliente y server se cuentan qué versión del protocolo hablan y qué saben hacer. La analogía es liviana pero útil para evitar que JSON-RPC suene a magia. El insight estructural ("el catálogo viaja al system context") es lo que más vale; la analogía solo lo escolta.
**What students walk away knowing:**
- **Capability negotiation** durante `initialize` — el protocolo es **stateful**, la negociación queda registrada para toda la sesión.
- **Discovery via `*/list`** — el catálogo con metadata (name, description, inputSchema) se le pasa al LLM como parte del system context.
- **El insight clave (cierra la frase-ancla de §3):** el modelo no necesita memorizar tools; los descubre en tiempo de conversación. Por eso cualquier server nuevo, escrito hoy, es usable hoy, sin reentrenar.
- **Notifications** (`listChanged` + `notifications/tools/list_changed`) — el catálogo es dinámico, no una foto inicial.
- La consecuencia: el ecosistema crece sin coordinación central; MCP es infraestructura, no producto.
**Animations / interactive:** **Pieza visual de la clase entera.** Recomiendo construir un diagrama animado del handshake usando `clickable-steps.js` adaptado, con cuatro steps clicables: (1) `initialize` con capability negotiation, (2) `tools/list`, (3) el catálogo con metadata viajando al system context del LLM, (4) `notifications/tools/list_changed` cambiando el estado. Cada step muestra un mini-mensaje JSON-RPC y un highlight sobre la parte del diagrama del §5 que está activa. Es la animación más cara del deck; vale el budget. **Si el budget no alcanza para JS, fallback a `flow-with-arrows` puro CSS con fragment-reveals.**
**Slide budget:** 7–8 slides (clímax conceptual; sostiene budget mayor).

---

# Parte 3 — El ecosistema (§8)

## Section 8: El ecosistema, qué viaja con vos, y qué vale instalar
**Source material:** `source_material/08-ecosistema-vendor-neutral.md`
**Through-line:** Cierra el argumento que abrió en §4 — **pero con un giro crítico**. Mismo server, N hosts: portabilidad real, el mismo binario corre en Claude Code, Claude Desktop, ChatGPT, VS Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI, MCPJam. **Tres consecuencias prácticas:** amortización, portabilidad, durabilidad. **Pero no todo MCP suma en todo host:** cada host trae sus tools nativas, anteriores a MCP. **La pregunta correcta antes de instalar cualquier MCP server es siempre la misma: "¿el host ya lo hace?"**. Aplicación concreta a Claude Code: trae Read/Write/Edit/Bash/Glob/Grep nativos, lo que vuelve **redundantes** algunos MCPs populares (filesystem, git, fetch) y deja como **net-new** a otros (playwright, context7, postgres, slack, github MCP). La misma pieza, distinto valor según dónde la conectes.
**Key analogy:** **"Build once and integrate everywhere"** — frase canónica de la doc, con asterisco: el valor lo aporta el server **sobre lo que el host ya tenía**. Lo que vale en un host fino (claude.ai chat) puede no valer en uno rico (Claude Code).
**What students walk away knowing:**
- Un MCP server corre idéntico en cualquier host MCP — **portabilidad estructural**.
- El JSON de config se ve casi igual en todos los hosts (con variaciones cosméticas).
- Las tres consecuencias prácticas: amortización, portabilidad, durabilidad.
- **Cada host trae sus tools nativas** — MCP **extiende, no duplica**.
- **La pregunta correcta antes de instalar cualquier MCP server**: "¿el host ya lo hace?".
- Aplicación concreta a Claude Code: qué tools nativas trae (Read/Write/Edit/Bash/Glob/Grep) y qué eso vuelve redundante (filesystem, git, fetch MCPs) vs net-new (playwright, context7, postgres, slack).
- Por qué entonces existen filesystem MCP y git MCP — porque otros hosts (claude.ai chat) no traen lo que CC trae de fábrica. **Mismo binario, distinto valor según el contenedor.**
- Mapa rápido de servers populares **clasificados por valor en CC**.
**Animations / interactive:** Ninguna JS. **Reuso visual del diagrama N×M de §4** — mismo server con flechas a múltiples hosts (cierra el arco). `code-walkthrough` del mismo JSON de config con tabs por host. **Slide-bisagra crítica:** "¿pero todo MCP suma en todo host?" → no — `comparison-2col` con tools nativas de CC en una columna y MCP en otra. Aplicación a CC en `data-table` o grid 2-col: "redundante en CC" / "net-new en CC". Mapa de servers populares en grid 2-col con el mismo eje. Closing slide con la pregunta cero ("¿el host ya lo hace?") como card central.
**Slide budget:** 8–10 slides (sostenida ampliación; era 5-6).

---

# Parte 4 — Materialización con demos (§§9-10)

## Section 9: Demo — Playwright MCP
**Source material:** `source_material/09-demo-playwright.md`
**Through-line:** Primer demo en vivo. Materializa la Parte 1 entera con un caso real: instalación de una línea, dos casos (lectura + acción), ver al agente actuar en un browser controlado. **Por qué Playwright como demo**: es ejemplo paradigmático de net-new sobre CC — CC sabe correr Bash pero no maneja un browser. La pregunta cero de §8 vuelve "no" → corresponde MCP. Lo que tienen que sacar **no es** el cómo de Playwright — **es la forma del intercambio**, que se mapea explícitamente al diagrama del §7.
**What students walk away knowing:**
- Cómo se instala un MCP server con un comando (`claude mcp add ...`).
- El patrón concreto del intercambio aplicado: server expone capacidades → LLM las descubre → invocación con argumentos → resultado vuelve a la conversación.
- Que el patrón es genérico — lo que cambia entre demos es qué hace el server, no cómo se habla.
- Por qué Playwright **sí** se instala en CC: capacidad que CC no tenía. La pregunta cero da "no" → MCP corresponde.
**Animations / interactive:** **Demo en vivo, terminal + browser lado a lado.** Slide-soporte mínima: un slide marco que arranca con "¿CC maneja un browser?" → no → corresponde MCP; un slide con el comando de instalación; el demo en vivo; slide de cierre "qué viste" que mapea explícitamente al diagrama del §7 (highlight del paso del catálogo y de la invocación). Plan B documentado: screenshots pre-armados del browser controlado + output, por si el demo en vivo falla.
**Slide budget:** 3–4 slides + slide de demo.

## Section 10: Demo — context7 MCP
**Source material:** `source_material/10-demo-context7.md`
**Through-line:** Segundo demo, mismo patrón, otro problema concreto: **alucinaciones de API** cuando el agente trabaja contra SDKs nuevos o versiones con breaking changes. La causa raíz ya la conocen (§§1-2): el modelo tiene cutoff date, CC no trae conocimiento actualizado de SDKs y no puede traerlo solo. La pregunta cero de §8 da "no" → corresponde MCP. context7 es la forma estándar de darle acceso a docs reales — open-source, vendor-neutral, gratis. La instalación se ve igual que Playwright; el intercambio sigue el mismo patrón.
**Hook:** **Las alucinaciones de API** como apertura — es una complicación concreta que cualquier alumno reconoció. Conecta directamente con el §1 (el "no puedo ver esta página" extendido a "no puedo ver la doc actualizada").
**What students walk away knowing:**
- Las alucinaciones de API tienen causa raíz estructural (cutoff date + cambios de SDK), no son magia ni mala suerte.
- Mismo comando de instalación, mismo patrón de intercambio que Playwright — refuerza la portabilidad del modelo mental.
- El takeaway estructural que cierra el círculo con §§1-2: "más prompt" no era la solución; el server que trae info real, sí.
- Por qué context7 **sí** se instala en CC: net-new, CC no tiene conocimiento actualizado de SDKs ni mecanismo de fetch de docs.
**Animations / interactive:** **Demo en vivo, terminal + editor lado a lado.** Slide marco con la pregunta cero ("¿CC conoce esta API?") → no → corresponde MCP; slide con el comando de instalación; el demo en vivo (pedirle al agente código contra un SDK y ver que cita docs reales); slide de cierre "qué viste" que cierra el círculo con §§1-2 (la asimetría del courier resuelta). Plan B: screenshots del antes/después del agente con y sin context7.
**Slide budget:** 3–4 slides + slide de demo.

---

# Cierre — Calibración (§11)

## Section 11: Cuándo MCP, cuándo no, y riesgos
**Source material:** `source_material/11-cuando-mcp-y-riesgos.md`
**Through-line:** Calibración final, con la **pregunta cero al frente**: antes de cualquier criterio fino, "¿el host ya lo hace?". Si sí, ahí termina la conversación. Si no, recién ahí aplican las tres condiciones (recurrencia + datos vivos/grandes + reuso) y las excepciones (one-off, chico/estático, server sin auditar). Los tres riesgos (supply chain, permisos, observabilidad). El modelo mental de cierre: un MCP server es una dependencia más — **cinco preguntas** que aplicás antes de conectar, empezando por la pregunta cero.
**Key analogy:** **MCP server como dependencia de tu entorno** — vale lo mismo que aplicás a cualquier librería que metés en un proyecto. Las cinco preguntas (con la pregunta cero como primer filtro) son el modelo mental que se llevan más allá del curso.
**What students walk away knowing:**
- **La pregunta cero ("¿el host ya lo hace?") va primero** — antes que cualquier otro criterio. Si el host trae la capacidad, no instales.
- Asumiendo que la pregunta cero da "no", las tres condiciones para que MCP rinda (recurrencia + datos vivos/grandes + reuso) y las cuatro excepciones donde no (host lo hace, one-off, chico/estático, server sin auditar).
- Los tres riesgos concretos (supply chain / permisos / observabilidad) con su mitigación práctica para cada uno.
- El modelo mental "una dependencia más" — **cinco preguntas** en orden: ¿el host ya lo hace? ¿quién es el autor? ¿qué hace? ¿qué le permito? ¿cómo me entero si cambia?
- Cierre de la clase: MCP no es la respuesta a todo, es infraestructura que vino para quedarse — el conocimiento se lleva.
**Animations / interactive:** Ninguna JS. **Slide-opener con la pregunta cero como card central destacada** (refuerza lo de §8). `comparison-2col` para cuándo sí / cuándo no. `data-table` 3×2 para los tres riesgos con su mitigación. Slide de cierre con las **cinco preguntas** del modelo mental como `clickable-steps` o cards numeradas (1 a 5), con la pregunta cero visualmente marcada como filtro previo.
**Slide budget:** 5–6 slides (era 4-5; se amplía por la pregunta cero como elemento estructural).

---

## Estimado total del deck

Sumando budgets: 3-4 + 3-4 + 3-4 + 5-6 + 6-7 + 6-7 + 7-8 + 8-10 + 3-4 + 3-4 + 5-6 = **55–66 slides** para 2h. Comparado con S05 (15 secciones, 70-85 slides, 3h) sigue siendo consistente: menos secciones, demos en vivo más cortos, §8 ampliada para sostener la distinción host-nativo vs MCP.
