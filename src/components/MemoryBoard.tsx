"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Polaroid from "./Polaroid";
import Note from "./Note";
import MemoryModal from "./MemoryModal";
import LoveLetterDrawer from "./LoveLetterDrawer";
import TimelineSection from "./TimelineSection";
import FutureSection from "./FutureSection";

export default function MemoryBoard({ initialMemories }: { initialMemories: any[] }) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

  // Filter memories from DB or fallback
  const letterMemory = initialMemories.find(m => m.type === "letter") || {
    id: "drawer",
    type: "letter",
    content: "I promise to love you forever and always...",
    posX: 900,
    posY: 800,
    rotation: 0
  };

  const timelinePos = { x: 1600, y: 300 };
  const futurePos = { x: 2300, y: 800 };

  return (
    <>
      <div 
        className="w-full h-full overflow-hidden bg-background relative"
        ref={constraintsRef}
      >
        <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
        
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
            memory={{...letterMemory, position: {x: letterMemory.posX, y: letterMemory.posY}}} 
            onClick={setSelectedMemory} 
          />

          {initialMemories.map((m) => {
            // Reformat to match what components expect
            const memory = {
              ...m,
              position: { x: m.posX, y: m.posY },
              imageUrl: m.imageBase64 || m.imageUrl,
              song: m.songSpotifyId ? { spotifyId: m.songSpotifyId } : null
            };

            if (memory.type === "photo") {
              return <Polaroid key={memory.id} memory={memory} onClick={setSelectedMemory} />;
            }
            if (memory.type === "note") {
              return <Note key={memory.id} memory={memory} onClick={setSelectedMemory} />;
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
