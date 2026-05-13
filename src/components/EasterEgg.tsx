"use client";

import { motion, useMotionValue } from "framer-motion";
import { Memory } from "@/data/memories";
import { updateMemoryPosition } from "@/actions/memoryActions";

import { Flower2 } from "lucide-react";

interface EasterEggProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

export default function EasterEgg({ memory, onClick }: EasterEggProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ 
        x, y, touchAction: "none",
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))"
      }}
      onDragEnd={async () => {
        await updateMemoryPosition(memory.id, x.get(), y.get());
      }}
      whileHover={{ 
        scale: 1.2, 
        rotate: [0, -10, 10, -10, 10, 0],
        zIndex: 100,
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))"
      }}
      whileTap={{ scale: 0.9, zIndex: 100 }}
      initial={{ 
        rotate: memory.rotation,
        opacity: 0,
        scale: 0.8
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        opacity: { duration: 1 },
        rotate: { duration: 0.5 }
      }}
      onClick={() => onClick(memory)}
      className="absolute p-4 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center group hover:z-50 text-rose-soft/90 hover:text-rose-soft transition-colors"
    >
      <Flower2 size={48} strokeWidth={1.5} className="fill-white/20" />
      
      {/* Subtle sparkling glow */}
      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
    </motion.div>
  );
}
