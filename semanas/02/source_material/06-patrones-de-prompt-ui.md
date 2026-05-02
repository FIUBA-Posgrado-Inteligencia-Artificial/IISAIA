# Cuatro patrones de prompt para construir UI con IA

Llegamos al payoff de la clase. Todo el vocabulario de los archivos anteriores existe para que estos cuatro patrones te salgan naturales. Cada patrón cubre uno de los modos de trabajo más comunes cuando construís UI con una IA.

## El cambio de mentalidad

No estás escribiendo código, estás *encargando* código. Eso es distinto a pedirle a un compañero que te ayude: un compañero adivina, completa, te pregunta si quisiste decir otra cosa. La IA no. La IA hace exactamente lo que decís, y por eso la calidad de tu pedido es el techo de la calidad del resultado.

Un **patrón de prompt** es una plantilla reusable que ya tiene el vocabulario correcto incrustado. Lo completás con los detalles del caso y largás. Cuatro patrones cubren alrededor del 80% del trabajo cuando construís UI: arrancar de cero un **artefacto** nuevo, evolucionar su comportamiento agregando estado, arreglar un visual mal acomodado, y polir la identidad final con tokens. En ese orden, también, suele caer el flujo natural de un proyecto chico.

## Patrón 1 — Describir el artefacto

### Cuándo usarlo

Es el primer prompt de un proyecto nuevo. La IA no tiene contexto; vos se lo das. Acá nombrás todo de una sola vez: estructura semántica, estilo, comportamiento básico y constraints del entorno. Si este prompt sale bien, los siguientes son ajustes; si sale mal, vas a pelear con una base que no querías.

### Plantilla

```
Construí un [tipo de artefacto].
Estructura: [secciones HTML, jerarquía].
Estilo: [tono, paleta, tipografía].
Comportamiento: [estados, eventos clave].
Constraints: un solo archivo HTML, vanilla JS, sin dependencias externas.
```

### Ejemplo trabajado

> "Construí un Pomodoro timer. Estructura: `<header>` con título 'Pomodoro' y `<button>` de modo (estudio/descanso); `<main>` con un círculo grande mostrando tiempo restante en mm:ss y debajo `<button>` Iniciar/Pausar/Reiniciar; `<footer>` con contador de pomodoros completados. Estilo: minimalista, dark mode, sans-serif grande para el tiempo, paleta `#0f172a` fondo / `#e2e8f0` texto / `#6366f1` acento. Comportamiento: estado `mode` (estudio = 25 min, descanso = 5 min), estado `secondsLeft`, estado `isRunning`. Al terminar el contador suena un beep y cambia automáticamente al otro modo. Constraints: un archivo HTML, vanilla JS, sin dependencias."

Notá la densidad de vocabulario. En cinco líneas ya nombraste estructura semántica, paleta hexadecimal, tres piezas de **estado** y los constraints de empaque. La IA tiene todo lo que necesita para acertar al primer intento.

## Patrón 2 — Iterar sobre el estado

### Cuándo usarlo

Ya tenés un artefacto andando y querés agregarle un nuevo comportamiento: una pausa, un historial, un toggle. Este patrón te obliga a pensar la feature en términos de **estado** (callback al archivo 04): qué dato nuevo aparece, qué transiciones lo modifican, qué cambia en el DOM.

### Plantilla

```
Agregale al [artefacto] un estado [nombre] que [describe la transición].
Cuando [condición]: [efecto en estado] y [efecto en DOM].
Cuando [condición de retorno]: [restablecer].
```

### Ejemplo trabajado

> "Agregale al Pomodoro un estado `isPaused` (boolean). Cuando se hace click en Pausar: `isPaused = true`, el cronómetro deja de descender, el `<button>` cambia a 'Reanudar' y el círculo se vuelve gris. Cuando se hace click en Reanudar: `isPaused = false`, el contador continúa desde donde estaba, el círculo vuelve al color normal."

El prompt es corto pero deja claras las dos direcciones de la transición. Si solo describís la ida ("cuando se pausa, parar el contador"), la IA adivina cómo se sale de ese estado, y suele inventar mal. Nombrar la vuelta es la mitad del valor del patrón.

## Patrón 3 — Arreglar el layout

### Cuándo usarlo

La página funciona, los datos se actualizan, los clicks responden, pero el visual está mal acomodado. Algo está pegado al borde, dos elementos quedan apilados cuando debían estar al lado, las cajas no respiran. Este es el momento de invocar las primitivas de **layout** (callback al archivo 03): flex, grid, gap, alineación.

### Plantilla

```
El [contenedor] está mal acomodado.
Hacelo un [flex container | grid] con [parámetros].
[Notas de espaciado y alineación].
```

### Ejemplo trabajado

> "El `<header>` está mal acomodado. Hacelo un flex container con `justify-content: space-between` para que el título quede a la izquierda y el `<button>` de modo a la derecha, ambos centrados verticalmente con `align-items: center`. Agregale 16px de padding horizontal."

Cero ambigüedad. Nombraste el contenedor, el modelo de layout, las propiedades exactas y el espaciado en unidades concretas. La IA no tiene cómo improvisar con `inline-block` o márgenes raros, porque ya le dijiste qué herramienta usar.

## Patrón 4 — Tematizar y pulir

### Cuándo usarlo

El artefacto funciona y querés darle una identidad visual cohesiva. Es el momento del **theming**: extraer todos los colores, espacios y radios dispersos en el archivo y centralizarlos en un solo lugar, listo para cambiar la paleta entera tocando una línea. La herramienta para esto es la **CSS variable** (callback al archivo 03).

### Plantilla

```
Convertí el styling para que use variables CSS.
Definí en :root: --[token]: [valor]. (repetir para cada token)
Reemplazá todos los valores hardcodeados por estas variables.
```

### Ejemplo trabajado

> "Convertí el styling del Pomodoro para que use variables CSS. Definí en `:root`: `--color-bg: #0f172a`, `--color-text: #e2e8f0`, `--color-accent: #6366f1`, `--color-muted: #94a3b8`, `--space-md: 16px`, `--space-lg: 24px`, `--radius: 12px`, `--font-display: 'Inter', sans-serif`. Reemplazá todos los valores hardcodeados por estas variables. Asegurate que el contraste entre `--color-bg` y `--color-text` sea AA-accesible."

El cierre con la nota de accesibilidad es deliberado: un prompt de tematizado es la oportunidad natural para auditar contraste. La IA obedece el pedido y, de paso, te marca si alguna combinación quedó por debajo del estándar.

## Demo en vivo (referencia)

En clase voy a tomar un pedido chiquito ("hacé un dice roller") y voy a aplicar los cuatro patrones en orden, en la misma conversación con el LLM. Esta sección es para que después puedas volver y seguir el guion solo, prompt por prompt. Los cuatro están listos para copiar.

**Prompt 1 (Patrón 1 — Describir el artefacto):**

> "Construí un dice roller. Estructura: `<header>` con `<h1>` 'Dice Roller'; `<main>` con un `<section>` que muestra el resultado en un cuadrado grande, debajo dos `<button>` ('Tirar' y 'Reset'); `<footer>` con historial de últimas 5 tiradas. Estilo: dark mode, fondo `#0f172a`, texto `#e2e8f0`, acento `#6366f1`, sans-serif. El número del resultado en 4rem. Comportamiento: estado `result` (número 1-6, inicial 1). Al click en Tirar, random 1-6 y actualizar `result`. Al click en Reset, volver a 1. Constraints: un archivo HTML, vanilla JS, sin dependencias."

**Prompt 2 (Patrón 2 — Iterar sobre el estado):**

> "Agregale al dice roller un estado `history` (array). Cada vez que se hace click en Tirar, además de actualizar `result`, agregá el resultado al array. Mostrá las últimas 5 tiradas en el footer como una lista horizontal separadas por comas. Al hacer click en Reset, vaciá `history` también."

**Prompt 3 (Patrón 3 — Arreglar el layout):**

> "El `<header>` está mal acomodado. Hacelo un flex container con `justify-content: space-between` y `align-items: center`, padding `16px` horizontal. El `<main>` necesita estar centrado: convertilo en flex container con `flex-direction: column`, `align-items: center`, `gap: 24px`."

**Prompt 4 (Patrón 4 — Tematizar y pulir):**

> "Convertí todo el styling para que use variables CSS. Definí en `:root`: `--color-bg: #0f172a`, `--color-text: #e2e8f0`, `--color-accent: #6366f1`, `--color-muted: #94a3b8`, `--space-md: 16px`, `--space-lg: 24px`, `--radius: 12px`, `--font-display: -apple-system, BlinkMacSystemFont, sans-serif`. Reemplazá todos los valores hardcoded por las variables correspondientes."

Cuatro prompts, un artefacto funcional al final, todo el vocabulario de la clase aplicado en orden. Lo importante no es memorizar los prompts: es reconocer el patrón debajo de cada uno y poder adaptarlos a cualquier artefacto que se te ocurra esta tarde.
