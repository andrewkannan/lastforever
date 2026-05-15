"use client";

import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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

    // Determine outcome beforehand
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
      {isWinner && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            drawShape={ctx => {
              ctx.font = '30px serif';
              ctx.fillText(EMOJIS[reels[0]], 0, 0);
            }}
            gravity={0.3}
            numberOfPieces={150}
          />
        </div>
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
        <div 
          className="relative w-[300px] h-[400px] flex flex-col items-center justify-center"
          onClick={() => onClick && onClick(memory)}
        >
          {/* Base Chassis Image */}
          <img 
            src="/slot-machine-base.png" 
            alt="Slot Machine" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* Top Banner Overlay ("Chance to Love") */}
          {/* CALIBRATION NEEDED: Adjust top, left, width, height, and padding */}
          <div className="absolute top-[12%] left-[10%] w-[80%] h-[12%] flex items-center justify-center bg-[#8B0000] rounded-[50%_50%_10%_10%] border-4 border-yellow-600/50">
            <span className="font-hand text-2xl text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] z-10" style={{ transform: "rotate(-2deg)" }}>
              Chance to Love
            </span>
          </div>

          {/* Reels Area Overlay */}
          {/* CALIBRATION NEEDED: Adjust top, left, width, height */}
          <div className="absolute top-[38%] left-[20%] w-[60%] h-[20%] flex items-center justify-between px-2 bg-white border-2 border-black/50 overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
            {/* Reel 1 */}
            <div className="w-[30%] h-full flex flex-col items-center justify-center text-4xl bg-white border-r border-gray-300 relative">
              <motion.div
                key={`r1-${reels[0]}`}
                initial={{ y: isSpinning ? -40 : 0, filter: isSpinning ? "blur(2px)" : "blur(0px)" }}
                animate={{ y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.1 }}
              >
                {EMOJIS[reels[0]]}
              </motion.div>
            </div>
            {/* Reel 2 */}
            <div className="w-[30%] h-full flex flex-col items-center justify-center text-4xl bg-white border-r border-gray-300 relative">
              <motion.div
                key={`r2-${reels[1]}`}
                initial={{ y: isSpinning ? -40 : 0, filter: isSpinning ? "blur(2px)" : "blur(0px)" }}
                animate={{ y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.1 }}
              >
                {EMOJIS[reels[1]]}
              </motion.div>
            </div>
            {/* Reel 3 */}
            <div className="w-[30%] h-full flex flex-col items-center justify-center text-4xl bg-white relative">
              <motion.div
                key={`r3-${reels[2]}`}
                initial={{ y: isSpinning ? -40 : 0, filter: isSpinning ? "blur(2px)" : "blur(0px)" }}
                animate={{ y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.1 }}
              >
                {EMOJIS[reels[2]]}
              </motion.div>
            </div>
          </div>

          {/* Bottom Banner Overlay ("Kisses") */}
          {/* CALIBRATION NEEDED: Adjust top, left, width, height */}
          <div className="absolute top-[68%] left-[20%] w-[60%] h-[15%] flex items-center justify-center bg-[#4A0000] border-2 border-yellow-600/50">
            <span className="font-hand text-3xl text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.8)] z-10">
              Kisses
            </span>
          </div>

          {/* Interactive Spin Button (Invisible overlay over the lever area) */}
          {/* CALIBRATION NEEDED: Adjust right, top, width, height to match the red lever ball */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSpin();
            }}
            disabled={isSpinning}
            className="absolute -right-[15%] top-[25%] w-[30%] h-[30%] bg-transparent cursor-pointer z-20 hover:scale-110 transition-transform"
            aria-label="Spin Lever"
          />
        </div>
      </motion.div>
    </>
  );
}
