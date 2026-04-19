/**
 * Training Animation
 *
 * Two phases:
 * 1. Intro: shows how training data is prepared (FineWeb → concat → windows → predictions)
 * 2. Training: loss curve descending with sample text improving at milestones
 *
 * Usage: initTrainingAnim({ containerId: 'training-demo' })
 */

function initTrainingAnim(opts) {
  var containerId = opts.containerId;
  var container = document.getElementById(containerId);
  if (!container) return;

  // ==================== PHASE 1: INTRO STAGES ====================
  var introStages = [
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 12px;">Los registros de FineWeb se concatenan en una secuencia gigante, separados por un token especial:</div>';
        html += '<div style="background: var(--bg-secondary); border-radius: 6px; padding: 10px 12px; font-family: var(--font-mono); font-size: 0.85em; line-height: 2;">';
        html += '<span style="color: var(--text-primary);">Los oceanos absorben el 30% del CO2...</span> ';
        html += '<span style="color: #e8508b; font-weight: bold;">&lt;END&gt;</span> ';
        html += '<span style="color: var(--text-primary);">A large language model is a type of...</span> ';
        html += '<span style="color: #e8508b; font-weight: bold;">&lt;END&gt;</span> ';
        html += '<span style="color: var(--text-primary);">El gato se sento en el tejado...</span> ';
        html += '<span style="color: #e8508b; font-weight: bold;">&lt;END&gt;</span> ';
        html += '<span style="color: var(--text-muted);">...</span>';
        html += '</div>';
        html += '<div style="color: var(--text-muted); margin-top: 8px;">Millones de documentos → una unica secuencia de tokens</div>';
        html += '</div>';
        return html;
      }
    },
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 12px;">De esa secuencia se cortan <strong style="color: var(--text-primary);">ventanas</strong> de largo fijo (ej. 1024 tokens):</div>';
        html += '<div style="background: var(--bg-secondary); border-radius: 6px; padding: 10px 12px; font-family: var(--font-mono); font-size: 0.8em; line-height: 1.8; position: relative;">';
        html += '<span style="color: var(--text-muted);">...</span> ';
        html += '<span style="color: var(--text-primary);">Los oceanos absorben el 30% del CO2...</span> ';
        html += '<span style="color: #e8508b; font-weight: bold;">&lt;END&gt;</span> ';
        html += '<span style="color: var(--text-primary);">A large language model is a type of...</span> ';
        html += '<span style="color: var(--text-muted);">...</span>';
        html += '</div>';
        html += '<div style="display: flex; gap: 8px; margin-top: 10px;">';
        html += '<div style="flex: 1; border: 2px solid var(--accent); border-radius: 6px; padding: 6px 10px; font-family: var(--font-mono); font-size: 0.75em; color: var(--text-primary);">ventana 1: <span style="color: var(--text-muted);">Los oceanos absorben el...</span></div>';
        html += '<div style="flex: 1; border: 2px solid #f67019; border-radius: 6px; padding: 6px 10px; font-family: var(--font-mono); font-size: 0.75em; color: var(--text-primary);">ventana 2: <span style="color: var(--text-muted);">...CO2 &lt;END&gt; A large...</span></div>';
        html += '<div style="flex: 1; border: 2px solid #acc236; border-radius: 6px; padding: 6px 10px; font-family: var(--font-mono); font-size: 0.75em; color: var(--text-primary);">ventana 3: <span style="color: var(--text-muted);">...model is a type of...</span></div>';
        html += '</div>';
        html += '<div style="color: var(--text-muted); margin-top: 8px;">Las ventanas pueden cruzar documentos — <span style="color: #e8508b; font-weight: bold;">&lt;END&gt;</span> le indica al modelo que empieza un tema nuevo</div>';
        html += '</div>';
        return html;
      }
    },
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 12px;">Dentro de cada ventana, el modelo predice el siguiente token en <strong style="color: var(--text-primary);">cada posicion</strong> simultaneamente:</div>';
        html += '<div style="background: var(--bg-secondary); border-radius: 6px; padding: 10px 12px; font-family: var(--font-mono); font-size: 0.85em; line-height: 1.8;">';
        html += '<div style="display: flex; align-items: center; gap: 6px;"><span style="color: var(--text-muted); min-width: 180px;">[el]</span> <span style="color: var(--text-muted);">→ predice:</span> <span style="color: #e74c3c;">mN&x</span> <span style="color: var(--text-muted);">correcto:</span> <span style="color: #27ae60;">gato</span></div>';
        html += '<div style="display: flex; align-items: center; gap: 6px;"><span style="color: var(--text-muted); min-width: 180px;">[el, gato]</span> <span style="color: var(--text-muted);">→ predice:</span> <span style="color: #e74c3c;">the</span> <span style="color: var(--text-muted);">correcto:</span> <span style="color: #27ae60;">se</span></div>';
        html += '<div style="display: flex; align-items: center; gap: 6px;"><span style="color: var(--text-muted); min-width: 180px;">[el, gato, se]</span> <span style="color: var(--text-muted);">→ predice:</span> <span style="color: #e74c3c;">fue</span> <span style="color: var(--text-muted);">correcto:</span> <span style="color: #27ae60;">sento</span></div>';
        html += '<div style="display: flex; align-items: center; gap: 6px;"><span style="color: var(--text-muted); min-width: 180px;">[el, gato, se, sento]</span> <span style="color: var(--text-muted);">→ predice:</span> <span style="color: #e74c3c;">un</span> <span style="color: var(--text-muted);">correcto:</span> <span style="color: #27ae60;">en</span></div>';
        html += '<div style="color: var(--text-muted);">... × 1024 posiciones por ventana</div>';
        html += '</div>';
        html += '<div style="color: var(--text-muted); margin-top: 8px;">Al inicio todo sale mal (parametros aleatorios). El error se calcula comparando cada prediccion con la respuesta correcta.</div>';
        html += '</div>';
        return html;
      }
    },
    {
      render: function() {
        var html = '<div style="font-size: 0.7em;">';
        html += '<div style="color: var(--text-muted); margin-bottom: 12px;">Eso es <strong style="color: var(--text-primary);">un paso de entrenamiento</strong>:</div>';
        html += '<div style="display: flex; align-items: center; justify-content: center; gap: 0; font-size: 0.85em; margin: 16px 0;">';
        html += '<div style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: var(--text-primary); font-weight: bold;">~1000 ventanas</div><div style="color: var(--text-muted); font-size: 0.8em;">en paralelo</div></div>';
        html += '<svg width="28" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        html += '<div style="background: var(--bg-secondary); border: 1px solid var(--accent); border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: var(--accent); font-weight: bold;">Transformer</div><div style="color: var(--text-muted); font-size: 0.8em;">predice en cada posicion</div></div>';
        html += '<svg width="28" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        html += '<div style="background: var(--bg-secondary); border: 1px solid #e74c3c; border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: #e74c3c; font-weight: bold;">Loss</div><div style="color: var(--text-muted); font-size: 0.8em;">error promedio</div></div>';
        html += '<svg width="28" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
        html += '<div style="background: var(--bg-secondary); border: 1px solid #27ae60; border-radius: 8px; padding: 8px 12px; text-align: center;"><div style="color: #27ae60; font-weight: bold;">Ajustar</div><div style="color: var(--text-muted); font-size: 0.8em;">parametros</div></div>';
        html += '</div>';
        html += '<div style="color: var(--text-muted); text-align: center;">~1000 ventanas × 1024 posiciones = <strong style="color: var(--accent);">~1M predicciones</strong> por paso</div>';
        html += '<div style="color: var(--text-muted); text-align: center; margin-top: 8px;">Esto se repite <strong style="color: var(--text-primary);">32,000 veces</strong> (GPT-2). Veamos que pasa...</div>';
        html += '</div>';
        return html;
      }
    }
  ];

  // ==================== PHASE 2: LOSS MILESTONES ====================
  var milestones = [
    { step: 0, total: 32000, loss: 10.5,
      sample: 'Fsjk2 mN&x qpLw ñ3z Rt7 uVb cD9 kH4 yJ6 aE1 sW8 dF0 gT5',
      label: 'Parametros aleatorios — tokens sin sentido' },
    { step: 100, total: 32000, loss: 7.2,
      sample: 'the of and to in is for that it was on are as with be at',
      label: 'Aprende las palabras mas frecuentes del ingles' },
    { step: 420, total: 32000, loss: 5.8,
      sample: 'since she is mine it\'s a part of the information should discuss my father great companions Gordon showed me sitting over at',
      label: '~1% del entrenamiento — coherencia local pero sin sentido global' },
    { step: 4000, total: 32000, loss: 4.1,
      sample: 'The researchers found that the temperature of the ocean surface had increased by approximately 0.3 degrees over the past decade, which is consistent',
      label: '~12% — oraciones coherentes, estructura de articulo' },
    { step: 32000, total: 32000, loss: 3.1,
      sample: 'The research team at Stanford University published their findings in Nature, demonstrating that the new catalyst reduces carbon emissions by 47% compared to conventional methods. The study, which took three years to complete, involved researchers from 12 countries.',
      label: 'Entrenamiento completo — texto largo, coherente y factualmente plausible' }
  ];

  var curvePoints = [
    { x: 40, y: 25 }, { x: 62, y: 60 }, { x: 85, y: 82 },
    { x: 140, y: 115 }, { x: 380, y: 155 }
  ];

  // State
  var phase = 1; // 1 = intro, 2 = training
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

    // Buttons
    html += '<div style="display: flex; justify-content: center; gap: 12px; margin-top: 12px;">';
    if (introIdx > 0) {
      html += '<button id="train-prev" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 5px 16px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">&#8592; Anterior</button>';
    }
    html += '<button id="train-next" style="background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; padding: 5px 16px; font-family: var(--font-body); font-size: 0.8em; cursor: pointer; font-weight: bold;">' + (isLast ? 'Empezar entrenamiento &#8594;' : 'Siguiente &#8594;') + '</button>';
    html += '</div>';

    // Step indicator
    html += '<div style="color: var(--text-muted); font-size: 0.6em; text-align: center; margin-top: 6px;">' + (introIdx + 1) + ' / ' + introStages.length + '</div>';

    container.innerHTML = html;
    bindButtons();
  }

  function renderMilestone() {
    var m = milestones[milestoneIdx];
    var pct = Math.round((m.step / m.total) * 100);
    var isLast = milestoneIdx >= milestones.length - 1;

    // Loss curve SVG
    var svg = '<svg viewBox="0 0 400 170" style="width: 100%; max-height: 20vh;">';
    svg += '<line x1="40" y1="15" x2="40" y2="160" stroke="#8892b0" stroke-width="1"/>';
    svg += '<line x1="40" y1="160" x2="385" y2="160" stroke="#8892b0" stroke-width="1"/>';
    svg += '<text x="10" y="90" fill="#8892b0" font-size="10" text-anchor="middle" transform="rotate(-90, 10, 90)" font-family="Inter, sans-serif">Loss</text>';
    // X axis label omitted — info bar below shows step count
    svg += '<text x="36" y="28" fill="#8892b0" font-size="8" text-anchor="end" font-family="Inter, sans-serif">10</text>';
    svg += '<text x="36" y="90" fill="#8892b0" font-size="8" text-anchor="end" font-family="Inter, sans-serif">5</text>';
    svg += '<text x="36" y="158" fill="#8892b0" font-size="8" text-anchor="end" font-family="Inter, sans-serif">0</text>';
    var path = buildPath(milestoneIdx);
    if (path) svg += '<path d="' + path + '" fill="none" stroke="#64ffda" stroke-width="2.5" stroke-linecap="round"/>';
    var cp = curvePoints[milestoneIdx];
    svg += '<circle cx="' + cp.x + '" cy="' + cp.y + '" r="5" fill="#64ffda"/>';
    svg += '<circle cx="' + cp.x + '" cy="' + cp.y + '" r="8" fill="none" stroke="#64ffda" stroke-width="1" opacity="0.4"/>';
    svg += '<text x="' + (cp.x + 10) + '" y="' + (cp.y - 8) + '" fill="#64ffda" font-size="11" font-family="Inter, sans-serif" font-weight="bold">' + m.loss.toFixed(1) + '</text>';
    svg += '</svg>';

    // Info bar
    var info = '<div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8em;">';
    info += '<div><span style="color: var(--text-muted);">Step </span><span style="color: var(--accent); font-weight: bold;">' + m.step.toLocaleString() + '</span><span style="color: var(--text-muted);"> / ' + m.total.toLocaleString() + '</span></div>';
    info += '<div><span style="color: var(--text-muted);">Loss: </span><span style="color: var(--accent); font-weight: bold;">' + m.loss.toFixed(1) + '</span></div>';
    info += '<div><span style="color: var(--text-muted);">Progreso: </span><span style="color: var(--accent); font-weight: bold;">' + pct + '%</span></div>';
    info += '</div>';

    // Sample text
    var sample = '<div style="margin-top: 8px;">';
    sample += '<div style="color: var(--text-muted); font-size: 0.7em; margin-bottom: 4px;">Dado un prefijo aleatorio del dataset, el modelo lo continua asi:</div>';
    sample += '<div style="background: var(--bg-secondary); border-radius: 6px; padding: 8px 12px; font-size: 0.8em; line-height: 1.6; color: var(--text-primary); border-left: 3px solid var(--accent);">' + escHtmlTr(m.sample) + '</div>';
    sample += '<div style="color: var(--text-muted); font-size: 0.7em; margin-top: 4px;">' + m.label + '</div>';
    sample += '</div>';

    // Buttons
    var btns = '<div style="display: flex; justify-content: center; gap: 12px; margin-top: 8px;">';
    btns += '<button id="train-prev" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 5px 16px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">&#8592; Anterior</button>';
    if (!isLast) {
      btns += '<button id="train-next" style="background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; padding: 5px 16px; font-family: var(--font-body); font-size: 0.8em; cursor: pointer; font-weight: bold;">Mas entrenamiento &#8594;</button>';
    } else {
      btns += '<button id="train-reset" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 5px 16px; color: var(--text-muted); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">Reiniciar</button>';
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
    var prev = document.getElementById('train-prev');
    var next = document.getElementById('train-next');
    var reset = document.getElementById('train-reset');
    if (prev) prev.addEventListener('click', function(e) { e.stopPropagation(); goPrev(); });
    if (next) next.addEventListener('click', function(e) { e.stopPropagation(); goNext(); });
    if (reset) reset.addEventListener('click', function(e) { e.stopPropagation(); goReset(); });
  }

  // Keyboard navigation
  if (typeof Reveal !== 'undefined') {
    document.addEventListener('keydown', function(e) {
      var currentSlide = Reveal.getCurrentSlide();
      if (!currentSlide || !currentSlide.contains(container)) return;

      if (e.key === 'ArrowRight' || e.key === 'Right') {
        var next = document.getElementById('train-next');
        if (next) { e.stopPropagation(); e.preventDefault(); next.click(); }
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        var prev = document.getElementById('train-prev');
        if (prev) { e.stopPropagation(); e.preventDefault(); prev.click(); }
      }
    }, true);
  }

  renderIntro();
}

function escHtmlTr(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
