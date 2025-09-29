export type ChatbotMode = 'plant-disease' | 'normal';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'audio' | 'image';
  audioUrl?: string;
  imageUrl?: string;
  imageAnalysis?: {
    disease: string;
    confidence: number;
    symptoms: string[];
    treatment: string[];
    prevention: string[];
    severity: string;
    estimatedRecovery: string;
  };
}

export interface ChatbotState {
  messages: Message[];
  currentMode: ChatbotMode;
  isLoading: boolean;
  isRecording: boolean;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
