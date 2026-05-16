# Plan mode y control del loop

Hasta acá, todas las herramientas que vimos en la parte 2 actuaron sobre el contexto: lo que entra, cómo se estructura, qué se preserva entre sesiones. Hoy la pregunta cambia. No es ¿qué entra al agente? Es ¿cuánto le dejás hacer antes de mirar?

Esa es la diferencia entre gestionar contexto y gestionar autonomía. Y es lo que separa esta clase de todo lo que vimos desde §6.

## Plan mode: pensar antes de actuar

El loop es **pensar → actuar → observar → repetir hasta una condición de corte**. En modo normal, el agente pasa de "pensar" a "actuar" sin pedirte permiso. Le diste la tarea, él eligió la primera acción, y cuando te diste cuenta ya tocó tres archivos.

Plan mode interrumpe eso antes de la primera acción. El agente construye un plan — qué va a hacer, en qué orden, qué herramientas va a usar — y te lo presenta. Vos lo aprobás, lo corregís o lo rechazás. Recién después ejecuta.

No es un resumen a posteriori. Es un alto deliberado entre el "pensar" y el "actuar", con espacio explícito para que el supervisor entre en el medio.

¿Por qué importa? Recordá §5: el modo de falla que llamamos deriva de objetivo. El agente empieza en A, la tarea es llegar a B, y a la décima iteración está en D. Cuando eso pasa después de que ya escribió archivos, el costo de corregirlo sube. Plan mode es la defensa más barata contra la deriva: si el plan muestra que el agente ya entiende mal la tarea antes de tocar nada, corregís ahí, antes de que el loop acumule consecuencias.

En términos del loop: plan mode actúa sobre cuándo se separan el "pensar" y el "actuar". Sin él, esas dos fases son continuas. Con él, hay una pausa donde el supervisor es parte del proceso.

## Permisos: gate antes de cada acción

Plan mode trabaja a nivel de la tarea completa. Los permisos trabajan a nivel de cada herramienta.

Antes de que el agente ejecute una herramienta que actúa sobre el mundo — escribe un archivo, corre un comando, llama a una API — el runtime puede pedirte confirmación. Un gate. Aprobás o cancelás esa acción específica.

Recordá la distinción de §3: leer vs. escribir. Una herramienta que solo lee es reversible: si el agente leyó un archivo que no debía, no pasó nada. Una herramienta que escribe o ejecuta no siempre es reversible. El gate importa ahí, en las acciones que dejan huella. En las que solo leen, el costo de una confirmación innecesaria supera el beneficio.

El sistema de permisos de Claude Code traduce eso a una configuración concreta: podés darle autonomía total, podés pedirle que pregunte antes de cada escritura, o podés pedirle que pregunte antes de cualquier acción fuera de un directorio específico. El criterio de fondo siempre es el mismo: ¿qué tan costoso es deshacer si se equivoca?

## El supervisor decide cuánta autonomía

No hay un nivel de autonomía correcto para todos los casos. Hay un criterio para elegirlo.

Si la tarea es acotada y reversible — refactorizar la lógica interna de un módulo, agregar tests, limpiar imports — más autonomía tiene sentido. Si el agente se equivoca, revertís y corregís. El costo es bajo.

Si la tarea tiene consecuencias persistentes, el cálculo cambia. Recordá lo de la semana pasada: el backend persiste. Un bug que escribe datos incorrectos los deja escritos, multiplicado por cada usuario que pasa por ahí. Cuando el agente trabaja sobre código que toca la base de datos, o sobre archivos de configuración de producción, o sobre cualquier cosa que no se deshace con `Ctrl+Z`, la conversación previa con tu propia supervisión se vuelve más valiosa que la velocidad.

En esos casos: plan mode antes de empezar, gate en cada escritura, lectura del plan antes de aprobar. No porque el agente vaya a fallar — puede que no falle. Sino porque el supervisor de §5 no evalúa al final; evalúa *cuándo mira*. Miran antes los supervisores que trabajan sobre terreno que no se deshace.

El nivel de autonomía es un dial que vos ajustás según la reversibilidad de la tarea. Esa es la formalización del rol de supervisor: no es solo leer la salida, es decidir cuándo entra al proceso.

## Más controles, al pasar

Dos herramientas más que actúan sobre el loop o el contexto, que vale la pena nombrar aunque no entren en el alcance de hoy.

**Hooks**: scripts de shell que el runtime ejecuta en eventos del ciclo de vida del agente — antes de una herramienta, después de una herramienta, al inicio o al cierre de sesión. La diferencia con `CLAUDE.md` es de naturaleza: `CLAUDE.md` es contexto, instrucciones que el modelo lee y puede ignorar en deriva. Un hook es ejecución real: si el hook bloquea la herramienta, la herramienta no corre, sin importar lo que el modelo haya decidido. Esto se ve en otra clase.

**MCP** (Model Context Protocol): un protocolo para conectar herramientas externas al agente — bases de datos, APIs, servicios propios — como si fueran tools nativas del loop. Actúa sobre qué puede hacer el agente, no sobre cuándo lo hace. También se ve en otra clase.

## El cierre de la parte 2: dos cosas, no quince

Durante la parte 2 vimos muchas herramientas. La tentación es memorizarlas como una lista de features. Pero si usaste bien la lente que propusimos en §6, ya ves algo diferente: dos cosas, y formas de actuar sobre cada una.

El **loop** es pensar → actuar → observar → repetir. El **contexto** es lo que el agente sabe mientras corre.

| Herramienta | Actúa sobre |
|---|---|
| `CLAUDE.md` jerárquico (§7) | Contexto — instrucciones que entran a la ventana |
| Rules y auto-memory (§8) | Contexto — qué se preserva entre sesiones |
| Skills y slash commands (§9) | Contexto — procedimientos reutilizables sin inundar |
| Sub-agents (§10) | Contexto — aísla el contexto de un loop entero para que el ruido no llegue al padre |
| Plan mode (§11) | Loop — separa "pensar" de "actuar" para que el supervisor entre en el medio |
| Permisos (§11) | Loop — gate antes de cada acción que actúa sobre el mundo |

No son features sueltas. Son decisiones sobre dónde y cómo entrás al proceso.

## Hacia §12: lo que falta

Hoy terminamos de armar el runtime. En la parte 1 entendiste el modelo — cómo piensa, cómo predice, qué significa que "razone". En las semanas 2 y 3 entendiste el rol — supervisor arquitectónico del frontend, supervisor arquitectónico del backend. En la parte 2 de hoy entendiste el runtime — el loop, el contexto, y las herramientas para actuar sobre cada uno.

Lo que falta no es otra herramienta. Es el "para qué". ¿Qué construís con todo esto? ¿Cómo articulás modelo + rol + runtime en un proyecto real, de principio a fin?

Eso es §12.

---

## Mini-demo en vivo: plan mode como freno

Este demo es de coreografía, no de concepto. El objetivo es ver el loop detenido deliberadamente, antes de tocar un archivo, con el supervisor entrando entre las dos fases.

**Preparación**: tener un repo de demo con algunos archivos Python con imports desordenados. Puede ser el mismo repo que usamos en semanas anteriores. La tarea va a ser "reorganizá los imports del proyecto".

---

**Beat 1 — Sin plan mode: el agente actúa**

*Qué hago:* Dar la tarea a Claude Code sin habilitar plan mode: `"reorganizá los imports del proyecto"`. Dejar que el agente arranque sin intervención.

*Qué digo:* *"Sin freno, arranca y hace lo que le parece. Miren dónde toca."*

*Qué mirar:* Las ediciones que aparecen en el workspace — archivos que el agente eligió modificar, el orden que eligió, decisiones que tal vez no eran las que querías. El punto no es que el resultado sea malo; es que el agente tomó todas esas decisiones antes de mostrártelas.

---

**Beat 2 — Con plan mode: propone primero**

*Qué hago:* Misma tarea, esta vez con plan mode habilitado. `"reorganizá los imports del proyecto"`.

*Qué digo:* *"Ahora propone primero. No tocó nada todavía."*

*Qué mirar:* El plan que presenta el agente — qué archivos piensa tocar, en qué orden, qué convención de imports va a aplicar. El workspace no cambió. Cero ediciones. El loop está detenido entre "pensar" y "actuar", esperando.

---

**Beat 3 — Corrección antes de aprobar**

*Qué hago:* Leer el plan en voz alta con el curso. Encontrar algo para corregir — por ejemplo, el agente quiere tocar también los archivos de tests, y nosotros solo queremos los módulos de negocio. Corregir el plan antes de aprobar.

*Qué digo:* *"Acá entro yo, entre pensar y actuar. Eso es controlar el loop."*

*Qué mirar:* El plan corregido ejecutándose acotado — solo los archivos que aprobamos, con la convención que pedimos. La diferencia respecto al Beat 1 no es solo el resultado: es que el supervisor estuvo en el proceso desde antes de la primera acción.

---

**Plan B si no coopera**

Si el Beat 1 produce un resultado limpio por azar — el agente reorganizó bien sin plan mode y el contraste no se ve — cambiá la tarea por algo con más superficie: `"reorganizá todos los archivos del proyecto por dominio, mové los tests a una carpeta separada y actualizá los imports"`. Mantenelo en el repo de demo para que sea reversible con `git checkout .`, pero la aparente destructividad hace visible la diferencia entre tener el plan antes y no tenerlo.

El argumento del demo no depende de que el agente falle: depende de que el supervisor haya estado o no en el proceso antes de que el loop actuara.
