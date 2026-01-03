import React, { useState } from 'react';
import { Download, ChevronLeft, LayoutTemplate, Share2 } from 'lucide-react';

export const Header: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setIsExporting(true);
    setProgress(0);
    // Simulate export
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => setIsExporting(false), 500);
                return 100;
            }
            return prev + 5;
        });
    }, 100);
  };

  return (
    <div className="h-14 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between px-4 z-50 relative">
      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-white">
            <ChevronLeft size={20} />
        </button>
        <div className="h-6 w-[1px] bg-zinc-800"></div>
        <div className="flex items-center gap-2 text-zinc-100 font-semibold">
            <LayoutTemplate size={18} className="text-[#22d3ee]" />
            <span>Project Untitled-1</span>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#18181b] rounded-full px-4 py-1.5 border border-[#27272a]">
         <span className="text-xs text-zinc-400">1920x1080 • 30fps</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800">
            <Share2 size={18} />
        </button>
        <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#22d3ee] hover:bg-[#06b6d4] text-black text-sm font-semibold px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
        >
            {isExporting ? (
                <>
                   <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                   <span>{progress}%</span>
                </>
            ) : (
                <>
                    <span>Export</span>
                    <Download size={16} />
                </>
            )}
        </button>
      </div>
    </div>
  );
};
