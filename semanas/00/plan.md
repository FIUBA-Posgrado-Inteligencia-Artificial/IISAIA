# Plan — Semana 00: Presentación del curso

> **For agentic workers:** REQUIRED SUB-SKILL: usar `superpowers:executing-plans` para ejecutar tarea por tarea. Steps usan checkbox `- [ ]`.

**Goal:** Generar `semanas/00/slides/index.html` con 11 slides (1 portada + 10 de contenido) que cubran el arco **promesa → criterio → acción** del spine, para dictarse en ~15 minutos al inicio del primer encuentro, antes de entrar a Funcionamiento de LLMs.

**Architecture:** Un único `index.html` escrito directo desde `shared/templates/week-template.html`. **No se usa** el patrón `_scaffold.html` + `_assemble.mjs` de S04–S06: ese existe para decks de 50+ slides repartidos en fragmentos, y acá el deck entero entra cómodo en un archivo, como en S02 y S03. Sin JS propio, sin animaciones, sin `clickable-steps.js`.

**Tech stack:** reveal.js, `_config/theme/components.css`, snippets de `shared/patterns/`. Cero JavaScript nuevo.

**Spine:** `semanas/00/spine.md`.
**Source material canónico:** `semanas/00/source_material/index.md` y los 3 archivos numerados.

---

## Global Constraints

- **Audiencia de conocimiento cero.** Es el primer bloque del curso: los alumnos no vieron nada todavía. Es el espejo exacto de la convención de S06 ("asumir nivel S04+S05"): acá **no se puede asumir nada**. Prohibido usar sin explicar: token, ventana de contexto, agente, loop, endpoint, commit, branch, repositorio, prompt engineering. Cuando un término es inevitable (repositorio, commit, prompt), se usa con una glosa de media línea y se aclara que se ve en serio más adelante.
- **Meta-referencias al curso: permitidas acá, y sólo acá.** La regla general del proyecto prohíbe ubicar al alumno en el calendario dentro del texto visible. En este bloque el curso **es** el tema, así que nombrar "las ocho semanas", "la clase 6" o "el Demo Day" es contenido, no meta-narración. Lo que sigue prohibido es etiquetar el rol pedagógico de la slide en la slide.
- **Términos en inglés** para lo técnico: repo, commit, branch, README, link, frontend, backend.
- **Prohibidos:** vibe coding, diplomatura, payoff, bisagra, dolores ("complicaciones" en su lugar), mismatch ("desfasaje"), diálogo socrático ("preguntas dirigidas"), scaffolding, andamiaje. Sin emojis. Sin marketing ("el más completo / el más popular"). Sin filler de bienvenida ("Bienvenidos a esta increíble jornada").
- **Sin bullet lists como contenido de slide.** Cada slide lleva estructura visual de `shared/patterns/`. Excepción del manual de voz: slides de definición "qué es" y enumeraciones "tres cosas que", que acá aplica sólo a la slide de los tres pasos del §3.
- **Tamaños de body text:** body principal ≥1.1rem, secundario ≥1.05rem, eyebrows ≥0.85rem.
- **Texto centrado:** bloques fuera de cajas con su propio `max-width` + `margin: auto`, sin `<br>` entre oraciones de largo distinto.
- **Speaker notes en 3 formatos:** `<strong>` acciones / `<u>` descripción / `<em>` script hablado entre comillas. **Un `<p><em>…</em></p>` por fragment reveal.** Target **~80–150 palabras por slide** (más corto que un deck técnico: el bloque tiene que correr en 15 min).
- **Sin `<span>` dentro de `<pre><code>`:** el highlight plugin escapa el HTML como texto literal. Para el árbol de directorios del §3 usar `<div>` con `white-space: pre-wrap`.
- **Dirección de correo:** el §3 dice "mandá el link por correo al docente" **sin hardcodear la dirección**. Queda pendiente de confirmación del profesor; se resuelve en el coherence pass.

---

## Task 0 — Setup del deck

**Files:**
- Create: `semanas/00/slides/index.html` (desde `shared/templates/week-template.html`)

- [ ] **Step 1: Copiar el template**

```bash
cp shared/templates/week-template.html semanas/00/slides/index.html
```

- [ ] **Step 2: Ajustar head y portada**

En `<head>`, el `<title>` es el único lugar donde vive el número de semana:

```html
<title>Semana 00 — Presentación del curso</title>
```

Verificar que las cinco rutas de `<link>` resuelven con **tres** niveles de `../` (`semanas/00/slides/` → raíz), igual que en las demás semanas.

- [ ] **Step 3: Borrar las secciones de ejemplo del template**

Dejar sólo la title slide y el `<div class="slides">` vacío debajo. Los `<section>` de ejemplo del template no van al deck final.

- [ ] **Step 4: Verificar que abre**

Run: `npm start` y abrir `http://localhost:3000/semanas/00/slides/`
Expected: carga la portada sin errores en consola.

- [ ] **Step 5: Commit**

```bash
git add semanas/00/slides/index.html
git commit -m "feat(s00): scaffold del deck desde el template base"
```

---

## Task 1 — §1 Qué es este curso y adónde llegás (4 slides, incluye portada)

**Spine:** Section 1. Through-line: el curso no enseña a programar, enseña a dirigir a quien programa.
**Source:** `source_material/01-que-es-este-curso.md`

**Slide arc:**

1. **Portada.** `h1` = **"Dirigir, no escribir"** (el `h1` es el tema, nunca "Semana 00"). Subtítulo: qué vas a construir, cómo se evalúa y dónde vive tu trabajo. Línea `muted`: Introducción al desarrollo de software asistido por IA. Pattern: `title-slide.html`.
2. **La promesa.** Statement grande, dos tiempos. Primero: *"En ocho semanas vas a terminar una aplicación funcionando: una interfaz que alguien puede usar, un servidor que responde y datos que persisten."* Fragment reveal: *"No vas a escribir la mayor parte del código."* Sin caja, texto centrado con `max-width` propio. El fragment es el golpe — la nota del orador indica esperar antes de avanzar.
3. **Las dos reacciones equivocadas.** Pattern: `comparison-2col.html`. Columna izquierda "Alivio — entonces no hay nada que aprender"; derecha "Desconfianza — entonces no es un curso serio". Cierre bajo las dos columnas, como fragment: *"El trabajo no desapareció. Se corrió de lugar."*
4. **El arco de las ocho clases.** Pattern: `pipeline-roadmap.html` — tres etapas encadenadas: **Entender el modelo** (clase 1) → **Nombrar lo que construís** (clases 2–3) → **Dirigir al agente** (clases 4–7). Cada etapa con una línea de qué se gana. La clase 8 aparece al final del roadmap como "Presentás lo tuyo", visualmente separada.

**Speaker notes:** ~100–150 palabras por slide. La slide 2 lleva un `<em>` por cada uno de los dos tiempos (statement + fragment).

- [ ] **Step 1: Escribir las 4 slides en `index.html`**
- [ ] **Step 2: Correr el per-section review checklist** (ver abajo)
- [ ] **Step 3: Verificar en el browser** que el fragment de la slide 2 dispara y que el roadmap no desborda vertical
- [ ] **Step 4: Commit**

```bash
git add semanas/00/slides/index.html
git commit -m "feat(s00 §1): qué es el curso y el arco de las ocho clases"
```

---

## Task 2 — §2 Cómo se aprueba (3 slides)

**Spine:** Section 2. Through-line: tres entregas individuales, y se evalúa cómo dirigiste, no que el producto ande.
**Source:** `source_material/02-como-se-aprueba.md`

**Slide arc:**

5. **Las tres entregas.** Pattern: `flow-with-arrows.html` — TP1 → TP2 → Proyecto integrador, con el Demo Day colgando del tercero. Las tres cajas marcadas **individual**. Nota al pie de la slide: las consignas se comunican cuando corresponde; hoy importa la forma.
6. **Qué se evalúa.** Hook en el encabezado: *"Que funcione no alcanza."* Pattern: `comparison-2col.html`. Izquierda "Lo que no alcanza": el producto anda, pero no podés reconstruir cómo llegaste. Derecha "Lo que se mira": cómo especificaste, qué decidiste vos, cómo detectaste que se desvió. Cierre como fragment: la palabra **apropiación**, definida en una línea — explicar, corregir y extender.
7. **Dónde queda registrado.** El `README.md` como informe de cada entrega, y desde la clase 6 también el historial de commits. Pattern: `comparison-2col.html` en modo antes/después, o dos cards apiladas. Cierre en negrita: *"El historial no se puede fabricar la noche anterior."* — esa frase es el puente al §3.

**Speaker notes:** ~100–150 palabras. En la slide 5, la nota aclara por qué individual (la responsabilidad se diluye en grupo) — **va en la nota, no en la slide**: en pantalla suena defensivo.

- [ ] **Step 1: Escribir las 3 slides**
- [ ] **Step 2: Correr el per-section review checklist**
- [ ] **Step 3: Verificar** que la frase de cierre de la slide 7 encadena con el §3
- [ ] **Step 4: Commit**

```bash
git add semanas/00/slides/index.html
git commit -m "feat(s00 §2): las tres entregas y el criterio de evaluación"
```

---

## Task 3 — §3 Tu repositorio (4 slides)

**Spine:** Section 3. Through-line: un repo que crece ocho semanas, porque el historial continuo es la evidencia que el §2 va a leer.
**Source:** `source_material/03-tu-repositorio.md`

**Slide arc:**

8. **La estructura.** El árbol de directorios como pieza central. **No usar `<pre><code>`** — usar `<div>` con `white-space: pre-wrap` y fuente monoespaciada, para poder colorear las anotaciones al margen sin que el highlight plugin las escape:

```
apellido-iisaia/
├── README.md          índice del repo
├── tp1/
│   ├── README.md      informe del TP1
│   ├── prompts.md
│   └── index.html
├── tp2/
└── tp-final/
```

Al costado o debajo, una línea: el README de la raíz es el índice; el de cada carpeta es el informe de esa entrega.

9. **Por qué uno solo y no tres.** Pattern: `comparison-2col.html`. Izquierda "Tres repos sueltos": tres links, historial fragmentado, cada uno creado la noche anterior. Derecha "Un repo que crece": un link para todo el curso, y un historial continuo donde se ve cómo evolucionó tu forma de trabajar. Cierre: el historial es la evidencia, y sólo cuenta una historia si es continuo.
10. **Qué hacés esta semana.** Tres pasos numerados —acá **sí** aplica la excepción de lista enumerativa del manual de voz—: crear la cuenta de GitHub, crear el repo público con un README mínimo, mandar el link por correo al docente. Debajo, en secundario: es el único link que se entrega en todo el curso, no hay que reenviarlo en cada entrega. Y: si nunca usaste git, no es problema — se ve en serio en la clase 6, hoy alcanza con crearlo desde la web.
11. **El pase.** Slide de cierre, sin resumen y sin "¿Preguntas?". Una línea que entrega la clase: *"Eso es todo lo administrativo. Ahora sí: cómo funciona por dentro el modelo con el que vas a trabajar."* Texto centrado, sin caja.

**Speaker notes:** ~80–120 palabras. La slide 11 lleva la nota más corta del deck: es un pase, no un cierre.

- [ ] **Step 1: Escribir las 4 slides**
- [ ] **Step 2: Correr el per-section review checklist**
- [ ] **Step 3: Verificar** que el árbol se ve alineado y no desborda horizontal
- [ ] **Step 4: Commit**

```bash
git add semanas/00/slides/index.html
git commit -m "feat(s00 §3): el repositorio del curso y el pase a la clase 1"
```

---

## Task 4 — Coherence pass

**Files:**
- Modify: `semanas/00/slides/index.html`

- [ ] **Step 1: Verificar el arco completo**

Recorrer el deck de punta a punta y confirmar que el embudo del spine se lee: la promesa (slide 2) se sostiene en el arco (slide 4), el criterio (slide 6) justifica el registro (slide 7), y el registro justifica el repo (slides 8–9). Si alguna transición no se sostiene sola, ajustar la línea de cierre de la slide anterior.

- [ ] **Step 2: Cronometrar**

Leer las speaker notes en voz alta a ritmo de dictado. Target: **15 minutos, tolerancia hasta 17**. Si pasa, la primera candidata a recortar es la slide 3 (las dos reacciones), que es la más prescindible del deck.

- [ ] **Step 3: Chequear las constraints globales**

Buscar en el HTML los términos prohibidos y los `<span>` dentro de `<pre>`:

```bash
grep -icE "vibe coding|diplomatura|payoff|bisagra|dolores|mismatch|scaffolding|andamiaje" semanas/00/slides/index.html
grep -c "<pre><code>" semanas/00/slides/index.html
```

Expected: 0 en el primero. El segundo puede ser >0 sólo si ningún bloque lleva spans coloreados.

- [ ] **Step 4: Resolver el pendiente del correo**

Preguntar al profesor qué dirección va en la slide 10, o si prefiere dejarla como "por correo al docente" sin dirección explícita en un repo público.

- [ ] **Step 5: Verificar en el browser**

Run: `npm start`, abrir `http://localhost:3000/semanas/00/slides/`
Expected: 11 slides, todos los fragments disparan, sin errores de consola, sin scroll vertical en ninguna slide.

- [ ] **Step 6: Commit**

```bash
git add semanas/00/slides/index.html
git commit -m "fix(s00): coherence pass del deck completo"
```

---

## Per-section review checklist

Se corre al final de cada Task 1–3:

- [ ] Ninguna slide es una `<ul>` como contenido principal (salvo la slide 10, excepción declarada).
- [ ] Voz en segunda persona, voseo argentino. Sin filler de IA.
- [ ] Un concepto por slide.
- [ ] Sin emojis.
- [ ] Speaker notes en los 3 formatos, un `<em>` por fragment.
- [ ] El hook del spine aparece, en las secciones que lo declaran (§1 y §2).
- [ ] Todos los walk-aways del spine están cubiertos en alguna slide.
- [ ] Los patterns salen de `shared/patterns/`; si se inventa uno, se agrega al catálogo.
- [ ] `style="…"` inline minimizado; se usan clases de `components.css`.
- [ ] Ningún término de la lista de prohibidos.
- [ ] Ningún concepto usado sin glosa (constraint de audiencia cero).

---

## Self-review (writing-plans)

**1. Cobertura del spine.** Las tres secciones tienen tarea propia (Tasks 1–3). Los 9 walk-aways del spine están asignados: §1 → slides 2–4; §2 → slides 5–7; §3 → slides 8–10. Los hooks declarados en el spine (§1 y §2) están en las slides 2 y 6. El §3 no declara hook y no se le fuerza uno. Sin huecos.

**2. Placeholders.** Ninguna tarea dice "completar después". El único pendiente real —la dirección de correo— está declarado explícitamente como constraint global y tiene un step propio en el coherence pass, en vez de quedar como un TODO suelto.

**3. Consistencia.** La numeración de slides corre 1–11 sin saltos ni repeticiones entre tareas. Los nombres de pattern usados (`title-slide`, `comparison-2col`, `pipeline-roadmap`, `flow-with-arrows`) existen todos en `shared/patterns/README.md`; ninguno inventado. El budget del spine (9–11) se cumple en el techo, justificado en el coherence pass con un candidato de recorte nombrado.
