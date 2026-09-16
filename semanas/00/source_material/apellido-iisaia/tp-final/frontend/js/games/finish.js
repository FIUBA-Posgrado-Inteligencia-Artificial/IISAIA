const OVERLAY_COLOR = 0x000000;
const OVERLAY_ALPHA = 0.6;

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
