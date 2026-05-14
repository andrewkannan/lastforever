"use client";

import { motion, useMotionValue } from "framer-motion";
import { Memory } from "@/data/memories";
import { updateMemoryPosition } from "@/actions/memoryActions";
import { useEffect, useState } from "react";

interface CountdownElementProps {
  memory: Memory;
  onClick?: (memory: Memory) => void;
}

const flowers = ['rose', 'tulip', 'sunflower', 'babybreath', 'carnation', 'orchid', 'daffodil', 'daisy', 'gardenia', 'crocus', 'cyclamen', 'lily'];

export default function CountdownElement({ memory, onClick }: CountdownElementProps) {
  const x = useMotionValue(memory.position.x);
  const y = useMotionValue(memory.position.y);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  // Calculate days remaining
  useEffect(() => {
    if (memory.date) {
      // Basic parse of string date e.g. "2027-02-20" or "October 14, 2023"
      const targetDate = new Date(memory.date);
      if (!isNaN(targetDate.getTime())) {
        const now = new Date();
        const diffTime = targetDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(diffDays > 0 ? diffDays : 0);
      }
    }
  }, [memory.date]);

  // Generate some flower particles
  const [particles, setParticles] = useState<{ id: number, flower: string, delay: number, duration: number, angle: number }[]>([]);
  
  useEffect(() => {
    // Generate 15 particles
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      flower: flowers[Math.floor(Math.random() * flowers.length)],
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ 
        x, y, touchAction: "none",
      }}
      onDragEnd={async () => {
        await updateMemoryPosition(memory.id, x.get(), y.get());
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute flex flex-col items-center justify-center cursor-grab active:cursor-grabbing group hover:z-50 transition-transform z-20 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick && onClick(memory)}
    >
      {/* Title */}
      <h3 className="font-serif text-4xl text-ink text-center mb-3 text-shadow-soft z-20 bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/50">
        {memory.caption || "Our Special Day"}
      </h3>
      
      {/* Countdown Box */}
      {daysRemaining !== null && (
        <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-full border border-rose-soft/30 shadow-lg mb-6 z-20 flex items-center justify-center gap-2">
          <span className="font-serif text-3xl font-bold text-rose-soft">
            {daysRemaining}
          </span>
          <span className="font-sans text-ink-light tracking-widest uppercase text-sm mt-1">
            Days to go
          </span>
        </div>
      )}

      {/* Chapel Image and Particles Wrapper */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* Flower Particles Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {particles.map((p) => {
            const distance = 180; // How far they fly outwards
            const targetX = Math.cos(p.angle) * distance;
            const targetY = Math.sin(p.angle) * distance;
            
            return (
              <motion.img
                key={p.id}
                src={`/flowers/${p.flower}.png`}
                className="absolute w-12 h-12 object-contain opacity-0 pointer-events-none drop-shadow-sm"
                animate={{
                  x: [0, targetX],
                  y: [0, targetY],
                  opacity: [0, 0.9, 0],
                  scale: [0.3, 1.2, 0.3],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>

        {/* Chapel Image */}
        <img 
          src="/chapel.png" 
          alt="Chapel"
          className="w-full h-full object-contain drop-shadow-2xl z-10 pointer-events-none"
        />
      </div>

    </motion.div>
  );
}
