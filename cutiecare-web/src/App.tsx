import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import CheckIn from "./sections/CheckIn";
import Dashboard from "./sections/Dashboard";
import Actions from "./sections/Actions";
import Companion from "./sections/Companion";
import Journal from "./sections/Journal";
import type { Section, Mood, MoodEntry } from "./types";

function App() {
  const [activeSection, setActiveSection] = useState<Section>("landing");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  const handleCheckIn = (mood: Mood, note?: string) => {
    const newEntry: MoodEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mood,
      note,
      timestamp: new Date().toISOString(),
    };
    setMoodHistory([...moodHistory, newEntry]);
  };

  const handleGetStarted = () => {
    setActiveSection("checkin");
  };

  // Landing page - no navbar
  if (activeSection === "landing") {
    return <Home onGetStarted={handleGetStarted} />;
  }

  // Main app with navbar
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-sky-50 to-violet-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="space-y-6 md:space-y-8">
          {activeSection === "checkin" && <CheckIn onCheckIn={handleCheckIn} />}
          {activeSection === "dashboard" && <Dashboard moodHistory={moodHistory} />}
          {activeSection === "actions" && <Actions />}
          {activeSection === "companion" && <Companion moodHistory={moodHistory} />}
          {activeSection === "journal" && <Journal />}
        </main>
      </div>
    </div>
  );
}

export default App;
