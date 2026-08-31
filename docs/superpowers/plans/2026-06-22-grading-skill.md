# Skill de evaluación de entregas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una skill local (`.claude/skills/grading/`) que sincronice los repos de los alumnos, verifique completitud de las 3 entregas, junte evidencia y proponga una nota final que el docente confirma.

**Architecture:** Un módulo Python puro y testeable (`grading_lib.py`) hace la parte determinística — parseo del CSV, match de nombres informales, detección de entregables en un repo, y cálculo de nota según la regla. Dos CLIs delgadas (`build_roster.py`, `detect.py`) lo usan para producir `roster.json` y `detections.json`. El `SKILL.md` orquesta las fases que requieren juicio o estado externo (búsqueda en Gmail, git pull/clone, renombrado de carpetas, render de informes, confirmación humana, escritura del CSV).

**Tech Stack:** Python 3.10+ (solo stdlib: `csv`, `pathlib`, `re`, `unicodedata`, `difflib`, `json`, `subprocess`). Tests con `unittest`. Ejecución con `uv run python`. Sin dependencias nuevas.

---

## File Structure

```
.claude/skills/grading/
├── SKILL.md                  # orquestación de las 6 fases (agent-driven)
├── rubric.md                 # la regla de nota baseline-9 (prosa + números)
└── scripts/
    ├── grading_lib.py        # funciones puras (parseo, match, detección, nota)
    ├── build_roster.py       # CLI: CSV + carpetas + remotes + txts → roster.json + roster.md
    ├── detect.py             # CLI: roster.json + repos → detections.json
    └── test_grading_lib.py   # unittest del módulo puro
```

Resultados (fuera de git, escritos en runtime) bajo `entregas/04-06_2026/_resultados/`:
`roster.json`, `roster.md`, `detections.json`, `<nombre-apellido>.md`, `tabla-maestra.md`.

## Contratos de datos

**roster.json**
```json
{
  "cohort_dir": "entregas/04-06_2026",
  "students": [
    {
      "id": "lautaro-novoa",
      "nombre": "Lautaro Antonino",
      "apellido": "Novoa",
      "email": "lautanovoa@example.com",
      "folder": "01-novoa",
      "repos": ["https://github.com/ejemplo-alumno/BadUI.git"],
      "presento_idea": false,
      "presento_final": true,
      "comentario": "monitoreo de medidores remotos de IoT"
    }
  ],
  "unmatched_presentations": ["juan peralta -> no entendi algo de pagina sobre clases"]
}
```

**detection dict** (lo que devuelve `detect_repo`, y cada entrada de `detections.json` con `id` agregado)
```json
{
  "bad_ui":   {"found": true, "path": "tp-bad-ui/index.html"},
  "openapi":  {"found": true, "path": "tp-openapi/openapi.yaml"},
  "final":    {"found": true},
  "frontend": {"found": true, "signal": "package.json: react"},
  "backend":  {"found": true, "signal": "requirements.txt: fastapi"},
  "claude_md":{"found": true, "path": "tp-final/CLAUDE.md"},
  "superpowers": {"found": true, "signals": [".claude/skills/", "docs/superpowers/"]}
}
```

**grade dict** (lo que devuelve `suggest_grade`)
```json
{"grade": 9.0, "breakdown": ["base 9", "-1 falta OpenAPI"]}
```

---

## Task 1: Scaffold de la skill + rubric.md

**Files:**
- Create: `.claude/skills/grading/SKILL.md` (placeholder header, se completa en Task 10)
- Create: `.claude/skills/grading/rubric.md`
- Create: `.claude/skills/grading/scripts/grading_lib.py` (vacío con docstring)

- [ ] **Step 1: Crear `rubric.md` con la regla completa**

```markdown
# Regla de nota — IISAIA

Modelo baseline-and-adjust. La skill **sugiere**; el docente confirma y overridea.

## Base
- **9/10** si están las 4 cosas: Bad UI, OpenAPI, proyecto final completo
  (frontend + backend + CLAUDE.md), y presentó el final en clase.
- **10/10**: lo anterior **+** evidencia de un feature hecho con superpowers.

## Descuentos (acumulables, desde 9)
| Situación | Ajuste |
|-----------|--------|
| Falta Bad UI | −1 |
| Falta OpenAPI | −1 |
| Falta CLAUDE.md en el final | −1 |
| Final incompleto (falta frontend o backend) | −2 |
| No presentó el final en clase | −2 |
| No presentó la idea en clase | −0.5 |
| No entregó proyecto final | nota cae a ~4 |

## Bonus superpowers
+1 (tope 10) solo si el núcleo está completo (Bad UI + OpenAPI + final
fe/be/CLAUDE.md + presentó final). Señales: `.claude/skills/`, `docs/superpowers/`,
menciones a brainstorming/writing-plans/executing-plans en prompts o commits,
o la nota suelta del docente en `proyectos_entregados.txt`.

## Excusas por correo
Si el alumno avisó por mail (desde un email del CSV) que no podía presentar la
idea y/o el final: **no se descuenta automático**. Se marca ⚠ y el docente decide.
La skill, al detectar una excusa, trata esa presentación como hecha para el cálculo
y agrega el flag.
```

- [ ] **Step 2: Crear `grading_lib.py` con docstring y constantes base**

```python
"""Funciones puras para evaluar entregas del curso IISAIA.

Sin efectos de lado ni dependencias externas: parseo de CSV, match de
nombres informales, deteccion de entregables en un repo y calculo de nota.
"""
from __future__ import annotations
import csv
import json
import re
import unicodedata
from pathlib import Path

# Directorios que nunca se escanean al detectar entregables.
IGNORE_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__",
               "dist", "build", ".next", ".cache"}
```

- [ ] **Step 3: Crear `SKILL.md` placeholder**

```markdown
---
name: grading
description: Use when grading student course deliverables — sincroniza repos, verifica completitud de las entregas, junta evidencia y propone una nota final que el docente confirma.
---

# Grading (placeholder — completar en Task 10)
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/grading
git commit -m "feat(grading): scaffold de la skill + rubric.md"
```

---

## Task 2: `normalize_name`

**Files:**
- Modify: `.claude/skills/grading/scripts/grading_lib.py`
- Test: `.claude/skills/grading/scripts/test_grading_lib.py`

- [ ] **Step 1: Escribir el test que falla**

```python
import unittest
from grading_lib import normalize_name

class TestNormalizeName(unittest.TestCase):
    def test_strips_accents_and_lowercases(self):
        self.assertEqual(normalize_name("José Miguel"), "jose miguel")

    def test_collapses_whitespace_and_tabs(self):
        self.assertEqual(normalize_name("Juan Miguel\t "), "juan miguel")

    def test_drops_punctuation(self):
        self.assertEqual(normalize_name("expensas (?)"), "expensas")

if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Correr el test y verlo fallar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: FAIL con `ImportError: cannot import name 'normalize_name'`

- [ ] **Step 3: Implementar `normalize_name`**

```python
def normalize_name(s: str) -> str:
    """minuscula, sin acentos, sin puntuacion, espacios colapsados."""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()
```

- [ ] **Step 4: Correr el test y verlo pasar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): normalize_name"
```

---

## Task 3: `slug` + `parse_roster_csv`

**Files:**
- Modify: `.claude/skills/grading/scripts/grading_lib.py`
- Test: `.claude/skills/grading/scripts/test_grading_lib.py`

- [ ] **Step 1: Escribir los tests que fallan**

Agregar a `test_grading_lib.py`:

```python
from grading_lib import slug, parse_roster_csv

CSV_SAMPLE = (
    "N° SIU,Nombre,Apellido,email,mod,Nota\n"
    "a1001,Alan Mariano,Calvet,alanmcalvet@example.com,a,\n"
    "a1002,Gonzalo Julián ,Vidal,gon.j.vidal@example.com,b,\n"
    "Docente,Nombre Docente,Apellido Docente,docente@example.com,,\n"
    "Grupo de Correos,,,grupo-correos@example.com,,\n"
)

class TestSlug(unittest.TestCase):
    def test_first_name_first_surname(self):
        self.assertEqual(slug("Alan Mariano", "Calvet"), "alan-calvet")

    def test_compound_surname_uses_first_token(self):
        self.assertEqual(slug("Camilo Alberto", "Vidal Arenas"), "camilo-vidal")

class TestParseRosterCsv(unittest.TestCase):
    def test_keeps_only_students_with_email_and_name(self):
        rows = parse_roster_csv(CSV_SAMPLE.splitlines())
        ids = [r["id"] for r in rows]
        self.assertEqual(ids, ["alan-calvet", "gonzalo-vidal"])

    def test_excludes_docente_and_grupo_rows(self):
        rows = parse_roster_csv(CSV_SAMPLE.splitlines())
        emails = [r["email"] for r in rows]
        self.assertNotIn("docente@example.com", emails)
        self.assertNotIn("grupo-correos@example.com", emails)

    def test_trims_trailing_spaces_in_names(self):
        rows = parse_roster_csv(CSV_SAMPLE.splitlines())
        self.assertEqual(rows[1]["nombre"], "Gonzalo Julián")
```

- [ ] **Step 2: Correr y ver fallar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: FAIL con `ImportError: cannot import name 'slug'`

- [ ] **Step 3: Implementar `slug` y `parse_roster_csv`**

```python
# Filas del CSV que no son alumnos (primera columna).
_NON_STUDENT_FIRST_COL = {
    "n° siu", "docente", "direccion", "dirección",
    "grupo de correos", "carpeta de grabaciones de clases",
    "materia", "encuesta clase a clase",
}


def slug(nombre: str, apellido: str) -> str:
    n = normalize_name(nombre).split()
    a = normalize_name(apellido).split()
    first = n[0] if n else ""
    last = a[0] if a else ""
    return f"{first}-{last}".strip("-")


def parse_roster_csv(lines) -> list[dict]:
    """Devuelve un dict por alumno: id, nombre, apellido, email."""
    out = []
    reader = csv.reader(lines)
    for row in reader:
        if len(row) < 4:
            continue
        first_col = normalize_name(row[0])
        if first_col in {normalize_name(x) for x in _NON_STUDENT_FIRST_COL}:
            continue
        nombre, apellido, email = row[1].strip(), row[2].strip(), row[3].strip()
        if not (nombre and apellido and "@" in email):
            continue
        out.append({
            "id": slug(nombre, apellido),
            "nombre": nombre,
            "apellido": apellido,
            "email": email,
        })
    return out
```

- [ ] **Step 4: Correr y ver pasar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): slug + parse_roster_csv"
```

---

## Task 4: `parse_presentations`

**Files:**
- Modify: `.claude/skills/grading/scripts/grading_lib.py`
- Test: `.claude/skills/grading/scripts/test_grading_lib.py`

Parsea los `.txt`: cada "entrada" es un bloque separado por línea(s) en blanco; la primera línea no vacía del bloque es el/los nombre(s) (posible dupla con `+`), las siguientes son el comentario.

- [ ] **Step 1: Escribir los tests que fallan**

```python
from grading_lib import parse_presentations

ENTREGADOS = """proyectos entregados

aitana gorriti
gestion de guardia hospitalaria
buen uso de CC

gonzalo vidal + ramiro di estefano
gestion de riesgos
skills medio raros
"""

class TestParsePresentations(unittest.TestCase):
    def test_returns_one_entry_per_block(self):
        entries = parse_presentations(ENTREGADOS, title="proyectos entregados")
        self.assertEqual(len(entries), 2)

    def test_splits_duo_names(self):
        entries = parse_presentations(ENTREGADOS, title="proyectos entregados")
        self.assertEqual(entries[1]["names"], ["gonzalo vidal", "ramiro di estefano"])

    def test_keeps_comment_lines(self):
        entries = parse_presentations(ENTREGADOS, title="proyectos entregados")
        self.assertEqual(entries[0]["comment"], "gestion de guardia hospitalaria | buen uso de CC")
```

- [ ] **Step 2: Correr y ver fallar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: FAIL con `ImportError: cannot import name 'parse_presentations'`

- [ ] **Step 3: Implementar `parse_presentations`**

```python
def parse_presentations(text: str, title: str = "") -> list[dict]:
    """Cada bloque (separado por linea en blanco) -> {names: [...], comment: str}.

    La primera linea del bloque son nombres (dupla con '+'); el resto, comentario.
    Se ignora el bloque/linea de titulo.
    """
    entries = []
    blocks = re.split(r"\n\s*\n", text.strip())
    norm_title = normalize_name(title)
    for block in blocks:
        lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
        if not lines:
            continue
        if normalize_name(lines[0]) == norm_title:
            lines = lines[1:]
        if not lines:
            continue
        names = [n.strip() for n in lines[0].split("+") if n.strip()]
        comment = " | ".join(lines[1:])
        entries.append({"names": names, "comment": comment})
    return entries
```

- [ ] **Step 4: Correr y ver pasar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): parse_presentations"
```

---

## Task 5: `match_name` (fuzzy match contra el roster)

**Files:**
- Modify: `.claude/skills/grading/scripts/grading_lib.py`
- Test: `.claude/skills/grading/scripts/test_grading_lib.py`

Mapea un nombre informal de los `.txt` al `id` del alumno. Estrategia: por token de apellido (único → match), desambiguando por nombre cuando el apellido colisiona (los tres "Vidal"). Devuelve `(id, "ok")`, `(None, "none")`, o `([ids], "ambiguous")`.

- [ ] **Step 1: Escribir los tests que fallan**

```python
from grading_lib import match_name

STUDENTS = [
    {"id": "gonzalo-vidal", "nombre": "Gonzalo Julián", "apellido": "Vidal"},
    {"id": "camilo-vidal",  "nombre": "Camilo Alberto", "apellido": "Vidal Arenas"},
    {"id": "fabio-vidal", "nombre": "Fabio",        "apellido": "Vidal"},
    {"id": "nolberto-ugarte", "nombre": "Nolberto Ronald José", "apellido": "Ugarte"},
    {"id": "aitana-gorriti", "nombre": "Aitana Nerea", "apellido": "Gorriti"},
    {"id": "julio-diez", "nombre": "Julio Luis", "apellido": "Diez"},
]

class TestMatchName(unittest.TestCase):
    def test_unique_surname(self):
        self.assertEqual(match_name("ronald ugarte", STUDENTS), ("nolberto-ugarte", "ok"))

    def test_first_name_only(self):
        self.assertEqual(match_name("Aitana", STUDENTS), ("aitana-gorriti", "ok"))

    def test_colliding_surname_disambiguated_by_first_name(self):
        self.assertEqual(match_name("gon vidal", STUDENTS), ("gonzalo-vidal", "ok"))
        self.assertEqual(match_name("fabio vidal", STUDENTS), ("fabio-vidal", "ok"))

    def test_no_match(self):
        self.assertEqual(match_name("pedro perez", STUDENTS), (None, "none"))

    def test_ambiguous_returns_candidates(self):
        # Solo "vidal" sin nombre que desambigue.
        result, status = match_name("vidal", STUDENTS)
        self.assertEqual(status, "ambiguous")
        self.assertEqual(set(result), {"gonzalo-vidal", "camilo-vidal", "fabio-vidal"})
```

- [ ] **Step 2: Correr y ver fallar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: FAIL con `ImportError: cannot import name 'match_name'`

- [ ] **Step 3: Implementar `match_name`**

```python
def _surname_tokens(student: dict) -> set[str]:
    return set(normalize_name(student["apellido"]).split())


def _firstname_tokens(student: dict) -> set[str]:
    return set(normalize_name(student["nombre"]).split())


def match_name(text: str, students: list[dict]):
    """Devuelve (id, 'ok') | (None, 'none') | ([ids], 'ambiguous')."""
    tokens = set(normalize_name(text).split())
    # Candidatos: comparten al menos un token de apellido.
    by_surname = [s for s in students if _surname_tokens(s) & tokens]
    if not by_surname:
        # Fallback: match por nombre de pila unico (ej. "Aitana").
        by_first = [s for s in students if _firstname_tokens(s) & tokens]
        if len(by_first) == 1:
            return (by_first[0]["id"], "ok")
        return (None, "none") if not by_first else ([s["id"] for s in by_first], "ambiguous")
    if len(by_surname) == 1:
        return (by_surname[0]["id"], "ok")
    # Apellido colisiona: desambiguar por token de nombre de pila.
    narrowed = [s for s in by_surname if _firstname_tokens(s) & tokens]
    if len(narrowed) == 1:
        return (narrowed[0]["id"], "ok")
    candidates = narrowed or by_surname
    return ([s["id"] for s in candidates], "ambiguous")
```

Nota: "gon vidal" → `_firstname_tokens` de Gonzalo incluye "gonzalo" pero el token es "gon", que no matchea exacto. Para cubrirlo, ampliar el match de nombre con prefijo:

```python
def _firstname_match(tokens: set[str], student: dict) -> bool:
    fn = _firstname_tokens(student)
    if fn & tokens:
        return True
    # prefijo: "gon" matchea "gonzalo"
    return any(f.startswith(t) or t.startswith(f)
               for f in fn for t in tokens if len(t) >= 3)
```

Usar `_firstname_match(tokens, s)` en lugar de `_firstname_tokens(s) & tokens` en ambos lugares de `match_name`.

- [ ] **Step 4: Correr y ver pasar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS (incluye el caso "gon vidal")

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): match_name con desambiguacion por nombre"
```

---

## Task 6: `build_roster.py` (CLI) + corrida real

**Files:**
- Create: `.claude/skills/grading/scripts/build_roster.py`
- Modify: `.claude/skills/grading/scripts/grading_lib.py` (agregar `load_roster`)

- [ ] **Step 1: Agregar `git_remote` y `build_roster` a `grading_lib.py`**

```python
import subprocess


def git_remote(repo_path: Path) -> str | None:
    try:
        out = subprocess.run(
            ["git", "-C", str(repo_path), "remote", "get-url", "origin"],
            capture_output=True, text=True, timeout=15)
        url = out.stdout.strip()
        return url or None
    except Exception:
        return None


def build_roster(cohort_dir: Path) -> dict:
    """Une CSV + carpetas locales + git remotes + los dos .txt en un roster."""
    csv_path = next(cohort_dir.glob("Notas*IISAIA*.csv"))
    students = parse_roster_csv(csv_path.read_text(encoding="utf-8").splitlines())
    by_id = {s["id"]: s for s in students}
    for s in students:
        s.setdefault("folder", None)
        s.setdefault("repos", [])
        s["presento_idea"] = False
        s["presento_final"] = False
        s["comentario"] = ""

    # Carpetas locales NN-apellido -> match por apellido.
    for d in sorted(p for p in cohort_dir.iterdir() if p.is_dir()
                    and re.match(r"\d\d-", p.name)):
        surname = d.name.split("-", 1)[1]
        sid, status = match_name(surname, students)
        if status == "ok":
            by_id[sid]["folder"] = d.name
            remote = git_remote(d)
            if remote and remote not in by_id[sid]["repos"]:
                by_id[sid]["repos"].append(remote)

    unmatched = []
    for fname, flag in [("proyectos_presentados.txt", "presento_idea"),
                        ("proyectos_entregados.txt", "presento_final")]:
        fpath = cohort_dir / fname
        if not fpath.exists():
            continue
        title = fname.replace("_", " ").replace(".txt", "")
        for entry in parse_presentations(fpath.read_text(encoding="utf-8"), title=title):
            for name in entry["names"]:
                sid, status = match_name(name, students)
                if status == "ok":
                    by_id[sid][flag] = True
                    if entry["comment"]:
                        by_id[sid]["comentario"] = entry["comment"]
                else:
                    unmatched.append(f"{name} -> {entry['comment']} ({status})")

    return {"cohort_dir": str(cohort_dir), "students": students,
            "unmatched_presentations": unmatched}


def load_roster(results_dir: Path) -> dict:
    return json.loads((results_dir / "roster.json").read_text(encoding="utf-8"))
```

- [ ] **Step 2: Escribir `build_roster.py` (CLI que escribe roster.json + roster.md)**

```python
"""CLI: construye roster.json y roster.md para una cohorte.

Uso: uv run python build_roster.py <cohort_dir>
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grading_lib import build_roster  # noqa: E402


def render_md(roster: dict) -> str:
    rows = ["# Roster", "",
            "| id | email | carpeta | repos | idea | final | comentario |",
            "|----|-------|---------|-------|------|-------|------------|"]
    for s in roster["students"]:
        rows.append("| {id} | {email} | {folder} | {repos} | {idea} | {final} | {com} |".format(
            id=s["id"], email=s["email"], folder=s["folder"] or "—",
            repos="<br>".join(s["repos"]) or "—",
            idea="✓" if s["presento_idea"] else "—",
            final="✓" if s["presento_final"] else "—",
            com=s["comentario"] or ""))
    if roster["unmatched_presentations"]:
        rows += ["", "## Presentaciones sin match (revisar)", ""]
        rows += [f"- {u}" for u in roster["unmatched_presentations"]]
    return "\n".join(rows) + "\n"


def main():
    cohort_dir = Path(sys.argv[1])
    results = cohort_dir / "_resultados"
    results.mkdir(exist_ok=True)
    roster = build_roster(cohort_dir)
    (results / "roster.json").write_text(json.dumps(roster, ensure_ascii=False, indent=2), encoding="utf-8")
    (results / "roster.md").write_text(render_md(roster), encoding="utf-8")
    print(f"{len(roster['students'])} alumnos; "
          f"{len(roster['unmatched_presentations'])} presentaciones sin match")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Correr contra la cohorte real**

Run: `cd .claude/skills/grading/scripts && uv run python build_roster.py ../../../../entregas/04-06_2026`
Expected: imprime ~24 alumnos y la cuenta de sin-match. Crea `entregas/04-06_2026/_resultados/roster.json` y `roster.md`.

- [ ] **Step 4: Inspeccionar `roster.md` y verificar el mapeo**

Abrir `entregas/04-06_2026/_resultados/roster.md`. Verificar a ojo: los tres Vidal con su carpeta correcta, las duplas de presentación bien asignadas, y revisar la sección "sin match". Si hay un mapeo mal, anotarlo (se corrige a mano en la fase de confirmación de la skill, no en el código).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): build_roster.py + corrida real"
```

---

## Task 7: `detect_repo` (detección de entregables)

**Files:**
- Modify: `.claude/skills/grading/scripts/grading_lib.py`
- Test: `.claude/skills/grading/scripts/test_grading_lib.py`

- [ ] **Step 1: Escribir los tests que fallan (con fixtures en temp dir)**

```python
import tempfile
from pathlib import Path
from grading_lib import detect_repo

def _make_repo(files: dict) -> Path:
    d = Path(tempfile.mkdtemp())
    for rel, content in files.items():
        p = d / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
    return d

class TestDetectRepo(unittest.TestCase):
    def test_bad_ui_and_openapi(self):
        repo = _make_repo({
            "tp-bad-ui/index.html": "<html><body>bad</body></html>",
            "tp-openapi/openapi.yaml": "openapi: 3.0.0\n",
        })
        d = detect_repo(repo)
        self.assertTrue(d["bad_ui"]["found"])
        self.assertTrue(d["openapi"]["found"])

    def test_final_frontend_backend_claude(self):
        repo = _make_repo({
            "final/frontend/package.json": '{"dependencies":{"react":"18"}}',
            "final/backend/requirements.txt": "fastapi\nuvicorn\n",
            "final/CLAUDE.md": "# proyecto\n",
        })
        d = detect_repo(repo)
        self.assertTrue(d["frontend"]["found"])
        self.assertTrue(d["backend"]["found"])
        self.assertTrue(d["claude_md"]["found"])
        self.assertTrue(d["final"]["found"])

    def test_superpowers_signals(self):
        repo = _make_repo({
            ".claude/skills/foo/SKILL.md": "x",
            "prompts.md": "use the brainstorming skill then writing-plans",
        })
        d = detect_repo(repo)
        self.assertTrue(d["superpowers"]["found"])

    def test_ignores_vendor_dirs(self):
        repo = _make_repo({
            "node_modules/pkg/openapi.yaml": "openapi: 3.0.0",
            "README.md": "nada",
        })
        d = detect_repo(repo)
        self.assertFalse(d["openapi"]["found"])
        self.assertFalse(d["bad_ui"]["found"])
```

- [ ] **Step 2: Correr y ver fallar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: FAIL con `ImportError: cannot import name 'detect_repo'`

- [ ] **Step 3: Implementar `detect_repo` y helpers**

```python
def _walk(repo: Path):
    """Itera archivos saltando IGNORE_DIRS."""
    for p in repo.rglob("*"):
        if any(part in IGNORE_DIRS for part in p.parts):
            continue
        if p.is_file():
            yield p


def _rel(repo: Path, p: Path) -> str:
    return p.relative_to(repo).as_posix()


_FRONT_FRAMEWORKS = ("react", "vue", "vite", "next", "svelte", "angular")
_BACK_FRAMEWORKS = ("fastapi", "flask", "django", "uvicorn", "express", "fastify")


def detect_repo(repo: Path) -> dict:
    repo = Path(repo)
    files = list(_walk(repo))

    def first(pred):
        for p in files:
            if pred(p):
                return p
        return None

    bad = first(lambda p: p.name.lower() == "index.html")
    api = first(lambda p: re.fullmatch(r"openapi\.(ya?ml|json)", p.name.lower())) \
        or first(lambda p: p.suffix.lower() in {".yaml", ".yml"}
                 and "openapi:" in _safe_read(p))
    claude = first(lambda p: p.name.lower() == "claude.md")

    front_sig = _framework_signal(files, _FRONT_FRAMEWORKS,
                                  extra_ext={".jsx", ".tsx", ".vue"})
    back_sig = _framework_signal(files, _BACK_FRAMEWORKS, extra_ext=set())

    sp_signals = _superpowers_signals(repo, files)

    return {
        "bad_ui":   {"found": bad is not None, "path": _rel(repo, bad) if bad else None},
        "openapi":  {"found": api is not None, "path": _rel(repo, api) if api else None},
        "frontend": {"found": front_sig is not None, "signal": front_sig},
        "backend":  {"found": back_sig is not None, "signal": back_sig},
        "claude_md":{"found": claude is not None, "path": _rel(repo, claude) if claude else None},
        "final":    {"found": front_sig is not None or back_sig is not None},
        "superpowers": {"found": bool(sp_signals), "signals": sp_signals},
    }


def _safe_read(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def _framework_signal(files, frameworks, extra_ext):
    for p in files:
        if p.suffix.lower() in extra_ext:
            return f"{p.name}"
        if p.name in {"package.json", "requirements.txt", "pyproject.toml"}:
            content = _safe_read(p).lower()
            for fw in frameworks:
                if fw in content:
                    return f"{p.name}: {fw}"
    return None


def _superpowers_signals(repo: Path, files) -> list[str]:
    signals = []
    skills_dir = repo / ".claude" / "skills"
    if skills_dir.is_dir() and any(skills_dir.iterdir()):
        signals.append(".claude/skills/")
    if (repo / "docs" / "superpowers").is_dir():
        signals.append("docs/superpowers/")
    terms = ("brainstorming", "writing-plans", "executing-plans",
             "subagent-driven", "superpowers")
    for p in files:
        if p.suffix.lower() == ".md":
            content = _safe_read(p).lower()
            for t in terms:
                if t in content:
                    signals.append(f"{_rel(repo, p)}: '{t}'")
                    return signals  # una mención alcanza
    return signals
```

- [ ] **Step 4: Correr y ver pasar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): detect_repo"
```

---

## Task 8: `suggest_grade`

**Files:**
- Modify: `.claude/skills/grading/scripts/grading_lib.py`
- Test: `.claude/skills/grading/scripts/test_grading_lib.py`

- [ ] **Step 1: Escribir los tests que fallan**

```python
from grading_lib import suggest_grade

def _full_detection():
    return {
        "bad_ui": {"found": True}, "openapi": {"found": True},
        "frontend": {"found": True}, "backend": {"found": True},
        "claude_md": {"found": True}, "final": {"found": True},
        "superpowers": {"found": False, "signals": []},
    }

class TestSuggestGrade(unittest.TestCase):
    def test_baseline_nine(self):
        flags = {"presento_final": True, "presento_idea": True}
        self.assertEqual(suggest_grade(_full_detection(), flags)["grade"], 9.0)

    def test_superpowers_bonus_to_ten(self):
        det = _full_detection(); det["superpowers"]["found"] = True
        flags = {"presento_final": True, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 10.0)

    def test_missing_openapi_minus_one(self):
        det = _full_detection(); det["openapi"]["found"] = False
        flags = {"presento_final": True, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 8.0)

    def test_no_idea_minus_half(self):
        flags = {"presento_final": True, "presento_idea": False}
        self.assertEqual(suggest_grade(_full_detection(), flags)["grade"], 8.5)

    def test_no_final_floor_four(self):
        det = _full_detection()
        det["frontend"]["found"] = False; det["backend"]["found"] = False
        det["final"]["found"] = False; det["claude_md"]["found"] = False
        flags = {"presento_final": False, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 4.0)

    def test_superpowers_no_bonus_when_incomplete(self):
        det = _full_detection(); det["superpowers"]["found"] = True
        det["openapi"]["found"] = False
        flags = {"presento_final": True, "presento_idea": True}
        # nucleo incompleto -> sin bonus
        self.assertEqual(suggest_grade(det, flags)["grade"], 8.0)
```

- [ ] **Step 2: Correr y ver fallar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: FAIL con `ImportError: cannot import name 'suggest_grade'`

- [ ] **Step 3: Implementar `suggest_grade`**

```python
def suggest_grade(det: dict, flags: dict) -> dict:
    """flags: presento_final, presento_idea (ya con excusa contemplada por el agente)."""
    breakdown = []
    final_ok = det["final"]["found"]

    if not final_ok:
        grade = 4.0
        breakdown.append("sin proyecto final -> piso 4")
    else:
        grade = 9.0
        breakdown.append("base 9")
        if not det["bad_ui"]["found"]:
            grade -= 1; breakdown.append("-1 falta Bad UI")
        if not det["openapi"]["found"]:
            grade -= 1; breakdown.append("-1 falta OpenAPI")
        if not det["claude_md"]["found"]:
            grade -= 1; breakdown.append("-1 falta CLAUDE.md")
        if not (det["frontend"]["found"] and det["backend"]["found"]):
            grade -= 2; breakdown.append("-2 final incompleto (falta frontend o backend)")

    if not flags.get("presento_final"):
        grade -= 2; breakdown.append("-2 no presento el final")
    if not flags.get("presento_idea"):
        grade -= 0.5; breakdown.append("-0.5 no presento la idea")

    core_complete = (final_ok and det["bad_ui"]["found"] and det["openapi"]["found"]
                     and det["frontend"]["found"] and det["backend"]["found"]
                     and det["claude_md"]["found"] and flags.get("presento_final"))
    if det["superpowers"]["found"] and core_complete:
        grade = min(10.0, grade + 1)
        breakdown.append("+1 feature con superpowers")

    grade = max(1.0, min(10.0, grade))
    return {"grade": grade, "breakdown": breakdown}
```

- [ ] **Step 4: Correr y ver pasar**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS (toda la suite)

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): suggest_grade"
```

---

## Task 9: `detect.py` (CLI) + corrida real

**Files:**
- Create: `.claude/skills/grading/scripts/detect.py`

Recorre el roster, detecta entregables en la(s) carpeta(s) local(es) de cada alumno, calcula la nota sugerida y escribe `detections.json`. Si un alumno tiene varios repos, fusiona: un entregable está "found" si aparece en alguno.

- [ ] **Step 1: Agregar `merge_detections` a `grading_lib.py`**

```python
def merge_detections(dets: list[dict]) -> dict:
    """Fusiona detecciones de varios repos: found=True si alguno lo tiene."""
    if not dets:
        return detect_repo_empty()
    keys = ["bad_ui", "openapi", "frontend", "backend", "claude_md", "final"]
    out = {}
    for k in keys:
        hit = next((d[k] for d in dets if d[k]["found"]), dets[0][k])
        out[k] = hit
    sp = [s for d in dets for s in d["superpowers"]["signals"]]
    out["superpowers"] = {"found": bool(sp), "signals": sp}
    return out


def detect_repo_empty() -> dict:
    z = lambda extra=None: {"found": False, **(extra or {})}
    return {"bad_ui": z({"path": None}), "openapi": z({"path": None}),
            "frontend": z({"signal": None}), "backend": z({"signal": None}),
            "claude_md": z({"path": None}), "final": z(),
            "superpowers": {"found": False, "signals": []}}
```

- [ ] **Step 2: Escribir `detect.py`**

```python
"""CLI: detecta entregables y calcula nota sugerida para cada alumno del roster.

Uso: uv run python detect.py <cohort_dir>
Lee <cohort_dir>/_resultados/roster.json, escribe detections.json.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grading_lib import (detect_repo, merge_detections, suggest_grade,  # noqa: E402
                         detect_repo_empty)


def main():
    cohort_dir = Path(sys.argv[1])
    results = cohort_dir / "_resultados"
    roster = json.loads((results / "roster.json").read_text(encoding="utf-8"))

    out = []
    for s in roster["students"]:
        dets = []
        if s.get("folder"):
            folder = cohort_dir / s["folder"]
            if folder.is_dir():
                dets.append(detect_repo(folder))
        det = merge_detections(dets) if dets else detect_repo_empty()
        flags = {"presento_final": s["presento_final"], "presento_idea": s["presento_idea"]}
        grade = suggest_grade(det, flags)
        out.append({"id": s["id"], "detection": det, "grade": grade,
                    "no_local_repo": not dets})

    (results / "detections.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(out)} alumnos evaluados; "
          f"{sum(1 for o in out if o['no_local_repo'])} sin repo local")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Correr contra la cohorte real**

Run: `cd .claude/skills/grading/scripts && uv run python detect.py ../../../../entregas/04-06_2026`
Expected: imprime los 24 evaluados y cuántos sin repo local. Crea `_resultados/detections.json`.

- [ ] **Step 4: Inspeccionar `detections.json`**

Abrir `_resultados/detections.json`. Sanity check: Alan Calvet (carpeta `10-calvet`) debe tener `bad_ui.found=true`. La mayoría tendrá `final.found=false` y `openapi.found=false` porque las carpetas locales están en el estado del Bad UI (mayo) — eso es esperado, se corrige cuando la skill hace `git pull` en runtime. Confirmar que no hay tracebacks.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/grading/scripts
git commit -m "feat(grading): detect.py + corrida real"
```

---

## Task 10: `SKILL.md` (orquestación de las 6 fases)

**Files:**
- Modify: `.claude/skills/grading/SKILL.md`

- [ ] **Step 1: Escribir el `SKILL.md` completo**

```markdown
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
```

- [ ] **Step 2: Verificar el frontmatter de la skill**

Run: `uv run python -c "import re,sys; t=open('.claude/skills/grading/SKILL.md',encoding='utf-8').read(); m=re.match(r'^---\n(.*?)\n---', t, re.S); print('OK' if m and 'name: grading' in m.group(1) else 'BAD')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/grading/SKILL.md
git commit -m "feat(grading): SKILL.md con las 6 fases"
```

---

## Task 11: Validación end-to-end (suite + dry run)

**Files:** (ninguno nuevo)

- [ ] **Step 1: Correr toda la suite de tests**

Run: `cd .claude/skills/grading/scripts && uv run python -m unittest test_grading_lib.py -v`
Expected: PASS, todos los tests de las Tasks 2-8.

- [ ] **Step 2: Regenerar roster y detección de punta a punta**

Run:
```bash
cd .claude/skills/grading/scripts
uv run python build_roster.py ../../../../entregas/04-06_2026
uv run python detect.py ../../../../entregas/04-06_2026
```
Expected: ambos imprimen sus resúmenes sin tracebacks; `_resultados/` tiene `roster.json`, `roster.md`, `detections.json`.

- [ ] **Step 3: Revisión final con el docente**

Mostrar `roster.md` y un par de entradas de `detections.json`. Confirmar que el mapeo
de nombres y la detección del Bad UI son correctos antes de dar por cerrada la
implementación. (El sync por Gmail + pull es runtime de la skill, no parte de esta
validación.)

- [ ] **Step 4: Commit final**

```bash
git add -A .claude/skills/grading docs/superpowers/plans
git commit -m "feat(grading): skill de evaluacion completa"
```

---

## Self-Review (cubierto)

- **Cobertura del spec:** roster (T2-T6), sync Gmail+git (SKILL.md F2), convención nombre-apellido (slug T3 + rename F2), detección de los 5 entregables + superpowers (T7), regla baseline-9 con todos los descuentos e idea −0.5 y excusas (T8 + rubric.md), informes por alumno + tabla maestra + flags (SKILL.md F4-F5), CSV writeback sin commit (F6), Gmail acotado al CSV (F2).
- **Sin placeholders:** todo el código está completo.
- **Consistencia de tipos:** `detection dict` con las mismas claves en `detect_repo`, `merge_detections`, `detect_repo_empty`, `suggest_grade` y los tests.
