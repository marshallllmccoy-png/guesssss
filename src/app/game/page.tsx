'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useGameState } from '@/hooks/useGameState';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { GamePhase } from '@/types/game';
import { haversineDistance, calculateScore } from '@/lib/scoring';
import GameHeader from '@/components/game/GameHeader';
import GameProgress from '@/components/game/GameProgress';
import LocationImage from '@/components/game/LocationImage';
import GuessConfirmation from '@/components/game/GuessConfirmation';
import ResultReveal from '@/components/game/ResultReveal';
import RoundTransition from '@/components/game/RoundTransition';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Skeleton from '@/components/ui/Skeleton';
import { TOTAL_ROUNDS } from '@/lib/constants';

const GuessMap = dynamic(() => import('@/components/game/GuessMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[300px] rounded-2xl" />,
});

export default function GamePage() {
  const router = useRouter();
  const game = useGameState();
  const { state, startGame, loadCurrentLocation, placeGuess, confirmGuess, completeReveal, nextRound, endGame, restoreState } = game;

  // Persist game state
  const { clearGameData } = useGamePersistence(state, restoreState, () => {
    router.push('/result');
  });

  // Start game if no saved state
  useEffect(() => {
    if (state.phase === GamePhase.IDLE) {
      startGame();
    }
  }, [state.phase, startGame]);

  // Load location when entering LOADING_LOCATION phase
  useEffect(() => {
    if (state.phase === GamePhase.LOADING_LOCATION) {
      const timer = setTimeout(() => loadCurrentLocation(), 400);
      return () => clearTimeout(timer);
    }
  }, [state.phase, loadCurrentLocation]);

  // Calculate score when CONFIRMING
  useEffect(() => {
    if (state.phase !== GamePhase.CONFIRMING) return;
    if (!state.currentGuess || !state.selectedLocation) return;

    const distance = haversineDistance(
      state.currentGuess.lat,
      state.currentGuess.lng,
      state.selectedLocation.latitude,
      state.selectedLocation.longitude
    );
    const score = calculateScore(distance);

    const timer = setTimeout(() => {
      completeReveal(distance, score);
    }, 600);

    return () => clearTimeout(timer);
  }, [state.phase, state.currentGuess, state.selectedLocation, completeReveal]);

  // Handle game over
  useEffect(() => {
    if (state.phase === GamePhase.GAME_COMPLETE) {
      router.push('/result');
    }
  }, [state.phase, router]);

  // IDLE state — show loading
  if (state.phase === GamePhase.IDLE) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const showLocation =
    state.phase !== GamePhase.ROUND_TRANSITION &&
    state.phase !== GamePhase.GAME_COMPLETE;

  const isGuessingPhase =
    state.phase === GamePhase.SHOWING_LOCATION ||
    state.phase === GamePhase.GUESSING;

  const isConfirmingPhase = state.phase === GamePhase.CONFIRMING;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <GameHeader
        round={state.currentRoundIndex + 1}
        totalRounds={TOTAL_ROUNDS}
        score={state.totalScore}
      />
      <GameProgress
        currentRound={state.currentRoundIndex}
        completedResults={state.roundResults}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0">
        {/* Left: Location image */}
        {showLocation && (
          <LocationImage
            src={state.selectedLocation?.imageUrl}
            alt={state.selectedLocation ? `${state.selectedLocation.city} · ${state.selectedLocation.province}` : ''}
            className="w-full lg:w-[50vw] h-[35vh] lg:h-[calc(100vh-144px)]"
          />
        )}

        {/* Right: Map + Controls */}
        <div className="w-full lg:flex-1 flex flex-col h-[50vh] lg:h-[calc(100vh-144px)]">
          {/* Map */}
          <div className="flex-1 relative">
            <GuessMap
              phase={state.phase}
              onGuess={(lat, lng) => placeGuess(lat, lng)}
              guessPosition={state.currentGuess}
              realLocation={
                state.phase === GamePhase.REVEALING_RESULT && state.selectedLocation
                  ? { lat: state.selectedLocation.latitude, lng: state.selectedLocation.longitude }
                  : null
              }
              className="w-full h-full"
            />
          </div>

          {/* Action bar */}
          <div className="flex-shrink-0 border-t border-white/5 bg-[#141311]/80 backdrop-blur-xl">
            {/* Guessing phase: confirm button */}
            {isGuessingPhase && (
              <GuessConfirmation
                onConfirm={() => confirmGuess()}
                hasGuess={!!state.currentGuess}
                isLoading={isConfirmingPhase}
              />
            )}

            {/* Confirming phase: show waiting state */}
            {isConfirmingPhase && (
              <div className="flex items-center justify-center p-4">
                <p className="text-sm text-amber-300/40 flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                  计算中...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result reveal overlay */}
      {state.phase === GamePhase.REVEALING_RESULT && state.roundResults.length > 0 && (
        <ResultReveal
          distance={state.roundResults[state.roundResults.length - 1].distanceKm}
          score={state.roundResults[state.roundResults.length - 1].score}
          funFact={state.selectedLocation?.funFact || ''}
          city={state.selectedLocation?.city || ''}
          province={state.selectedLocation?.province || ''}
          isLastRound={state.currentRoundIndex >= TOTAL_ROUNDS - 1}
          onNextRound={() => nextRound()}
          onViewResults={() => endGame()}
        />
      )}

      {/* Round transition */}
      {state.phase === GamePhase.ROUND_TRANSITION && (
        <RoundTransition
          roundNumber={state.currentRoundIndex + 2}
          onComplete={() => nextRound()}
        />
      )}
    </div>
  );
}
