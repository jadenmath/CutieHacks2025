import React from "react";
import Card from "../components/Card";
import type { MoodEntry } from "../types";

interface CompanionProps {
  moodHistory: MoodEntry[];
}

const Companion: React.FC<CompanionProps> = ({ moodHistory }) => {
  // Get the latest mood entry
  const latestEntry = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null;

  // Static suggestions based on mood
  const getSuggestion = (mood: string) => {
    switch (mood) {
      case "Happy":
        return "Cutie loves seeing you happy! Keep spreading that positive energy. 🌟";
      case "Excited":
        return "Your excitement is contagious! Cutie can't wait to see what you accomplish today. ✨";
      case "Tired":
        return "Cutie thinks you deserve some rest. Remember to take breaks and be gentle with yourself. 💤";
      case "Stressed":
        return "Today feels overwhelming, but Cutie believes in you. Take things one step at a time. 🌸";
      case "Anxious":
        return "Cutie is here with you. Try some deep breaths, and remember that you're not alone. 💕";
      case "Meh":
        return "Not every day needs to be amazing. Cutie appreciates you showing up anyway. 🌈";
      default:
        return "Cutie is here to support you, no matter how you're feeling. 💖";
    }
  };

  // Fake companion stats
  const companionStats = [
    { label: "Energy", value: 85, color: "bg-yellow-400" },
    { label: "Calm", value: 72, color: "bg-blue-400" },
    { label: "Hope", value: 94, color: "bg-pink-400" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Main Companion Card */}
      <Card>
        <div className="space-y-4">
          {/* Companion Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-5xl text-white shadow-xl mx-auto">
            🩷
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
              Your Cutie Companion
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Cutie watches over your check-ins and cheers you on through every moment.
            </p>
          </div>

          {/* Today's Vibe */}
          <div className="bg-pink-50 rounded-2xl p-4 space-y-2">
            <h3 className="text-lg font-semibold text-slate-800">
              {latestEntry ? "Today's Vibe" : "Getting to Know You"}
            </h3>
            {latestEntry ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-700">
                  Today you're feeling{" "}
                  <span className="font-semibold text-pink-600">{latestEntry.mood}</span>.
                </p>
                <p className="text-sm text-slate-600">{getSuggestion(latestEntry.mood)}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                Let's start by checking in on Home. Cutie can't wait to meet you! 💕
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Companion Profile Card */}
      <Card title="Companion Profile" description="Cutie's current state">
        <div className="space-y-4">
          {companionStats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                <span className="text-sm font-semibold text-slate-800">{stat.value}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Companion;
