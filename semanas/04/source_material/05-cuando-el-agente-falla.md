# Cuando el agente falla (y qué hacés vos)

Un agente que actúa solo puede fallar de maneras que un modelo que solo escribe no puede. Cuando el modelo sugería, el peor caso era una sugerencia mala — vos la rechazabas. Cuando el agente actúa sobre tu repo, edita archivos y ejecuta comandos, el peor caso es un entorno que ya cambió. La falla deja rastro.

Vale la pena nombrar los modos antes de encontrárselos.

## Cuatro modos de falla nuevos

**Loop infinito.** Sin una condición de corte efectiva, el agente da vueltas. En §2 vimos cuatro condiciones de corte: objetivo alcanzado, límite de pasos, el agente pide ayuda, falla no recuperable. Cuando ninguna se cumple — porque el objetivo estaba mal especificado, el límite no se configuró, o el agente sobreestima su progreso — el loop sigue. No es que "trabaja mucho": es que no converge. Cada vuelta gasta contexto, ejecuta acciones, modifica el entorno. Y el sistema no para solo.

**Deriva de objetivo.** El agente arranca con tu tarea y termina haciendo otra que consideró mejor. Empezó a arreglar el bug del endpoint, notó una inconsistencia en el esquema de la base, y decidió refactorizar primero. Cuando volvés a mirar, el bug original no está arreglado y el modelo de datos cambió. La deriva no parece un error desde adentro del loop: el agente siguió algo que le pareció relevante. Desde afuera, el resultado es otro.

**Alucinar tools o resultados.** En Semana 1 aprendimos que los modelos inventan cosas con total convicción — la alucinación. Las mitigaciones de entonces eran enseñarle al modelo a admitir incertidumbre y darle herramientas para verificar. Ahora el problema escala: el agente puede afirmar que ejecutó un comando que no ejecutó, o leer una salida de herramienta y reportar algo distinto de lo que dice. El loop sigue adelante sobre esa premisa falsa. La confianza del modelo no cambió; lo que cambió es que ahora actúa sobre ella.

**Envenenar su propio contexto.** En §4 vimos el context rot: instrucciones sepultadas bajo observaciones que pierden peso. Este modo de falla es la versión activa del mismo problema. El agente ejecuta algo que produce una salida enorme — un log de dos mil líneas, un stack trace con cincuenta frames repetidos — y esa salida entra en la ventana sin procesamiento. De ahí en adelante el modelo razona desde ese contexto degradado: las señales importantes compiten con ruido masivo y pierden. El deterioro es gradual y difícil de notar desde adentro.

## El rol del supervisor: cuándo intervenir

La autonomía del agente no quita el supervisor. Lo que cambia es *cuándo* mira.

En el modelo de chat, revisabas la respuesta antes de actuar. En el modelo agéntico, el agente ya actuó. Esperar al final para abrir el diff es demasiado tarde: un loop infinito no para solo, una deriva no se autocorrige, un contexto envenenado no se limpia solo.

En Semana 3 aprendimos esto para el backend: no le creás a la IA, creale a la máquina. Leé los logs, verificá los outputs antes de asumir que algo funciona. Acá aplica lo mismo: cuando el agente dice que avanzó, mirá la evidencia. ¿Los archivos que dice haber editado cambiaron? ¿El test que dice haber pasado corre?

Los síntomas son reconocibles: loop infinito produce vueltas sin progreso real; deriva hace que la tarea original desaparezca del foco; contexto envenenado hace que las respuestas contradigan restricciones que diste antes.

Revisión al final no es supervisión: es auditoría.

## El cierre de la parte 1

Tenemos las cuatro piezas: el loop (pensar → actuar → observar, hasta una condición de corte), las herramientas con su distinción de riesgo entre leer y escribir, la ventana de contexto como espacio finito, y los modos en que el sistema falla cuando alguna de esas piezas se descontrola.

Todo lo que sigue actúa sobre el loop o sobre el contexto. La parte 2 lleva estos conceptos a una herramienta concreta y muestra cómo sus decisiones de diseño responden exactamente a los problemas que acabamos de nombrar.
