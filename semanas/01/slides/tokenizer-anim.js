/**
 * Tokenizer Animation Generator
 *
 * Loads a text file and generates an interactive step-by-step animation
 * showing: plain text → UTF-8 values → BPE tokens → final IDs
 *
 * Usage: call initTokenizerAnim({ textUrl, containerId, ... })
 * The text file should contain the raw example text (with literal \n for newlines to show).
 */

function initTokenizerAnim(opts) {
  var containerId = opts.containerId || 'tok-anim';
  var titleId = opts.titleId || 'tok-title';
  var conceptsId = opts.conceptsId || 'tok-concepts';
  var textUrl = opts.textUrl;

  fetch(textUrl)
    .then(function(r) { return r.text(); })
    .then(function(rawText) {
      var text = rawText.trim();
      buildAnimation(text, containerId, titleId, conceptsId);
    });
}

function buildAnimation(text, containerId, titleId, conceptsId) {
  // Parse the text: treat literal \n in the file as newline markers to display
  // The file should contain actual newlines where \n should appear in the animation
  var displayChars = [];
  for (var i = 0; i < text.length; i++) {
    if (text[i] === '\n') {
      displayChars.push({ ch: '\\n', code: 10, isSpecial: true });
    } else if (text[i] === '\r') {
      continue; // skip CR
    } else {
      displayChars.push({ ch: text[i], code: text.charCodeAt(i), isSpecial: text[i] === ' ' });
    }
  }

  // Simple BPE-like tokenization: group into realistic subword chunks
  var tokens = bpeTokenize(displayChars);

  // Assign colors to tokens (cycle through palette)
  var palette = ['#4dc9f6','#f67019','#acc236','#e8508b','#9b59b6','#27ae60','#e67e22','#2980b9'];
  tokens.forEach(function(t, i) { t.color = palette[i % palette.length]; });

  var stages = [
    {
      label: 'Texto plano tal como sale del dataset de entrenamiento',
      render: function() {
        // Build human-readable version (with actual line breaks)
        var readable = '';
        displayChars.forEach(function(c) {
          if (c.ch === '\\n') readable += '\n';
          else readable += c.ch;
        });
        var readableLines = readable.split('\n');

        // Build raw version (with visible \n)
        var raw = '';
        displayChars.forEach(function(c) {
          if (c.ch === '\\n') raw += '<span style="color: var(--accent);">\\n</span>';
          else raw += escapeHtml(c.ch);
        });

        // Dynamic font size based on text length
        var len = displayChars.length;
        var fontSize = len < 40 ? '1.2em' : len < 80 ? '1em' : len < 150 ? '0.85em' : '0.7em';

        var html = '<div style="display: flex; gap: 20px; align-items: flex-start;">';

        // Left: human readable
        html += '<div style="flex: 1; background: var(--bg-secondary); border-radius: 8px; padding: 12px; border: 1px solid var(--text-muted);">';
        html += '<div style="color: var(--text-muted); font-size: 0.7em; margin-bottom: 6px;">Legible</div>';
        html += '<div style="color: var(--text-primary); font-size: ' + fontSize + '; line-height: 1.5; white-space: pre-wrap;">' + escapeHtml(readable) + '</div>';
        html += '</div>';

        // Right: raw with \n visible
        html += '<div style="flex: 1; background: var(--bg-secondary); border-radius: 8px; padding: 12px; border: 1px solid var(--accent); border-style: dashed;">';
        html += '<div style="color: var(--text-muted); font-size: 0.7em; margin-bottom: 6px;">Como lo ve la computadora</div>';
        html += '<div style="color: var(--text-primary); font-size: ' + fontSize + '; line-height: 1.5;">' + raw + '</div>';
        html += '</div>';

        html += '</div>';

        html += '<ul style="margin-top: 12px; font-size: 0.8em; color: var(--text-muted); list-style: disc; padding-left: 20px; line-height: 1.6;">';
        html += '<li>Secuencia unidimensional de caracteres</li>';
        html += '<li><a href="https://huggingface.co/datasets/allenai/c4/viewer/af/validation?p=19&row=1909" target="_blank" style="color: var(--link);">Ejemplo de dataset C4</a></li>';
        html += '</ul>';
        return html;
      }
    },
    {
      label: 'Paso 1: Cada caracter tiene un valor numerico en UTF-8',
      render: function() {
        // Collect which codes are used in the text
        var usedCodes = {};
        displayChars.forEach(function(c) { usedCodes[c.code] = true; });

        // Limit chars shown to avoid overflow
        var charLimit = Math.min(displayChars.length, 280);
        var truncated = displayChars.length > charLimit;

        var html = '<div style="display: flex; gap: var(--spacing-md, 16px); align-items: flex-start;">';

        // Left: char → number mapping (compact)
        html += '<div style="flex: 1; min-width: 0;">';
        html += '<div style="display: inline-flex; gap: 0; flex-wrap: wrap; align-items: center; margin-bottom: 0.5em; font-size: 0.8em;">';
        for (var ci = 0; ci < charLimit; ci++) {
          var c = displayChars[ci];
          html += '<span style="display: inline-flex; flex-direction: column; align-items: center; padding: 0.05em 0.15em; min-width: 1.4em;">' +
            '<span style="color: ' + (c.isSpecial ? 'var(--accent)' : 'var(--text-primary)') + ';">' + escapeHtml(c.ch) + '</span>' +
            '<span style="color: var(--accent-secondary); font-size: 0.8em;">' + c.code + '</span>' +
            '</span>';
        }
        if (truncated) {
          html += '<span style="color: var(--text-muted); padding: 0 0.5em;">...(' + displayChars.length + ')</span>';
        }
        html += '</div>';
        html += '<div style="color: var(--text-muted); font-size: 0.8em;">Cada caracter se mapea a un numero. Pero usar uno por caracter es ineficiente.</div>';
        html += '</div>';

        // Right: mini ASCII table (relative sizing)
        html += '<div style="flex: 0 0 30%;">';
        html += '<div style="color: var(--text-muted); font-size: 0.6em; margin-bottom: 0.3em; text-align: center;">Tabla ASCII (fragmento)</div>';
        html += '<div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 1px; font-size: 0.7em; background: var(--bg-secondary); border-radius: 0.4em; padding: 0.3em;">';
        for (var code = 32; code < 128; code++) {
          var ch = code === 32 ? 'SP' : code === 127 ? 'DEL' : String.fromCharCode(code);
          var isUsed = usedCodes[code];
          var bg = isUsed ? 'var(--accent)' + '33' : 'transparent';
          var color = isUsed ? 'var(--accent)' : 'var(--text-muted)';
          html += '<span style="display: flex; flex-direction: column; align-items: center; padding: 0.1em; background: ' + bg + '; border-radius: 0.15em;">' +
            '<span style="color: ' + color + '; font-weight: ' + (isUsed ? 'bold' : 'normal') + ';">' + escapeHtml(ch) + '</span>' +
            '<span style="color: var(--text-muted); font-size: 0.75em; opacity: 0.6;">' + code + '</span>' +
            '</span>';
        }
        html += '</div>';
        html += '<div style="color: var(--text-muted); font-size: 0.5em; margin-top: 0.2em; text-align: center;">Resaltados = usados en el texto</div>';
        html += '</div>';

        html += '</div>';
        return html;
      }
    },
    {
      label: 'Paso 2: Agrupar bytes en tokens (subpalabras frecuentes)',
      render: function() {
        var html = '<div style="display: flex; gap: 4px; flex-wrap: wrap; align-items: center;">';
        tokens.forEach(function(t) {
          html += '<span style="background: ' + t.color + '22; border: 2px solid ' + t.color + '; border-radius: 6px; padding: 4px 10px; display: inline-flex; flex-direction: column; align-items: center; gap: 1px;">' +
            '<span style="color: ' + t.color + '; font-size: 1em; font-weight: bold;">' + escapeHtml(t.text) + '</span>' +
            '<span style="color: var(--text-primary); font-size: 0.7em;">' + t.id + '</span>' +
            '</span>';
        });
        html += '</div>';
        html += '<div style="margin-top: 10px; color: var(--text-primary); font-size: 0.8em;">Un algoritmo (BPE) aprende que secuencias de bytes aparecen juntas con frecuencia y las agrupa en "tokens".</div>';
        return html;
      }
    },
    {
      label: 'Resultado: lo que la LLM realmente ve',
      render: function() {
        var ids = tokens.map(function(t) { return t.id; });
        var html = '<div style="color: var(--text-muted); font-size: 0.85em; margin-bottom: 8px;">Texto original (' + displayChars.length + ' caracteres):</div>';
        html += '<div style="color: var(--text-primary); font-size: 0.95em; margin-bottom: 12px;">';
        displayChars.forEach(function(c) {
          if (c.ch === '\\n') html += '<span style="color: var(--accent);">\\n</span>';
          else html += escapeHtml(c.ch);
        });
        html += '</div>';
        html += '<div style="color: var(--text-muted); font-size: 0.85em; margin-bottom: 8px;">Lo que la LLM recibe (' + tokens.length + ' tokens):</div>';
        html += '<div style="color: var(--accent); font-size: 0.95em; margin-bottom: 12px;">[' + ids.join(', ') + ']</div>';
        html += '<div style="color: var(--text-primary); font-size: 0.85em;">' + displayChars.length + ' caracteres → ' + tokens.length + ' tokens. La red neuronal solo ve esta secuencia de numeros enteros.</div>';
        html += '<div style="color: var(--text-muted); font-size: 0.8em; margin-top: 4px;">El vocabulario completo tiene ~100.000 tokens. Cada token es un ID unico en ese vocabulario.</div>';
        return html;
      }
    }
  ];

  // DOM elements
  var container = document.getElementById(containerId);
  var label = container.querySelector('[id$="-label"]') || container.children[0];
  var content = container.querySelector('[id$="-content"]') || container.children[1];
  var prevBtn = document.getElementById('tok-prev');
  var nextBtn = document.getElementById('tok-next');
  var indicator = document.getElementById('tok-step-indicator');
  var titleEl = document.getElementById(titleId);
  var conceptsEl = document.getElementById(conceptsId);

  var step = 0;

  function goTo(newStep) {
    if (newStep < 0 || newStep >= stages.length) return;
    step = newStep;
    content.style.opacity = '0';
    setTimeout(function() {
      label.innerHTML = stages[step].label;
      content.innerHTML = stages[step].render();
      indicator.innerHTML = (step + 1) + ' / ' + stages.length;
      prevBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
      nextBtn.innerHTML = step < stages.length - 1 ? 'Siguiente →' : 'Listo';
      content.style.opacity = '1';
      if (step === stages.length - 1) {
        if (titleEl) titleEl.style.opacity = '1';
        if (conceptsEl) conceptsEl.style.opacity = '1';
      } else {
        if (titleEl) titleEl.style.opacity = '0';
        if (conceptsEl) conceptsEl.style.opacity = '0';
      }
    }, 200);
  }

  prevBtn.addEventListener('click', function(e) { e.stopPropagation(); goTo(step - 1); });
  nextBtn.addEventListener('click', function(e) { e.stopPropagation(); if (step < stages.length - 1) goTo(step + 1); });

  // Keyboard: intercept left/right arrows when this slide is active
  // to navigate the animation instead of changing slides
  if (typeof Reveal !== 'undefined') {
    document.addEventListener('keydown', function(e) {
      // Only intercept if the tokenization slide is the current slide
      var currentSlide = Reveal.getCurrentSlide();
      if (!currentSlide || !currentSlide.contains(container)) return;

      if (e.key === 'ArrowRight' || e.key === 'Right') {
        if (step < stages.length - 1) {
          e.stopPropagation();
          e.preventDefault();
          goTo(step + 1);
        }
        // On last step, let reveal.js handle the arrow to go to next slide
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        if (step > 0) {
          e.stopPropagation();
          e.preventDefault();
          goTo(step - 1);
        }
        // On first step, let reveal.js handle the arrow to go to previous slide
      }
    }, true); // useCapture to intercept before reveal.js
  }

  goTo(0);
}

/**
 * Simple BPE-like tokenizer simulation.
 * Groups characters into realistic subword tokens with deterministic fake IDs.
 */
function bpeTokenize(chars) {
  // Reconstruct plain string for splitting
  var plain = chars.map(function(c) { return c.ch === '\\n' ? '\n' : c.ch; }).join('');

  // Split into token-like chunks: prefixed spaces stay with the word, punctuation is separate,
  // newlines are separate, long words split into 3-5 char subwords
  var tokens = [];
  var i = 0;
  while (i < plain.length) {
    // Newline
    if (plain[i] === '\n') {
      tokens.push({ text: '\\n', raw: '\n' });
      i++;
      continue;
    }
    // Punctuation
    if (/[.,;:!?()"\[\]{}]/.test(plain[i])) {
      tokens.push({ text: plain[i], raw: plain[i] });
      i++;
      continue;
    }
    // Space followed by word chars: group as " word" token
    if (plain[i] === ' ' && i + 1 < plain.length && /[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/.test(plain[i + 1])) {
      var chunk = ' ';
      i++;
      while (i < plain.length && /[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/.test(plain[i])) {
        chunk += plain[i];
        i++;
      }
      // Split long tokens into subwords (max 5 chars including space)
      while (chunk.length > 5) {
        var part = chunk.slice(0, 4);
        tokens.push({ text: part, raw: part });
        chunk = chunk.slice(4);
      }
      if (chunk.length > 0) tokens.push({ text: chunk, raw: chunk });
      continue;
    }
    // Word at start (no leading space)
    if (/[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/.test(plain[i])) {
      var chunk = '';
      while (i < plain.length && /[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/.test(plain[i])) {
        chunk += plain[i];
        i++;
      }
      while (chunk.length > 4) {
        var part = chunk.slice(0, 3);
        tokens.push({ text: part, raw: part });
        chunk = chunk.slice(3);
      }
      if (chunk.length > 0) tokens.push({ text: chunk, raw: chunk });
      continue;
    }
    // Space or other
    tokens.push({ text: plain[i], raw: plain[i] });
    i++;
  }

  // Generate deterministic fake token IDs based on text content
  tokens.forEach(function(t) {
    var hash = 0;
    for (var j = 0; j < t.text.length; j++) {
      hash = ((hash << 5) - hash + t.text.charCodeAt(j)) & 0xFFFF;
    }
    // Map to realistic-looking token ID range
    if (t.text === '\\n') { t.id = 198; }
    else if (t.text === '.') { t.id = 13; }
    else if (t.text === ',') { t.id = 11; }
    else if (t.text === ' ') { t.id = 220; }
    else { t.id = 200 + (hash % 49800); }
  });

  // Deduplicate IDs for identical tokens
  var idMap = {};
  tokens.forEach(function(t) {
    if (idMap[t.text] !== undefined) {
      t.id = idMap[t.text];
    } else {
      idMap[t.text] = t.id;
    }
  });

  return tokens;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
