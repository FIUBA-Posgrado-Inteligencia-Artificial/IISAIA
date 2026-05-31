# De piezas sueltas a paquetes

## No siempre tenés que escribirlo vos

En la clase pasada viste cómo se construyen las siete piezas del runtime de Claude Code: el `CLAUDE.md`, las rules, el `settings.json`, los permisos, las skills, los sub-agents, los slash commands. Sabés que podés escribir cada una de ellas para tu proyecto. La pregunta de hoy es la opuesta: ¿tenés que escribirlas siempre vos?

Hay gente que ya pasó por los mismos problemas y empaquetó su solución. Anthropic mantiene una colección oficial de skills y agents. Hay autores independientes y empresas que publican sets propios — alguien ya armó una skill para hacer un code review riguroso, otra para depurar bugs de forma sistemática, otra para mantener un changelog actualizado. Buena parte del trabajo que vas a hacer durante este curso y después no requiere que vos escribas la skill desde cero. Requiere que sepas encontrar la que ya existe.

## Las tres cosas que duelen sin formato común

Imaginate por un momento que el formato no existe — que cada autor publica su trabajo como mejor le pinta. Aparecen tres dolores predecibles.

El primero es el **descubrimiento**. Querés saber qué existe pero no sabés dónde buscar. ¿En GitHub? ¿En un blog? ¿En un Discord? Sin un lugar canónico, encontrar una skill útil termina dependiendo de que alguien te la haya recomendado.

El segundo es la **bajada**. Encontrás el repo del autor y ahora tenés que clonarlo, leer su README, copiar la carpeta `skills/foo/` a tu `~/.claude/skills/`, el slash command suelto a otro lado, las rules a otro. Cada autor organiza su trabajo distinto, así que cada vez es un puzzle nuevo.

El tercero es el **mantenimiento**. El autor arregla un bug y sube la fix a su repo. Vos no te enterás — tenés una foto que copiaste un día. Cuando algo te falla, no podés ni preguntarte "qué versión tengo", porque no hay versión: hay un set de archivos que viven en tu disco sin trazabilidad.

## La respuesta tiene nombre: plugin

Un plugin es el formato estándar que junta esas piezas en un paquete reconocible para Claude Code. El autor lo publica; vos lo encontrás en un marketplace; lo instalás con un comando; lo actualizás con otro. Una vez instalado, sus skills, sus agents y sus slash commands quedan disponibles igual que si los hubieras escrito vos.

Quizás estés pensando "y por qué no clono el repo y listo". Es una pregunta válida y la respondemos en serio en las próximas dos secciones, cuando veamos qué hay adentro de un plugin y cómo se distribuye.
