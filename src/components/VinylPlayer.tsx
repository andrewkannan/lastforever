"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music } from "lucide-react";

interface VinylPlayerProps {
  position?: { x: number; y: number };
  audioSrc?: string | null;
  spotifyId?: string | null;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
    SpotifyIframeApi?: any;
  }
}

export default function VinylPlayer({ position = { x: 100, y: 100 }, audioSrc, spotifyId }: VinylPlayerProps) {
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const embedControllerRef = useRef<any>(null);

  useEffect(() => {
    if (audioSrc && !spotifyId) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [audioSrc, spotifyId]);

  useEffect(() => {
    if (!spotifyId) return;

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById('spotify-iframe-container');
      if (!element) return;
      
      const options = {
        uri: spotifyId.includes('spotify:') ? spotifyId : `spotify:track:${spotifyId}`,
        width: '100%',
        height: '152',
        theme: '0'
      };
      
      const callback = (EmbedController: any) => {
        EmbedController.addListener('playback_update', (e: any) => {
          setIsPlaying(!e.data.isPaused);
        });
        embedControllerRef.current = EmbedController;
      };
      
      IFrameAPI.createController(element, options, callback);
    };

    if (!document.getElementById('spotify-iframe-api-script')) {
      const script = document.createElement('script');
      script.id = 'spotify-iframe-api-script';
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.SpotifyIframeApi) {
      window.onSpotifyIframeApiReady(window.SpotifyIframeApi);
    }
  }, [spotifyId]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (embedControllerRef.current) {
      embedControllerRef.current.togglePlay();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const hasSpotify = !!spotifyId;

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
      className="absolute bg-[#eaddcf] p-4 rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border border-[#d4c5b3] cursor-grab active:cursor-grabbing hover:z-50 flex flex-col gap-4 w-[320px]"
    >
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif text-lg text-ink font-bold flex items-center gap-2">
          <Music size={18} /> Our Soundtrack
        </h3>
      </div>

      <div className="relative w-full h-[240px] bg-[#3a322c] rounded-lg shadow-inner overflow-hidden flex items-center justify-center border-4 border-[#241e1a]">
        
        {/* Wood texture inside */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none mix-blend-overlay" />

        {/* Turntable Platter */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[#111] shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-[#222]" />

        {/* Vinyl Record */}
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-[190px] h-[190px] rounded-full bg-black shadow-xl flex items-center justify-center border-2 border-[#1a1a1a]"
        >
          {/* Grooves */}
          <div className="absolute w-[170px] h-[170px] rounded-full border border-white/10" />
          <div className="absolute w-[150px] h-[150px] rounded-full border border-white/5" />
          <div className="absolute w-[130px] h-[130px] rounded-full border border-white/10" />
          <div className="absolute w-[110px] h-[110px] rounded-full border border-white/5" />
          <div className="absolute w-[90px] h-[90px] rounded-full border border-white/10" />
          
          {/* Center Label */}
          <div className="absolute w-[60px] h-[60px] rounded-full bg-rose-soft/80 flex items-center justify-center shadow-inner">
             <div className="w-2 h-2 rounded-full bg-black" />
             <span className="absolute text-[8px] font-sans font-bold text-white uppercase top-2 tracking-widest opacity-80">Forever</span>
          </div>
        </motion.div>

        {/* Tonearm */}
        <motion.div 
          className="absolute top-4 right-4 origin-top-right w-2 h-[120px] bg-silver/80 rounded-full shadow-lg"
          style={{ zIndex: 10 }}
          animate={{ rotate: isPlaying ? 25 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          {/* Pivot */}
          <div className="absolute -top-3 -right-2 w-6 h-6 rounded-full bg-[#222] border-2 border-gray-400 shadow-xl" />
          {/* Stylus head */}
          <div className="absolute bottom-0 -left-1 w-4 h-8 bg-black rounded-sm shadow-md" />
        </motion.div>

        {/* Play Button Overlay */}
        <button 
          onClick={togglePlay}
          className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all shadow-xl z-20"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      {hasSpotify && (
        <div className="w-full h-[152px] rounded-xl overflow-hidden shadow-inner bg-ink" id="spotify-iframe-container">
          {/* The Spotify Iframe API will inject the iframe here */}
        </div>
      )}
      
      {!audioSrc && !hasSpotify && (
        <p className="text-xs text-ink-light/60 text-center italic">
          No music configured. Upload audio in Admin Settings.
        </p>
      )}
    </motion.div>
  );
}
