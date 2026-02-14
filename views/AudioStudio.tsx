import React, { useState, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Mic, Play, Pause, Loader2, Music, Download } from 'lucide-react';

export const AudioStudio: React.FC = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [generatedBuffer, setGeneratedBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    // We try to match Gemini's output rate, but browser might enforce hardware rate.
    // The buffer creation handles the sample rate mismatch.
    setAudioContext(new AudioCtor({ sampleRate: 24000 }));
    return () => {
      audioContext?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAudio = () => {
    if (audioSource) {
      audioSource.stop();
      setAudioSource(null);
    }
    setIsPlaying(false);
  };

  const handleGenerateAndPlay = async () => {
    if (!text || !audioContext) return;
    
    stopAudio();
    setIsGenerating(true);
    setGeneratedBuffer(null);

    try {
      const base64Audio = await generateSpeech(text);
      
      // Decode Base64 to Uint8Array
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode raw PCM data (Gemini returns 24kHz mono PCM)
      // Note: audioContext.decodeAudioData() fails on raw PCM without headers.
      const audioBuffer = decodePCM(bytes, audioContext);
      setGeneratedBuffer(audioBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      
      source.start();
      setAudioSource(source);
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio Error:", e);
      alert("Erreur de génération audio.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWav = () => {
    if (!generatedBuffer) return;
    
    const wavBlob = bufferToWav(generatedBuffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afrigen-audio-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full p-6 flex flex-col space-y-6">
      <header className="border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Mic className="text-green-500" /> Studio Audio & Voix
        </h2>
        <p className="text-slate-400">Transformez vos textes en narration naturelle avec Gemini TTS.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-full flex flex-col">
            <label className="text-sm font-medium text-slate-300 mb-4 block">Votre texte à narrer</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                placeholder="Entrez le texte ici..."
            />
        </div>

        <div className="flex flex-col items-center justify-center space-y-8">
            <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all ${isPlaying ? 'border-green-500 shadow-[0_0_80px_rgba(16,185,129,0.5)] scale-105' : 'border-slate-700 bg-slate-800'}`}>
                {isGenerating ? (
                    <Loader2 size={64} className="text-green-500 animate-spin" />
                ) : (
                    <Music size={64} className={`${isPlaying ? 'text-green-500 animate-pulse' : 'text-slate-500'}`} />
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleGenerateAndPlay}
                    disabled={isGenerating || !text}
                    className="px-6 py-4 bg-green-600 rounded-full text-white font-bold hover:bg-green-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {isGenerating ? 'Génération...' : 'Générer & Lire'}
                </button>
                {isPlaying && (
                     <button
                     onClick={stopAudio}
                     className="p-4 bg-slate-700 rounded-full text-white hover:bg-slate-600 transition-colors"
                     title="Pause"
                 >
                     <Pause size={24} />
                 </button>
                )}
                 <button
                    onClick={handleDownloadWav}
                    disabled={!generatedBuffer || isGenerating}
                    className="px-6 py-4 bg-slate-700 rounded-full text-white font-bold hover:bg-slate-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Télécharger Audio (WAV)"
                >
                    <Download size={20} />
                    <span className="hidden sm:inline">WAV</span>
                </button>
            </div>
            
            <div className="text-center">
                <p className="text-slate-400 text-sm">Voix: <span className="text-white font-medium">Kore (Neutre)</span></p>
                <p className="text-xs text-slate-500 mt-1">Génère un fichier audio PCM 24kHz</p>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper Functions ---

const decodePCM = (data: Uint8Array, ctx: AudioContext): AudioBuffer => {
    const inputSampleRate = 24000; // Gemini default
    const numChannels = 1; // Gemini default
    
    // Convert 8-bit bytes to 16-bit integers (little-endian)
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, inputSampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert int16 (-32768 to 32767) to float32 (-1.0 to 1.0)
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const bufferToWav = (buffer: AudioBuffer): Blob => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArr = new ArrayBuffer(length);
  const view = new DataView(bufferArr);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, length - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1size (16 for PCM)
  view.setUint16(20, 1, true); // audio format (1 for PCM)
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2 * numOfChan, true); // byte rate
  view.setUint16(32, numOfChan * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, length - 44, true); // data size

  // write interleaved data
  for(i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  pos = 44;
  while(pos < length) {
    for(i = 0; i < numOfChan; i++) {
      // clamp and scale to 16-bit PCM
      sample = Math.max(-1, Math.min(1, channels[i][offset])); 
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0;
      view.setInt16(pos, sample, true); 
      pos += 2;
    }
    offset++;
  }

  return new Blob([bufferArr], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
