# Actividad práctica: construir una bad UI con Canvas

Vas a construir un artefacto frontend en una sola página HTML, usando Canvas —de Gemini o de ChatGPT, la que prefieras— como tu herramienta. Es un trabajo individual. Arranca en clase, para que puedas sacarte las dudas conmigo delante, y se termina en casa.

La actividad no es solo construir algo. Es practicar cómo se dirige a un LLM cuando el que decide sos vos, y dejar registro escrito de cómo lo dirigiste.

## El tema: bad UI

Construir la peor versión posible de algo común: funcional, pero diseñada para frustrar al usuario. Un slider de volumen que es un laberinto, un botón "Aceptar" que escapa del cursor, un formulario que valida letra por letra. Es un género con su propia comunidad, r/badUIbattles, y ahí hay mil ejemplos para inspirarse.

El reto es doble y conviene tenerlo claro: que sea verdaderamente terrible, pero verdaderamente **funcional**. La interfaz puede frustrar al máximo; el código tiene que andar sin romperse. Si rompe, no cuenta como bad UI — cuenta como bug.

Por qué sirve como ejercicio: para hacer una mala interfaz a propósito hay que entender qué hace buena a una interfaz. Y para que la maldad funcione hay que dominar el ciclo evento-estado-DOM, porque un botón que escapa del cursor es exactamente eso: un evento que muta estado y redibuja el DOM.

## Lo que vas a practicar

Dos cosas al mismo tiempo.

Primero, aplicar los cuatro patrones de prompt vistos en clase, en orden y cuando corresponda: describir el artefacto, iterar sobre el estado, arreglar el layout, tematizar y pulir.

Segundo, sostener vos solo las cuatro tareas del ciclo de desarrollo asistido por IA. Ahí está la parte difícil de trabajar individualmente, y conviene decirla de frente.

## Las cuatro tareas del ciclo

Cuando construís software con un LLM hay cuatro tareas que tienen que pasar siempre, sin importar el tamaño del proyecto. Una al inicio y tres en loop hasta terminar.

```
Architect (descompone + primer prompt)
         │
         ▼
   ┌─────────────┐
   │   Prompt    │ ← escribe el siguiente pedido
   │     ↓       │
   │   Review    │ ← lee el output del LLM, marca problemas
   │     ↓       │
   │    Test     │ ← lo corre, lo rompe, reporta
   └──────┬──────┘
          │ (loop hasta terminar)
          ▼
   Se vuelve al Architect si cambia el alcance grande
```

**Architect** entra una sola vez al principio: descompone qué se va a construir y escribe el primer prompt con el Patrón 1 (*describir el artefacto*) — estructura, estilo, comportamiento y constraints, todo nombrado de una. Si a mitad de camino decidís cambiar el alcance grande, el Architect vuelve a entrar para re-especificar.

**Prompt** escribe los pedidos siguientes aplicando los Patrones 2, 3 y 4 según corresponda.

**Review** lee cada respuesta del LLM antes de aceptarla. Busca cuatro cosas: APIs alucinadas, lógica que no hace lo que pediste, dependencias externas escondidas (un `import` o un script de CDN que el constraint no permite) y regresiones en código que ya andaba.

**Test** corre el artefacto y lo rompe a propósito: clicks rápidos, inputs vacíos, valores extremos. No alcanza con probar el camino feliz.

Como trabajás solo, las cuatro son tuyas y las hacés en secuencia. Cambiar de tarea es cambiar de sombrero, y el sombrero más incómodo es el de Review: tenés que auditar en serio un prompt que escribiste vos treinta segundos antes. Si salteás esa tarea, el artefacto se desvía de manera predecible — y el desvío aparece recién cuando ya construiste tres cosas encima.

## Constraints

- Trabajo individual.
- Un solo archivo `index.html`. Sin build tools, sin archivos CSS/JS separados, sin dependencias externas.
- Una sola conversación de Canvas, en Gemini o en ChatGPT.

## Entregable

No se crea un repositorio nuevo. Va en el mismo repositorio del curso, en una carpeta `tp1/` con tres archivos:

- `index.html`: el artefacto funcional, listo para abrir con doble click.
- `prompts.md`: la secuencia de prompts usados, en orden, con una anotación breve por prompt explicando qué intentabas lograr.
- `README.md`: el informe de la entrega — qué te propusiste construir, qué decisiones tomaste vos en lugar de aceptar el default del modelo, y qué salió mal y cómo lo corregiste.

El `README.md` y el `prompts.md` siguen el template publicado en el repositorio de referencia del curso. Esa sección de decisiones propias es la que más pesa al corregir: si está vacía, quiere decir que aceptaste lo primero que salió.

No hay presentación en clase. La entrega es el repositorio.
