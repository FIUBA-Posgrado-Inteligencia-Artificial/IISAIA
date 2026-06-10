# Demo: context7 MCP

## El problema concreto

Le pedís al agente que escriba código contra un SDK específico. Una librería que salió hace cuatro meses, o una versión nueva con breaking changes, o una API que tiene matices que no aparecen en los tutoriales viejos que el modelo memorizó.

El agente arranca a tipear con confianza. Y a veces inventa funciones que no existen, o usa una firma de parámetros vieja, o llama métodos deprecados. El término técnico para esto es alucinación de API.

La causa raíz ya la conocés: el modelo no ve la doc actual de tu librería. Razona con lo que vio en entrenamiento, que está congelado en una fecha y no se actualiza.

## Qué es context7

context7 es un MCP server público que expone, como resources y tools, la documentación de miles de librerías y SDKs — extraída en tiempo real desde sus fuentes oficiales y formateada para que un LLM la pueda consumir bien. Lo mantiene Upstash y es gratis para uso individual.

Cuando el agente está por escribir código contra una librería, en vez de tirar de memoria, puede pedirle a context7 "traeme la doc actual de `next/server`" o "buscame cómo se usa `streamText` en la versión vigente del SDK `ai`". Recibe doc real, con la versión real, y el código que escribe después está alineado con la API que efectivamente existe.

## Instalación

```bash
claude mcp add context7 npx -y @upstash/context7-mcp
```

Mismo formato que Playwright. Mismo patrón.

## Demo

Pedido: "armame un endpoint de streaming con el SDK `ai` de Vercel, usando `streamText`".

Sin context7, el agente puede usar una firma desactualizada, importar de un path que ya no existe o aplicar patrones de versiones anteriores. Con context7, antes de escribir, pide la doc actual; el código que produce respeta la API real de la versión vigente.

## Qué tenés que sacar de esto

Dos cosas. Primero: el problema de alucinaciones de API no se resuelve "pidiéndole al modelo que no alucine". Se resuelve dándole acceso a la información que le falta. MCP es la forma estándar de darle ese acceso.

Segundo: el patrón del demo anterior se repite intacto. Un server descubre sus capacidades al host; el host se las pasa al LLM; el LLM las invoca cuando le hacen falta; los resultados vuelven a la conversación. Cambian las URIs, cambian los tools, no cambia el aparato.
