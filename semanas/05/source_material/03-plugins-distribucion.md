# Cómo se distribuyen e instalan los plugins

El plugin existe en disco como folder. Cuando lo escribió otro autor, ese folder vive en su máquina o en su repo. ¿Cómo llega al tuyo? ¿Clonás el repo y copiás archivos a mano? Nada de eso. Llega por un comando, y ese comando depende de saber de qué registro se lo está bajando. Ese registro tiene nombre.

## Marketplaces

Un **marketplace** es un registro de plugins que Claude Code sabe consultar. Es el lugar al que el cliente le pregunta "¿qué plugins están disponibles, y dónde están?" cuando vos escribís un comando de install.

Hay dos tipos. Existe el oficial, `claude-plugins-official`, mantenido por Anthropic, que viene pre-registrado: no hace falta agregarlo, está disponible desde el momento en que abrís Claude Code. Y existen marketplaces comunitarios: cualquiera puede armar uno y publicarlo, típicamente como repo de GitHub. Para usar uno comunitario, primero lo registrás en tu cliente con un comando.

```text
/plugin marketplace add <usuario-github>/<repo-del-marketplace>
```

A partir de ese momento, los plugins de ese marketplace están disponibles para instalar igual que los del oficial.

La analogía corta, si ayuda: un marketplace es a Claude Code lo que npm es a Node, o lo que el extension store es a VS Code. Un registro central de paquetes con metadata estandarizada, consultable por nombre.

## Instalar, actualizar, desinstalar

Cuatro comandos cubren todo el ciclo de vida del plugin instalado.

```text
/plugin install <plugin>@<marketplace>
```

Ejemplo concreto: `/plugin install formatter@my-marketplace`. El `@<marketplace>` desambigua de qué registro lo estás sacando, importante cuando tenés varios marketplaces registrados.

```text
/plugin update <plugin>
```

Actualiza a la última versión disponible según la lógica del campo `version` que vimos en §02.

```text
/plugin uninstall <plugin>
```

Desinstala el plugin. Por default también borra su directorio de datos persistente; si querés conservarlo (por ejemplo, porque vas a reinstalar una versión nueva en seguida), agregás `--keep-data`.

```text
/plugin list
```

Lista lo que tenés instalado, con versión, marketplace de origen, y si está habilitado o no.

Un detalle que conviene tener presente: el **scope** de instalación. La doc define cuatro, pero alcanza con tener claros los tres que usás en la práctica. Por default, install va a *user*: el plugin queda registrado en `~/.claude/settings.json` y te sirve para todos tus proyectos. Si pasás `--scope project`, va a `.claude/settings.json` del repo en el que estás parado, queda versionado y se comparte con cualquiera que clone — útil para plugins de equipo. Si pasás `--scope local`, queda en `.claude/settings.local.json`, que está gitignored, para cosas que querés solo en tu copia del proyecto.

```text
/plugin install formatter@my-marketplace --scope project
```

Default user, opt-in a project cuando querés que el plugin viaje con el repo.

## Mini-demo en vivo: anatomía de un plugin instalado

Mostramos que la teoría de §02 efectivamente está en disco — el formato no es un PDF, es un folder real, igual al que dibujamos hace dos minutos.

- **Qué hago:** abro `~/.claude/plugins/cache/claude-plugins-official/` en VS Code (terminal: `code ~/.claude/plugins/cache/claude-plugins-official/`).
- **Qué digo:** "Esto es lo que Claude Code descargó cuando alguien corrió `/plugin install` contra el marketplace oficial. Es el folder estándar que vimos hace dos minutos: `.claude-plugin/` con su `plugin.json`, y al lado las carpetas de componentes."
- **Qué tienen que mirar:** el `plugin.json` arriba (o `.claude-plugin/plugin.json`), el folder `skills/` adentro, cada skill como subfolder con su `SKILL.md`. Abrir uno o dos `SKILL.md` para que vean que adentro hay prosa y frontmatter, no magia.
- **Plan B si no coopera:** screenshot pre-armado del file tree con anotaciones señalando manifest, `skills/`, y un `SKILL.md` individual.

Ya viste qué es un plugin y cómo se instala. Ahora instalamos uno que vale la pena conocer en serio.

> Fuente canónica: https://code.claude.com/docs/en/plugins-reference
