# El resto del cinturón

El plugin trae más skills que las siete que recorrimos en detalle. Las que siguen
existen y se activan automáticamente cuando aplican, pero no las trabajamos una por
una porque no son centrales al flujo lineal — aparecen cuando algo se sale del
happy-path: un bug que no entendés, tareas independientes que conviene paralelizar,
ganas de escribir tu propia skill, o un workflow particular que el flujo base no
contempla. Nombrarlas con una frase cada una alcanza para que las reconozcas cuando
se te crucen y sepas dónde buscar más.

## Lo que no recorrimos en detalle

- **`systematic-debugging`** — proceso de root-cause en cuatro fases cuando aparece
  un bug. Se activa cuando algo falla, en lugar de adivinar el arreglo. Útil cuando
  un test que pasaba ayer hoy falla y no entendés por qué.

- **`dispatching-parallel-agents`** — despachar varios subagentes en paralelo
  cuando hay tareas independientes que se pueden trabajar al mismo tiempo (por
  ejemplo: "agregá tests para estos cuatro módulos no relacionados"). Acelera
  trabajo sin orden forzoso entre pasos.

- **`writing-skills`** — crear o editar skills propias. La skill que escribe
  skills. Útil si tu equipo tiene un patrón recurrente que querés codificar como
  skill propia (por ejemplo: "siempre que tocás un endpoint, agregá su entrada en
  el changelog").

- **`receiving-code-review`** — el lado opuesto de `requesting-code-review` (que
  vimos antes): cómo responder a feedback de review sin ceder por reflejo y sin
  defenderte ciegamente. Útil cuando vos sos el reviewee y querés un patrón
  disciplinado para iterar.

- **`executing-plans`** — ya cubierta en §9 como modo **Native**: la misma sesión
  implementa todo el plan sin pausas y una sola review final. No va en el slide.

- **`using-git-worktrees`** — workflow de worktrees para trabajar en varias
  branches en paralelo en folders distintos (la mencionamos antes con la
  disclosure honesta de por qué no la usamos acá). Útil si en tu trabajo real
  necesitás contexto físicamente aislado entre branches.

- **`diagnosing-superpowers`** (nueva en v6.4) — cuando una sesión salió mal
  (repitió trabajo, ignoró el plan, una skill no se disparó, costó mucho más de lo
  esperado), le pedís al agente que averigüe qué pasó: lee los transcripts en disco
  y reporta con evidencia `path:line`. Si querés, arma el issue para los
  mantenedores.

## Cómo se las invoca

No hace falta memorizarlas. Cada skill tiene su trigger declarado en el
frontmatter de su `SKILL.md`; cuando hagas algo que coincida (mencionás un bug,
pedís trabajar varios cambios en paralelo, querés crear una skill nueva), Claude
las propone o las invoca solo. Si querés explorar una en particular, su archivo
vive en `~/.claude/plugins/cache/claude-plugins-official/superpowers/<versión>/skills/<nombre>/SKILL.md`
— abrilo y leelo, es prosa, no magia.
