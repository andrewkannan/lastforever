"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Polaroid from "./Polaroid";
import Note from "./Note";
import MemoryModal from "./MemoryModal";
import LoveLetterDrawer from "./LoveLetterDrawer";
import TimelineSection from "./TimelineSection";
import FutureSection from "./FutureSection";
import { memories, Memory } from "@/data/memories";

export default function MemoryBoard() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Position constants for the sections
  const timelinePos = { x: 1600, y: 300 };
  const futurePos = { x: 2300, y: 800 };
  
  // Find the letter memory for the drawer
  const letterMemory = memories.find(m => m.type === "letter") || {
    id: "drawer",
    type: "letter",
    content: "I promise to love you forever and always...",
    position: { x: 900, y: 800 },
    rotation: 0
  } as Memory;

  return (
    <>
      <div 
        className="w-full h-full overflow-hidden bg-background relative"
        ref={constraintsRef}
      >
        <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
        
        {/* Large draggable canvas */}
        <motion.div 
          className="w-[4000px] h-[3000px] cursor-grab active:cursor-grabbing relative"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          dragMomentum={false}
          initial={{ x: -500, y: -200 }}
        >
          <TimelineSection position={timelinePos} />
          <FutureSection position={futurePos} />
          
          <LoveLetterDrawer 
            memory={letterMemory} 
            onClick={setSelectedMemory} 
          />

          {memories.map((memory) => {
            if (memory.type === "photo") {
              return (
                <Polaroid 
                  key={memory.id} 
                  memory={memory} 
                  onClick={setSelectedMemory} 
                />
              );
            }
            if (memory.type === "note") {
              return (
                <Note 
                  key={memory.id} 
                  memory={memory} 
                  onClick={setSelectedMemory} 
                />
              );
            }
            return null;
          })}
        </motion.div>
      </div>

      <MemoryModal 
        memory={selectedMemory} 
        onClose={() => setSelectedMemory(null)} 
      />
    </>
  );
}
