# Skills y slash commands

§8 cerró con una pregunta implícita: ¿puede el contexto condicional ir más lejos? Una path-scoped rule entra cuando tocás ciertos archivos. Pero hay algo que no matchea ningún path de archivo: un procedimiento completo — cómo se genera un slide, cómo se toma una transcripción y se convierte en material de clase, cómo se audita que un PR esté listo para mergear. Para eso existen las skills.

## Skills: procedimientos on-demand

Una skill empaqueta un flujo de trabajo repetible. No es una instrucción suelta ni una preferencia de estilo: es una capacidad completa, con fases, verificaciones y anti-patterns definidos. La diferencia respecto a lo que vimos en §8 es conceptual antes que técnica: una path-scoped rule lleva instrucciones que se activan por contexto de archivo; una skill lleva un *procedimiento* que se activa por invocación o por relevancia de tarea.

El punto que más importa en términos de contexto: **una skill no está cargada al arranque**. Hasta que la invocás — o hasta que Claude determina que la tarea la requiere — no existe para esa sesión. No cuesta un solo token. La ventana de contexto no la conoce. Eso no es una limitación: es exactamente el diseño.

Lo que no usás, no pagás.

Este repositorio tiene sus propias skills instaladas en `tools/skills/`. La más concreta para este curso es `tools/skills/slide-generation/`. Mirala: es la skill que genera las clases que estás viendo ahora mismo.

Su `SKILL.md` la describe con precisión. La skill envuelve el pipeline completo de superpowers — brainstorming → writing-plans → executing-plans → verification → finishing-branch — y lo adapta a la tarea específica de convertir `semanas/NN/source_material/` en `semanas/NN/slides/index.html`. Tiene cuatro fases explícitas: Spine (el esqueleto didáctico), Plan (las tareas de implementación), Execute (escribir los slides sección por sección con checklists de revisión) y Verify/Finish. Incluye un checkpoint duro: no se genera HTML sin que el usuario revise y apruebe el `spine.md`. Y lista explícitamente los anti-patterns — qué no hacer, qué no saltear, qué no inventar.

Eso no es un prompt largo. Es una skill: un objeto de conocimiento sobre cómo ejecutar este trabajo, que entra al contexto cuando se necesita y no antes.

El repo también tiene `tools/skills/yt-transcript-to-md/`, que hace otra cosa completamente: toma una transcripción de YouTube y la convierte en material estructurado de clase. Dos procedimientos distintos, dos skills distintas, ninguna cargando tokens cuando la otra está en uso.

## Slash commands: atajos

Los slash commands son otra cosa. Un slash command — `/nombre` — es un atajo para una acción frecuente. Puede lanzar un prompt, ejecutar un conjunto de instrucciones, o invocar una skill. La distinción es importante:

- Una **skill** es una capacidad o procedimiento definido.
- Un **slash command** es un disparador, un acceso directo.

Algunos slash commands invocan skills; otros no. El mismo mecanismo sirve para cosas mucho más simples — `/memory` para ver qué tiene cargado Claude, `/context` para inspeccionar el estado de la sesión — sin que ninguna skill esté involucrada.

Este repo tiene un ejemplo concreto: `.claude/commands/build-class.md`. Es el comando `/build-class`, y es literalmente cómo se construyeron estas presentaciones. Su contenido es mínimo:

> "El usuario quiere construir slides para la semana actual. El directorio de trabajo debe ser `semanas/NN/`. Invocá la skill `slide-generation`."

Eso es todo. El slash command no sabe nada de fases, ni de spine, ni de checklists. Solo sabe que tiene que invocar la skill. El procedimiento completo vive en la skill. La separación no es cosmética: si mañana cambia el pipeline de generación de slides, actualizás la skill — no el comando.

## La distinción que ordena todo

Tenemos tres mecanismos. La pregunta que los ordena es siempre la misma: ¿cuándo paga contexto?

| Mecanismo | Cuándo entra al contexto |
|---|---|
| **CLAUDE.md** (siempre cargado) | Al arranque de cada sesión, sin excepción |
| **Path-scoped rule** (condicional) | Cuando Claude toca un archivo que matchea el glob |
| **Skill** (condicional por invocación) | Cuando se invoca o cuando la tarea la requiere |

Esta tabla es la tricotomía de §8 completa. CLAUDE.md cubre lo que siempre aplica. Las path-scoped rules cubren lo que aplica a ciertas áreas del codebase. Las skills cubren lo que aplica a ciertos *tipos de tarea*, independientemente del archivo que se esté tocando.

La skill cae en la categoría **condicional** de §8, pero con un trigger distinto al de las path-scoped rules. Una path-scoped rule se activa por coincidencia de archivo. Una skill se activa por relevancia de procedimiento. El resultado en términos de contexto es el mismo: costo cero hasta que hace falta, y exactamente cuando hace falta.

Esto no es taxonomía por el gusto de taxonomizar. Es operacional. Si metés en CLAUDE.md un procedimiento largo que solo aplica cuando generás slides, pagás ese contexto en cada sesión de debugging, de refactor, de revisión de PR. Si lo ponés en una skill, ese costo no existe hasta el momento exacto en que alguien escribe `/build-class`.

## Mini-demo en vivo: la skill on-demand

Este demo (D6) tiene un objetivo claro: ver que una skill cuesta cero contexto hasta el momento preciso en que se usa. El movimiento tiene que ser visible — antes y después.

**Intro para el aula:** Hay una skill instalada en este repo. No está en el contexto. No existe, para esta sesión, hasta que la pidamos. Vamos a ver exactamente cuándo aparece.

---

**Beat 1 — La skill existe, pero la sesión no la conoce**

*Qué hago:* Abrir una sesión nueva en el directorio del repo. Ejecutar `/context` (o `/memory`) para mostrar qué está cargado.

*Qué digo:* *"Tengo una skill instalada. No está en el contexto. No existe, para esta sesión, todavía."*

*Qué mirar:* La skill `slide-generation` no aparece en la lista de fuentes de instrucción cargadas. Solo están CLAUDE.md y las reglas activas.

---

**Beat 2 — Invocar la skill**

*Qué hago:* Escribir `/build-class` o pedirle a Claude explícitamente que genere slides para la semana actual. La skill `slide-generation` entra al contexto en el momento de la invocación.

*Qué digo:* *"Ahora la pedí. Recién ahora paga su lugar."*

*Qué mirar:* La skill aparece referenciada en la sesión. Si `/context` muestra fuentes de instrucción, debería listar `slide-generation`. Si no muestra ese detalle, el indicador es el comportamiento: Claude empieza a ejecutar las fases de la skill — pregunta por el spine, carga `_config/slide-conventions.md`, sigue el pipeline — cosas que no haría sin la skill presente.

---

**Beat 3 — Cierre con el mapa completo**

*Qué digo:* *"Una rule entra cuando tocás cierto archivo. Una skill, cuando la pedís. CLAUDE.md, siempre. Tres formas de actuar sobre el contexto."*

Ese mapa es la tricotomía de §8, ahora completa con el tercer mecanismo.

---

**Plan B si `/context` no da el detalle:** Si el comando no muestra la lista de fuentes con suficiente granularidad para ver el cambio, demostrarlo por comportamiento usando una skill del repo (`tools/skills/`). Abrir una sesión sin invocar nada y pedirle a Claude que revise un archivo cualquiera del proyecto — no debería ejecutar ninguna fase de slide-generation ni pedir spine. Luego invocar `/build-class` y mostrar que ahora sí ejecuta las fases del pipeline, hace el checkpoint de spine, carga las convenciones. La presencia de la skill se demuestra por su efecto, no por la lista de fuentes.

---

## Cierre

Las skills aíslan un *procedimiento* del resto del contexto. No instrucciones dispersas, sino un objeto de conocimiento completo sobre cómo hacer algo, que no existe para la sesión hasta que se necesita.

En §10 vamos a ver algo distinto: no un procedimiento aislado del contexto, sino un *loop completo* corriendo separado del loop principal. Los sub-agentes no solo protegen contexto: ejecutan trabajo en paralelo, en su propia ventana, y devuelven resultados al supervisor. Es la misma lógica que venimos viendo — aislar del contexto lo que no se necesita ahora — pero aplicada a la unidad más grande: el agente mismo.
