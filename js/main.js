import { initUI } from './ui.js';
import { newGame, beginPlay, retrySameLevel, closeVictoryAndBackToMenu } from './game.js';
import { attachInput } from './input.js';
import { State, CONFIG } from './state.js';
import { redraw } from './ui.js';

// === Запуск при загрузке страницы ===
window.addEventListener('load', () => {
  initUI();
  attachInput();

  // 🔹 Сразу запускаем первый уровень без стартового окна
  newGame();

  // Кнопки
  document.getElementById('levelStartButton').addEventListener('click', () => beginPlay());
  document.getElementById('gameOverOk').addEventListener('click', () => retrySameLevel());
  document.getElementById('closeVictory').addEventListener('click', () => closeVictoryAndBackToMenu());
});

// === 🔹 Адаптация под iframe и изменение размера ===

// Обновление размеров canvas с сохранением пропорций
function resizeCanvas() {
  const container = document.querySelector('.game-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight - 60;

  const mazeW = CONFIG.cols * CONFIG.cellSize;
  const mazeH = CONFIG.rows * CONFIG.cellSize;
  const scale = Math.min(width / mazeW, height / mazeH);

  State.canvas.width = mazeW * scale;
  State.canvas.height = mazeH * scale;
  State.ctx.setTransform(scale, 0, 0, scale, 0, 0);

  // ✅ Проверяем, чтобы не вызвать redraw раньше времени
  if (State.maze) {
    redraw();
  }
}

// слушаем изменение окна
window.addEventListener('resize', resizeCanvas);

// вызываем при первом запуске
setTimeout(resizeCanvas, 100);
