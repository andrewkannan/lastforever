"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import MemoryBoard from "@/components/MemoryBoard";
import { Memory } from "@/data/memories";

export default function HomeClient({ initialMemories }: { initialMemories: any[] }) {
  const [layer, setLayer] = useState(2); // Start directly on Cover (Layer 2)

  return (
    <main className="absolute inset-0 overflow-hidden bg-floral-paper">
      
      {/* Layer 3: Memory Board (Always mounted behind so it's ready when pages flip) */}
      <div className="absolute inset-0 z-0">
        <MemoryBoard initialMemories={initialMemories} isActive={layer === 3} />
      </div>

      <AnimatePresence>
        {/* Layer 2: Wedding Book Cover */}
        {layer === 2 && (
          <Hero key="hero" onBegin={() => setLayer(3)} />
        )}
      </AnimatePresence>
      
    </main>
  );
}
