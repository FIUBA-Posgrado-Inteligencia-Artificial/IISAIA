# Discovery dinámico

## La pregunta de fondo

Hay algo que probablemente te quedó dando vueltas. Si el LLM aprende cosas durante el entrenamiento y se congela, ¿cómo es que puede usar un tool de un server que se publicó la semana pasada, mucho después de su cutoff date? El modelo nunca vio ese tool, no lo memorizó, no sabe que existe.

La respuesta es la pieza más elegante de MCP, y vive en dos mecanismos que conviene separar: la **capability negotiation** durante el initialize, y la **discovery** dinámica de primitives.

## El handshake — initialize y capability negotiation

Cuando el host arranca un server, lo primero que pasa es un `initialize` con **capability negotiation**. El cliente le dice al server "yo hablo el protocolo versión X y soporto estas capabilities" (por ejemplo, `elicitation`, `sampling`). El server responde "yo también hablo esa versión y soporto estas otras" (por ejemplo, `tools` con `listChanged: true`, `resources`, `prompts`).

MCP es un protocolo **stateful**: esa negociación queda registrada para el resto de la sesión. Cliente y server saben exactamente qué se pueden pedir mutuamente.

## El catálogo — discovery con `*/list`

Después del initialize, el cliente descubre **qué hay** con métodos `tools/list`, `resources/list`, `prompts/list`. La respuesta no es una lista pelada de nombres — es un catálogo con metadata: `name`, `title`, `description`, `inputSchema` para cada tool; URI y MIME type para cada resource; argumentos esperados para cada prompt.

Esa metadata se le pasa al LLM como parte del system context de la conversación. **El LLM, antes de razonar sobre tu pregunta, ya tiene en la mesa la descripción exacta de qué herramientas dispone.** La descripción que el server da de cada tool — su docstring, su schema — es lo que el modelo lee para decidir cuándo invocarlo.

Eso significa que **cualquier server nuevo, escrito hoy, es usable hoy**, sin reentrenar el modelo, sin actualizarlo, sin que el vendor del LLM tenga que enterarse. La integración funciona porque hay un protocolo común que dice "así te describís y así te invocan".

## Y si cambia en vivo — notifications

El catálogo no es estático. Cuando el server declaró `listChanged: true` en sus capabilities, puede mandar en cualquier momento una notificación tipo `notifications/tools/list_changed`. El cliente reacciona pidiendo de nuevo `tools/list` y actualiza el contexto del modelo en tiempo real.

Esto cubre casos como: un server que expone tools distintos según los `roots` que el cliente le pasó; un server con auth por scopes que agrega tools cuando el usuario amplía permisos; un server que cambia su catálogo según el estado de un proceso externo. La discovery es **dinámica**, no una foto inicial.

## La consecuencia práctica

El ecosistema de MCP crece sin coordinación central. Alguien escribe un server para SAP, alguien más para Shopify, alguien más para una API interna de su empresa. Todos quedan automáticamente disponibles para cualquier host MCP. No hay que esperar a que el vendor del LLM los "soporte"; los soporta por construcción.

Esta es la propiedad que hace que MCP sea infraestructura y no producto. Y es lo que prepara la próxima sección: si los servers se reusan en cualquier host, ¿qué significa eso para vos como ingeniero?
