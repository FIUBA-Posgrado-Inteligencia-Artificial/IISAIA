import { createScorePanel } from "./score-panel.js";
import { SNAKE_SIZE, SnakeScene } from "./games/snake.js";
import { TETRIS_SIZE, TetrisScene } from "./games/tetris.js";

const GAMES = {
  tetris: {
    name: "Tetris",
    scene: TetrisScene,
    size: TETRIS_SIZE,
    controls: "Izquierda y derecha para mover, arriba para rotar, abajo para bajar más rápido y espacio para soltar la pieza.",
  },
  snake: {
    name: "Snake",
    scene: SnakeScene,
    size: SNAKE_SIZE,
    controls: "Flechas para empezar y girar. La partida termina al chocar contra una pared o contra la cola.",
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

  const panel = createScorePanel(slug);
  game.events.on("gameover", (score) => panel.showResult(score));
  el("restart").addEventListener("click", () => {
    document.activeElement?.blur();
    panel.hideResult();
    game.scene.getScenes(false)[0].scene.restart();
  });
}

start();
