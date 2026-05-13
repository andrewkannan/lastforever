"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EnvironmentLayers() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random particles for dust and sparkles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    isSparkle: Math.random() > 0.8
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      
      {/* 1. Subtle Grain / Noise (Enhanced) */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-multiply pointer-events-none" />

      {/* 2. Light Leaks */}
      <motion.div 
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-200/20 blur-[120px] mix-blend-overlay pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/20 blur-[100px] mix-blend-overlay pointer-events-none"
      />

      {/* 3. Moving Sunlight */}
      <motion.div 
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "200%", opacity: [0, 0.15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] blur-[50px] mix-blend-overlay pointer-events-none"
      />

      {/* 4. Floating Dust & Sparkles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: `${p.x}vw`, 
            y: `${p.y}vh`, 
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: [`${p.y}vh`, `${p.y - 20}vh`],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
            opacity: p.isSparkle ? [0, 0.8, 0] : [0, 0.4, 0],
            scale: p.isSparkle ? [0, 1.5, 0] : [0, 1, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear" 
          }}
          className={`absolute rounded-full pointer-events-none ${
            p.isSparkle 
              ? "bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]" 
              : "bg-white/40 blur-[1px]"
          }`}
          style={{ 
            width: p.size, 
            height: p.size,
          }}
        />
      ))}

      {/* 5. Vignette (Subtle edge shadow) */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.05)] pointer-events-none mix-blend-multiply" />
      
    </div>
  );
}
