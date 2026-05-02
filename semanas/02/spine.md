# Spine — Semana 02: Arquitectura Frontend y Vibe Coding

**Whole-week through-line:** El curso te pide ser supervisor arquitectónico de la IA, y para dirigir necesitás vocabulario técnico. Esta clase entrega ese vocabulario en cuatro capas (estructura, estilo, estado, empaque), demuestra el payoff comparando prompts vagos con prompts específicos en cuatro patrones reusables, y termina con una actividad grupal de 60 minutos donde el equipo aplica el ciclo Architect → Prompter → Reviewer → Tester bajo presión de tiempo. El vocabulario es lo que separa "pedir y rezar" de "pedir y dirigir".

## Section 1: Frontend y el supervisor arquitectónico
**Source material:** `source_material/01-frontend-y-el-supervisor.md`
**Through-line:** Si la IA escribe el código, el cuello de botella ya no es la sintaxis sino la decisión — y para decidir hace falta vocabulario. El rol del alumno esta clase es supervisor, no tipista.
**Hook:** "Si la IA puede escribir el código, ¿para qué seguimos aprendiendo qué es un `flexbox`?" — la pregunta incómoda en pantalla, sin respuesta inmediata.
**Key analogy:** La IA es tu equipo de implementación; vos sos el supervisor que decide qué se construye y por qué.
**What students walk away knowing:**
- Por qué saber leer código importa más que saber escribirlo cuando la IA escribe.
- Las tres consecuencias de delegar la sintaxis (velocidad sube, costo de mal-especificar sube, leer > escribir).
- El roadmap de las cinco capas (estructura, estilo, comportamiento, estado, empaque) que vienen.
**Animations / interactive:** None. Apertura de pizarra.
**Slide budget:** 4–5

## Section 2: Estructura — HTML como sustantivos
**Source material:** `source_material/02-estructura-html.md`
**Through-line:** El HTML semántico nombra las partes de la página; la "div soup" es el costo predecible de no nombrarlas, y la IA cae ahí por defecto si no le das vocabulario.
**Hook:** Dos bloques visualmente idénticos, uno con `<header>` y otro con `<div class="header">` — ¿son lo mismo? El navegador dice que no.
**Key analogy:** Los elementos HTML son sustantivos: nombran qué *es* cada bloque, no qué *parece*.
**What students walk away knowing:**
- Las siete etiquetas estructurales (header/main/section/article/nav/footer/aside) que arman el esqueleto de casi cualquier página.
- Por qué el outline del documento solo existe con semántica.
- Diferencia entre prompt vago vs prompt con vocabulario HTML aplicado a una página de contacto.
**Animations / interactive:** Live demo de `demo.html` §1 — toggle semántico ↔ div soup en vivo. Embebido en iframe o screenshot anotado si el iframe es lento.
**Slide budget:** 5–6

## Section 3: Estilo — cuatro primitivas de CSS
**Source material:** `source_material/03-estilo-css.md`
**Through-line:** CSS es enorme, pero para dirigir alcanza con cuatro primitivas: el modelo de caja, el layout (flex/grid), tipografía/color y variables. Cada una resuelve un tipo de pedido específico.
**Key analogy:** Las primitivas son las "perillas" que la IA puede ajustar. Una variable CSS es la perilla más poderosa porque concentra muchos cambios en una línea.
**What students walk away knowing:**
- Padding y margin son las palabras de "respirar", no "dale más aire".
- Flex (una dimensión) vs Grid (dos dimensiones) — y por qué nombrarlo evita que la IA improvise con `inline-block`.
- Las variables CSS son el punto de entrada que el LLM puede modificar sin reescribir todo.
**Animations / interactive:** Live demo de `demo.html` §2 — theme switcher cambiando toda la paleta tocando una variable.
**Slide budget:** 6–7

## Section 4: Estado, DOM y eventos — el triángulo dinámico
**Source material:** `source_material/04-estado-y-comportamiento.md`
**Through-line:** Cuando una página *hace algo*, hay tres conceptos en juego al mismo tiempo (estado, DOM, eventos) conectados en un ciclo de cinco pasos. "Estado" es la palabra que la IA necesita para no inventar atajos malos.
**Hook:** Un contador clásico hace click y aparece "1". ¿Qué se actualizó exactamente entre el click y el render?
**Key analogy:** El estado es la verdad; el DOM es el reflejo. Si te olvidás de actualizar uno de los dos, la pantalla miente.
**What students walk away knowing:**
- Estado vs DOM como entidades separadas (no son lo mismo aunque caminen en paralelo).
- El ciclo evento → listener → estado → mutación de DOM → render.
- Por qué nombrar "estado" en el prompt cambia el código que la IA produce.
**Animations / interactive:** Live demo de `demo.html` §3 — contador, todo list y event log mostrando el mismo ciclo tres veces. Quizá un step-through visual del ciclo de 5 pasos (puede ser HTML estático con fragments, no animación bespoke).
**Slide budget:** 6–7

## Section 5: Empaque — single-file platform
**Source material:** `source_material/05-single-file-platform.md`
**Through-line:** Un archivo `.html` con todo dentro cabe en el contexto de la IA gratuita, deploya con copy-paste y elimina el toolchain. Es el paradigma por defecto del curso, con límites honestos.
**What students walk away knowing:**
- Las tres ventajas (cabe en contexto, deploy por copy-paste, cero toolchain) y por qué cada una le importa específicamente al alumno con LLM gratuito.
- Cuándo el paradigma se rompe (1k+ líneas, equipo, deps pesadas, backend → semana 3).
- `demo.html` es la prueba viva: una página educativa entera en un archivo.
**Animations / interactive:** None bespoke. Mostrar un screenshot anotado de `demo.html` con su tamaño/líneas como evidencia, o el `view-source` modal que ya está en §5 de demo.html.
**Slide budget:** 4–5

## Section 6: Cuatro patrones de prompt para construir UI
**Source material:** `source_material/06-patrones-de-prompt-ui.md`
**Through-line:** Cuatro patrones cubren ~80% del trabajo UI con IA: describir el artefacto (P1), iterar sobre el estado (P2), arreglar el layout (P3), tematizar y pulir (P4). Cada patrón se apoya directamente en el vocabulario de las secciones 2–5, y demostrarlos en orden con un dice roller en vivo cierra el arco de la clase.
**Hook:** Prompt vago "hacelo más lindo" → resultado random vs prompt P3 con flex/justify/gap → resultado preciso. Lado a lado.
**Key analogy:** No estás escribiendo código, estás *encargando* código. El patrón de prompt es el formulario de pedido que la IA puede leer sin adivinar.
**What students walk away knowing:**
- Los cuatro patrones, cuándo aplica cada uno y la plantilla mínima de cada uno.
- Cómo cada patrón usa vocabulario de las secciones anteriores (P1 estructura HTML, P2 estado, P3 layout, P4 variables).
- La secuencia natural P1 → P2 → P3 → P4 vista en vivo con el dice roller.
**Animations / interactive:** Reuse `clickable-steps.js` de week 01: cuatro cajas (P1/P2/P3/P4), click en cada una muestra plantilla y ejemplo trabajado en panel inferior. Para la demo en vivo del dice roller no hace falta animación — es vivo en otra pestaña.
**Slide budget:** 8–10

## Section 7: Actividad grupal — ciclo Architect/Prompter/Reviewer/Tester
**Source material:** `source_material/07-actividad-grupal.md`
**Through-line:** En 60 minutos los grupos de 4 construyen un artefacto en una sola página repartiéndose cuatro tareas: Architect (una vez al inicio) y el loop Prompter ↔ Reviewer ↔ Tester. Es el ciclo de desarrollo asistido por IA bajo presión real.
**What students walk away knowing:**
- Las cuatro tareas del ciclo y qué hace cada una (Architect, Prompter, Reviewer, Tester).
- El loop principal y cuándo se vuelve al Architect (cambios de alcance grandes).
- Constraints (un archivo `index.html`, ChatGPT Canvas, 60 min) y entregable (repo público con `index.html` + `prompts.md` + `README.md`).
**Animations / interactive:** Diagrama estático del ciclo (flow-with-arrows pattern) — Architect arriba, loop Prompter→Reviewer→Tester debajo, flecha de retorno al Architect. Sin JS bespoke.
**Slide budget:** 5–6

---

**Total estimado:** ~38–46 slides para ~60–65 min de clase + 60 min de actividad grupal.
