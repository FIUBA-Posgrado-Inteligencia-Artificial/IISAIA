# Plan mode y permission modes

## §1 — Qué es

El loop del agente es **pensar → actuar → observar → repetir**. En modo normal, el agente pasa de "pensar" a "actuar" sin pedirte permiso: le diste la tarea, él eligió la primera acción, y cuando te diste cuenta ya tocó tres archivos.

Plan mode interrumpe eso antes de la primera acción. El agente puede leer, buscar y razonar — pero no puede escribir, editar ni ejecutar comandos con efecto sobre el mundo hasta que el supervisor aprueba el plan explícitamente.

No es un resumen a posteriori. Es un alto deliberado entre el "pensar" y el "actuar", con espacio explícito para que el supervisor entre en el medio.

¿Por qué importa? Recordá §5: el modo de falla que llamamos deriva de objetivo. El agente empieza en A, la tarea es llegar a B, y a la décima iteración está en D. Cuando eso pasa después de que ya escribió archivos, el costo de corregirlo sube. Plan mode es la defensa más barata contra la deriva: si el plan muestra que el agente entendió mal la tarea antes de tocar nada, corregís ahí, antes de que el loop acumule consecuencias.

## §2 — Dónde vive

Plan mode es uno de los cuatro permission modes de Claude Code. Cada mode define cuánta autonomía tiene el agente para actuar sin pedirte confirmación.

| Mode | Qué hace |
|---|---|
| `default` | Pregunta antes de cualquier acción que no tenga regla explícita en `allow`. El modo del día a día. |
| `acceptEdits` | Auto-acepta Edit y Write sin preguntar; sigue pidiendo confirmación para Bash. |
| `plan` | Solo lectura hasta que el supervisor aprueba el plan con `ExitPlanMode`. No escribe, no ejecuta. |
| `bypassPermissions` | Sin gates. Sin confirmaciones. Solo para entornos efímeros donde "perder todo" es barato. |

**Tres vías para activar plan mode:**

```bash
# 1. Flag al arranque
claude --permission-mode plan

# 2. Campo en settings.json
{
  "permissionMode": "plan"
}

# 3. Durante la sesión: Shift+Tab cicla entre modes
# La UI muestra el mode activo en el banner
```

## §3 — Cuándo se activa

Dos momentos naturales:

**Al arranque**, cuando la tarea es grande, multi-archivo o cuando no estás seguro de si el agente interpretó bien la consigna. Si el plan está mal, lo corregís antes de que el loop toque algo.

**On-the-fly**, durante una sesión en `default`, cuando ves que el agente está por hacer algo costoso o que no esperabas. `Shift+Tab` te lleva a `plan` sin reiniciar la sesión.

La regla de fondo es la reversibilidad. Cuanto menos reversible es la tarea, más vale entrar al proceso antes de la primera acción.

## §4 — Cómo se usa

**Flujo de plan mode:**

1. Activar plan mode (cualquiera de las tres vías).
2. Describir la tarea.
3. Claude propone un plan: qué archivos va a tocar, en qué orden, qué tools va a usar.
4. Revisar el plan. Corregirlo si hace falta — podés decirle "no toques `tests/`" o "empezá por el módulo X".
5. Aprobar con `ExitPlanMode`.
6. Claude ejecuta la versión aprobada.

El plan es el contrato: una vez aprobado, Claude ejecuta sin volver a parar en cada acción (a menos que una regla del bloque de permisos que vimos en §10 lo detenga antes).

**Los otros tres modes en la práctica:**

`default` es el modo del día a día. Claude pregunta antes de cualquier acción que no tenga una regla `allow` configurada. La fricción es baja; el control es razonable.

`acceptEdits` es útil para refactors chicos con una suite de tests rápida. Auto-acepta Edit y Write, así el agente fluye sin interrupciones en cada archivo; sigue preguntando para Bash, donde las consecuencias pueden ser más amplias.

`bypassPermissions` elimina todos los gates. Sin confirmaciones, sin paradas. Su único contexto legítimo es un container o sandbox efímero donde podés tirar todo y empezar de cero sin costo.

## §5 — Casos límite / cosas que confunden

**Elegir el mode según reversibilidad:**

La pregunta no es "¿qué tan rápido quiero ir?" sino "¿qué tan caro es un error?".

`plan` tiene sentido cuando la tarea es grande, multi-archivo, o cuando no sabés si Claude entendió bien la consigna. El costo de la pausa es bajo; el costo de un loop mal orientado que ya escribió veinte archivos no lo es.

`acceptEdits` es razonable cuando el refactor es acotado y tenés tests que detectan regresiones rápido. El agente fluye, los tests te cubren.

`bypassPermissions` solo en entornos donde podés tirar todo y empezar de cero. En un proyecto real con código de producción, no tiene justificación.

`default` para el resto: tareas intermedias, exploración, trabajo donde el nivel de confianza es alto pero no querés ir sin red.

**Plan mode no es sandbox.** Esta es la confusión más frecuente. Plan mode pone un gate antes de que empiece la ejecución: aprobás el plan, el agente ejecuta. Pero lo que ejecuta puede incluir comandos Bash con consecuencias reales. El gate de permisos que vimos en §10 y el permission mode son ortogonales: el mode controla cuándo empieza la ejecución; el bloque `deny` de §10 controla qué herramientas puede usar durante la ejecución. Los dos juntos te dan el control fino; cada uno por separado es parcial.

## §6 — Mini-demo en vivo

Tarea: refactor multi-archivo en el demo-repo. La consigna es "extraé el middleware de auth de cada router a un módulo compartido". El módulo ya existe en `backend/middleware/auth.py`, así que el demo es realista sin riesgo de romper nada — si algo sale mal, `git checkout .` y listo.

El objetivo no es mostrar que el agente falla sin plan mode. Es mostrar **dónde entra el supervisor** en cada caso.

---

**Beat 1 — Modo `default`: el agente actúa**

Dar la tarea a Claude Code sin cambiar el mode. El agente va a empezar a leer archivos y casi de inmediato va a proponer ediciones. Cancelar antes de que se apruebe la primera escritura.

*Qué señalar:* El agente tomó decisiones — qué archivos tocar, en qué orden, qué convención usar — antes de mostrártelas. Vos entraste después de los hechos.

---

**Beat 2 — Activar plan mode: propone antes de actuar**

Nueva sesión. `Shift+Tab` hasta que la UI muestre `plan`. Misma tarea. Claude responde con un plan: qué archivos va a tocar, en qué orden, qué imports va a modificar. No editó nada.

*Qué señalar:* El workspace no cambió. El loop está detenido entre "pensar" y "actuar". El supervisor entra antes de la primera acción, no después.

---

**Beat 3 — Corrección antes de aprobar**

Leer el plan en voz alta. Encontrar algo para ajustar — por ejemplo, el agente quiere tocar también `tests/routers/`, y nosotros solo queremos los módulos de negocio. Corregir: "no toques `tests/`, ya están bien". Aprobar con `ExitPlanMode`. Claude ejecuta la versión corregida.

*Qué señalar:* Eso es controlar el loop — entrar entre el "pensar" y el "actuar". El resultado puede ser idéntico al Beat 1, pero el proceso fue diferente: el supervisor estuvo adentro desde antes de la primera acción.

---

**Plan B si la UI del mode no se ve clara en la grabación:** narrar el banner. La diferencia conductual — editó vs. propuso — se ve igual en cualquier caso.

---

## Transición

Con esto cerramos la Parte 2. Tenés el runtime: el loop, el contexto, y las herramientas para actuar sobre cada uno — desde cómo estructurás las instrucciones hasta cómo controlás cuándo y cuánto ejecuta el agente.

La última sección cierra el arco completo. §14 es el trabajo final: el momento de articular modelo + rol + runtime en un proyecto propio, de principio a fin.

---

**Referencia:** https://code.claude.com/docs/en/permission-modes
