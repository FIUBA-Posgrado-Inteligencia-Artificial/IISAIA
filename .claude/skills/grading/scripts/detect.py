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
        flags = {"presento_final": s["presento_final"],
                 "presento_idea": s["presento_idea"]}
        grade = suggest_grade(det, flags)
        out.append({"id": s["id"], "detection": det, "grade": grade,
                    "no_local_repo": not dets})

    (results / "detections.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(out)} alumnos evaluados; "
          f"{sum(1 for o in out if o['no_local_repo'])} sin repo local")


if __name__ == "__main__":
    main()
