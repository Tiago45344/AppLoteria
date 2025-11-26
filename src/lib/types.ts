// Tipos para o app LotecaBrasil

export type LotteryType = 
  | 'mega-sena' 
  | 'quina' 
  | 'lotomania' 
  | 'lotofacil'
  | 'mega-virada'
  | 'mais-milionaria'
  | 'timemania'
  | 'dupla-sena'
  | 'loteca'
  | 'dia-de-sorte'
  | 'super-sete';

export interface LotteryConfig {
  name: string;
  description: string;
  minNumber: number;
  maxNumber: number;
  numbersToSelect: number;
  color: string;
  gradient: string;
}

export interface GeneratedGame {
  id: string;
  type: LotteryType;
  numbers: number[];
  date: string;
  probability: string;
}

export interface SavedGame extends GeneratedGame {
  isFavorite: boolean;
}

export interface UserSubscription {
  isSubscribed: boolean;
  subscriptionDate?: string;
  expiryDate?: string;
}

export interface GenerationLimit {
  count: number;
  lastReset: string;
}

export type PaymentMethod = 'pix' | 'credit' | 'debit';
