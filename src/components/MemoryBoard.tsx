"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Polaroid from "./Polaroid";
import Note from "./Note";
import MemoryModal from "./MemoryModal";
import LoveLetterDrawer from "./LoveLetterDrawer";
import TimelineSection from "./TimelineSection";
import FutureSection from "./FutureSection";
import EnvironmentLayers from "./EnvironmentLayers";
import EasterEgg from "./EasterEgg";
import VinylPlayer from "./VinylPlayer";
import CassetteTape from "./CassetteTape";
import RelationshipStats from "./RelationshipStats";
import CameraRoll from "./CameraRoll";

export default function MemoryBoard({ 
  initialMemories,
  isAdmin = false,
  onEdit
}: { 
  initialMemories: any[],
  isAdmin?: boolean,
  onEdit?: (memory: any) => void
}) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

  // Filter memories from DB or fallback
  const letterMemory = initialMemories.find(m => m.type === "letter") || {
    id: "drawer",
    type: "letter",
    content: "I promise to love you forever and always...",
    posX: 900,
    posY: 800,
    rotation: 0
  };

  const timelinePos = { x: 1600, y: 300 };
  const futurePos = { x: 2300, y: 800 };

  const timelineMemories = initialMemories.filter(m => m.type === "timeline").sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const futureMemories = initialMemories.filter(m => m.type === "future");
  const cassetteMemories = initialMemories.filter(m => m.type === "cassette");
  const photoMemories = initialMemories.filter(m => m.type === "photo");

  // Global settings for Vinyl and Relationship Stats
  const settingsMemory = initialMemories.find(m => m.type === "settings");
  const anniversaryDate = settingsMemory?.date || "17 march 2026";
  const vinylAudioSrc = settingsMemory?.imageBase64 || null; // MP3 file
  const vinylSpotifyId = settingsMemory?.songSpotifyId || null; // Spotify link

  const handleItemClick = (memory: any) => {
    if (isAdmin && onEdit) {
      onEdit(memory);
    } else {
      setSelectedMemory(memory);
    }
  };

  return (
    <>
      <div className="w-full h-full overflow-hidden bg-background relative">
        <EnvironmentLayers />
        
        <TransformWrapper
          initialScale={1}
          initialPositionX={-500}
          initialPositionY={-200}
          minScale={0.3}
          maxScale={2}
          limitToBounds={false}
          panning={{ excluded: ["cursor-grab"] }}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent wrapperClass="!w-full !h-full z-10" contentClass="w-[4000px] h-[3000px] cursor-grab active:cursor-grabbing">
            <div 
              className="w-full h-full relative"
              ref={constraintsRef}
            >
              <RelationshipStats position={{ x: 100, y: 100 }} startDate={anniversaryDate} />
              <VinylPlayer position={{ x: 100, y: 350 }} audioSrc={vinylAudioSrc} spotifyId={vinylSpotifyId} />
              <CameraRoll position={{ x: 400, y: 800 }} memories={photoMemories} />

              <LoveLetterDrawer 
                memory={{...letterMemory, position: {x: letterMemory.posX, y: letterMemory.posY}}} 
                onClick={handleItemClick} 
              />
              <TimelineSection 
                position={timelinePos} 
                memories={timelineMemories} 
                onClickItem={isAdmin ? onEdit : undefined}
              />
              <FutureSection 
                position={futurePos} 
                memories={futureMemories} 
                onClickItem={isAdmin ? onEdit : undefined}
              />
              
              {initialMemories.map((m) => {
                if (m.type === "letter" || m.type === "timeline" || m.type === "future" || m.type === "settings") return null;

                const memory = {
                  ...m,
                  position: { x: m.posX, y: m.posY },
                  imageUrl: m.imageBase64 || m.imageUrl,
                  song: m.songSpotifyId ? { spotifyId: m.songSpotifyId } : null
                };

                if (m.type === "note") {
                  return <EasterEgg key={m.id} memory={memory} onClick={handleItemClick} />;
                }
                
                if (m.type === "cassette") {
                  return <CassetteTape key={m.id} memory={memory} onClick={handleItemClick} />;
                }

                if (memory.type === "photo") {
                  return <Polaroid key={memory.id} memory={memory} onClick={handleItemClick} />;
                }
                return null;
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {!isAdmin && (
        <MemoryModal 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
        />
      )}
    </>
  );
}
