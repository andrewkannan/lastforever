"use client";

import { motion } from "framer-motion";

interface FutureProps {
  position: { x: number; y: number };
  memories: any[];
}

export default function FutureSection({ position, memories }: FutureProps) {
  // Use DB memories or fallback if empty
  const dreams = memories.length > 0 ? memories.map(m => m.caption) : [
    "A cozy home with a large kitchen",
    "Kids running in the backyard",
    "Sunday morning pancakes",
    "Growing old together",
    "Serving God as a family"
  ];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: position.x, y: position.y, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute p-16 w-[700px] cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
    >
      {/* Soft ethereal background glow */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full shadow-[0_0_100px_rgba(255,255,255,0.8)] z-[-1]" />
      <div className="absolute inset-0 bg-rose-soft/20 blur-3xl rounded-full z-[-2]" />

      <h2 className="font-serif text-5xl text-ink mb-12 text-center text-shadow-soft">Our Future Vision</h2>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {dreams.map((dream, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className="px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-sm border border-white/40 font-hand text-2xl text-ink"
          >
            {dream}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
