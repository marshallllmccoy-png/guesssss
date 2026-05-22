'use client';

import { motion } from 'framer-motion';

interface GameHeaderProps {
  round: number;
  totalRounds: number;
  score: number;
}

export default function GameHeader({ round, totalRounds, score }: GameHeaderProps) {
  return (
    <motion.div
      className="flex items-center justify-between px-4 py-3 glass rounded-2xl mx-4 mt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">回合</span>
        <span className="text-lg font-semibold text-gray-800">
          第{round}<span className="text-gray-300 text-sm">/{totalRounds}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wider">得分</span>
        <span className="text-lg font-semibold text-score tabular-nums">{score.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
