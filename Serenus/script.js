// Play background music
function playBGM() {
  const bgm = document.getElementById('bgm');
  bgm.play();
}

// Mood Check-In
function showMoodMessage() {
  const mood = document.getElementById('mood').value;
  const result = document.getElementById('mood-result');
  let msg = "";
  switch(mood) {
    case "happy": msg = "Great! Keep embracing positivity today! 🌸"; break;
    case "sad": msg = "It's okay to feel down. Take a deep breath and be gentle with yourself."; break;
    case "anxious": msg = "Try focusing on your breath. You are safe in this moment."; break;
    case "tired": msg = "Rest is important. Take a short break or relax your mind."; break;
  }
  result.innerText = msg;
}

// Micro Journaling (simple placeholder)
function summarizeJournal() {
  const journal = document.getElementById('journal').value;
  const result = document.getElementById('journal-result');
  if(journal.trim().length === 0){
    result.innerText = "Write something first!";
    return;
  }
  result.innerText = "Reflect on your feelings. Remember, small steps matter. 🌱";
}
