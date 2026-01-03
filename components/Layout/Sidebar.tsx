import React, { useState } from 'react';
import { Layout, Type, Image as ImageIcon, Sparkles, Music, Upload, Film, Wand2 } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { TrackType } from '../../types';
import { generateAIAsset } from '../../services/geminiService';

const TABS = [
  { id: 'media', icon: Film, label: 'Media' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'ai', icon: Sparkles, label: 'AI Gen' },
  { id: 'stickers', icon: ImageIcon, label: 'Stickers' },
];

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('media');
  const { addClip } = useEditor();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, type: string, src?: string) => {
    e.dataTransfer.setData('type', type);
    if (src) e.dataTransfer.setData('src', src);
  };

  const handleGenerate = async () => {
      if (!prompt) return;
      setIsGenerating(true);
      try {
          const url = await generateAIAsset(prompt);
          setGeneratedImages(prev => [url, ...prev]);
      } catch (e) {
          alert('Failed to generate image. Try again.');
      } finally {
          setIsGenerating(false);
      }
  };

  const addToTimeline = (type: TrackType, src?: string, content?: string) => {
     // Find appropriate track
     let trackId = 1;
     if (type === TrackType.TEXT) trackId = 2;
     if (type === TrackType.IMAGE) trackId = 3;
     if (type === TrackType.VIDEO) trackId = 1;

     addClip(trackId, {
         type,
         src,
         content,
         name: type === TrackType.TEXT ? 'New Text' : 'New Asset'
     });
  };

  return (
    <div className="flex h-full bg-[#18181b] border-r border-[#27272a]">
      {/* Icon Rail */}
      <div className="w-16 flex flex-col items-center py-4 gap-4 border-r border-[#27272a] bg-[#09090b]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-[#22d3ee] bg-[#22d3ee]/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Drawer Content */}
      <div className="w-[300px] flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-[#27272a]">
            <h2 className="text-lg font-semibold text-white capitalize">{activeTab}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {activeTab === 'media' && (
                <div className="grid grid-cols-2 gap-3">
                    <button className="col-span-2 border border-dashed border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-500 hover:bg-zinc-900 transition-colors">
                        <Upload size={24} className="mb-2"/>
                        <span className="text-xs">Import Media</span>
                    </button>
                    {/* Demo Assets */}
                    {[
                        'https://images.pexels.com/photos/20857398/pexels-photo-20857398.jpeg',
                        'https://images.pexels.com/photos/17650537/pexels-photo-17650537.jpeg'
                    ].map((src, i) => (
                        <div key={i} className="aspect-square bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-[#22d3ee]" onClick={() => addToTimeline(TrackType.IMAGE, src)}>
                            <img src={src} className="w-full h-full object-cover" alt="asset" />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'text' && (
                <div className="space-y-3">
                     <div 
                        onClick={() => addToTimeline(TrackType.TEXT, undefined, 'Default Text')}
                        className="p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 border border-zinc-700 text-center"
                     >
                        <span className="text-xl font-bold text-white">Default Text</span>
                     </div>
                     <div 
                        onClick={() => addToTimeline(TrackType.TEXT, undefined, 'Neon Title')}
                        className="p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 border border-zinc-700 text-center"
                     >
                        <span className="text-xl font-bold text-[#22d3ee] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Neon Title</span>
                     </div>
                     <div 
                        onClick={() => addToTimeline(TrackType.TEXT, undefined, 'Cinematic')}
                        className="p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 border border-zinc-700 text-center"
                     >
                        <span className="text-xl font-serif tracking-widest text-white uppercase">Cinematic</span>
                     </div>
                </div>
            )}

            {activeTab === 'ai' && (
                <div className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300">
                            <Wand2 size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">AI Generator</span>
                        </div>
                        <textarea 
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-400 resize-none h-24 mb-3"
                            placeholder="Describe an image to generate..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button 
                            disabled={isGenerating || !prompt}
                            onClick={handleGenerate}
                            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles size={16} />}
                            Generate
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {generatedImages.map((src, i) => (
                             <div key={i} className="relative group aspect-square bg-zinc-900 rounded-lg overflow-hidden cursor-pointer" onClick={() => addToTimeline(TrackType.IMAGE, src)}>
                                <img src={src} className="w-full h-full object-cover" alt="generated" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">Add</span>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

             {activeTab === 'stickers' && (
                <div className="grid grid-cols-3 gap-2">
                    {/* Placeholder Stickers */}
                    {[1,2,3,4,5,6].map((i) => (
                        <div 
                            key={i} 
                            onClick={() => addToTimeline(TrackType.IMAGE, `https://picsum.photos/seed/${i + 100}/200`)}
                            className="aspect-square bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 flex items-center justify-center"
                        >
                            <img src={`https://picsum.photos/seed/${i + 100}/200`} className="w-full h-full object-cover rounded-lg" alt="sticker"/>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
