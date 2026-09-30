# finishing-a-development-branch

## Qué hace

Cuando todas las tareas del plan están implementadas y verificadas, esta skill estructura las
opciones de cierre y limpia el workspace según la elegida. Desde v6.2 las opciones son tres, en
este orden: mergear a la base local, push y abrir un Pull Request (lo más frecuente, default en
GitHub Flow; con la herramienta de tu forge, no solo `gh`), o dejar la branch como está para
retomarla después. **Descartar ya no está en el menú**: pasa solo si lo pedís explícitamente, y
confirmás tipeando `discard`.

La skill no decide por vos. Primero corre la suite entera sobre el resultado final (si falla, frena
y no muestra el menú),
detecta en qué tipo de workspace estás parado (repo normal, worktree con branch propia, o
detached HEAD externo), te muestra el menú exacto que corresponde a ese contexto, y después
ejecuta la opción elegida con su cleanup correspondiente — incluyendo el orden correcto
(mergear antes de borrar la branch, salir del worktree antes de removerlo).

## Cuándo se activa

Al final del plan, después de que `verification-before-completion` pasó y el trabajo está
listo para integrarse. El menú aparece recién con la suite en verde. Si te tenés que ir con el trabajo a medias, la
branch queda como está y la retomás con el plan.

## Por qué importa

Sin esta skill el flujo termina en "ya está, mergeá si querés", y el humano queda decidiendo
a ojo qué hacer con una branch que recién parió. Esa decisión sin marco produce dos
resultados malos típicos: o se mergea a `main` algo que merecía revisión, o la branch queda
viva indefinidamente y se convierte en deuda silenciosa.

`finishing-a-development-branch` hace explícitas las tres opciones, recomienda según
contexto, y deja el workspace en estado conocido — sin worktrees colgados, sin branches
locales muertas que después nadie se anima a borrar porque "no me acuerdo qué tenían".

Hay continuidad directa con la convención de GitHub Flow: en ese flujo, "finishing"
típicamente termina abriendo el PR. Esa es la ruta más común y la skill la favorece cuando
el cambio amerita revisión humana, que es casi siempre.

## El punto crítico

No quedarse en estado intermedio. La branch o se mergea, o se manda a PR, o se deja como está
con un plan de seguimiento explícito. "Después decido" es deuda silenciosa que
se acumula y termina costando una limpieza grande tres semanas después, cuando ya nadie se
acuerda qué hacían `feature/auth-refactor-v2` y `feature/auth-refactor-final` y por qué
están las dos.

La skill también ordena el cleanup: mergear primero, verificar tests sobre el resultado
mergeado, después remover el worktree, y recién al final borrar la branch local. Solo limpia worktrees que
creó Superpowers (en `.worktrees/` del proyecto), y si `git worktree remove` se niega porque hay
archivos sin commitear, frena y te pregunta en vez de forzar. Saltarse
ese orden produce errores feos — `git branch -d` falla si el worktree todavía referencia la
branch, y `git worktree remove` falla en silencio si lo corrés desde adentro del worktree
que estás intentando borrar.

## Anti-patrones a evitar

- Mergear directo a `main` sin PR cuando el cambio amerita revisión. El PR es donde el
  contrato se hace visible, donde queda registro de qué se discutió y por qué se aprobó.
  Saltearlo te ahorra cinco minutos hoy y te cuesta una conversación incómoda mañana cuando
  alguien pregunte "¿esto cuándo se decidió?".
- Dejar la branch viva sin razón explícita. Si no hay seguimiento planeado, abrila como PR
  o cerrala. Branches dormidas son ruido en el repo y confusión para quien venga después,
  incluido vos mismo dentro de dos semanas.
- Olvidarse del cleanup del workspace: worktrees no removidos, branches locales que ya se
  mergearon. La próxima sesión te encontrás restos y perdés tiempo entendiendo qué es qué
  antes de poder empezar a trabajar.

## Fuente canónica

`semanas/05/source_material/superpowers/skills/finishing-a-development-branch/SKILL.md`

## Caso real

Cierre de la sesión auth0 sobre el tp-final: `uv run pytest` → 34 passed, no warnings; menú de tres opciones (1 merge local / 2 push + PR / 3 dejarla); elegido merge local y push → fast-forward, 34 passed sobre `main` antes del push, branch borrada, chequeo de que el `.env` no estaba en ningún commit (repo público).
