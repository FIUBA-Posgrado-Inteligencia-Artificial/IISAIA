# Spine — Semana 02: Arquitectura Frontend

**Whole-week through-line:** El curso te pide ser supervisor arquitectónico de la IA, y para dirigir hace falta vocabulario técnico. Esta clase entrega ese vocabulario en cinco capas — estructura, estilo, comportamiento, estado y empaque — y cierra cada capa con la misma comparación: el mismo pedido escrito vago y escrito con vocabulario, para mostrar que nombrar las cosas convierte la lotería en determinismo. La segunda mitad empaqueta ese vocabulario en cuatro patrones de prompt reusables, y la clase termina con una actividad individual donde cada estudiante construye una *bad UI* funcional aplicando el ciclo Architect → Prompt → Review → Test.

**Recurring device:** cada sección de la anatomía (§§2–5) cierra con un slide "Cómo le pedís X a una IA": prompt vago contra prompt con vocabulario, cerrado con la misma moraleja — vago es lotería, específico es determinismo. Es el latido de la clase; no romperlo al editar.

## Section 1: Frontend y el supervisor arquitectónico
**Source material:** `source_material/01-frontend-y-el-supervisor.md`
**Through-line:** Si la IA escribe el código, el cuello de botella ya no es la sintaxis sino la decisión — y para decidir hace falta vocabulario. El rol del alumno es supervisor, no tipista.
**Hook:** "Si la IA puede escribir el código, ¿para qué seguimos aprendiendo qué es un `flexbox`?" — la pregunta incómoda en pantalla, sin respuesta inmediata.
**Key analogy:** La IA es tu equipo de implementación; vos sos el supervisor que decide qué se construye y por qué.
**What students walk away knowing:**
- Por qué saber leer código importa más que saber escribirlo cuando la IA escribe.
- Qué cambia al delegar la sintaxis: la velocidad sube, el costo de mal-especificar sube, y leer pesa más que escribir.
- El roadmap de las cinco capas (estructura, estilo, comportamiento, estado, empaque) que estructura toda la clase.
**Animations / interactive:** None bespoke. El diagrama de cinco capas (`pipe-node`) aparece acá por primera vez y se reusa como roadmap activo en la apertura de cada sección siguiente.
**Slide budget:** 4–5

## Section 2: Estructura — HTML como sustantivos
**Source material:** `source_material/02-estructura-html.md`
**Through-line:** El HTML semántico nombra las partes de la página; la "div soup" es el costo predecible de no nombrarlas, y la IA cae ahí por defecto si no le das vocabulario.
**Hook:** Dos bloques visualmente idénticos, uno con `<header>` y otro con `<div class="header">` — ¿son lo mismo? El navegador dice que no.
**Key analogy:** Los elementos HTML son sustantivos: nombran qué *es* cada bloque, no qué *parece*.
**What students walk away knowing:**
- Las siete etiquetas estructurales (header/main/section/article/nav/footer/aside) que arman el esqueleto de casi cualquier página.
- Por qué el outline del documento solo existe con semántica.
- Prompt vago vs prompt con vocabulario HTML sobre el mismo pedido.
**Animations / interactive:** Live demo de `demo.html` §1 — toggle semántico ↔ div soup en vivo.
**Slide budget:** 5–6

## Section 3: Estilo — cuatro primitivas de CSS
**Source material:** `source_material/03-estilo-css.md`
**Through-line:** CSS es enorme, pero para dirigir alcanza con cuatro primitivas: el modelo de caja, el layout (flex/grid), tipografía/color y variables. Cada una resuelve un tipo de pedido específico.
**Key analogy:** Las primitivas son las perillas que la IA puede ajustar. Una variable CSS es la perilla más poderosa porque concentra muchos cambios en una línea.
**What students walk away knowing:**
- Padding y margin son las palabras de "respirar", no "dale más aire".
- Flex (una dimensión) vs Grid (dos dimensiones) — y por qué nombrarlo evita que la IA improvise con `inline-block`.
- Las variables CSS son el punto de entrada que el LLM puede modificar sin reescribir todo.
**Animations / interactive:** Live demo de `demo.html` §2 — theme switcher cambiando toda la paleta tocando una variable.
**Slide budget:** 6–7

## Section 4: Comportamiento y estado — el triángulo dinámico
**Source material:** `source_material/04-estado-y-comportamiento.md`
**Through-line:** Cuando una página *hace algo*, las capas 3 y 4 trabajan juntas: estado, DOM y eventos conectados en un ciclo. "Estado" es la palabra que la IA necesita para no inventar atajos malos.
**Hook:** Un contador clásico hace click y aparece "1". ¿Qué se actualizó exactamente entre el click y el render?
**Key analogy:** El estado es la verdad; el DOM es el reflejo. Si te olvidás de actualizar uno de los dos, la pantalla miente.
**What students walk away knowing:**
- Estado vs DOM como entidades separadas (no son lo mismo aunque caminen en paralelo).
- El ciclo evento → listener → estado → mutación de DOM → render.
- Por qué nombrar "estado" en el prompt cambia el código que la IA produce.
**Animations / interactive:** Live demo de `demo.html` §3 — contador, todo list y event log mostrando el mismo ciclo tres veces. El ciclo de cinco pasos se revela con fragments, sin JS bespoke.
**Slide budget:** 6–7

## Section 5: Empaque — cómo se reparten las capas entre archivos
**Source material:** `source_material/05-single-file-platform.md`
**Through-line:** Empaque es una decisión, no un default. Las cuatro capas anteriores pueden vivir juntas en un `.html` o repartirse en un proyecto con manifiesto, registro de paquetes y build — dos estrategias con costos opuestos. Single-file gana en esta clase por tres razones concretas, pero solo se entiende como elección cuando conocés la alternativa que la industria usa por defecto; conocer las dos es lo que convierte el empaque en algo dirigible desde el prompt.
**Hook:** El mismo contador de §4 mostrado dos veces: a la izquierda un archivo que abrís con doble click; a la derecha un árbol de proyecto con `package.json`, `src/`, `node_modules/` y un build. Idéntico resultado en pantalla, decisión de empaque opuesta.
**Key analogy:** npm es el pip del mundo JavaScript. `package.json` es el `requirements.txt` (qué necesito), `npm install` es el `pip install` (traelo del registro), `node_modules/` es el `site-packages` (dónde queda). La única pieza sin equivalente directo en Python es el **bundler**: el navegador no sabe leer una carpeta de dependencias, así que hace falta un paso que aplaste todo a los archivos que el browser sí entiende.
**What students walk away knowing:**
- Empaque es la decisión; single-file y multi-archivo son dos estrategias, cada una con su costo.
- Cómo funciona la cadena estándar de la industria: manifiesto → registro → instalación local → bundler → artefacto servible. Nombrada con `pip` como puente, porque vienen de Python.
- Las tres ventajas del single-file con una IA (cabe en el contexto, deploy por copy-paste, cero toolchain) y por qué cada una le importa específicamente a alguien con LLM gratuito.
- Dónde se rompe el single-file y conviene el multi-archivo: más de mil líneas, trabajo en equipo con merges, dependencias pesadas, o backend (semana 3).
**Animations / interactive:** None bespoke. Dos piezas visuales estáticas: (a) el contador completo en un `.html` con el render en vivo al lado — ya existe y funciona; (b) su contraparte multi-archivo como árbol de directorios anotado, marcando qué línea de `package.json` produce qué carpeta. Cierre concreto opcional: estas mismas slides se sirven con reveal.js instalado por npm, así que el `node_modules/` del que se habla está a la vista.
**Slide budget:** 7–8

## Section 6: Cuatro patrones de prompt para construir UI
**Source material:** `source_material/06-patrones-de-prompt-ui.md`
**Through-line:** Cuatro patrones cubren cerca del 80% del trabajo UI con IA: describir el artefacto (P1), iterar sobre el estado (P2), arreglar el layout (P3), tematizar y pulir (P4). Cada patrón se apoya directamente en el vocabulario de las secciones 2–5.
**Hook:** "No estás escribiendo código. Estás encargando código." Un compañero adivina y repregunta; la IA hace exactamente lo que decís, así que la calidad del pedido es el techo del resultado.
**Key analogy:** El patrón de prompt es un formulario de pedido que la IA puede leer sin adivinar.
**What students walk away knowing:**
- Los cuatro patrones, cuándo aplica cada uno y la plantilla mínima de cada uno.
- Cómo cada patrón usa vocabulario de las secciones anteriores (P1 las cinco capas, P2 estado, P3 layout, P4 variables).
- Que en P2 hay que nombrar la vuelta y no solo la ida, o la IA inventa la transición de salida.
**Animations / interactive:** None bespoke. Un slide por patrón, con plantilla y ejemplo trabajado revelados por fragments. El ejemplo es el mismo Pomodoro en los cuatro, para que se vea la secuencia natural P1 → P2 → P3 → P4 sobre un solo artefacto.
**Slide budget:** 8–10

## Section 7: Actividad individual — bad UI con el ciclo Architect/Prompt/Review/Test
**Source material:** `source_material/07-actividad-practica.md`
**Through-line:** Cada estudiante construye solo una interfaz deliberadamente pésima pero funcional, sosteniendo las cuatro tareas del ciclo sin repartirlas: Architect una vez al inicio, después el loop Prompt → Review → Test. Hacer bad UI a propósito exige entender qué hace buena a una UI; que además funcione exige dominar el ciclo evento-estado-DOM de §4. Arranca en clase, con el docente disponible para dudas, y se termina en casa.
**Hook:** Dos videos del género (r/badUIbattles) revelados de a uno: sliders que son laberintos, botones que escapan del cursor.
**Key analogy:** Cambiar de tarea es cambiar de sombrero, y el más incómodo es el de Review: auditar en serio un prompt que escribiste vos treinta segundos antes.
**What students walk away knowing:**
- Las cuatro tareas del ciclo y qué hace cada una, más el criterio de re-entrada al Architect (cambios grandes de alcance).
- Que trabajando solo las cuatro siguen siendo obligatorias, y que saltear Review es el desvío más común y el que aparece más tarde.
- Constraints (individual, un `index.html`, una conversación de Canvas en Gemini o ChatGPT) y entregable (carpeta `tp1/` del repositorio del curso, con `index.html` + `prompts.md` + `README.md` según el template ya publicado). Sin presentación en clase.
**Animations / interactive:** Diagrama estático del ciclo (flow-with-arrows) — Architect arriba, loop Prompt→Review→Test debajo, nota de retorno al Architect. Vive al final de §6, antes del divider de la actividad. Dos iframes de YouTube revelados por fragment.
**Slide budget:** 5–6

---

**Total real:** 43 slides (1 título + 5 + 6 + 8 + 6 + 7 + 7 + 3) para ~70 min de clase, más el briefing de la actividad y el tiempo que quede para que arranquen.
