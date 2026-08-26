# **![][image1]**

# Programa de la Materia:

## Introducción a la ingeniería de software asistida por IA

## 

## 

## Carrera: Diplomatura en desarrollo de aplicaciones utilizando inteligencia artificial

## Docente responsable: Enzo Pacilio

## Año: 2026

# **![][image1]**

# OBJETIVOS

* Desarrollar la intuición para modelos de lenguaje: comprender los principios fundamentales de la generación de lenguaje natural y de sintaxis de programación. Esto incluye la tokenización como átomo del lenguaje, la naturaleza estocástica de la predicción, el ciclo de vida de entrenamiento (*pre-training* y *post-training*), la alineación mediante RLHF y el análisis de las causas técnicas de las alucinaciones y de los límites del razonamiento.  
* Conocer la estructura del software: dominar el mapa conceptual del software (frontend, backend, APIs y datos) para poder especificar, dirigir y auditar los componentes generados por IA. Formalización de contratos mediante OpenAPI. Uso de git y GitHub Flow para la gestión de versiones.  
* Operar entornos de desarrollo agénticos: entender el loop *pensar → actuar → observar* que ejecuta un agente, gobernar la ventana de contexto como recurso finito y configurar el runtime de la herramienta (memoria persistente, reglas, permisos, skills, sub-agentes y modo plan).  
* Extender e integrar el entorno de trabajo: empaquetar y distribuir configuración mediante plugins, adoptar un flujo de trabajo de *spec-driven development*, y conectar el agente con sistemas externos mediante Model Context Protocol (MCP).  
* Aplicar pensamiento computacional: descomponer problemas complejos en especificaciones y planes verificables expresados en lenguaje natural estructurado, sosteniendo el rol de supervisor arquitectónico sobre código funcional, robusto, seguro y alineado con las mejores prácticas de la industria.

# CONTENIDOS MÍNIMOS

* Fundamentos de modelos de lenguaje (LLMs) y arquitecturas agénticas  
* Patrones de diseño y arquitectura para aplicaciones web  
* Ingeniería de prompts, contexto y harness  
* Desarrollo agéntico de software y flujos autónomos  
* Robustez, verificación y calidad de código

# PROGRAMA SINTÉTICO

* Funcionamiento de LLMs  
* Arquitectura frontend y dirección de la IA  
* Arquitectura backend, datos y contratos  
* Fundamentos de desarrollo agéntico y runtime  
* Plugins y spec-driven development  
* Model Context Protocol (MCP)

# **![][image1]**

# 

# PROGRAMA ANALÍTICO

* **Unidad 1 — Funcionamiento de LLMs:** el átomo del lenguaje (tokens y tokenización, *Byte Pair Encoding*). Naturaleza estocástica y predicción del siguiente token. Pre-training: escala y curación de datos, deduplicación, filtrado, infraestructura de cómputo. Modelos base: autocompletado, *in-context learning* y *cutoff date*. Post-training: *Supervised Fine-Tuning* y datasets conversacionales. Alineación mediante *Reinforcement Learning from Human Feedback* (RLHF). Causas técnicas de las alucinaciones y su mitigación por *search-grounding* y uso de herramientas. Límites cognitivos: cómputo finito por token, cadena de razonamiento y modelos de razonamiento entrenados por RL.  
* **Unidad 2 — Arquitectura frontend y dirección de la IA:** el trío web — estructura (HTML semántico), estética (CSS: modelo de caja, layout, tipografía, color, variables) e interactividad (estado, DOM y eventos). El paradigma *single-file platform* y su ventaja para el manejo de contexto en herramientas web gratuitas. Cuatro patrones de prompt para construir interfaz: describir el artefacto, iterar sobre el estado, arreglar el layout y tematizar. Ciclo de trabajo asistido por IA: Architect → Prompter → Reviewer → Tester.  
* **Unidad 3 — Arquitectura backend, datos y contratos:** modelo cliente-servidor y protocolo HTTP (*methods* y *status codes*). REST como estilo: recurso, jerarquía e idempotencia. Rutas, controladores y el *endpoint* entendido como contrato dictable. Modelado de datos: relaciones frente a documentos (SQL/NoSQL) y criterios de elección. Lectura de fallas: 4xx, 5xx, logs y *stack traces*. OpenAPI como formalización escrita del contrato y su render en Swagger UI.  
* **Unidad 4 — Fundamentos de desarrollo agéntico y runtime:** de una IA que escribe a una que actúa. El loop *pensar → actuar → observar*. Las *tools* como interfaz de acción del agente. La ventana de contexto como recurso finito y su gestión activa. Modos de falla del agente y el rol del supervisor. Configuración del runtime: memoria persistente jerárquica (CLAUDE.md), reglas por alcance, archivo de configuración (settings.json), modelo de permisos (allow / deny / ask), skills y slash commands, sub-agentes para aislar contexto, y modo plan.  
* **Unidad 5 — Plugins y *spec-driven development*:** de piezas sueltas de configuración a paquetes distribuibles: anatomía de un plugin, marketplaces e instalación. El flujo de trabajo completo que opera sobre el agente: refinación del diseño por preguntas dirigidas, escritura de planes ejecutables, desarrollo delegado a sub-agentes, desarrollo guiado por pruebas, revisión de código asistida, verificación con evidencia antes de declarar completitud y cierre de la rama. Git y GitHub Flow: commit, branch y pull request como entrega visible del proceso.  
* **Unidad 6 — Model Context Protocol (MCP):** el techo del set de herramientas que trae el host. Por qué un protocolo y no una API: el problema N×M y su colapso a N+M. Arquitectura host / cliente / servidor. Las tres *primitives* que expone un servidor. Discovery dinámico. Transportes local (Stdio) y remoto (Streamable HTTP). Scopes de configuración. Ecosistema vendor-neutral y criterios para decidir qué instalar. Cuándo conviene MCP, cuándo no, y qué riesgos se asumen (superficie de ataque, consumo de contexto y confianza en terceros).  
* **Cierre — Trabajo práctico final y apropiación tecnológica:** consigna, forma y criterios del trabajo práctico final. Exposición temprana de la idea de proyecto por parte de cada estudiante, con devolución sobre alcance y viabilidad antes de comenzar la implementación. Defensa del proceso en el Demo Day: cómo se especificó qué construir, cómo se gestionó el contexto al crecer el proyecto y cómo se detectó y corrigió la deriva del agente. Apropiación tecnológica entendida como capacidad de explicar, corregir y extender el código generado, para evitar el síndrome de la "caja negra" y garantizar mantenimiento y escalabilidad. Las prácticas de calidad, testing y verificación se trabajan de forma transversal dentro de la Unidad 5.

# **![][image1]**

# BIBLIOGRAFÍA

\[1\] Karpathy, A. *Deep Dive into LLMs like ChatGPT*. [https://www.youtube.com/watch?v=7xTGNNLPyMI](https://www.youtube.com/watch?v=7xTGNNLPyMI) — material fuente de la Unidad 1.  
\[2\] Anthropic. *Claude Code — documentación oficial*. [https://code.claude.com/docs](https://code.claude.com/docs) — memoria, settings, permisos, sub-agentes, skills y plugins (Unidades 4 y 5).  
\[3\] *Superpowers* — plugin de flujo de trabajo para Claude Code. [https://github.com/obra/superpowers](https://github.com/obra/superpowers) — Unidad 5.  
\[4\] *Model Context Protocol — documentación y especificación oficial*. [https://modelcontextprotocol.io](https://modelcontextprotocol.io) — Unidad 6.  
\[5\] OpenAPI Initiative. *OpenAPI Specification*. [https://spec.openapis.org](https://spec.openapis.org) — Unidad 3.

# MODALIDAD DE CURSADA

La asignatura se desarrolla en 8 clases de 3 horas semanales con un enfoque fuertemente teórico-práctico. Se orienta al estudiante mediante la exposición de conceptos a través de recursos educativos virtuales y una metodología iterativa de desarrollo asistido por IA, en la que el alumno especifica y supervisa mientras el modelo implementa. Cada tema relevante se acompaña de demostraciones prácticas paso a paso —realizadas en vivo sobre terminal compartida a partir de la Unidad 4— que muestran cómo traducir requerimientos complejos a especificaciones en lenguaje natural, cómo gestionar el contexto en entornos agénticos y cómo delegar la escritura sintáctica a la IA. Se analiza la ejecución y la evolución del software generado, explicando cómo iterar las soluciones, detectar alucinaciones y deriva del agente, y guiar la refactorización, fomentando que el alumno asuma en todo momento un rol de supervisor arquitectónico.

El material se organiza en seis unidades temáticas que no se corresponden una a una con las clases: la Unidad 4 se extiende a lo largo de dos encuentros, en cuyo segundo tramo cada estudiante expone la idea de su trabajo práctico final y recibe devolución sobre alcance y viabilidad; la última clase se destina íntegramente a la exposición final de los proyectos.

# MODALIDAD DE EVALUACIÓN

Para la evaluación y aprobación de la materia el estudiante deberá presentar 3 trabajos prácticos de carácter individual, entregados mediante un único repositorio público de GitHub que mantiene y actualiza a lo largo de toda la cursada, con una carpeta por entrega. El archivo README.md del repositorio funcionará como informe de la entrega y deberá contener el registro del proceso de desarrollo asistido (especificación inicial, prompts principales, manejo de contexto y corrección de desvíos del modelo), las decisiones de arquitectura tomadas por el estudiante, fragmentos clave del código generado, instrucciones para ejecutar el proyecto y observaciones arquitectónicas. A partir de la Unidad 5 se espera además que el repositorio conserve la evidencia del proceso: especificación y plan en disco, historial de commits, ramas y pull requests. El tercer trabajo práctico tiene carácter de Trabajo Práctico Final y debe ser expuesto en la última clase (Demo Day).

# 

# **![][image1]**

| Semana | Temas de teoría/práctica | Bibliografía básica |
| ----- | :---- | :---- |
| 1 | Introducción al curso. Sondeo de experiencia previa. Funcionamiento de LLMs. Tokens y tokenización. Naturaleza estocástica. Pre-training: escala de datos y deduplicación. Infraestructura de cómputo. Modelos base: autocompletado, in-context learning y cutoff date. Post-training: SFT y datasets conversacionales. Alucinaciones: causas técnicas y mitigación (search-grounding, uso de herramientas). RLHF. Límites cognitivos y modelos de razonamiento. | \[1\] |
| 2 | Arquitectura frontend y dirección de la IA. El trío web: estructura (HTML semántico), estética (CSS) e interactividad (estado, DOM y eventos). Teoría de UI: layouts, estado y eventos. Paradigma single-file platform: ventajas para el manejo de contexto en IAs web gratuitas. Cuatro patrones de prompt para construir interfaz. Práctica: construcción grupal de un artefacto de una sola página aplicando el ciclo Architect → Prompter → Reviewer → Tester. |  |
| 3 | Arquitectura backend y datos. Cliente-servidor y protocolo HTTP (methods y status codes). REST como estilo: recurso, jerarquía e idempotencia. Rutas, controladores y el endpoint como contrato. Datos: relaciones vs. documentos (SQL/NoSQL). Lectura de fallas: 4xx, 5xx, logs y stack traces. OpenAPI como contrato escrito. Demo en vivo: dictado del openapi.yaml a una IA web y render del contrato en Swagger UI. | \[5\] |
| 4 | Fundamentos de desarrollo agéntico. De una IA que escribe a una que actúa. El loop pensar → actuar → observar. Tools: la interfaz de acción del agente. La ventana de contexto como recurso finito y su gestión. Modos de falla del agente y el rol del supervisor. Presentación del entorno de trabajo agéntico en terminal. | \[2\] |
| 5 | Configuración del runtime agéntico. Memoria persistente jerárquica (CLAUDE.md) y memoria automática. Reglas por alcance. settings.json. Modelo de permisos: allow / deny / ask. Skills y slash commands. Sub-agentes: aislar contexto. Modo plan y modos de permiso. Práctica: cada estudiante expone la idea de su trabajo práctico final y recibe devolución sobre alcance y viabilidad. | \[2\] |
| 6 | Plugins y spec-driven development. De piezas sueltas a paquetes distribuibles: qué es un plugin, marketplaces e instalación. Instalación en vivo de un plugin de flujo de trabajo. Recorrido del flujo completo: diseño por preguntas dirigidas, escritura del plan, desarrollo delegado a sub-agentes, desarrollo guiado por pruebas, revisión de código, verificación con evidencia y cierre de rama. Git y GitHub Flow: commit, branch y pull request. Bajada al trabajo práctico final. | \[2\] \[3\] |
| 7 | Model Context Protocol (MCP). El techo del set de herramientas del host. Por qué protocolo y no API: de N×M a N+M. Arquitectura host / cliente / servidor. Las tres primitives. Discovery dinámico. Transportes: local (Stdio) y remoto (Streamable HTTP). Scopes de configuración. Ecosistema vendor-neutral y criterios de instalación. Demos en vivo: servidor local de automatización de browser y servidor remoto de gestión de proyectos. Cuándo MCP, cuándo no, y riesgos. | \[4\] |
| 8 | Demo Day: presentación final. Exposición del MVP funcional. Defensa del proceso: especificación, gestión de contexto, detección y corrección de la deriva del agente, y evidencia del flujo de trabajo en el repositorio. Apropiación tecnológica: comprensión estructural y lógica del código para evitar la "caja negra", garantizando mantenimiento y escalabilidad a futuro. |  |

[image1]: <data:image/png;base64,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>
