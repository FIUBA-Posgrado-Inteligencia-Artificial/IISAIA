import { finishGame, onKeys } from "./common.js";

const CELL = 20;
const COLS = 24;
const ROWS = 24;
const START_DELAY_MS = 140;
const MIN_DELAY_MS = 60;
const DELAY_STEP_MS = 4;
const POINTS_PER_FOOD = 10;

const COLORS = { head: 0x5eead4, body: 0x14b8a6, food: 0xf97316 };

const DIRECTIONS = {
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
};

export const SNAKE_SIZE = { width: COLS * CELL, height: ROWS * CELL };

const sameCell = (a, b) => a.x === b.x && a.y === b.y;

export class SnakeScene extends Phaser.Scene {
  constructor() {
    super("snake");
  }

  create() {
    const mid = Math.floor(COLS / 2);
    this.body = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
    this.direction = DIRECTIONS.RIGHT;
    this.nextDirection = DIRECTIONS.RIGHT;
    this.score = 0;
    this.timer = null;
    this.food = this.randomFreeCell();
    this.graphics = this.add.graphics();
    this.scoreText = this.add.text(8, 4, "", { fontFamily: "system-ui, sans-serif", fontSize: "16px", color: "#e5e7eb" });
    this.startHint = this.add
      .text(SNAKE_SIZE.width / 2, SNAKE_SIZE.height / 2 + 2 * CELL, "Presioná una flecha para empezar", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "18px",
        color: "#e5e7eb",
      })
      .setOrigin(0.5);
    this.bindKeys();
    this.draw();
  }

  bindKeys() {
    const handlers = {};
    for (const name of Object.keys(DIRECTIONS)) {
      handlers[name] = () => this.turn(DIRECTIONS[name]);
    }
    onKeys(this, handlers);
  }

  turn(direction) {
    if (this.timer === null) {
      this.startHint.destroy();
      this.startTimer(START_DELAY_MS);
    }
    const reverses = direction.x === -this.direction.x && direction.y === -this.direction.y;
    if (!reverses) {
      this.nextDirection = direction;
    }
  }

  startTimer(delay) {
    this.timer?.remove();
    this.delay = delay;
    this.timer = this.time.addEvent({ delay, loop: true, callback: this.step, callbackScope: this });
  }

  step() {
    this.direction = this.nextDirection;
    const head = this.body[0];
    const next = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    const eats = sameCell(next, this.food);
    // Si no come, la cola se corre en este mismo paso y esa celda queda libre.
    const obstacles = eats ? this.body : this.body.slice(0, -1);
    if (this.outOfBounds(next) || obstacles.some((cell) => sameCell(cell, next))) {
      this.endGame();
      return;
    }
    this.body.unshift(next);
    if (eats) {
      this.eat();
    } else {
      this.body.pop();
    }
    this.draw();
  }

  eat() {
    this.score += POINTS_PER_FOOD;
    this.food = this.randomFreeCell();
    if (this.food === null) {
      this.endGame();
      return;
    }
    this.startTimer(Math.max(MIN_DELAY_MS, this.delay - DELAY_STEP_MS));
  }

  outOfBounds(cell) {
    return cell.x < 0 || cell.x >= COLS || cell.y < 0 || cell.y >= ROWS;
  }

  randomFreeCell() {
    const free = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!this.body.some((cell) => sameCell(cell, { x, y }))) {
          free.push({ x, y });
        }
      }
    }
    return free.length > 0 ? Phaser.Utils.Array.GetRandom(free) : null;
  }

  draw() {
    const g = this.graphics;
    g.clear();
    if (this.food) {
      g.fillStyle(COLORS.food);
      g.fillRect(this.food.x * CELL + 2, this.food.y * CELL + 2, CELL - 4, CELL - 4);
    }
    this.body.forEach((cell, index) => {
      g.fillStyle(index === 0 ? COLORS.head : COLORS.body);
      g.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
    });
    this.scoreText.setText(`Puntaje: ${this.score}`);
  }

  endGame() {
    this.timer.remove();
    this.draw();
    finishGame(this, this.score, SNAKE_SIZE.width, SNAKE_SIZE.height);
  }
}
