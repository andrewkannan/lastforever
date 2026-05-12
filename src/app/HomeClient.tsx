"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import MemoryBoard from "@/components/MemoryBoard";

export default function HomeClient({ initialMemories }: { initialMemories: any[] }) {
  const [started, setStarted] = useState(false);

  return (
    <main className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {!started && (
          <Hero key="hero" onBegin={() => setStarted(true)} />
        )}
      </AnimatePresence>
      
      <div className="absolute inset-0">
        <MemoryBoard initialMemories={initialMemories} />
      </div>
    </main>
  );
}
