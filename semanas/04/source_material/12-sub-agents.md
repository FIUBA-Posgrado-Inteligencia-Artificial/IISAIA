# §12 — Sub-agents

## §1 Qué es

Un sub-agent es una instancia separada del mismo loop: mismo modelo, mismo ciclo de razonamiento, mismas herramientas disponibles — pero con su propia ventana de contexto, independiente de la del agente padre. Cuando el sub-agent termina su tarea, al padre le devuelve solo el resultado. No el razonamiento. No los archivos que leyó. No los pasos intermedios. El resultado y nada más.

No es "otra IA" ni "otro asistente diferente". Es la misma lógica de siempre — **LLM + loop + tools + entorno** — instanciada aparte, para una sub-tarea acotada, con una ventana propia que nace y muere con esa tarea.

## §2 Dónde viven

Los sub-agents se definen como archivos Markdown con frontmatter YAML. Hay dos ubicaciones posibles, más un tercer origen desde plugins:

| Ubicación | Alcance |
|-----------|---------|
| `.claude/agents/<nombre>.md` en el repo | Solo ese proyecto |
| `~/.claude/agents/<nombre>.md` | Todos los proyectos del usuario |
| Plugins instalados | Sub-agents built-in: `Explore`, `Plan`, etc. |

El sub-agent `researcher` del demo-repo vive en `.claude/agents/researcher.md` — es de alcance de proyecto, visible solo cuando Claude Code corre dentro de `semanas/04/demo-repo/`.

## §3 Cuándo se invocan

El supervisor (el agente padre) llama al tool `Agent` y le pasa el `subagent_type` — el nombre del sub-agent a instanciar. Desde ese momento, el sub-agent toma el control de esa sub-tarea: corre su propio loop, usa sus tools, produce un resultado, y se lo devuelve al padre.

Algunas skills lo hacen de forma automática. El sub-agent `Explore`, por ejemplo, se invoca implícitamente cuando Claude Code recibe preguntas exploratorias amplias: busca en el repo, lee archivos relevantes, sintetiza, y el padre recibe solo el resumen. El usuario no necesita pedirlo explícitamente.

## §4 Cómo se usa

Un sub-agent se define con un archivo Markdown cuyo frontmatter YAML declara tres campos clave:

```yaml
---
name: researcher
description: Use when the user asks where something is implemented, how a concept
  is wired across files, or any exploratory question that requires reading many files.
  Returns a concise answer; does not modify code.
tools:
  - Read
  - Grep
  - Glob
---
```

El campo `tools` es lo más importante para entender el aislamiento: el sub-agent **no hereda todas las tools del padre por default**. Solo puede usar las que se declaran explícitamente en su frontmatter. El `researcher` del demo-repo tiene acceso únicamente a `Read`, `Grep` y `Glob` — puede leer y buscar, pero no puede escribir archivos, ejecutar comandos ni llamar a APIs.

El campo `model` es opcional. Si se omite, usa el mismo modelo que el padre.

El cuerpo del archivo es el system prompt del sub-agent:

```
Sos un investigador de código de solo-lectura del demo-repo.

Cuando recibís una pregunta exploratoria ("¿dónde se maneja X?", "¿cómo se
conecta Y con Z?"), tu trabajo es:

1. Buscar con `Grep` y `Glob` los archivos relevantes.
2. Leer con `Read` los archivos necesarios para confirmar la respuesta.
3. Devolver una respuesta corta: dónde está, en qué función/línea, una frase de
   cómo se conecta con el resto.

No edites código. No corras comandos. No describas tu razonamiento — devolvé el
resultado directo.
```

El system prompt define el contrato: qué puede hacer, qué no puede hacer, en qué formato devuelve el resultado.

**Paralelización.** El padre puede emitir múltiples calls al tool `Agent` en una sola respuesta. Cuando lo hace, los sub-agents arrancan de forma concurrente: cada uno corre su loop de forma independiente, y el padre integra los resultados cuando todos terminan. Esto es útil cuando las sub-tareas son independientes — analizar autenticación, base de datos y capa de API en simultáneo sin que una búsqueda interfiera con la otra.

## §5 Casos límite y cosas que confunden

**"Un sub-agent es otra IA."** No. Es la misma lógica de loop, el mismo modelo, instanciada en un proceso separado con su propio contexto. La diferencia es de aislamiento, no de naturaleza.

**El padre recibe solo el resultado, no el razonamiento.** El sub-agent puede leer 50 archivos y generar mil tokens de razonamiento interno — todo eso vive en su ventana y desaparece cuando termina. Al padre llega un párrafo. Eso es lo que hace que el contexto del padre no crezca. Y también es lo que exige que el padre evalúe el resultado con criterio: la delegación no exime de supervisar. El trabajo cambia de leer cada paso a juzgar si el resumen es coherente con lo que se sabe del proyecto.

**La paralelización es el beneficio secundario.** Se menciona porque es real y útil, pero no es el motivo principal para usar sub-agents. El motivo principal es proteger el contexto del padre. Si la tarea exploratoria se hace en línea, todo lo que el agente lee para responder queda en la ventana. Con un sub-agent, ese ruido nunca llega.

**El sub-agent no tiene acceso a todas las tools por default.** Hay que declararlas explícitamente. Un sub-agent sin `Bash` en su lista no puede ejecutar comandos, aunque el padre pueda hacerlo. Esta restricción es intencional: define el alcance de lo que el sub-agent puede hacer y reduce el riesgo de que una tarea exploratoria produzca efectos secundarios.

## §6 Mini-demo en vivo

**Pregunta:** *"¿dónde se maneja la auth en este repo?"*

**Intro.** La misma pregunta, dos formas de resolverla. Después de cada una, ejecutamos `/context` para ver cuánto creció la ventana del padre.

---

**Beat 1 — Búsqueda inline, sin delegar.**

Abrí una sesión nueva de Claude Code dentro de `semanas/04/demo-repo/`. Pedí directamente: *"encontrá dónde se maneja la autenticación en todo el repo"*. Dejá que Claude trabaje: busca archivos, los abre, los lee, rastrea imports. Cuando termina, ejecutá `/context`.

Lo que muestra `/context` es el precio de la búsqueda inline: los archivos que el agente leyó para responder quedaron todos en la ventana. El delta respecto al inicio de sesión refleja el volumen de exploración.

---

**Beat 2 — La misma búsqueda delegada al sub-agent `researcher`.**

Nueva sesión. Esta vez: *"usando el sub-agent `researcher`, ¿dónde se maneja la auth en este repo?"*. El padre invoca el tool `Agent`, el sub-agent corre su loop con `Read`, `Grep` y `Glob`, y cuando termina le devuelve solo la respuesta. Ejecutá `/context`.

El número es significativamente menor. La exploración pasó — el sub-agent leyó los mismos archivos — pero todo ese trabajo vivió en su ventana. Al padre llegó un párrafo. El contexto del padre creció lo mínimo.

---

**Beat 3 — El archivo detrás del sub-agent.**

Abrí `.claude/agents/researcher.md`. Mostrá el frontmatter: `tools: [Read, Grep, Glob]`.

*"Este es el sub-agent. No es magia: es un archivo de configuración con un system prompt acotado. Tools restringidas a lectura, sin acceso a `Bash`. No puede modificar código aunque quiera."*

---

**Plan B.** Si el delta de `/context` no es dramático en vivo, o el sub-agent no produce el comportamiento esperado: cambiá a dos transcripts preparados — uno de sesión inline con contexto inflado al final, otro de sesión con sub-agent con contexto casi sin cambios y el resultado devuelto. El argumento se sostiene igual; la evidencia pasa de live a grabado. El cierre del Beat 3 (mostrar el archivo `researcher.md` con tools restringidos) funciona en ambos casos.

---

## Transición a §13

Los sub-agents aíslan el contexto: lo que el sub-agent explora y descarta nunca llega al padre. Es gestión de cuánto ruido entra en la ventana principal. En §13 vamos a ver Plan mode, que hace algo distinto: detiene el loop antes de actuar. No es gestión de contexto — es gestión de autonomía.

---

**Referencia:** Claude Code — Sub-agents. <https://code.claude.com/docs/en/sub-agents>
