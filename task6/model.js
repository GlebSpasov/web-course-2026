import { DIRECTIONS } from './config.js';

export class SnakeModel {
  constructor(cols, rows, initialLength, random) {
    this.cols = cols;
    this.rows = rows;
    this.initialLength = initialLength;
    this.random = random;
    this.reset();
  }

  reset() {
    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.snake = [];
    for (let i = 0; i < this.initialLength; i++) {
      this.snake.push({ x: startX - i, y: startY });
    }
    this.direction = DIRECTIONS.ArrowRight;
    this.pendingDirection = this.direction;
    this.score = 0;
    this.gameOver = false;
    this.apple = null;
    this.spawnApple();
  }

  setDirection(direction) {
    const isReverse =
      direction.x === -this.direction.x && direction.y === -this.direction.y;
    if (isReverse) return;
    this.pendingDirection = direction;
  }

  getFreeCells() {
    const free = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (!this.isSnakeCell({ x, y })) free.push({ x, y });
      }
    }
    return free;
  }

  spawnApple() {
    const free = this.getFreeCells();
    if (free.length === 0) {
      this.apple = null;
      return false;
    }
    this.apple = free[Math.floor(this.random() * free.length)];
    return true;
  }

  isSnakeCell(cell, ignoreTail = false) {
    const length = ignoreTail ? this.snake.length - 1 : this.snake.length;
    for (let i = 0; i < length; i++) {
      if (this.snake[i].x === cell.x && this.snake[i].y === cell.y) return true;
    }
    return false;
  }

  isOutOfBounds(cell) {
    return cell.x < 0 || cell.y < 0 || cell.x >= this.cols || cell.y >= this.rows;
  }

  checkCollision(cell, willEat) {
    return this.isOutOfBounds(cell) || this.isSnakeCell(cell, !willEat);
  }

  step() {
    if (this.gameOver) return;

    this.direction = this.pendingDirection;
    const head = this.snake[0];
    const next = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    const willEat =
      this.apple !== null && next.x === this.apple.x && next.y === this.apple.y;

    if (this.checkCollision(next, willEat)) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(next);

    if (willEat) {
      this.score++;
      if (!this.spawnApple()) this.gameOver = true;
    } else {
      this.snake.pop();
    }
  }

  getState() {
    return {
      cols: this.cols,
      rows: this.rows,
      snake: this.snake.map((segment) => ({ x: segment.x, y: segment.y })),
      apple: this.apple ? { x: this.apple.x, y: this.apple.y } : null,
      score: this.score,
      gameOver: this.gameOver
    };
  }
}
