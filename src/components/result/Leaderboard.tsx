'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { leaderboardData, LeaderboardEntry } from '@/data/leaderboard-mock';

interface LeaderboardProps {
  playerScore: number;
}

export default function Leaderboard({ playerScore }: LeaderboardProps) {
  const merged = useMemo(() => {
    const entries: LeaderboardEntry[] = [...leaderboardData];
    // Find where player fits
    let insertIdx = entries.length;
    for (let i = 0; i < entries.length; i++) {
      if (playerScore > entries[i].score) {
        insertIdx = i;
        break;
      }
    }
    entries.splice(insertIdx, 0, {
      rank: insertIdx + 1,
      playerName: '你',
      score: playerScore,
      date: new Date().toISOString().slice(0, 10),
      isPlayer: true,
    });
    // Re-rank
    return entries.slice(0, 10).map((e, i) => ({ ...e, rank: i + 1 }));
  }, [playerScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <GlassCard className="p-5">
        <h3 className="text-sm text-white/40 uppercase tracking-wider mb-4 text-center">排行榜</h3>
        <div className="space-y-1">
          {/* Header */}
          <div className="flex items-center text-xs text-white/20 uppercase tracking-wider px-2 pb-2">
            <span className="w-8 text-center">#</span>
            <span className="flex-1">玩家</span>
            <span className="w-20 text-right">分数</span>
          </div>

          {/* Rows */}
          {merged.map((entry, i) => (
            <motion.div
              key={entry.rank}
              className={`flex items-center px-2 py-2 rounded-lg text-sm ${
                entry.isPlayer
                  ? 'bg-red-500/10 border border-red-400/15'
                  : 'hover:bg-white/5'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.04, duration: 0.3 }}
            >
              <span className={`w-8 text-center font-mono ${
                entry.rank <= 3 ? 'text-amber-400' : 'text-white/30'
              }`}>
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
              </span>
              <span className={`flex-1 ${entry.isPlayer ? 'text-red-200 font-semibold' : 'text-white/70'}`}>
                {entry.playerName}
              </span>
              <span className={`w-20 text-right font-mono tabular-nums ${entry.isPlayer ? 'text-amber-300 font-semibold' : 'text-white/40'}`}>
                {entry.score.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
