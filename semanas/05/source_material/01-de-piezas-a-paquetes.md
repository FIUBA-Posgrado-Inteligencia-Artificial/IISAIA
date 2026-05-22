# De piezas sueltas a paquetes

## Siete piezas y un problema sin resolver

Llegado este punto tenés siete piezas del runtime de Claude Code y las usaste todas: un `CLAUDE.md` con el mapa de tu repo, un par de archivos en `.claude/rules/` con tus reglas globales, un `settings.json` con permisos y hooks, dos o tres skills propias bajo `.claude/skills/`, un sub-agent para tareas que necesitan contexto aislado, plan mode cuando querés revisar antes de ejecutar, y los slash commands que armaste para vos.

En tu máquina funciona. La pregunta que queda colgada es otra: ¿cómo lo lleva tu compañero de equipo a la suya, con la misma versión, sin que tengas que pasarle archivos sueltos por Slack?

Y esa pregunta no es de instalación. Es de distribución.

## Las tres cosas que duelen sin envoltorio

Sin un formato que junte todo, lo primero que duele es el copy-paste manual. Le mandás tu carpeta `.claude/skills/mi-skill/` al compañero, él la pega en su `~/.claude/skills/`, después se acuerda de copiar también el slash command que la dispara, después la regla en `rules/` que la skill da por supuesta. Tres lugares distintos, ningún índice que diga qué va con qué.

Después duele la sincronización de versiones. Vos editaste `mi-skill/SKILL.md` hace unos días y arreglaste un bug. Tu compañero sigue con la versión vieja, no se entera. Cuando algo le falla, vos no podés ni preguntarle "¿qué versión tenés?" porque no hay versión: hay un archivo que copió una vez.

Y el tercero, el más doloroso, son los conflictos cuando uno actualiza. Querés cambiar el nombre de la skill, o moverla a otra carpeta, o cambiar qué slash command la dispara. En tu repo lo hacés en un commit. En la máquina del compañero hay que reproducir el cambio a mano, y si ya tocó algo, hay que mergear con los dedos.

## La respuesta tiene nombre: plugin

Un plugin es el envoltorio que junta esas piezas en una sola unidad: skills, rules, commands, hooks, agents, todo bajo un mismo directorio con un manifiesto que declara qué hay adentro. Se instala con un comando, se versiona como cualquier otro paquete, se actualiza igual.

Quizás estés pensando "y por qué no zip-eo todo y mando por mail". Es una pregunta válida y la respondemos en serio en las próximas dos secciones, cuando veamos qué hay adentro de un plugin y cómo se distribuye.
