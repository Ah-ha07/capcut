import { TrackType, Track } from './types';

export const INITIAL_DURATION = 30; // 30 seconds default
export const PIXELS_PER_SECOND_DEFAULT = 40;

// Demo Initial State
export const INITIAL_TRACKS: Track[] = [
  {
    id: 1,
    type: TrackType.VIDEO,
    name: "Main Track",
    clips: [
      {
        id: 'clip-1',
        trackId: 1,
        type: TrackType.VIDEO,
        name: 'Nature Background',
        start: 0,
        duration: 15,
        src: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4', // Reliable placeholder video
        properties: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }
      },
      {
        id: 'clip-2',
        trackId: 1,
        type: TrackType.VIDEO,
        name: 'City Life',
        start: 15,
        duration: 10,
        src: 'https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4',
        properties: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }
      }
    ]
  },
  {
    id: 2,
    type: TrackType.TEXT,
    name: "Text Overlay",
    clips: [
      {
        id: 'clip-text-1',
        trackId: 2,
        type: TrackType.TEXT,
        name: 'Title Card',
        start: 1,
        duration: 5,
        content: 'WELCOME TO CAPCUT CLONE',
        properties: { x: 50, y: 50, scale: 1, rotation: 0, opacity: 1, color: '#ffffff', fontSize: 60 }
      }
    ]
  },
  {
    id: 3,
    type: TrackType.IMAGE,
    name: "Stickers/Images",
    clips: []
  }
];
