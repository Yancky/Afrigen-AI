export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TEXT_STUDIO = 'TEXT_STUDIO',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  AUDIO_STUDIO = 'AUDIO_STUDIO',
  WEB_STUDIO = 'WEB_STUDIO',
  BUSINESS_STRATEGY = 'BUSINESS_STRATEGY',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface BusinessPlan {
  title: string;
  content: string;
  sections: string[];
}

export interface VeoConfig {
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export interface AIStudioClient {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

// Window augmentation for AI Studio specific API key selection
declare global {
  interface Window {
    aistudio?: AIStudioClient;
    webkitAudioContext: typeof AudioContext;
  }
}