"use client";

import { motion } from "framer-motion";

interface TimelineProps {
  position: { x: number; y: number };
  memories: any[];
  onClickItem?: (memory: any) => void;
}

export default function TimelineSection({ position, memories, onClickItem }: TimelineProps) {
  // Use DB memories or fallback if empty
  const milestones = memories.length > 0 ? memories : [
    { date: "2022", caption: "First Meeting" },
    { date: "2023", caption: "Our First Trip" },
    { date: "2024", caption: "The Engagement" },
    { date: "Forever", caption: "Building Our Life" }
  ];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: position.x, y: position.y, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute flex flex-col items-center p-12 bg-white/80 backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[40px] border border-white/50 w-[600px] cursor-grab active:cursor-grabbing"
    >
      {/* Floral Accents */}
      <img src="/floral-accent.png" alt="floral accent" className="absolute -top-12 -right-12 w-40 h-40 object-contain mix-blend-multiply opacity-90 pointer-events-none z-10" />
      <img src="/floral-accent.png" alt="floral accent" className="absolute -bottom-12 -left-12 w-40 h-40 object-contain mix-blend-multiply opacity-90 pointer-events-none rotate-180 z-10" />

      <h2 className="font-serif text-4xl text-ink mb-16 tracking-widest uppercase relative z-20">Our Timeline</h2>
      
      <div className="relative w-full flex flex-col gap-16 pl-8 border-l border-ink/20">
        {milestones.map((milestone, index) => (
          <div 
            key={index} 
            className={`relative flex items-center ${onClickItem ? 'cursor-pointer hover:opacity-70 transition' : ''}`}
            onClick={() => onClickItem && onClickItem(milestone)}
          >
            {/* Glowing dot */}
            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-rose-soft shadow-[0_0_15px_rgba(230,200,200,0.8)] border-2 border-white" />
            
            <div className="flex flex-col">
              <span className="font-sans font-bold text-ink-light tracking-widest text-sm mb-1">
                {milestone.date}
              </span>
              <span className="font-serif text-3xl text-ink">
                {milestone.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
