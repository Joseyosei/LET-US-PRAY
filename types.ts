
export type UserRole = 'user' | 'prayer_leader' | 'church' | 'admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified?: boolean;
  avatar?: string;
  bio?: string;
  profileImage?: string; // URL or base64
  createdAt?: Date;
}

export interface Prayer {
  id: string;
  author: string;
  authorId?: string;
  authorRole?: UserRole; // To display badges
  authorVerified?: boolean;
  authorAvatar?: string;
  content: string;
  category: string; // e.g., Healing, Peace
  tags: string[];
  likes: number;
  prayingCount: number;
  prayersRequested: number;
  shareCount: number;
  commentCount: number;
  isAnonymous: boolean;
  timestamp: Date;
  location?: string;
  verified?: boolean; // Content verification
  isSensitive?: boolean; // T&S
}

export interface RoomParticipant {
  id: string;
  name: string;
  role: UserRole;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  avatar?: string;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

export interface AudioRoom {
  id: string;
  title: string;
  host: string;
  hostRole?: UserRole;
  hostVerified?: boolean;
  participants: number; // Count for list view
  activeParticipants?: RoomParticipant[]; // For detailed view
  tags: string[];
  isLive: boolean;
  language: string;
  durationMinutes: number;
  description?: string;
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
  STUDIO = 'STUDIO',
  SETTINGS = 'SETTINGS'
}

export interface ModerationResult {
  safe: boolean;
  reason?: string;
  suggestedTags?: string[];
}
