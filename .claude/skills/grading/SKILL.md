---
name: grading
description: Use when grading student course deliverables (IISAIA u otra cohorte) — sincroniza repos, verifica completitud de Bad UI / OpenAPI / proyecto final, junta evidencia de superpowers, propone una nota final que el docente confirma y la escribe en el CSV de notas.
---

# Grading — evaluación de entregas

Evalúa **completitud y evidencia**, no calidad de código. Propone una nota; el
docente confirma. Regla de nota en `rubric.md`.

**Argumento:** directorio de la cohorte (default `entregas/04-06_2026`). Resultados
en `<cohort_dir>/_resultados/`.

## Fase 1 — Roster
1. Correr: `cd .claude/skills/grading/scripts && uv run python build_roster.py <cohort_dir_abs>`
2. Abrir `_resultados/roster.md`. Revisar con el docente la sección "Presentaciones
   sin match" y cualquier mapeo dudoso (los tres Vidal, duplas). Corregir a mano en
   `roster.json` si hace falta y regenerar `roster.md` (o editar ambos).

## Fase 2 — Sync (Gmail + git)
Para cada alumno del roster:
1. **Gmail** (acotado a la lista del CSV): buscar `from:<email>` con
   `search_threads`. Extraer URLs de GitHub de los cuerpos (`get_thread`). Buscar
   también avisos/excusas de presentación (términos: "no voy a poder",
   "no puedo presentar", "aviso", "no podré", "entrego por", "falta"). Registrar en
   el informe del alumno (fecha + cita corta). **Solo correos cuyo remitente esté en
   el CSV.**
2. Agregar a `roster.json` las URLs nuevas encontradas (campo `repos`).
3. **git**: por cada repo del alumno:
   - si ya hay carpeta local con ese remote → `git -C <folder> fetch --unshallow`
     (ignorar error si ya completo) y `git -C <folder> pull --ff-only`.
   - si es un repo distinto o no hay carpeta → `git clone <url> <cohort>/<id>` (o
     `<id>-<n>` si hay varios). Repos públicos; uno puede ser privado y lo cubre la
     sesión de GitHub. Reportar los que fallen.
4. **Renombrar** las carpetas `NN-apellido` existentes a `<id>` (nombre-apellido) y
   actualizar `folder` en `roster.json`.

## Fase 3 — Detección
Correr: `uv run python detect.py <cohort_dir_abs>`. Produce `detections.json` con
entregables + nota sugerida por alumno.

## Fase 4 — Informes
Para cada alumno, escribir `_resultados/<id>.md` combinando `detections.json` con los
hallazgos de Gmail: checklist de los 5 entregables (✓/✗ + path), evidencia de
superpowers citada, estado de las dos presentaciones, correos relevantes (con cita),
nota sugerida + desglose, y un campo **⚠ revisar** si hay excusa por mail, repo no
encontrado, mapeo dudoso o final incompleto.

**Excusas:** si un alumno avisó por mail que no presentaba, setear `presento_final`/
`presento_idea` a `true` en `roster.json` (para no descontar) y volver a correr
`detect.py`, dejando el ⚠ en el informe.

## Fase 5 — Tabla maestra + confirmación
1. Escribir `_resultados/tabla-maestra.md`: una fila por alumno; columnas = Bad UI,
   OpenAPI, frontend, backend, CLAUDE.md, idea, final, superpowers, **nota sugerida**,
   **flags**.
2. Presentar la tabla al docente. Listar primero los casos con flag, uno por uno con
   su contexto (incluida la cita del correo). Tomar overrides de nota.

## Fase 6 — Cierre
Tras la confirmación, escribir la nota final de cada alumno en la columna `Nota` del
CSV `Notas ... IISAIA.csv` (match por email). **No commitear** (entregas/ está fuera
de git). Dejar informes y tabla en `_resultados/`.
