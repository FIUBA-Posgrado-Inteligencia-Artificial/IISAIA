import { SNAKE_SIZE, SnakeScene } from "./games/snake.js";

const GAMES = {
  snake: {
    name: "Snake",
    scene: SnakeScene,
    size: SNAKE_SIZE,
    controls: "Flechas para girar. La partida termina al chocar contra una pared o contra la cola.",
  },
};

const el = (id) => document.getElementById(id);

function showPageError(message) {
  const error = el("page-error");
  error.textContent = message;
  error.hidden = false;
}

function createGame(config) {
  if (typeof Phaser === "undefined") {
    showPageError("No se pudo cargar Phaser. Revisá la conexión a internet y recargá la página.");
    return null;
  }
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: "board",
    width: config.size.width,
    height: config.size.height,
    backgroundColor: "#14171c",
    scene: config.scene,
  });
}

function setFinished(finished, score = 0) {
  el("playing").hidden = finished;
  el("finished").hidden = !finished;
  el("final-score").textContent = String(score);
}

function start() {
  const slug = new URLSearchParams(window.location.search).get("game");
  const config = GAMES[slug];
  if (!config) {
    showPageError(`No existe un juego llamado "${slug ?? ""}". Volvé a la lista y elegí uno.`);
    return;
  }
  document.title = config.name;
  el("title").textContent = config.name;
  el("controls").textContent = config.controls;

  const game = createGame(config);
  if (!game) {
    return;
  }
  el("game-layout").hidden = false;

  game.events.on("gameover", (score) => setFinished(true, score));
  el("restart").addEventListener("click", () => {
    document.activeElement?.blur();
    setFinished(false);
    game.scene.getScenes(false)[0].scene.restart();
  });
}

start();
