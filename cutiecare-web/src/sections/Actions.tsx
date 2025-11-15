import React, { useState } from "react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

const Actions: React.FC = () => {
  const [breathingMessage, setBreathingMessage] = useState("");
  const [groundingMessage, setGroundingMessage] = useState("");
  const [timerMessage, setTimerMessage] = useState("");

  const actions = [
    {
      id: "breathing",
      icon: "🌬️",
      title: "Breathing Exercise",
      description: "Calm your mind with guided breathing techniques",
      buttonText: "Open breathing exercise",
      message: breathingMessage,
      setMessage: setBreathingMessage,
      placeholder: "This will someday be an animated breathing coach with visual cues and calming sounds.",
    },
    {
      id: "grounding",
      icon: "🧘",
      title: "Grounding Exercise",
      description: "Ground yourself with the 5-4-3-2-1 technique",
      buttonText: "Start grounding",
      message: groundingMessage,
      setMessage: setGroundingMessage,
      placeholder: "This will guide you through the 5-4-3-2-1 sensory awareness exercise.",
    },
    {
      id: "timer",
      icon: "⏱️",
      title: "Study Timer",
      description: "Focus with Pomodoro-style study sessions",
      buttonText: "Start timer",
      message: timerMessage,
      setMessage: setTimerMessage,
      placeholder: "This will be a customizable Pomodoro timer with break reminders.",
    },
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    action.setMessage(action.placeholder);
    setTimeout(() => {
      action.setMessage("");
    }, 5000);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Intro Card */}
      <Card>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800 mb-2">
          Wellness Actions
        </h2>
        <p className="text-sm md:text-base text-slate-600">
          Choose from these gentle exercises and tools to support your wellbeing throughout the day.
        </p>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Card
            key={action.id}
            className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition-transform transition-shadow"
          >
            <div className="space-y-4">
              <div className="text-4xl">{action.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
              <PrimaryButton
                onClick={() => handleActionClick(action)}
                className="w-full"
              >
                {action.buttonText}
              </PrimaryButton>
              {action.message && (
                <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  {action.message}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Actions;
