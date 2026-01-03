import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { TrackType } from '../../types';
import { Trash2, XCircle, Type, Move, RotateCw, Layers } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedClipId, tracks, updateClip, deleteClip } = useEditor();
  
  const selectedClip = tracks.flatMap(t => t.clips).find(c => c.id === selectedClipId);

  if (!selectedClip) {
      return (
          <div className="w-[300px] bg-[#18181b] border-l border-[#27272a] p-8 flex flex-col items-center justify-center text-zinc-500">
              <span className="text-sm">Select a clip to edit</span>
          </div>
      );
  }

  const handleChange = (field: string, value: any) => {
      // If it's a property inside 'properties' object
      if (['x', 'y', 'scale', 'rotation', 'opacity', 'color', 'fontSize'].includes(field)) {
          updateClip(selectedClip.id, {
              properties: { ...selectedClip.properties, [field]: value }
          });
      } else {
          // Top level property
          updateClip(selectedClip.id, { [field]: value });
      }
  };

  return (
    <div className="w-[300px] bg-[#18181b] border-l border-[#27272a] flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
            <h2 className="font-semibold text-white">Properties</h2>
            <button 
                onClick={() => deleteClip(selectedClip.id)}
                className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded"
            >
                <Trash2 size={16} />
            </button>
        </div>

        <div className="p-4 space-y-6">
            {/* Common Transform Props */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Move size={12} /> Transform
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Position X (%)</label>
                        <input 
                            type="number" 
                            className="w-full bg-[#09090b] border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200 focus:border-[#22d3ee] outline-none"
                            value={Math.round(selectedClip.properties.x)}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Position Y (%)</label>
                        <input 
                            type="number" 
                            className="w-full bg-[#09090b] border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200 focus:border-[#22d3ee] outline-none"
                            value={Math.round(selectedClip.properties.y)}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-zinc-500 flex justify-between">
                        <span>Scale</span>
                        <span>{selectedClip.properties.scale.toFixed(1)}x</span>
                    </label>
                    <input 
                        type="range" min="0.1" max="5" step="0.1"
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#22d3ee]"
                        value={selectedClip.properties.scale}
                        onChange={(e) => handleChange('scale', Number(e.target.value))}
                    />
                </div>
                
                <div className="space-y-1">
                     <label className="text-xs text-zinc-500 flex justify-between">
                        <span>Rotation</span>
                        <span>{Math.round(selectedClip.properties.rotation)}°</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <RotateCw size={14} className="text-zinc-500"/>
                        <input 
                            type="range" min="-180" max="180"
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#22d3ee]"
                            value={selectedClip.properties.rotation}
                            onChange={(e) => handleChange('rotation', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full h-[1px] bg-[#27272a]"></div>

            {/* Opacity */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase font-bold tracking-wider mb-2">
                    <Layers size={12} /> Blend
                </div>
                <div className="space-y-1">
                     <label className="text-xs text-zinc-500 flex justify-between">
                        <span>Opacity</span>
                        <span>{Math.round(selectedClip.properties.opacity * 100)}%</span>
                    </label>
                    <input 
                        type="range" min="0" max="1" step="0.01"
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#22d3ee]"
                        value={selectedClip.properties.opacity}
                        onChange={(e) => handleChange('opacity', Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Text Specific */}
            {selectedClip.type === TrackType.TEXT && (
                <>
                    <div className="w-full h-[1px] bg-[#27272a]"></div>
                    <div className="space-y-4">
                         <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase font-bold tracking-wider mb-2">
                            <Type size={12} /> Text
                        </div>
                        <div className="space-y-1">
                            <textarea 
                                className="w-full bg-[#09090b] border border-zinc-700 rounded px-2 py-2 text-sm text-zinc-200 focus:border-[#22d3ee] outline-none resize-none"
                                rows={3}
                                value={selectedClip.content || ''}
                                onChange={(e) => handleChange('content', e.target.value)}
                            />
                        </div>
                         <div className="space-y-1">
                             <label className="text-xs text-zinc-500">Color</label>
                             <div className="flex gap-2">
                                 <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    value={selectedClip.properties.color || '#ffffff'}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                 />
                                 <input 
                                     type="text" 
                                     className="flex-1 bg-[#09090b] border border-zinc-700 rounded px-2 text-sm uppercase text-zinc-400"
                                     value={selectedClip.properties.color || '#ffffff'}
                                     readOnly
                                 />
                             </div>
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs text-zinc-500">Size</label>
                             <input 
                                type="number" 
                                className="w-full bg-[#09090b] border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-200 focus:border-[#22d3ee] outline-none"
                                value={selectedClip.properties.fontSize || 24}
                                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                             />
                        </div>
                    </div>
                </>
            )}

        </div>
    </div>
  );
};
