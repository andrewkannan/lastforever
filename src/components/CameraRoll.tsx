"use client";

import { motion, useMotionValue } from "framer-motion";
import { Memory } from "@/data/memories";
import Image from "next/image";

interface CameraRollProps {
  position?: { x: number; y: number };
  memories: Memory[];
}

export default function CameraRoll({ position = { x: 500, y: 100 }, memories }: CameraRollProps) {
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  
  // Get up to 4 photos for the film strip
  const photos = memories.filter(m => m.type === "photo" && m.imageUrl).slice(0, 4);

  if (photos.length === 0) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, touchAction: "none" }}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      whileTap={{ scale: 0.95, zIndex: 100 }}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute bg-black p-2 pb-2 rounded shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing hover:z-50 flex flex-col gap-2"
    >
      {/* Top Film Holes */}
      <div className="flex justify-between px-1 w-full gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`top-${i}`} className="w-2 h-3 bg-white/20 rounded-sm" />
        ))}
      </div>

      <div className="flex gap-2 px-1">
        {photos.map((photo, index) => (
          <div key={photo.id || index} className="w-[120px] h-[90px] relative bg-zinc-900 border border-zinc-800 overflow-hidden group">
            {photo.imageUrl && (
              <Image 
                src={photo.imageUrl}
                alt="Blurry memory"
                fill
                className="object-cover opacity-70 blur-[3px] grayscale-[0.5] sepia-[0.3] contrast-150 transition-all duration-700 group-hover:blur-none group-hover:grayscale-0 group-hover:opacity-100"
                sizes="120px"
              />
            )}
            <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Bottom Film Holes */}
      <div className="flex justify-between px-1 w-full gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`bot-${i}`} className="w-2 h-3 bg-white/20 rounded-sm" />
        ))}
      </div>
      
      {/* Edge markings */}
      <div className="absolute top-1 left-2 text-[6px] font-mono text-white/40 tracking-widest">KODAK 400</div>
      <div className="absolute bottom-1 right-2 text-[6px] font-mono text-white/40 tracking-widest">12A</div>
    </motion.div>
  );
}
