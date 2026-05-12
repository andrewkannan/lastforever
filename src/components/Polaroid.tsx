"use client";

import { motion } from "framer-motion";
import { Memory } from "@/data/memories";
import Image from "next/image";

interface PolaroidProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

export default function Polaroid({ memory, onClick }: PolaroidProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      whileTap={{ scale: 0.95, zIndex: 100 }}
      initial={{ 
        x: memory.position.x, 
        y: memory.position.y, 
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
      className="absolute bg-paper p-4 pb-12 polaroid-shadow cursor-grab active:cursor-grabbing w-[300px] flex flex-col gap-3 group"
      style={{ touchAction: "none" }}
    >
      {/* Tape texture overlay mock */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm rotate-[-2deg] shadow-sm z-10" />

      <div className="relative w-full h-[250px] bg-ink-light overflow-hidden">
        {memory.imageUrl && (
          <Image 
            src={memory.imageUrl}
            alt={memory.caption || "Memory"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-50 contrast-125 sepia-[0.2]"
            sizes="(max-width: 300px) 100vw, 300px"
          />
        )}
        <div className="absolute inset-0 bg-noise mix-blend-overlay pointer-events-none" />
      </div>

      <div className="flex flex-col gap-1 px-2">
        {memory.caption && (
          <p className="font-hand text-2xl text-ink leading-tight">
            {memory.caption}
          </p>
        )}
        {(memory.date || memory.location) && (
          <div className="flex justify-between items-center mt-2 font-sans text-xs text-ink-light/70 uppercase tracking-widest">
            <span>{memory.date}</span>
            <span>{memory.location}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
