"use client";

import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Memory } from "@/data/memories";
import { Dices } from "lucide-react";
import { updateMemoryPosition } from "@/actions/memoryActions";

interface ImageRouletteProps {
  memory: Memory;
  photoMemories: Memory[];
  onClick?: (memory: Memory) => void;
}

export default function ImageRoulette({ memory, photoMemories, onClick }: ImageRouletteProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedPhoto, setDisplayedPhoto] = useState<Memory | null>(null);
  
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with a random photo if available
  useEffect(() => {
    if (photoMemories.length > 0 && !displayedPhoto) {
      const randomIndex = Math.floor(Math.random() * photoMemories.length);
      setCurrentIndex(randomIndex);
      setDisplayedPhoto(photoMemories[randomIndex]);
    }
  }, [photoMemories]);

  const handleSpin = () => {
    if (isSpinning || photoMemories.length === 0) return;
    
    setIsSpinning(true);
    let speed = 50; // Start fast
    let spins = 0;
    const maxSpins = 30 + Math.floor(Math.random() * 10); // Random number of spins

    const spin = () => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % photoMemories.length;
        setDisplayedPhoto(photoMemories[next]);
        return next;
      });

      spins++;

      if (spins < maxSpins) {
        // Gradually slow down
        if (spins > maxSpins - 15) {
          speed += 20; 
        }
        spinIntervalRef.current = setTimeout(spin, speed);
      } else {
        setIsSpinning(false);
        // Add a nice subtle celebration effect
      }
    };

    spinIntervalRef.current = setTimeout(spin, speed);
  };

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearTimeout(spinIntervalRef.current);
    };
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, touchAction: "none" }}
      onDragEnd={async () => {
        await updateMemoryPosition(memory.id, x.get(), y.get());
      }}
      whileHover={{ scale: 1.02, zIndex: 100 }}
      initial={{ 
        rotate: memory.rotation,
        opacity: 0,
        scale: 0.8 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1 
      }}
      className="absolute cursor-grab active:cursor-grabbing"
    >
      <div 
        className="relative bg-zinc-900 rounded-3xl p-6 shadow-2xl border-4 border-zinc-700/50 flex flex-col items-center w-[340px]"
        onClick={() => onClick && onClick(memory)}
      >
        {/* Machine Header */}
        <div className="absolute -top-4 bg-red-600 text-white font-black tracking-widest px-6 py-1 rounded-full text-sm shadow-md border-2 border-red-800 uppercase z-10">
          {memory.caption || "Memory Roulette"}
        </div>

        {/* The Screen */}
        <div className="relative w-full h-[300px] bg-black rounded-xl overflow-hidden border-4 border-zinc-800 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] mt-4 flex items-center justify-center">
          
          {/* Glass reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20 rounded-t-xl" />

          {photoMemories.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {displayedPhoto && (
                <motion.div
                  key={displayedPhoto.id + (isSpinning ? currentIndex : 'stopped')}
                  initial={{ opacity: 0.5, y: isSpinning ? 50 : 0, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0.5, y: isSpinning ? -50 : 0, scale: 0.95 }}
                  transition={{ duration: isSpinning ? 0.05 : 0.3 }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={displayedPhoto.imageUrl!} 
                    alt="roulette image" 
                    className={`w-full h-full object-cover ${isSpinning ? 'blur-[2px]' : ''} transition-all duration-75`}
                  />
                  
                  {/* Photo Caption Overlay when stopped */}
                  {!isSpinning && displayedPhoto.caption && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white font-hand text-xl text-center"
                    >
                      {displayedPhoto.caption}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-zinc-500 font-mono text-center px-4">
              <Dices size={48} className="mx-auto mb-2 opacity-50" />
              NO PHOTOS AVAILABLE
            </div>
          )}
        </div>

        {/* Machine Controls */}
        <div className="w-full mt-6 flex justify-center items-center">
          <button
            onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking button
            onClick={handleSpin}
            disabled={isSpinning || photoMemories.length === 0}
            className={`
              relative w-24 h-24 rounded-full flex flex-col items-center justify-center font-black text-xl tracking-wider transition-all duration-150
              ${isSpinning 
                ? 'bg-red-800 text-red-900 shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)] translate-y-2' 
                : 'bg-red-500 hover:bg-red-400 text-white shadow-[0_8px_0_rgb(153,27,27),0_15px_20px_rgba(0,0,0,0.4)] active:translate-y-2 active:shadow-[0_0px_0_rgb(153,27,27),0_5px_10px_rgba(0,0,0,0.4)]'
              }
            `}
          >
            SPIN
          </button>
        </div>
        
        {/* Machine details */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
        </div>
      </div>
    </motion.div>
  );
}
