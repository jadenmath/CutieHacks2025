import React from "react";
import type { Section } from "../types";

interface NavbarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const tabs: { id: Section; label: string }[] = [
    { id: "checkin", label: "Check In" },
    { id: "dashboard", label: "Dashboard" },
    { id: "actions", label: "Actions" },
    { id: "companion", label: "Companion" },
    { id: "journal", label: "Journal" },
  ];

  return (
    <div className="w-full flex justify-center mb-6 md:mb-8">
      <nav className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-lg rounded-full shadow-lg px-3 py-2 md:px-5 md:py-2.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all duration-150 ${
              activeSection === tab.id
                ? "bg-pink-500 text-white shadow-[0_8px_20px_rgba(236,72,153,0.35)]"
                : "text-slate-600 hover:bg-pink-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
