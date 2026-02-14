import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';
import { Video, Loader2, AlertCircle, PlayCircle } from 'lucide-react';

export const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("Préparation du studio Veo...");
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "Analyse de votre vision créative...",
    "Le modèle Veo génère les images clés...",
    "Interpolation des frames haute définition...",
    "Rendu des textures et de l'éclairage...",
    "Finalisation de votre vidéo..."
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setError(null);
    
    // Message rotation
    let msgIdx = 0;
    const interval = setInterval(() => {
        msgIdx = (msgIdx + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[msgIdx]);
    }, 8000);

    try {
      const url = await generateVideo(prompt, { aspectRatio: '16:9', resolution: '720p' });
      setVideoUrl(url);
    } catch (e: any) {
      console.error(e);
      // Handle the "Requested entity was not found" error specifically for key reset
      if (e.message?.includes('Requested entity was not found') && window.aistudio) {
        setError("Erreur de clé API. Veuillez resélectionner votre clé.");
        await window.aistudio.openSelectKey();
      } else {
        setError("La génération a échoué. Assurez-vous d'avoir sélectionné une clé API payante valide.");
      }
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      <header className="border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Video className="text-amber-500" /> Studio Vidéo Veo
        </h2>
        <p className="text-slate-400">Générez des vidéos cinématographiques en haute définition.</p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs">
            <AlertCircle size={12} />
            <span>Nécessite une clé API Google Cloud facturable (Veo Model)</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">
           <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[100px] text-lg placeholder-slate-500"
              placeholder="Décrivez votre vidéo: 'Un plan cinématique par drone au dessus d'Abidjan en 2050, style cyberpunk...'"
            />
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <PlayCircle />}
                    GÉNÉRER LA VIDÉO
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
                {error}
                <div className="mt-2">
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-white">Consulter la documentation de facturation</a>
                </div>
            </div>
        )}

        {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-3 border-t-4 border-purple-500 rounded-full animate-spin reverse-spin"></div>
                </div>
                <p className="text-xl font-light text-slate-300 animate-pulse">{loadingMsg}</p>
                <p className="text-sm text-slate-500">Cela peut prendre quelques minutes...</p>
            </div>
        )}

        {videoUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                <video controls className="w-full aspect-video" src={videoUrl} autoPlay loop />
                <div className="p-4 bg-slate-900 flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Généré avec Veo 3.1</span>
                    <a href={videoUrl} download="afrigen-video.mp4" className="text-amber-500 hover:text-amber-400 text-sm font-semibold">Télécharger MP4</a>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
