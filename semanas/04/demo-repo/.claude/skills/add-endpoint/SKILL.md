---
name: add-endpoint
description: Use when the user asks to add a new REST endpoint to the demo-repo backend. Adds the route, the schema if missing, the test, and regenerates openapi.yaml.
---

# add-endpoint

Procedimiento para agregar un endpoint nuevo al backend con su test y la
regeneración de la especificación OpenAPI.

## Fases

1. **Decidir method y path**
   - Confirmar con el usuario method HTTP, path y body si aplica.
   - Para escritura (POST/PUT/DELETE), agregar `dependencies=[Depends(require_bearer)]`.

2. **Schemas**
   - Si el endpoint usa un body o response no existente, agregar el modelo en
     `backend/schemas/models.py`.

3. **Router**
   - Agregar la función en el router correspondiente (`backend/routers/<resource>.py`).
   - Declarar `response_model` y `status_code` explícito.
   - Si el endpoint necesita una consulta que el store no tiene, agregar el método en
     `backend/db/client.py`.

4. **Test**
   - Agregar al menos dos tests en `tests/test_<resource>.py`: happy path + error
     esperado (404, 401, o similar).
   - Usar el fixture `reset_store` y el cliente `TestClient` ya configurados.

5. **OpenAPI**
   - Correr `uv run python scripts/export_openapi.py` para regenerar `openapi.yaml`.
   - Verificar que el endpoint nuevo aparece en el schema.

6. **Verificación**
   - `uv run pytest -v` debe pasar entero.
   - Mostrar al usuario el diff del openapi.yaml.

## Anti-patterns

- Crear el endpoint sin test.
- Olvidar regenerar `openapi.yaml`.
- Dejar el endpoint sin `response_model` (perdés la validación de salida).
- Hardcodear constantes que pertenecen a `models.py` o a una env var.
