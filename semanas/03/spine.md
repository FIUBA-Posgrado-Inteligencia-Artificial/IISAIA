# Spine — Semana 03: Arquitectura Backend y Datos

**Whole-week through-line:** La semana 02 te enseñó a nombrar las piezas del frontend para dirigir a la IA cuando el código vive en el navegador. Esta semana es el reflejo: mismo rol (supervisor arquitectónico), mismo mecanismo (vocabulario → especificación → código auditable), terreno nuevo (servidor). HTTP, REST, rutas, datos y errores son el vocabulario backend que te permite seguir dirigiendo cuando el código se muda al servidor. La clase termina cerrando el espejo en vivo: el profesor levanta una API con Claude Code mientras los alumnos leen ruta por ruta lo que dictaron.

## Section 1: Backend y el supervisor arquitectónico
**Source material:** `source_material/01-backend-y-el-supervisor.md`
**Through-line:** El rol de supervisor arquitectónico no cambia entre frontend y backend; lo que cambia es el terreno. Mover el código del navegador al servidor cambia tres cosas (persistencia, contratos cliente-servidor, lectura de respuesta) y para hacer las tres bien hace falta vocabulario nuevo.
**Hook:** Si una IA puede levantar un servidor en treinta segundos, ¿por qué seguimos aprendiendo qué es un POST? El cuello de botella no es la sintaxis, es la decisión — y ahora la decisión vive en un servidor.
**Key analogy:** El espejo de la semana 02. Frontend ↔ backend como las dos mitades simétricas de la misma habilidad: nombrar piezas para dirigir a una IA.
**What students walk away knowing:**
- El rol "supervisor arquitectónico" sobrevive al cambio de capa; lo que cambia es el vocabulario.
- Tres cosas distintas pasan al mover el código del navegador al servidor: la persistencia (los errores quedan escritos), los contratos (cliente y servidor son dos programas que se hablan), la lectura de la respuesta (códigos, JSON, logs).
- El mapa de la clase: HTTP → REST → rutas/contratos → datos → errores → bisagra al stack local.
**Animations / interactive:** None new. Considerar reutilizar `pipeline-roadmap` (semana 01) para mostrar el arco de las 6 piezas y volver a iluminarlas al abrir cada sección.
**Slide budget:** 5–6

## Section 2: Cliente, servidor y HTTP
**Source material:** `source_material/02-cliente-servidor-y-http.md`
**Through-line:** HTTP es el idioma cliente↔servidor. Cliente y servidor son roles, no programas. Los verbos son un repertorio fijo (cinco que importan), y los códigos de estado dicen de qué lado fue la falla antes de mirar nada más.
**Hook:** Cuando abrís Twitter y aparece el feed, algo viajó. Cuando refrescás Gmail, igual. Cuando WhatsApp Web envía un mensaje, lo mismo. Eso pasa decenas de veces por minuto en cualquier dispositivo: una conversación con vocabulario fijo.
**What students walk away knowing:**
- Cliente y servidor son roles, no programas; cualquier cosa puede ser cliente (incluso otro servidor).
- Anatomía de un par request/response: método + URL + headers + body opcional / status + headers + body.
- Los cinco verbos que cubren el 95% del trabajo (GET/POST/PUT/PATCH/DELETE) y las tres familias de códigos (2xx/4xx/5xx) — si arranca con 4 mirá tu pedido, si arranca con 5 mirá los logs.
**Animations / interactive:** None new. `flow-with-arrows` para el ida-y-vuelta request/response. Posible diagrama estático con request crudo y response cruda lado a lado.
**Slide budget:** 8–10

## Section 3: REST como estilo
**Source material:** `source_material/03-rest-como-estilo.md`
**Through-line:** HTTP es el cómo (transporte); REST es el qué (convención sobre qué se transporta y cómo se nombra). Todo es recurso, las URLs nombran sustantivos no acciones, y cuatro reglas (plural, jerarquía, idempotencia, stateless) ordenan cómo se piden las cosas.
**Hook:** Querés borrar la tarea 17 del proyecto 4. ¿`DELETE /projects/4/tasks/17` o `POST /borrar-tarea?id=17&proyecto=4`? Las dos son HTTP válido. Una sola es REST.
**What students walk away knowing:**
- REST es una convención (no la única — GraphQL y RPC existen), y la mayoría de las APIs que vas a dictar la usan.
- Las URLs nombran recursos en plural; el verbo dice qué hacer, la URL dice sobre qué; anidás cuando la pertenencia es estructural.
- Idempotencia (GET/DELETE/PUT sí, POST no) y stateless: por qué cada propiedad cambia cómo retentás y cómo escala el servidor.
**Animations / interactive:** None new. `comparison-2col` para `DELETE /projects/4/tasks/17` vs `POST /borrar-tarea?...`. Para idempotencia, slide con dos llamadas seguidas y el estado final visible.
**Slide budget:** 7–9

## Section 4: Rutas, controladores y el contrato (climax)
**Source material:** `source_material/04-rutas-controladores-y-contratos.md`
**Through-line:** Un endpoint son cinco piezas — verbo + path + schema-in + schema-out + códigos posibles. Ese bloque entero es la unidad mínima dictable a una IA: el átomo del backend, igual que en semana 02 lo era un componente con sus props y su estado. El controlador atiende; vos no lo escribís, lo especificás.
**Hook:** Le decís a la IA "hacé un endpoint para crear una tarea" y te devuelve trescientas líneas que parecen razonables. Mirás de cerca y descubrís que inventó diez decisiones que vos no dictaste — cada una es una bifurcación que aparece cuando algo se rompe.
**Key analogy:** Endpoint con contrato ↔ componente con props/state (semana 02). El "átomo dictable" del frontend tiene su gemelo del lado del servidor: una pieza chica, con bordes claros, que pegás a la IA sin tener que aclarar nada más.
**What students walk away knowing:**
- Las cinco piezas de un endpoint y por qué cada una corresponde a una decisión que alguien tiene que tomar (o la IA la toma sin avisarte).
- Mantra path/query/body: path identifica, query modifica, body transporta el contenido nuevo.
- Cómo se ve un bloque de contrato concreto y por qué es la unidad mínima dictable que cierra el espejo con semana 02.
**Animations / interactive:** None new. `code-walkthrough` con highlights por línea sobre el bloque de contrato (verbo, path, entrada, salida, errores, cada uno se ilumina). Posible variante con `clickable-steps` reutilizando el componente de semana 01.
**Slide budget:** 8–10

## Section 5: Datos: relaciones vs documentos
**Source material:** `source_material/05-datos-relaciones-vs-documentos.md`
**Through-line:** Los datos son la memoria del servidor. Dos formas de modelarlos: relacional (tablas con esquema y foreign keys, integridad de fábrica) y documental (objetos JSON anidados en colecciones, esquema flexible). La heurística por default: relacional, y SQLite como punto de entrada práctico.
**Hook:** Acordate de la to-do list de la clase pasada: vivía en una variable de JavaScript en el navegador. Refrescabas la página y todo desaparecía. Eso no era un bug — la página nunca tuvo memoria. El servidor es lo que le da memoria a la aplicación.
**What students walk away knowing:**
- Tres razones por las que hace falta una base de datos: persistencia, eficiencia de consulta, integridad.
- Relacional (tablas + columnas + foreign keys + JOIN) vs. documental (documentos JSON anidados en colecciones), con el mismo dominio (proyectos/tareas) modelado de las dos formas.
- La heurística pragmática: arrancar relacional con SQLite; ir a documental solo cuando un patrón concreto lo justifica.
**Animations / interactive:** None new. `comparison-2col` SQL ↔ NoSQL con el ejemplo proyectos/tareas modelado en ambas formas. `code-walkthrough` con el schema relacional para resaltar la foreign key.
**Slide budget:** 7–9

## Section 6: Errores y observabilidad
**Source material:** `source_material/06-errores-y-observabilidad.md`
**Through-line:** Los errores tienen dueño: 4xx es del cliente, 5xx es del servidor — leer el primer dígito antes de tocar nada. Logs y stack traces son la evidencia que le pasás a la IA para que razone en vez de adivinar; sin esa evidencia, el modelo improvisa.
**Hook:** La IA generó un endpoint, lo pegaste al navegador y la respuesta es "500 Internal Server Error". Frente a esa pantalla hay dos reacciones: copiar "no funciona" en el chat y rezar, o abrir la terminal y mandarle a la IA la línea exacta. Las dos tardan parecido. Solo una funciona.
**What students walk away knowing:**
- 4xx = cliente, 5xx = servidor; el movimiento diagnóstico empieza por leer el primer dígito.
- Anatomía de un log típico (request entrante, error interno, status code de salida) y cómo leer un stack trace de adentro hacia afuera buscando la primera línea que menciona código tuyo.
- El prompt bueno trae código + log + stack trace; el malo dice "no funciona". Misma diferencia, otra capa: sin evidencia el modelo adivina, con evidencia razona.
**Animations / interactive:** None new. `code-walkthrough` con highlights sobre log de 3 líneas y stack trace; posible `comparison-2col` para "prompt malo" vs "prompt con evidencia".
**Slide budget:** 6–7

## Section 7: De lo local al stack (bisagra)
**Source material:** `source_material/07-de-lo-local-al-stack.md`
**Through-line:** Una pestaña no aguanta un servidor de verdad — hace falta proceso, puerto y sistema de archivos. Por eso bajamos a CLI con Claude Code: transparencia, foco didáctico, continuidad con la próxima clase. Stack del demo (Python + FastAPI + SQLite + Uvicorn + venv) y tarea para llegar a semana 4 con la máquina lista.
**Hook:** Hasta ahora todo pasaba en una pestaña del navegador. Un servidor de verdad no entra en una pestaña — necesita un proceso vivo, un puerto donde escuchar y archivos en disco. Esa máquina sos vos.
**What students walk away knowing:**
- Las tres cosas que un servidor necesita y que una pestaña no da: proceso, puerto, sistema de archivos.
- Por qué CLI (Claude Code) antes que IDE: transparencia, mínima superficie, continuidad con semana 4.
- Stack del demo nombrado pieza por pieza (FastAPI = framework, SQLite = base, Uvicorn = ASGI, venv = aislamiento); FastAPI es una elección, no la única — Express, Django, Flask, Go, Rails coexisten.
- Tarea concreta antes de semana 4: Python ≥3.11, Node ≥18, instalar Claude Code, verificar `claude --version`.
**Animations / interactive:** None new. Slide tipo "checklist accionable" para la tarea de instalación con los comandos exactos.
**Slide budget:** 7–8

## Section 8: Demo en vivo
**Source material:** `source_material/08-demo-en-vivo.md`
**Through-line:** Coreografía del cierre. El profesor escribe en pantalla un bloque de contrato (la misma forma del archivo 04) ANTES de invocar a Claude Code; después dicta el contrato a la IA y leen juntos lo que apareció, ruta por ruta, error por error. La cadena contrato → código → servidor → cliente, en vivo.
**What students walk away knowing:**
- El demo no agrega un concepto nuevo; cierra el espejo y deja al alumno con ganas de instalar Claude Code y replicarlo.
- (Apropiación visceral) Lo que ustedes dictaron fue el contrato; lo que la IA hizo fue escribirlo. El rol — supervisor arquitectónico — sobrevivió la mudanza al servidor.
**Animations / interactive:** None new. Las "slides" de esta sección son scaffolding mínimo: una plantilla del bloque de contrato visible mientras se dicta, marcadores de los seis beats del demo, slide de cierre. La animación real es el demo en sí.
**Slide budget:** 4–6
