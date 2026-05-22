'use client';

import { useReducer, useCallback } from 'react';
import { GameState, GamePhase, GameAction, RoundResult } from '@/types/game';
import { LocationData } from '@/types/location';
import { locations, getUnseenRandomLocations } from '@/data/locations';
import { TOTAL_ROUNDS } from '@/lib/constants';

function createGameId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createInitialState(): GameState {
  return {
    phase: GamePhase.IDLE,
    currentRoundIndex: -1,
    roundOrder: [],
    selectedLocation: null,
    currentGuess: null,
    roundResults: [],
    totalScore: 0,
    gameId: createGameId(),
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        phase: GamePhase.LOADING_LOCATION,
        currentRoundIndex: 0,
        roundOrder: action.roundOrder,
        roundResults: [],
        totalScore: 0,
        selectedLocation: null,
        currentGuess: null,
      };

    case 'LOCATION_LOADED':
      return {
        ...state,
        phase: GamePhase.SHOWING_LOCATION,
        selectedLocation: action.location,
        currentGuess: null,
      };

    case 'PLACE_GUESS':
      if (state.phase !== GamePhase.GUESSING && state.phase !== GamePhase.SHOWING_LOCATION) {
        return state;
      }
      return {
        ...state,
        phase: GamePhase.GUESSING,
        currentGuess: { lat: action.lat, lng: action.lng },
      };

    case 'CONFIRM_GUESS':
      return {
        ...state,
        phase: GamePhase.CONFIRMING,
      };

    case 'REVEAL_COMPLETE': {
      const loc = state.selectedLocation!;
      const result: RoundResult = {
        location: loc,
        guessLat: state.currentGuess!.lat,
        guessLng: state.currentGuess!.lng,
        distanceKm: action.distance,
        score: action.score,
      };
      return {
        ...state,
        phase: GamePhase.REVEALING_RESULT,
        roundResults: [...state.roundResults, result],
        totalScore: state.totalScore + action.score,
      };
    }

    case 'START_TRANSITION':
      return { ...state, phase: GamePhase.ROUND_TRANSITION };

    case 'NEXT_ROUND': {
      const nextIndex = state.currentRoundIndex + 1;
      if (nextIndex >= TOTAL_ROUNDS || nextIndex >= state.roundOrder.length) {
        return { ...state, phase: GamePhase.GAME_COMPLETE };
      }
      return {
        ...state,
        phase: GamePhase.LOADING_LOCATION,
        currentRoundIndex: nextIndex,
        selectedLocation: null,
        currentGuess: null,
      };
    }

    case 'GAME_OVER':
      return { ...state, phase: GamePhase.GAME_COMPLETE };

    case 'GALLERY_EXHAUSTED':
      return { ...state, phase: GamePhase.GALLERY_EXHAUSTED };

    case 'RESTORE_STATE':
      return { ...action.state };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const startGame = useCallback((seenIds: string[]) => {
    const order = getUnseenRandomLocations(TOTAL_ROUNDS, seenIds);
    if (order.length === 0) {
      dispatch({ type: 'GALLERY_EXHAUSTED' });
    } else {
      dispatch({ type: 'START_GAME', roundOrder: order });
    }
  }, []);

  const loadCurrentLocation = useCallback(() => {
    if (state.roundOrder.length === 0 || state.currentRoundIndex < 0) return;
    const idx = state.roundOrder[state.currentRoundIndex];
    if (idx == null || idx >= locations.length) return;
    dispatch({ type: 'LOCATION_LOADED', location: locations[idx] });
  }, [state.roundOrder, state.currentRoundIndex]);

  const placeGuess = useCallback((lat: number, lng: number) => {
    dispatch({ type: 'PLACE_GUESS', lat, lng });
  }, []);

  const confirmGuess = useCallback(() => {
    dispatch({ type: 'CONFIRM_GUESS' });
  }, []);

  const completeReveal = useCallback((distance: number, score: number) => {
    dispatch({ type: 'REVEAL_COMPLETE', distance, score });
  }, []);

  const startTransition = useCallback(() => {
    dispatch({ type: 'START_TRANSITION' });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  const endGame = useCallback(() => {
    dispatch({ type: 'GAME_OVER' });
  }, []);

  const restoreState = useCallback((saved: GameState) => {
    dispatch({ type: 'RESTORE_STATE', state: saved });
  }, []);

  return {
    state,
    dispatch,
    startGame,
    loadCurrentLocation,
    placeGuess,
    confirmGuess,
    completeReveal,
    startTransition,
    nextRound,
    endGame,
    restoreState,
  };
}
