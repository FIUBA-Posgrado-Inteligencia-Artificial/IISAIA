# Skill de evaluación de entregas — Diseño

**Fecha:** 2026-06-22
**Estado:** Aprobado, listo para plan de implementación

## Problema

El curso (IISAIA, 24 alumnos activos) tuvo tres entregas: una **Bad UI** single-page, un **`openapi.yaml`** de una API inventada, y un **trabajo final** (frontend + backend desarrollado con Claude Code). No hubo criterio de evaluación formal durante el curso; la corrección es deliberadamente subjetiva e indulgente. Hace falta una skill que **organice los repos de los alumnos, verifique completitud de las entregas, junte evidencia y proponga una nota final** que el docente confirma.

Estado actual del material:
- `entregas/04-06_2026/` tiene **20 carpetas** (`NN-apellido/`), cada una un clone *shallow* en el estado de la entrega del Bad UI (mayo 2026). Los TPs de OpenAPI y final **no están** salvo `git pull`.
- Los remotes varían: algunos repos son mono-TP, otros son repos-paraguas con todo. El supuesto "un repo único con todo" **no se cumple para todos**.
- El CSV `Notas CEIA 22Co2025 - IISAIA.csv` tiene ~26 filas (24 alumnos + docente/dirección).
- `proyectos_presentados.txt` = alumnos que presentaron la **idea** del proyecto en clase.
- `proyectos_entregados.txt` = alumnos que presentaron la **versión final** en clase, con notas sueltas del docente ("buen uso de CC", "skills medio raros", "hooks").
- Ya existe filosofía de evaluación del Bad UI en `evaluacion_general.md` y un `evaluacion.md` por alumno.

## Alcance

**Pipeline completo de punta a punta:** sincronizar repos desde GitHub → localizar los 3 entregables → verificar completitud y juntar evidencia → proponer nota → confirmación humana → escribir notas.

La skill **evalúa completitud y junta evidencia; no juzga calidad de código**. La nota final la fija el docente en la fase de confirmación.

Enfoque elegido: **roster-first, batch + confirmación final** (una sola pasada sobre los 24, tabla comparativa para confirmar antes de fijar notas).

## Ubicación y artefactos

Skill **local al proyecto**, en `.claude/skills/grading/` (versionada con el repo, junto a `.claude/commands/`):
- `SKILL.md` — el procedimiento que se invoca.
- `rubric.md` — la regla de nota baseline-9 por defecto (números afinables), reusable para futuras cohortes.

La skill es genérica respecto de la cohorte; el directorio del curso a evaluar se le pasa como argumento (default: `entregas/04-06_2026/`).

Data y resultados de **esta** cohorte, en el proyecto bajo `entregas/04-06_2026/_resultados/`:
- `roster.md` — mapeo canónico alumno ↔ carpeta ↔ repo(s) ↔ presentaciones, generado/actualizado en la primera corrida.
- `<nombre-apellido>.md` — un informe por alumno.
- `tabla-maestra.md` — tabla comparativa de los 24 para confirmar.
- La columna `Nota` del CSV `Notas CEIA 22Co2025 - IISAIA.csv` se completa al final, tras confirmación.

`entregas/` está fuera de git → la skill **no commitea** resultados, solo escribe archivos.

## Convención de nombres de carpeta

Carpetas de alumnos en `nombre-apellido`: minúsculas, sin acentos, espacios→guiones, **primer nombre + primer apellido** (`lautaro-novoa`, `alan-calvet`, `gonzalo-vidal`, `camilo-vidal`, `fabio-vidal`, `juan-peralta`). Desambigua los tres "Vidal".

La skill **renombra las 20 carpetas existentes** (`01-novoa` → `lautaro-novoa`, …) en la fase de roster, y usa la misma convención para clones nuevos y para los informes `_resultados/<nombre-apellido>.md`.

## Flujo de 6 fases

### 1. Roster
Construye/actualiza `roster.md`, una fila por alumno con: `#`, nombre canónico, email, carpeta local (o vacío), repo URL(s) por TP, presentó-idea, presentó-final, comentario suelto del `.txt`.

- Fuentes: CSV (nombre canónico + email), carpetas locales, `git remote` de cada local, los dos `.txt`.
- El match de nombres informales de los `.txt` ("gus vidal" → Gonzalo Vidal) se hace por *fuzzy match* contra el CSV **al vuelo** (no se guarda columna de alias).
- Los casos dudosos de mapeo (ej. los tres "Vidal") se muestran al docente para confirmar antes de seguir.
- El roster queda escrito para que las próximas corridas sean incrementales.

### 2. Sync (híbrido email + pull)
Por alumno:
1. Busca en Gmail `from:<email-del-alumno>` → extrae URLs de GitHub y detecta avisos/excusas de presentación. **Solo se consideran correos cuyo remitente esté en la lista de emails del CSV.**
2. Si hay carpeta local con ese remote → `git fetch --unshallow` + `git pull`.
3. Si el alumno mandó un repo **distinto** para un TP posterior, o no tiene carpeta → **clona ese repo aparte** bajo el alumno.
4. Registra en el roster qué repo cubre qué TP.

Acceso git: los repos son públicos (a lo sumo uno privado cubierto por la sesión de GitHub del docente). La skill clona/pullea directo y **reporta los que fallen** por permisos.

### 3. Detección
Localiza entregables y junta evidencia en el/los repo(s) de cada alumno:

| Entregable | Señal de "presente" |
|-----------|---------------------|
| Bad UI | un `index.html` (raíz, `tp-bad-ui/`, `TP1/`, `actividad-01/`, etc.) |
| OpenAPI | `openapi.yaml` / `.yml` / `openapi.json` |
| Final – frontend | carpeta/app de frontend (HTML/JS/React/etc.) |
| Final – backend | carpeta/app de backend (FastAPI/Express/etc.) |
| Final – CLAUDE.md | un `CLAUDE.md` en el proyecto final |
| Feature con superpowers | `.claude/skills/`, `docs/superpowers/`, `spine.md`/`plan.md` del pipeline, menciones a brainstorming/writing-plans/executing en `prompts.md` o mensajes de commit, **+** la nota suelta del `.txt` |
| Presentación final | match en `proyectos_entregados.txt` |
| Presentación idea | match en `proyectos_presentados.txt` |

### 4. Nota sugerida
Aplica `rubric.md` y escribe el informe por alumno. La skill **nunca fija la nota sola**.

### 5. Confirmación
Presenta `tabla-maestra.md`; lista primero los **casos flag** uno por uno con contexto (incluida la cita del correo de excusa) para que el docente decida; permite overridear cualquier nota.

### 6. Cierre
Vuelca las notas confirmadas a la columna `Nota` del CSV (escribe el archivo, sin commit) y deja informes + tabla en `_resultados/`.

## Regla de nota (rubric.md)

Modelo **baseline-and-adjust**. Números de arranque (afinables, el docente overridea caso por caso):

- **Base 9/10** si están las 4 cosas: Bad UI ✓, OpenAPI ✓, Final completo (frontend + backend + CLAUDE.md) ✓, presentó el final en clase ✓.
- **10/10**: lo anterior **+** evidencia de feature hecho con superpowers.
- **Descuentos desde 9** (acumulables):
  - falta Bad UI: **−1**
  - falta OpenAPI: **−1**
  - falta CLAUDE.md en el final: **−1**
  - final incompleto (falta frontend *o* backend): **−2**
  - no presentó el final en clase: **−2**
  - no presentó la idea en clase: **−0.5**
  - no entregó proyecto final: cae a **~4** (piso bajo, lo confirma el docente)

Casos de **excusa por correo** (alumno avisó que no podía presentar la idea y/o el final, o mandó algo alternativo): **no se descuenta automático** — se marca como flag y el docente decide en el momento.

## Informe por alumno (`_resultados/<nombre-apellido>.md`)

Contiene:
- Checklist de los 5 entregables con ✓/✗ y dónde se encontró cada uno.
- Evidencia de superpowers citada (archivo/commit).
- Estado de las dos presentaciones.
- Correos relevantes encontrados (URLs + avisos/excusas, con fecha y cita corta).
- Nota sugerida con desglose de descuentos.
- Campo **"⚠ revisar"** si hay algo que requiere decisión del docente.

## Tabla maestra (`_resultados/tabla-maestra.md`)

Una fila por alumno; columnas: los 5 entregables (✓/✗), idea, final, superpowers, **nota sugerida**, y **flags** (excusa por mail, repo no encontrado, mapeo dudoso, final incompleto).

## Búsqueda de correos

Acotada a la lista de emails del CSV. Por alumno, `from:<email>` filtrando por:
- (a) URLs de GitHub/repos.
- (b) términos de aviso/excusa de presentación ("no voy a poder", "no puedo presentar", "aviso", "falta", "entrego por acá", etc.).

Para entregas en dupla (los `.txt` tienen duplas como "Alexis + Bárbara"), se cruza para ambos integrantes.

## Fuera de alcance

- No juzga calidad de código ni estética (la nota es de completitud + evidencia).
- No commitea resultados (viven en `entregas/`, fuera de git).
- No envía correos; a lo sumo los lee para detectar avisos.
