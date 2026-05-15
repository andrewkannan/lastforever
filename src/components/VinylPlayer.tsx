"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music, SkipForward, SkipBack } from "lucide-react";

interface Song {
  id: string;
  title: string;
  src: string;
}

interface VinylPlayerProps {
  position?: { x: number; y: number };
  songs?: Song[];
}

export default function VinylPlayer({ position = { x: 100, y: 100 }, songs = [] }: VinylPlayerProps) {
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];
  const currentSongSrc = currentSong?.src;

  useEffect(() => {
    if (audioRef.current && currentSongSrc) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio play failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongSrc]);

  const handleEnded = () => {
    handleNext();
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (songs.length === 0) return;
    setIsPlaying(!isPlaying);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (songs.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (songs.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, touchAction: "none" }}
      whileHover={{ scale: 1.02, zIndex: 100 }}
      whileTap={{ scale: 0.98, zIndex: 100 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute bg-[#f4eade] p-5 rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] border-2 border-[#d4c5b3] cursor-grab active:cursor-grabbing hover:z-50 flex flex-col gap-4 w-[340px]"
    >
      <audio 
        ref={audioRef} 
        src={currentSongSrc} 
        onEnded={handleEnded} 
        preload="auto" 
      />
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif text-xl text-ink font-bold flex items-center gap-2 tracking-wide">
          <Music size={20} className="text-rose-soft" /> Our Soundtrack
        </h3>
        {songs.length > 0 && (
          <span className="text-xs font-sans text-ink-light font-bold bg-white/50 px-2 py-1 rounded-full border border-ink/10">
            {currentIndex + 1} / {songs.length}
          </span>
        )}
      </div>

      <div className="relative w-full h-[260px] bg-gradient-to-br from-[#4a4036] to-[#2a241e] rounded-xl shadow-inner overflow-hidden flex items-center justify-center border-4 border-[#1a1612]">
        
        {/* Wood texture inside */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none mix-blend-overlay" />

        {/* Turntable Platter Base */}
        <div className="absolute w-[220px] h-[220px] rounded-full bg-gradient-to-br from-[#222] to-[#0a0a0a] shadow-[0_10px_20px_rgba(0,0,0,0.6)] border-2 border-[#333]" />

        {/* Vinyl Record */}
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-[210px] h-[210px] rounded-full bg-black shadow-2xl flex items-center justify-center border-4 border-[#151515]"
        >
          {/* Grooves */}
          <div className="absolute w-[190px] h-[190px] rounded-full border border-white/10" />
          <div className="absolute w-[160px] h-[160px] rounded-full border border-white/5" />
          <div className="absolute w-[130px] h-[130px] rounded-full border border-white/10" />
          <div className="absolute w-[100px] h-[100px] rounded-full border border-white/5" />
          
          {/* Center Label */}
          <div className="absolute w-[70px] h-[70px] rounded-full bg-rose-soft/90 flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] border border-white/20">
             <div className="w-3 h-3 rounded-full bg-black shadow-inner" />
             <span className="absolute text-[8px] font-sans font-bold text-white uppercase top-3 tracking-widest opacity-90 drop-shadow-md">Forever</span>
          </div>
        </motion.div>

        {/* Tonearm */}
        <motion.div 
          className="absolute top-5 right-5 origin-top-right w-2.5 h-[140px] bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-2xl"
          style={{ zIndex: 10 }}
          animate={{ rotate: isPlaying ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          {/* Pivot Base */}
          <div className="absolute -top-4 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#444] to-[#111] border-2 border-gray-500 shadow-xl flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black" />
          </div>
          {/* Stylus head */}
          <div className="absolute bottom-0 -left-1.5 w-5 h-10 bg-black rounded shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-t-2 border-gray-400 flex justify-center">
            <div className="w-1 h-2 bg-gray-300 mt-8 rounded-full" />
          </div>
        </motion.div>

      </div>

      {/* Marquee Track Title */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-ink/10 shadow-inner overflow-hidden relative h-12 flex items-center">
        {songs.length > 0 ? (
          <div className="w-full whitespace-nowrap overflow-hidden relative">
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="inline-block font-sans font-bold text-ink"
            >
              ♫ {currentSong.title}
            </motion.div>
          </div>
        ) : (
          <p className="text-sm text-ink-light/80 italic text-center w-full">No tracks uploaded</p>
        )}
      </div>

      {/* Media Controls */}
      <div className="flex items-center justify-center gap-6 mt-1 bg-white/40 p-3 rounded-xl border border-white/50">
        <button 
          onClick={handlePrev}
          disabled={songs.length <= 1}
          className="text-ink hover:text-rose-soft disabled:opacity-30 disabled:hover:text-ink transition-colors"
        >
          <SkipBack size={24} fill="currentColor" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="bg-ink text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={handleNext}
          disabled={songs.length <= 1}
          className="text-ink hover:text-rose-soft disabled:opacity-30 disabled:hover:text-ink transition-colors"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>

    </motion.div>
  );
}
