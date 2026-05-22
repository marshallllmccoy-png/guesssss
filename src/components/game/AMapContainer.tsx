'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAMap } from '@/hooks/useAMap';
import { GamePhase } from '@/types/game';
import Skeleton from '@/components/ui/Skeleton';
import GlassCard from '@/components/ui/GlassCard';
import { SPRING_BOUNCY } from '@/lib/constants';

interface AMapContainerProps {
  phase: GamePhase;
  onGuess: (lat: number, lng: number) => void;
  guessPosition: { lat: number; lng: number } | null;
  realLocation: { lat: number; lng: number } | null;
  className?: string;
}

export default function AMapContainer({
  phase,
  onGuess,
  guessPosition,
  realLocation,
  className = '',
}: AMapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastGuessRef = useRef<{ lat: number; lng: number } | null>(null);

  const {
    isScriptLoaded,
    isMapReady,
    scriptError,
    placeGuessMarker,
    showRealLocation,
    drawConnectionLine,
    fitBothMarkers,
    clearAll,
    retry,
  } = useAMap({
    containerRef,
    onClick: (lat, lng) => {
      if (phase === GamePhase.GUESSING || phase === GamePhase.SHOWING_LOCATION) {
        onGuess(lat, lng);
      }
    },
  });

  const isLocked = phase === GamePhase.CONFIRMING ||
    phase === GamePhase.REVEALING_RESULT ||
    phase === GamePhase.ROUND_TRANSITION;

  // Update guess marker
  useEffect(() => {
    if (!guessPosition || !isMapReady) return;
    if (
      lastGuessRef.current &&
      lastGuessRef.current.lat === guessPosition.lat &&
      lastGuessRef.current.lng === guessPosition.lng
    ) return;
    lastGuessRef.current = guessPosition;
    placeGuessMarker(guessPosition.lat, guessPosition.lng);
  }, [guessPosition, isMapReady, placeGuessMarker]);

  // Show real location + connection line during reveal
  useEffect(() => {
    if (phase !== GamePhase.REVEALING_RESULT || !realLocation || !guessPosition || !isMapReady) return;
    showRealLocation(realLocation.lat, realLocation.lng);
    drawConnectionLine(
      guessPosition.lat, guessPosition.lng,
      realLocation.lat, realLocation.lng
    );
    setTimeout(() => {
      fitBothMarkers(
        guessPosition.lat, guessPosition.lng,
        realLocation.lat, realLocation.lng
      );
    }, 300);
  }, [phase, realLocation, guessPosition, isMapReady, showRealLocation, drawConnectionLine, fitBothMarkers]);

  // Clear overlays when starting new round
  useEffect(() => {
    if (phase === GamePhase.LOADING_LOCATION || phase === GamePhase.SHOWING_LOCATION) {
      clearAll();
      lastGuessRef.current = null;
    }
  }, [phase, clearAll]);

  // Loading state
  if (!isScriptLoaded && !scriptError) {
    return (
      <motion.div className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Skeleton className="w-full h-full min-h-[300px] rounded-2xl" />
      </motion.div>
    );
  }

  // Error state
  if (scriptError) {
    return (
      <GlassCard className={`${className} flex flex-col items-center justify-center p-6 min-h-[300px]`}>
        <svg className="w-12 h-12 text-white/20 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <p className="text-white/40 text-sm mb-4">地图加载失败，请使用下方输入框</p>
        <button
          onClick={retry}
          className="px-4 py-2 text-sm text-red-200 border border-red-400/25 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          重试
        </button>
      </GlassCard>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`${className} rounded-2xl overflow-hidden border border-white/5 ${isLocked ? 'pointer-events-none' : ''}`}
      style={{ touchAction: isLocked ? 'auto' : 'none' }}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_BOUNCY, duration: 0.6 }}
    />
  );
}
