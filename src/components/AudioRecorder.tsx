"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Trash2, RotateCcw } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob | null) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    onRecordingComplete(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-ink-light/20 rounded-xl bg-ink/5">
      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <div className="text-2xl font-mono text-ink font-bold">
            {formatTime(recordingTime)}
          </div>
          
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition shadow-lg"
            >
              <Mic size={20} />
              Start Recording
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 bg-ink hover:bg-ink-light text-paper px-6 py-3 rounded-full font-bold transition shadow-lg animate-pulse"
            >
              <Square size={20} />
              Stop Recording
            </button>
          )}
          
          {isRecording && (
            <p className="text-xs text-ink-light animate-pulse">Recording in progress...</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Recording Saved
            </span>
            <button
              type="button"
              onClick={discardRecording}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition"
            >
              <RotateCcw size={14} /> Re-record
            </button>
          </div>
          
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
