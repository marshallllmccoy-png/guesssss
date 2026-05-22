'use client';

import { useEffect, useCallback } from 'react';
import { GameState, GamePhase } from '@/types/game';

const GAME_STATE_KEY = 'gameState';
const GAME_RESULTS_KEY = 'gameResults';

function safeGetItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    console.warn('sessionStorage write failed for', key);
  }
}

function safeRemoveItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function saveGameState(state: GameState): void {
  safeSetItem(GAME_STATE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  const raw = safeGetItem(GAME_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function saveGameResults(state: GameState): void {
  safeSetItem(GAME_RESULTS_KEY, JSON.stringify({
    roundResults: state.roundResults,
    totalScore: state.totalScore,
    gameId: state.gameId,
  }));
}

export function loadGameResults(): { roundResults: GameState['roundResults']; totalScore: number; gameId: string } | null {
  const raw = safeGetItem(GAME_RESULTS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearGameData(): void {
  safeRemoveItem(GAME_STATE_KEY);
  safeRemoveItem(GAME_RESULTS_KEY);
}

export function useGamePersistence(
  state: GameState,
  restoreState: (saved: GameState) => void,
  onGameComplete?: () => void
) {
  // Restore on mount
  useEffect(() => {
    if (state.phase === GamePhase.IDLE) {
      const saved = loadGameState();
      if (saved && saved.phase !== GamePhase.GAME_COMPLETE && saved.phase !== GamePhase.IDLE && saved.phase !== GamePhase.GALLERY_EXHAUSTED) {
        restoreState(saved);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save on state change
  useEffect(() => {
    if (state.phase !== GamePhase.IDLE && state.phase !== GamePhase.GALLERY_EXHAUSTED) {
      saveGameState(state);
    }
  }, [state]);

  // Handle game completion
  useEffect(() => {
    if (state.phase === GamePhase.GAME_COMPLETE) {
      saveGameResults(state);
      onGameComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  return { clearGameData: useCallback(() => clearGameData(), []) };
}
