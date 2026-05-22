'use client';

import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import { SPRING_SLOW } from '@/lib/constants';

interface ResultRevealProps {
  distance: number;
  score: number;
  funFact: string;
  city: string;
  province: string;
  isLastRound: boolean;
  onNextRound: () => void;
  onViewResults: () => void;
}

export default function ResultReveal({
  distance,
  score,
  funFact,
  city,
  province,
  isLastRound,
  onNextRound,
  onViewResults,
}: ResultRevealProps) {
  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-end justify-center pb-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-lg"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ ...SPRING_SLOW, duration: 0.6 }}
      >
        <GlassCard className="p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">
              {city} · {province}
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-white">
                {distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(0)} km`}
              </span>
              <span className="text-sm text-white/30">误差</span>
            </div>
          </div>

          {/* Score */}
          <div className="text-center mb-4">
            <AnimatedNumber
              value={score}
              className="text-5xl font-bold text-violet-300 tabular-nums"
            />
            <p className="text-xs text-white/20 mt-1">本轮得分</p>
          </div>

          {/* Fun fact */}
          <p className="text-sm text-white/40 text-center leading-relaxed mb-6 px-2">
            {funFact}
          </p>

          {/* Action */}
          <div className="flex justify-center">
            {isLastRound ? (
              <GlassButton variant="primary" size="md" onClick={onViewResults}>
                查看最终结果
              </GlassButton>
            ) : (
              <GlassButton variant="primary" size="md" onClick={onNextRound}>
                下一轮
              </GlassButton>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
