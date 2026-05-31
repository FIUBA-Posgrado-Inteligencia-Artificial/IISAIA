# verification-before-completion

## Qué hace

Antes de afirmar que algo está listo, arreglado o pasa, esta skill obliga a correr los verification commands del plan y a citar el output en la misma afirmación de éxito. No alcanza con que el código compile ni con que "los cambios parezcan razonables": hay que ejecutar el comando, leer la salida y pegarla.

Bloquea claims sin evidencia. No podés decir "los tests pasan" sin mostrar la salida de `pytest`. No podés decir "el feature anda" sin haberlo corrido end-to-end y mostrar el resultado. La regla es simple: si no corriste el comando en este turno, no podés afirmar que pasa.

## Cuándo se activa

Justo antes de claimar completion. Antes de commitear como "feature listo", antes de abrir el PR, antes de cerrar la tarea, antes de decirle al usuario "ya está". También antes de pedir `requesting-code-review`, para que quien revise arranque sobre código que ya pasó los chequeos básicos del plan.

## Por qué importa

Sin esta skill, los agentes claimean éxito porque compiló o porque "los cambios parecen razonables". Esa es la mentira que mata el flujo: el humano confía, mergea, y descubre el bug en producción o en el siguiente sprint. Compilar es necesario, no suficiente.

Lo que cierra el ciclo de spec-driven development es la evidencia. El plan dijo qué verificar; ahora se verifica y se cita el output. Cualquier paso del flujo que no tenga evidencia se considera incompleto, incluso si "se ve bien".

Por eso fue promovida del resto del cinturón al happy-path. No es una skill opcional para quien quiere ser meticuloso; es lo que distingue trabajo terminado de trabajo "probablemente terminado". La diferencia entre "creo que funciona" y "acá está el comando y su salida" es la diferencia entre una afirmación y un hecho.

## El punto crítico

Evidencia antes de afirmaciones. Siempre. Sin excepción. Si no podés correr el comando porque la infra no está, porque depende de algo externo o porque es un cambio que requiere ojo humano, lo decís explícitamente: "no pude verificar X porque Y". No asumís, no minimizás, no extrapolás desde un check parcial.

## Anti-patrones a evitar

- "Los tests deberían pasar" sin haberlos corrido. Corrélos y citá el output. La oración correcta es "los tests pasan: [salida pegada]".
- "El feature funciona" sin correr el feature en el flujo real. Tests unitarios no son ejecución end-to-end. Si el feature es "el usuario hace X y ve Y", verificá que el usuario haga X y vea Y.
- Decir "listo" porque la implementación compila. Compilar es la barrera más baja del éxito. Tu trabajo es verificar comportamiento, no sintaxis.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/verification-before-completion/SKILL.md`

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot de los comandos de verificación corridos al final del feature
     del demo-repo de S04 + el output citado en el commit o en la descripción del PR. Idealmente
     que se vea el comando arriba y la salida abajo, sin recortes. -->
