/**
 * four-loop-anim.js
 * Bespoke animation for the PENSAR → ACTUAR → OBSERVAR loop.
 * No external deps. Vanilla JS. No build step.
 * Animation contract: exports initFourLoop(opts), manipulates DOM directly,
 * listens to Reveal.js lifecycle for re-render on slide change.
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    var api = factory();
    root.initFourLoop = api.init;       // backward-compat alias
    root.updateFourLoop = api.update;   // new API
    root.fourLoopAnim = api;             // namespace
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
    html += '</div>';
    html += exitChipsHtml(false);
    html += '</div>';

    // Right: context window bar
    html += '<div style="display:flex;flex-direction:column;align-items:center;margin-top:4px;">';
    html += '<div style="font-size:0.6em;color:var(--text-muted);margin-bottom:6px;letter-spacing:0.04em;">ventana de contexto</div>';
    // Outer bar
    html += '<div style="width:36px;height:130px;border:2px solid var(--text-muted);border-radius:6px;background:var(--bg-code);position:relative;overflow:hidden;">';
    // fillPercent: 0-100. Default 60 (matches original 76/126 ≈ 60%).
    var fillPercent = typeof opts.fillPercent === 'number' ? opts.fillPercent : 60;
    // Inner area is ~126px; clamp percent and convert.
    if (fillPercent < 0) fillPercent = 0;
    if (fillPercent > 100) fillPercent = 100;
    var fillHeight = Math.round(126 * (fillPercent / 100));
    // chipCount scales with fill: 40 chips at 100%, 24 at 60% (matches original).
    var chipCount = Math.round(40 * (fillPercent / 100));
    html += '<div style="position:absolute;bottom:0;left:0;right:0;height:' + fillHeight + 'px;display:flex;flex-direction:column-reverse;flex-wrap:wrap;align-content:flex-start;gap:2px;padding:2px;transition:height 600ms ease;">';
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
    html += '</div>';
    html += exitChipsHtml(false);
    html += caption('arrancó en A, terminó en otra');
    html += '</div>';
    container.innerHTML = html;
  }

  function renderHallucinate(container, opts) {
    var labels = opts.labels || {};
    var pensarLabel  = labels.pensar  || 'PENSAR';
    var actuarLabel  = labels.actuar  || 'ACTUAR';
    var observarLabel = labels.observar || 'OBSERVAR';

    var dimStyle = nodeStyle('opacity:0.45;color:var(--text-muted)');
    var errorStyle = litNodeStyle('#ff6b6b');

    var html = '<div style="display:flex;flex-direction:column;align-items:center;padding:10px 0;">';
    html += '<div style="display:flex;align-items:center;gap:6px;">';
    html += nodeHtml(pensarLabel, null, dimStyle);
    html += arrowSvg({ width: 40, height: 24, lit: false });
    html += nodeHtml(actuarLabel, '(tool inventada)', errorStyle);
    html += arrowSvg({ width: 40, height: 24, lit: true });
    html += nodeHtml(observarLabel, '(resultado falso)', errorStyle);
    html += '</div>';
    html += '<div style="margin-top:2px;position:relative;width:366px;">';
    html += arrowSvg({ returnArc: true, arcWidth: 366, arcHeight: 36, lit: false });
    html += '</div>';
    html += exitChipsHtml(false);
    html += caption('actúa sobre una premisa falsa');
    html += '</div>';
    container.innerHTML = html;
  }

  function renderPoison(container, opts) {
    var b = buildBaseRow(opts);

    var html = '<div style="display:flex;align-items:flex-start;gap:20px;padding:10px 0;justify-content:center;">';

    // Left: cycle (dim slightly to emphasize the rot is in the context, not the loop itself)
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
    html += '</div>';
    html += exitChipsHtml(false);
    html += '</div>';

    // Right: context bar with RED noise chips mixed in
    html += '<div style="display:flex;flex-direction:column;align-items:center;margin-top:4px;">';
    html += '<div style="font-size:0.6em;color:var(--text-muted);margin-bottom:6px;letter-spacing:0.04em;">ventana de contexto</div>';
    html += '<div style="width:36px;height:130px;border:2px solid var(--text-muted);border-radius:6px;background:var(--bg-code);position:relative;overflow:hidden;">';
    html += '<div style="position:absolute;bottom:0;left:0;right:0;height:108px;display:flex;flex-direction:column-reverse;flex-wrap:wrap;align-content:flex-start;gap:2px;padding:2px;">';
    var chipCount = 36;
    for (var i = 0; i < chipCount; i++) {
      var isNoise = (i % 3 === 0);
      var color = isNoise ? '#ff6b6b' : 'var(--accent-secondary)';
      var opacity = isNoise ? '0.85' : '0.55';
      html += '<div style="width:10px;height:10px;border-radius:2px;background:' + color + ';opacity:' + opacity + ';"></div>';
    }
    html += '</div>';
    html += '</div>';
    html += '<div style="font-size:0.55em;color:#ff6b6b;margin-top:5px;text-align:center;max-width:80px;font-weight:700;">el agente alimenta su propio rot</div>';
    html += '</div>';

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
    'hallucinate': renderHallucinate,
    'poison':    renderPoison,
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

    // Inject shared CSS once
    if (typeof document !== 'undefined') {
      injectStyles();
    }

    // Create instance up front so render() can read live state from it.
    var inst = {
      containerId: opts.containerId,
      opts: opts,           // keep original opts so update can merge over them
      render: null
    };

    function render() {
      var currentOpts = inst.opts;
      var renderer = modeMap[currentOpts.mode] || renderIntro;
      renderer(container, currentOpts);
    }
    inst.render = render;

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
    allInstances.push(inst);
  }

  function updateFourLoop(updateOpts) {
    if (!updateOpts || !updateOpts.containerId) return;
    var inst = null;
    for (var i = 0; i < allInstances.length; i++) {
      if (allInstances[i].containerId === updateOpts.containerId) {
        inst = allInstances[i];
        break;
      }
    }
    if (!inst) return;
    var container = document.getElementById(updateOpts.containerId);
    if (!container) return;

    // Merge update opts over original opts (phase/mode/fillPercent override)
    var merged = {};
    for (var k in inst.opts) merged[k] = inst.opts[k];
    if (updateOpts.phase !== undefined) merged.phase = updateOpts.phase;
    if (updateOpts.mode !== undefined) merged.mode = updateOpts.mode;
    if (updateOpts.fillPercent !== undefined) merged.fillPercent = updateOpts.fillPercent;

    var renderer = modeMap[merged.mode] || renderIntro;
    renderer(container, merged);

    // Update stored opts so subsequent updates merge over the new state
    inst.opts = merged;
  }

  return { init: initFourLoop, update: updateFourLoop };
}));
