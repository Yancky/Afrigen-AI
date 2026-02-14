import React, { useState, useRef } from 'react';
import { generateImage } from '../services/geminiService';
import { Download, Sparkles, Image as ImageIcon, Loader2, Upload, X, Plus } from 'lucide-react';
import { SAMPLE_PROMPTS } from '../constants';

export const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [refImages, setRefImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const url = await generateImage(prompt, aspectRatio, refImages);
      setGeneratedImage(url);
    } catch (e) {
      console.error(e);
      alert("Erreur de génération d'image. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files: File[] = Array.from(event.target.files);
      const readers = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) resolve(reader.result as string);
            else reject("Failed to read file");
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        // Limit to 3 reference images maximum for performance/quota
        setRefImages(prev => [...prev, ...results].slice(0, 3));
      }).catch(err => console.error(err));
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeRefImage = (index: number) => {
    setRefImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      <header className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <ImageIcon className="text-purple-500" /> Studio Graphique
          </h2>
          <p className="text-slate-400">Créez ou modifiez des visuels avec Nano Banana (Gemini).</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
            
            {/* Prompt Input */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description / Modification</label>
                <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[120px]"
                placeholder="Ex: Un lion cybernétique... OU (si image ajoutée) : Transforme ce croquis en style réaliste..."
                />
            </div>

            {/* Reference Images */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                    <span>Images de référence (Optionnel)</span>
                    <span className="text-xs text-slate-500">{refImages.length}/3</span>
                </label>
                
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {refImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-600 group">
                            <img src={img} alt="ref" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeRefImage(idx)}
                                className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-500 text-white rounded-full p-0.5 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {refImages.length < 3 && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed border-slate-600 hover:border-purple-500 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-all"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*" 
                    multiple={true}
                    onChange={handleFileChange}
                />
                <p className="text-xs text-slate-500">Ajoutez des images pour guider l'IA (style, composition).</p>
            </div>
            
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border ${
                      aspectRatio === ratio
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
                <button 
                  onClick={() => setPrompt(SAMPLE_PROMPTS.image)}
                  className="text-xs text-purple-400 hover:text-purple-300 underline mb-4 block"
                >
                  Essayer un exemple de prompt
                </button>
                <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt && refImages.length === 0)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-amber-500 rounded-xl font-bold text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {refImages.length > 0 ? 'TRANSFORMER / GÉNÉRER' : 'GÉNÉRER L\'IMAGE'}
                </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 bg-black/20 rounded-2xl border border-slate-800 flex items-center justify-center p-8 min-h-[400px]">
          {isGenerating ? (
            <div className="text-center space-y-4">
               <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
               <p className="text-purple-400 font-medium animate-pulse">
                   {refImages.length > 0 ? 'Analyse des images et création...' : 'Création artistique en cours...'}
               </p>
            </div>
          ) : generatedImage ? (
            <div className="relative group max-w-full max-h-full">
              <img 
                src={generatedImage} 
                alt="Generated Art" 
                className="max-h-[600px] rounded-lg shadow-2xl object-contain"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <a 
                  href={generatedImage} 
                  download={`afrigen-${Date.now()}.png`}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Download size={20} /> Télécharger
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
              <p>Votre chef-d'œuvre apparaîtra ici.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};