# Regla de nota — IISAIA

Modelo baseline-and-adjust. La skill **sugiere**; el docente confirma y overridea.

## Base
- **9/10** si están las 3 cosas: Bad UI, proyecto final completo
  (frontend + backend + CLAUDE.md), y presentó el final en clase.
- **10/10**: lo anterior **+** evidencia de un feature hecho con superpowers.

## Descuentos (acumulables, desde 9)
| Situación | Ajuste |
|-----------|--------|
| Falta Bad UI | −1 |
| Falta CLAUDE.md en el final | −1 |
| Final incompleto (falta frontend o backend) | −2 |
| No presentó el final en clase | −2 |
| No presentó la idea en clase | −0.5 |
| No entregó proyecto final | nota cae a ~4 |

## OpenAPI (no descuenta)
El OpenAPI (TP2) se **registra** en el informe pero **no afecta la nota**: su
relevancia no se aclaró en clase, así que su ausencia no descuenta.

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
