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

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden bg-noise origin-left"
      style={{ transformStyle: "preserve-3d", perspective: "2000px" }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipping ? -180 : 0 }}
      transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1.000] }}
    >
      {/* Front Face of the Cover Page */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-floral-paper"
        style={{ backfaceVisibility: "hidden" }}
      >
        {/* Background Soft Glows & Clouds */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-0">
          <div className="w-[600px] h-[600px] bg-rose-soft rounded-full blur-[120px] mix-blend-multiply" />
          <div className="w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] mix-blend-multiply -ml-40" />
        </div>

        {/* Watercolor Floral Borders */}
        <img src="/wedding-cover-flowers.png" alt="Flowers Top Left" className="absolute top-0 left-0 w-64 md:w-96 object-contain pointer-events-none z-10" />
        <img src="/wedding-cover-flowers.png" alt="Flowers Bottom Right" className="absolute bottom-0 right-0 w-64 md:w-96 object-contain pointer-events-none z-10 rotate-180" />
        <img src="/wedding-cover-flowers.png" alt="Flowers Top Right" className="absolute top-0 right-0 w-48 md:w-64 object-contain pointer-events-none z-10 scale-x-[-1] opacity-70" />
        <img src="/wedding-cover-flowers.png" alt="Flowers Bottom Left" className="absolute bottom-0 left-0 w-48 md:w-64 object-contain pointer-events-none z-10 scale-y-[-1] opacity-70" />

        <button
          onClick={toggleAudio}
          className="absolute top-8 right-8 z-20 p-3 rounded-full bg-white/40 backdrop-blur-md text-ink hover:bg-white/60 transition-all border border-white/50"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        {/* Hidden Audio Element - Add src="path/to/music.mp3" later */}
        <audio ref={audioRef} loop />

        <motion.div
          className="z-20 text-center flex flex-col items-center bg-white/60 backdrop-blur-sm p-12 rounded-3xl border border-white/50 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <h1 className="font-serif text-6xl md:text-8xl tracking-tight text-ink mb-6 text-shadow-soft">
            {heroConfig.names}
          </h1>
          <p className="font-hand text-3xl md:text-4xl text-ink-light mb-12">
            {heroConfig.tagline}
          </p>

          <motion.button
            onClick={handleBegin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-ink text-[#f4eade] font-serif text-lg tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Begin Our Story
          </motion.button>
        </motion.div>
      </div>

      {/* Back Face (when flipping away) */}
      <div 
        className="absolute inset-0 bg-[#eaddcf] rotate-y-180"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <div className="absolute inset-0 bg-noise opacity-50" />
      </div>
    </motion.div>
  );
}
