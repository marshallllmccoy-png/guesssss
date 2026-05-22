import { LocationData } from './location';

export enum GamePhase {
  IDLE = 'IDLE',
  LOADING_LOCATION = 'LOADING_LOCATION',
  SHOWING_LOCATION = 'SHOWING_LOCATION',
  GUESSING = 'GUESSING',
  CONFIRMING = 'CONFIRMING',
  REVEALING_RESULT = 'REVEALING_RESULT',
  ROUND_TRANSITION = 'ROUND_TRANSITION',
  GAME_COMPLETE = 'GAME_COMPLETE',
  GALLERY_EXHAUSTED = 'GALLERY_EXHAUSTED',
}

export interface RoundResult {
  location: LocationData;
  guessLat: number;
  guessLng: number;
  distanceKm: number;
  score: number;
}

export interface GameState {
  phase: GamePhase;
  currentRoundIndex: number;
  roundOrder: number[];
  selectedLocation: LocationData | null;
  currentGuess: { lat: number; lng: number } | null;
  roundResults: RoundResult[];
  totalScore: number;
  gameId: string;
}

export type GameAction =
  | { type: 'START_GAME'; roundOrder: number[] }
  | { type: 'LOCATION_LOADED'; location: LocationData }
  | { type: 'PLACE_GUESS'; lat: number; lng: number }
  | { type: 'CONFIRM_GUESS' }
  | { type: 'REVEAL_COMPLETE'; distance: number; score: number }
  | { type: 'START_TRANSITION' }
  | { type: 'NEXT_ROUND' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTORE_STATE'; state: GameState };
