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
import { useSeenImages } from '@/hooks/useSeenImages';
import GalleryExhausted from '@/components/game/GalleryExhausted';

const GuessMap = dynamic(() => import('@/components/game/GuessMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[300px] rounded-2xl" />,
});

export default function GamePage() {
  const router = useRouter();
  const game = useGameState();
  const { state, startGame, loadCurrentLocation, placeGuess, confirmGuess, completeReveal, startTransition, nextRound, endGame, restoreState } = game;
  const { seenIds, markAsSeen, isHydrated } = useSeenImages();

  // Persist game state
  const { clearGameData } = useGamePersistence(state, restoreState, () => {
    router.push('/result');
  });

  // Start game if no saved state
  useEffect(() => {
    if (state.phase === GamePhase.IDLE && isHydrated) {
      startGame(seenIds);
    }
  }, [state.phase, startGame, seenIds, isHydrated]);

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

  // Mark current location as seen when reveal completes
  useEffect(() => {
    if (state.phase === GamePhase.REVEALING_RESULT && state.selectedLocation) {
      markAsSeen(state.selectedLocation.id);
    }
  }, [state.phase, state.selectedLocation?.id, markAsSeen]);

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

  // GALLERY_EXHAUSTED state
  if (state.phase === GamePhase.GALLERY_EXHAUSTED) {
    return <GalleryExhausted />;
  }

  const showLocation =
    state.phase !== GamePhase.ROUND_TRANSITION &&
    state.phase !== GamePhase.GAME_COMPLETE;

  const isRevealing = state.phase === GamePhase.REVEALING_RESULT;

  const isGuessingPhase =
    state.phase === GamePhase.SHOWING_LOCATION ||
    state.phase === GamePhase.GUESSING;

  const isConfirmingPhase = state.phase === GamePhase.CONFIRMING;

  const actualTotalRounds = state.roundOrder.length || TOTAL_ROUNDS;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <GameHeader
        round={state.currentRoundIndex + 1}
        totalRounds={actualTotalRounds}
        score={state.totalScore}
      />
      <GameProgress
        currentRound={state.currentRoundIndex}
        totalRounds={actualTotalRounds}
        completedResults={state.roundResults}
      />

      {/* Main content */}
      {showLocation && (
        <div className="flex-1 flex flex-col">
          <div className={`flex flex-col ${isRevealing ? '' : 'lg:flex-row'} gap-4 lg:gap-6 flex-1 lg:px-4`}>
            {/* Left: Image — hidden during reveal */}
            {!isRevealing && (
              <div className="w-full lg:w-[50vw] h-[35vh] lg:h-[calc(100vh-144px)] lg:py-4">
                <LocationImage
                  src={state.selectedLocation?.imageUrl}
                  alt={state.selectedLocation ? `${state.selectedLocation.city} · ${state.selectedLocation.province}` : ''}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Right column: Map + Action bar (during play) or centered square Map (during reveal) */}
            <div
              className={`${
                isRevealing
                  ? 'w-full flex-shrink-0 flex justify-center mt-4'
                  : 'w-full lg:flex-1 flex flex-col h-[50vh] lg:h-[calc(100vh-144px)] lg:py-4'
              }`}
            >
              <div className={isRevealing ? 'w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] relative' : 'flex-1 relative min-h-0'}>
                <GuessMap
                  phase={state.phase}
                  onGuess={(lat, lng) => placeGuess(lat, lng)}
                  guessPosition={state.currentGuess}
                  realLocation={
                    isRevealing && state.selectedLocation
                      ? { lat: state.selectedLocation.latitude, lng: state.selectedLocation.longitude }
                      : null
                  }
                  className="w-full h-full"
                />
              </div>

              {/* Action bar: below map during play, hidden during reveal */}
              {!isRevealing && (
                <div className="flex-shrink-0 border-t border-black/5 bg-white/50 backdrop-blur-xl">
                  {isGuessingPhase && (
                    <GuessConfirmation
                      onConfirm={() => confirmGuess()}
                      hasGuess={!!state.currentGuess}
                      isLoading={isConfirmingPhase}
                    />
                  )}

                  {isConfirmingPhase && (
                    <div className="flex items-center justify-center p-4">
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        计算中...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result card: below map during reveal */}
      {isRevealing && state.roundResults.length > 0 && (
        <ResultReveal
          distance={state.roundResults[state.roundResults.length - 1].distanceKm}
          score={state.roundResults[state.roundResults.length - 1].score}
          funFact={state.selectedLocation?.funFact || ''}
          city={state.selectedLocation?.city || ''}
          province={state.selectedLocation?.province || ''}
          isLastRound={state.currentRoundIndex >= actualTotalRounds - 1}
          onNextRound={() => startTransition()}
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
