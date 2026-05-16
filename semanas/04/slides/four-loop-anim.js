/**
 * four-loop-anim.js
 * Bespoke animation for the PENSAR → ACTUAR → OBSERVAR loop.
 * No external deps. Vanilla JS. No build step.
 * Animation contract: exports initFourLoop(opts), manipulates DOM directly,
 * listens to Reveal.js lifecycle for re-render on slide change.
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initFourLoop: factory() };
  } else {
    root.initFourLoop = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var revealListenerRegistered = false;
  var allInstances = [];

  function injectStyles() {
    if (document.getElementById('four-loop-anim-styles')) return;
    var style = document.createElement('style');
    style.id = 'four-loop-anim-styles';
    style.textContent = [
      '@keyframes fourLoopPulse {',
      '  0%   { opacity: 1; }',
      '  50%  { opacity: 0.4; }',
      '  100% { opacity: 1; }',
      '}',
      '.fla-pulse {',
      '  animation: fourLoopPulse 1.4s ease-in-out infinite;',
      '}',
      '.fla-node {',
      '  transition: border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;',
      '}',
      '.fla-chip {',
      '  transition: opacity 0.3s ease, background 0.3s ease;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function getSlideForContainer(container) {
    var el = container;
    while (el) {
      if (el.classList && (el.classList.contains('present') || el.classList.contains('future') || el.classList.contains('past'))) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function isContainerVisible(container) {
    var el = container;
    while (el) {
      if (el.classList && el.classList.contains('present')) return true;
      if (el.classList && (el.classList.contains('future') || el.classList.contains('past'))) return false;
      el = el.parentElement;
    }
    // Fallback: assume visible if not inside reveal hierarchy
    return true;
  }

  // CSS helpers
  var NODE_BASE = [
    'display:inline-flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:center',
    'min-width:110px',
    'padding:10px 14px',
    'border-radius:8px',
    'background:var(--bg-secondary)',
    'border:2px solid var(--text-muted)',
    'font-family:var(--font-mono)',
    'font-size:0.78em',
    'color:var(--text-primary)',
    'text-align:center',
    'cursor:default',
    'position:relative',
  ].join(';');

  function nodeStyle(extraStyle) {
    return NODE_BASE + (extraStyle ? ';' + extraStyle : '');
  }

  function litNodeStyle(color) {
    color = color || 'var(--accent)';
    return nodeStyle(
      'border-color:' + color + ';' +
      'color:' + color + ';' +
      'font-weight:700;' +
      'box-shadow:0 0 10px ' + color + '55'
    );
  }

  function dimNodeStyle() {
    return nodeStyle('opacity:0.38;color:var(--text-muted)');
  }

  function arrowSvg(opts) {
    // opts: { width, height, lit, thick, pulse, curved, returnArc }
    // Returns an SVG element as HTML string
    var color = opts.lit ? 'var(--accent)' : 'var(--text-muted)';
    var strokeW = opts.thick ? 3 : 2;
    var cls = opts.pulse ? ' class="fla-pulse"' : '';
    var w = opts.width || 40;
    var h = opts.height || 24;

    if (opts.returnArc) {
      // Curved return arc OBSERVAR → PENSAR (drawn as SVG below the row)
      // Wide arc spanning from right back to left
      var arcW = opts.arcWidth || 360;
      var arcH = opts.arcHeight || 38;
      return (
        '<svg' + cls + ' width="' + arcW + '" height="' + arcH + '" viewBox="0 0 ' + arcW + ' ' + arcH + '" style="display:block;overflow:visible">' +
        '<defs><marker id="fla-ah-ret" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">' +
        '<polygon points="0 0, 8 3, 0 6" fill="' + color + '"/>' +
        '</marker></defs>' +
        '<path d="M ' + (arcW - 10) + ' 4 Q ' + (arcW / 2) + ' ' + (arcH + 12) + ' 10 4"' +
        ' fill="none" stroke="' + color + '" stroke-width="' + strokeW + '" marker-end="url(#fla-ah-ret)"/>' +
        '</svg>'
      );
    }

    // Simple horizontal arrow
    return (
      '<svg' + cls + ' width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:inline-block;vertical-align:middle">' +
      '<defs><marker id="fla-ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">' +
      '<polygon points="0 0, 8 3, 0 6" fill="' + color + '"/>' +
      '</marker></defs>' +
      '<line x1="2" y1="' + (h / 2) + '" x2="' + (w - 8) + '" y2="' + (h / 2) + '"' +
      ' stroke="' + color + '" stroke-width="' + strokeW + '" marker-end="url(#fla-ah)"/>' +
      '</svg>'
    );
  }

  function exitChipsHtml(dimAll) {
    var chips = [
      'objetivo alcanzado',
      'límite de pasos',
      'pide ayuda',
      'falla no recuperable',
    ];
    var html = '<div style="margin-top:14px;text-align:center;">';
    html += '<div style="font-size:0.58em;color:var(--text-muted);margin-bottom:5px;letter-spacing:0.05em;text-transform:uppercase;">condiciones de corte</div>';
    html += '<div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap;">';
    chips.forEach(function (chip) {
      var opacity = dimAll ? '0.28' : '1';
      html += '<span class="fla-chip" style="' +
        'font-family:var(--font-mono);' +
        'font-size:0.6em;' +
        'padding:3px 9px;' +
        'border-radius:12px;' +
        'background:var(--bg-code);' +
        'border:1px solid var(--text-muted);' +
        'color:var(--text-muted);' +
        'opacity:' + opacity + ';' +
        '">' + chip + '</span>';
    });
    html += '</div></div>';
    return html;
  }

  function sublabel(text) {
    return '<span style="font-size:0.78em;color:var(--text-muted);font-weight:400;display:block;margin-top:2px;">' + text + '</span>';
  }

  function caption(text) {
    return '<div style="margin-top:10px;font-size:0.62em;color:var(--text-muted);font-style:italic;text-align:center;">' + text + '</div>';
  }

  function nodeHtml(label, subText, styleStr, extraHtml) {
    return '<div class="fla-node" style="' + styleStr + '">' +
      '<span style="font-size:0.88em;letter-spacing:0.05em;">' + label + '</span>' +
      (subText ? sublabel(subText) : '') +
      (extraHtml || '') +
      '</div>';
  }

  function buildBaseRow(opts) {
    // Returns { pensarStyle, actuarStyle, observarStyle, arrowPA_lit, arrowAO_lit }
    var phase = opts.phase;
    var mode  = opts.mode || 'intro';
    var labels = opts.labels || {};

    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    var pensarStyle  = nodeStyle();
    var actuarStyle  = nodeStyle();
    var observarStyle = nodeStyle();
    var arrowPA_lit  = false;
    var arrowAO_lit  = false;

    // Phase highlighting overrides
    if (phase === 'pensar') {
      pensarStyle  = litNodeStyle();
      actuarStyle  = dimNodeStyle();
      observarStyle = dimNodeStyle();
    } else if (phase === 'actuar') {
      actuarStyle  = litNodeStyle();
      pensarStyle  = dimNodeStyle();
      observarStyle = dimNodeStyle();
      arrowPA_lit  = true;
    } else if (phase === 'observar') {
      observarStyle = litNodeStyle();
      pensarStyle  = dimNodeStyle();
      actuarStyle  = dimNodeStyle();
      arrowAO_lit  = true;
    }

    return {
      pensarStyle:   pensarStyle,
      actuarStyle:   actuarStyle,
      observarStyle: observarStyle,
      pensarLabel:   pensarLabel,
      actuarLabel:   actuarLabel,
      observarLabel: observarLabel,
      arrowPA_lit:   arrowPA_lit,
      arrowAO_lit:   arrowAO_lit,
    };
  }

  // ─── MODE RENDERERS ──────────────────────────────────────────────────────────

  function renderIntro(container, opts) {
    var b = buildBaseRow(opts);
    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    // Row
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(b.pensarLabel,  null, b.pensarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: b.arrowPA_lit });
    html += nodeHtml(b.actuarLabel,  null, b.actuarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: b.arrowAO_lit });
    html += nodeHtml(b.observarLabel, null, b.observarStyle);
    html += '</div>';
    // Return arc
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: false });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    // Exit chips
    html += exitChipsHtml(false);
    html += '</div>';
    container.innerHTML = html;
  }

  function renderTool(container, opts) {
    // ACTUAR=(llamada), OBSERVAR=(resultado) lit with --accent-secondary; PENSAR dimmed
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';
    var pensarStyle  = dimNodeStyle();
    var actuarStyle  = litNodeStyle('var(--accent-secondary)');
    var observarStyle = litNodeStyle('var(--accent-secondary)');

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(pensarLabel,  null, pensarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: false });
    html += nodeHtml(actuarLabel,  '(llamada)', actuarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: true });
    html += nodeHtml(observarLabel, '(resultado)', observarStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: false });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += exitChipsHtml(true);
    html += '</div>';
    container.innerHTML = html;
  }

  function renderFill(container, opts) {
    var b = buildBaseRow(opts);

    var html = '<div style="display:flex;align-items:flex-start;gap:20px;padding:10px 0;justify-content:center;">';
    // Left: cycle
    html += '<div style="display:flex;flex-direction:column;align-items:center;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(b.pensarLabel,  null, b.pensarStyle);
    html += arrowSvg({ width: 36, height: 24, lit: b.arrowPA_lit });
    html += nodeHtml(b.actuarLabel,  null, b.actuarStyle);
    html += arrowSvg({ width: 36, height: 24, lit: b.arrowAO_lit });
    html += nodeHtml(b.observarLabel, null, b.observarStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:354px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 354, arcHeight: 34, lit: false });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += exitChipsHtml(false);
    html += '</div>';

    // Right: context window bar
    html += '<div style="display:flex;flex-direction:column;align-items:center;margin-top:4px;">';
    html += '<div style="font-size:0.6em;color:var(--text-muted);margin-bottom:6px;letter-spacing:0.04em;">ventana de contexto</div>';
    // Outer bar
    html += '<div style="width:36px;height:130px;border:2px solid var(--text-muted);border-radius:6px;background:var(--bg-code);position:relative;overflow:hidden;">';
    // Token chips filling ~60% from bottom
    // 60% of 126px inner ≈ 76px
    html += '<div style="position:absolute;bottom:0;left:0;right:0;height:76px;display:flex;flex-direction:column-reverse;flex-wrap:wrap;align-content:flex-start;gap:2px;padding:2px;">';
    // Render small token chips
    var chipCount = 24;
    for (var i = 0; i < chipCount; i++) {
      html += '<div style="width:10px;height:10px;border-radius:2px;background:var(--accent-secondary);opacity:0.75;"></div>';
    }
    html += '</div>';
    html += '</div>';
    html += '<div style="font-size:0.55em;color:var(--text-muted);margin-top:5px;text-align:center;max-width:80px;">cada vuelta deposita tokens</div>';
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
  }

  function renderInfinite(container, opts) {
    var b = buildBaseRow(opts);

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(b.pensarLabel,  null, b.pensarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: b.arrowPA_lit });
    html += nodeHtml(b.actuarLabel,  null, b.actuarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: b.arrowAO_lit });
    html += nodeHtml(b.observarLabel, null, b.observarStyle);
    html += '</div>';
    // Thick pulsing return arc
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: true, thick: true, pulse: true });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--accent);font-family:var(--font-mono);font-weight:700;">repetir</span>';
    html += '</div>';
    // All exit chips dimmed
    html += exitChipsHtml(true);
    html += caption('ninguna condición de corte se cumple');
    html += '</div>';
    container.innerHTML = html;
  }

  function renderDrift(container, opts) {
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    // All nodes tinted off
    var dimStyle = nodeStyle('opacity:0.55;color:var(--text-muted)');

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    // PENSAR with strikethrough objective label
    var pensarExtra = '<div style="margin-top:4px;font-size:0.68em;">' +
      '<span style="text-decoration:line-through;color:var(--text-muted);opacity:0.6;">objetivo: A</span>' +
      '<span style="color:var(--text-muted);margin-left:4px;">→ tarea B</span>' +
      '</div>';
    html += nodeHtml(pensarLabel, null, dimStyle, pensarExtra);
    html += arrowSvg({ width: 40, height: 24, lit: false });
    html += nodeHtml(actuarLabel, null, dimStyle);
    html += arrowSvg({ width: 40, height: 24, lit: false });
    html += nodeHtml(observarLabel, null, dimStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: false });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += exitChipsHtml(false);
    html += caption('arrancó en A, terminó en otra');
    html += '</div>';
    container.innerHTML = html;
  }

  function renderCC(container, opts) {
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    var litStyle = litNodeStyle('var(--accent)');

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(pensarLabel,   '(texto razonando)',          litStyle);
    html += arrowSvg({ width: 40, height: 24, lit: true });
    html += nodeHtml(actuarLabel,   '(Edit · Bash · Read · Write)', litStyle);
    html += arrowSvg({ width: 40, height: 24, lit: true });
    html += nodeHtml(observarLabel, '(resultado)',                  litStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: true });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--accent);font-family:var(--font-mono);font-weight:700;">repetir</span>';
    html += '</div>';
    html += exitChipsHtml(false);
    html += '</div>';
    container.innerHTML = html;
  }

  function renderSubagent(container, opts) {
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    var dimStyle = nodeStyle('opacity:0.38;color:var(--text-muted)');
    var subStyle = nodeStyle('min-width:72px;padding:7px 9px;font-size:0.72em;');

    var html = '<div style="display:flex;align-items:flex-start;gap:20px;padding:10px 0;justify-content:center;">';

    // Main cycle (dimmed)
    html += '<div style="display:flex;flex-direction:column;align-items:center;">';
    html += '<div style="font-size:0.6em;color:var(--text-muted);margin-bottom:6px;letter-spacing:0.04em;">agente principal</div>';
    html += '<div style="display:flex;align-items:center;gap:5px;">';
    html += nodeHtml(pensarLabel,  null, dimStyle);
    html += arrowSvg({ width: 32, height: 22, lit: false });
    html += nodeHtml(actuarLabel,  null, dimStyle);
    html += arrowSvg({ width: 32, height: 22, lit: false });
    html += nodeHtml(observarLabel, null, dimStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:310px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 310, arcHeight: 30, lit: false });
    html += '<span style="position:absolute;bottom:1px;left:50%;transform:translateX(-50%);font-size:0.58em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += '</div>';

    // Arrow from sub-agent back to main + resultado chip
    html += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;margin-top:40px;">';
    html += '<span style="font-family:var(--font-mono);font-size:0.6em;padding:3px 8px;border-radius:10px;background:var(--bg-code);border:1px solid var(--accent);color:var(--accent);">resultado</span>';
    html += '<div style="margin-top:4px;">' + arrowSvg({ width: 36, height: 22, lit: true }) + '</div>';
    html += '</div>';

    // Sub-agent box
    html += '<div style="display:flex;flex-direction:column;align-items:center;">';
    html += '<div style="font-size:0.6em;color:var(--accent);margin-bottom:6px;letter-spacing:0.04em;font-weight:700;border:1px solid var(--accent);border-radius:4px;padding:2px 8px;">sub-agent · ventana propia</div>';
    html += '<div style="display:flex;align-items:center;gap:4px;">';
    html += nodeHtml(pensarLabel,  null, subStyle);
    html += arrowSvg({ width: 26, height: 20, lit: false });
    html += nodeHtml(actuarLabel,  null, subStyle);
    html += arrowSvg({ width: 26, height: 20, lit: false });
    html += nodeHtml(observarLabel, null, subStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:260px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 260, arcHeight: 26, lit: false });
    html += '<span style="position:absolute;bottom:1px;left:50%;transform:translateX(-50%);font-size:0.56em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += caption('el loop entero, aislado; al padre vuelve solo el resultado');
    container.innerHTML = html;
  }

  function renderPlanmode(container, opts) {
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    var pensarStyle  = litNodeStyle();
    var actuarStyle  = dimNodeStyle();
    var observarStyle = dimNodeStyle();

    // Gate element
    var gateHtml = '<div style="' +
      'display:inline-flex;flex-direction:column;align-items:center;justify-content:center;' +
      'width:16px;min-height:60px;border-radius:4px;' +
      'background:var(--accent);' +
      'position:relative;' +
      '">' +
      '<span style="' +
        'font-family:var(--font-mono);font-size:0.52em;font-weight:700;color:var(--bg-primary);' +
        'writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);' +
        'white-space:nowrap;padding:4px 0;' +
      '">plan mode</span>' +
      '</div>';

    var gateCaption = '<div style="font-size:0.58em;color:var(--accent);font-style:italic;text-align:center;margin-top:3px;max-width:100px;">el supervisor<br>entra acá</div>';

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(pensarLabel, null, pensarStyle);
    // Arrow fragment + gate + arrow fragment
    html += arrowSvg({ width: 28, height: 24, lit: false });
    html += '<div style="display:flex;flex-direction:column;align-items:center;">';
    html += gateHtml;
    html += gateCaption;
    html += '</div>';
    html += arrowSvg({ width: 28, height: 24, lit: false });
    html += nodeHtml(actuarLabel, null, actuarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: false });
    html += nodeHtml(observarLabel, null, observarStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:420px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 420, arcHeight: 36, lit: false });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += exitChipsHtml(false);
    html += '</div>';
    container.innerHTML = html;
  }

  function renderGate(container, opts) {
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    var pensarStyle  = nodeStyle();
    var actuarStyle  = litNodeStyle();
    var observarStyle = nodeStyle();

    // Gate shield on arrow ACTUAR→env (between ACTUAR and OBSERVAR)
    var shieldHtml = '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;">';
    shieldHtml += arrowSvg({ width: 20, height: 22, lit: false });
    shieldHtml += '<div style="' +
      'font-family:var(--font-mono);font-size:0.55em;font-weight:700;color:var(--accent);' +
      'background:var(--bg-code);border:2px solid var(--accent);border-radius:4px;' +
      'padding:2px 7px;white-space:nowrap;' +
      '">permiso</div>';
    shieldHtml += arrowSvg({ width: 20, height: 22, lit: true });
    shieldHtml += '</div>';

    // Permission type chips
    var permChips = '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin-left:10px;">' +
      '<span style="font-family:var(--font-mono);font-size:0.58em;padding:2px 8px;border-radius:10px;background:var(--bg-code);border:1px solid var(--text-muted);color:var(--text-muted);opacity:0.45;">leer = sin gate</span>' +
      '<span style="font-family:var(--font-mono);font-size:0.58em;padding:2px 8px;border-radius:10px;background:var(--bg-code);border:1px solid var(--accent);color:var(--accent);">escribir = gate</span>' +
      '</div>';

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(pensarLabel, null, pensarStyle);
    html += arrowSvg({ width: 40, height: 24, lit: false });
    html += nodeHtml(actuarLabel, null, actuarStyle);
    html += shieldHtml;
    html += nodeHtml(observarLabel, null, observarStyle);
    html += permChips;
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: false });
    html += '<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:0.6em;color:var(--text-muted);font-family:var(--font-mono);">repetir</span>';
    html += '</div>';
    html += exitChipsHtml(false);
    html += caption('gate antes de cada acción que actúa sobre el mundo');
    html += '</div>';
    container.innerHTML = html;
  }

  // ─── DISPATCH ────────────────────────────────────────────────────────────────

  var modeMap = {
    'intro':     renderIntro,
    'tool':      renderTool,
    'fill':      renderFill,
    'infinite':  renderInfinite,
    'drift':     renderDrift,
    'cc':        renderCC,
    'subagent':  renderSubagent,
    'planmode':  renderPlanmode,
    'gate':      renderGate,
  };

  // ─── PUBLIC API ───────────────────────────────────────────────────────────────

  function initFourLoop(opts) {
    if (!opts || !opts.containerId) return;

    var container = document.getElementById(opts.containerId);
    if (!container) return;

    var mode = opts.mode || 'intro';

    // Inject shared CSS once
    if (typeof document !== 'undefined') {
      injectStyles();
    }

    function render() {
      var renderer = modeMap[mode] || renderIntro;
      renderer(container, opts);
    }

    // Initial render
    render();

    // Register Reveal.js slide-change listener once per instance
    if (typeof Reveal !== 'undefined') {
      Reveal.on('slidechanged', function () {
        if (isContainerVisible(container)) {
          render();
        }
      });
    }

    // Track instance (scoped — no globals leaked beyond this array)
    allInstances.push({ containerId: opts.containerId, render: render });
  }

  return initFourLoop;
}));
