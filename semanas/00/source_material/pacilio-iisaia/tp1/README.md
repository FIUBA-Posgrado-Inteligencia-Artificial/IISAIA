# TP 1 — Captcha de máquina de Galton

Un formulario de reserva de turno cuya verificación de seguridad exige ingresar un código de 3 letras soltando bolas en una máquina de Galton. Funciona, y está diseñado para que la distribución binomial trabaje en contra del usuario.

## Cómo se ejecuta

Se abre `index.html` con doble click. No hay nada que instalar ni que compilar: un solo archivo, sin dependencias externas.

## Qué me propuse construir

Una bad UI que fuera hostil por matemática y no por capricho. La idea era que la interfaz no escondiera nada ni mintiera — las probabilidades están escritas debajo de cada canaleta, a la vista — y que aun así fuera dolorosa de usar, porque la distribución binomial concentra las bolas en el centro y las letras de los bordes salen 1 vez cada 16.

Antes de escribir el primer prompt dejé decidido: cuántas filas de pegs, cómo se mapea cada canaleta a una letra, qué palanca tiene el usuario, cómo se borra un error, y cómo se anima la caída. El artefacto se construyó en tres prompts, en una sola conversación de Canvas.

## Decisiones que tomé yo

**Elementos del DOM en lugar de `<canvas>`.** Es la decisión más importante y la que más explícita hay que hacer. Pedido a secas, un tablero de Galton sale dibujado en `<canvas>`: anda perfecto y el estado deja de tener reflejo visible en el DOM. Los pegs, la bola y las canaletas son divs posicionados con CSS, así que se puede abrir el inspector y ver el estado y su representación al mismo tiempo.

**Cuatro filas y cinco canaletas.** R filas de pegs dan R+1 canaletas y 2^R caminos posibles. Con 4 filas quedan 16 caminos y la distribución es 1/16, 4/16, 6/16, 4/16, 1/16. Con 6 filas el borde cae a 1/64, que hace el artefacto más cruel pero también más lento de demostrar. Elegí que se pueda completar en clase.

**Borrar con un botón, sin soltar una bola.** La alternativa más hostil era que borrar exigiera embocar una canaleta de borrado. La descarté: convierte un error en una espiral de la que no se sale, y ahí deja de ser una interfaz operable para pasar a ser un castigo.

**Las letras de las canaletas son estado reordenable.** Sin esto el captcha es una tragamonedas: mirás caer la bola sin poder intervenir. Poder mover la letra que necesitás al centro le devuelve agencia al usuario, y el mecanismo se limita solo — el objetivo son tres letras y el centro es uno, así que cada acierto obliga a reordenar de nuevo.

**El captcha no es la página.** Un captcha suelto no frustra a nadie, porque nadie llegó ahí queriendo otra cosa. Envolverlo en una reserva de turno lo pone donde aparecen los captchas de verdad: cortando una tarea que el usuario quiere terminar.

## Qué salió mal y cómo lo corregí

Lo más interesante de esta entrega es que **el resultado salió bien y el prompt igual estaba mal**. El prompt inicial tenía dos defectos que no vi al escribirlo, y que el modelo resolvió por su cuenta sin avisar.

**Una contradicción interna.** La sección de estructura pedía un triángulo de 4 filas. La de comportamiento decía "después de la sexta fila cae en la canaleta correspondiente" — sobra de una versión anterior en la que el tablero tenía 6. El modelo tomó las 4 filas y descartó la mención a la sexta. Acertó, pero no había forma de saber que iba a acertar: la contradicción era simétrica y podría haber devuelto un tablero de 6 filas con 7 canaletas y solo 5 letras.

**Una referencia huérfana.** La sección de estilo decía "la probabilidad está escrita, no señalizada con color", pero la de estructura nunca pidió mostrar probabilidades — describía las canaletas solo con su letra. El modelo dedujo que había que mostrarlas, las agregó, y además calculó bien el binomial. Tres inferencias encadenadas, ninguna pedida.

Las dos ambigüedades salieron a favor, y ese es justamente el problema: si hubiera juzgado el prompt por el resultado, me habría quedado con la idea de que estaba bien escrito. Un output correcto no valida la especificación que lo produjo. Lo que corrige el problema no es reescribir el prompt después, sino releerlo antes de mandarlo buscando contradicciones entre secciones — el tipo de revisión que se saltea justo cuando uno mismo escribió el texto treinta segundos antes.

**Lo que sí funcionó por diseño.** Las tres reglas defensivas de los prompts 2 y 3 se cumplieron todas: el bloqueo de clicks mientras la bola cae, los porcentajes quedándose en su posición al intercambiar letras, y el captcha sobreviviendo intacto al pedido de envolverlo en otra página. Ninguna de las tres es obvia, y las tres son bugs silenciosos si no se nombran.

**Sobre los cuatro patrones.** La secuencia fue describir el artefacto, iterar sobre el estado, y un pedido estructural. No hubo un prompt de arreglar el layout ni uno de tematizar, porque el triángulo de pegs quedó alineado con las canaletas desde el primer intento y el estilo de captcha viejo salió del prompt inicial. Forzar esos dos prompts para completar la lista habría sido inventar un problema que no existía.

## Prompts

El registro completo está en [prompts.md](prompts.md). Los dos que más cambiaron el resultado:

El **primero**, porque fija todo el artefacto de una y define el terreno sobre el que se itera después. Si sale torcido, los siguientes prompts pelean contra una base equivocada.

El **segundo**, porque agregar el reordenamiento de canaletas es lo que convirtió el artefacto de una animación que se mira a una interfaz que se opera. Es el prompt donde la feature se expresó como estado con sus transiciones de ida y de vuelta, en vez de describirla visualmente.
