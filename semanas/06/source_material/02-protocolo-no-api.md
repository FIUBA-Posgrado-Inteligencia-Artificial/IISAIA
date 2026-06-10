# Protocolo, no API

## La trampa N×M

Imaginate por un momento que cada herramienta de IA armó su propia forma de conectarse al mundo exterior. Claude Code define su API de extensiones. Cursor define otra. Codex CLI define otra. Cline define otra. Cada cliente, su propio formato.

Ahora del otro lado tenés los proveedores de capacidades. Alguien empaqueta "controlá Playwright". Otro empaqueta "leé Postgres". Otro empaqueta "buscá en GitHub". Cada uno de estos proveedores tiene que escribir una integración por cada cliente que quiera soportar.

El número total de integraciones que el ecosistema tiene que mantener es N×M: N clientes, M capacidades, todas las combinaciones. Si aparece un cliente nuevo, M integraciones nuevas. Si aparece una capacidad nueva, N integraciones nuevas. Insostenible.

## La idea del protocolo

El truco para colapsar N×M a N+M es definir un protocolo común. Un formato que tanto los clientes como los proveedores acuerdan hablar. El cliente sabe hablar el protocolo; el proveedor sabe hablar el protocolo; cualquier combinación funciona.

Con un protocolo, el ecosistema mantiene N implementaciones de cliente y M implementaciones de proveedor, y todas las combinaciones funcionan sin trabajo extra. Cliente nuevo: una sola implementación, hereda todas las capacidades existentes. Capacidad nueva: una sola implementación, queda disponible en todos los clientes existentes.

## Los precedentes

Este patrón no es nuevo y vale la pena ubicarlo donde lo viste antes.

**HTTP** es el protocolo común entre browsers y servers. Por eso cualquier browser habla con cualquier server, sin coordinación entre los autores de ambos lados.

**LSP (Language Server Protocol)** resolvió el mismo problema en el mundo de IDEs. Antes de LSP, cada IDE (VS Code, Vim, Emacs, Sublime) implementaba el autocompletado para cada lenguaje (Python, Go, Rust, TypeScript) a mano. N×M. Después de LSP, cada lenguaje publica un *language server* y cada IDE lo consume. N+M.

## MCP

Model Context Protocol es exactamente eso para agentes de IA. La doc oficial lo define como **"un estándar open-source para conectar aplicaciones de IA a sistemas externos"** — fijate que la definición ni siquiera nombra al vendor que lo propuso. Lo propuso Anthropic en 2024 y rápidamente lo adoptaron Claude, ChatGPT, Visual Studio Code, Cursor, Cline, Codex CLI, Aider, Gemini CLI y otros.

La doc también propone una analogía más corta que las dos anteriores: **MCP es como un puerto USB-C para aplicaciones de IA**. Así como USB-C estandariza la forma de conectar dispositivos electrónicos, MCP estandariza la forma en que las aplicaciones de IA se conectan a sistemas externos.

Que sea un protocolo es lo que hace que este conocimiento te viaje. Las próximas secciones desarman cómo está armado por dentro.
