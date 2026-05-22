# Superpowers

## Qué problema resuelve

Superpowers se define a sí mismo como "una metodología completa de desarrollo de software para tu coding agent, construida sobre un set de skills componibles". Esa frase tiene dos partes: skills componibles (lo que vimos en §02) y metodología (lo nuevo).

El problema sin metodología es conocido. Le pedís al agente que construya algo y arranca a tipear código antes de saber qué estás construyendo. Si hay un mismatch entre lo que vos tenés en la cabeza y lo que él entendió, el mismatch aparece tarde — cuando ya hay archivos, tests, commits, y la conversación lleva veinte mensajes. Detectarlo en palabras es barato. Detectarlo en código ya escrito es caro.

Lo que cambia con Superpowers lo describe el README en una línea: "apenas ve que estás construyendo algo, no salta a escribir código. En vez de eso, da un paso atrás y te pregunta qué estás tratando de hacer realmente". El plugin fuerza un proceso: entendé qué construís, diseñalo, planificá, ejecutá, verificá, mergeá. Cada paso tiene un punto de control antes de pasar al siguiente.

## El happy-path completo

Esto es lo que vamos a abrir caja por caja en las próximas siete secciones:

```
brainstorming
  → writing-plans
    → (GitHub Flow: branch + PR)
      → subagent-driven-development
        → test-driven-development
          → requesting-code-review
            → verification-before-completion
              → finishing-a-development-branch
```

Las skills se invocan automáticamente cuando aplican. No las llamás a mano. Vos describís lo que querés construir y el plugin sabe en qué punto del flujo está.

## Filosofía

Cuatro principios, declarados explícitamente en el README:

- **Test-Driven Development**: escribir tests primero, siempre.
- **Systematic over ad-hoc**: proceso por encima de adivinar.
- **Complexity reduction**: simplicidad como objetivo primario.
- **Evidence over claims**: verificar antes de declarar éxito.

Ninguno es nuevo en ingeniería de software. Lo nuevo es que el plugin los aplica al loop con el agente, no sólo al código que el agente produce.

## Lo que NO hace

Tres cosas que conviene aclarar antes de instalarlo, para no inflar expectativas:

- **No escribe el código por vos sin que vos decidas qué construir.** La skill `brainstorming` se traba si vos te trabás. Si no sabés qué querés, no avanza.
- **No reemplaza tu criterio arquitectónico.** Te hace preguntas; las respuestas las ponés vos. El plugin estructura la conversación, no decide por vos.
- **No funciona en piloto automático.** Las skills hacen preguntas y esperan respuesta. Si abandonás la sesión, el flujo se detiene donde lo dejaste.

## Próximo paso

En la próxima sección lo instalamos.
