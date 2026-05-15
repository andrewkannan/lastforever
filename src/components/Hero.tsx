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
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#fbfaf6] text-[#333] overflow-hidden origin-left"
      style={{ transformStyle: "preserve-3d", perspective: "2000px" }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipping ? -180 : 0 }}
      transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1.000] }}
    >
      {/* Front Face of the Cover Page */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-start bg-[#fbfaf6]"
        style={{ 
          backfaceVisibility: "hidden",
          backgroundImage: "url('/noise.png')", 
          backgroundBlendMode: "multiply", 
          opacity: 0.98 
        }}
      >
        {/* Elegant Frame Outline */}
        <div className="absolute inset-4 md:inset-8 border border-[#e8dfcf] pointer-events-none z-10" />

        {/* Vintage Tulip Image overlapping from top */}
        <div className="relative w-full max-w-[600px] h-[45vh] flex items-start justify-center mt-[-20px] md:mt-[-40px]">
          <motion.img 
            src="/hero-tulips.png" 
            alt="Vintage Tulips" 
            className="w-full h-full object-contain object-top drop-shadow-md z-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Monogram Overlay */}
          <motion.div 
            className="absolute top-[40%] md:top-[45%] text-[#fbfaf6] font-serif text-5xl md:text-7xl z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            {monogram}
          </motion.div>
        </div>

        {/* Typography Section */}
        <motion.div
          className="z-20 text-center flex flex-col items-center mt-8 md:mt-12 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.8 }}
        >
          <p className="font-sans text-[#a58d55] text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase mb-10 md:mb-16">
            The Love Story Of
          </p>

          <h1 className="font-serif text-[#3a3a3a] text-2xl md:text-4xl tracking-[0.3em] md:tracking-[0.4em] uppercase mb-10 md:mb-16 leading-relaxed">
            {heroConfig.names}
          </h1>

          <p className="font-sans text-[#a58d55] text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase mb-12">
            Written in Heaven
          </p>

          <motion.button
            onClick={handleBegin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 px-8 py-3 border border-[#a58d55] text-[#a58d55] hover:bg-[#a58d55] hover:text-white font-sans text-xs tracking-widest uppercase transition-all duration-300"
          >
            Open Book
          </motion.button>
        </motion.div>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className="absolute top-8 right-8 z-30 p-3 text-[#a58d55] hover:text-[#3a3a3a] transition-all"
        >
          {isPlaying ? <Volume2 size={24} strokeWidth={1} /> : <VolumeX size={24} strokeWidth={1} />}
        </button>

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
