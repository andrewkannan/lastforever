"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import MemoryBoard from "@/components/MemoryBoard";
import TreasureBoxLayer from "@/components/TreasureBoxLayer";
import { Memory } from "@/data/memories";

export default function HomeClient({ initialMemories }: { initialMemories: any[] }) {
  const [layer, setLayer] = useState(1); // 1: Treasure, 2: Cover, 3: Board

  return (
    <main className="absolute inset-0 overflow-hidden bg-floral-paper">
      
      {/* Layer 3: Memory Board (Always mounted behind so it's ready when pages flip) */}
      <div className="absolute inset-0 z-0">
        <MemoryBoard initialMemories={initialMemories} />
      </div>

      <AnimatePresence>
        {/* Layer 2: Wedding Book Cover */}
        {layer === 2 && (
          <Hero key="hero" onBegin={() => setLayer(3)} />
        )}
        
        {/* Layer 1: Vintage Treasure Box */}
        {layer === 1 && (
          <TreasureBoxLayer 
            key="treasure" 
            memories={initialMemories} 
            onComplete={() => setLayer(2)} 
          />
        )}
      </AnimatePresence>
      
    </main>
  );
}
