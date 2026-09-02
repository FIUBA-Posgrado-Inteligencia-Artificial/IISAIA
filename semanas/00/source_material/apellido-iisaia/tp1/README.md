# TP 1 — Captcha de máquina de Galton

Un formulario de reserva de turno donde la verificación te hace ingresar tres letras soltando bolas en una máquina de Galton. Funciona bien y usarlo es horrible, que era la idea.

## Cómo se ejecuta

Doble click en `index.html`. Un solo archivo, sin dependencias.

## Qué me propuse construir

Una bad UI hostil por matemática y no por capricho. No esconde nada —las probabilidades están escritas debajo de cada canaleta— y aun así duele, porque la binomial junta las bolas en el centro y las letras de los bordes salen una vez cada dieciséis. Salió en tres prompts, en una sola conversación de Gemini Canvas.

## Decisiones que tomé yo

**DOM en vez de `<canvas>`.** La más importante. Pedido a secas, un tablero de Galton sale dibujado en canvas: anda igual, pero el estado deja de verse en el DOM. Acá los pegs, la bola y las canaletas son divs, y se puede abrir el inspector a mirar el estado y su reflejo al mismo tiempo.

**Cuatro filas, cinco canaletas.** Dan 16 caminos y una distribución de 1/16, 4/16, 6/16, 4/16, 1/16. Con seis filas el borde cae a 1/64: más cruel, pero demasiado lento para mostrarlo en clase.

**Borrar con un botón.** La versión más hostil era obligarte a embocar una canaleta de borrado. Convierte un error en una espiral de la que no se sale.

**Las letras de las canaletas se reordenan.** Sin esto mirás caer la bola sin poder intervenir. Poder mover al centro la que necesitás alcanza para que sea una interfaz y no una tragamonedas, y tampoco la vuelve fácil: el objetivo son tres letras y el centro es uno.

**El captcha no es la página.** Suelto no molesta a nadie, porque nadie llegó ahí queriendo otra cosa. Envuelto en una reserva de turno corta algo que querías terminar.

## Qué salió mal y cómo lo corregí

El resultado salió bien y el prompt igual estaba mal.

Tenía una contradicción —la estructura pedía cuatro filas de pegs y el comportamiento hablaba de "la sexta", que había quedado de una versión anterior— y una referencia huérfana: el estilo decía que la probabilidad va escrita, pero la estructura nunca pidió mostrarla. El modelo se quedó con cuatro filas y agregó las probabilidades, bien calculadas.

Las dos ambigüedades salieron a mi favor, y ahí está el problema: juzgando por el resultado, me quedo con que el prompt estaba bien escrito. Faltó releerlo cruzando las secciones entre sí antes de mandarlo, que es la revisión que uno saltea cuando escribió el texto hace treinta segundos.

Lo que sí anduvo por diseño fueron las tres reglas defensivas de los prompts 2 y 3: bloquear los clicks mientras la bola cae, dejar los porcentajes pegados a la posición y no a la letra, y pedir que el captcha no se tocara al envolverlo. Las tres son bugs silenciosos si no se nombran.

## Prompts

El registro completo está en [prompts.md](prompts.md). Los que más pesaron son el primero, que fija el artefacto entero, y el del reordenamiento, que convirtió una animación que se mira en una interfaz que se opera.
