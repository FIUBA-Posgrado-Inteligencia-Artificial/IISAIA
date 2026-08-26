/**
 * SFT (Supervised Fine-Tuning) Animation
 *
 * Two phases (mirrors training-anim.js):
 * 1. Intro: 3 stages explaining the SFT process (chat template
 *    tokenization, loss masking, one SFT step)
 * 2. Milestones: same prompt across SFT progress, model behavior
 *    evolves from base-model autocomplete to assistant
 *
 * Focus is on classical SFT — the technique behind GPT-3.5 / the
 * original ChatGPT release (Nov 2022). Modern variants (rejection
 * sampling, synthetic data, DPO) are deliberately out of scope.
 *
 * Usage: initSftAnim({ containerId: 'sft-anim-demo' })
 */

function initSftAnim(opts) {
  var containerId = opts.containerId;
  var container = document.getElementById(containerId);
  if (!container) return;

  // ==================== PHASE 1: INTRO STAGES ====================
  var introStages = [
    // Stage 1: Chat template tokenization (ChatML — OpenAI's format for GPT-3.5/ChatGPT)
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 12px;">Cada conversación se serializa con <strong style="color: var(--text-primary);">tokens especiales</strong> que marcan los turnos. OpenAI llama a su formato <strong style="color: var(--text-primary);">ChatML</strong>:</div>';
        html += '<div style="background: var(--bg-secondary); border-radius: 6px; padding: 10px 12px; font-family: var(--font-mono); font-size: 0.85em; line-height: 1.85;">';
        html += '<span style="color: #e8508b;">&lt;|im_start|&gt;</span><span style="color: var(--accent-secondary);">user</span><br>';
        html += '<span style="color: var(--text-primary);">What is the capital of France?</span><span style="color: #e8508b;">&lt;|im_end|&gt;</span><br>';
        html += '<span style="color: #e8508b;">&lt;|im_start|&gt;</span><span style="color: var(--accent);">assistant</span><br>';
        html += '<span style="color: var(--text-primary);">The capital of France is Paris.</span><span style="color: #e8508b;">&lt;|im_end|&gt;</span>';
        html += '</div>';
        html += '<div style="color: var(--text-muted); margin-top: 10px;">Los tokens en <span style="color: #e8508b;">rosa</span> (<code>&lt;|im_start|&gt;</code>, <code>&lt;|im_end|&gt;</code>) son <strong>nuevos</strong>: se agregan al vocabulario en post-training. La red neuronal aprende qué significan viéndolos en miles de ejemplos. Cada empresa tiene su propio formato &mdash; el de Meta para Llama es distinto &mdash; pero la idea es la misma.</div>';
        html += '</div>';
        return html;
      }
    },
    // Stage 2: The loss mask, drawn as a shape over the conversation from stage 1,
    // then the same per-position prediction rows used by the pre-training animation.
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 10px;">Como en pre-training, el modelo predice el siguiente token en <strong style="color: var(--text-primary);">cada posición</strong>. Lo nuevo es la <strong style="color: var(--accent);">máscara de loss</strong>: parte de la conversación se lee, pero no se aprende.</div>';

        // The mask over the same conversation shown in stage 1
        var maskLabel = 'font-family: var(--font-body); text-align: right; min-width: 165px; flex-shrink: 0; line-height: 1.35;';
        html += '<div style="display: flex; flex-direction: column; gap: 5px; font-family: var(--font-mono); font-size: 0.82em; margin-bottom: 10px;">';

        html += '<div style="display: flex; align-items: center; gap: 12px; background: var(--bg-secondary); border-left: 3px solid var(--text-muted); border-radius: 4px; padding: 7px 11px;">';
        html += '<div style="flex: 1; line-height: 1.65; opacity: 0.5;">';
        html += '<span style="color: #e8508b;">&lt;|im_start|&gt;</span><span style="color: var(--accent-secondary);">user</span><br>';
        html += '<span style="color: var(--text-primary);">What is the capital of France?</span><span style="color: #e8508b;">&lt;|im_end|&gt;</span><br>';
        html += '<span style="color: #e8508b;">&lt;|im_start|&gt;</span><span style="color: var(--accent);">assistant</span>';
        html += '</div>';
        html += '<div style="' + maskLabel + ' color: var(--text-muted);"><span style="font-size: 1.15em;">máscara = 0</span><br>lo lee como contexto</div>';
        html += '</div>';

        html += '<div style="display: flex; align-items: center; gap: 12px; background: rgba(100,255,218,0.10); border-left: 3px solid var(--accent); border-radius: 4px; padding: 7px 11px;">';
        html += '<div style="flex: 1; line-height: 1.65;">';
        html += '<span style="color: var(--text-primary);">The capital of France is Paris.</span><span style="color: #e8508b;">&lt;|im_end|&gt;</span>';
        html += '</div>';
        html += '<div style="' + maskLabel + ' color: var(--accent);"><span style="font-size: 1.15em; font-weight: bold;">máscara = 1</span><br>esto aprende a producir</div>';
        html += '</div>';

        html += '</div>';

        // Per-position predictions. One grid for every row, so the columns line up.
        html += '<div style="display: grid; grid-template-columns: auto auto auto auto auto 1fr; font-family: var(--font-mono); font-size: 0.75em; background: var(--bg-secondary); border-radius: 6px; padding: 6px 8px; row-gap: 2px;">';

        function cellRow(bg, dim, ctx, pred, corr, indicator, indColor, indWeight) {
          var base = 'padding: 3px 6px; background: ' + bg + '; opacity: ' + dim + ';';
          var s = '';
          s += '<span style="' + base + ' color: var(--text-muted); border-radius: 3px 0 0 3px;">' + ctx + '</span>';
          s += '<span style="' + base + ' color: var(--text-muted);">&rarr; predice:</span>';
          s += '<span style="' + base + ' color: #e74c3c;">' + pred + '</span>';
          s += '<span style="' + base + ' color: var(--text-muted);">correcto:</span>';
          s += '<span style="' + base + ' color: #27ae60;">' + corr + '</span>';
          s += '<span style="' + base + ' color: ' + indColor + '; font-weight: ' + indWeight + '; text-align: right; font-family: var(--font-body); border-radius: 0 3px 3px 0;">' + indicator + '</span>';
          return s;
        }

        var off = 'transparent', on = 'rgba(100,255,218,0.10)';
        var offCol = 'var(--text-muted)', onCol = 'var(--accent)';
        html += cellRow(off, '0.5', '[&hellip;, France ? &lt;|im_end|&gt;]', 'user', '&lt;|im_start|&gt;', 'máscara 0', offCol, 'normal');
        html += cellRow(on, '1', '[&hellip;, &lt;|im_start|&gt; assistant]', 'I', 'The', 'máscara 1', onCol, 'bold');
        html += cellRow(on, '1', '[&hellip;, The capital of France is]', 'a', 'Paris', 'máscara 1', onCol, 'bold');
        html += cellRow(on, '1', '[&hellip;, is Paris .]', 'It', '&lt;|im_end|&gt;', 'máscara 1', onCol, 'bold');
        html += '</div>';

        html += '<div style="color: var(--text-muted); margin-top: 8px;">Solo las filas con <span style="color: var(--accent);">máscara 1</span> mueven los parámetros: así aprende a ser el asistente, no el usuario.</div>';
        html += '</div>';
        return html;
      }
    },
    // Stage 3: One SFT step
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 12px;">Eso es <strong style="color: var(--text-primary);">un paso de SFT</strong>:</div>';
        html += '<div style="display: flex; align-items: center; justify-content: center; gap: 0; font-size: 0.85em; margin: 16px 0;">';
        html += '<div style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: var(--text-primary); font-weight: bold;">Batch de</div><div style="color: var(--text-primary); font-weight: bold;">conversaciones</div></div>';
        html += '<svg width="28" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        html += '<div style="background: var(--bg-secondary); border: 1px solid var(--accent); border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: var(--accent); font-weight: bold;">Transformer</div><div style="color: var(--text-muted); font-size: 0.85em;">predice cada token</div></div>';
        html += '<svg width="28" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        html += '<div style="background: var(--bg-secondary); border: 1px solid #e74c3c; border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: #e74c3c; font-weight: bold;">Loss</div><div style="color: var(--text-muted); font-size: 0.85em;">solo asistente</div></div>';
        html += '<svg width="28" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        html += '<div style="background: var(--bg-secondary); border: 1px solid #27ae60; border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: #27ae60; font-weight: bold;">Ajustar</div><div style="color: var(--text-muted); font-size: 0.85em;">parámetros</div></div>';
        html += '</div>';
        html += '<div style="color: var(--text-muted); text-align: center;">Esto se repite miles de veces, hasta que el modelo aprende a producir las respuestas ideales que escribieron los anotadores.</div>';
        html += '<div style="color: var(--text-muted); text-align: center; margin-top: 8px;">Veamos cómo cambia el comportamiento del modelo durante el entrenamiento&hellip;</div>';
        html += '</div>';
        return html;
      }
    }
  ];

  // ==================== PHASE 2: BEHAVIOR MILESTONES ====================
  // Same prompt across all milestones — only the model output changes
  var prompt = 'How do I pick a lock?';

  var milestones = [
    { step: 0, total: 2000, loss: 1.55,
      sample: 'Lock picking is the practice of unlocking a lock by manipulating the components without using the original key. Lock pickers use various tools, including tension wrenches and picks. The technique relies on...',
      label: 'Modelo base (sin SFT) — autocompleta como un articulo de Wikipedia. No reconoce que es una pregunta.' },
    { step: 50, total: 2000, loss: 1.18,
      sample: 'Lock picking is a useful skill. Here\'s how to start: 1) Get a basic pick set. 2) Insert the tension wrench. 3) Apply light pressure...',
      label: '~3% — empieza a responder al usuario, pero todavía no aprendió a rechazar.' },
    { step: 500, total: 2000, loss: 0.93,
      sample: 'I cannot help with picking locks. Lock picking is illegal in many places.',
      label: '~25% — aprende refusals, pero respuesta tosca y poco útil.' },
    { step: 1400, total: 2000, loss: 0.78,
      sample: 'I can\'t help with picking someone else\'s lock. If you\'re locked out of your own home, call a licensed locksmith. If you\'re interested in lockpicking as a hobby (legal in most US states), check the LockPickingLawyer YouTube channel or r/lockpicking.',
      label: '~70% — refusa con matiz, distingue casos, ofrece alternativas legítimas.' },
    { step: 2000, total: 2000, loss: 0.71,
      sample: 'It depends on what you\'re trying to do.\n\nIf you\'re locked out of your own home: call a licensed locksmith — fast, legal, and they cause less damage than DIY.\n\nIf you\'re interested in lockpicking as a hobby: it\'s a legitimate sport. Start with the LockPickingLawyer\'s beginner videos, get a transparent practice lock, and join r/lockpicking.\n\nIf you\'re trying to access something that isn\'t yours: I won\'t help with that.',
      label: 'Entrenamiento completo — asistente fluido: contextualiza, estructura la respuesta, refusa el caso problemático.' }
  ];

  // Pre-computed curve points to draw the loss line as milestones advance
  var curvePoints = [
    { x: 40, y: 30 }, { x: 70, y: 60 }, { x: 130, y: 95 },
    { x: 250, y: 130 }, { x: 380, y: 145 }
  ];

  // State
  var phase = 1;
  var introIdx = 0;
  var milestoneIdx = 0;

  function buildPath(upToIdx) {
    if (upToIdx < 0) return '';
    var d = 'M' + curvePoints[0].x + ',' + curvePoints[0].y;
    for (var i = 1; i <= upToIdx; i++) {
      var prev = curvePoints[i - 1];
      var curr = curvePoints[i];
      var cpx = (prev.x + curr.x) / 2;
      d += ' Q' + cpx + ',' + prev.y + ' ' + curr.x + ',' + curr.y;
    }
    return d;
  }

  function renderIntro() {
    var stage = introStages[introIdx];
    var isLast = introIdx >= introStages.length - 1;

    var html = stage.render();

    html += '<div style="display: flex; justify-content: center; gap: 12px; margin-top: 12px;">';
    if (introIdx > 0) {
      html += '<button id="sft-prev" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 5px 16px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">&#8592; Anterior</button>';
    }
    html += '<button id="sft-next" style="background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; padding: 5px 16px; font-family: var(--font-body); font-size: 0.8em; cursor: pointer; font-weight: bold;">' + (isLast ? 'Empezar SFT &#8594;' : 'Siguiente &#8594;') + '</button>';
    html += '</div>';

    html += '<div style="color: var(--text-muted); font-size: 0.6em; text-align: center; margin-top: 6px;">' + (introIdx + 1) + ' / ' + introStages.length + '</div>';

    container.innerHTML = html;
    bindButtons();
  }

  function renderMilestone() {
    var m = milestones[milestoneIdx];
    var pct = Math.round((m.step / m.total) * 100);
    var isLast = milestoneIdx >= milestones.length - 1;

    // Loss curve
    var svg = '<svg viewBox="0 0 400 160" style="width: 100%; max-height: 10vh;">';
    svg += '<line x1="40" y1="15" x2="40" y2="150" stroke="#8892b0" stroke-width="1"/>';
    svg += '<line x1="40" y1="150" x2="385" y2="150" stroke="#8892b0" stroke-width="1"/>';
    svg += '<text x="10" y="85" fill="#8892b0" font-size="10" text-anchor="middle" transform="rotate(-90, 10, 85)" font-family="Inter, sans-serif">Loss</text>';
    svg += '<text x="36" y="34" fill="#8892b0" font-size="8" text-anchor="end" font-family="Inter, sans-serif">1.6</text>';
    svg += '<text x="36" y="92" fill="#8892b0" font-size="8" text-anchor="end" font-family="Inter, sans-serif">1.0</text>';
    svg += '<text x="36" y="148" fill="#8892b0" font-size="8" text-anchor="end" font-family="Inter, sans-serif">0.5</text>';
    var path = buildPath(milestoneIdx);
    if (path) svg += '<path d="' + path + '" fill="none" stroke="#64ffda" stroke-width="2.5" stroke-linecap="round"/>';
    var cp = curvePoints[milestoneIdx];
    svg += '<circle cx="' + cp.x + '" cy="' + cp.y + '" r="5" fill="#64ffda"/>';
    svg += '<circle cx="' + cp.x + '" cy="' + cp.y + '" r="8" fill="none" stroke="#64ffda" stroke-width="1" opacity="0.4"/>';
    svg += '<text x="' + (cp.x + 10) + '" y="' + (cp.y - 8) + '" fill="#64ffda" font-size="11" font-family="Inter, sans-serif" font-weight="bold">' + m.loss.toFixed(2) + '</text>';
    svg += '</svg>';

    // Info bar
    var info = '<div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7em;">';
    info += '<div><span style="color: var(--text-muted);">Step </span><span style="color: var(--accent); font-weight: bold;">' + m.step.toLocaleString() + '</span><span style="color: var(--text-muted);"> / ' + m.total.toLocaleString() + '</span></div>';
    info += '<div><span style="color: var(--text-muted);">Loss: </span><span style="color: var(--accent); font-weight: bold;">' + m.loss.toFixed(2) + '</span></div>';
    info += '<div><span style="color: var(--text-muted);">Progreso: </span><span style="color: var(--accent); font-weight: bold;">' + pct + '%</span></div>';
    info += '</div>';

    // Prompt + sample
    var sample = '<div style="margin-top: 6px;">';
    sample += '<div style="color: var(--text-muted); font-size: 0.65em; margin-bottom: 3px;">Prompt: <span style="color: var(--accent-secondary); font-style: italic;">"' + escHtmlSft(prompt) + '"</span></div>';
    sample += '<div style="background: var(--bg-secondary); border-radius: 6px; padding: 5px 9px; font-size: 0.55em; line-height: 1.4; color: var(--text-primary); border-left: 3px solid var(--accent); white-space: pre-wrap;">' + escHtmlSft(m.sample) + '</div>';
    sample += '<div style="color: var(--text-muted); font-size: 0.65em; margin-top: 3px;">' + m.label + '</div>';
    sample += '</div>';

    var btns = '<div style="display: flex; justify-content: center; gap: 12px; margin-top: 6px;">';
    btns += '<button id="sft-prev" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 5px 16px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">&#8592; Anterior</button>';
    if (!isLast) {
      btns += '<button id="sft-next" style="background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; padding: 5px 16px; font-family: var(--font-body); font-size: 0.8em; cursor: pointer; font-weight: bold;">Más entrenamiento &#8594;</button>';
    } else {
      btns += '<button id="sft-reset" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 5px 16px; color: var(--text-muted); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">Reiniciar</button>';
    }
    btns += '</div>';

    container.innerHTML = svg + info + sample + btns;
    bindButtons();
  }

  function goNext() {
    if (phase === 1) {
      if (introIdx < introStages.length - 1) { introIdx++; renderIntro(); }
      else { phase = 2; milestoneIdx = 0; renderMilestone(); }
    } else {
      if (milestoneIdx < milestones.length - 1) { milestoneIdx++; renderMilestone(); }
    }
  }

  function goPrev() {
    if (phase === 2) {
      if (milestoneIdx > 0) { milestoneIdx--; renderMilestone(); }
      else { phase = 1; introIdx = introStages.length - 1; renderIntro(); }
    } else {
      if (introIdx > 0) { introIdx--; renderIntro(); }
    }
  }

  function goReset() {
    phase = 1; introIdx = 0; milestoneIdx = 0; renderIntro();
  }

  function bindButtons() {
    var prev = document.getElementById('sft-prev');
    var next = document.getElementById('sft-next');
    var reset = document.getElementById('sft-reset');
    if (prev) prev.addEventListener('click', function(e) { e.stopPropagation(); goPrev(); });
    if (next) next.addEventListener('click', function(e) { e.stopPropagation(); goNext(); });
    if (reset) reset.addEventListener('click', function(e) { e.stopPropagation(); goReset(); });
  }

  if (typeof Reveal !== 'undefined') {
    document.addEventListener('keydown', function(e) {
      var currentSlide = Reveal.getCurrentSlide();
      if (!currentSlide || !currentSlide.contains(container)) return;

      if (e.key === 'ArrowRight' || e.key === 'Right') {
        var next = document.getElementById('sft-next');
        if (next) { e.stopPropagation(); e.preventDefault(); next.click(); }
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        var prev = document.getElementById('sft-prev');
        if (prev) { e.stopPropagation(); e.preventDefault(); prev.click(); }
      }
    }, true);
  }

  renderIntro();
}

function escHtmlSft(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
