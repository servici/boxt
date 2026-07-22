export type Role = 'USER' | 'ADMIN';
export type SeriesStatus = 'ONGOING' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  coinsBalance: number;
  createdAt: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title?: string | null;
  videoUrl: string;
  isFree: boolean;
  coinCost: number;
  duration: number;
  createdAt: string;
  isUnlocked?: boolean;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  status: SeriesStatus;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  episodes?: Episode[];
  _count?: {
    episodes: number;
  };
}

export interface Unlock {
  id: string;
  userId: string;
  episodeId: string;
  unlockedAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  coinsAdded: number;
  paymentMethod: string;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}
