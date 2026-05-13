"use client";

import { motion, useMotionValue } from "framer-motion";
import { Memory } from "@/data/memories";
import { updateMemoryPosition } from "@/actions/memoryActions";

interface NoteProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

export default function Note({ memory, onClick }: NoteProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ 
        x, y, touchAction: "none",
        boxShadow: "2px 5px 15px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)"
      }}
      onDragEnd={async () => {
        await updateMemoryPosition(memory.id, x.get(), y.get());
      }}
      whileHover={{ 
        scale: 1.05, 
        zIndex: 100,
        boxShadow: "5px 15px 30px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.1)"
      }}
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
        damping: 20,
        opacity: { duration: 1 }
      }}
      onClick={() => onClick(memory)}
      className="absolute bg-[#FFF9C4] p-6 cursor-grab active:cursor-grabbing w-[250px] flex flex-col items-center justify-center group hover:z-50 transition-shadow duration-300"
    >
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-sm z-10" />

      <p className="font-hand text-3xl text-ink leading-tight text-center">
        {memory.content || memory.caption}
      </p>
    </motion.div>
  );
}
