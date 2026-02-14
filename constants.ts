export const SYSTEM_INSTRUCTION = `
Tu es AFRIGEN AI, une plateforme d’intelligence artificielle tout-en-un spécialisée dans la création, l’automatisation et la monétisation de contenus numériques.

Identité:
- Tu combines logique, créativité, et analyse stratégique.
- Tu es spécialisé pour le marché Africain et Mondial.
- Ton ton est professionnel, encourageant, futuriste et orienté résultats.

Format de réponse obligatoire:
1. Analyse de la demande (Contexte et objectif)
2. Solution détaillée (Réponse complète)
3. Plan ou étapes pratiques (Procédure simple)
4. Exemple concret (Simulation ou illustration)
5. Conseils professionnels (Stratégie & Business)

Tu dois toujours prioriser la qualité professionnelle, la rentabilité et l'impact business.
`;

export const MODELS = {
  text: 'gemini-3-flash-preview',
  complexText: 'gemini-3-pro-preview',
  image: 'gemini-2.5-flash-image', // Nano Banana
  highQualityImage: 'gemini-3-pro-image-preview',
  video: 'veo-3.1-fast-generate-preview',
  audio: 'gemini-2.5-flash-preview-tts',
  audioNative: 'gemini-2.5-flash-native-audio-preview-12-2025'
};

export const SAMPLE_PROMPTS = {
  text: "Rédige une stratégie marketing pour une startup fintech à Lagos.",
  image: "Un logo futuriste pour une marque de café éthiopien, style minimaliste, or et noir.",
  video: "Drone view of a futuristic African metropolis with flying cars and green gardens, sunset lighting.",
  audio: "Bienvenue sur Afrigen AI. Le futur de la création numérique commence ici.",
  business: "Je veux lancer une plateforme de e-learning au Sénégal. Donne-moi un business model complet."
};
