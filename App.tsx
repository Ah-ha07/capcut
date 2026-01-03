import React from 'react';
import { EditorProvider } from './context/EditorContext';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { VideoPlayer } from './components/Player/VideoPlayer';
import { Timeline } from './components/Timeline/Timeline';
import { PropertiesPanel } from './components/Panels/PropertiesPanel';

const App: React.FC = () => {
  return (
    <EditorProvider>
      <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="shrink-0 z-20">
            <Sidebar />
          </div>

          {/* Center Workspace */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Player Area */}
            <div className="flex-1 flex min-h-0">
               <VideoPlayer />
               <PropertiesPanel />
            </div>

            {/* Timeline Area */}
            <div className="shrink-0 z-10 relative">
               <Timeline />
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default App;
