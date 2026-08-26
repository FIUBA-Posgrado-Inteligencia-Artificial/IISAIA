# Cómo se aprueba

## Tres entregas, todas individuales

La materia se aprueba con tres trabajos prácticos. Los tres son individuales: no hay grupos en ninguna de las entregas, tampoco en la última.

Las dos primeras son acotadas y sirven para practicar lo que se vio en clase. La tercera es el trabajo práctico final: la aplicación completa, con interfaz, servidor y datos, que presentás en el Demo Day de la última clase.

Los detalles de cada consigna se comunican cuando corresponde. Lo que importa hoy es la forma: tres entregas, todas tuyas, todas en un repositorio público de GitHub.

## Por qué individual

Podrías preguntarte por qué el trabajo práctico final no admite equipos, si en la industria se trabaja en equipo.

La razón es el criterio de evaluación. Lo que se mira es si vos podés explicar y sostener las decisiones del proyecto. En un grupo esa responsabilidad se diluye: hay siempre alguien que entendió la parte del servidor y alguien que entendió la interfaz, y cuando el proyecto se defiende cada uno cubre el hueco del otro. Individual, no hay dónde esconderse — y eso es exactamente el punto del curso.

## Qué se evalúa

Acá está la parte que suele sorprender: **que funcione no alcanza.**

Un producto que anda pero cuyos caminos no podés reconstruir no dice nada sobre tu rol como supervisor. Podría haberlo generado cualquiera pidiéndole a un modelo que hiciera "una app de tareas". Lo que se evalúa es si podés contar el proceso:

Cómo especificaste qué construir, antes de que se escribiera código. Qué decisiones de arquitectura tomaste vos — qué endpoints, qué estructura de datos, qué contrato entre la interfaz y el servidor — en vez de aceptar lo primero que el modelo eligió por defecto. Cómo te diste cuenta de que algo se había desviado, y qué hiciste para corregirlo.

El término para esto es **apropiación**: que el producto sea tuyo aunque el agente haya escrito la mayoría del código. Y se mide de una sola manera — en tu capacidad de explicarlo, corregirlo y extenderlo. No en cuántas líneas tipeaste.

## El README es el informe

Cada entrega se hace mediante un repositorio público de GitHub, y el archivo `README.md` funciona como el informe.

Ahí va lo que no se ve mirando el código: qué te propusiste construir, los prompts principales que usaste, cómo manejaste el contexto cuando el proyecto creció, qué salió mal y cómo lo corregiste, y las instrucciones para que cualquiera pueda ejecutar el proyecto.

Desde la clase 6 se suma algo más: el repositorio también tiene que conservar la evidencia del proceso. La especificación y el plan como archivos en disco, el historial de commits, las branches y los pull requests. Para entonces vas a tener las herramientas para que eso salga solo, como subproducto de trabajar bien, y no como una tarea extra al final.

Eso último tiene una consecuencia práctica que conviene entender desde hoy: **el historial no se puede fabricar la noche anterior.** Un repositorio con un único commit que dice "entrega final" no tiene proceso que mostrar. Por eso el repositorio se arma ahora y crece con el curso.
