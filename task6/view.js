export class SnakeView {
  constructor(elements, cellSize, colors) {
    this.canvas = elements.canvas;
    this.ctx = elements.canvas.getContext('2d');
    this.scoreEl = elements.score;
    this.overlayEl = elements.overlay;
    this.finalScoreEl = elements.finalScore;
    this.restartBtn = elements.restartBtn;
    this.cellSize = cellSize;
    this.colors = colors;
  }

  resize(cols, rows) {
    this.canvas.width = cols * this.cellSize;
    this.canvas.height = rows * this.cellSize;
  }

  onRestart(handler) {
    this.restartBtn.addEventListener('click', handler);
  }

  render(state) {
    this.clear();
    this.drawGrid(state.cols, state.rows);
    if (state.apple) this.drawApple(state.apple);
    this.drawSnake(state.snake);
    this.drawScore(state.score);
    this.drawGameOver(state.gameOver, state.score);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid(cols, rows) {
    const size = this.cellSize;
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = 1; x < cols; x++) {
      this.ctx.moveTo(x * size + 0.5, 0);
      this.ctx.lineTo(x * size + 0.5, rows * size);
    }
    for (let y = 1; y < rows; y++) {
      this.ctx.moveTo(0, y * size + 0.5);
      this.ctx.lineTo(cols * size, y * size + 0.5);
    }
    this.ctx.stroke();
  }

  drawApple(apple) {
    const size = this.cellSize;
    this.ctx.fillStyle = this.colors.apple;
    this.ctx.beginPath();
    this.ctx.arc(
      apple.x * size + size / 2,
      apple.y * size + size / 2,
      size / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawSnake(snake) {
    const size = this.cellSize;
    snake.forEach((segment, index) => {
      this.ctx.fillStyle = index === 0 ? this.colors.head : this.colors.body;
      this.ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
    });
  }

  drawScore(score) {
    this.scoreEl.textContent = score;
  }

  drawGameOver(gameOver, score) {
    this.overlayEl.hidden = !gameOver;
    this.finalScoreEl.textContent = score;
  }
}
