# Qué es un plugin de Claude Code

## La definición, sin vueltas

Un plugin es un directorio autocontenido de componentes que extiende Claude Code con funcionalidad personalizada. Esa es la definición de la doc oficial, palabra por palabra, y conviene leerla despacio: *directorio autocontenido* (todo lo del plugin vive bajo una sola carpeta, sin paths que apunten afuera) y *componentes* (no una sola cosa, varias piezas conocidas que Claude Code ya sabe cargar).

Adentro de ese directorio puede haber skills, agents, hooks, MCP servers, LSP servers, monitors, themes y slash commands. Un plugin no está obligado a traer todos esos componentes. Puede ser sólo skills. Puede ser sólo un slash command. Puede ser un MCP server y nada más. Lo que lo convierte en plugin no es la cantidad de piezas que junta, sino el formato común que Claude Code reconoce y carga.

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

Para MCP y LSP, los archivos viven directo en la raíz del plugin: `.mcp.json` y `.lsp.json`. Si el plugin trae un binario, va en `bin/` y queda disponible como comando bare dentro del Bash tool mientras el plugin esté activo.

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

## Por qué empaquetar

Hay tres cosas que el formato plugin resuelve, y son exactamente los tres dolores que aparecieron antes.

El copy-paste manual deja de existir porque el layout está estandarizado. Vos ya no decidís dónde poner cada cosa. Claude Code sabe que las skills van en `skills/`, los agents en `agents/`, los hooks en `hooks/hooks.json`. El compañero que instala el plugin no tiene que enterarse de esa estructura: bastan con que esté.

La sincronización de versiones deja de ser un favor que se pide por mensaje. Si el `plugin.json` declara `"version": "2.1.0"`, ese string es la versión, y Claude Code la usa de cache key: cuando subís a `2.1.1`, el comando `/plugin update` ofrece la actualización; mientras no la bumpees, todos siguen en la `2.1.0` aunque pushees commits. Si preferís iterar más rápido y omitís el campo, Claude Code cae al commit SHA del repo como versión, y cada commit es tratado como release nuevo. Dos modos, los dos explícitos.

Los conflictos al actualizar dejan de ser un merge manual porque el plugin se actualiza con un comando. La estructura del directorio no es algo que el usuario haya tocado a mano: vino así. Cuando vos movés una skill o renombrás un slash command en tu repo, el cambio llega al compañero como cambio de versión, no como diff de archivos que tiene que aplicar él.

El cierre del trato: no tenés que pensar dónde poner cada cosa, porque el layout es estándar; no tenés que pensar cómo versionar, porque hay dos maneras y elegís una; no tenés que explicar cómo instalar, porque eso es un comando.

Lo único que falta es ese comando, y de dónde lo saca el compañero. Eso viene ya.

> Fuente canónica: https://code.claude.com/docs/en/plugins-reference
