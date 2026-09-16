# Apellido, Nombre

Repositorio del curso Introducción a la ingeniería de software asistida por Inteligencia Artificial.

Esta es la estructura de referencia. Copiala tal cual en tu propio repositorio y reemplazá el contenido por el tuyo.

Las tres carpetas vienen con una entrega resuelta adentro, para que veas hasta dónde llega lo que se espera.

## Entregas

| Entrega | Carpeta | Estado |
|---------|---------|--------|
| TP 1 | [tp1/](tp1/) | ejemplo resuelto |
| TP 2 | [tp2/](tp2/) | ejemplo resuelto |
| Trabajo Práctico Final | [tp-final/](tp-final/) | ejemplo resuelto |

## Cómo se usa esta estructura

Este `README.md` de la raíz es el **índice**: dice quién sos y qué hay en cada carpeta. Es lo primero que ve alguien que abre el repositorio, así que tiene que orientar a quien llega sin contexto.

El `README.md` de adentro de cada carpeta es el **informe** de esa entrega: qué construiste, cómo lo dirigiste y cómo se ejecuta.

En los dos ejemplos, las secciones que más pesan al corregir son **Decisiones que tomé yo** y **Qué salió mal y cómo lo corregí**. La primera muestra qué eligió la persona en lugar de aceptar el default del modelo; la segunda, que se leyó el resultado en vez de darlo por bueno. El `prompts.md` va sin editar, defectos incluidos: el registro sirve como registro solo si es fiel.

El ejemplo de `tp2/` cambia de artefacto pero no de exigencia: en vez de un HTML que se abre, hay un `openapi.yaml` que se pega en [editor.swagger.io](https://editor.swagger.io) y se lee. Las decisiones que se documentan ahí son de contrato —anidar o filtrar, qué status code devolver, qué campo es requerido— y el error que se corrige es uno que el modelo no podía detectar solo, porque venía del prompt.

Las carpetas se crean cuando llega cada entrega. No hace falta armarlas vacías por adelantado.
