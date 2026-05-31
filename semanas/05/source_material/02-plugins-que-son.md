# Qué es un plugin de Claude Code

## La definición, sin vueltas

Un plugin es un directorio autocontenido de componentes que extiende Claude Code con funcionalidad personalizada. Esa es la definición de la doc oficial, palabra por palabra, y conviene leerla despacio: *directorio autocontenido* (todo lo del plugin vive bajo una sola carpeta, sin paths que apunten afuera) y *componentes* (no una sola cosa, varias piezas conocidas que Claude Code ya sabe cargar).

Adentro de ese directorio puede haber skills, agents, hooks, monitors, themes y slash commands. Un plugin no está obligado a traer todos esos componentes. Puede ser sólo skills. Puede ser sólo un slash command. Puede ser sólo un set de hooks. Lo que lo convierte en plugin no es la cantidad de piezas que junta, sino el formato común que Claude Code reconoce y carga.

## La anatomía mínima

Adentro de la carpeta del plugin, el layout que importa al principio es éste:

```text
mi-plugin/
├── .claude-plugin/
│   └── plugin.json        # manifest opcional con metadata
├── skills/                # una carpeta por skill, con su SKILL.md
├── agents/                # sub-agents en archivos markdown
├── hooks/
│   └── hooks.json         # configuración de hooks
└── commands/              # slash commands como .md sueltos
```

Si el plugin trae un binario, va en `bin/` y queda disponible como comando bare dentro del Bash tool mientras el plugin esté activo.

El `plugin.json` es opcional. Si no lo ponés, Claude Code autodescubre componentes en las ubicaciones por defecto y deriva el nombre del plugin desde el nombre de la carpeta. Lo ponés cuando necesitás declarar metadata o apuntar a paths customizados. Un manifest mínimo se ve así:

```json
{
  "name": "mi-plugin",
  "version": "0.1.0",
  "description": "Un plugin de ejemplo",
  "author": { "name": "Equipo", "email": "equipo@ejemplo.com" }
}
```

De todos esos campos, el único realmente obligatorio es `name`. El resto suma metadata útil para que el plugin se encuentre y se versione, pero no es lo que lo hace cargar.

## Por qué este formato resuelve los tres dolores

Hay tres cosas que el formato plugin resuelve, y son exactamente los tres dolores que aparecieron antes.

El **descubrimiento** deja de ser una búsqueda a ciegas porque el formato habilita marketplaces: registros consultables donde el autor publica y vos buscás por nombre. No hace falta seguir blogs ni preguntar en Discord. Hay un lugar canónico al que Claude Code le pregunta "¿qué plugins están disponibles?" — eso lo vemos al detalle en la próxima sección.

La **bajada** deja de ser un puzzle nuevo cada vez porque el layout está estandarizado. No importa quién publicó el plugin: las skills siempre van en `skills/`, los agents en `agents/`, los hooks en `hooks/hooks.json`. Vos no decidís dónde se instala cada cosa porque ya está decidido. Claude Code sabe leer cualquier plugin que respete el formato, venga de Anthropic, de un equipo open source, o de un desarrollador independiente.

El **mantenimiento** deja de ser una foto inmóvil porque el plugin lleva versión explícita. Si el `plugin.json` declara `"version": "2.1.0"`, ese string es la versión que Claude Code conserva como cache key. Cuando el autor sube `2.1.1`, el comando `/plugin update` ofrece la actualización y vos sabés exactamente qué cambió. Si el autor prefiere iterar más rápido y omite el campo, Claude Code cae al commit SHA del repo como versión, y cada commit es tratado como release nuevo. Dos modos, los dos explícitos, los dos visibles para el que instala.

El cierre del trato: no tenés que adivinar qué existe, porque hay marketplaces; no tenés que aprender el layout de cada autor, porque el layout es uno solo; no tenés que rastrear cambios a mano, porque hay versión.

Lo único que falta saber es de dónde sale el comando que instala, y cómo se accede a esos marketplaces. Eso viene ya.

> Fuente canónica: https://code.claude.com/docs/en/plugins-reference
