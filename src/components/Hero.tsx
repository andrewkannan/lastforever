"use client";

import { motion } from "framer-motion";
import { heroConfig } from "@/data/memories";
import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Hero({ onBegin }: { onBegin: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
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
    
    // Always trigger the transition
    onBegin();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden bg-noise"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Soft Glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[600px] h-[600px] bg-rose-soft rounded-full blur-[120px] mix-blend-multiply" />
        <div className="w-[500px] h-[500px] bg-amber-100 rounded-full blur-[100px] mix-blend-multiply -ml-40" />
      </div>

      <button
        onClick={toggleAudio}
        className="absolute top-8 right-8 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md text-ink hover:bg-white/40 transition-all"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Hidden Audio Element - Add src="path/to/music.mp3" later */}
      <audio ref={audioRef} loop />

      <motion.div
        className="z-10 text-center flex flex-col items-center"
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
          className="px-8 py-4 bg-ink text-background font-serif text-lg tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Begin Our Story
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
