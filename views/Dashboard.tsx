import React from 'react';
import { ViewState } from '../types';
import { MessageSquareText, Image, Video, Mic, ArrowRight, Zap, TrendingUp, Users, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const data = [
  { name: 'Lun', usage: 400 },
  { name: 'Mar', usage: 300 },
  { name: 'Mer', usage: 600 },
  { name: 'Jeu', usage: 800 },
  { name: 'Ven', usage: 500 },
  { name: 'Sam', usage: 900 },
  { name: 'Dim', usage: 700 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 p-8 md:p-12 text-white shadow-2xl border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-4">
            <Zap size={12} className="text-yellow-400" />
            <span>Moteur IA Mis à jour : Gemini 3 Pro</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Le Futur de la Création <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Est Africain
            </span>
          </h1>
          <p className="text-lg text-purple-100 mb-8 opacity-90">
            Afrigen AI Ultimate vous donne les super-pouvoirs pour créer, automatiser et monétiser votre contenu instantanément.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate(ViewState.TEXT_STUDIO)}
              className="px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              Créer maintenant <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-purple-500 fill-current">
                <path fill="#8B5CF6" d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54.5,18.7C51.6,29.3,41.8,38.7,30.8,45.8C19.8,52.9,7.6,57.8,-3.8,63.1C-15.3,68.4,-25.9,74.1,-36.4,70.9C-46.9,67.7,-57.3,55.6,-64.8,42.2C-72.3,28.8,-76.9,14.4,-73.4,1.8C-69.8,-10.8,-58.1,-21.6,-47.5,-30.3C-36.9,-39,-27.4,-45.6,-17.5,-48.9C-7.6,-52.2,2.7,-52.2,12.9,-52.1Z" transform="translate(100 100)" />
            </svg>
        </div>
      </div>

      {/* Stats & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Utilisation des jetons</h3>
            <span className="text-xs text-slate-400">Derniers 7 jours</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="usage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-400">Projets Créés</p>
                    <h4 className="text-3xl font-bold text-white mt-1">128</h4>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                    <TrendingUp />
                </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-400">Communauté</p>
                    <h4 className="text-3xl font-bold text-white mt-1">2.4k</h4>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                    <Users />
                </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="font-bold text-lg mb-1">Passer Premium</p>
                <p className="text-sm opacity-90 mb-3">Accédez à Veo, Imagen 3 et plus.</p>
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors">
                    Voir les plans
                </button>
            </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <h3 className="text-xl font-bold text-white">Modules de Création</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickCard 
            icon={MessageSquareText} 
            title="Texte & Copy" 
            desc="Articles, scripts, traductions" 
            color="bg-blue-500" 
            onClick={() => onNavigate(ViewState.TEXT_STUDIO)} 
        />
        <QuickCard 
            icon={Globe} 
            title="Web & App" 
            desc="Sites Vitrines, E-commerce, École" 
            color="bg-cyan-500" 
            onClick={() => onNavigate(ViewState.WEB_STUDIO)} 
        />
        <QuickCard 
            icon={Image} 
            title="Design Studio" 
            desc="Logos, flyers, art numérique" 
            color="bg-purple-500" 
            onClick={() => onNavigate(ViewState.IMAGE_STUDIO)} 
        />
        <QuickCard 
            icon={Video} 
            title="Générateur Vidéo" 
            desc="Clips promotionnels par Veo" 
            color="bg-amber-500" 
            onClick={() => onNavigate(ViewState.VIDEO_STUDIO)} 
        />
        <QuickCard 
            icon={Mic} 
            title="Audio & Voix" 
            desc="Narrations et podcasts" 
            color="bg-green-500" 
            onClick={() => onNavigate(ViewState.AUDIO_STUDIO)} 
        />
      </div>
    </div>
  );
};

const QuickCard = ({ icon: Icon, title, desc, color, onClick }: any) => (
  <button onClick={onClick} className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 hover:bg-slate-750 transition-all text-left">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon size={24} />
    </div>
    <h4 className="text-lg font-bold text-white">{title}</h4>
    <p className="text-sm text-slate-400 mt-1">{desc}</p>
  </button>
);
