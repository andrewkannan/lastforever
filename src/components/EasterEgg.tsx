"use client";

import { motion, useMotionValue } from "framer-motion";
import { Memory } from "@/data/memories";
import { updateMemoryPosition } from "@/actions/memoryActions";

interface EasterEggProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

const flowersList = [
  'rose', 'tulip', 'sunflower', 'babybreath', 'carnation', 
  'orchid', 'daffodil', 'daisy', 'gardenia', 'crocus', 
  'cyclamen', 'lily'
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function EasterEgg({ memory, onClick }: EasterEggProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);

  // Pick a flower consistently based on the memory ID
  const flowerIndex = hashString(memory.id) % flowersList.length;
  const flowerName = flowersList[flowerIndex];

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ 
        x, y, touchAction: "none",
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
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
      className="absolute p-4 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center group hover:z-50 transition-colors z-[999]"
    >
      <div className="absolute -top-10 bg-red-500 text-white font-bold p-2 rounded whitespace-nowrap z-[1000]">
        EGG! x:{memory.position.x} y:{memory.position.y}
      </div>
      <div className="bg-red-200/50 rounded-full p-2 border-4 border-red-500">
        <img 
          src={`/flowers/${flowerName}.png`} 
          alt={flowerName}
          className="w-20 h-20 object-contain pointer-events-none drop-shadow-md" 
        />
      </div>
      
      {/* Subtle sparkling glow */}
      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
    </motion.div>
  );
}
