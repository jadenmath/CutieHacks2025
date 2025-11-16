# Serenus Journal System Setup

## Structure

```
Serenus/
├── index.html                 # Home page (mood dial, breathing)
├── journal.html              # Journal page (write & view entries)
├── breathe.html              # Breathing exercise page
├── script.js                 # Home page functionality
├── journal.js                # Journal page functionality
├── journal-style.css         # Journal page styling
├── style.css                 # Global styling
├── breathe.js, breathe.css   # Breathing functionality
├── assets/                   # Images and audio files
└── journal/backend/          # Backend server
    ├── server.js             # Express server
    ├── JournalEntry.js       # MongoDB schema
    └── package.json          # Dependencies
```

## Installation & Running

### 1. Install Backend Dependencies
```bash
cd journal/backend
npm install
```

### 2. Make sure MongoDB is running
```bash
# On macOS with Homebrew:
brew services start mongodb-community

# Or start MongoDB manually:
mongod
```

### 3. Start the Backend Server
```bash
cd journal/backend
npm start
# Server will run on port 5000
```

### 4. Start the Frontend Web Server
In another terminal:
```bash
cd Serenus
python3 -m http.server 8000
```

### 5. Access the Application
- **Home**: http://localhost:8000
- **Journal**: http://localhost:8000/journal.html
- **Breathe**: http://localhost:8000/breathe.html

## Features

### Journal Page
- ✍️ **Write Entries**: Beautiful textarea for journaling
- 📅 **Dated Entries**: All entries automatically timestamped
- 📜 **Timeline View**: View all past entries in reverse chronological order
- 🗑️ **Delete Entries**: Remove entries with confirmation
- 🎨 **Serenus Theme**: Consistent design with sakura video background

### Backend API Endpoints
- `POST /api/journal` - Save a new entry
- `GET /api/journal` - Retrieve all entries
- `DELETE /api/journal/:id` - Delete an entry

## Features Implemented

✨ Navigation between Home, Journal, and Breathe pages
✨ Persistent storage using MongoDB
✨ Beautiful timeline visualization
✨ Responsive design for mobile and desktop
✨ HTML escaping for security
✨ Input validation
✨ Smooth animations
✨ Same Serenus aesthetic throughout

## Troubleshooting

**"Error loading entries" message?**
- Make sure MongoDB is running
- Verify backend server is running on port 5000
- Check browser console for detailed error messages

**Backend not starting?**
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check if port 5000 is already in use: `lsof -i :5000`

**Frontend not showing?**
- Make sure web server is running on port 8000
- Check if port 8000 is in use: `lsof -i :8000`
