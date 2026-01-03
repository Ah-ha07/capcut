import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { EditorState, Track, Clip, TrackType } from '../types';
import { INITIAL_TRACKS, INITIAL_DURATION, PIXELS_PER_SECOND_DEFAULT } from '../constants';

interface EditorContextType extends EditorState {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  addClip: (trackId: number, clip: Partial<Clip>) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  selectClip: (clipId: string | null) => void;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  deleteClip: (clipId: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>; // Shared ref for the main video player sync
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [zoom] = useState(PIXELS_PER_SECOND_DEFAULT);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Animation loop for playback
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (!isPlaying) return;
      
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaTime;
        if (nextTime >= INITIAL_DURATION) {
          setIsPlaying(false);
          return 0; // Loop or stop
        }
        return nextTime;
      });
      
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
        // Sync video element if it exists and is drifting too much (simple sync)
        if (videoRef.current) {
             // If we are playing a video clip, we might need to sync the HTML5 video tag to our react state
             // This is complex for a multi-clip editor, so we often drive the video element *from* the state in the component
        }
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  
  const seek = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, INITIAL_DURATION)));
    // If playing, we might pause or just let it continue from new time
  }, []);

  const addClip = useCallback((trackId: number, clip: Partial<Clip>) => {
    const newClip: Clip = {
        id: `clip-${Date.now()}`,
        trackId,
        type: TrackType.IMAGE, // Default fallback
        name: 'New Clip',
        start: currentTime,
        duration: 5,
        properties: { x: 50, y: 50, scale: 1, rotation: 0, opacity: 1 },
        ...clip
    } as Clip;

    setTracks(prev => prev.map(track => {
        if (track.id === trackId) {
            return { ...track, clips: [...track.clips, newClip] };
        }
        return track;
    }));
    
    setSelectedClipId(newClip.id);
  }, [currentTime]);

  const updateClip = useCallback((clipId: string, updates: Partial<Clip>) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(c => c.id === clipId ? { ...c, ...updates, properties: { ...c.properties, ...(updates.properties || {}) } } : c)
    })));
  }, []);

  const deleteClip = useCallback((clipId: string) => {
      setTracks(prev => prev.map(track => ({
          ...track,
          clips: track.clips.filter(c => c.id !== clipId)
      })));
      setSelectedClipId(null);
  }, []);

  const selectClip = useCallback((id: string | null) => setSelectedClipId(id), []);

  return (
    <EditorContext.Provider value={{
      tracks,
      setTracks,
      currentTime,
      duration: INITIAL_DURATION,
      isPlaying,
      selectedClipId,
      zoom,
      play,
      pause,
      seek,
      addClip,
      updateClip,
      selectClip,
      deleteClip,
      videoRef
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used within EditorProvider");
  return context;
};
