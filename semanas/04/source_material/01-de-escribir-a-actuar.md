# De escribir código a actuar sobre el código

Pensá en la última vez que le pediste a una IA que te arreglara un endpoint. Copiaste el error, lo pegaste en el chat, la IA te devolvió un bloque de código, copiaste ese código, lo pegaste en tu editor, guardaste, corriste el servidor, viste que tiraba un 500 diferente, copiaste ese nuevo error, volviste al chat, preguntaste de nuevo. Cada vuelta de esa rueda la hacías vos: eras el que leía la salida, el que decidía qué información llevar de vuelta al modelo, el que ejecutaba el próximo comando. La IA escribía; vos corrías el loop.

Eso no es un defecto del modelo. Es cómo funciona el paradigma más básico: el modelo propone, vos ejecutás, vos observás, vos reportás. Funcionó para aprender. En proyectos más largos, el límite empieza a mostrarse.

## Lo que cambia

Hoy el loop lo cierra el agente. No es que la IA "escriba mejor" o "genere más código de una vez" — eso no sería un cambio de paradigma, sería más de lo mismo. Lo que cambia es quién ejecuta el ciclo. El agente escribe un fragmento de código, llama a una herramienta para correrlo, lee la salida, detecta el error, escribe la corrección, vuelve a correr. Sin que vos intervengas en cada vuelta.

El cambio es que la IA **actúa**. Tiene acceso al sistema de archivos, puede llamar comandos, puede leer resultados. No te describe lo que habría que hacer: lo hace.

Eso suena a un detalle técnico, pero cambia completamente la relación entre vos y la herramienta. Dirigir algo que ejecuta decisiones sobre tu repo es diferente a corregir sugerencias de texto.

## Dos paradigmas

Hay dos formas distintas en que una IA puede colaborar con código, y vale la pena verlas como lo que son: paradigmas distintos, no versiones mejores y peores de lo mismo.

En el primero, la IA sugiere y vos conducís. El modelo te completa una línea, te propone un bloque, te ofrece una alternativa — pero el flujo lo manejás vos. Vos abrís el archivo, vos aceptás o rechazás la sugerencia, vos ejecutás el test. La IA opera en modo reactivo: responde cuando la invocás, propone cuando le preguntás. Es útil y lo seguirá siendo.

En el segundo, el agente planifica y ejecuta en un loop. Recibe un objetivo, arma un plan, ejecuta pasos, observa resultados, ajusta y sigue. La IA conduce el flujo; vos supervisás el proceso. No es que vos desaparezcas — pero tu rol se desplaza de ejecutor a supervisor. El modelo no espera que le traigas el error: va a buscarlo.

El modelo de lenguaje debajo puede ser el mismo. Lo que cambia es la arquitectura encima: en un caso, un chat o un autocomplete; en el otro, un proceso con herramientas y memoria que itera.

## Por qué necesitás un modelo mental nuevo

Si traés el modelo mental del chat al agente, vas a tener problemas. En el chat, el peor caso es que el modelo alucine una función que no existe: copiás el código, no compila, lo notás. En el agente, el modelo puede alucinar un comando de borrado de archivos y ejecutarlo. La diferencia entre proponer y actuar no es cosmética.

Dirigir un agente bien requiere entender dos cosas que son el mapa de esta primera parte de la clase.

La primera es el **loop**: qué ciclo ejecuta el agente, qué pasa en cada vuelta, cómo sabe cuándo parar. Si no entendés el loop, no podés anticipar qué hace el agente cuando algo sale mal — y algo siempre sale mal.

La segunda es la **memoria**: el agente no tiene un estado interno que persiste entre sesiones. Trabaja con lo que tiene en su ventana de contexto. Eso define qué puede recordar, qué puede razonar, y por qué se pierde en tareas largas si nadie gestiona esa ventana.

El rol que aprendiste en las semanas anteriores no desaparece. Seguís siendo supervisor. Lo que cambia es que ahora supervisás un proceso autónomo en lugar de editar texto. El vocabulario que tenés — especificación, contratos, decisiones arquitectónicas — sigue siendo tu herramienta principal. Pero necesitás agregarle estos dos conceptos para entender lo que supervisás.

Hoy no aprendés una herramienta; aprendés cómo funciona la máquina que vas a dirigir el resto del curso.
