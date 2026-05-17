# Semana 04 — Consolidación de slides via animaciones JS

**Fecha:** 2026-05-17
**Estado:** Diseño aprobado, pendiente de plan de implementación

## Problema

El deck actual de semana 04 tiene 115 slides distribuidos en 12 secciones (~194 min, dictado en 2 sesiones). El análisis muestra un patrón consistente: la misma animación bespoke (`four-loop-anim.js`, 600 líneas) se monta 11 veces en divs distintos, cada montaje en su propio slide, con el único objetivo de variar la fase iluminada o el modo de visualización. Otras secciones repiten estructuras visuales (tricotomía, tracker "¿loop o contexto?") en slides separados que podrían ser un único componente que se rellena por sección.

El objetivo es hacer el deck más conciso reemplazando slides redundantes por transiciones de estado dentro de animaciones JS — sin recortar contenido pedagógico.

## Objetivo

Reducir 115 → ~95-100 slides ejecutando seis consolidaciones independientes, todas montadas sobre el mismo deck.

## No-objetivos

- No se reescribe contenido pedagógico. El texto de h2, cards, captions y speaker notes proviene de los slides actuales (mergeado, no reescrito).
- No se modifican otros decks (semanas 01-03, 05+).
- No se introduce un framework de animación. Todo el código nuevo es JavaScript vanilla, en línea con el patrón actual del deck.
- No se intenta sticky-real en Reveal (DOM que sobrevive cambios de slide). Se acepta "logically persistent" — misma posición/dimensión visual, remontaje técnico transparente.

## Diseño

### Cambios base en `four-loop-anim.js`

Una nueva API pública complementaria a la existente:

```js
// Nuevo método público
updateFourLoop({ containerId, phase, mode })
```

Mecánica interna:
- Se agrega un map `containerId → opts` que guarda los opts originales con los que se inicializó cada instancia.
- `updateFourLoop` busca la instancia, mergea phase/mode sobre los opts originales, y vuelve a llamar al renderer correspondiente sobre el mismo container. El DOM se reemplaza vía `innerHTML`, igual que en el render inicial — no hay flicker porque la geometría es idéntica.
- Backward-compat: el UMD wrapper actual exporta una función única (`initFourLoop`). Se cambia a exportar un objeto `{ init, update }`. Los call sites existentes que dependen del binding global (`window.initFourLoop`) se preservan vía un alias.

Adicionalmente se agregan dos render modes nuevos para C2:

- `renderHallucinate(container, opts)` — nodo `actuar` muestra una tool fabricada (string en color de error), nodo `observar` muestra un resultado falso. Las flechas entre nodos van en color de error.
- `renderPoison(container, opts)` — reusa la estructura de `renderFill` pero los chips de la barra de contexto son rojos ("ruido"), con caption "el agente alimenta su propio rot".

### Componente nuevo: `tracker.js`

Archivo nuevo: `semanas/04/slides/tracker.js`. UMD-style, mismo patrón que `four-loop-anim.js` y `clickable-steps.js`.

API pública:

```js
initTracker({ containerId, target, sublabel })
updateTracker({ containerId, target, sublabel, animateFlip })
```

`target` es `'contexto' | 'loop'`. `sublabel` es texto chico debajo del lado iluminado (ej. `"siempre cargado"`, `"condicional"`, `"al tocar archivo que matchea"`).

Renderiza una barra horizontal con dos opciones (CONTEXTO | LOOP) y una flecha vertical que aterriza en la opción activa. `animateFlip: true` dispara una transición CSS de 800ms moviendo la flecha al lado opuesto.

### C1 — §2 fases (Pensar / Actuar / Observar)

**Cambio:** §2.3 + §2.4 + §2.5 (3 slides) → 1 slide.

**Estructura del slide consolidado:**

```html
<section data-loop-mode="intro" data-loop-phase="pensar">
  <h2 data-phase="pensar">Pensar — formular el próximo paso</h2>
  <h2 class="fragment current-visible" data-phase="actuar">Actuar — usar una herramienta</h2>
  <h2 class="fragment current-visible" data-phase="observar">Observar — leer el resultado</h2>

  <div class="s2-loop-wrap">
    <div id="s2-loop-phases"></div>
  </div>

  <div class="s2-phase-card" data-phase="pensar">…</div>
  <div class="s2-phase-card fragment current-visible" data-phase="actuar">…</div>
  <div class="s2-phase-card fragment current-visible" data-phase="observar">…</div>

  <aside class="notes">…</aside>
</section>
```

**Sincronía:** un listener en `Reveal.on('fragmentshown', ...)` lee `event.fragment.dataset.phase` y llama `updateFourLoop({ containerId: 's2-loop-phases', phase })`. Lo mismo con `fragmenthidden` para volver atrás.

**Estado inicial:** `phase: 'pensar'`. Press 1 → actuar. Press 2 → observar.

**Salto vertical:** mitigación obligatoria — `min-height` fijo en el contenedor del h2 (medido al render del mayor de los tres textos) y en `.s2-phase-card`.

**Speaker notes:** un único `<aside class="notes">` con 1 bloque `<strong>` (dirección al docente), 1 `<u>` (racional pedagógica), y 3 `<em>` (uno por estado: pensar, actuar, observar). Los textos se mergean de las tres `<aside>` actuales.

### C2 — §5 modos de falla

**Cambio:** se elimina la duplicación de §5 (hoy hay un slide con clickable-steps de los 4 modos + dos slides extra con `s5-loop-infinite` y `s5-loop-drift` montados aparte). El slide de los 4 modos absorbe la funcionalidad: clickear un chip muta la animación principal a ese modo.

**Estructura:**

```html
<section data-loop-mode="intro" data-loop-phase="none">
  <h2>Cuatro modos de falla nuevos</h2>

  <div id="s5-modes"></div>      <!-- los 4 chips, via clickable-steps -->
  <div id="s5-loop"></div>       <!-- animación, montada en modo intro -->
  <div id="s5-mode-detail"></div><!-- mini-card de descripción del modo seleccionado -->

  <aside class="notes">…</aside>
</section>
```

**Handler de cada chip:**
- "loop infinito" → `updateFourLoop({ containerId: 's5-loop', mode: 'infinite' })`
- "deriva" → `updateFourLoop({ containerId: 's5-loop', mode: 'drift' })`
- "alucinar tools" → `updateFourLoop({ containerId: 's5-loop', mode: 'hallucinate' })`
- "envenenar contexto" → `updateFourLoop({ containerId: 's5-loop', mode: 'poison' })`

Cada click también actualiza `#s5-mode-detail` con la descripción de ese modo (textos del slide actual de clickable-steps).

**Comportamiento:** los modos son independientes — el alumno puede clickear en cualquier orden, y volver al estado intro deseleccionando.

**3 slides → 1 slide.** El slide de clickable-steps original se mantiene como base y absorbe la funcionalidad; los dos slides extra de animación (`s5-loop-infinite`, `s5-loop-drift`) se eliminan. Diferencia neta: -2 slides.

### C3 — §4 fill + números + rot

**Cambio:** §4.3 (fill animation) + §4.4 (tabla de números de tokens) + §4.6 (rot diagram) → 2 slides.

**Slide A — "El loop llena la ventana":**

```html
<section>
  <h2>El loop llena la ventana</h2>
  <div id="s4-fill-anim"></div>
  <!-- Anotaciones que aparecen sobre la barra al revelarse cada fragment -->
  <div class="s4-token-annotation fragment" data-threshold="20">300 líneas ≈ 1.5–2.5k tokens</div>
  <div class="s4-token-annotation fragment" data-threshold="60">20 archivos ≈ 30–50k tokens solo en observaciones</div>
  <div class="s4-token-annotation fragment" data-threshold="100">ventana útil ≈ 200k tokens</div>
</section>
```

`renderFill` se extiende mínimamente para aceptar un `fillPercent` opcional (default 60%, alineado al render actual). En cada `fragmentshown` se llama `updateFourLoop({ containerId: 's4-fill-anim', mode: 'fill', fillPercent: <data-threshold> })` y la barra crece animadamente vía CSS transition (no JS animation loop — solo cambio de altura con `transition: height 600ms ease`).

**Slide B — "Context rot":**

```html
<section>
  <h2>Context rot — cómo ocurre</h2>
  <div id="s4-fill-final"></div>  <!-- fill mode al 95%, estado final -->
  <div class="s4-rot-diagram">…</div>  <!-- diagrama de capas existente -->
</section>
```

La barra arranca llena (no animada — es el "estado de salida" del slide A) y debajo aparece el rot-diagram actual con sus capas. Sin animaciones nuevas en este slide; reusa el componente fill en estado fijo + el HTML/CSS existente del rot diagram.

**3 slides → 2 slides.**

### C4 — Tricotomía cross-section

**Cambio:** el visual de la tricotomía (siempre cargado / condicional / autocurado) aparece hoy en versiones parciales en §4.x (adelanto) y §8.x (2 filas), y completo en §9.x. Se elimina el slide de adelanto en §4 y la versión incompleta en §9 (que repite la de §8); el visual completo se renderiza con filas progresivamente reveladas via CSS.

**Estructura compartida:**

```html
<div class="tricotomia" data-rows-revealed="2">
  <div class="tricotomia-row" data-row="1">siempre cargado · CLAUDE.md · …</div>
  <div class="tricotomia-row" data-row="2">condicional · path-scoped rules · …</div>
  <div class="tricotomia-row" data-row="3">autocurado · auto memory · …</div>
</div>
```

CSS:

```css
.tricotomia-row { opacity: 1; transition: opacity 400ms ease; }
.tricotomia[data-rows-revealed="1"] .tricotomia-row[data-row="2"],
.tricotomia[data-rows-revealed="1"] .tricotomia-row[data-row="3"],
.tricotomia[data-rows-revealed="2"] .tricotomia-row[data-row="3"] {
  opacity: 0.15;
  pointer-events: none;
}
```

Las filas no-reveladas siguen ocupando espacio para que la tabla no salte de altura entre slides/secciones. Sin JS — solo CSS.

**Apariciones:**
- §8 cierre: `data-rows-revealed="2"` (cierra siempre + condicional).
- §9 cierre: `data-rows-revealed="3"` (completa con autocurado — el payoff).

El slide de adelanto en §4 se elimina (la mención conceptual queda en el speaker note de §4.x; el visual no se planta sino que aparece directamente en §8 con dos filas ya iluminadas).

**2 slides menos.**

### C5 — Tracker como componente JS

**Cambio:** cada sección de la Parte 2 (§7, §8, §9, §10, §11) abre hoy con un slide opener que tiene su propia implementación del visual "¿loop o contexto?". Se elimina ese slide opener; el tracker pasa a estar en el primer slide de contenido de cada sección como un header chico, montado vía el componente nuevo.

**Estructura por sección (ejemplo §7):**

```html
<section>
  <div class="s2-tracker-host">
    <div id="s7-tracker" data-target="contexto" data-sublabel="siempre cargado"></div>
  </div>
  <h2>CLAUDE.md jerárquico</h2>
  …
</section>
```

Script en el footer del scaffold:

```js
['s7','s8','s9','s10'].forEach(id => initTracker({
  containerId: id + '-tracker',
  target: 'contexto',
  sublabel: document.getElementById(id + '-tracker').dataset.sublabel,
}));
initTracker({ containerId: 's11-tracker', target: 'contexto', sublabel: '...' });
```

**§11 flip:** en el primer slide de §11 (que abre con tracker en `contexto`), un fragment con `data-flip-tracker="loop"` dispara:

```js
Reveal.on('fragmentshown', e => {
  if (e.fragment.dataset.flipTracker) {
    setTimeout(() =>
      updateTracker({ containerId: 's11-tracker', target: 'loop', sublabel: 'control del flujo', animateFlip: true }),
      200);
  }
});
```

El delay de 200ms y la transición de 800ms hacen que la flecha se vea moverse del lado contexto al lado loop — el "flip" que el spine describía como momento pedagógico explícito.

**5 slides openers menos.**

### C6 — Loop persistente en Parte 1

**Cambio:** la animación del loop aparece hoy en 11 montajes separados a lo largo de §2-§6. Cada montaje crea un nuevo DOM. Se reemplaza por un patrón "logically persistent": un único `<div id="part1-loop">` se incluye en cada slide donde aparece la animación, en la misma posición CSS, mismas dimensiones. Cada slide declara su modo/fase vía atributos.

**Estructura:**

Cada slide de §2-§6 que muestra la animación tiene:

```html
<section data-loop-mode="intro|tool|fill|infinite|drift|cc"
         data-loop-phase="pensar|actuar|observar|none">
  …
  <div class="part1-loop-host">
    <div id="part1-loop"></div>
  </div>
  …
</section>
```

**Init y orquestación** (script al final del scaffold):

```js
function syncPart1Loop() {
  const slide = Reveal.getCurrentSlide();
  const mode  = slide?.dataset.loopMode;
  const phase = slide?.dataset.loopPhase || 'none';
  const host  = document.getElementById('part1-loop');
  if (!mode || !host) {
    if (host) host.style.display = 'none';
    return;
  }
  host.style.display = '';
  if (!host.dataset.initialized) {
    initFourLoop({ containerId: 'part1-loop', mode, phase: phase === 'none' ? undefined : phase });
    host.dataset.initialized = 'true';
  } else {
    updateFourLoop({ containerId: 'part1-loop', mode, phase: phase === 'none' ? undefined : phase });
  }
}
Reveal.on('slidechanged', syncPart1Loop);
Reveal.on('ready', syncPart1Loop);
```

**Slides eliminados/colapsados:**
- §2.2 (loop intro slide) se mantiene pero pierde su animación dedicada — usa `part1-loop` con `data-loop-mode="intro"`.
- Las 3 fases de §2 (C1) ya usan el `part1-loop` host.
- §3 intro del loop tool (que repite el ciclo) se elimina; la animación del slide siguiente toma `data-loop-mode="tool"`.
- §6 (Claude Code es ese loop) ya planeaba reusar la animación con labels CC — usa `data-loop-mode="cc"`.

**6–8 slides menos.**

**Riesgo principal:** `part1-loop` es un singleton por slide. Si un slide tiene atributos mal puestos, no se actualiza correctamente. Mitigación: validación al cargar el deck — un script que recorre todos los `<section>` de §2-§6 y reporta a consola cualquier slide con `data-loop-mode` faltante o `mode` inválido.

## Orden de implementación

1. **Cambios base en `four-loop-anim.js`** (API `update`, render modes nuevos `hallucinate`, `poison`). Sin tocar slides todavía. Verificación: los slides actuales que usan `initFourLoop` siguen renderizando idénticos.
2. **C1 — §2 fases.** Valida la mecánica `updateFourLoop` + `fragmentshown` en un slide real.
3. **C2 — §5 modos.** Reusa la mecánica de C1; agrega los handlers de los chips a `clickable-steps.js` o al slide directamente.
4. **C3 — §4 fill + números + rot.** Toca la API de `renderFill` (parámetro `fillPercent`).
5. **C4 — tricotomía.** CSS-only. Bajo riesgo.
6. **C5 — tracker.** Componente nuevo. Verificación per-sección en browser.
7. **C6 — loop persistente Parte 1.** El último — depende de toda la API estable y de que los slides afectados estén ya en su forma final.

Commits separados por consolidación. Cada commit en estado verificado en browser (npm start + recorrer la sección afectada).

## Verificación

Cada consolidación tiene su propia checklist visual:

- **C1:** abrir §2 en browser; press abajo dos veces en el slide nuevo; verificar que h2, fase iluminada y card cambian sincronizadamente. Press arriba dos veces; verificar regreso al estado pensar sin glitches.
- **C2:** abrir §5; clickear cada uno de los 4 chips; verificar que la animación entra al modo correcto y el detalle aparece. Clickear el chip activo para deseleccionar; verificar retorno a intro.
- **C3:** abrir §4; press abajo en el slide A; verificar que la barra crece animadamente al cruzar cada umbral; verificar que los números aparecen sobre la barra en la posición correcta. Pasar al slide B; verificar que el rot diagram aparece con la barra ya llena.
- **C4:** abrir §8; verificar que la tricotomía muestra siempre + condicional, autocurado dimmed. Abrir §9; verificar que las tres filas están al máximo de opacidad.
- **C5:** abrir §7, §8, §9, §10 — verificar que el tracker aparece en cada sección con el sublabel correcto, target=contexto. Abrir §11; press abajo cuando corresponda; verificar que la flecha se desliza visiblemente del lado contexto al lado loop.
- **C6:** recorrer §2 → §3 → §4 → §5 → §6 slide por slide. Verificar que en cada slide donde corresponde aparecer la animación, aparece en la misma posición visual, sin parpadeo, en el modo declarado.

## Riesgos no mitigables sin implementación

- **Reveal `current-visible` interaction con sticky-style elements:** no garantizo que el `fragmentshown` listener dispare en el orden correcto cuando se vuelve atrás de un fragment con `fragmenthidden`. Mitigación: tests manuales de navegación arriba/abajo.
- **C5 tracker en print/PDF view:** si el deck se exporta a PDF, las transiciones animadas del flip no se ven. Aceptable: el deck no se exporta hoy, el target es presentación en vivo.
- **C6 `slidechanged` race en carga inicial:** si Reveal dispara `slidechanged` antes que el script de sync se registre, el primer slide del recorrido se renderiza sin loop. Mitigación: `Reveal.on('ready', syncPart1Loop)` como backup del init inicial.

## Texto que cambia visiblemente

El único contenido visible que se reescribe (no merge mecánico):

- §2.2 caption "La firma de la semana. Todo lo que sigue actúa sobre este ciclo." → "Todo lo que sigue actúa sobre este ciclo." (eliminar la referencia meta al curso, aplicando la regla de no-meta-references).

Todo el resto del texto visible y de speaker notes se reusa de los slides actuales — split, merge o move, pero no rewrite.
