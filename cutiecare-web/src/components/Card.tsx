import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "", title, description }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.12)] p-5 md:p-6 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
            {title}
          </h2>
          {description && (
            <p className="text-sm md:text-base text-slate-600 mt-2">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
