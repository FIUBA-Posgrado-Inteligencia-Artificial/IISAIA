---
paths:
  - "backend/**/*.py"
---

# API conventions

Cuando trabajes con código del backend:

- Cada endpoint declara su `response_model` y `status_code` explícito.
- Para endpoints con escritura (POST, PUT, DELETE), agregar `dependencies=[Depends(require_bearer)]`.
- Si tocás un endpoint o agregás uno nuevo, regenerar `openapi.yaml` con
  `uv run python scripts/export_openapi.py` y commitear el cambio en el mismo PR.
- Errores que vuelven al cliente: `HTTPException` con código HTTP correcto (`404` para no encontrado,
  `401` para falta de auth, `403` para auth inválida).
