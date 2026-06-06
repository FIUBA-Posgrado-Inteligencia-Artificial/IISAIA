# El LLM no ve tu mundo

## Lo que sabe y lo que ve

Un LLM moderno sabe una cantidad enorme de cosas. Sabe sintaxis de quince lenguajes, conoce frameworks, recuerda algoritmos. Esa parte la trae del entrenamiento y la lleva a todas las conversaciones.

Lo que no tiene es nada de tu mundo presente. No vio nunca este repositorio que tenés abierto. No conoce el schema de la base que estás consultando. No sabe qué dice la página web que querés que analice. Cada conversación arranca sin ese contexto, y todo lo que el agente "sepa" de tu trabajo se lo tenés que dar vos.

## Tres "no puedo" concretos

Pensá en estas tres situaciones que se dan todos los días.

**No puedo abrir este archivo.** Le pedís al agente que revise una función específica en `services/auth.py:42`. Si no le pegás el contenido en el prompt, el agente no la puede leer. Para él, ese archivo no existe.

**No puedo tirar esta query.** Estás depurando un dato raro en la base de producción. Necesitás que el agente entienda si el problema es una fila inconsistente o un join mal hecho. Para responder eso necesitaría ejecutar SQL contra tu base. No puede.

**No puedo ver esta página.** Te aparece un error en una página web documentada en una URL específica. Le mandás el link al agente y te responde con su mejor adivinanza basada en URLs parecidas que vio durante entrenamiento — pero la URL real, en este momento, no la abre.

## La asimetría

Hay una asimetría incómoda. El LLM piensa rápido y razona bien. Vos sos el que tiene los ojos, las manos y los permisos para leer, ejecutar y navegar. Cada vez que querés que el agente te ayude con algo del mundo real, terminás siendo el courier: copiando archivos al prompt, pegando salidas de comandos, transcribiendo errores. El cuello de botella sos vos.

Romper esa asimetría es lo que viene. Antes de mostrar la salida, vale la pena ver el patrón que se venía usando hasta acá y por qué empieza a cansarse.
