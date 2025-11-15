import React, { useState } from "react";
import Card from "../components/Card";
import MoodPill from "../components/MoodPill";
import PrimaryButton from "../components/PrimaryButton";
import type { Mood } from "../types";

interface CheckInProps {
  onCheckIn: (mood: Mood, note?: string) => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onCheckIn }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const moods: Mood[] = ["Happy", "Tired", "Stressed", "Anxious", "Excited", "Meh"];

  const handleSave = () => {
    if (!selectedMood) {
      return;
    }

    onCheckIn(selectedMood, note || undefined);
    setSuccessMessage("Cutie saved today's check-in 💖");
    setSelectedMood(null);
    setNote("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Left Column */}
      <div className="space-y-4 md:space-y-6 flex flex-col justify-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-800 mb-3">
            Check in with your Cutie companion
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            CutieCare is your gentle student wellness friend. Share your feelings, get
            supportive guidance, and watch Cutie cheer you on through your day.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="relative">
        <Card className="relative overflow-hidden">
          {/* Decorative blur circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">
              How are you feeling today?
            </h2>
            <p className="text-sm text-slate-600">
              Select a mood that best describes how you're feeling right now.
            </p>

            {/* Mood Pills */}
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <MoodPill
                  key={mood}
                  label={mood}
                  selected={selectedMood === mood}
                  onClick={() => setSelectedMood(mood)}
                />
              ))}
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Anything you want to add? (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a quick note..."
                className="w-full min-h-[80px] rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition"
              />
            </div>

            {/* Save Button */}
            <PrimaryButton onClick={handleSave} className="w-full">
              Save today's mood
            </PrimaryButton>

            {/* Success Message */}
            {successMessage && (
              <div className="text-center text-sm font-medium text-pink-600 animate-pulse">
                {successMessage}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;
