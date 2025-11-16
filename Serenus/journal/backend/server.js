const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const JournalEntry = require("./JournalEntry");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mental_health_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// Save journal entry
app.post("/api/journal", async (req, res) => {
  try {
    const { content } = req.body;
    
    // Validate input
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: "Content is required" });
    }
    
    const entry = new JournalEntry({
      content: content.trim()
    });
    await entry.save();
    res.json({ message: "Journal saved!", entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all journal entries
app.get("/api/journal", async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a journal entry
app.delete("/api/journal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid entry ID" });
    }
    
    const entry = await JournalEntry.findByIdAndDelete(id);
    
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    
    res.json({ message: "Entry deleted", entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
