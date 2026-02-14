import React, { useState } from 'react';
import { generateBusinessStrategy } from '../services/geminiService';
import { Briefcase, TrendingUp, DollarSign, Target, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const BusinessStudio: React.FC = () => {
  const [formData, setFormData] = useState({
    type: '',
    market: '',
    budget: ''
  });
  const [strategy, setStrategy] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.market) return;

    setIsLoading(true);
    try {
      const result = await generateBusinessStrategy(formData.type, formData.market, formData.budget);
      setStrategy(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
       <header className="border-b border-slate-800 pb-6 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Briefcase className="text-blue-500" /> Business & Stratégie
        </h2>
        <p className="text-slate-400">Transformez une idée en empire. Analyse de marché et plans stratégiques par IA.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Input Form */}
        <div className="xl:col-span-1">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 sticky top-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Target size={16} /> Type de Business
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder="Ex: E-commerce de mode éthique"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <TrendingUp size={16} /> Marché Cible
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder="Ex: Jeunes urbains au Sénégal"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.market}
                            onChange={e => setFormData({...formData, market: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <DollarSign size={16} /> Budget Initial (Optionnel)
                        </label>
                        <input 
                            type="text"
                            placeholder="Ex: 5,000,000 FCFA"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.budget}
                            onChange={e => setFormData({...formData, budget: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'GÉNÉRER LA STRATÉGIE'}
                    </button>
                </form>
            </div>
        </div>

        {/* Output */}
        <div className="xl:col-span-2">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                    <p className="text-slate-400">Analyse des tendances du marché en cours...</p>
                </div>
            ) : strategy ? (
                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
                     <div className="prose prose-invert prose-blue max-w-none">
                        <ReactMarkdown>{strategy}</ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                    <Briefcase size={64} className="mb-4 opacity-20" />
                    <p>Remplissez le formulaire pour générer votre plan d'affaires.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
