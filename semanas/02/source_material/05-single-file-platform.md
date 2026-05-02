# El empaque: un archivo, una página

Toda página que vamos a construir esta clase vive en un solo archivo `.html`. No hay carpetas, no hay `node_modules`, no hay configuración. Hay un archivo. Ese mismo archivo es lo que le pasás al LLM, lo que abrís en el navegador y lo que subís al servidor.

Esa idea tiene nombre: **single-file platform**. Una página completa, autosuficiente, que no necesita nada alrededor para funcionar. En este curso es el formato por defecto, y vale la pena entender por qué antes de tomarlo como dogma.

## ¿Por qué cabe todo en uno?

HTML, CSS y JavaScript pueden convivir en el mismo archivo. El `<style>` inline aloja las reglas CSS dentro del `<head>`, y el `<script>` inline aloja la lógica JavaScript donde lo necesites. No es un truco — es como funciona la web nativamente desde el principio. Los archivos separados son una optimización para proyectos grandes, no un requisito de la plataforma.

La regla práctica es simple: cuando un proyecto crece, se separa; cuando es chico, o cuando el contexto del modelo con el que trabajás es chico, se junta. Esta clase entra en la segunda categoría con holgura.

## Las tres ventajas

### Ventaja 1 — Cabe en el contexto

Un LLM gratuito tiene una **ventana de contexto** limitada: la cantidad máxima de texto que puede tener "a la vista" al mismo tiempo. Si tu proyecto son doce archivos repartidos en cuatro carpetas, no le entra. El modelo termina viendo solo fragmentos, y cuando le falta información empieza a inventar: importa funciones que no existen, asume nombres de variables, contradice código de otro archivo que no leyó.

Si todo es un archivo, lo tiene completo siempre. Cada respuesta se construye sobre el proyecto entero, no sobre un retazo. La calidad del output sube proporcional a cuánto del proyecto puede ver el modelo. En un free tier eso es la diferencia entre código que funciona y código que parece funcionar.

### Ventaja 2 — Despliegue por copy-paste

**Deploy** suele ser la palabra que asusta al principiante: pipelines, builds, servidores, CI. Acá no hay nada de eso. Copiás el contenido del archivo, lo pegás en un Gist de GitHub, en GitHub Pages, en Netlify Drop, en cualquier servicio que sirva HTML estático, y ya tenés una URL pública.

Cero pipeline, cero CI, cero configuración. Es ideal para lo que vamos a hacer en clase, para prototipos rápidos, para demos, para piezas de portfolio que querés que vivan online en cinco minutos.

### Ventaja 3 — Cero toolchain

Un **toolchain** moderno de frontend trae compiladores, **bundlers** (que empaquetan muchos archivos en uno solo), gestores de paquetes, versiones específicas de Node, configuraciones de TypeScript. Todo eso desaparece. Nada de `npm install`, nada de `webpack`, nada de chequear si tu Node es la versión correcta. El alumno hace doble click en el archivo, el navegador lo abre, y funciona.

La distancia entre "tengo una idea" y "tengo algo corriendo" se vuelve cero. Eso es enorme cuando estás aprendiendo: cualquier obstáculo de tooling mata el momentum y te saca del problema real, que es entender qué está pasando en pantalla. El single-file remueve toda esa fricción de un saque.

## Cuándo el paradigma se rompe

Hay que ser honesto: el single-file no es universal, y conviene saber sus límites para no usarlo donde estorba.

Cuando el archivo pasa las mil líneas, leerlo se vuelve doloroso; ahí sí conviene partirlo. Cuando hay backend, el modelo se queda corto: la próxima clase introduce el equivalente del lado servidor (semana 3 cubre el *single-file server*). Cuando necesitás dependencias pesadas, como un editor de texto rico o un motor 3D, se introduce una **dependencia externa** vía **CDN** (un servidor público que sirve la librería con una sola línea), o directamente se justifica un proyecto multi-archivo. Y cuando trabajás en equipo, el merge granular sobre un único archivo gigante se vuelve un infierno; ahí los archivos separados ganan por arrastre.

Para esta clase y para los TPs que dependan de un LLM gratuito, el paradigma sirve perfecto.

## Lo que ganás esta clase

El archivo `demo.html` que vas a ver en cinco minutos es la prueba viva. Una página completa, con cinco demos interactivas, layout, estado, eventos, tema, todo en un archivo. Si una página educativa puede vivir entera en un `.html`, lo mismo aplica al artefacto que tu grupo va a construir esta tarde.
