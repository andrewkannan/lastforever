"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Memory } from "@/data/memories";
import { Play, Pause } from "lucide-react";
import { updateMemoryPosition } from "@/actions/memoryActions";

interface CassetteTapeProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

export default function CassetteTape({ memory, onClick }: CassetteTapeProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Audio API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (memory.imageUrl) {
      audioRef.current = new Audio(memory.imageUrl);
      
      const updateProgress = () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        // Reset bars to 20%
        barsRef.current.forEach(bar => {
          if (bar) bar.style.height = '20%';
        });
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      };
    }
  }, [memory.imageUrl]);

  const initAudioNodes = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; // Small size for just a few bins
      
      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
  };

  const updateWaveform = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // We have 6 bars, divide the frequency bins into 6 chunks
    const step = Math.max(1, Math.floor(dataArray.length / 6));
    
    for (let i = 0; i < 6; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += dataArray[i * step + j] || 0;
      }
      const avg = sum / step;
      // Map 0-255 to 20%-100% height
      const percentage = 20 + (avg / 255) * 80;
      
      if (barsRef.current[i]) {
        barsRef.current[i]!.style.height = `${percentage}%`;
      }
    }
    
    animationRef.current = requestAnimationFrame(updateWaveform);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      barsRef.current.forEach(bar => {
        if (bar) bar.style.height = '20%';
      });
    } else {
      initAudioNodes();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play().then(() => {
        updateWaveform();
      }).catch(err => console.log("Audio playback failed:", err));
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
      onClick={() => onClick(memory)}
      className="absolute p-4 pb-6 bg-white/80 backdrop-blur-md rounded-lg cursor-grab active:cursor-grabbing hover:z-50 transition-shadow duration-300 w-[280px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] group border border-white/40 flex flex-col items-center"
    >
      {/* Cassette Shape details */}
      <div className="w-full bg-[#3a3a3a] rounded-sm p-3 relative shadow-inner overflow-hidden flex flex-col items-center">
        {/* Top Screw Holes */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black/40 shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black/40 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-black/40 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-black/40 shadow-inner" />

        {/* Cassette Label */}
        <div className="w-[85%] bg-yellow-100/90 rounded px-4 py-2 flex flex-col items-center shadow-sm relative z-10 border-t-8 border-orange-300">
          <p className="font-hand text-xl text-ink leading-tight mb-2 text-center truncate w-full">
            {memory.caption || "Voice Note"}
          </p>

          {/* Tape reels area */}
          <div className="flex items-center justify-between w-full px-2 mt-1 mb-2 bg-[#e0d6c0] py-2 rounded-full shadow-inner border border-black/10">
            {/* Left Reel */}
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center relative overflow-hidden shadow-inner"
            >
              <div className="w-4 h-4 rounded-full bg-gray-200 shadow-inner z-10" />
              {/* Spokes */}
              <div className="absolute w-full h-[2px] bg-gray-300 rotate-0" />
              <div className="absolute w-full h-[2px] bg-gray-300 rotate-60" />
              <div className="absolute w-full h-[2px] bg-gray-300 rotate-120" />
            </motion.div>

            {/* Viewport for tape */}
            <div className="w-12 h-6 bg-black/80 rounded-sm relative overflow-hidden flex items-end justify-center px-1">
              {/* Waveform Animation */}
              <div className="flex items-end gap-[2px] h-full pb-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    ref={(el) => { barsRef.current[i] = el; }}
                    className="w-1 bg-rose-soft/80 rounded-t-sm"
                    style={{ height: '20%', transition: 'height 50ms ease-out' }}
                  />
                ))}
              </div>
            </div>

            {/* Right Reel */}
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center relative overflow-hidden shadow-inner"
            >
              <div className="w-4 h-4 rounded-full bg-gray-200 shadow-inner z-10" />
              {/* Spokes */}
              <div className="absolute w-full h-[2px] bg-gray-300 rotate-0" />
              <div className="absolute w-full h-[2px] bg-gray-300 rotate-60" />
              <div className="absolute w-full h-[2px] bg-gray-300 rotate-120" />
            </motion.div>
          </div>
        </div>

        {/* Bottom trapezoid area (fake) */}
        <div className="w-2/3 h-6 bg-[#2a2a2a] rounded-b-lg border-t-2 border-black/50 mt-1 flex justify-between px-4 items-center">
           <div className="w-3 h-3 rounded-full bg-black/60 shadow-inner" />
           <div className="w-3 h-3 rounded-full bg-black/60 shadow-inner" />
        </div>
      </div>

      <div className="mt-4 flex w-full items-center justify-between px-2">
        <button 
          onClick={togglePlay}
          className="bg-rose-soft text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>

        {/* Simple Progress Bar */}
        <div className="flex-1 ml-4 h-2 bg-ink/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-soft transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
