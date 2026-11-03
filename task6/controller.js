import { DIRECTIONS } from './config.js';

export class SnakeController {
  constructor(model, view, moveInterval) {
    this.model = model;
    this.view = view;
    this.moveInterval = moveInterval;
    this.rafId = null;
    this.lastMoveTime = null;
    this.tick = this.tick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.view.onRestart(() => this.start());
    this.start();
  }

  start() {
    this.stop();
    this.model.reset();
    this.lastMoveTime = null;
    this.draw();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  tick(currentTime) {
    this.update(currentTime);
    this.draw();
    if (this.model.gameOver) {
      this.stop();
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
  }

  update(currentTime) {
    if (this.lastMoveTime === null) {
      this.lastMoveTime = currentTime;
      return;
    }
    if (currentTime - this.lastMoveTime >= this.moveInterval) {
      this.model.step();
      this.lastMoveTime = currentTime;
    }
  }

  draw() {
    this.view.render(this.model.getState());
  }

  handleKeyDown(event) {
    const direction = DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault();
    this.model.setDirection(direction);
  }
}
