"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Memory } from "@/data/memories";

interface TreasureBoxLayerProps {
  memories: Memory[];
  onComplete: () => void;
}

export default function TreasureBoxLayer({ memories, onComplete }: TreasureBoxLayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [randomQnA, setRandomQnA] = useState<Memory | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, duration: number, delay: number, size: number }[]>([]);

  const pianoAudioRef = useRef<HTMLAudioElement | null>(null);
  const creakAudioRef = useRef<HTMLAudioElement | null>(null);

  // Filter QnAs
  const qnaMemories = memories.filter(m => m.type === "treasure_qna");

  useEffect(() => {
    // Generate dust particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
      size: 1 + Math.random() * 3,
    }));
    setParticles(newParticles);

    // Pick random QnA
    if (qnaMemories.length > 0) {
      setRandomQnA(qnaMemories[Math.floor(Math.random() * qnaMemories.length)]);
    } else {
      // Fallback if none exist
      setRandomQnA({
        id: "fallback",
        type: "treasure_qna",
        caption: "What is your most treasured memory?",
        content: "Every moment spent together.",
        posX: 0, posY: 0, rotation: 0
      });
    }

    // Play background piano if available
    if (pianoAudioRef.current) {
      pianoAudioRef.current.volume = 0.4;
      pianoAudioRef.current.play().catch(e => console.log("Piano autoplay blocked:", e));
    }
  }, [qnaMemories]);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    if (hovering && creakAudioRef.current && !showModal) {
      creakAudioRef.current.currentTime = 0;
      creakAudioRef.current.volume = 0.5;
      creakAudioRef.current.play().catch(e => console.log("Creak play blocked:", e));
    }
  };

  const handleBoxClick = () => {
    setShowModal(true);
    // Play creak loudly when opening
    if (creakAudioRef.current) {
      creakAudioRef.current.currentTime = 0;
      creakAudioRef.current.volume = 0.8;
      creakAudioRef.current.play().catch(e => console.log("Creak play blocked:", e));
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-[#1a120c] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Audio Elements */}
      <audio ref={pianoAudioRef} src="/piano.mp3" loop />
      <audio ref={creakAudioRef} src="/creak.mp3" />

      {/* Dim warm lighting background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,120,60,0.2)_0%,rgba(20,15,10,0.9)_100%)] z-0 pointer-events-none" />

      {/* Dust Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-200/40 blur-[1px] pointer-events-none z-10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Scene Container */}
      <div className="relative z-20 w-full max-w-4xl h-[600px] flex items-center justify-center">
        
        {/* Decorative Items around the box */}
        <motion.img 
          src="/handwritten-note.png" 
          className="absolute -left-10 bottom-20 w-48 object-contain opacity-70 rotate-[-15deg] brightness-75 contrast-125 sepia-[.3]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.img 
          src="/dried-flowers.png" 
          className="absolute -right-12 bottom-10 w-56 object-contain opacity-80 rotate-[20deg] brightness-75 sepia-[.2]"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.img 
          src="/old-key.png" 
          className="absolute left-32 top-20 w-32 object-contain opacity-80 rotate-[45deg] brightness-50 contrast-150"
          animate={{ y: [0, -8, 0], rotate: [45, 48, 45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* The Treasure Box */}
        <motion.div
          className="relative cursor-pointer group"
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          onClick={handleBoxClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Subtle Glow Behind Box */}
          <motion.div 
            className="absolute inset-0 bg-amber-500/20 rounded-full blur-[80px] -z-10"
            animate={{ 
              opacity: isHovered ? 0.8 : 0.3,
              scale: isHovered ? 1.2 : 1 
            }}
            transition={{ duration: 0.5 }}
          />

          <motion.img 
            src="/vintage-treasure-box.png" 
            alt="Treasure Box"
            className="w-[400px] md:w-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            animate={{ 
              y: isHovered ? -10 : 0,
              filter: isHovered ? "brightness(1.1) contrast(1.1)" : "brightness(0.9) contrast(1.0)"
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Moving Shadow */}
          <motion.div 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[300px] h-[20px] bg-black/60 blur-[15px] rounded-full -z-20"
            animate={{ 
              width: isHovered ? 250 : 300,
              opacity: isHovered ? 0.4 : 0.6
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </div>

      {/* QnA Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#f4eade] p-10 rounded-xl shadow-[0_0_50px_rgba(255,200,100,0.1)] max-w-lg w-full relative border border-[#d4c5b3]"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* Decorative Frame Line */}
              <div className="absolute inset-3 border border-ink/10 rounded-lg pointer-events-none" />
              
              <h2 className="font-serif text-2xl text-ink font-bold mb-6 text-center italic">
                A Treasured Question
              </h2>
              
              <p className="font-hand text-3xl text-ink mb-8 text-center leading-relaxed">
                {randomQnA?.caption}
              </p>

              <AnimatePresence mode="wait">
                {!showAnswer ? (
                  <motion.div 
                    key="reveal-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <button 
                      onClick={() => setShowAnswer(true)}
                      className="bg-amber-700/80 hover:bg-amber-800 text-[#f4eade] px-8 py-3 rounded-full font-serif tracking-widest uppercase transition-colors shadow-lg"
                    >
                      Reveal Memory
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-col items-center border-t border-ink/10 pt-6"
                  >
                    <p className="font-hand text-2xl text-ink-light mb-8 text-center">
                      {randomQnA?.content}
                    </p>
                    <button 
                      onClick={onComplete}
                      className="bg-ink hover:bg-ink-light text-white px-8 py-3 rounded-full font-serif tracking-widest uppercase transition-colors shadow-lg"
                    >
                      Enter Our Story
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
