// Local Storage Management
let selectedMood = 'calm';

// Mood Selection
function selectMood(mood) {
  selectedMood = mood;
  
  // Update button styles
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
  
  // Display selected mood
  const moodEmojis = {
    happy: '😊 Happy',
    calm: '😌 Calm',
    anxious: '😰 Anxious',
    sad: '😔 Sad'
  };
  document.getElementById('selected-mood').textContent = `Current mood: ${moodEmojis[mood]}`;
}

// Save Journal Entry to Local Storage
function saveEntry() {
  const input = document.getElementById('journal-input');
  const message = document.getElementById('save-message');
  const content = input.value.trim();

  if (!content) {
    message.innerText = "✨ Please write something before saving!";
    message.style.color = "#E74C3C";
    return;
  }

  try {
    // Get existing entries from local storage
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    // Create new entry
    const newEntry = {
      id: Date.now().toString(), // Use timestamp as unique ID
      content: content,
      mood: selectedMood,
      createdAt: new Date().toISOString()
    };
    
    // Add to entries array
    entries.unshift(newEntry); // Add to beginning for newest first
    
    // Save to local storage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    message.innerText = "✨ Entry saved successfully! Your thoughts matter.";
    message.style.color = "#5CA4A9";
    input.value = '';
    
    // Reset mood selection
    selectedMood = 'calm';
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    document.querySelector('[data-mood="calm"]').classList.add('selected');
    document.getElementById('selected-mood').textContent = '';
    
    // Generate AI insight
    generateAIInsight(content, selectedMood);
    
    // Reload entries after a short delay
    setTimeout(() => {
      message.innerText = '';
      loadEntries();
    }, 2000);
  } catch (err) {
    message.innerText = "⚠️ Error saving entry. Please try again.";
    message.style.color = "#E74C3C";
    console.error('Error:', err);
  }
}

// Generate AI Insight using Gemini
async function generateAIInsight(content, mood) {
  const insightBox = document.getElementById('ai-insight-box');
  const insightText = document.getElementById('ai-insight-text');
  
  try {
    insightBox.style.display = 'block';
    insightText.innerText = '💭 Thinking about your thoughts...';
    
    const model = window.genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const moodDescriptions = {
      happy: 'feeling happy',
      calm: 'feeling calm',
      anxious: 'feeling anxious',
      sad: 'feeling sad'
    };

    const prompt = `The user shared a journal entry and indicated they are ${moodDescriptions[mood] || 'feeling calm'}. 

Journal Entry:
"${content}"

Please provide a supportive, empathetic, and insightful response that:
1. Acknowledges their feelings
2. Offers 1-2 gentle, actionable suggestions they can try
3. Provides encouragement

Keep it conversational and warm, like talking to a caring friend. Keep the response to 3-4 sentences maximum.`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    insightText.innerText = responseText;
  } catch (error) {
    insightText.innerText = '💗 Your feelings are valid and matter. Take a moment to breathe and be gentle with yourself. 🌸';
    console.error('API Error:', error);
  }
}

// Load Journal Entries from Local Storage
function loadEntries() {
  const container = document.getElementById('entries-container');

  try {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    if (entries.length === 0) {
      container.innerHTML = '<p class="no-entries">No entries yet. Start journaling to create your first entry! 🌸</p>';
      return;
    }

    // Create timeline HTML
    container.innerHTML = entries.map((entry) => {
      const date = new Date(entry.createdAt);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const moodEmojis = {
        happy: '😊',
        calm: '😌',
        anxious: '😰',
        sad: '😔'
      };

      return `
        <div class="timeline-entry">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="entry-header">
              <p class="entry-date">📅 ${dateStr}</p>
              <p class="entry-time">🕐 ${timeStr}</p>
              <p class="entry-mood">${moodEmojis[entry.mood] || '😌'} ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</p>
            </div>
            <p class="entry-text">${escapeHtml(entry.content)}</p>
            <button class="btn-delete" onclick="deleteEntry('${entry.id}')">Delete Entry</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<p style="color: #E74C3C; text-align: center;">⚠️ Error loading entries. Please refresh the page.</p>';
    console.error('Error:', err);
  }
}

// Delete Journal Entry from Local Storage
function deleteEntry(id) {
  if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
    return;
  }

  try {
    // Get existing entries from local storage
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    // Filter out the entry with matching ID
    entries = entries.filter(entry => entry.id !== id);
    
    // Save updated entries back to local storage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Reload entries display
    loadEntries();
  } catch (err) {
    alert('Error deleting entry. Please try again.');
    console.error('Error:', err);
  }
}

// Clear Input
function clearInput() {
  const input = document.getElementById('journal-input');
  const message = document.getElementById('save-message');
  input.value = '';
  message.innerText = '';
  input.focus();
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Load entries on page load
window.addEventListener('DOMContentLoaded', function() {
  // Set initial mood selection
  document.querySelector('[data-mood="calm"]').classList.add('selected');
  document.getElementById('selected-mood').textContent = 'Current mood: 😌 Calm';
  
  // Load entries
  loadEntries();
});
