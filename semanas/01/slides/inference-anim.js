/**
 * Inference Animation
 *
 * Interactive demo showing token-by-token text generation.
 * Demonstrates: next-token prediction, probability distributions, stochastic sampling.
 *
 * Usage: initInferenceAnim({ containerId: 'inference-demo' })
 */

function initInferenceAnim(opts) {
  var containerId = opts.containerId;
  var container = document.getElementById(containerId);
  if (!container) return;

  var palette = ['#4dc9f6','#f67019','#acc236','#e8508b','#9b59b6','#27ae60','#e67e22','#2980b9'];

  // Two pre-scripted runs to demonstrate stochasticity
  var runs = [
    {
      label: 'Generacion 1',
      steps: [
        { context: ['El'], candidates: [
          { token: ' gato', prob: 0.18 },
          { token: ' modelo', prob: 0.14 },
          { token: ' sistema', prob: 0.09 },
          { token: ' problema', prob: 0.07 },
          { token: ' mundo', prob: 0.06 }
        ], pick: 0 },
        { context: ['El', ' gato'], candidates: [
          { token: ' se', prob: 0.24 },
          { token: ' negro', prob: 0.13 },
          { token: ' duerme', prob: 0.11 },
          { token: ' es', prob: 0.09 },
          { token: ' no', prob: 0.06 }
        ], pick: 0 },
        { context: ['El', ' gato', ' se'], candidates: [
          { token: ' sent', prob: 0.21 },
          { token: ' subi', prob: 0.14 },
          { token: ' durmi', prob: 0.11 },
          { token: ' escondi', prob: 0.08 },
          { token: ' qued', prob: 0.07 }
        ], pick: 0 },
        { context: ['El', ' gato', ' se', ' sent'], candidates: [
          { token: 'o', prob: 0.45 },
          { token: 'aba', prob: 0.25 },
          { token: 'aron', prob: 0.05 },
          { token: 'ir', prob: 0.04 },
          { token: 'imos', prob: 0.02 }
        ], pick: 0 },
        { context: ['El', ' gato', ' se', ' sent', 'o'], candidates: [
          { token: ' en', prob: 0.32 },
          { token: ' sobre', prob: 0.18 },
          { token: ' junto', prob: 0.08 },
          { token: ' cerca', prob: 0.06 },
          { token: ' al', prob: 0.05 }
        ], pick: 0 },
        { context: ['El', ' gato', ' se', ' sent', 'o', ' en'], candidates: [
          { token: ' el', prob: 0.30 },
          { token: ' la', prob: 0.22 },
          { token: ' una', prob: 0.10 },
          { token: ' mi', prob: 0.05 },
          { token: ' su', prob: 0.04 }
        ], pick: 0 },
        { context: ['El', ' gato', ' se', ' sent', 'o', ' en', ' el'], candidates: [
          { token: ' tejado', prob: 0.14 },
          { token: ' sofa', prob: 0.12 },
          { token: ' jardin', prob: 0.10 },
          { token: ' piso', prob: 0.08 },
          { token: ' suelo', prob: 0.07 }
        ], pick: 0 },
        { context: ['El', ' gato', ' se', ' sent', 'o', ' en', ' el', ' tejado'], candidates: [
          { token: '.', prob: 0.38 },
          { token: ' y', prob: 0.15 },
          { token: ' del', prob: 0.08 },
          { token: ' de', prob: 0.07 },
          { token: ',', prob: 0.06 }
        ], pick: 0 }
      ]
    },
    {
      label: 'Generacion 2 (mismo prefijo, distinto resultado)',
      steps: [
        { context: ['El'], candidates: [
          { token: ' gato', prob: 0.18 },
          { token: ' modelo', prob: 0.14 },
          { token: ' sistema', prob: 0.09 },
          { token: ' problema', prob: 0.07 },
          { token: ' mundo', prob: 0.06 }
        ], pick: 0 },
        { context: ['El', ' gato'], candidates: [
          { token: ' se', prob: 0.24 },
          { token: ' negro', prob: 0.13 },
          { token: ' duerme', prob: 0.11 },
          { token: ' es', prob: 0.09 },
          { token: ' no', prob: 0.06 }
        ], pick: 2 },
        { context: ['El', ' gato', ' duerme'], candidates: [
          { token: ' todo', prob: 0.22 },
          { token: ' en', prob: 0.16 },
          { token: ' mucho', prob: 0.10 },
          { token: ' sobre', prob: 0.08 },
          { token: ' durante', prob: 0.06 }
        ], pick: 0 },
        { context: ['El', ' gato', ' duerme', ' todo'], candidates: [
          { token: ' el', prob: 0.55 },
          { token: ' un', prob: 0.08 },
          { token: 's', prob: 0.06 },
          { token: ' lo', prob: 0.04 },
          { token: ' cada', prob: 0.03 }
        ], pick: 0 },
        { context: ['El', ' gato', ' duerme', ' todo', ' el'], candidates: [
          { token: ' dia', prob: 0.42 },
          { token: ' tiempo', prob: 0.15 },
          { token: ' rato', prob: 0.08 },
          { token: ' invierno', prob: 0.04 },
          { token: ' verano', prob: 0.03 }
        ], pick: 0 },
        { context: ['El', ' gato', ' duerme', ' todo', ' el', ' dia'], candidates: [
          { token: '.', prob: 0.40 },
          { token: ' y', prob: 0.12 },
          { token: ',', prob: 0.10 },
          { token: ' en', prob: 0.05 },
          { token: ' sin', prob: 0.04 }
        ], pick: 0 }
      ]
    }
  ];

  var currentRun = 0;
  var currentStep = 0;
  var sampled = false;

  function render() {
    var run = runs[currentRun];
    var step = run.steps[currentStep];
    var isLastStep = currentStep >= run.steps.length - 1 && sampled;
    var isLastRun = currentRun >= runs.length - 1;

    // Build context display
    var contextHtml = '';
    var contextTokens = step.context;
    if (sampled && currentStep < run.steps.length - 1) {
      contextTokens = run.steps[currentStep + 1].context;
    } else if (sampled) {
      // Last step sampled - show full result
      var picked = step.candidates[step.pick];
      contextTokens = step.context.concat([picked.token]);
    }
    contextTokens.forEach(function(t, i) {
      var color = palette[i % palette.length];
      contextHtml += '<span style="background: ' + color + '22; border: 1px solid ' + color + '; border-radius: 4px; padding: 3px 8px; margin: 0 2px; color: ' + color + '; font-weight: bold; display: inline-block;">' + escHtml(t) + '</span>';
    });

    // Build probability bars
    var barsHtml = '';
    if (!sampled) {
      step.candidates.forEach(function(c, i) {
        var barWidth = Math.round(c.prob * 300);
        var color = palette[(contextTokens.length + i) % palette.length];
        var highlight = '';
        barsHtml += '<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">' +
          '<span style="min-width: 80px; text-align: right; color: var(--text-primary); font-size: 0.9em;">' + escHtml(c.token) + '</span>' +
          '<div style="background: ' + color + '33; border-radius: 4px; height: 22px; width: ' + barWidth + 'px; transition: width 0.4s; position: relative;">' +
          '<div style="background: ' + color + '; border-radius: 4px; height: 100%; width: 100%;"></div>' +
          '</div>' +
          '<span style="color: var(--text-muted); font-size: 0.8em;">' + Math.round(c.prob * 100) + '%</span>' +
          '</div>';
      });
    } else {
      // Show which was picked
      step.candidates.forEach(function(c, i) {
        var barWidth = Math.round(c.prob * 300);
        var color = palette[(contextTokens.length - 1 + i) % palette.length];
        var isPicked = i === step.pick;
        var opacity = isPicked ? '1' : '0.3';
        barsHtml += '<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; opacity: ' + opacity + ';">' +
          '<span style="min-width: 80px; text-align: right; color: var(--text-primary); font-size: 0.9em;">' + (isPicked ? '>> ' : '') + escHtml(c.token) + '</span>' +
          '<div style="background: ' + color + '33; border-radius: 4px; height: 22px; width: ' + barWidth + 'px;">' +
          '<div style="background: ' + color + '; border-radius: 4px; height: 100%; width: 100%;"></div>' +
          '</div>' +
          '<span style="color: var(--text-muted); font-size: 0.8em;">' + Math.round(c.prob * 100) + '%</span>' +
          '</div>';
      });
    }

    // Network indicator
    var networkHtml = '<div style="text-align: center; margin: 8px 0; display: flex; flex-direction: column; align-items: center; gap: 0;">' +
      '<svg width="24" height="16" viewBox="0 0 24 16"><path d="M12 0v12m0 0l-5-5m5 5l5-5" stroke="#8892b0" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' +
      '<div style="background: var(--bg-secondary); border: 1px solid var(--accent); border-radius: 6px; padding: 4px 16px; color: var(--accent); font-size: 0.8em;">Red Neuronal</div>' +
      '<svg width="24" height="16" viewBox="0 0 24 16"><path d="M12 0v12m0 0l-5-5m5 5l5-5" stroke="#8892b0" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>' +
      '</div>';

    // Buttons
    var btnHtml = '<div style="display: flex; justify-content: center; gap: 12px; margin-top: 10px;">';
    if (!sampled) {
      btnHtml += '<button id="inf-sample-btn" style="background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; padding: 6px 20px; font-family: var(--font-body); font-size: 0.8em; cursor: pointer; font-weight: bold;">Muestrear</button>';
    } else if (!isLastStep) {
      btnHtml += '<button id="inf-next-btn" style="background: var(--bg-secondary); border: 1px solid var(--accent); border-radius: 6px; padding: 6px 20px; color: var(--accent); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">Siguiente token >></button>';
    } else if (!isLastRun) {
      btnHtml += '<button id="inf-rerun-btn" style="background: var(--accent-secondary); color: var(--bg-primary); border: none; border-radius: 6px; padding: 6px 20px; font-family: var(--font-body); font-size: 0.8em; cursor: pointer; font-weight: bold;">Regenerar (mismo prefijo)</button>';
    } else {
      btnHtml += '<button id="inf-reset-btn" style="background: var(--bg-secondary); border: 1px solid var(--text-muted); border-radius: 6px; padding: 6px 20px; color: var(--text-muted); font-family: var(--font-body); font-size: 0.8em; cursor: pointer;">Reiniciar</button>';
    }
    btnHtml += '</div>';

    // Status
    var statusHtml = '<div style="color: var(--text-muted); font-size: 0.7em; text-align: center; margin-top: 6px;">' +
      run.label + ' &mdash; Token ' + (currentStep + 1) + '/' + run.steps.length +
      '</div>';

    container.innerHTML =
      '<div style="margin-bottom: 8px;">' +
      '<div style="color: var(--text-muted); font-size: 0.7em; margin-bottom: 4px;">Contexto (tokens generados hasta ahora):</div>' +
      '<div style="font-family: var(--font-mono); font-size: 0.85em; line-height: 2;">' + contextHtml + '</div>' +
      '</div>' +
      networkHtml +
      '<div style="margin-top: 4px;">' +
      '<div style="color: var(--text-muted); font-size: 0.7em; margin-bottom: 4px;">Probabilidad de cada candidato:</div>' +
      barsHtml +
      '</div>' +
      btnHtml +
      statusHtml;

    // Bind events
    var sampleBtn = document.getElementById('inf-sample-btn');
    var nextBtn = document.getElementById('inf-next-btn');
    var rerunBtn = document.getElementById('inf-rerun-btn');
    var resetBtn = document.getElementById('inf-reset-btn');

    if (sampleBtn) sampleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      sampled = true;
      render();
    });
    if (nextBtn) nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentStep++;
      sampled = false;
      render();
    });
    if (rerunBtn) rerunBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentRun++;
      currentStep = 0;
      sampled = false;
      render();
    });
    if (resetBtn) resetBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentRun = 0;
      currentStep = 0;
      sampled = false;
      render();
    });
  }

  // Keyboard navigation within this slide
  if (typeof Reveal !== 'undefined') {
    document.addEventListener('keydown', function(e) {
      var currentSlide = Reveal.getCurrentSlide();
      if (!currentSlide || !currentSlide.contains(container)) return;

      if (e.key === 'ArrowRight' || e.key === 'Right') {
        var sampleBtn = document.getElementById('inf-sample-btn');
        var nextBtn = document.getElementById('inf-next-btn');
        var rerunBtn = document.getElementById('inf-rerun-btn');
        if (sampleBtn) { e.stopPropagation(); e.preventDefault(); sampleBtn.click(); }
        else if (nextBtn) { e.stopPropagation(); e.preventDefault(); nextBtn.click(); }
        else if (rerunBtn) { e.stopPropagation(); e.preventDefault(); rerunBtn.click(); }
      }
    }, true);
  }

  render();
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
