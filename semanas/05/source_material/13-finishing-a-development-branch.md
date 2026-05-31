# finishing-a-development-branch

## Qué hace

Cuando todas las tareas del plan están implementadas y verificadas, esta skill estructura las
opciones de cierre y limpia el workspace según la elegida. Las opciones típicas son cuatro:
mergear directo a la base local, abrir un Pull Request (lo más frecuente, default en GitHub
Flow), mantener la branch viva con un plan de seguimiento explícito, o descartar el trabajo.

La skill no decide por vos. Primero corre los tests una última vez sobre el resultado final,
detecta en qué tipo de workspace estás parado (repo normal, worktree con branch propia, o
detached HEAD externo), te muestra el menú exacto que corresponde a ese contexto, y después
ejecuta la opción elegida con su cleanup correspondiente — incluyendo el orden correcto
(mergear antes de borrar la branch, salir del worktree antes de removerlo).

## Cuándo se activa

Al final del plan, después de que `verification-before-completion` pasó y el trabajo está
listo para integrarse. También cuando explícitamente pedís cerrar la sesión de trabajo y
querés decidir qué hacer con lo hecho — por ejemplo si te tenés que ir y la branch quedó a
mitad de camino, la skill te ofrece la opción de mantenerla viva con un plan claro de
seguimiento en vez de dejarla flotando sin decisión.

## Por qué importa

Sin esta skill el flujo termina en "ya está, mergeá si querés", y el humano queda decidiendo
a ojo qué hacer con una branch que recién parió. Esa decisión sin marco produce dos
resultados malos típicos: o se mergea a `main` algo que merecía revisión, o la branch queda
viva indefinidamente y se convierte en deuda silenciosa.

`finishing-a-development-branch` hace explícitas las cuatro opciones, recomienda según
contexto, y deja el workspace en estado conocido — sin worktrees colgados, sin branches
locales muertas que después nadie se anima a borrar porque "no me acuerdo qué tenían".

Hay continuidad directa con la convención de GitHub Flow: en ese flujo, "finishing"
típicamente termina abriendo el PR. Esa es la ruta más común y la skill la favorece cuando
el cambio amerita revisión humana, que es casi siempre.

## El punto crítico

No quedarse en estado intermedio. La branch o se mergea, o se manda a PR, o se mantiene viva
con un plan de seguimiento explícito, o se cierra. "Después decido" es deuda silenciosa que
se acumula y termina costando una limpieza grande tres semanas después, cuando ya nadie se
acuerda qué hacían `feature/auth-refactor-v2` y `feature/auth-refactor-final` y por qué
están las dos.

La skill también ordena el cleanup: mergear primero, verificar tests sobre el resultado
mergeado, después remover el worktree, y recién al final borrar la branch local. Saltarse
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

<!-- INSERT-USER-CAPTURE -->
<!-- Captura real: screenshot del PR final del feature en el demo-repo, ya mergeado o listo
     para mergear. Ideal: mostrar también el listado de branches locales después del cleanup,
     para evidenciar que el workspace quedó ordenado. -->
