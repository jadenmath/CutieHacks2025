const breathBall = document.getElementById('breathBall');
const instruction = document.getElementById('instruction');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let breathingInterval;
let countdownInterval;
let isBreathing = false;
let isPaused = false;
let currentPhase = 0;

// Breathing phases: [duration, class, text]
const phases = [
  [4, 'inhale', 'Breathe In'],
  [7, 'hold', 'Hold'],
  [8, 'exhale', 'Breathe Out']
];

function startBreathing() {
  if (isBreathing && !isPaused) return;
  
  isBreathing = true;
  isPaused = false;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  
  if (!isPaused) {
    currentPhase = 0;
  }
  
  runBreathingCycle();
}

function pauseBreathing() {
  isPaused = true;
  clearInterval(breathingInterval);
  clearInterval(countdownInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  instruction.textContent = 'Paused';
}

function resetBreathing() {
  isBreathing = false;
  isPaused = false;
  currentPhase = 0;
  
  clearInterval(breathingInterval);
  clearInterval(countdownInterval);
  
  breathBall.className = 'breath-ball';
  instruction.textContent = 'Click Start to Begin';
  timerDisplay.textContent = '--';
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function runBreathingCycle() {
  const [duration, className, text] = phases[currentPhase];
  
  breathBall.className = 'breath-ball ' + className;
  instruction.textContent = text;
  
  let timeLeft = duration;
  timerDisplay.textContent = timeLeft;
  
  countdownInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
  
  breathingInterval = setTimeout(() => {
    currentPhase = (currentPhase + 1) % phases.length;
    if (isBreathing && !isPaused) {
      runBreathingCycle();
    }
  }, duration * 1000);
}