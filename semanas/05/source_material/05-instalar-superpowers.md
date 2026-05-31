# Instalar Superpowers

Vamos a correr exactamente un comando para tener disponible todo el flujo que vimos en la sección anterior. El plugin ya está publicado en el marketplace oficial de Anthropic, así que no hace falta registrar nada antes.

## El comando

- **Qué hago:** abro Claude Code en una terminal limpia, sin proyecto abierto, para que la instalación sea global y no se mezcle con contexto previo.
- **Qué digo:** "Es un solo comando contra el marketplace oficial. El marketplace oficial viene pre-registrado, así que no hace falta `marketplace add` antes."
- **Qué tienen que mirar:** la línea de comando que voy a escribir.

```bash
/plugin install superpowers@claude-plugins-official
```

- **Qué digo mientras corre:** "Esto baja el plugin a `~/.claude/plugins/cache/claude-plugins-official/superpowers/` y registra todas sus skills. Cuando termine, el flujo de la sección anterior queda disponible inmediatamente. No hay que reiniciar Claude Code."

## Verificar que cargó

- **Qué hago:** ejecuto `/plugin list` para ver los plugins instalados.

```bash
/plugin list
```

- **Qué tienen que mirar:** `superpowers` aparece listado, con su versión y el marketplace `claude-plugins-official` al costado.
- **Qué digo:** "Estas catorce skills son las que vamos a recorrer en las próximas dos horas. La vista panorámica del flujo ya la hicimos en la sección anterior, así que arrancamos directo con la primera skill del happy-path: brainstorming."

## Plan B si no coopera

- **Si el marketplace está caído o el comando timeoutea:** muestro un screenshot pre-armado de antes/después de `/plugin list`, con Superpowers ya cargado, para que el resto de la clase pueda seguir el contenido. Aclaro que Superpowers también vive en un marketplace alternativo de la comunidad, mantenido por el autor original; el comando alternativo es:

  ```bash
  /plugin marketplace add obra/superpowers-marketplace
  /plugin install superpowers@superpowers-marketplace
  ```

  Lo muestro como segunda opción, no lo corremos en vivo.

- **Si la instalación termina sin errores pero las skills no figuran en `/plugin list`:** ejecuto `/reload-plugins` y vuelvo a listar. Es el procedimiento documentado en la doc oficial cuando el registro de skills queda colgado entre sesiones.
