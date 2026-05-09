/**
 * Backend Flow — interactive request lifecycle diagram for §1.4
 *
 * Layout:
 *   [ Cliente ]  →request→   [ Servidor: HTTP → REST → Endpoints → Datos ]
 *                                                                ↓
 *                                                          Errores | Response
 *                                                                ↓
 *   [ Cliente ]  ←response← (200 / 500)
 *
 * Click "Avanzar" steps through the 6 stages of a request:
 *   1. Cliente fires request → HTTP receives
 *   2. REST identifies the resource
 *   3. Endpoints matches the contract
 *   4. Datos runs the query (dice rolled here: 70% success / 30% error)
 *   5. Branch lights up (Errores 5xx or Response 2xx)
 *   6. Response delivered back to Cliente; Cliente block shows the result
 *
 * Salto al stack local is intentionally NOT in this diagram — it's the
 * pedagogical bisagra to next class, not part of the request lifecycle.
 *
 * Dependencies (loaded via <head> CDN):
 *   - lucide  (icons)
 */

function initBackendFlow(opts) {
  var container = document.getElementById(opts.containerId);
  if (!container) return;

  var REQUEST_PAYLOAD = '{ "title": "Comprar pan" }';

  var STEPS = {
    1: {
      key: 'http',
      title: 'HTTP — el protocolo',
      desc: 'Apenas la request llega, HTTP la desempaca: lee el method (POST), el path (/projects/4/tasks), los headers (metadatos) y el body (el contenido). Hasta acá no hay lógica de aplicación, solo saber qué llegó.',
      code: 'POST /projects/4/tasks  HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{ "title": "Comprar pan" }'
    },
    2: {
      key: 'rest',
      title: 'REST — el estilo',
      desc: 'REST (REpresentational State Transfer) modela recursos — cosas concretas como tareas, proyectos o usuarios — no verbos. Lee la URL y reconoce qué cosa estás tocando: tasks dentro de projects/4. La acción la lleva el method (POST = crear), no el path.',
      code: 'recurso : tasks\nparent  : projects/4\nformato : JSON'
    },
    3: {
      key: 'endpoints',
      title: 'Endpoints — el contrato',
      desc: 'Match contra la tabla de routes que el servidor tiene declaradas. Encuentra el handler (la función) que se compromete a atender este pedido bajo un contrato: method + path + schema-in + schema-out + status codes.',
      code: 'POST /projects/{id}/tasks\n  in  : { title, due_date? }\n  201 : { id, title, project_id }\n  400 : title requerido\n  404 : proyecto no existe'
    },
    4: {
      key: 'datos',
      title: 'Datos — la memoria',
      desc: 'El handler ejecuta el INSERT contra la base. Y acá está el momento de la verdad: la base tiene sus propias reglas (foreign keys, NOT NULL, unique constraints) y puede aceptar la escritura o rechazarla.',
      code: 'INSERT INTO tasks\n  (title, project_id)\nVALUES (?, ?);'
    },
    '5-success': {
      key: 'response',
      title: 'Response 2xx — éxito',
      desc: 'La base aceptó. El handler arma una response con el objeto recién creado y status 201. Como cuando un servidor web te devuelve la página que pediste — pero el contenido acá es JSON estructurado, listo para que el cliente lo consuma.',
      code: 'status: 200 OK\nContent-Type: application/json\n\n{ "id": 17,\n  "title": "Comprar pan",\n  "project_id": 4,\n  "due_date": null }'
    },
    '5-error': {
      key: 'errores',
      title: 'Errores 5xx — falla',
      desc: 'La base rechazó. El handler captura la excepción, escribe el stack trace al log (lo vemos en la sección seis) y arma una response 5xx con un mensaje genérico. La evidencia queda del lado del servidor; el cliente solo ve el código.',
      code: 'status: 500 Internal Server Error\n\nlog:\n  IntegrityError: NOT NULL\n  constraint failed: project_id\n  app/routes/tasks.py:14'
    },
    6: {
      // Step 6 reuses the branch detail (the Cliente receives the same response).
      // The detail content is built dynamically based on outcome.
    }
  };

  var CLIENT_RESPONSES = {
    success: {
      status: '200 OK',
      body: '{\n  "id": 17,\n  "title": "Comprar pan",\n  "project_id": 4,\n  "due_date": null\n}'
    },
    error: {
      status: '500 Internal Server Error',
      body: '{\n  "detail": "Internal Server Error"\n}'
    }
  };

  var state = {
    step: 0,        // 0 = idle, 1..6 = active steps
    outcome: null   // 'success' | 'error' (rolled at step 4 advance)
  };

  function render() {
    container.innerHTML = '' +
      '<div class="s14-stage">' +
        '<div class="s14-architecture">' +
          // Cliente block
          '<div class="s14-client" id="s14-client">' +
            '<i data-lucide="monitor" class="s14-client-icon"></i>' +
            '<div class="s14-client-label">Cliente</div>' +
            '<div class="s14-client-sub">tu navegador</div>' +
            '<div class="s14-client-payload" id="s14-client-payload">' +
              '<div class="s14-mono-mini">POST /projects/4/tasks</div>' +
              '<div class="s14-mono-mini">' + REQUEST_PAYLOAD + '</div>' +
            '</div>' +
          '</div>' +
          // Request/response arrows column
          '<div class="s14-arrows">' +
            '<div class="s14-arrow-row s14-arrow-request" id="s14-arrow-req">' +
              '<span class="s14-arrow-line"></span>' +
              '<span class="s14-arrow-label">request</span>' +
            '</div>' +
            '<div class="s14-arrow-row s14-arrow-response" id="s14-arrow-res">' +
              '<span class="s14-arrow-label">response</span>' +
              '<span class="s14-arrow-line s14-arrow-line-rev"></span>' +
            '</div>' +
          '</div>' +
          // Servidor box
          '<div class="s14-server">' +
            '<div class="s14-server-label">Servidor</div>' +
            '<div class="s14-pipeline-top">' +
              buildNode('http',      'HTTP',      'protocolo', 'globe',     1) +
              hArrow() +
              buildNode('rest',      'REST',      'estilo',    'git-fork',  2) +
              hArrow() +
              buildNode('endpoints', 'Endpoints', 'contract',  'plug-zap',  3) +
              hArrow() +
              buildNode('datos',     'Datos',     'memoria',   'database',  4) +
            '</div>' +
            '<div class="s14-pipeline-fork">' +
              '<svg viewBox="0 0 200 36" preserveAspectRatio="none" class="s14-fork-svg">' +
                '<path d="M 100 2 V 14 M 100 14 L 30 32 M 100 14 L 170 32" ' +
                       'stroke="#5a6a8a" stroke-width="1.5" fill="none"/>' +
                '<polygon points="26,28 30,32 34,28" fill="#5a6a8a"/>' +
                '<polygon points="166,28 170,32 174,28" fill="#5a6a8a"/>' +
              '</svg>' +
            '</div>' +
            '<div class="s14-pipeline-bottom">' +
              buildNode('errores',  'Errores',  '5xx', 'alert-triangle', '5-error',   's14-branch-node') +
              '<div></div>' +
              buildNode('response', 'Response', '2xx', 'check-circle-2', '5-success', 's14-branch-node') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="s14-detail" id="s14-detail"></div>' +
      '</div>' +
      '<div class="s14-controls">' +
        '<button class="s14-button" data-action="next">Avanzar</button>' +
        '<button class="s14-button s14-button-ghost" data-action="reset">Reiniciar</button>' +
        '<span class="s14-progress" id="s14-progress">listo</span>' +
      '</div>';

    if (typeof lucide !== 'undefined') {
      try { lucide.createIcons({ attrs: { width: 22, height: 22 } }); } catch (e) {}
    }

    container.querySelector('[data-action="next"]').addEventListener('click', advance);
    container.querySelector('[data-action="reset"]').addEventListener('click', reset);
  }

  function buildNode(key, label, sub, icon, step, extraClass) {
    return '<div class="s14-node ' + (extraClass || '') + '" data-step="' + step + '" data-key="' + key + '">' +
      '<i data-lucide="' + icon + '" class="s14-node-icon"></i>' +
      '<div class="s14-node-label">' + label + '</div>' +
      '<div class="s14-node-sub">' + sub + '</div>' +
    '</div>';
  }

  function hArrow() {
    return '<div class="s14-h-arrow"><span></span></div>';
  }

  function advance() {
    if (state.step >= 6) return;
    if (state.step === 3) {
      state.outcome = Math.random() < 0.70 ? 'success' : 'error';
    }
    state.step += 1;
    applyState();
  }

  function reset() {
    state.step = 0;
    state.outcome = null;
    applyState();
  }

  function applyState() {
    var stepNum = state.step;

    // Reset all node classes
    container.querySelectorAll('.s14-node').forEach(function (el) {
      el.classList.remove('is-active', 'is-visited', 'is-success', 'is-error', 'is-dimmed');
    });

    // Reset cliente and arrow classes
    var client = container.querySelector('#s14-client');
    var arrowReq = container.querySelector('#s14-arrow-req');
    var arrowRes = container.querySelector('#s14-arrow-res');
    var clientPayload = container.querySelector('#s14-client-payload');
    client.classList.remove('is-waiting', 'is-success', 'is-error');
    arrowReq.classList.remove('is-active');
    arrowRes.classList.remove('is-active', 'is-success', 'is-error');

    // Step 1+: request arrow + cliente in waiting state
    if (stepNum >= 1) {
      arrowReq.classList.add('is-active');
      client.classList.add('is-waiting');
    }

    // Mark linear nodes 1..min(step, 4)
    for (var i = 1; i <= Math.min(stepNum, 4); i++) {
      var el = container.querySelector('.s14-node[data-step="' + i + '"]');
      if (!el) continue;
      el.classList.add(i === stepNum ? 'is-active' : 'is-visited');
    }

    // Branch nodes (step 5+): light the chosen one, dim the other
    var errorEl = container.querySelector('.s14-node[data-step="5-error"]');
    var successEl = container.querySelector('.s14-node[data-step="5-success"]');
    if (stepNum >= 5) {
      if (state.outcome === 'success') {
        successEl.classList.add(stepNum === 5 ? 'is-active' : 'is-visited', 'is-success');
        errorEl.classList.add('is-dimmed');
      } else {
        errorEl.classList.add(stepNum === 5 ? 'is-active' : 'is-visited', 'is-error');
        successEl.classList.add('is-dimmed');
      }
    }

    // Step 6: response arrow + cliente shows the response
    if (stepNum >= 6) {
      arrowRes.classList.add('is-active');
      arrowRes.classList.add(state.outcome === 'success' ? 'is-success' : 'is-error');
      client.classList.remove('is-waiting');
      client.classList.add(state.outcome === 'success' ? 'is-success' : 'is-error');
      var resp = CLIENT_RESPONSES[state.outcome];
      clientPayload.innerHTML =
        '<div class="s14-client-payload-label">recibido</div>' +
        '<div class="s14-mono-mini" style="color: ' + (state.outcome === 'success' ? '#10b981' : '#ef4444') + ';">' + resp.status + '</div>' +
        '<pre class="s14-client-response"><code>' + escapeHtml(resp.body) + '</code></pre>';
    } else {
      // Show the outgoing request payload
      clientPayload.innerHTML =
        '<div class="s14-client-payload-label">enviando</div>' +
        '<div class="s14-mono-mini">POST /projects/4/tasks</div>' +
        '<div class="s14-mono-mini" style="color: var(--text-muted);">' + REQUEST_PAYLOAD + '</div>';
    }

    // Detail panel
    updateDetail();

    // Progress + button
    var progress = container.querySelector('#s14-progress');
    var nextBtn = container.querySelector('[data-action="next"]');
    if (stepNum === 0) {
      progress.textContent = 'listo';
      progress.className = 's14-progress';
    } else if (stepNum < 6) {
      progress.textContent = 'paso ' + stepNum + ' / 6';
      progress.className = 's14-progress';
    } else {
      progress.textContent = state.outcome === 'success' ? 'cliente recibió 200 OK' : 'cliente recibió 500';
      progress.className = 's14-progress ' + (state.outcome === 'success' ? 'success' : 'error');
    }
    nextBtn.disabled = stepNum >= 6;
  }

  function updateDetail() {
    var detail = container.querySelector('#s14-detail');
    var stepNum = state.step;

    if (stepNum === 0) {
      detail.innerHTML =
        '<div class="s14-detail-left">' +
          '<div class="s14-detail-meta">paso 0 / 6</div>' +
          '<div class="s14-detail-title">Click en "Avanzar" para mandar una request</div>' +
          '<div class="s14-detail-desc">El cliente arma un POST. La request viaja al servidor, recorre cuatro piezas y vuelve con un 2xx o un 5xx. En el paso 4 se tira el dado: 70% éxito, 30% error.</div>' +
        '</div>' +
        '<pre class="s14-detail-code"><code></code></pre>';
      return;
    }

    var info;
    var titleColor = 'var(--accent)';

    if (stepNum >= 1 && stepNum <= 4) {
      info = STEPS[stepNum];
    } else if (stepNum === 5) {
      info = state.outcome === 'success' ? STEPS['5-success'] : STEPS['5-error'];
      titleColor = state.outcome === 'success' ? '#10b981' : '#ef4444';
    } else if (stepNum === 6) {
      // Cliente received the response
      var resp = CLIENT_RESPONSES[state.outcome];
      info = {
        title: state.outcome === 'success'
          ? 'Cliente recibió 200 OK'
          : 'Cliente recibió 500',
        desc: state.outcome === 'success'
          ? 'La response viajó de vuelta al cliente con el objeto creado. La cadena contrato → código → servidor → cliente cierra exitosamente.'
          : 'La response viajó de vuelta al cliente con el código 500 y un cuerpo mínimo. El detalle del error queda en el log del servidor — para razonar el fix con la IA.',
        code: 'status: ' + resp.status + '\n\n' + resp.body
      };
      titleColor = state.outcome === 'success' ? '#10b981' : '#ef4444';
    }

    var diceTag = (stepNum >= 4 && state.outcome) ?
      ' &middot; <span style="color:' + (state.outcome === 'success' ? '#10b981' : '#ef4444') + '">dado: ' + (state.outcome === 'success' ? 'éxito' : 'error') + '</span>'
      : '';

    detail.innerHTML =
      '<div class="s14-detail-left">' +
        '<div class="s14-detail-meta">paso ' + stepNum + ' / 6' + diceTag + '</div>' +
        '<div class="s14-detail-title" style="color: ' + titleColor + ';">' + info.title + '</div>' +
        '<div class="s14-detail-desc">' + info.desc + '</div>' +
      '</div>' +
      '<pre class="s14-detail-code"><code>' + escapeHtml(info.code) + '</code></pre>';
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  render();
  applyState();
}
