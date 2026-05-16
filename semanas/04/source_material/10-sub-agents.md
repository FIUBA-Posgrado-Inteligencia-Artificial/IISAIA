# Sub-agents: aislar un loop entero

Las skills aíslan un procedimiento del contexto de la sesión. Hoy vamos a ver algo diferente: aislar el *loop completo* de una sub-tarea, para que el trabajo que ese loop acumula no llegue al contexto del agente principal.

Imaginá esta situación: le pedís a Claude Code que encuentre dónde se maneja la autenticación en un repo mediano. Para responder bien, el agente tiene que buscar en carpetas, leer archivos de configuración, rastrear imports, abrir módulos. Cuarenta archivos, fácil. Según §4, el contexto es finito y cada token que entra compite con los que ya están. Según §5, esa inundación de texto técnico hace que el modelo razone peor — envenenás la ventana con ruido que no tiene que ver con el trabajo que viene. ¿Qué pasaría si todo lo que el agente leyó para responder esa pregunta viviera en *otra* ventana, y al terminar te diera solo el resultado?

## Qué es un sub-agent

Un sub-agent es el mismo agente — el mismo modelo, el mismo tipo de loop — corriendo una sub-tarea con su propia ventana de contexto, separada de la del agente principal. Cuando termina, devuelve al padre solo el resultado: la respuesta, el archivo producido, el diagnóstico. No manda su contexto. No comparte lo que leyó en el camino.

No es "otro empleado" ni "otra IA". Es la misma lógica de siempre — **LLM + loop + tools + entorno** — pero instanciada aparte, para una tarea acotada, con una ventana propia que nace y muere con esa tarea.

## Por qué protege el contexto

Recordá la tesis de §4: gestionar el contexto es la habilidad central del trabajo con agentes. Cada token que entra ocupa espacio que no se recupera. Y en §5 vimos el modo de falla específico: el agente lee tanto que su propio contexto lo confunde — un log enorme, cuarenta archivos de autenticación, una traza de error que se repite veinte veces. Llamamos a eso envenenar el contexto.

El sub-agent corta ese camino de raíz. La sub-tarea puede leer cincuenta archivos, generar mil tokens de razonamiento interno, ejecutar diez llamadas a herramientas. Todo eso vive en su ventana. Cuando termina, esa ventana desaparece. Al agente padre llega un párrafo con el resultado. El contexto del padre creció lo mínimo.

Eso no es un detalle de implementación: es la única forma de hacer tareas exploratorias sin degradar al agente que tiene que seguir trabajando después.

## Paralelización

Hay un beneficio secundario que vale la pena nombrar. Porque cada sub-agent tiene su propia ventana, varios pueden correr al mismo tiempo sobre sub-tareas independientes. Si tenés que analizar autenticación, base de datos y capa de API por separado — y las tres búsquedas no se pisan entre sí — podés lanzarlas en paralelo. Cada una corre su loop, y cuando todas terminan el padre integra los resultados.

Es un beneficio real, pero es secundario. El motivo principal para usar sub-agents no es velocidad: es que el ruido de exploración no entre en el contexto del agente que tiene que pensar después.

## El costo

El padre no ve cómo el sub-agent llegó al resultado. Ve el resumen, no el razonamiento. Eso es exactamente lo que hace que el contexto no crezca — y también es lo que requiere que leas el resultado con el mismo criterio que §5 le pide al supervisor: no le creés a ciegas, leés la evidencia.

Si el sub-agent dice "la autenticación está en `auth/middleware.py` y usa JWT", tenés que poder decidir si ese resultado es coherente con lo que sabés del proyecto. El punto no es desconfiar siempre: es que la delegación no te exime de supervisar. El trabajo del padre es leer el resultado, evaluar si tiene sentido, y actuar sobre él — no asumirlo correcto porque lo generó un loop.

## Mini-demo en vivo: el sub-agent aísla

**Intro**

El objetivo de este demo es visible y medible: el comando `/context` en Claude Code muestra el tamaño actual del contexto de la sesión. Vamos a hacer la misma búsqueda exploratoria dos veces — una en línea, otra delegada a un sub-agent — y vamos a mirar el número.

---

**Beat 1 — Búsqueda inline (sin sub-agent)**

*Qué hago:* Abro una sesión nueva de Claude Code en un repo con algo de volumen. Pido directamente: *"encontrá dónde se maneja la autenticación en todo el repo"*. Dejo que el agente trabaje: busca archivos, los abre, los lee. Cuando termina, ejecuto `/context`.

*Qué digo:* *"Miren cuánto creció el contexto. Todo lo que leyó para responder quedó acá. Los archivos que abrió, los imports que rastreó, las líneas que descartó — todo sigue en la ventana. Ese es el precio de hacer la búsqueda en línea."*

*Qué mirar:* El número que muestra `/context` después de la búsqueda. Interesa el delta respecto al inicio de sesión, no el absoluto.

---

**Beat 2 — La misma búsqueda delegada a un sub-agent**

*Qué hago:* Abro una sesión nueva. Esta vez pido la misma tarea pero explícitamente delegada: *"usando un sub-agent, encontrá dónde se maneja la autenticación en todo el repo y devolveme solo el resultado"*. Dejo que el sub-agent corra su loop. Cuando el padre recibe el resultado, ejecuto `/context`.

*Qué digo:* *"Misma tarea. Pero lo que leyó vivió en otra ventana. Todo ese ruido — los cuarenta archivos, los imports, las líneas de código — no llegó acá. Acá solo volvió el resultado: el archivo, la línea, el método."*

*Qué mirar:* El número de `/context` en esta sesión es significativamente menor que en el Beat 1, aunque el resultado que recibimos es el mismo.

---

**Beat 3 — Cierre**

*Qué digo:* *"Mismo resultado, una fracción del costo de contexto. Eso es aislar. La exploración pasó, su ruido no entró. El agente principal sigue con una ventana limpia."*

---

**Plan B si comparar `/context` en vivo no coopera**

Si el delta no es lo suficientemente visible en tiempo real, o el demo de sub-agent no produce el comportamiento esperado, cambiá a dos transcripts preparados: uno de una sesión inline con búsqueda extensa (mostrando el contexto inflado al final) y otro de una sesión con sub-agent (mostrando el contexto casi sin cambios, seguido del resultado devuelto). Señalá los números en cada transcript. El argumento es el mismo; la fuente de evidencia cambia de live a grabado.

---

## Cierre

Los sub-agents aíslan el contexto entre loops: lo que el sub-agent explora y descarta nunca llega al padre. Es la misma lógica que vimos en §7 y §9 — actuar sobre el contexto para que el agente no se ahogue en ruido — pero aplicada a la unidad más grande: el loop entero.

Hasta acá, todas las herramientas que vimos actúan sobre *qué entra* al contexto o sobre *cómo se estructura*. En §11 vamos a ver una herramienta distinta: una que actúa sobre *cuánto deja actuar al agente antes de pedirle que se detenga y muestre el plan*. No es gestión de contexto — es gestión de autonomía.
