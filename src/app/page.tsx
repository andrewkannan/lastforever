"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import MemoryBoard from "@/components/MemoryBoard";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {!started && (
          <Hero key="hero" onBegin={() => setStarted(true)} />
        )}
      </AnimatePresence>
      
      {/* 
        The board is always rendered underneath the Hero.
        When Hero exits (animates up), the board is revealed. 
      */}
      <div className="absolute inset-0">
        <MemoryBoard />
      </div>
    </main>
  );
}
