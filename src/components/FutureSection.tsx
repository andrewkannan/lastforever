"use client";

import { motion } from "framer-motion";

interface FutureProps {
  position: { x: number; y: number };
  memories: any[];
  onClickItem?: (memory: any) => void;
}

export default function FutureSection({ position, memories, onClickItem }: FutureProps) {
  const fallbackDreams = [
    { caption: "A cozy home with a large kitchen", type: "future" },
    { caption: "Kids running in the backyard", type: "future" },
    { caption: "Sunday morning pancakes", type: "future" },
    { caption: "Growing old together", type: "future" },
    { caption: "Serving God as a family", type: "future" }
  ];

  const dreams = [...fallbackDreams, ...memories];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: position.x, y: position.y, opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute w-[700px] cursor-grab active:cursor-grabbing"
    >
      {/* Background card separated to avoid Safari stacking context bugs with mix-blend-mode */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[40px] border border-white/50" />
      
      {/* Floral Accents outside the backdrop-blur element */}
      <img src="/floral-future.png?v=2" alt="floral accent" className="absolute -bottom-12 -right-12 w-40 h-40 object-contain pointer-events-none rotate-180 z-10 -scale-x-100" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }} />

      <div className="relative flex flex-col items-center justify-center p-16 z-20 w-full h-full">
        <h2 className="font-serif text-5xl text-ink mb-12 text-center text-shadow-soft">Our Future Vision</h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {dreams.map((dreamMemory, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-sm border border-white/40 font-hand text-2xl text-ink ${onClickItem ? 'cursor-pointer hover:bg-white/80 transition' : ''}`}
              onClick={() => onClickItem && onClickItem(dreamMemory)}
            >
              {dreamMemory.caption}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
