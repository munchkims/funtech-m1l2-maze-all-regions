import { State, CONFIG } from './state.js';

export function initUI(){
  State.dom.startOverlay   = document.getElementById('startOverlay');
  State.dom.levelOverlay   = document.getElementById('levelOverlay');
  State.dom.gameOverOverlay= document.getElementById('gameOverOverlay');
  State.dom.victoryOverlay = document.getElementById('victoryOverlay');

  State.dom.startButton    = document.getElementById('startButton');
  State.dom.levelStartButton = document.getElementById('levelStartButton');
  State.dom.closeVictory   = document.getElementById('closeVictory');
  State.dom.gameOverOk     = document.getElementById('gameOverOk');

  State.dom.levelTitle     = document.getElementById('levelTitle');
  State.dom.lostLevelText  = document.getElementById('lostLevelText');

  State.dom.scoreDisplay   = document.getElementById('scoreDisplay');
  State.dom.levelBadge     = document.getElementById('levelBadge');
  State.dom.livesContainer = document.getElementById('lives');

  State.canvas = document.getElementById('mazeCanvas');
  State.ctx    = State.canvas.getContext('2d');
  State.canvas.width  = CONFIG.cols * CONFIG.cellSize;
  State.canvas.height = CONFIG.rows * CONFIG.cellSize;

  updateHUD();
  renderLives();
}

export function updateHUD(){
  State.dom.scoreDisplay.textContent = `Очки: ${State.score}`;
  State.dom.levelBadge.textContent   = `Уровень: ${State.level}`;
  State.dom.levelTitle.textContent   = `Уровень ${State.level}`;
}

export function renderLives(){
  const c = State.dom.livesContainer;
  c.innerHTML = '';
  for (let i=0;i<CONFIG.livesPerLevel;i++){
    const h = document.createElement('span');
    h.className = 'heart' + (i < State.lives ? '' : ' lost');
    c.appendChild(h);
  }
}

export function show(el){ el.style.display = 'flex'; }
export function hide(el){ el.style.display = 'none'; }

export function showStartOverlay(){ show(State.dom.startOverlay); }
export function hideStartOverlay(){ hide(State.dom.startOverlay); }

export function showLevelOverlay(){ updateHUD(); renderLives(); show(State.dom.levelOverlay); }
export function hideLevelOverlay(){ hide(State.dom.levelOverlay); }

export function showGameOver(level){
  State.dom.lostLevelText.textContent = `Ты проиграл на уровне ${level}`;
  show(State.dom.gameOverOverlay);
}
export function hideGameOver(){ hide(State.dom.gameOverOverlay); }

export function showVictory(){ show(State.dom.victoryOverlay); }
export function hideVictory(){ hide(State.dom.victoryOverlay); }

export function shakeCanvas(){
  State.canvas.classList.remove('shake');
  // перезапуск анимации
  void State.canvas.offsetWidth;
  State.canvas.classList.add('shake');
}

/* Рендер лабиринта / игрока / финиша */
export function redraw(){
  const { ctx } = State;
  const { rows, cols, cellSize } = CONFIG;
  ctx.clearRect(0,0,State.canvas.width, State.canvas.height);

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;

  for (let i=0;i<rows;i++){
    for (let j=0;j<cols;j++){
      const cell = State.maze[i][j];
      const x = j*cellSize, y = i*cellSize;
      if (cell.walls.top){    line(x,y, x+cellSize,y); }
      if (cell.walls.right){  line(x+cellSize,y, x+cellSize,y+cellSize); }
      if (cell.walls.bottom){ line(x+cellSize,y+cellSize, x,y+cellSize); }
      if (cell.walls.left){   line(x,y+cellSize, x,y); }
    }
  }

  // финиш
  ctx.fillStyle = '#ff3b30';
  drawBox(cols-1, rows-1, 0.2);

  // игрок
  ctx.fillStyle = '#1e90ff';
  drawBox(State.playerCol, State.playerRow, 0.2);

  function line(x1,y1,x2,y2){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
  function drawBox(col,row,padRatio){
    const pad = cellSize * padRatio;
    const x = col*cellSize + pad;
    const y = row*cellSize + pad;
    const size = cellSize - 2*pad;
    ctx.fillRect(x,y,size,size);
  }
}
