'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { RoundResult } from '@/types/game';
import { SPRING_GENTLE } from '@/lib/constants';

interface RoundBreakdownProps {
  roundResults: RoundResult[];
}

export default function RoundBreakdown({ roundResults }: RoundBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm text-white/40 uppercase tracking-wider text-center mb-4">每轮详情</h3>
      {roundResults.map((result, i) => (
        <RoundItem key={i} result={result} index={i} />
      ))}
    </div>
  );
}

function RoundItem({ result, index }: { result: RoundResult; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 + index * 0.1, duration: 0.4, ...SPRING_GENTLE }}
    >
      <GlassCard
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white/20 text-sm font-mono">#{index + 1}</span>
            <div>
              <p className="text-sm text-white/70">{result.location.city}</p>
              <p className="text-xs text-white/25">{result.location.province}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-white/30">
                {result.distanceKm < 1
                  ? `${(result.distanceKm * 1000).toFixed(0)} m`
                  : `${result.distanceKm.toFixed(0)} km`}
              </p>
              <p className="text-sm text-violet-300 font-semibold tabular-nums">
                {result.score.toLocaleString()} 分
              </p>
            </div>
            <motion.svg
              className="w-4 h-4 text-white/20"
              animate={{ rotate: expanded ? 180 : 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/5">
                <p className="text-xs text-white/30 leading-relaxed">{result.location.funFact}</p>
                <div className="flex gap-4 mt-3 text-xs text-white/25">
                  <span>猜测: {result.guessLat.toFixed(2)}, {result.guessLng.toFixed(2)}</span>
                  <span>实际: {result.location.latitude.toFixed(2)}, {result.location.longitude.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
