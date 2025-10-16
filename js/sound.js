// === sound.js ===
// Простая система системных звуков с использованием Web Audio API

let audioCtx;

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.1) { // 🔉 по умолчанию тише
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// звуки событий
export const Sounds = {
  step() { playTone(600, 0.1, 'square', 0.075); },
  hit() { playTone(120, 0.25, 'sawtooth', 0.1); },
  lifeLost() {
    playTone(300, 0.15, 'triangle', 0.075);
    setTimeout(() => playTone(180, 0.15, 'sine', 0.075), 120);
  },
  levelWin() { playTone(880, 0.15, 'triangle', 0.09); },
  gameWin() {
    playTone(600, 0.2, 'triangle', 0.09);
    setTimeout(() => playTone(900, 0.2, 'triangle', 0.09), 180);
    setTimeout(() => playTone(1200, 0.25, 'triangle', 0.09), 360);
  }
};
