import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { TextStudio } from './views/TextStudio';
import { ImageStudio } from './views/ImageStudio';
import { VideoStudio } from './views/VideoStudio';
import { AudioStudio } from './views/AudioStudio';
import { BusinessStudio } from './views/BusinessStudio';
import { WebStudio } from './views/WebStudio';
import { ViewState } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.TEXT_STUDIO:
        return <TextStudio />;
      case ViewState.IMAGE_STUDIO:
        return <ImageStudio />;
      case ViewState.VIDEO_STUDIO:
        return <VideoStudio />;
      case ViewState.AUDIO_STUDIO:
        return <AudioStudio />;
      case ViewState.WEB_STUDIO:
        return <WebStudio />;
      case ViewState.BUSINESS_STRATEGY:
        return <BusinessStudio />;
      case ViewState.SETTINGS:
        return <div className="p-10 text-center text-slate-400">Paramètres - Bientôt disponible</div>;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-purple-500 selection:text-white">
      
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-64 transition-all duration-300 relative h-full">
        {/* Mobile Header Toggle */}
        <div className="md:hidden p-4 flex items-center border-b border-slate-800 bg-slate-900">
           <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300">
              <Menu size={24} />
           </button>
           <span className="ml-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">AFRIGEN AI</span>
        </div>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden relative">
          {renderView()}
        </div>
      </main>

    </div>
  );
};

export default App;
