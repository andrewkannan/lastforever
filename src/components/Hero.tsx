"use client";

import { motion } from "framer-motion";
import { heroConfig } from "@/data/memories";
import { useState, useRef } from "react";

export default function Hero({ onBegin }: { onBegin: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleBegin = () => {
    try {
      if (!isPlaying && audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch((e) => console.log("Audio playback failed or missing source", e));
        }
      }
    } catch (e) {
      console.log("Caught audio play error:", e);
    }
    
    setIsFlipping(true);
    
    setTimeout(() => {
      onBegin();
    }, 1500); 
  };

  const namesParts = heroConfig.names.split('&').map(n => n.trim());
  const monogram = namesParts.length === 2 
    ? `${namesParts[0][0]}&${namesParts[1][0]}` 
    : heroConfig.names.substring(0, 2).toUpperCase();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-[#333] overflow-hidden origin-left"
      style={{ transformStyle: "preserve-3d", perspective: "2000px" }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipping ? -180 : 0 }}
      transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1.000] }}
    >
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-white w-full h-full py-[5vh] md:py-[10vh]"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="flex flex-col items-center justify-center w-full gap-2 md:gap-8 -mt-8 md:-mt-12">
        {/* Vintage Tulip Head in the Center */}
        <motion.div 
          className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] flex items-center justify-center shrink-0 pointer-events-none"
        >
          <motion.img 
            src="/tulip-head.png" 
            alt="Vintage Tulip Head" 
            className="w-full h-full object-contain mix-blend-multiply opacity-90"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          {/* Monogram Overlay perfectly centered on the flower */}
          <motion.div 
            className="absolute text-[#fbfaf6] font-serif text-6xl md:text-8xl z-20 mt-4"
            style={{ textShadow: "0px 2px 10px rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            {monogram}
          </motion.div>
        </motion.div>

        {/* Typography Section */}
        <div className="relative z-20 flex flex-col items-center w-full px-6 text-center">
          <motion.div
            className="flex flex-col items-center gap-6 md:gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.8 }}
          >
            <p 
              className="font-sans text-[#a58d55] text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase font-semibold"
            >
              The Love Story Of
            </p>

            <h1 
              className="font-serif text-[#3a3a3a] text-[1.3rem] sm:text-2xl md:text-4xl tracking-[0.15em] sm:tracking-[0.3em] uppercase font-bold whitespace-nowrap w-full text-center"
            >
              {heroConfig.names}
            </h1>

            <p 
              className="font-sans text-[#a58d55] text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase font-semibold"
            >
              Written in Heaven
            </p>

            {/* Wax Seal Button */}
            <motion.button
              onClick={handleBegin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-28 h-28 flex items-center justify-center group mt-4 md:mt-8"
            >
              {/* Wax seal body */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#9c2727] to-[#631414] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.2),inset_0_-3px_6px_rgba(0,0,0,0.3),inset_0_3px_6px_rgba(255,255,255,0.2)] flex items-center justify-center transition-all duration-300 border-[1px] border-[#570f0f]">
                {/* Inner rim */}
                <div className="absolute inset-2 border-[1px] border-[#b03a3a] rounded-full opacity-50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" />
                
                {/* Embossed Flower Icon */}
                <img 
                  src="/tulip-head.png" 
                  className="w-[85%] h-[85%] object-contain opacity-40 mix-blend-multiply pointer-events-none" 
                  alt="tulip seal" 
                />
              </div>

              {/* Circular Text around the seal */}
              <svg className="absolute inset-[-30px] w-[calc(100%+60px)] h-[calc(100%+60px)] origin-center animate-[spin_20s_linear_infinite] pointer-events-none" viewBox="0 0 120 120">
                <path id="curve" d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" fill="transparent" />
                <text className="font-sans text-[8.5px] font-bold uppercase fill-[#a58d55]">
                  <textPath href="#curve" startOffset="0%" textLength="310" lengthAdjust="spacing">
                    ENTER THE LOVE WORLD • ENTER THE LOVE WORLD • 
                  </textPath>
                </text>
              </svg>
            </motion.button>
          </motion.div>
        </div>

        </div>
        {/* Hidden Audio Element */}
        <audio ref={audioRef} src="/piano.mp3" loop />
      </div>

      {/* Back Face (when flipping away) */}
      <div 
        className="absolute inset-0 bg-white rotate-y-180"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      />
    </motion.div>
  );
}
