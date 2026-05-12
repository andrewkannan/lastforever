"use client";

import { motion } from "framer-motion";
import { Memory } from "@/data/memories";

interface TimelineProps {
  position: { x: number; y: number };
}

export default function TimelineSection({ position }: TimelineProps) {
  const milestones = [
    { year: "2022", event: "First Meeting" },
    { year: "2023", event: "Our First Trip" },
    { year: "2024", event: "The Engagement" },
    { year: "Forever", event: "Building Our Life" }
  ];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: position.x, y: position.y, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute flex flex-col items-center p-12 bg-white/5 backdrop-blur-sm rounded-[40px] border border-white/10 w-[600px] cursor-grab active:cursor-grabbing"
    >
      <h2 className="font-serif text-4xl text-ink mb-16 tracking-widest uppercase">Our Timeline</h2>
      
      <div className="relative w-full flex flex-col gap-16 pl-8 border-l border-ink/20">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative flex items-center">
            {/* Glowing dot */}
            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-rose-soft shadow-[0_0_15px_rgba(230,200,200,0.8)] border-2 border-white" />
            
            <div className="flex flex-col">
              <span className="font-sans font-bold text-ink-light tracking-widest text-sm mb-1">
                {milestone.year}
              </span>
              <span className="font-serif text-3xl text-ink">
                {milestone.event}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
