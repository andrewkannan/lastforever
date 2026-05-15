"use client";

import { motion } from "framer-motion";
import { heroConfig } from "@/data/memories";
import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Hero({ onBegin }: { onBegin: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlaying(true)).catch(() => console.log("Audio playback failed or missing source"));
        }
      }
    }
  };

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
    
    // Trigger the flip animation
    setIsFlipping(true);
    
    // Wait for the flip animation to finish before unmounting
    setTimeout(() => {
      onBegin();
    }, 1500); // 1.5 seconds duration matches the transition below
  };

  // Extract initials for the monogram
  const namesParts = heroConfig.names.split('&').map(n => n.trim());
  const monogram = namesParts.length === 2 
    ? `${namesParts[0][0]}&${namesParts[1][0]}` 
    : heroConfig.names.substring(0, 2).toUpperCase();

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white text-[#333] overflow-hidden origin-left"
      style={{ transformStyle: "preserve-3d", perspective: "2000px" }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipping ? -180 : 0 }}
      transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1.000] }}
    >
      {/* Front Face of the Cover Page */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-white"
        style={{ backfaceVisibility: "hidden" }}
      >

        {/* Vintage Tulip Image filling the page */}
        <div className="absolute inset-0 w-full h-full">
          <motion.img 
            src="/hero-tulips.png" 
            alt="Vintage Tulips" 
            className="w-full h-full object-cover object-center drop-shadow-sm z-0 mix-blend-multiply opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>

        {/* Text overlay over the flower */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-6 text-center">
          
          {/* Monogram Overlay */}
          <motion.div 
            className="text-[#fbfaf6] font-serif text-5xl md:text-7xl mb-16"
            style={{ textShadow: "0px 2px 10px rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            {monogram}
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.8 }}
          >
            <p 
              className="font-sans text-[#a58d55] text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase mb-8 md:mb-10 font-semibold"
              style={{ textShadow: "0px 0px 8px rgba(255,255,255,0.9)" }}
            >
              The Love Story Of
            </p>

            <h1 
              className="font-serif text-[#3a3a3a] text-2xl md:text-4xl tracking-[0.3em] md:tracking-[0.4em] uppercase mb-8 md:mb-10 leading-relaxed font-bold"
              style={{ textShadow: "0px 0px 12px rgba(255,255,255,1)" }}
            >
              {heroConfig.names}
            </h1>

            <p 
              className="font-sans text-[#a58d55] text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase mb-12 font-semibold"
              style={{ textShadow: "0px 0px 8px rgba(255,255,255,0.9)" }}
            >
              Written in Heaven
            </p>

            <motion.button
              onClick={handleBegin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-10 py-4 bg-white/70 backdrop-blur-sm border border-[#a58d55] text-[#a58d55] hover:bg-[#a58d55] hover:text-white font-sans text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-sm"
            >
              Open Book
            </motion.button>
          </motion.div>
        </div>



        {/* Hidden Audio Element - Add src="path/to/music.mp3" later */}
        <audio ref={audioRef} src="/piano.mp3" loop />
      </div>

      {/* Back Face (when flipping away) */}
      <div 
        className="absolute inset-0 bg-[#e8dfcf] rotate-y-180"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <div className="absolute inset-0 bg-noise opacity-50" />
      </div>
    </motion.div>
  );
}
