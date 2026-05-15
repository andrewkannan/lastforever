"use client";

import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Memory } from "@/data/memories";
import { updateMemoryPosition } from "@/actions/memoryActions";
import Confetti from "react-confetti";

interface SlotMachineProps {
  memory: Memory;
  onClick?: (memory: Memory) => void;
}

const EMOJIS = ["❤️", "🎁", "🍫", "☕", "🍦", "🥤", "🏸", "💋", "⛪"];

export default function SlotMachine({ memory, onClick }: SlotMachineProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 1, 2]); // Initial indices
  const [isWinner, setIsWinner] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const playWinSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      // Arpeggio
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        playBeep(freq, now + i * 0.1, 0.4);
      });
      // Final chord
      setTimeout(() => {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq) => {
          playBeep(freq, audioCtx.currentTime, 1.0);
        });
      }, 500);

    } catch (e) {
      console.error("Audio API not supported");
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsWinner(false);

    // 25% chance of winning
    const willWin = Math.random() < 0.25;
    const targetEmojiIndex = Math.floor(Math.random() * EMOJIS.length);
    
    const finalReels = willWin 
      ? [targetEmojiIndex, targetEmojiIndex, targetEmojiIndex]
      : [
          Math.floor(Math.random() * EMOJIS.length),
          Math.floor(Math.random() * EMOJIS.length),
          Math.floor(Math.random() * EMOJIS.length)
        ];

    // Prevent accidental wins if it wasn't supposed to win
    if (!willWin && finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      finalReels[2] = (finalReels[2] + 1) % EMOJIS.length;
    }

    // Animation fake spins
    let spins = 0;
    const spinInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * EMOJIS.length),
        Math.floor(Math.random() * EMOJIS.length),
        Math.floor(Math.random() * EMOJIS.length)
      ]);
      spins++;

      if (spins > 20) {
        clearInterval(spinInterval);
        
        // Stop reel 1
        setReels(prev => [finalReels[0], prev[1], prev[2]]);
        
        // Stop reel 2
        setTimeout(() => {
          setReels(prev => [finalReels[0], finalReels[1], prev[2]]);
          
          // Stop reel 3
          setTimeout(() => {
            setReels(finalReels);
            setIsSpinning(false);
            
            if (willWin) {
              setIsWinner(true);
              playWinSound();
              setTimeout(() => setIsWinner(false), 5000); // Stop raining after 5s
            }
          }, 400);
        }, 400);
      }
    }, 50);
  };

  return (
    <>
      {isWinner && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            drawShape={ctx => {
              ctx.font = '35px sans-serif';
              ctx.fillText(EMOJIS[reels[0]], 0, 0);
            }}
            gravity={0.3}
            numberOfPieces={150}
          />
        </div>,
        document.body
      )}

      <motion.div
        drag
        dragMomentum={false}
        style={{ x, y, touchAction: "none" }}
        onDragEnd={async () => {
          await updateMemoryPosition(memory.id, x.get(), y.get());
        }}
        whileHover={{ zIndex: 100 }}
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
        <div className="relative w-[340px] h-[480px] flex flex-col items-center">
            
          {/* The Interactive Lever */}
          <div className="absolute top-[35%] -right-8 z-0 flex flex-col items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSpin(); }}>
            {/* Rod */}
            <motion.div 
              className="w-4 h-32 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-500 rounded-full shadow-2xl origin-bottom"
              animate={{ rotate: isSpinning ? 45 : -15 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              {/* Red Ball */}
              <div className="absolute -top-5 -left-3 w-10 h-10 bg-gradient-to-tr from-red-800 to-red-400 rounded-full shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.5),0_5px_10px_rgba(0,0,0,0.5)] border-2 border-red-900" />
            </motion.div>
            {/* Lever Base Attachment */}
            <div className="w-12 h-16 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-800 rounded-lg shadow-xl -mt-2 border-2 border-zinc-900 z-10" />
          </div>

          {/* Main Chassis Body */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#fcd34d] via-[#d97706] to-[#78350f] rounded-t-[140px] rounded-b-2xl border-[8px] border-[#fef08a] shadow-[0_25px_50px_rgba(0,0,0,0.6),inset_0_-10px_30px_rgba(0,0,0,0.6)] flex flex-col items-center p-4 z-10"
            onClick={() => onClick && onClick(memory)}
          >
            
            {/* Top Banner ("Chance to Love") */}
            <div className="w-[85%] h-[100px] mt-2 bg-gradient-to-br from-red-900 via-red-800 to-red-950 rounded-t-[100px] rounded-b-xl border-4 border-[#fde047] flex flex-col items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(0,0,0,0.4)] relative overflow-hidden">
              {/* Decorative dotted border */}
              <div className="absolute inset-2 border-2 border-dotted border-yellow-300/40 rounded-t-[90px] rounded-b-lg pointer-events-none" />
              <span className="font-hand text-4xl text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.9)] z-10 -rotate-2 mt-2 font-bold tracking-wider">
                Chance to Love
              </span>
            </div>

            {/* Reels Area */}
            <div className="w-[90%] h-[150px] bg-zinc-950 rounded-xl mt-6 p-4 shadow-[inset_0_15px_30px_rgba(0,0,0,1)] border-b-4 border-zinc-700 flex justify-between gap-3 relative">
               
               {/* Reel 1 */}
               <div className="flex-1 h-full bg-white rounded-lg overflow-hidden border-2 border-gray-400 shadow-[inset_0_5px_15px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none z-10" />
                  <div className="w-full h-full flex flex-col items-center justify-center text-6xl">
                    <motion.div
                      key={`r1-${reels[0]}`}
                      initial={{ y: isSpinning ? -50 : 0, filter: isSpinning ? "blur(3px)" : "blur(0px)" }}
                      animate={{ y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.1 }}
                    >
                      {EMOJIS[reels[0]]}
                    </motion.div>
                  </div>
               </div>
               
               {/* Reel 2 */}
               <div className="flex-1 h-full bg-white rounded-lg overflow-hidden border-2 border-gray-400 shadow-[inset_0_5px_15px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none z-10" />
                  <div className="w-full h-full flex flex-col items-center justify-center text-6xl">
                    <motion.div
                      key={`r2-${reels[1]}`}
                      initial={{ y: isSpinning ? -50 : 0, filter: isSpinning ? "blur(3px)" : "blur(0px)" }}
                      animate={{ y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.1 }}
                    >
                      {EMOJIS[reels[1]]}
                    </motion.div>
                  </div>
               </div>
               
               {/* Reel 3 */}
               <div className="flex-1 h-full bg-white rounded-lg overflow-hidden border-2 border-gray-400 shadow-[inset_0_5px_15px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none z-10" />
                  <div className="w-full h-full flex flex-col items-center justify-center text-6xl">
                    <motion.div
                      key={`r3-${reels[2]}`}
                      initial={{ y: isSpinning ? -50 : 0, filter: isSpinning ? "blur(3px)" : "blur(0px)" }}
                      animate={{ y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.1 }}
                    >
                      {EMOJIS[reels[2]]}
                    </motion.div>
                  </div>
               </div>
            </div>

            {/* Middle Controls (Coin Slot area) */}
            <div className="w-[90%] h-12 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded mt-4 flex items-center justify-center border-2 border-zinc-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative">
               <button 
                 onClick={(e) => { e.stopPropagation(); handleSpin(); }}
                 disabled={isSpinning}
                 className="px-8 py-1.5 bg-red-600 hover:bg-red-500 rounded-full text-white font-black tracking-widest text-sm shadow-[0_4px_0_#7f1d1d,0_5px_10px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_0_0_#7f1d1d] transition-all border border-red-400"
               >
                 SPIN
               </button>
               
               {/* Flashing lights */}
               <div className={`absolute left-4 w-3 h-3 rounded-full ${isSpinning ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-zinc-900 border border-zinc-600'}`} />
               <div className={`absolute right-4 w-3 h-3 rounded-full ${isSpinning ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-zinc-900 border border-zinc-600'}`} />
            </div>

            {/* Bottom Banner ("Kisses") */}
            <div className="w-[85%] h-20 bg-gradient-to-br from-red-900 via-red-800 to-red-950 rounded-xl border-4 border-[#fde047] flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(0,0,0,0.4)] mt-auto mb-2 relative">
              <div className="absolute inset-2 border-2 border-dashed border-rose-300/30 rounded-lg pointer-events-none" />
              <span className="font-hand text-5xl text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.9)] z-10 font-bold">
                Kisses
              </span>
            </div>
            
            {/* Base feet */}
            <div className="absolute -bottom-3 left-[10%] w-10 h-3 bg-zinc-800 rounded-b-md border-x border-b border-zinc-600 shadow-xl" />
            <div className="absolute -bottom-3 right-[10%] w-10 h-3 bg-zinc-800 rounded-b-md border-x border-b border-zinc-600 shadow-xl" />
          </div>
        </div>
      </motion.div>
    </>
  );
}
