'use client';

import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { getGrade } from '@/lib/percentiles';
import { TOTAL_MAX_SCORE } from '@/lib/constants';

interface ScoreSummaryProps {
  totalScore: number;
}

export default function ScoreSummary({ totalScore }: ScoreSummaryProps) {
  const { grade, label, color } = getGrade(totalScore);

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm text-white/30 uppercase tracking-widest mb-4">最终得分</p>
        <div className="flex items-baseline justify-center gap-2">
          <AnimatedNumber
            value={totalScore}
            className="text-7xl md:text-8xl font-bold text-white tabular-nums"
          />
          <span className="text-white/20 text-lg">/ {TOTAL_MAX_SCORE.toLocaleString()}</span>
        </div>
      </motion.div>

      <motion.div
        className="inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-full"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
      >
        <span className="text-2xl font-bold" style={{ color }}>{grade}</span>
        <span className="text-sm" style={{ color: `${color}cc` }}>{label}</span>
      </motion.div>
    </div>
  );
}
