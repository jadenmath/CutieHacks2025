import React, { useState } from "react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";

const Journal: React.FC = () => {
  const [journalText, setJournalText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  const handleGetPrompt = () => {
    const prompts = [
      "What are three things that brought you joy today?",
      "Describe a challenge you faced and how you handled it.",
      "What are you grateful for right now?",
      "If you could change one thing about today, what would it be?",
      "What's one small thing you can do tomorrow to take care of yourself?",
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setAiPrompt(`✨ AI Prompt: ${randomPrompt}`);
  };

  const handleSummarize = () => {
    if (!journalText.trim()) {
      setAiSummary("📝 Write something first, and AI will help summarize your thoughts!");
      return;
    }
    setAiSummary(
      "🤖 AI Summary: Your entry reflects a mix of emotions and experiences. Remember to be kind to yourself. (This is a placeholder - real AI will provide personalized insights!)"
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800 mb-2">
              Quiet Corner
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Write whatever's on your mind. Later, AI can help with prompts and summaries.
            </p>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Start writing your thoughts here..."
              className="w-full min-h-[180px] rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition"
            />
          </div>

          {/* Button Row */}
          <div className="flex flex-wrap gap-3">
            <PrimaryButton onClick={handleGetPrompt} className="flex-1 min-w-[150px]">
              Get AI prompt
            </PrimaryButton>
            <PrimaryButton onClick={handleSummarize} className="flex-1 min-w-[150px]">
              Summarize with AI
            </PrimaryButton>
          </div>

          {/* AI Responses */}
          {aiPrompt && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
              <p className="text-sm text-slate-700">{aiPrompt}</p>
            </div>
          )}
          {aiSummary && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <p className="text-sm text-slate-700">{aiSummary}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Journal;
