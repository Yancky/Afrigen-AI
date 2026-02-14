import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { MODELS, SYSTEM_INSTRUCTION } from "../constants";
import { VeoConfig } from "../types";

// Utility to get AI instance. Note: For Veo, we re-instantiate to ensure fresh key.
const getAI = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey: key });
};

// --- Text Generation ---
export const generateText = async (prompt: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: MODELS.text,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
    history: history as any,
  });

  const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
  return response.text || "No response generated.";
};

// --- Website Generation ---
export const generateWebsiteCode = async (siteType: string, name: string, description: string) => {
  const ai = getAI();
  
  const prompt = `
  Tu es un développeur Web Senior Expert (HTML5/TailwindCSS).
  
  TACHE : Crée un code HTML complet (un seul fichier) pour un site web de type : "${siteType}".
  NOM DU SITE : "${name}"
  DESCRIPTION : "${description}"
  
  EXIGENCES TECHNIQUES :
  1. Utilise HTML5 et Tailwind CSS (via CDN : <script src="https://cdn.tailwindcss.com"></script>).
  2. Le design doit être MODERNE, PROFESSIONNEL, RESPONSIVE et adapté au marché Africain/International.
  3. Utilise des images de remplacement de haute qualité via Unsplash (ex: https://images.unsplash.com/photo-...) correspondant au contexte.
  4. Inclus les sections suivantes selon le type :
     - Header (Logo, Nav)
     - Hero Section (Titre accrocheur, CTA)
     - Features / Services
     - About Us
     - Footer
     - (Si E-commerce : Grille de produits)
     - (Si École/E-learning : Liste des cours/programmes)
  5. Utilise Font Awesome pour les icônes (via CDN).
  6. Ne renvoie QUE le code HTML. Pas de texte explicatif avant ou après. Pas de balises markdown (\`\`\`html).
  `;

  const response = await ai.models.generateContent({
    model: MODELS.complexText, // Use Pro model for better coding capabilities
    contents: prompt
  });

  let code = response.text || "";
  
  // Clean markdown if present
  code = code.replace(/```html/g, '').replace(/```/g, '');
  
  return code;
};

// --- Image Generation ---
export const generateImage = async (prompt: string, aspectRatio: string = "1:1", referenceImages: string[] = []) => {
  const ai = getAI();
  
  const parts: any[] = [];

  // 1. Add reference images if they exist
  if (referenceImages && referenceImages.length > 0) {
    referenceImages.forEach((base64String) => {
      // Extract generic base64 data and mime type
      const matches = base64String.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    });
  }

  // 2. Add the text prompt
  parts.push({ text: prompt });

  // Using Nano Banana for general generation/editing
  const response = await ai.models.generateContent({
    model: MODELS.image,
    contents: {
      parts: parts,
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
      }
    }
  });

  // Extract image
  let imageUrl: string | null = null;
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }
  
  if (!imageUrl) throw new Error("Failed to generate image.");
  return imageUrl;
};

// --- Audio Generation (TTS) ---
export const generateSpeech = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.audio,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  
  return base64Audio; 
};

// --- Video Generation (Veo) ---
export const generateVideo = async (prompt: string, config: VeoConfig) => {
  // Check for API Key selection for Veo (Paid feature)
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  // Important: Create a NEW instance to pick up the selected key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let operation = await ai.models.generateVideos({
    model: MODELS.video,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio,
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed or no URI returned.");

  // Fetch the actual video bytes using the key
  const fetchUrl = `${videoUri}&key=${process.env.API_KEY}`;
  const vidResponse = await fetch(fetchUrl);
  const blob = await vidResponse.blob();
  return URL.createObjectURL(blob);
};

// --- Business Strategy (Specialized Text) ---
export const generateBusinessStrategy = async (businessType: string, market: string, budget: string) => {
  const prompt = `
  AGIS EN TANT QUE EXPERT BUSINESS AFRIGEN AI.
  Je veux créer un business de type: "${businessType}".
  Marché cible: "${market}".
  Budget initial: "${budget}".

  Génère un plan stratégique complet incluant:
  1. Modèle économique (Business Model Canvas simplifié).
  2. Stratégie Marketing (Canaux d'acquisition adaptés à l'Afrique).
  3. Plan opérationnel (étapes de lancement).
  4. Projection financière estimée.
  5. Idées d'innovation IA pour ce business.
  `;
  
  return await generateText(prompt);
};
