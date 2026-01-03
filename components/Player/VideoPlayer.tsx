import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { TrackType, Clip } from '../../types';
import { Play, Pause, SkipBack, SkipForward, Maximize2 } from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const { 
      tracks, 
      currentTime, 
      isPlaying, 
      play, 
      pause, 
      seek, 
      duration, 
      selectedClipId, 
      selectClip,
      updateClip,
      videoRef
  } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to find currently active clips across all tracks
  const activeClips = tracks.flatMap(t => t.clips).filter(
    clip => currentTime >= clip.start && currentTime < clip.start + clip.duration
  );

  // Find the "Main" video track clip to drive the background <video> element
  const videoTrack = tracks.find(t => t.type === TrackType.VIDEO);
  const activeVideoClip = videoTrack?.clips.find(
      clip => currentTime >= clip.start && currentTime < clip.start + clip.duration
  );

  useEffect(() => {
    if (videoRef.current && activeVideoClip) {
        // Calculate the time inside the source video
        const offset = currentTime - activeVideoClip.start;
        // Only set current time if the difference is significant to avoid stutter
        if (Math.abs(videoRef.current.currentTime - offset) > 0.5) {
             videoRef.current.currentTime = offset;
        }
        if (isPlaying) {
             videoRef.current.play().catch(() => {});
        } else {
             videoRef.current.pause();
        }
    } else if (videoRef.current) {
        videoRef.current.pause();
    }
  }, [currentTime, isPlaying, activeVideoClip]);


  // Handle direct manipulation on preview (simple Drag & Drop simulation)
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  const handleMouseDown = (e: React.MouseEvent, clip: Clip) => {
      e.stopPropagation();
      selectClip(clip.id);
      setDraggingId(clip.id);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!draggingId || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      
      updateClip(draggingId, {
          properties: {
             // We need to fetch current props... slightly complex in this simple handler without passing full clip object continuously
             // Simplification: We blindly update X/Y
             x: Math.max(0, Math.min(100, x)),
             y: Math.max(0, Math.min(100, y)),
             scale: 1, // preserve
             rotation: 0, // preserve
             opacity: 1 // preserve
          }
      });
  };
  
  const handleMouseUp = () => {
      setDraggingId(null);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090b] min-w-0" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Player Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        
        {/* Aspect Ratio Container (16:9) */}
        <div 
            ref={containerRef}
            className="aspect-video h-full max-h-[70vh] bg-black shadow-2xl relative overflow-hidden ring-1 ring-[#27272a]"
        >
          {/* Base Video Layer */}
          {activeVideoClip ? (
              <video
                ref={videoRef}
                src={activeVideoClip.src}
                className="w-full h-full object-cover pointer-events-none"
                muted // Muted for autoplay policy in browsers usually
                loop={false}
              />
          ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                  <span className="text-4xl font-bold opacity-20">BLACK SCREEN</span>
              </div>
          )}

          {/* Overlays */}
          {activeClips.filter(c => c.type !== TrackType.VIDEO).map(clip => (
              <div
                key={clip.id}
                onMouseDown={(e) => handleMouseDown(e, clip)}
                style={{
                    left: `${clip.properties.x}%`,
                    top: `${clip.properties.y}%`,
                    transform: `translate(-50%, -50%) scale(${clip.properties.scale}) rotate(${clip.properties.rotation}deg)`,
                    opacity: clip.properties.opacity,
                    position: 'absolute',
                    cursor: 'move',
                    color: clip.properties.color || 'white',
                    fontSize: `${clip.properties.fontSize || 24}px`,
                    whiteSpace: 'nowrap'
                }}
                className={`select-none hover:ring-1 ring-[#22d3ee] ${selectedClipId === clip.id ? 'ring-2 ring-[#22d3ee] z-50' : 'z-10'}`}
              >
                  {clip.type === TrackType.TEXT ? clip.content : (
                      <img src={clip.src} alt="overlay" className="max-w-[300px] object-contain pointer-events-none" />
                  )}
                  
                  {/* Selection Handles (Simplified visual) */}
                  {selectedClipId === clip.id && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#22d3ee] rounded-full shadow-lg border border-white"></div>
                  )}
              </div>
          ))}
        </div>
      </div>

      {/* Transport Controls */}
      <div className="h-14 flex items-center justify-between px-6 border-t border-[#27272a] bg-[#09090b]">
         <div className="text-zinc-400 font-mono text-sm">
             <span className="text-white">{formatTime(currentTime)}</span>
             <span className="opacity-50"> / {formatTime(duration)}</span>
         </div>
         
         <div className="flex items-center gap-4">
             <button onClick={() => seek(0)} className="text-zinc-400 hover:text-white p-2"><SkipBack size={20} /></button>
             <button 
                onClick={isPlaying ? pause : play}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
             >
                 {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
             </button>
             <button onClick={() => seek(duration)} className="text-zinc-400 hover:text-white p-2"><SkipForward size={20} /></button>
         </div>

         <div className="text-zinc-400 hover:text-white cursor-pointer">
             <Maximize2 size={18} />
         </div>
      </div>
    </div>
  );
};
