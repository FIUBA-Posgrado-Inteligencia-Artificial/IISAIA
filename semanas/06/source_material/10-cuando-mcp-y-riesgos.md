# Cuándo MCP, cuándo no, y riesgos

## La pregunta cero

Antes de cualquier criterio fino, la pregunta que vimos en §8 va primero:

> **¿El host ya lo hace?**

Si el host trae la capacidad nativa, instalar el MCP duplica. Si no la trae, recién ahí vale evaluar si la conexión justifica el setup. El resto de los criterios de esta sección **asumen** que la capacidad no está en el host — son cómo decidís si vale la pena meterla por MCP.

## Cuándo conviene

Asumiendo que el host no lo hace, MCP brilla cuando se dan tres condiciones a la vez.

**Recurrencia.** La conexión se usa muchas veces. Si vas a leer Postgres una sola vez, copiar el resultado al prompt es más simple. Si vas a hacerlo en cada sesión, vale la pena el setup.

**Datos vivos o grandes.** La información cambia (logs, base de producción, página web actual) o es demasiado grande para pegar (un repo entero, miles de documentos). En ambos casos, mantenerla afuera y traer solo lo necesario funciona mejor que pegar todo.

**Reuso entre proyectos o entre clientes.** Si el server lo vas a usar en varios repos, o lo vas a llevar a otro host cuando cambies de IDE, MCP amortiza el esfuerzo. Conexiones one-off no.

## Cuándo no

**Cuando el host ya lo hace.** El caso obvio que la pregunta cero ya filtra. `filesystem` MCP en Claude Code, `git` MCP en CC, `fetch` MCP en CC. Si Read/Bash/Grep cubren el caso, el MCP solo agrega complejidad.

**Cosa de una vez.** Una query puntual, un archivo único, una página web que vas a leer una sola vez. Copiar y pegar es más rápido.

**Datos chicos y estáticos.** Si lo que necesitás pegar entra en el prompt sin esfuerzo y no cambia, no hay nada que ganar con MCP. La complejidad de setup es mayor que el beneficio.

**Cuando no tenés control del server.** Si no podés inspeccionar qué hace el server, qué versiones corre, qué dependencias usa, la complejidad de auditar puede ser mayor que reescribir la integración a mano.

## Los tres riesgos

Cada vez que conectás un MCP server, asumís tres riesgos. Vale tenerlos presentes.

**Supply chain.** El server es código que vos ejecutás en tu máquina. Si bajaste un server malicioso, corre con tus permisos. Es el mismo riesgo que cualquier dependencia que instalás con pip, npm o cargo, y se mitiga igual: usar autores que conocés, leer el código si es chico, fijar versiones.

**Permisos.** Un server con acceso a tu filesystem puede leer cualquier archivo al que vos llegues. Un server con tu token de GitHub puede actuar como vos. El host suele tener un sistema de confirmación, pero el espacio de "qué le dejás hacer al agente sin preguntar" se infla rápido. Calibralo en cada server.

**Observabilidad.** Si el server falla, devuelve datos raros o se comporta distinto entre ejecuciones, no siempre es obvio. La conversación con el agente sigue, pero las respuestas se desalinean con la realidad. Vale tener un mecanismo para ver, al menos, qué tools se llamaron y con qué parámetros.

## El modelo mental

Pensá un MCP server como una dependencia de tu entorno de desarrollo. Vale lo mismo que aplicás a cualquier librería que agregás a un proyecto. Cinco preguntas:

1. **¿El host ya lo hace?** Si sí, no lo instales.
2. **¿Quién es el autor?** Reputación, mantenimiento activo, fuente abierta o cerrada.
3. **¿Qué hace exactamente?** Tools y resources que expone; qué efectos puede causar.
4. **¿Qué le permito hacer?** Permisos que le das; alcance que limita.
5. **¿Cómo me entero si cambia?** Versioning, changelog, notificaciones del marketplace.

Si las cinco no te incomodan, conectalo. Si alguna te incomoda, no.

## Cierre

MCP no es la respuesta a todo. Es una pieza de infraestructura que vale la pena conocer porque vino para quedarse y porque te va a aparecer en cualquier IDE con agente que uses los próximos años. Saber qué es, qué resuelve, cómo está armado y dónde tener cuidado es lo que separa al que lo usa bien del que lo usa mal o no lo usa.
