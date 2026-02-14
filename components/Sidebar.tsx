import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Briefcase, 
  Settings,
  Menu,
  X,
  Globe
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, toggleSidebar }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: ViewState.TEXT_STUDIO, label: 'Studio Texte', icon: MessageSquareText },
    { id: ViewState.IMAGE_STUDIO, label: 'Studio Graphique', icon: ImageIcon },
    { id: ViewState.VIDEO_STUDIO, label: 'Studio Vidéo', icon: Video },
    { id: ViewState.AUDIO_STUDIO, label: 'Studio Audio', icon: Mic },
    { id: ViewState.WEB_STUDIO, label: 'Générateur Web', icon: Globe },
    { id: ViewState.BUSINESS_STRATEGY, label: 'Business & Stratégie', icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">
              AFRIGEN AI
            </span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-8 mt-8 border-t border-slate-800">
             <button
              onClick={() => onNavigate(ViewState.SETTINGS)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === ViewState.SETTINGS
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Paramètres</span>
            </button>
          </div>

          <div className="mt-auto pt-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-semibold text-white mb-1">Plan Premium</h4>
              <p className="text-xs text-slate-400 mb-3">Accès illimité à Veo et Gemini Pro.</p>
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity">
                METTRE À NIVEAU
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
