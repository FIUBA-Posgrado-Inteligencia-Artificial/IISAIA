"""Funciones puras para evaluar entregas del curso IISAIA.

Sin efectos de lado ni dependencias externas: parseo de CSV, match de
nombres informales, deteccion de entregables en un repo y calculo de nota.
"""
from __future__ import annotations
import csv
import difflib
import json
import re
import subprocess
import unicodedata
from pathlib import Path

# Particulas de apellido que no se toman como token principal del slug.
_PARTICLES = {"de", "del", "la", "las", "los", "di", "da", "du",
              "van", "von", "der", "dos", "das"}

# Directorios que nunca se escanean al detectar entregables.
IGNORE_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__",
               "dist", "build", ".next", ".cache"}

# Filas del CSV que no son alumnos (primera columna).
_NON_STUDENT_FIRST_COL = {
    "n° siu", "docente", "direccion", "dirección",
    "grupo de correos", "carpeta de grabaciones de clases",
    "materia", "encuesta clase a clase",
}

_FRONT_FRAMEWORKS = ("react", "vue", "vite", "next", "svelte", "angular")
_BACK_FRAMEWORKS = ("fastapi", "flask", "django", "uvicorn", "express", "fastify")


# --------------------------------------------------------------------------- #
# Nombres
# --------------------------------------------------------------------------- #
def normalize_name(s: str) -> str:
    """minuscula, sin acentos, sin puntuacion, espacios colapsados."""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slug(nombre: str, apellido: str) -> str:
    n = normalize_name(nombre).split()
    a = normalize_name(apellido).split()
    first = n[0] if n else ""
    if a and a[0] in _PARTICLES:
        last = "".join(a)        # "di estefano" -> "diestefano"
    else:
        last = a[0] if a else ""
    return f"{first}-{last}".strip("-")


def parse_roster_csv(lines) -> list[dict]:
    """Devuelve un dict por alumno: id, nombre, apellido, email."""
    out = []
    non_student = {normalize_name(x) for x in _NON_STUDENT_FIRST_COL}
    reader = csv.reader(lines)
    for row in reader:
        if len(row) < 4:
            continue
        if normalize_name(row[0]) in non_student:
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


def _surname_tokens(student: dict) -> set:
    return set(normalize_name(student["apellido"]).split())


def _firstname_tokens(student: dict) -> set:
    return set(normalize_name(student["nombre"]).split())


def _firstname_match(tokens: set, student: dict) -> bool:
    fn = _firstname_tokens(student)
    if fn & tokens:
        return True
    # prefijo: "gus" matchea "gonzalo"
    return any(f.startswith(t) or t.startswith(f)
               for f in fn for t in tokens if len(t) >= 3)


def _surname_match(tokens: set, student: dict) -> bool:
    """Apellido por token exacto, substring (>=4 chars) o fuzzy (>=0.85)."""
    sur = _surname_tokens(student)
    if sur & tokens:
        return True
    for s in sur:
        for t in tokens:
            if len(t) >= 4 and len(s) >= 4 and (t in s or s in t):
                return True
            if len(t) >= 4 and len(s) >= 4 and \
                    difflib.SequenceMatcher(None, s, t).ratio() >= 0.85:
                return True
    return False


def match_name(text: str, students: list[dict]):
    """Devuelve (id, 'ok') | (None, 'none') | ([ids], 'ambiguous')."""
    tokens = set(normalize_name(text).split())
    by_surname = [s for s in students if _surname_match(tokens, s)]
    if not by_surname:
        # Fallback: match por nombre de pila unico (ej. "Aitana").
        by_first = [s for s in students if _firstname_match(tokens, s)]
        if len(by_first) == 1:
            return (by_first[0]["id"], "ok")
        return (None, "none") if not by_first else ([s["id"] for s in by_first], "ambiguous")
    if len(by_surname) == 1:
        return (by_surname[0]["id"], "ok")
    # Apellido colisiona: desambiguar por token de nombre de pila.
    narrowed = [s for s in by_surname if _firstname_match(tokens, s)]
    if len(narrowed) == 1:
        return (narrowed[0]["id"], "ok")
    candidates = narrowed or by_surname
    return ([s["id"] for s in candidates], "ambiguous")


def match_folder(folder_part: str, students: list[dict]):
    """Mapea la parte 'apellido[-inicial]' de una carpeta NN-... a un alumno.

    'vidal-g' -> surname 'vidal' + inicial 'g' (Gonzalo). 'diestefano', 'maso',
    'bauer' resuelven por substring/fuzzy de apellido.
    """
    parts = normalize_name(folder_part).split()
    if not parts:
        return (None, "none")
    surname_frag = parts[0]
    initials = [p for p in parts[1:] if len(p) == 1]
    cands = [s for s in students if _surname_match({surname_frag}, s)]
    if not cands:
        # La carpeta puede estar nombrada por nombre de pila (ej. "12-dimar").
        cands = [s for s in students if _firstname_match({surname_frag}, s)]
    if len(cands) > 1 and initials:
        narrowed = [s for s in cands
                    if normalize_name(s["nombre"])[:1] in initials]
        if narrowed:
            cands = narrowed
    if not cands:
        return (None, "none")
    if len(cands) == 1:
        return (cands[0]["id"], "ok")
    return ([s["id"] for s in cands], "ambiguous")


# --------------------------------------------------------------------------- #
# Git / roster
# --------------------------------------------------------------------------- #
def git_remote(repo_path: Path):
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
    cohort_dir = Path(cohort_dir)
    csv_path = next(cohort_dir.glob("Notas*IISAIA*.csv"))
    students = parse_roster_csv(csv_path.read_text(encoding="utf-8").splitlines())
    by_id = {s["id"]: s for s in students}
    for s in students:
        s.setdefault("folder", None)
        s.setdefault("repos", [])
        s["presento_idea"] = False
        s["presento_final"] = False
        s["comentario"] = ""

    # Carpetas locales NN-apellido[-inicial] -> match por apellido.
    unmatched_folders = []
    for d in sorted(p for p in cohort_dir.iterdir()
                    if p.is_dir() and re.match(r"\d\d-", p.name)):
        folder_part = d.name.split("-", 1)[1]
        sid, status = match_folder(folder_part, students)
        if status == "ok":
            by_id[sid]["folder"] = d.name
            remote = git_remote(d)
            if remote and remote not in by_id[sid]["repos"]:
                by_id[sid]["repos"].append(remote)
        else:
            unmatched_folders.append(f"{d.name} ({status})")

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
            "unmatched_presentations": unmatched,
            "unmatched_folders": unmatched_folders}


def load_roster(results_dir: Path) -> dict:
    return json.loads((Path(results_dir) / "roster.json").read_text(encoding="utf-8"))


# --------------------------------------------------------------------------- #
# Deteccion de entregables
# --------------------------------------------------------------------------- #
def _walk(repo: Path):
    """Itera archivos saltando IGNORE_DIRS."""
    for p in repo.rglob("*"):
        if any(part in IGNORE_DIRS for part in p.parts):
            continue
        if p.is_file():
            yield p


def _rel(repo: Path, p: Path) -> str:
    return p.relative_to(repo).as_posix()


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


def _superpowers_signals(repo: Path, files) -> list:
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
                    return signals  # una mencion alcanza
    return signals


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
        "claude_md": {"found": claude is not None, "path": _rel(repo, claude) if claude else None},
        "final":    {"found": front_sig is not None or back_sig is not None},
        "superpowers": {"found": bool(sp_signals), "signals": sp_signals},
    }


def detect_repo_empty() -> dict:
    def z(extra=None):
        return {"found": False, **(extra or {})}
    return {"bad_ui": z({"path": None}), "openapi": z({"path": None}),
            "frontend": z({"signal": None}), "backend": z({"signal": None}),
            "claude_md": z({"path": None}), "final": z(),
            "superpowers": {"found": False, "signals": []}}


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


# --------------------------------------------------------------------------- #
# Nota
# --------------------------------------------------------------------------- #
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
            grade -= 1
            breakdown.append("-1 falta Bad UI")
        # OpenAPI (TP2) se registra pero no descuenta (relevancia no aclarada en clase).
        if not det["claude_md"]["found"]:
            grade -= 1
            breakdown.append("-1 falta CLAUDE.md")
        if not (det["frontend"]["found"] and det["backend"]["found"]):
            grade -= 2
            breakdown.append("-2 final incompleto (falta frontend o backend)")
        # El -2 por no presentar el final solo aplica si hay final entregado;
        # sin final entregado, el piso 4 ya contempla la ausencia.
        if not flags.get("presento_final"):
            grade -= 2
            breakdown.append("-2 no presento el final")

    if not flags.get("presento_idea"):
        grade -= 0.5
        breakdown.append("-0.5 no presento la idea")

    core_complete = (final_ok and det["bad_ui"]["found"]
                     and det["frontend"]["found"] and det["backend"]["found"]
                     and det["claude_md"]["found"] and flags.get("presento_final"))
    if det["superpowers"]["found"] and core_complete:
        grade = min(10.0, grade + 1)
        breakdown.append("+1 feature con superpowers")

    grade = max(1.0, min(10.0, grade))
    return {"grade": grade, "breakdown": breakdown}
