[Deep Dive into LLMs like ChatGPT](https://www.youtube.com/watch?v=7xTGNNLPyMI)

# Pretraining

## Internet dataset

[HuggingFace FineWeb](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1): conjunto de datos masivo, refinado y de altísima calidad, compuesto por 15 billones de tokens (44 TB) extraídos de la web y filtrados meticulosamente para entrenar modelos de lenguaje. Incluye muchas explicaciones y gráficos interactivos acerca de cómo se obtienen y filtran los datos.

<!-- imagen: screenshot de FineWeb dataset page -->

## Tokenización

Conversión de texto de UTF-8 a Tokens que forman parte de un vocabulario. **Tokenización**. [Tiktokenizer](https://tiktokenizer.vercel.app/?model=cl100k_base).

Entrenar una LLM agarrando ventanas que contienen una secuencia de tokens.

## LLM cómo maquina estocástica de escupir tokens

<!-- imagen: diagrama de prediccion de siguiente token -->

<!-- imagen: arquitectura transformer simplificada -->
Habla un poco de cómo funcionan los transformers. [Visualización de nanoGPT](https://bbycroft.net/llm)

Habla de inferencia haciendo hincapié en la naturaleza estocástica de las LLMs la cual hace que no siempre al siguiente token que se va prediciendo es el mismo ni tampoco necesariamente el que estaba en el dataset.
<!-- imagen: distribucion de probabilidad de tokens -->
Habla de GPT-2 y cómo fue el primer modelo que demostró esto.
<!-- imagen: GPT-2 ejemplo -->

## Cómo la LLM va aprendiendo a escupir tokens

Muestra un poco cómo se ve el proceso de entrenar una LLM
<!-- imagen: curva de entrenamiento -->

<!-- imagen: proceso de entrenamiento paso a paso -->

Habla de cómo se requieren GPU potentes para entrenar eficientemente una LLM, habla de la H100, muestra [Lambda Labs](https://lambda.ai/pricing), muestra cómo un datacenter está compuesto por racks llenos de H100.

## Limitaciones de modelos pre entrenados

Explica cómo lo que se obtiene al entrenar esto no es un asistente aun. Usa el playground de [hyperbolic.ai](https://app.hyperbolic.ai/models/llama31-405b) para tirarle comandos a modelos base que aún no fueron fine-tuneados para ser asistentes. Muestra cómo si pones un pedazo de una página de wikipedia te la autocompleta con el mismo texto y también cómo hacer eso con una pagina que esta fuera del cutoff date se pone a alucinar.

Muestra cómo si le das suficiente contexto en el prompt la LLM puede reconocer patrones en ese texto y realizar mejor una tarea (le pasa un ejemplo de una conversación entre humano y AI assistant y le pide hace un pregunta a lo que la IA responde correctamente).

# Post-Training

## Dataset de preguntas y respuestas

Habla de cómo se requiere armar un nuevo dataset de conversaciones y ese substituye al antiguo dataset del internet.
<!-- imagen: esquema de dataset SFT -->

Uso de tokens especiales para delimitar conversaciones

<!-- imagen: tokens especiales en conversaciones -->
Habla de cómo OpenAI construyó el dataset de preguntas y respuestas usando el [paper original](https://arxiv.org/pdf/2203.02155) cómo base. Usando el paper muestra algunos ejemplos puntuales, instrucciones que se le dio a las personas contratadas para armar el dataset.

## Evolución a asistente

Habla de [openassistant](https://huggingface.co/datasets/OpenAssistant/oasst1), un dataset abierto de preguntas y respuestas. No se puede tener todas las preguntas y respuestas en un dataset pero suficientes ejemplos hacen que el modelo estocástico incorpore esos patrones en sus respuestas.

Menciona otro dataset, [ultrachat](https://github.com/thunlp/UltraChat) el cual fue hecho no solo usando humanos sino también LLMs. Intenta transmitir que al final de cuentas el modelo simplemente fue entrenado con un montón de ejemplos y todo lo que dice solamente es un alineamiento estadístico con ese dataset. Es una simulación de las personas que fueron contratadas para armar datasets de preguntas y respuestas.

[CodeAlpaca-20k](https://huggingface.co/datasets/sahil2801/CodeAlpaca-20k/viewer) Para dataset de coding

# Alucinaciones

## Explicación

<!-- imagen: ejemplo de alucinacion -->
En el dataset de entrenamiento todas las preguntas son respondidas con confianza entonces todo lo que le preguntes lo va a tratar de responder siguiendo manteniendo ese tono, más allá de que sepa la respuesta o no. El modelo a esta altura no tiene acceso a internet, simplemente es un vomitador de tokens y eso se va a ver reflejado en su respuesta. Usa [huggingface playground](https://huggingface.co/spaces/huggingface/inference-playground) para tirar esa pregunta de Orson Kovacs y mostrar cómo cada vez da una respuesta distinta. La página también se puede usar para comparar otros modelos y ver cómo cada uno alucina distinto.

## Soluciones

Habla de la forma en la que Meta disminuyo las alucinaciones para Llama 3 usando [este paper](https://arxiv.org/pdf/2407.21783) cómo referencia. Básicamente, van descubriendo ejemplos de información que el modelo no sabe (por ejemplo agarrando artículos de wikipedia y analizandolos con LLMs para descubrir qué información no es dada en el articulo) y con eso arman un nuevo dataset de preguntas y respuestas en el cual las preguntas son cosas que saben que la LLM no sabe y la respuesta es "No lo se". Este proceso puede ser realizado completamente por IA.
<!-- imagen: proceso de reduccion de alucinaciones Llama 3 -->

Luego habla de cómo una forma de disminuir las alucinaciones es en general utilizando mecanismos que permitan popular la memoria (contexto) de la LLM con información relevante. Por ejemplo dándole al modelo la capacidad de buscar en internet usando tokens especiales para eso. Menciona cómo la combinación de conocimiento adquirido en pre training hace que solamente un par de ejemplos en post-training permita que la LLM sepa cómo hacer buenas búsquedas en el navegador para encontrar lo que necesita. Usa interfaz de chatgpt para mostrar eso.

<!-- imagen: conocimiento en pesos vs contexto -->
Habla de cómo el conocimiento embebido en los pesos del modelo es cómo un "vago recuerdo" mientras que meterle información en el contexto es más bien una memoria funcional.

## El "yo" de un modelo

Habla de cómo no tiene sentido preguntarle al modelo preguntas sobre quién es o tratarlo cómo si tuviese un sentido del "yo" porque al final de cuentas es un vomitador de tokens entrenado con todo el texto del mundo y luego calibrado para responder cómo un asistente. Así que lo que responda a ese tipo de preguntas no va a ser más que una mezcla estocástica de todo eso combinado con lo que sea que el proveedor del modelo le agregue por defecto al contexto cuando inicia una conversación. Muestra cómo [este dataset](https://huggingface.co/datasets/allenai/olmo-2-hard-coded) tiene claros ejemplos de preguntas y respuestas relacionadas con el responder sobre sí mismo.

Idea propia: mostrar diferencia entre decirle "who are you" a un modelo base y a un modelo instruct.
<!-- imagen: comparacion modelo base vs instruct respondiendo "who are you" -->

Trata de generar intuición acerca de cómo las LLMs necesitan generar tokens para pensar, cómo cada nuevo token que se genera va a usar la misma capacidad de cómputo sin importar su relevancia en la respuesta entonces si en lugar de responder de forma directa a una pregunta antes se pone a generar tokens que sean relevantes para llegar a una respuesta, entonces la respuesta final probablemente sea mucho mejor porque de cierta forma está distribuyendo su capacidad de pensamiento entre todos esos tokens. Usa tiktokenizer con el texto de la imagen cómo ayuda.

Mención a cómo para resolver problemas de aritmética decirle al modelo "use code" va a hacer que genere y ejecute un pequeño programa que lo calcule. En general, usar métodos que permitan al modelo descomponer el problema que tiene que resolver en problemas más chicos que puede ir resolviendo generando tokens va a hacer que el resultado sea mejor.

<!-- imagen: ejemplo de chain of thought -->
<!-- imagen: ejemplo de tool use para aritmetica -->

Trata de generar intuición acerca de por que tareas cómo aritmetica o deletreo no son el punto fuerte de estos modelos:
<!-- imagen: tokenizacion y aritmetica -->

# Reinforcement Learning Post-Training

Última etapa del entrenamiento de una LLM moderna (versiones de ChatGPT anteriores a o1, o3, etc no hacían esto), análogo a hacer los ejercicios de un libro. Miras la letra del ejercicio, ves cual es el resultado en el solucionario e iterativamente vas haciendo prueba y error hasta llegar al resultado.

A pesar de la simple regla de no concentrar capacidad de responder en pocos tokens, igualmente no siempre es claro que tipo de respuesta es mejor mostrarle a una LLM durante el entrenamiento, porque varias pueden parecer válidas y nosotros no somos la LLM cómo para saber que la resulta mejor:
<!-- imagen: multiples respuestas validas -->

Entonces lo que se quiere es que el modelo descubra por su cuenta cómo le sirve pensar. La forma de hacer eso es darle un problema para que resuelva, pedirle muchas veces que trate de resolver ese problema, evaluar en cuál de esos intentos logró el resultado más correcto (no solo correcto sino también el más corto o mejor explicado o algo por el estilo) y usar esa respuesta generada para entrenar el modelo:

<!-- imagen: diagrama de reinforcement learning -->

## DeepSeek

Habla de cómo antes de que DeepSeek publique su [paper](https://arxiv.org/pdf/2501.12948) a principio de 2025, los conocimientos que las grandes empresas de IA tenían sobre cómo hacer reinforcement learning era cerrado y ahí llegó DeepSeek y sacó un modelo que estaba en un nivel muy similar e hizo público el procedimiento de reinforcement learning que utilizo para entrenar el modelo.

<!-- imagen: resultados DeepSeek -->

Lo interesante de DeepSeek es que por un lado introdujeron el uso del token \<thinking\> para encapsular los tokens generados por el modelo que son relacionados con pensar y no con la respuesta propiamente dicha. Por otro lado, el modelo descubrió por su propia cuenta con ensayo y error que la forma de generar tokens que más le servía para resolver problemas era con pensamientos largos en los que en el propio pensamiento va evaluando distintas formas de resolver el problema y teniendo momentos de "eureka" donde se va dando cuenta que logró avances hacia resolver el problema.

## AlphaGo

Menciona cómo DeepMind al entrenar su modelo que juega al Go, dejó muy en evidencia que solamente tratar de imitar a los mejores jugadores del mundo no era suficiente para ser mejor que ellos. Es necesario permitir que el modelo aprenda por sí mismo para lograr eso.
<!-- imagen: AlphaGo resultados -->
