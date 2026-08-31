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
    if roster.get("unmatched_folders"):
        rows += ["", "## Carpetas sin match (revisar)", ""]
        rows += [f"- {u}" for u in roster["unmatched_folders"]]
    return "\n".join(rows) + "\n"


def main():
    cohort_dir = Path(sys.argv[1])
    results = cohort_dir / "_resultados"
    results.mkdir(exist_ok=True)
    roster = build_roster(cohort_dir)
    (results / "roster.json").write_text(
        json.dumps(roster, ensure_ascii=False, indent=2), encoding="utf-8")
    (results / "roster.md").write_text(render_md(roster), encoding="utf-8")
    print(f"{len(roster['students'])} alumnos; "
          f"{len(roster['unmatched_presentations'])} presentaciones sin match")


if __name__ == "__main__":
    main()
