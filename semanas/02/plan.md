# Plan — Semana 02 slides

Plan de implementación del deck descrito en `spine.md`. **El deck ya está construido**: este documento fue alineado contra `slides/index.html` tal como existe hoy, así que describe lo que hay, no lo que se pensaba hacer. Sirve para dos cosas — entender por qué cada sección quedó como quedó, y no volver a proponer cosas que ya se descartaron con motivo.

Una tarea por sección, en orden del spine. Los patrones referenciados salen de `shared/patterns/`.

**Estado actual:** 44 slides (1 título + 6 + 6 + 8 + 6 + 7 + 7 + 3).

---

## Decisiones transversales

Tres decisiones se tomaron durante la ejecución y aplican a todo el deck. Cambiar cualquiera de ellas es un cambio grande, no un ajuste:

**Sin JavaScript bespoke.** El deck no carga ningún script propio — `semanas/02/slides/` contiene únicamente `index.html`. Todo lo interactivo se resuelve con fragments de reveal.js, con HTML/CSS renderizado en el slide, o abriendo `demo.html`. En particular, `clickable-steps.js` se evaluó para §6 y se descartó: cuatro slides con fragments explican los patrones mejor que un panel con click-to-reveal, porque el patrón y su ejemplo trabajado se leen juntos.

**`demo.html` se abre en pestaña nueva, no en iframe.** Los slides de demo tienen un botón `<a target="_blank">` a `../source_material/demo.html#ancla`. Hay tres: §2 (`#estructura`), §3 (`#estilo`), §4 (`#estado`). El iframe se descartó porque `demo.html` es una página completa y compite con el deck por pantalla. §5 no linkea al demo: se explica con código propio y un contador renderizado en el mismo slide.

**Cada sección de anatomía cierra igual.** §§2–5 terminan con un slide "Cómo le pedís X a una IA": prompt vago contra prompt con vocabulario, mismo cierre — *vago es lotería, específico es determinismo*. Es el latido de la clase. Un slide nuevo en esas secciones va antes de ese cierre, nunca después.

---

## Task 0 — Setup

Esqueleto de `slides/index.html` a partir de `shared/templates/week-template.html`, con el tema de `_config/theme/` cargado.

- Título del deck: **Arquitectura Frontend** (sin número de semana en el `h1`; la semana vive solo en el `<title>`).
- reveal.js se sirve desde `node_modules/` en la raíz del repo, con los plugins `highlight` y `notes`.
- `npm start` y confirmar que renderiza en `http://localhost:3000/semanas/02/slides/`.

---

## Task 1 — §1: Frontend y el supervisor arquitectónico (6 slides)

**Spine:** §1. El cuello de botella es la decisión, no la sintaxis; el alumno es supervisor.

Definición de frontend con sus cuatro tipos, el cuello de botella que se corre a la decisión, el rol del alumno, qué cambia al delegar la sintaxis, el diagrama de cinco capas, y el alcance de la clase.

**Patrones:** fila de tarjetas para los tipos de frontend y para las tres consecuencias; `comparison-2col.html` para el antes/ahora y para el rol.

**Apertura:** la sección abre definiendo qué es un frontend y acotando el foco al web, no con un hook. La versión anterior abría con la pregunta del `flexbox`; se reemplazó porque la palabra "frontend" aparece toda la clase y conviene fijarla antes de usarla. El argumento del `flexbox` sobrevive en el material fuente y en la slide del cuello de botella.

**Invariante:** el diagrama de cinco capas (`pipe-node` / `pipe-grid`) nace acá y se repite como roadmap activo en la apertura de §§2–5, cambiando solo cuál pill está encendida. Mismos colores, mismas etiquetas.

---

## Task 2 — §2: Estructura HTML (6 slides)

**Spine:** §2. El HTML semántico nombra; la div soup es el costo de no nombrar.

Apertura con roadmap, las dos versiones de la misma página, por qué importa la diferencia, las siete etiquetas estructurales, los elementos de contenido e interacción, y el cierre de prompt.

**Patrones:** `comparison-2col.html` para semántico vs div soup; `data-table.html` para las siete etiquetas y para los elementos de contenido.

**Demo:** botón a `demo.html#estructura`. El toggle Semántico ↔ Sopa de divs muestra el mismo render; "Ver código" muestra que el HTML es distinto.

---

## Task 3 — §3: Estilo CSS (8 slides)

**Spine:** §3. Cuatro primitivas alcanzan para dirigir: caja, layout, tipografía/color, variables.

Apertura con roadmap, sintaxis CSS, una slide por primitiva, la demo en vivo, y el cierre de prompt.

**Invariante — las slides de primitiva tienen tres piezas.** Cada una muestra el markup HTML con su clase, la regla CSS que le aplica, y el resultado renderizado con HTML/CSS real en el mismo slide. Varias variantes por slide (distintos valores produciendo distintos resultados) hacen obvio el efecto. El render va detrás de un fragment para poder introducir el concepto antes de que aterrice. Es el patrón más denso del deck y el que más se rompe al editar sin cuidado.

**Demo:** botón a `demo.html#estilo` — flex playground con `justify-content` y theme switcher de una variable.

---

## Task 4 — §4: Comportamiento y estado (6 slides)

**Spine:** §4. Estado, DOM y eventos conectados en un ciclo.

Las capas 3 y 4 se presentan juntas — el roadmap enciende las dos pills a la vez, porque separarlas obligaba a explicar el ciclo dos veces. Hook del contador, el triángulo dinámico, el ciclo evento → estado → DOM revelado por fragments, la demo, y el cierre de prompt.

**Patrones:** `flow-with-arrows.html` para el ciclo.

**Demo:** botón a `demo.html#estado` — contador, todo list y un event log que nombra evento, mutación de estado y mutación de DOM en cada paso.

---

## Task 5 — §5: Empaque, single-file y multi-archivo (7 slides)

**Spine:** §5. Empaque es la decisión; single-file y multi-archivo son dos estrategias.

**Encuadre:** la sección abre distinguiendo empaque (la decisión de cómo se reparten las cuatro capas anteriores entre archivos) de single-file (una estrategia particular). Esa distinción es lo que hace que la elección del curso se lea como decisión y no como tautología, y es la razón por la que se muestran las dos estrategias antes de defender una.

Orden: apertura → cómo se ve un single-file → la otra estrategia, multi-archivo → npm → por qué single-file con una IA → dónde se rompe → cierre de prompt.

- **Single-file** se muestra con el contador de §4 completo en un `.html`, con el render en vivo al lado y cada capa marcada.
- **Multi-archivo** es el mismo contador como árbol de proyecto anotado (`package.json`, `src/`, `node_modules/`, `dist/`), al lado del árbol single-file con sus tags anotados por capa. Las dos capas se anotan igual en ambos para que el paralelo se vea.
- **npm** se explica por analogía con pip, porque los alumnos vienen de Python: tabla `requirements.txt`/`package.json`, PyPI/npm registry, `pip install`/`npm install`, `site-packages`/`node_modules`. El **bundler** va detrás de un fragment como la única pieza sin equivalente en Python, con el flow `node_modules/ + src/ → bundler → dist/bundle.js → navegador`.
- **Dónde se rompe** son cuatro tarjetas en 2×2: mil líneas, varias personas editando, dependencias pesadas, aparece un servidor. Cierra la deuda que abre el speaker note de las tres ventajas, que anuncia límites concretos.

**Nota de vocabulario:** el backend se nombra como "aparece un servidor" en el texto visible; la referencia a la clase siguiente vive en el speaker note.

---

## Task 6 — §6: Cuatro patrones de prompt (7 slides)

**Spine:** §6. Cuatro patrones cubren cerca del 80% del trabajo UI con IA.

Divider, el cambio de mentalidad ("no estás escribiendo código, estás encargando código"), una slide por patrón, y el diagrama del ciclo de desarrollo asistido por IA.

**Invariante — un solo ejemplo corriendo.** Los cuatro patrones usan el mismo Pomodoro, para que se vea la secuencia natural P1 → P2 → P3 → P4 sobre un artefacto que evoluciona. Cada slide tiene plantilla y ejemplo trabajado, revelados por fragments en ese orden. No hay demo en vivo en esta sección: la construcción real la hacen los alumnos en la actividad.

**Ubicación del diagrama del ciclo:** vive al final de §6, no en §7. Cierra la parte aplicada conectando los patrones con el proceso, y deja §7 como briefing puro de la consigna.

---

## Task 7 — §7: Actividad práctica (3 slides)

**Spine:** §7. Bad UI individual, arranca en clase y se termina en casa.

Divider, el tema, y constraints + entregable.

- **Tema:** bad UI, inspirado en r/badUIbattles. Dos videos de YouTube en iframe, revelados de a uno por fragment. El reto es que sea terrible pero funcional: si rompe, no cuenta como bad UI, cuenta como bug.
- **Constraints:** individual, un solo `index.html`, sin build tools ni dependencias externas, una sola conversación de Gemini Canvas.
- **Entregable:** carpeta `tp1/` en el repositorio único del curso, con `index.html`, `prompts.md` y `README.md` siguiendo el template ya publicado. No hay repositorio nuevo y no hay presentación en clase.

**Descartado con motivo:** las cuatro slides por rol (Architect / Prompt / Review / Test) que estaban planeadas. El ciclo se explica una vez en §6 con el diagrama, y repetirlo rol por rol en el briefing alargaba §7 sin agregar nada. Las cuatro tareas siguen siendo obligatorias trabajando solo — eso vive en el speaker note del diagrama.

---

## Task 8 — Pasada de coherencia

Lista de re-verificación después de cualquier edición grande:

- Caminar el deck sección por sección en el browser. Las transiciones tienen que leerse como un arco.
- El roadmap de cinco capas re-enciende consistente en §§2–5: mismos colores, mismas etiquetas, solo cambia la pill activa.
- Los cierres "Cómo le pedís X a una IA" siguen siendo los últimos slides de §§2–5.
- Cada bullet de "what students walk away knowing" del spine está cubierto en algún slide.
- Ningún `init...()` huérfano ni `<script src>` a archivos que no existen.
- Consola del browser sin errores propios. Los tres de `compute-pressure` vienen de los iframes de YouTube de §7 y son esperables.
- Los speaker notes usan los tres formatos (`<strong>` acciones / `<u>` descripción / `<em>` script), y en slides con fragments hay un bloque `<em>` por reveal.
- Sin vocabulario de relleno de IA (grep contra la lista de `voice-and-didactics.md`).
- Todo entra en pantalla a 1280×800, con los fragments revelados.

---

## Notas de ejecución

- Releer `spine.md` antes de tocar cualquier sección (anti-drift).
- Mostrar cada sección a Enzo antes de seguir con la próxima.
- Todo patrón nuevo que se invente va a `shared/patterns/` con su fila en el catálogo — no inline silencioso.
- `demo.html` se puede modificar cuando un slide revela una mejora concreta; el cambio del demo se commitea junto al slide que lo motivó.
- Reveal.js escapa el HTML dentro de `<pre><code>`, así que los `<span>` coloreados no funcionan ahí. Para texto monoespaciado con color (árboles de directorios, salidas de terminal) usar un `<div>` con `white-space: pre`.
