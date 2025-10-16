import { initUI, showStartOverlay } from './ui.js';
import { newGame, beginPlay, retrySameLevel, closeVictoryAndBackToMenu } from './game.js';
import { attachInput } from './input.js';

window.addEventListener('load', ()=>{
  initUI();
  attachInput();
  showStartOverlay();

  // Кнопки
  document.getElementById('startButton').addEventListener('click', ()=> newGame());
  document.getElementById('levelStartButton').addEventListener('click', ()=> beginPlay());
  document.getElementById('gameOverOk').addEventListener('click', ()=> retrySameLevel());
  document.getElementById('closeVictory').addEventListener('click', ()=> closeVictoryAndBackToMenu());
});

// === 🔹 Адаптация под iframe и изменение размера ===
import { State, CONFIG } from './state.js';
import { redraw } from './ui.js';

// Обновление размеров canvas с сохранением пропорций
function resizeCanvas() {
  const container = document.querySelector('.game-container');
  if (!container) return;

  // вычисляем доступную ширину и высоту
  const width = container.clientWidth;
  const height = container.clientHeight - 60; // небольшое место для HUD

  // исходные размеры лабиринта
  const mazeW = CONFIG.cols * CONFIG.cellSize;
  const mazeH = CONFIG.rows * CONFIG.cellSize;

  // масштаб по минимальной оси (чтобы не растягивалось)
  const scale = Math.min(width / mazeW, height / mazeH);

  // обновляем canvas
  State.canvas.width = mazeW * scale;
  State.canvas.height = mazeH * scale;

  // сбрасываем трансформацию и задаем масштаб
  State.ctx.setTransform(scale, 0, 0, scale, 0, 0);

  redraw();
}

// слушаем изменение окна или контейнера
window.addEventListener('resize', resizeCanvas);

// при первой загрузке — обязательно вызвать
setTimeout(resizeCanvas, 100);
