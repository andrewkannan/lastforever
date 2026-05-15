"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Memory } from "@/data/memories";
import { Play, Pause } from "lucide-react";
import { updateMemoryPosition } from "@/actions/memoryActions";

interface CassetteTapeProps {
  memory: Memory;
  onClick?: (memory: Memory) => void;
}

export default function CassetteTape({ memory, onClick }: CassetteTapeProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | null>(null);

  // Particle System
  const [particles, setParticles] = useState<{ id: number, delay: number, duration: number, angle: number }[]>([]);

  useEffect(() => {
    // Generate 12 heart bubble particles
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      angle: Math.PI + (Math.random() * Math.PI), // Fly upwards
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (memory.imageUrl) {
      audioRef.current = new Audio(memory.imageUrl);
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
        if (animationRef.current) clearInterval(animationRef.current);
      };
    }
  }, [memory.imageUrl]);

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (animationRef.current) clearInterval(animationRef.current);
    // Reset bars to 20%
    barsRef.current.forEach(bar => {
      if (bar) bar.style.height = '20%';
    });
  };

  const fakeWaveform = () => {
    barsRef.current.forEach(bar => {
      if (bar) {
        bar.style.height = `${20 + Math.random() * 80}%`;
      }
    });
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) clearInterval(animationRef.current);
      barsRef.current.forEach(bar => {
        if (bar) bar.style.height = '20%';
      });
    } else {
      audioRef.current.play().catch(e => console.log("Cassette Audio failed:", e));
      animationRef.current = window.setInterval(fakeWaveform, 150);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, touchAction: "none" }}
      onDragEnd={async () => {
        await updateMemoryPosition(memory.id, x.get(), y.get());
      }}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      whileTap={{ scale: 0.95, zIndex: 100 }}
      initial={{ 
        rotate: memory.rotation,
        opacity: 0,
        scale: 0.8
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20
      }}
      onClick={onClick ? () => onClick(memory) : undefined}
      className="absolute flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:z-50 group w-[320px] h-[220px]"
    >
      {/* Particle Effects (Heart Bubbles) */}
      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-visible flex items-center justify-center">
        {isPlaying && particles.map((p) => {
          const distance = 80 + Math.random() * 120;
          return (
            <motion.img
              key={p.id}
              src="/heart-bubble.png"
              className="absolute w-10 h-10 object-contain drop-shadow-md mix-blend-multiply"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                x: [0, Math.cos(p.angle) * distance],
                y: [0, Math.sin(p.angle) * distance],
                opacity: [0, 0.9, 0],
                scale: [0.3, 1.2, 0.5],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>

      {/* Cassette Shell - Premium Transparent Glassmorphism Aesthetic */}
      <div className="w-[300px] bg-white/40 backdrop-blur-xl border-4 border-white/80 outline outline-2 outline-rose-300/30 rounded-xl p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex flex-col items-center relative overflow-hidden">
        
        {/* Screw Details */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 shadow-inner" /></div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 shadow-inner" /></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 shadow-inner" /></div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 shadow-inner" /></div>

        {/* Cassette Sticker/Label */}
        <div className="w-[85%] bg-gradient-to-b from-[#ffeed3] to-[#ffe0b2] rounded-md px-4 py-3 flex flex-col items-center shadow-md relative z-10 border-t-[12px] border-rose-soft border-b-[6px] border-amber-500/50">
          <p className="font-hand text-2xl text-ink font-bold leading-tight mb-3 text-center truncate w-full">
            {memory.caption || "Voice Note"}
          </p>

          {/* Tape Reels Center Area */}
          <div className="flex items-center justify-between w-[90%] px-3 mt-1 mb-2 bg-[#d1c4a9] py-2 rounded-full shadow-[inset_0_3px_8px_rgba(0,0,0,0.3)] border border-white/50 relative">
            
            {/* Magnetic Tape Spool Line (Visual) */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20 -translate-y-1/2 z-0" />

            {/* Left Reel */}
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-white border-2 border-gray-400 flex items-center justify-center relative overflow-hidden shadow-lg z-10"
            >
              <div className="w-4 h-4 rounded-full bg-gray-300 shadow-inner z-20 flex items-center justify-center border border-gray-400"><div className="w-1 h-1 bg-gray-600 rounded-full" /></div>
              {/* Spokes */}
              <div className="absolute w-full h-[3px] bg-gray-400/80 rotate-0 z-10" />
              <div className="absolute w-full h-[3px] bg-gray-400/80 rotate-60 z-10" />
              <div className="absolute w-full h-[3px] bg-gray-400/80 rotate-120 z-10" />
              {/* Tape wound on reel */}
              <div className="absolute inset-1 rounded-full border-[3px] border-[#222]" />
            </motion.div>

            {/* Viewport & Waveform */}
            <div className="w-16 h-8 bg-[#111] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-end justify-center px-1 border border-gray-500 z-10">
              <div className="flex items-end gap-[3px] h-full pb-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    ref={(el) => { barsRef.current[i] = el; }}
                    className="w-1.5 bg-gradient-to-t from-rose-600 to-rose-300 rounded-t-sm shadow-[0_0_5px_rgba(255,100,100,0.5)]"
                    style={{ height: '20%', transition: 'height 50ms ease-out' }}
                  />
                ))}
              </div>
            </div>

            {/* Right Reel */}
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-white border-2 border-gray-400 flex items-center justify-center relative overflow-hidden shadow-lg z-10"
            >
              <div className="w-4 h-4 rounded-full bg-gray-300 shadow-inner z-20 flex items-center justify-center border border-gray-400"><div className="w-1 h-1 bg-gray-600 rounded-full" /></div>
              {/* Spokes */}
              <div className="absolute w-full h-[3px] bg-gray-400/80 rotate-0 z-10" />
              <div className="absolute w-full h-[3px] bg-gray-400/80 rotate-60 z-10" />
              <div className="absolute w-full h-[3px] bg-gray-400/80 rotate-120 z-10" />
              {/* Tape wound on reel */}
              <div className="absolute inset-2 rounded-full border-2 border-[#222]" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Trapezoid Guard */}
        <div className="w-[70%] h-8 bg-gradient-to-b from-[#444] to-[#222] rounded-b-xl border-t-4 border-gray-700 mt-1 flex justify-between px-6 items-center shadow-inner relative z-10">
           <div className="w-4 h-4 rounded-full bg-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />
           <div className="w-4 h-4 rounded-full bg-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />
        </div>
      </div>

      {/* Floating Controls below the tape */}
      <div className="mt-4 flex w-full max-w-[280px] items-center justify-between px-2 bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/50">
        <button 
          onClick={togglePlay}
          className="bg-gradient-to-tr from-rose-600 to-rose-400 text-white p-3 rounded-full shadow-[0_4px_10px_rgba(225,29,72,0.3)] hover:scale-110 transition-transform active:scale-95 flex items-center justify-center z-20"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        {/* Playback Progress Bar */}
        <div className="flex-1 ml-4 h-3 bg-ink/10 rounded-full overflow-hidden shadow-inner border border-ink/5">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
