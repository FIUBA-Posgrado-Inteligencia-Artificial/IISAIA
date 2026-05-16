# La ventana de contexto es finita

¿Por qué un agente que venía funcionando de maravilla de repente "olvida" lo que le pediste? ¿Por qué después de treinta herramientas ejecutadas empieza a girar en círculos? La respuesta no está en el modelo; está en el espacio donde el modelo trabaja.

En Semana 1 aprendimos algo que hoy se vuelve central: el conocimiento en los parámetros del modelo es un recuerdo vago — como algo que leíste hace un mes. Lo que está en la ventana de contexto es la working memory, acceso directo. El modelo no *recuerda* lo que tiene en el contexto: lo *ve*, está ahí, disponible en tiempo real. Hoy esa working memory es el recurso que vas a aprender a administrar.

## El loop llena la ventana

Cada vuelta del loop agéntico deposita tokens en la ventana. Un pensamiento del modelo: tokens. Una llamada a herramienta: tokens. La respuesta de esa herramienta: tokens. Todo se apila, porque el modelo necesita el historial completo para saber dónde está y qué hacer a continuación.

Una sesión de trabajo real no tiene una vuelta del loop: tiene cien, doscientas. Pensá en una sesión de cuarenta minutos construyendo una feature: el agente lee el esquema de la base de datos, revisa tres archivos de configuración, ejecuta los tests, lee la salida de error, lee el archivo donde está el bug, propone un fix, vuelve a ejecutar los tests, lee la nueva salida. Ese recorrido puede tocar fácilmente treinta o cuarenta archivos, más todas las observaciones intermedias. Todo eso vive en la ventana.

¿Cuánto es eso en la práctica? Un archivo de código de tamaño mediano — 300 líneas con comentarios — puede ocupar entre 1.500 y 2.500 tokens. Los modelos actuales tienen ventanas que rondan los 200.000 tokens de contexto útil. Parece mucho. Pero leé veinte archivos de ese tamaño y ya gastaste entre 30.000 y 50.000 tokens solo en observaciones — sin contar los pensamientos del modelo, los logs de herramientas, ni el contexto inicial que cargaste al empezar. En una sesión larga, la ventana se consume más rápido de lo que intuís.

## Finita

El techo existe. No es una ventana "grande": es una ventana *finita*. Cuando se llena, algo tiene que irse o algo tiene que parar. Los modelos no generan tokens al infinito; cuando el contexto acumulado supera el límite, el sistema tiene que tomar una decisión: cortar desde el inicio, resumir, o detenerse.

Esa finitud no es un defecto de diseño que van a corregir en la próxima versión. Es una propiedad estructural. Ventanas más grandes desplazan el límite pero no lo eliminan. Diseñar para ese límite es parte del trabajo.

## Context rot

Hay un fenómeno que todo supervisor de agentes encuentra tarde o temprano, y que conviene nombrar antes de que te sorprenda: el *context rot*.

Ocurre así: diste una instrucción al inicio de la sesión. El agente la ejecutó bien las primeras veces. Pero después de muchas vueltas del loop, algo cambia. El modelo empieza a ignorar esa instrucción. Propone soluciones que contradicen lo que pediste. Repite trabajo que ya hizo. Cuando le señalás el error, corrige, pero a la vuelta siguiente vuelve al mismo problema.

¿Qué pasó? La instrucción original quedó sepultada bajo cientos de líneas de observaciones. El modelo puede ver todo lo que está en la ventana, pero no todo lo que ve pesa igual cuando genera la respuesta siguiente. Las observaciones recientes dominan. La instrucción del principio, enterrada bajo logs y outputs y pensamientos intermedios, perdió peso. La señal se diluyó en el ruido.

Los síntomas que reconoce un supervisor:

- El agente contradice una restricción que diste explícitamente ("no uses dependencias externas" y ahora está instalando tres).
- El agente repite un bloque de trabajo que ya completó, como si no lo hubiera hecho.
- Las respuestas se vuelven genéricas o evasivas donde antes eran específicas.
- Le preguntás por algo que estaba en el contexto inicial y no lo "recuerda", aunque técnicamente está ahí.

Ninguno de estos síntomas significa que el modelo falló. Significa que la ventana está trabajando contra vos en vez de para vos.

## Gestionar el contexto es la habilidad central

Acá está la tesis de esta clase, dicha sin rodeos: **quien dirige un agente de manera efectiva no es el que escribe mejores prompts de entrada; es el que mantiene la ventana enfocada en lo que importa**.

Un prompt inicial brillante no te salva si la ventana se llena de basura. Un modelo capaz no te ayuda si su working memory está saturada de observaciones irrelevantes que tapan las instrucciones que importan.

Hay dos operaciones conceptuales que cualquier estrategia de manejo de contexto implementa de una forma u otra. La primera es la **compactación**: resumir el historial acumulado en algo más denso y soltarse del detalle que ya no aporta. No se borra: se condensa. La señal se preserva; el ruido se descarta. La segunda es el **reset**: empezar con contexto limpio, cargando solo lo que es necesario para la tarea siguiente, sin arrastrar todo el historial de la sesión anterior.

Ninguna de las dos es mejor en abstracto. Cuándo usar cada una, cómo combinarlas, y qué cargar en un contexto limpio para que el agente tenga lo que necesita — eso es lo que vamos a desarrollar en la parte 2 de esta clase.

## Adelanto: tres estrategias para administrar la ventana

Antes de entrar al demo, plantamos una semilla que va a germinar en la parte 2.

Cuando pensamos en cómo mantener la ventana en buen estado a lo largo de una sesión de trabajo, hay tres estrategias que se distinguen por cómo tratan la información que el agente necesita:

- **Siempre cargado**: hay información que el agente necesita en cada vuelta del loop, sin excepción. Esa información se carga al inicio y se mantiene disponible siempre, porque quitarla crearía context rot garantizado.
- **Condicional**: hay información que solo es relevante para ciertas tareas. Cargarla todo el tiempo gasta espacio; no cargarla cuando hace falta genera errores. La estrategia condicional la trae cuando la necesita y la deja afuera cuando no.
- **Autocurado**: hay información que el propio sistema decide conservar por su cuenta — aprendizajes, correcciones, preferencias que descubre mientras trabaja — y la mantiene disponible entre sesiones sin que el supervisor tenga que escribirla ni curarla a mano cada vez. El curado lo hace el sistema, no vos.

Este adelanto es intencional. Las tres estrategias se hacen concretas en la parte 2 de la clase, y el §8 cierra explícitamente este preview con herramientas y ejemplos específicos. Por ahora alcanza con tener los tres rótulos en la cabeza: **siempre cargado**, **condicional**, **autocurado**.

La parte 2, en el fondo, es una sola pregunta repetida de tres maneras distintas: ¿qué ponemos en la ventana, cuándo, y quién decide sacarlo?

## Mini-demo en vivo: context rot y qué sobrevive a /compact

El objetivo de este demo es hacer tangible que la ventana es finita y que no todo persiste con la misma fuerza. En lugar de explicarlo, lo vamos a ver ocurrir.

**Intro para el aula:** Vamos a provocar context rot a propósito, en vivo. Y después vamos a ver qué pasa cuando el contexto se compacta — qué sobrevive y qué no.

---

**Beat 1 — Plantar la instrucción**

*Qué hago:* Abrir una sesión nueva (o una sesión ya cargada con varios archivos leídos para tener historial). Al inicio de la sesión, darle al modelo una instrucción peculiar y fácil de verificar: *"De ahora en más terminá cada respuesta con la palabra LISTO."* Después, trabajar en algo real durante varios minutos — pedirle que lea archivos, que proponga cambios, que evalúe opciones. En las primeras respuestas, el modelo cumple: cada mensaje termina con LISTO.

*Qué digo:* *"Le dimos una instrucción al principio. Chequeen que la cumple."*

*Qué mirar:* Las primeras dos o tres respuestas terminan con LISTO. La instrucción está en la cima del contexto y pesa.

---

**Beat 2 — Context rot en acto**

*Qué hago:* Continuar la sesión con trabajo real durante un buen rato — más archivos, más herramientas, más idas y vueltas. Luego hacer una pregunta completamente normal, sin mencionar la instrucción. Mostrar la respuesta.

*Qué digo:* *"No está roto. La instrucción quedó sepultada. Eso es context rot."*

*Qué mirar:* La respuesta ya no termina con LISTO. El modelo no "olvidó" — la instrucción técnicamente sigue en algún lugar del contexto. Pero quedó enterrada bajo cientos de líneas de observaciones y la señal se perdió.

---

**Beat 3 — Qué sobrevive a /compact**

*Qué hago:* Ejecutar `/compact` en la sesión. Esperar a que el modelo resuma el historial y el contexto se aliviane.

*Qué digo:* *"Compactar es resumir y soltar lastre. Pero ojo qué sobrevive."*

*Qué mirar:* Después de compactar, hacer una pregunta y mostrar la respuesta. La instrucción del chat ("terminá con LISTO") no reapareció — no sobrevivió la compactación porque vivía solo en la conversación. En cambio, el CLAUDE.md del proyecto se re-inyecta automáticamente después de compact: lo que está en un archivo persiste; lo que se dijo al pasar, no.

---

**Beat 4 — Cierre del demo**

*Qué digo:* *"Lo que vive en un archivo persiste; lo que dijiste al pasar, no. Tené eso en la cabeza toda la parte 2."*

---

**Plan B si no coopera:** Si reproducir context rot en vivo resulta lento o impredecible (algunos modelos respetan mejor instrucciones simples y el fenómeno tarda más), mostrar el fenómeno sobre una transcripción guardada de una sesión anterior donde se observó el comportamiento. El beat del `/compact` — qué persiste vs qué no — se hace en vivo de todas formas: es rápido, repetible y el contraste entre la instrucción de chat y el CLAUDE.md es siempre visible.
