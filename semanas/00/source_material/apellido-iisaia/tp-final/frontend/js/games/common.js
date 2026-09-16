const OVERLAY_COLOR = 0x000000;
const OVERLAY_ALPHA = 0.6;

// Phaser vuelve a despachar la cola entera de teclado con cada evento del DOM
// y la vacía recién al final del frame: si dos teclas llegan en el mismo frame,
// keydown-X se emite de nuevo para eventos ya atendidos. Se filtran acá.
export function onKeys(scene, handlers) {
  const keyboard = scene.input.keyboard;
  const handled = new WeakSet();
  keyboard.enableGlobalCapture();
  keyboard.addCapture(Object.keys(handlers).join(","));
  for (const [key, handler] of Object.entries(handlers)) {
    keyboard.on(`keydown-${key}`, (event) => {
      if (!handled.has(event)) {
        handled.add(event);
        handler();
      }
    });
  }
}

export function finishGame(scene, score, width, height) {
  scene.input.keyboard.disableGlobalCapture();
  scene.add.rectangle(width / 2, height / 2, width, height, OVERLAY_COLOR, OVERLAY_ALPHA);
  scene.add
    .text(width / 2, height / 2, `Fin de la partida\nPuntaje: ${score}`, {
      fontFamily: "system-ui, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
  scene.game.events.emit("gameover", score);
}
