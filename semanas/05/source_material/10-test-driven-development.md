# test-driven-development

## Qué hace

Fuerza el ciclo RED-GREEN-REFACTOR en cada feature o bugfix. RED: escribís un test que describe el comportamiento deseado y lo ves fallar. GREEN: escribís el mínimo código necesario para que ese test pase. REFACTOR: con los tests en verde, limpiás el código sin romper nada.

La regla de hierro: cualquier código de producción escrito antes de su test se borra y se reescribe siguiendo el ciclo. No se "adapta", no se "guarda como referencia" — se borra.

## Cuándo se activa

Durante la implementación de cualquier feature, bugfix, o cambio de comportamiento, antes de escribir código de producción. Si la tarea es "agregar un endpoint", la skill arranca con un test del endpoint. Si la tarea es "arreglar este bug", arranca con un test que reproduce el bug y falla por la razón correcta.

Las únicas excepciones (que requieren confirmación explícita) son prototipos descartables, código generado, y archivos de configuración.

## Por qué importa

Sin TDD, el agente escribe código que "parece" correcto y después arma tests que pasan al primer intento. Esos tests post-hoc validan lo que el código hace, no lo que vos querías que hiciera — pierden su valor como red de seguridad porque nunca los viste atrapar un bug.

Ver el RED primero te obliga a expresar la intención en forma ejecutable antes de saber el cómo. Es la única forma de tener confianza real de que el feature funciona sin que un humano lea cada línea. Vale en los dos modos de ejecución: con subagent-driven, y también en modo Native, donde TDD es el único control por tarea hasta la review final.

**Verde es toda la suite del proyecto** (desde v6.4): no alcanza con que pase el archivo de test de la tarea. Hay que correr el comando de tests del proyecto y reportar cada falla por nombre, incluso las que no causaste. En pruebas, cuando la tarea nombraba un solo archivo, el agente corría solo ese en 11 de 12 casos y un test roto al lado pasaba desapercibido. La referencia de la skill sobre cómo escribir buenos tests se llama ahora `writing-good-tests.md` (antes `testing-anti-patterns.md`).

## El punto crítico

Ver el test FALLAR antes de implementar. Si saltás el RED, no sabés si tu test efectivamente está testeando algo: puede tener un typo, puede estar testeando comportamiento que ya existe, puede pasar por la razón equivocada. Borrar y reescribir código escrito antes del test es disciplina, no perfeccionismo: el test post-hoc es una mentira útil que se siente productiva y deja bugs ocultos.

## Anti-patrones a evitar

- Escribir el código primero y "después agregar el test". El test resultante valida lo que el código hace, no la intención original; pierde su valor como red de seguridad y nunca probaste que efectivamente atrapa la regresión.
- Tests que pasan en RED. Si el test no falla cuando todavía no implementaste nada, no está testeando lo que decís que testea. Verlo fallar por la razón correcta (feature missing, no typo) es la garantía de que la lógica del test está bien.
- Tests que dependen de mocks de todo. Si toda la lógica real está mockeada, el test no falla cuando rompés la lógica real — no sirve como red de seguridad y sólo verifica que los mocks se llaman en el orden esperado.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/test-driven-development/SKILL.md`

## Caso real

Sesión auth0 sobre el tp-final: Task 1 fija el API existente (11 passed); Task 2 RED `ModuleNotFoundError: backend.auth` → 31 passed; Task 3 RED 2 failed → 33 passed; fix final RED 2 failed → 34 passed, 0 warnings (suite entera).
