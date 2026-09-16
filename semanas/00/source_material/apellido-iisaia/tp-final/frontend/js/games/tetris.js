import { finishGame, onKeys } from "./common.js";

const CELL = 28;
const COLS = 10;
const ROWS = 20;
const SIDE_WIDTH = 150;
const LINE_POINTS = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;
const START_DELAY_MS = 800;
const DELAY_STEP_MS = 70;
const MIN_DELAY_MS = 100;
const KICKS = [0, -1, 1, -2, 2];

const PIECES = {
  I: { color: 0x22d3ee, shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  O: { color: 0xfacc15, shape: [[1, 1], [1, 1]] },
  T: { color: 0xc084fc, shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  S: { color: 0x4ade80, shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  Z: { color: 0xf87171, shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  J: { color: 0x60a5fa, shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { color: 0xfb923c, shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
};

export const TETRIS_SIZE = { width: COLS * CELL + SIDE_WIDTH, height: ROWS * CELL };

const rotateClockwise = (matrix) => matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());

const emptyRow = () => Array(COLS).fill(null);

function forEachBlock(matrix, callback) {
  matrix.forEach((row, r) => row.forEach((filled, c) => filled && callback(r, c)));
}

export class TetrisScene extends Phaser.Scene {
  constructor() {
    super("tetris");
  }

  create() {
    this.board = Array.from({ length: ROWS }, emptyRow);
    this.bag = [];
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.timer = null;
    this.isOver = false;
    this.graphics = this.add.graphics();
    this.createSidePanel();
    this.bindKeys();
    this.nextType = this.takeFromBag();
    this.spawn();
    this.startTimer();
    this.draw();
  }

  createSidePanel() {
    const style = { fontFamily: "system-ui, sans-serif", fontSize: "16px", color: "#e5e7eb", lineSpacing: 6 };
    const x = COLS * CELL + 16;
    this.add.text(x, 12, "Siguiente", style);
    this.statsText = this.add.text(x, 130, "", style);
  }

  bindKeys() {
    const actions = {
      LEFT: () => this.move(-1),
      RIGHT: () => this.move(1),
      UP: () => this.rotate(),
      DOWN: () => this.dropOne(),
      SPACE: () => this.hardDrop(),
    };
    const handlers = {};
    for (const [key, action] of Object.entries(actions)) {
      handlers[key] = () => {
        if (!this.isOver) {
          action();
          this.draw();
        }
      };
    }
    onKeys(this, handlers);
  }

  takeFromBag() {
    if (this.bag.length === 0) {
      this.bag = Phaser.Utils.Array.Shuffle(Object.keys(PIECES));
    }
    return this.bag.pop();
  }

  spawn() {
    const { shape, color } = PIECES[this.nextType];
    this.piece = { matrix: shape, color, x: Math.floor((COLS - shape[0].length) / 2), y: 0 };
    this.nextType = this.takeFromBag();
    if (this.collides(this.piece.matrix, this.piece.x, this.piece.y)) {
      this.endGame();
    }
  }

  collides(matrix, x, y) {
    let hit = false;
    forEachBlock(matrix, (r, c) => {
      const bx = x + c;
      const by = y + r;
      if (bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && this.board[by][bx])) {
        hit = true;
      }
    });
    return hit;
  }

  move(dx) {
    if (!this.collides(this.piece.matrix, this.piece.x + dx, this.piece.y)) {
      this.piece.x += dx;
    }
  }

  rotate() {
    const rotated = rotateClockwise(this.piece.matrix);
    const kick = KICKS.find((dx) => !this.collides(rotated, this.piece.x + dx, this.piece.y));
    if (kick !== undefined) {
      this.piece.matrix = rotated;
      this.piece.x += kick;
    }
  }

  dropOne() {
    if (this.collides(this.piece.matrix, this.piece.x, this.piece.y + 1)) {
      this.lock();
    } else {
      this.piece.y += 1;
    }
  }

  hardDrop() {
    while (!this.collides(this.piece.matrix, this.piece.x, this.piece.y + 1)) {
      this.piece.y += 1;
    }
    this.lock();
  }

  lock() {
    forEachBlock(this.piece.matrix, (r, c) => {
      this.board[this.piece.y + r][this.piece.x + c] = this.piece.color;
    });
    this.clearLines();
    this.spawn();
  }

  clearLines() {
    const remaining = this.board.filter((row) => row.some((cell) => cell === null));
    const cleared = ROWS - remaining.length;
    if (cleared === 0) {
      return;
    }
    this.board = [...Array.from({ length: cleared }, emptyRow), ...remaining];
    this.score += LINE_POINTS[cleared] * this.level;
    this.lines += cleared;
    const level = 1 + Math.floor(this.lines / LINES_PER_LEVEL);
    if (level !== this.level) {
      this.level = level;
      this.startTimer();
    }
  }

  startTimer() {
    this.timer?.remove();
    const delay = Math.max(MIN_DELAY_MS, START_DELAY_MS - (this.level - 1) * DELAY_STEP_MS);
    this.timer = this.time.addEvent({ delay, loop: true, callback: this.tick, callbackScope: this });
  }

  tick() {
    if (!this.isOver) {
      this.dropOne();
      this.draw();
    }
  }

  drawBlock(x, y, color) {
    this.graphics.fillStyle(color);
    this.graphics.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
  }

  draw() {
    const g = this.graphics;
    g.clear();
    g.lineStyle(1, 0x2a2f37);
    g.strokeRect(0, 0, COLS * CELL, ROWS * CELL);
    this.board.forEach((row, r) => row.forEach((color, c) => color && this.drawBlock(c * CELL, r * CELL, color)));
    if (!this.isOver) {
      forEachBlock(this.piece.matrix, (r, c) => {
        this.drawBlock((this.piece.x + c) * CELL, (this.piece.y + r) * CELL, this.piece.color);
      });
    }
    const next = PIECES[this.nextType];
    forEachBlock(next.shape, (r, c) => this.drawBlock(COLS * CELL + 16 + c * CELL, 44 + r * CELL, next.color));
    this.statsText.setText(`Puntaje\n${this.score}\n\nLíneas\n${this.lines}\n\nNivel\n${this.level}`);
  }

  endGame() {
    this.isOver = true;
    this.timer?.remove();
    this.draw();
    finishGame(this, this.score, COLS * CELL, ROWS * CELL);
  }
}
