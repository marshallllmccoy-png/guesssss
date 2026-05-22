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
      className="w-full px-4 pt-3 pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-lg mx-auto">
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
              className="text-5xl font-bold text-score tabular-nums"
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
      </div>
    </motion.div>
  );
}
