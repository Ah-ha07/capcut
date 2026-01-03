import React, { useRef, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { TrackType, Clip } from '../../types';
import { Video, Type, Image as ImageIcon, Volume2 } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { 
    tracks, 
    currentTime, 
    duration, 
    zoom, 
    seek, 
    selectClip, 
    selectedClipId,
    updateClip 
  } = useEditor();
  
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
      // If clicking a clip, don't seek (propagation is stopped in clip click handler)
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left - 200; // 200 is header width
      const time = Math.max(0, clickX / zoom);
      seek(time);
  };

  // Basic Dragging implementation for clips
  // Note: For a robust app, use dnd-kit or react-dnd. Here we do raw events for zero-dep simplicity.
  const [draggingClip, setDraggingClip] = useState<{ id: string, startX: number, originalStart: number } | null>(null);

  const handleClipMouseDown = (e: React.MouseEvent, clip: Clip) => {
      e.stopPropagation();
      selectClip(clip.id);
      setDraggingClip({
          id: clip.id,
          startX: e.clientX,
          originalStart: clip.start
      });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (draggingClip) {
          const deltaX = e.clientX - draggingClip.startX;
          const deltaTime = deltaX / zoom;
          const newStart = Math.max(0, draggingClip.originalStart + deltaTime);
          updateClip(draggingClip.id, { start: newStart });
      }
  };

  const handleMouseUp = () => {
      setDraggingClip(null);
  };

  const getIcon = (type: TrackType) => {
      switch(type) {
          case TrackType.VIDEO: return <Video size={14} />;
          case TrackType.TEXT: return <Type size={14} />;
          case TrackType.IMAGE: return <ImageIcon size={14} />;
          default: return <Volume2 size={14} />;
      }
  };

  const totalWidth = duration * zoom;

  return (
    <div 
        className="h-[300px] bg-[#09090b] border-t border-[#27272a] flex flex-col select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      {/* Time Ruler */}
      <div className="h-8 bg-[#18181b] border-b border-[#27272a] flex items-end">
          <div className="w-[200px] border-r border-[#27272a] h-full bg-[#18181b] z-20"></div>
          <div className="flex-1 relative h-full overflow-hidden" ref={timelineRef} onClick={handleTimelineClick}>
             {/* Simple Ruler Ticks */}
             <div className="absolute inset-0" style={{ transform: `translateX(0px)` }}>
                 {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                     <div key={i} className="absolute bottom-0 h-3 border-l border-zinc-600 text-[10px] pl-1 text-zinc-500" style={{ left: i * zoom }}>
                         {i}s
                     </div>
                 ))}
             </div>
             {/* Playhead */}
             <div 
                className="absolute top-0 bottom-0 w-[1px] bg-[#22d3ee] z-10 pointer-events-none"
                style={{ left: currentTime * zoom }}
             >
                <div className="w-3 h-3 bg-[#22d3ee] -ml-[5px] rotate-45 transform -translate-y-1/2"></div>
             </div>
          </div>
      </div>

      {/* Tracks Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {tracks.map((track) => (
              <div key={track.id} className="flex h-16 border-b border-[#27272a] group">
                  {/* Track Header */}
                  <div className="w-[200px] bg-[#18181b] border-r border-[#27272a] p-3 flex items-center gap-3 shrink-0 z-20">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-zinc-800 text-zinc-400">
                          {getIcon(track.type)}
                      </div>
                      <span className="text-xs font-medium text-zinc-300 truncate">{track.name}</span>
                  </div>

                  {/* Track Content */}
                  <div 
                    className="flex-1 relative bg-[#09090b]"
                    onClick={handleTimelineClick}
                  >
                      {track.clips.map((clip) => (
                          <div
                            key={clip.id}
                            onMouseDown={(e) => handleClipMouseDown(e, clip)}
                            className={`absolute top-2 bottom-2 rounded-md overflow-hidden cursor-move border transition-colors flex items-center px-2
                                ${selectedClipId === clip.id ? 'border-[#22d3ee] bg-[#22d3ee]/20' : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'}
                            `}
                            style={{
                                left: clip.start * zoom,
                                width: clip.duration * zoom,
                            }}
                          >
                             {/* Clip label */}
                             <span className="text-[10px] text-zinc-300 truncate pointer-events-none select-none w-full block">
                                 {clip.name || clip.content || 'Clip'}
                             </span>
                             
                             {/* Resize handles (Visual Only for this demo) */}
                             <div className="absolute left-0 top-0 bottom-0 w-2 hover:bg-white/20 cursor-w-resize"></div>
                             <div className="absolute right-0 top-0 bottom-0 w-2 hover:bg-white/20 cursor-e-resize"></div>
                          </div>
                      ))}
                      
                      {/* Playhead Line extending down */}
                      <div 
                        className="absolute top-0 bottom-0 w-[1px] bg-[#22d3ee]/50 pointer-events-none z-0"
                        style={{ left: currentTime * zoom }}
                      />
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
