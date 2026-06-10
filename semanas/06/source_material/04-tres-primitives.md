# Las tres primitives

## Qué expone un server

Un MCP Server expone tres primitives. Cada una tiene un nombre, una intuición y, sobre todo, **un dueño distinto de la iniciativa** — quién decide cuándo se usa. Esa diferencia es la que organiza todo.

## Tools — model-controlled

Un tool es una función que el server expone y que el **LLM** puede invocar activamente, sin que el usuario lo pida explícito. El server declara cada tool con un nombre, un title, una description y un `inputSchema` (JSON Schema con los parámetros). El cliente descubre tools con `tools/list` y los ejecuta con `tools/call`.

La palabra clave es **acción con efecto**. Los tools pueden cambiar el mundo: escribir un archivo, hacer un POST, ejecutar una query, abrir una página, mandar un mail. Por eso, aunque la iniciativa la tenga el modelo, los hosts suelen pedir confirmación del usuario antes de cada ejecución.

Ejemplos: `searchFlights(origin, destination, date)`, `createCalendarEvent(title, start, end)`, `sendEmail(to, subject, body)`.

## Resources — application-controlled

Un resource es una fuente de datos pasiva que el server expone para ser leída como contexto. Cada resource tiene una **URI única** (ej.: `file:///path/to/doc.md`) y declara su MIME type. Discovery con `resources/list`, lectura con `resources/read`.

La palabra clave es **lectura**. Los resources no tienen efecto: leerlos no cambia nada. Por eso la **aplicación** (el host) es la que decide cuándo y cómo cargarlos al contexto — automáticamente, por selección del usuario, por búsqueda con embeddings, lo que la app considere.

Hay dos formas:

- **Direct resources** — URIs fijas que apuntan a un recurso específico. Ejemplo: `calendar://events/2024`.
- **Resource templates** — URIs parametrizadas que la app expande en tiempo real. Ejemplo: `travel://activities/{city}/{category}`, que con `barcelona` y `museums` devuelve los museos de Barcelona.

## Prompts — user-controlled

Un prompt es un template reutilizable que el server expone para que el **usuario** lo invoque explícitamente. No se dispara solo: el usuario lo elige, completa sus parámetros, y el server devuelve un mensaje (o serie de mensajes) listo para mandar al LLM. Discovery con `prompts/list`, retrieval con `prompts/get`.

La palabra clave es **template**. Los prompts encapsulan workflows que el server quiere ofrecer "ya armados". Se exponen típicamente como slash commands o entradas de command palette en el host.

Ejemplos: `plan-vacation(destination, duration, budget)`, `explain-stack-trace(trace)`, `commit-message-from-diff(diff)`.

## Por qué la separación

La pregunta natural es: ¿no podrías hacer todo con tools? Sí, técnicamente. La separación existe porque **cada primitive tiene un dueño distinto de la iniciativa**:

- Los **tools** los decide invocar el **modelo** (model-controlled).
- Los **resources** los decide cargar la **aplicación / host** (application-controlled).
- Los **prompts** los decide invocar el **usuario** (user-controlled).

Esa diferencia de quién toma la decisión determina cómo se presentan en la UI, qué permisos requieren y qué garantías tienen. Mezclarlas borraría toda esa estructura.

## Y del otro lado

MCP también define primitives que el **cliente** expone hacia el server. Las nombramos para que sepas que existen; el detalle vive en la doc oficial:

- **Sampling** — el server le pide al cliente "pedile al LLM esto", sin tener que incluir un SDK de modelo propio. Habilita workflows agentic del lado del server.
- **Elicitation** — el server le pide al cliente "preguntale al usuario X dato" en medio de su ejecución (confirmación, preferencia, dato faltante).
- **Roots** — el cliente le declara al server "estos directorios son tu scope". Es coordinación, no enforcement de seguridad.
- **Logging** — el server manda mensajes de log al cliente para debugging y observabilidad.

La idea: la comunicación no es de una sola dirección. Server y cliente exponen primitives los dos, y eso es lo que permite construir interacciones más ricas que "el agente llama una función".
