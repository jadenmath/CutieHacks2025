import React from "react";
import BreathingBubble from "../components/BreathingBubble";

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-pink-50 to-purple-50 text-slate-800 -m-6 md:-m-8">
      {/* Title */}
      <h1 
        className="text-5xl md:text-6xl lg:text-7xl font-bold text-purple-600 tracking-tight mb-12 md:mb-16"
        style={{
          fontFamily: "'Brush Script MT', cursive, sans-serif",
          textShadow: "0 4px 12px rgba(147, 51, 234, 0.25)",
          letterSpacing: "0.02em",
        }}
      >
        CutieCare
      </h1>

      {/* Breathing Bubble */}
      <div className="mb-8">
        <BreathingBubble onClick={onGetStarted} />
      </div>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-slate-500 text-center max-w-md px-4">
        Tap the circle and breathe with Cutie.
      </p>
    </div>
  );
};

export default Home;
