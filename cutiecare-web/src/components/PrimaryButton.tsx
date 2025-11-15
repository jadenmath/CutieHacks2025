import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-pink-500 shadow-[0_12px_30px_rgba(236,72,153,0.45)] transition-all duration-200 hover:bg-pink-600 hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_6px_14px_rgba(190,24,93,0.4)] ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
