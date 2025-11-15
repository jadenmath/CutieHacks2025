import React from "react";
import Card from "../components/Card";
import type { MoodEntry } from "../types";

interface DashboardProps {
  moodHistory: MoodEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ moodHistory }) => {
  // Calculate statistics
  const totalCheckIns = moodHistory.length;

  const getMostFrequentMood = () => {
    if (totalCheckIns === 0) return null;

    const moodCounts: Record<string, number> = {};
    moodHistory.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    let maxCount = 0;
    let mostFrequent = "";
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = mood;
      }
    });

    return mostFrequent;
  };

  const mostFrequentMood = getMostFrequentMood();

  // Get color for mood pill
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Happy":
        return "bg-green-100 text-green-700 border-green-300";
      case "Excited":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Tired":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Stressed":
        return "bg-red-100 text-red-700 border-red-300";
      case "Anxious":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Meh":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  // Format date/time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get last 7 entries
  const recentEntries = [...moodHistory].reverse().slice(0, 7);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Card */}
      <Card title="Mood History">
        {totalCheckIns === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-slate-600">
              Cutie is waiting for your first check-in 💕
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              <div className="bg-pink-50 rounded-2xl px-4 py-3">
                <p className="text-sm text-slate-600">Total check-ins</p>
                <p className="text-2xl font-semibold text-slate-800">{totalCheckIns}</p>
              </div>
              {mostFrequentMood && (
                <div className="bg-pink-50 rounded-2xl px-4 py-3">
                  <p className="text-sm text-slate-600">Most frequent mood</p>
                  <p className="text-2xl font-semibold text-slate-800">{mostFrequentMood}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Recent Entries Card */}
      {totalCheckIns > 0 && (
        <Card title="Recent Check-ins">
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-3 py-3 border-b border-slate-100 last:border-none"
              >
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getMoodColor(
                      entry.mood
                    )}`}
                  >
                    {entry.mood}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-slate-800 font-medium">
                    {formatDateTime(entry.timestamp)}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-slate-500 mt-1">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
