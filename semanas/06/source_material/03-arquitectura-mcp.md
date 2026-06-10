# Arquitectura: host, cliente, servidor

## Los tres participantes

MCP usa una arquitectura cliente-servidor con tres participantes. Vale separarlos porque la palabra "cliente" se sobrecarga rápido.

**MCP Host** — la aplicación de IA con la que vos interactuás (Claude Code, Cursor, Visual Studio Code, Claude Desktop). Coordina y administra uno o más MCP Clients.

**MCP Client** — un componente adentro del host que mantiene una conexión con **un** MCP Server y obtiene contexto desde ese server para que el host lo use. La regla importante: **un cliente por cada server conectado**. Si el host está conectado a tres servers, corren tres clientes adentro del mismo host.

**MCP Server** — un programa que provee contexto a uno o más MCP Clients. Vive como un proceso aparte, escrito por quien lo publicó, y habla MCP de vuelta al cliente. Puede correr local (en tu máquina) o remoto (en otro servidor).

La separación importa porque vos no escribís hosts, casi nunca escribís clientes, pero sí podés escribir servers — y los servers se reusan en cualquier host.

## Las dos capas

MCP está dividido en dos capas que conviene separar mentalmente.

La **data layer** define el protocolo basado en JSON-RPC 2.0: la estructura de los mensajes, los métodos disponibles, las primitives, la lifecycle, las notificaciones. Es la capa interna — define **qué** se intercambia.

La **transport layer** define cómo viajan esos mensajes: el canal físico, el framing, la autenticación. Es la capa externa — define **por dónde** se intercambia.

La separación significa que el mismo set de mensajes JSON-RPC funciona idéntico sobre cualquier transporte. Vos no aprendés JSON-RPC para usar MCP; alcanza con saber que abajo hay un wire format estándar y que cualquier debugger te muestra los mensajes intactos.

## Los dos transports

MCP soporta dos transports.

**Stdio transport** — el server corre como un proceso local en la misma máquina que el host. Los mensajes viajan por la entrada y salida estándar. Es el modo "el server vive en tu máquina", típico para herramientas locales como filesystem, git o sqlite. Cero overhead de red.

**Streamable HTTP transport** — el server corre remoto y el host se conecta por red. Usa HTTP POST para mensajes cliente→server, con Server-Sent Events opcionales para streaming. Soporta autenticación HTTP estándar (bearer tokens, API keys, OAuth). Sirve cuando el server vive en un servicio compartido o lo hostea un tercero (servicios SaaS que exponen su API por MCP).

La regla simple: si la herramienta necesita acceso a tu disco o tu red local, Stdio. Si la herramienta vive en un servicio compartido, Streamable HTTP. La mayoría de los servers populares hoy son Stdio.

## El diagrama mental

Lo que tenés que poder dibujar mentalmente al terminar la sección: el host con varios clientes adentro (uno por server conectado), cada server como proceso aparte, y una flecha bidireccional de JSON-RPC entre cada par cliente-server. Ese es todo el aparato. Lo que se manda por esas flechas es lo que viene en las próximas dos secciones.
