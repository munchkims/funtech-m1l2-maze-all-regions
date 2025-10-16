import { State, CONFIG } from './state.js';
import { generateMaze } from './maze.js';
import { Sounds } from './sound.js';
import { redraw, updateHUD, renderLives, shakeCanvas,
         showLevelOverlay, hideLevelOverlay,
         showVictory, hideVictory,
         showStartOverlay, hideStartOverlay,
         showGameOver, hideGameOver } from './ui.js';

export function newGame(){
  State.level = 1;
  State.score = 0;
  startLevel(true);
}

export function startLevel(fromStartOverlay=false){
  // при старте уровня всегда 3 жизни
  State.lives = CONFIG.livesPerLevel;
  State.playerRow = 0;
  State.playerCol = 0;
  State.maze = generateMaze(CONFIG.rows, CONFIG.cols);
  updateHUD();
  renderLives();
  redraw();

  // Если пришли с главного меню — сразу открываем старт уровня
  if (fromStartOverlay) {
    hideStartOverlay();
  }
  showLevelOverlay();
}

export function beginPlay(){
  hideLevelOverlay();
  State.gameActive = true;
}

export function onMoveKey(code){
  if (!State.gameActive) return;

  const cell = State.maze[State.playerRow][State.playerCol];
  let moved = false;

  if (code === 32){ // Space → right
    if (!cell.walls.right && State.playerCol < CONFIG.cols - 1){
      State.playerCol++; moved = true;
    } else { wrongMove(); return; }
  }
  else if (code === 8){ // Backspace → left
    if (!cell.walls.left && State.playerCol > 0){
      State.playerCol--; moved = true;
    } else { wrongMove(); return; }
  }
  else if (code === 13){ // Enter → down
    if (!cell.walls.bottom && State.playerRow < CONFIG.rows - 1){
      State.playerRow++; moved = true;
    } else { wrongMove(); return; }
  }

  if (moved){
    Sounds.step();
    redraw();
    checkFinish();
  }
}

function wrongMove(){
  Sounds.hit();
  if (State.lives > 0){
    State.lives--;
    renderLives();
    shakeCanvas();
    if (State.lives === 0) Sounds.lifeLost();
  }
  if (State.lives === 0){
    State.gameActive = false;
    showGameOver(State.level);
  }
}

export function retrySameLevel(){
  hideGameOver();
  // заново стартуем тот же уровень со свежими 3 жизнями
  startLevel(false); // не из главного меню
}

function checkFinish(){
  const atFinish = (State.playerRow === CONFIG.rows - 1 && State.playerCol === CONFIG.cols - 1);
  if (!atFinish) return;

  Sounds.levelWin();
  State.score++;
  updateHUD();

  if (State.score >= CONFIG.maxScoreToWin){
    State.gameActive = false;
    Sounds.gameWin();
    showVictory();
    return;
  }

  // Следующий уровень
  State.level++;
  State.gameActive = false;
  startLevel(false);
}

export function closeVictoryAndBackToMenu(){
  hideVictory();
  showStartOverlay();
}
