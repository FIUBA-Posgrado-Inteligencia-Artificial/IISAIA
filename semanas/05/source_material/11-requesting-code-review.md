# requesting-code-review

## Qué hace

Corre un code review estructurado del código producido en la sesión, contra el plan, antes de claimar
que el trabajo está listo o de mergear. El reviewer es un agente separado del que implementó: recibe
sólo el diff y el spec original, no tu historial de sesión, así no carga el sesgo del autor ni la
narrativa de "ya lo discutimos y quedó así".

Devuelve un report con dos partes. Por un lado, strengths: qué quedó bien, qué decisiones de diseño
son sólidas. Por otro, issues clasificados por severidad: críticos (bloquean el avance), mayores
(piden aprobación explícita del humano antes de mergear), menores (notas que pueden quedar como
contexto en el PR).

## Cuándo se activa

Cuando terminás de implementar el plan, después de que TDD pasó verde, antes de pasar a
finishing-branch. También antes de mergear features grandes o cualquier cambio que toque más de un
par de archivos. Si estás trabado y no sabés qué falta, también sirve: un agente fresco lee el
trabajo y te marca lo que vos ya no ves.

## Por qué importa

Es la última pasada con ojos frescos antes de que el código salga de tu cabeza. El reviewer es otro
agente y no carga el sesgo de quien implementó, así que detecta cosas que vos ya naturalizaste.

Los issues críticos efectivamente bloquean el avance — eso evita que cosas obvias se cuelen al PR.
Code review encuentra cosas que los tests no encuentran: dead code que quedó de una iteración
anterior, mismatch entre lo que dice el spec y lo que hace el código, ergonomía pésima de la API
pública, archivos que crecieron demasiado, decisiones que rompen invariantes implícitos del codebase.

## El punto crítico

Los issues críticos se resuelven ANTES de avanzar. No se "anotan para después", se arreglan ya. Si
el spec cambió durante la implementación, se modifica el plan; si el spec se mantiene, se ajusta el
código. Los mayores requieren aprobación explícita del humano antes de mergear — no los degrades a
menores para no atrasar. Los menores son notas que pueden quedar en el PR como contexto.

## Anti-patrones a evitar

- Saltearse la skill porque "los tests pasan". Code review encuentra cosas distintas a los tests:
  dead code, mismatch con el spec, ergonomía pésima de la API. Los tests verifican comportamiento;
  el review verifica diseño.
- Tratar issues críticos como mayores para "no atrasar el merge". La severidad es informativa, no
  negociable. Si el reviewer marcó algo como crítico, hay una razón; pedile que la explique antes
  de degradarlo.
- Pedir review antes de que TDD haya pasado verde. No tiene sentido revisar diseño en código que
  no funciona: primero arreglá lo que está roto, después pedís review.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/requesting-code-review/SKILL.md`

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot del report de review generado al ejecutar la skill sobre el feature
     implementado en el demo-repo de S04. Idealmente con al menos un issue marcado en cada nivel
     de severidad (crítico, mayor, menor) para que se vea la estructura completa. -->
