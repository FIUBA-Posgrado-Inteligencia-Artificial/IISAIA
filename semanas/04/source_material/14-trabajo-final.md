# El trabajo final

Hace cuatro semanas no sabías qué era un token. Hoy terminaste de armar tres cosas que, juntas, cambian cómo podés construir software.

La primera es el **modelo**: cómo piensa un LLM, cómo predice el siguiente token, qué es la ventana de contexto, por qué el modelo no tiene memoria entre sesiones si no se la das. Sin eso, el agente es una caja negra: no podés anticipar cuándo falla ni por qué.

La segunda es el **rol**: supervisor arquitectónico. Las semanas 2 y 3 te dieron el vocabulario para nombrar las piezas — del frontend, del backend — y la práctica de dictar contratos antes de que el agente escriba. La IA implementa; vos decidís qué se construye. Sin vocabulario no hay especificación. Sin especificación, aceptás lo primero que el modelo te tire.

La tercera es el **runtime**: el loop, las tools, la ventana finita, y las herramientas para actuar sobre cada uno de esos elementos. Plan mode, permisos, CLAUDE.md jerárquico, sub-agents, skills. No features: decisiones sobre cuándo y cómo entrás al proceso.

El trabajo final es donde las tres se usan al mismo tiempo.

## Qué vas a construir (forma, no contenido)

Un producto con frontend y backend. Algo que corre en un servidor, que tiene una interfaz para el usuario, que persiste datos. El dominio se define después, y puede ser libre o semi-libre — eso se comunica por separado. Lo que importa acá no es el tema: es la forma.

La forma importa porque implica exactamente las decisiones que aprendiste a tomar. El frontend requiere que nombres componentes, estados, eventos — el vocabulario de la semana 2. El backend requiere que dictés endpoints, contratos, modelos de datos — el vocabulario de la semana 3. Y construir ambas cosas con un agente en un proyecto de varios archivos, que se extiende a lo largo de varias sesiones, activa todo lo de hoy: el contexto se acumula, el loop puede derivar, el agente va a mezclar decisiones si no lo estructurás.

No vas a escribir este producto línea por línea. Lo vas a dirigir. Esa es la diferencia de fondo.

## Por qué conecta con todo

Cada pieza del curso entra en el proyecto de una manera que no es teórica.

El vocabulario de frontend y backend — componentes, endpoints, contratos, status codes — es lo que te permite dictar. Si el agente devuelve una API que no pediste, necesitás las palabras para corregirla. Sin vocabulario, el único movimiento disponible es aceptar o rechazar en bloque.

El loop y la gestión del contexto entran cuando el proyecto crece. Un proyecto de un solo archivo y una sola sesión no activa el problema de la ventana. Un proyecto real se extiende: el contexto se fragmenta, el agente pierde el hilo. Las herramientas de hoy — CLAUDE.md que persiste las decisiones de arquitectura, sub-agents que aíslan partes del loop, plan mode que muestra el plan antes de tocar nada — dejan de ser features opcionales y se vuelven la diferencia entre un proyecto que avanza y uno que da vueltas.

El rol de supervisor es lo que mantiene la coherencia entre partes. Si el frontend espera un campo y el backend devuelve otro, el agente no lo detecta solo. Supervisar el contrato entre cliente y servidor es exactamente el rol de la semana 3, aplicado a tu propio proyecto.

El trabajo final no examina si sabés sintaxis. Examina si sabés dirigir.

## Qué se evalúa, en espíritu

No es solo que funcione. Un producto que funciona pero cuyos caminos no podés explicar no dice nada sobre tu rol como supervisor.

Lo que importa es que puedas contar el proceso: cómo especificaste qué construir, cómo gestionaste el contexto cuando el proyecto creció, cómo detectaste cuando el agente derivó y cómo lo corregiste. Las decisiones de arquitectura — qué endpoints, qué estructura de datos, qué contrato entre cliente y servidor — tienen que ser tuyas, no las que el agente eligió por defecto porque no especificaste.

El término para esto es apropiación: que el producto sea tuyo aunque el agente haya escrito la mayoría del código. Apropiación se mide en la capacidad de explicar, corregir y extender — no en cuántas líneas escribiste con el teclado.

Eso es lo que prepara el Demo Day, sin entrar todavía en su rubrica concreta.

## Lo que NO se decide hoy

Los detalles administrativos del trabajo final se comunican por separado. Hoy no quedan definidos:

- **Equipos**: si se trabaja en grupos o individualmente, cómo se forman, de qué tamaño — eso se anuncia después.
- **Fechas y entregas**: el calendario de hitos, cuándo se entrega qué, si hay entregas parciales — se comunica por separado.
- **Dominio exacto**: si el tema es libre, semi-libre o acotado a un conjunto de opciones — se define después.
- **Rubrica formal**: los criterios de evaluación detallados, el peso de cada parte — se entregan en otro momento.

Lo de hoy es el por qué y la forma. Para que llegues a esa conversación con el marco ya puesto, no empezando de cero.

## El arco

Empezamos con un modelo que predice tokens. Después aprendiste a nombrar las piezas de lo que ese modelo construye. Después aprendiste a controlar el loop con el que trabaja. Ahora construís algo real con los tres.

No son herramientas separadas. Son el mismo supervisor trabajando en distintas capas al mismo tiempo.
