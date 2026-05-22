'use client';

import { motion } from 'framer-motion';
import { RoundResult } from '@/types/game';

interface GameProgressProps {
  currentRound: number;
  totalRounds: number;
  completedResults: RoundResult[];
}

export default function GameProgress({ currentRound, totalRounds, completedResults }: GameProgressProps) {
  return (
    <div className="flex justify-center gap-3 px-4 py-4">
      {Array.from({ length: totalRounds }, (_, i) => {
        const isCompleted = i < completedResults.length;
        const isCurrent = i === currentRound;
        const isUpcoming = i > currentRound;

        return (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              isCompleted
                ? 'bg-red-500'
                : isCurrent
                ? 'bg-gray-400'
                : 'bg-gray-200'
            }`}
            animate={
              isCurrent
                ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }
                : {}
            }
            transition={
              isCurrent
                ? { duration: 1.5, repeat: Infinity }
                : {}
            }
          />
        );
      })}
    </div>
  );
}
