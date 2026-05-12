"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import { Memory } from "@/data/memories";
import { MailOpen } from "lucide-react";
import { updateMemoryPosition } from "@/actions/memoryActions";

interface LoveLetterDrawerProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

export default function LoveLetterDrawer({ memory, onClick }: LoveLetterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);

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
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        opacity: { duration: 1 }
      }}
      className="absolute cursor-grab active:cursor-grabbing w-[320px]"
      style={{ touchAction: "none" }}
    >
      {/* Drawer Body */}
      <div 
        className="relative bg-[#8b7355] rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-b-4 border-r-4 border-[#5c4a3d] p-4 flex flex-col items-center justify-center cursor-pointer overflow-visible"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && memory.content) {
             // Let user read the letter after drawer opens
             setTimeout(() => onClick(memory), 800);
          }
        }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none mix-blend-multiply" />
        
        {/* Handle */}
        <div className="w-24 h-4 rounded-full bg-[#3e3229] mb-4 shadow-inner" />

        <div className="flex items-center gap-2 text-[#e8dcc4] font-serif tracking-widest text-sm uppercase">
          <MailOpen size={16} />
          <span>Love Letters</span>
        </div>

        {/* Paper peeking out when open */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: isOpen ? -80 : 20, 
            opacity: isOpen ? 1 : 0,
            rotate: isOpen ? -5 : 0
          }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[200px] h-[150px] bg-paper shadow-md rounded-t-sm z-[-1] flex flex-col p-4"
        >
          <div className="w-full h-[2px] bg-blue-200/50 mb-2" />
          <div className="w-full h-[2px] bg-blue-200/50 mb-2" />
          <div className="w-full h-[2px] bg-blue-200/50" />
          <p className="font-hand text-ink/40 text-xl mt-2 rotate-[-2deg]">My dearest...</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
