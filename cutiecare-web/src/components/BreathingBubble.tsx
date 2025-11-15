import React, { useEffect, useRef, useState } from "react";
import { initWebGPU, runBreathingAnimation } from "../utils/breathingAnimation";

interface BreathingBubbleProps {
  onClick?: () => void;
}

const BreathingBubble: React.FC<BreathingBubbleProps> = ({ onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGPU support first
    if (!navigator.gpu) {
      console.warn("WebGPU not supported, using CSS fallback");
      setIsWebGPUSupported(false);
      return;
    }

    // Timeout to fallback if WebGPU takes too long
    const fallbackTimeout = setTimeout(() => {
      console.warn("WebGPU initialization timeout, using CSS fallback");
      setIsWebGPUSupported(false);
    }, 3000);

    // Set canvas size
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.45, window.innerHeight * 0.5, 500);
      canvas.width = size * window.devicePixelRatio;
      canvas.height = size * window.devicePixelRatio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Initialize WebGPU
    initWebGPU(canvas)
      .then((cleanup: () => void) => {
        clearTimeout(fallbackTimeout);
        if (cleanup) {
          cleanupRef.current = cleanup;
          runBreathingAnimation(canvas, cleanup);
          setIsWebGPUSupported(true);
          console.log("WebGPU animation started successfully");
        }
      })
      .catch((error: Error) => {
        clearTimeout(fallbackTimeout);
        console.error("WebGPU initialization failed:", error);
        setIsWebGPUSupported(false);
      });

    return () => {
      clearTimeout(fallbackTimeout);
      window.removeEventListener("resize", updateSize);
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  // CSS Fallback (if WebGPU is not supported or still loading)
  if (isWebGPUSupported === false || isWebGPUSupported === null) {
    return (
      <div
        className="relative flex items-center justify-center cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`
            relative w-80 h-80 md:w-96 md:h-96 rounded-full
            flex items-center justify-center
            transition-all duration-300
            ${isHovered ? "scale-105" : "scale-100"}
          `}
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.1) 50%, transparent 70%)",
            border: "4px solid rgb(124, 58, 237)",
            boxShadow: "0 25px 60px rgba(147, 51, 234, 0.35)",
            animation: "breathe 12s ease-in-out infinite",
          }}
        >
          {/* Aura effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at center, transparent 60%, rgba(249, 115, 22, 0.4) 70%, transparent 80%)",
              animation: "auraGlow 12s ease-in-out infinite",
            }}
          />
          
          <span className="relative z-10 text-2xl md:text-3xl font-bold text-orange-500 drop-shadow-lg">
            Get Started
          </span>
        </div>
        <style>{`
          @keyframes breathe {
            0%, 100% { 
              transform: scale(0.92);
            }
            25% { 
              transform: scale(1.0);
            }
            50% { 
              transform: scale(1.06);
            }
            75% { 
              transform: scale(1.0);
            }
          }
          
          @keyframes auraGlow {
            0%, 100% { 
              opacity: 0.4;
              transform: scale(0.95);
            }
            25% { 
              opacity: 0.6;
              transform: scale(1.0);
            }
            50% { 
              opacity: 0.8;
              transform: scale(1.08);
            }
            75% { 
              opacity: 0.6;
              transform: scale(1.0);
            }
          }
        `}</style>
      </div>
    );
  }

  // WebGPU canvas
  return (
    <div
      className="relative flex items-center justify-center cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className={`transition-transform duration-300 ${
          isHovered ? "scale-105" : "scale-100"
        }`}
        style={{
          filter: "drop-shadow(0 25px 60px rgba(147, 51, 234, 0.35))",
          display: "block",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-2xl md:text-3xl font-bold text-orange-500 drop-shadow-lg z-10">
          Get Started
        </span>
      </div>
    </div>
  );
};

export default BreathingBubble;
