// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const particles = [];
const particleCount = 50;
const colors = ['#D988A0', '#E8AEB7', '#5CA4A9', '#F5A5C0'];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Background Music Toggle
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

// Load saved music state
const savedMusicState = localStorage.getItem('musicPlaying');
if (savedMusicState === 'true') {
  bgm.play();
  isPlaying = true;
  musicBtn.textContent = 'Pause Music';
}

function toggleBGM() {
  if (isPlaying) {
    bgm.pause();
    musicBtn.textContent = 'Play Calm Music';
    localStorage.setItem('musicPlaying', 'false');
  } else {
    bgm.play();
    musicBtn.textContent = 'Pause Music';
    localStorage.setItem('musicPlaying', 'true');
  }
  isPlaying = !isPlaying;
}

// Mood Selection
const moodOptions = document.querySelectorAll('.mood-option');
const moodDisplay = document.getElementById('mood-display');

// Load saved mood
const savedMood = localStorage.getItem('currentMood');
if (savedMood) {
  const savedOption = document.querySelector(`[data-mood="${savedMood}"]`);
  if (savedOption) {
    savedOption.classList.add('selected');
    moodDisplay.innerHTML = `Current mood: <span>${savedOption.dataset.label}</span>`;
  }
}

moodOptions.forEach(option => {
  option.addEventListener('click', function() {
    // Remove previous selection
    moodOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    this.classList.add('selected');
    
    const mood = this.dataset.mood;
    const label = this.dataset.label;
    
    // Save mood to localStorage
    localStorage.setItem('currentMood', mood);
    
    // Display current mood
    moodDisplay.innerHTML = `Current mood: <span>${label}</span>`;
    // Scroll to AI response smoothly
    document.getElementById('ai-response').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    generateMoodResponse(mood);

  });
});
// GEMINI MOOD RESPONSE SYSTEM
async function generateMoodResponse(mood) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are a calming, supportive mental wellness companion.
The user is feeling: "${mood}".

Write a short, warm paragraph (3-4 sentences) that:
- Acknowledges their feeling with empathy
- Offers one gentle, actionable suggestion they can try right now
- Ends with encouraging words

Keep it conversational, like talking to a friend. No numbered lists, no bold text, no medical advice.
    `;
    

    document.getElementById("ai-response").textContent = "Thinking... 🌸";

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    document.getElementById("ai-response").textContent = text;
  } catch (e) {
    document.getElementById("ai-response").textContent =
      "Unable to load calming guidance at the moment 💗";
  }
}
