import React, { useState } from 'react';
import { generateWebsiteCode } from '../services/geminiService';
import { Globe, Layout, Download, Code, Eye, Loader2, Play } from 'lucide-react';

const SITE_TYPES = [
  "Site Vitrine Professionnel",
  "Portfolio Créatif",
  "E-Commerce / Boutique en ligne",
  "Site E-Learning / Formation",
  "Site École / Université",
  "Institution / ONG",
  "Startup Landing Page",
  "Blog Personnel"
];

export const WebStudio: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: SITE_TYPES[0],
    description: ''
  });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const handleGenerate = async () => {
    if (!formData.name || !formData.description) return;
    setIsGenerating(true);
    setGeneratedCode('');
    setActiveTab('preview');
    
    try {
      const code = await generateWebsiteCode(formData.type, formData.name, formData.description);
      setGeneratedCode(code);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du site.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-4 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
            <Globe className="text-cyan-500" /> Générateur Web & App
          </h2>
          <p className="text-sm text-slate-400">Créez des sites complets (Vitrine, E-commerce, Éducation) en un clic.</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left Control Panel */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nom du Site / Projet</label>
                <input 
                  type="text"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Ex: Afrigen University"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Type de Site</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  {SITE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description & Fonctionnalités</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none h-32 resize-none"
                  placeholder="Décrivez votre site: couleurs, sections souhaitées, public cible..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <button 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.name || !formData.description}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                GÉNÉRER LE SITE
             </button>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Layout size={16} className="text-cyan-400" /> Fonctionnalités incluses
            </h4>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Design Responsive (Mobile/Desktop)</li>
              <li>Tailwind CSS intégré</li>
              <li>Images via Unsplash API</li>
              <li>Structure HTML5 Sémantique</li>
              <li>Icônes FontAwesome</li>
            </ul>
          </div>
        </div>

        {/* Right Preview/Code Panel */}
        <div className="w-full xl:w-2/3 flex flex-col bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl h-[600px] xl:h-auto">
           {generatedCode ? (
             <>
                <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
                   <div className="flex space-x-2">
                      <button 
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                      >
                        <Eye size={16} /> Aperçu
                      </button>
                      <button 
                        onClick={() => setActiveTab('code')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'code' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                      >
                        <Code size={16} /> Code Source
                      </button>
                   </div>
                   <button 
                      onClick={handleDownload}
                      className="text-slate-300 hover:text-white flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                   >
                      <Download size={16} /> Télécharger HTML
                   </button>
                </div>

                <div className="flex-1 overflow-hidden relative bg-white">
                  {activeTab === 'preview' ? (
                     <iframe 
                       title="Website Preview"
                       srcDoc={generatedCode}
                       className="w-full h-full border-none"
                       sandbox="allow-scripts"
                     />
                  ) : (
                    <pre className="w-full h-full overflow-auto p-4 bg-[#1e1e1e] text-blue-200 text-sm font-mono">
                      {generatedCode}
                    </pre>
                  )}
                </div>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                {isGenerating ? (
                   <>
                     <Loader2 size={48} className="text-cyan-500 animate-spin" />
                     <p className="animate-pulse text-cyan-400">Construction de l'architecture...</p>
                     <p className="text-xs">Afrigen écrit le HTML & CSS...</p>
                   </>
                ) : (
                  <>
                    <Globe size={64} className="opacity-20" />
                    <p>Configurez et générez votre site web pour voir le résultat ici.</p>
                  </>
                )}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
