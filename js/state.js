export const CONFIG = {
  rows: 8,
  cols: 8,
  cellSize: 40,
  livesPerLevel: 3,
  maxScoreToWin: 5
};

export const State = {
  canvas: null,
  ctx: null,
  maze: null,
  playerRow: 0,
  playerCol: 0,
  level: 1,
  score: 0,
  lives: CONFIG.livesPerLevel,
  gameActive: false,
  // DOM refs
  dom: {}
};
