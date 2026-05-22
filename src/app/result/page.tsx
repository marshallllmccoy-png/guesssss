'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { loadGameResults } from '@/hooks/useGamePersistence';
import { RoundResult } from '@/types/game';
import ScoreSummary from '@/components/result/ScoreSummary';
import PercentileDisplay from '@/components/result/PercentileDisplay';
import Leaderboard from '@/components/result/Leaderboard';
import RoundBreakdown from '@/components/result/RoundBreakdown';
import PlayAgainButton from '@/components/result/PlayAgainButton';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';

export default function ResultPage() {
  const router = useRouter();
  const [results, setResults] = useState<{
    roundResults: RoundResult[];
    totalScore: number;
    gameId: string;
  } | null>(null);

  useEffect(() => {
    const loaded = loadGameResults();
    setResults(loaded);
  }, []);

  // Empty state
  if (results === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-6">🗺️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">还没有游戏记录</h2>
          <p className="text-sm text-gray-400 mb-6">先完成一轮游戏，再来查看你的成绩吧</p>
          <GlassButton
            variant="primary"
            onClick={() => {
              router.push('/game');
            }}
          >
            开始游戏
          </GlassButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <motion.main
      className="min-h-screen max-w-2xl mx-auto px-4 py-12 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ScoreSummary totalScore={results.totalScore} />
      <PercentileDisplay totalScore={results.totalScore} />
      <Leaderboard playerScore={results.totalScore} />

      <div className="mt-10">
        <RoundBreakdown roundResults={results.roundResults} />
      </div>

      <PlayAgainButton />
    </motion.main>
  );
}
