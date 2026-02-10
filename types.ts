export interface Prayer {
  id: string;
  author: string;
  content: string;
  tags: string[];
  likes: number;
  prayingCount: number;
  timestamp: Date;
  location?: string;
  verified?: boolean;
}

export interface AudioRoom {
  id: string;
  title: string;
  host: string;
  participants: number;
  tags: string[];
  isLive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  FEED = 'FEED',
  ROOMS = 'ROOMS',
  PARTNER = 'PARTNER',
  ARCHITECTURE = 'ARCHITECTURE'
}

export interface ModerationResult {
  safe: boolean;
  reason?: string;
  suggestedTags?: string[];
}