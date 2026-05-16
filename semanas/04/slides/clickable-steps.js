/**
 * Clickable Steps Component
 *
 * Renders a horizontal flow of step boxes with arrows between them.
 * Each box can be clicked to reveal an example/detail panel below.
 *
 * Usage:
 *   initClickableSteps({
 *     containerId: 'my-flow',
 *     steps: [
 *       {
 *         title: '1. Step name',
 *         summary: 'Short description shown in the box',
 *         color: 'var(--accent-secondary)',     // optional, title color
 *         borderColor: 'var(--text-muted)',     // optional, left border accent
 *         example: '<div>...HTML shown when clicked...</div>'
 *       },
 *       // ...
 *     ]
 *   })
 */

function initClickableSteps(opts) {
  var container = document.getElementById(opts.containerId);
  if (!container) return;
  var steps = opts.steps || [];
  var activeIdx = -1;

  function render() {
    // Wrapper provides positioning context for the absolute-positioned
    // detail panel — that way clicking a step does NOT push the slide's
    // other content down. The detail panel just overlays whatever's below
    // the steps row.
    var html = '<div style="position: relative;">';
    html += '<div style="display: flex; gap: 8px; align-items: stretch; font-size: 0.65em;">';

    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      var isActive = i === activeIdx;
      var titleColor = s.color || 'var(--text-primary)';
      var borderSpec = (i === steps.length - 1 && s.borderFull)
        ? 'border: 1px solid ' + (s.borderColor || 'var(--accent)')
        : 'border-left: 3px solid ' + (s.borderColor || 'var(--text-muted)');
      var activeStyle = isActive
        ? 'box-shadow: 0 0 0 2px ' + titleColor + '; transform: translateY(-2px);'
        : '';

      html += '<div class="cs-step" data-idx="' + i + '" '
        + 'style="flex: 1; background: var(--bg-secondary); border-radius: 8px; padding: 12px; '
        + borderSpec + '; cursor: pointer; transition: box-shadow 0.18s, transform 0.18s; user-select: none; ' + activeStyle + '" '
        + 'role="button" tabindex="0">';
      html += '<div style="font-weight: bold; margin-bottom: 6px; font-size: 1.15em; color: ' + titleColor + ';">' + s.title + '</div>';
      html += '<div style="color: var(--text-muted); line-height: 1.5;">' + s.summary + '</div>';
      html += '</div>';

      if (i < steps.length - 1) {
        html += '<div style="display: flex; align-items: center; flex-shrink: 0;">'
          + '<svg width="20" height="14" viewBox="0 0 24 14"><path d="M2 7h16m0 0l-5-5m5 5l-5 5" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
          + '</div>';
      }
    }

    html += '</div>';

    // Hint text — always inline, doesn't affect layout when detail is open
    var hintText = activeIdx >= 0
      ? 'Click la caja activa otra vez para cerrar'
      : 'Click en una caja para ver un ejemplo concreto';
    html += '<div style="text-align: center; margin-top: 8px; color: var(--text-muted); font-size: 0.55em; font-style: italic; opacity: 0.6;">' + hintText + '</div>';

    // Detail panel — absolutely positioned overlay, only rendered when active.
    // Pops up below the steps row, covering whatever's below in the slide.
    // Slide layout stays unchanged on click.
    if (activeIdx >= 0 && steps[activeIdx].example) {
      var s = steps[activeIdx];
      var detailColor = s.color || 'var(--accent)';
      html += '<div style="position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 100; '
        + 'background: var(--bg-code); border-radius: 6px; padding: 8px 12px; '
        + 'font-size: 0.4em; line-height: 1.45; '
        + 'border-left: 3px solid ' + detailColor + '; '
        + 'max-height: 220px; overflow-y: auto; '
        + 'box-shadow: 0 6px 20px rgba(0,0,0,0.5);">';
      html += '<div style="color: var(--text-muted); margin-bottom: 6px; font-size: 0.95em;">Ejemplo concreto &mdash; ' + s.title + '</div>';
      html += s.example;
      html += '</div>';
    }

    html += '</div>'; // end position-relative wrapper

    container.innerHTML = html;

    // Bind click + keyboard handlers
    var boxes = container.querySelectorAll('.cs-step');
    for (var j = 0; j < boxes.length; j++) {
      (function(idx, el) {
        el.addEventListener('click', function(e) {
          e.stopPropagation();
          activeIdx = activeIdx === idx ? -1 : idx;
          render();
        });
        el.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            activeIdx = activeIdx === idx ? -1 : idx;
            render();
          }
        });
      })(j, boxes[j]);
    }
  }

  render();
}
