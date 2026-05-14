"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface RelationshipStatsProps {
  position?: { x: number; y: number };
  startDate?: string | null;
  isAdmin?: boolean;
  onEdit?: () => void;
}

export default function RelationshipStats({ position = { x: 50, y: 50 }, startDate, isAdmin, onEdit }: RelationshipStatsProps) {
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (!startDate) return;

    // Parse standard dates or "17 march 2026" formats
    const start = new Date(startDate);
    if (!isNaN(start.getTime())) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
    }
  }, [startDate]);

  if (!startDate) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, touchAction: "none" }}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      whileTap={{ scale: 0.95, zIndex: 100 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] border border-white/40 cursor-grab active:cursor-grabbing hover:z-50 flex flex-col items-center justify-center min-w-[200px]"
    >
      <div className="absolute inset-[-60px] pointer-events-none mix-blend-multiply z-0">
        <img src="/frame-days.png" alt="frame" className="w-full h-full object-contain" />
      </div>

      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-rose-500 mb-2"
      >
        <Heart size={32} fill="currentColor" />
      </motion.div>
      
      <h3 className="font-sans text-xs uppercase tracking-widest text-ink-light/80 mb-1">
        Days Together
      </h3>
      
      <div className="font-serif text-5xl font-bold text-ink drop-shadow-sm">
        {days.toLocaleString()}
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <p className="font-hand text-xl text-ink/70">
          Since {startDate}
        </p>
        {isAdmin && (
          <button 
            onClick={onEdit}
            className="text-ink-light hover:text-rose-500 transition-colors p-1"
            title="Edit Date"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
