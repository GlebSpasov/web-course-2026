import { CONFIG, COLORS } from './config.js';
import { SnakeModel } from './model.js';
import { SnakeView } from './view.js';
import { SnakeController } from './controller.js';

function createApp() {
  const model = new SnakeModel(
    CONFIG.cols,
    CONFIG.rows,
    CONFIG.initialLength,
    Math.random
  );
  const view = new SnakeView(
    {
      canvas: document.getElementById('canvas'),
      score: document.getElementById('score'),
      overlay: document.getElementById('overlay'),
      finalScore: document.getElementById('finalScore'),
      restartBtn: document.getElementById('restartBtn')
    },
    CONFIG.cellSize,
    COLORS
  );
  view.resize(CONFIG.cols, CONFIG.rows);
  const controller = new SnakeController(model, view, CONFIG.moveInterval);
  controller.init();
}

createApp();
