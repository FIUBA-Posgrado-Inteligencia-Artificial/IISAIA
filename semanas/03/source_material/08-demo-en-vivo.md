# Demo en vivo: del contrato al servidor corriendo

Este archivo es el guion del demo de cierre. No es un capítulo conceptual: es la coreografía del cierre. La clase termina con el profesor levantando un servidor en local con Claude Code, mientras los alumnos miran y conectan los conceptos vistos con código real apareciendo en pantalla. La intención es que cada beat del demo aterrice algo que ya se nombró en los archivos previos.

## Qué tiene que mostrar el demo

1. Al menos 3 verbos HTTP distintos en juego (mínimo: GET, POST, DELETE; idealmente también PATCH o PUT).
2. Al menos una relación entre dos tablas (foreign key visible en la base).
3. Al menos un camino de error visible: un 4xx que el alumno pueda ver en pantalla intencionalmente.
4. Frontend mínimo que consuma la API (puede ser una sola página HTML servida por la misma app, o un archivo aparte abierto en el navegador).
5. Dominio no trivial: explícitamente NO un to-do list. Tiene que justificar la clase.

## TBD: dominio

El dominio concreto se decide al implementar el demo, respetando los cinco requisitos de arriba. Tres ideas-anclas como puntos de partida, sin compromiso: un mini-CRM de contactos con notas asociadas; un tracker de aplicaciones a trabajos con estados (postulado, entrevista, oferta, rechazo); un catálogo de libros leídos con reseñas. La elección final queda para la fase de implementación.

## Plan que se dicta antes de tocar Claude Code

El demo abre con el profesor escribiendo, visible en pantalla, un bloque de contrato (misma forma que el del archivo 04) *antes* de invocar a la IA. La plantilla que se llena en vivo:

```
stack: Python + FastAPI + SQLite + Uvicorn

modelo de datos:
  [tabla A](id, ...)
  [tabla B](id, ..., a_id foreign key → A.id)

endpoints:
  GET    /[recurso A]
  POST   /[recurso A]
  GET    /[recurso A]/{id}/[recurso B]
  POST   /[recurso A]/{id}/[recurso B]
  DELETE /[recurso A]/{id}/[recurso B]/{bid}

frontend:
  una página index.html servida por la API
  formulario para crear A y B
  lista que renderiza el GET y permite borrar
```

Este bloque es el contrato. Cuando lo dictás a Claude Code, le estás dando el *qué*. La IA elige el *cómo*. Si más adelante tenés que cambiar algo, cambiás el contrato y volvés a dictar.

## Beats del demo

1. **Después del primer prompt**: abrir el árbol de archivos que apareció. Señalar `app/main.py`, `app/db.py`, `requirements.txt`. "Esto no lo escribimos; lo dictamos."
2. **Cuando aparezca la primera ruta**: pausar. Leer la ruta en voz alta como contrato: verbo, path, qué entra, qué sale. Conectar explícitamente con el archivo 04.
3. **Cuando se levante el servidor**: terminal con Uvicorn corriendo. Abrir `http://localhost:8000` en el navegador. Si FastAPI generó `/docs`, abrirla y mostrar la documentación automática como espejo del contrato.
4. **Cuando peguen a un endpoint mal**: provocar intencionalmente un 4xx (por ejemplo, POST sin un campo requerido). Mostrar el código de respuesta en el navegador y el log en la terminal. Conectar con el archivo 06.
5. **Cuando aparezca el frontend**: abrir el HTML, mostrar la llamada `fetch` (o equivalente) y leerla como "el cliente está hablando el contrato del servidor".
6. **Cierre (30 segundos)**: enmarcar lo que pasó. "Ustedes no tipearon nada. Lo que dirigieron fue el contrato. La IA escribió el código; ustedes leyeron, corrigieron y aprobaron."

## Lo que NO se intenta en este demo

No autenticación, no deploy, no testing automatizado, no CSS bonito. Esos viven en otras semanas. Si algo de eso aparece accidentalmente en el código generado, el profesor lo señala y lo deja para después. La regla es proteger el foco: lo que se muestra hoy es la cadena contrato-código-servidor-cliente, y nada más.
