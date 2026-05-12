"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Memory } from "@/data/memories";
import { X } from "lucide-react";
import Image from "next/image";

interface MemoryModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink/90 backdrop-blur-md"
          onClick={onClose}
        >
          <button 
            className="absolute top-8 right-8 text-paper hover:text-white transition-colors"
            onClick={onClose}
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-4xl w-full bg-paper rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {memory.imageUrl && (
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
                <Image 
                  src={memory.imageUrl}
                  alt={memory.caption || ""}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
              {memory.date && (
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-ink-light mb-4">
                  {memory.date}
                </span>
              )}
              
              <p className="font-serif text-2xl md:text-4xl text-ink leading-relaxed mb-8">
                {memory.caption || memory.content}
              </p>

              {memory.song && (
                <div className="mt-auto pt-8 border-t border-ink/10">
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-light mb-2">
                    Our Song
                  </p>
                  <iframe 
                    src={`https://open.spotify.com/embed/track/${memory.song.spotifyId}?utm_source=generator&theme=0`} 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
