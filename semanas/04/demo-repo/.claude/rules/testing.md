# Testing

- Todo endpoint público necesita al menos un test de happy path y uno de error esperado.
- Tests usan `TestClient` de FastAPI + fixture `reset_store` autouse.
- Nombres: `test_<funcion>_<situacion>` — `test_create_user_ok`, `test_get_user_not_found`.
- No mockear el store en memoria — es el comportamiento real que queremos verificar.
