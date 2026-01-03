export enum TrackType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  OVERLAY = 'OVERLAY'
}

export interface Clip {
  id: string;
  trackId: number;
  type: TrackType;
  name: string;
  start: number; // Start time in seconds on the timeline
  duration: number; // Duration in seconds
  src?: string; // URL for video/image
  content?: string; // Text content for text layers
  properties: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    opacity: number;
    color?: string;
    fontSize?: number;
  };
}

export interface Track {
  id: number;
  type: TrackType;
  name: string;
  clips: Clip[];
}

export interface EditorState {
  tracks: Track[];
  currentTime: number;
  duration: number; // Total project duration
  isPlaying: boolean;
  selectedClipId: string | null;
  zoom: number; // Pixels per second
}

export interface DragItem {
  type: 'CLIP' | 'ASSET';
  id?: string;
  src?: string;
}