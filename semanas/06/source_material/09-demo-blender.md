# Demo: Blender MCP

## El problema concreto (otro ángulo)

Hasta acá vimos dos demos de MCP: Playwright para controlar un browser, context7 para traer docs reales. Las dos son dominios de desarrollo. **Pero MCP no se limita a herramientas de desarrollo.** Cualquier programa que alguien empaquete como server queda al alcance del agente.

Blender — el software open-source de modelado y animación 3D — tiene un MCP server. El agente puede crear escenas, manipular objetos, configurar física, renderizar.

## Qué es Blender MCP

Blender MCP es un server que expone las primitives de Blender como tools que el agente puede invocar. Por dentro, el server traduce las llamadas MCP a comandos `bpy` (la API Python de Blender). El agente, sin saber Python ni sintaxis de Blender, le pide al server "creá un cubo", "rotalo 45 grados", "agregale rigid body activo", y el server lo hace.

El proyecto lo mantiene la comunidad. Se conecta a Blender mediante un add-on que corre adentro del programa.

## Instalación y setup

Comando para registrar el server:

```bash
claude mcp add blender npx -y blender-mcp
```

Setup adicional: el server necesita Blender abierto con el add-on `blender-mcp` cargado y activo (corre como server local TCP dentro de Blender, que el MCP server externo invoca). Es más overhead que Playwright o context7 — Blender no es liviano y hay una pieza adicional de comunicación.

## Demo

Pedido: *"creá una rampa inclinada 30 grados, dejá caer 6 esferas de colores arriba, activá física rigid body para que rueden por la rampa y choquen entre sí. Después corré la simulación."*

Qué hace el agente, en orden:

1. Crea un plane, lo rota 30°, lo escala para que sea una rampa larga.
2. Crea 6 UV spheres distribuidas arriba del plane, a distintas alturas y posiciones laterales.
3. Le pone material colorido a cada esfera (rojo, azul, verde, amarillo, naranja, violeta).
4. Configura **rigid body passive** al plane — colisiona pero no se mueve.
5. Configura **rigid body active** a cada esfera — afectadas por gravedad, colisionan entre sí y contra el plane.
6. Setea bounciness y friction razonables (no totalmente elásticas ni totalmente muertas).
7. Pone el timeline en play.

Resultado visible: las 6 balls caen por gravedad, rebotan en la rampa, ruedan hacia abajo, chocan entre sí y se dispersan. Se ve en tiempo real en el viewport de Blender.

## Plan B

El demo tiene más superficie para fallar que Playwright o context7. Las físicas en Blender pueden hacer cosas raras — balls que atraviesan el plane, esferas que vuelan en direcciones impredecibles, simulaciones que se cuelgan. La conexión del add-on con el server externo también puede cortarse.

**Vale tener un video pre-grabado de 30-40s** del demo funcionando bien, listo para mostrar si el live falla. No es opcional acá. La gracia del demo es ver las balls moverse; si solo mostramos screenshots, perdemos el punto.

## Qué tenés que sacar de esto

Dos cosas.

Primero: **MCP no es solo para herramientas de desarrollo.** Cualquier programa que alguien quiso empaquetar como server queda al alcance del agente. Blender hoy, mañana puede ser Unity, Photoshop, Excel, una DAW musical, un CAD.

Segundo: lo que el agente coordina acá es **una secuencia de pasos en un dominio que no conoce nativamente**. Sin haber programado en `bpy` ni haber tocado Blender, el agente armó una escena con física funcional. Eso es porque el server le describe sus capacidades (vimos cómo en §5), y el agente razona sobre cómo combinarlas para llegar al resultado.

El patrón del intercambio es el mismo de los dos demos anteriores. Cambia el dominio.
