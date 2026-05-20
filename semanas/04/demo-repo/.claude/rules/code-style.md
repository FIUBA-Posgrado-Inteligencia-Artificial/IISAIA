# Code style

- Líneas <100 caracteres.
- Funciones <50 líneas; si una crece, extraé helpers.
- Imports en orden: stdlib → terceros → proyecto. Una línea en blanco entre grupos.
- Strings con doble comilla por default.
- Sin `print()` en producción; usá `logging` si hace falta debug.
