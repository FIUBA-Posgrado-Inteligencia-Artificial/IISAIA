import tempfile
import unittest
from pathlib import Path

from grading_lib import (normalize_name, slug, parse_roster_csv,
                         parse_presentations, match_name, match_folder,
                         detect_repo, suggest_grade)


class TestNormalizeName(unittest.TestCase):
    def test_strips_accents_and_lowercases(self):
        self.assertEqual(normalize_name("José Miguel"), "jose miguel")

    def test_collapses_whitespace_and_tabs(self):
        self.assertEqual(normalize_name("Juan Miguel\t "), "juan miguel")

    def test_drops_punctuation(self):
        self.assertEqual(normalize_name("expensas (?)"), "expensas")


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

    def test_particle_surname_is_joined(self):
        self.assertEqual(slug("Ramiro Francisco", "Di Estefano"), "ramiro-diestefano")


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
        self.assertEqual(entries[0]["comment"],
                         "gestion de guardia hospitalaria | buen uso de CC")


STUDENTS = [
    {"id": "gonzalo-vidal", "nombre": "Gonzalo Julián", "apellido": "Vidal"},
    {"id": "camilo-vidal",  "nombre": "Camilo Alberto", "apellido": "Vidal Arenas"},
    {"id": "fabio-vidal", "nombre": "Fabio",        "apellido": "Vidal"},
    {"id": "nolberto-ugarte", "nombre": "Nolberto Ronald José", "apellido": "Ugarte"},
    {"id": "aitana-gorriti", "nombre": "Aitana Nerea", "apellido": "Gorriti"},
    {"id": "julio-diez", "nombre": "Julio Luis", "apellido": "Diez"},
    {"id": "alan-calvet", "nombre": "Alan Mariano", "apellido": "Calvet"},
    {"id": "mariano-streichauer", "nombre": "Mariano Leonel", "apellido": "Streichauer"},
    {"id": "ramiro-diestefano", "nombre": "Ramiro Francisco", "apellido": "Di Estefano"},
    {"id": "braulio-belgrano", "nombre": "Braulio Martin", "apellido": "Belgrano Otero"},
    {"id": "dimar-toledo", "nombre": "Dimar Ignacio", "apellido": "Toledo"},
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
        result, status = match_name("vidal", STUDENTS)
        self.assertEqual(status, "ambiguous")
        self.assertEqual(set(result), {"gonzalo-vidal", "camilo-vidal", "fabio-vidal"})

    def test_surname_substring_disambiguates_shared_first_name(self):
        # "Matias" es segundo nombre de Alan y nombre de Streichauer;
        # el apellido "hauer" (substring de Streichauer) desempata.
        self.assertEqual(match_name("mariano hauer", STUDENTS), ("mariano-streichauer", "ok"))


class TestMatchFolder(unittest.TestCase):
    def test_initial_suffix_disambiguates(self):
        self.assertEqual(match_folder("vidal-g", STUDENTS), ("gonzalo-vidal", "ok"))
        self.assertEqual(match_folder("vidal-c", STUDENTS), ("camilo-vidal", "ok"))

    def test_concatenated_particle_surname(self):
        self.assertEqual(match_folder("diestefano", STUDENTS), ("ramiro-diestefano", "ok"))

    def test_prefix_surname(self):
        self.assertEqual(match_folder("belg", STUDENTS), ("braulio-belgrano", "ok"))

    def test_substring_surname(self):
        self.assertEqual(match_folder("hauer", STUDENTS), ("mariano-streichauer", "ok"))

    def test_plain_unique_surname(self):
        self.assertEqual(match_folder("gorriti", STUDENTS), ("aitana-gorriti", "ok"))

    def test_folder_by_first_name(self):
        # "12-dimar": Dimar es nombre de pila, apellido Toledo.
        self.assertEqual(match_folder("dimar", STUDENTS), ("dimar-toledo", "ok"))

    def test_short_particle_does_not_false_match(self):
        # "dimar" no debe matchear a Di Estefano por la particula "di".
        self.assertEqual(match_folder("diez", STUDENTS), ("julio-diez", "ok"))


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
        det = _full_detection()
        det["superpowers"]["found"] = True
        flags = {"presento_final": True, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 10.0)

    def test_missing_openapi_no_deduction(self):
        # OpenAPI se registra pero no descuenta.
        det = _full_detection()
        det["openapi"]["found"] = False
        flags = {"presento_final": True, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 9.0)

    def test_no_idea_minus_half(self):
        flags = {"presento_final": True, "presento_idea": False}
        self.assertEqual(suggest_grade(_full_detection(), flags)["grade"], 8.5)

    def test_no_final_floor_four(self):
        det = _full_detection()
        det["frontend"]["found"] = False
        det["backend"]["found"] = False
        det["final"]["found"] = False
        det["claude_md"]["found"] = False
        flags = {"presento_final": False, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 4.0)

    def test_superpowers_no_bonus_when_incomplete(self):
        det = _full_detection()
        det["superpowers"]["found"] = True
        det["claude_md"]["found"] = False   # nucleo incompleto -> sin bonus
        flags = {"presento_final": True, "presento_idea": True}
        self.assertEqual(suggest_grade(det, flags)["grade"], 8.0)


if __name__ == "__main__":
    unittest.main()
