import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Copy, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const TextStudio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Bonjour ! Je suis Afrigen AI. Que souhaitez-vous créer aujourd'hui ? (Article, Script, Business Plan, etc.)",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateText(userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Désolé, une erreur est survenue lors de la génération. Veuillez réessayer.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquareTextIcon /> Studio Texte
            </h2>
            <p className="text-sm text-slate-400">Propulsé par Gemini 3 Pro</p>
        </div>
        <div className="flex gap-2">
            {['Article', 'Email', 'Script', 'Traduction'].map(tag => (
                <button key={tag} onClick={() => setInput(`Je veux écrire un ${tag} sur...`)} className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 hover:bg-purple-600 hover:text-white transition-colors">
                    {tag}
                </button>
            ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-purple-600 to-indigo-600'}`}>
              {msg.role === 'user' ? <User size={20} className="text-slate-300" /> : <Bot size={20} className="text-white" />}
            </div>
            
            <div className={`group relative max-w-[80%] rounded-2xl p-6 ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-slate-100 rounded-tr-sm' 
                : 'bg-slate-900/50 border border-slate-800 text-slate-100 rounded-tl-sm shadow-xl'
            }`}>
              {msg.role === 'model' && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleCopy(msg.text)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                    <Copy size={16} />
                  </button>
                </div>
              )}
              
              <div className="prose prose-invert prose-purple max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 rounded-tl-sm">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Afrigen réfléchit...</span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Décrivez ce que vous voulez créer..."
            className="w-full bg-slate-800 text-white rounded-xl pl-6 pr-16 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-700 resize-none h-[60px] max-h-[200px]"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">
          Afrigen AI peut faire des erreurs. Vérifiez toujours les informations importantes.
        </p>
      </div>
    </div>
  );
};

const MessageSquareTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
)
