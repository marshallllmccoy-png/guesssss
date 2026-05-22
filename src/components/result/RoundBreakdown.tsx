'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { RoundResult } from '@/types/game';
import { SPRING_GENTLE } from '@/lib/constants';

const MiniResultMap = dynamic(() => import('@/components/result/MiniResultMap'), {
  ssr: false,
  loading: () => <div className="w-full rounded-xl bg-[#161412] border border-white/5" style={{ height: 200 }} />,
});

interface RoundBreakdownProps {
  roundResults: RoundResult[];
}

export default function RoundBreakdown({ roundResults }: RoundBreakdownProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm text-white/40 uppercase tracking-wider text-center mb-4">每轮详情</h3>
      {roundResults.map((result, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 + i * 0.1, duration: 0.4, ...SPRING_GENTLE }}
        >
          <GlassCard className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-white/20 text-sm font-mono">#{i + 1}</span>
                <div>
                  <p className="text-sm text-white/70">{result.location.city}</p>
                  <p className="text-xs text-white/25">{result.location.province}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/30">
                  {result.distanceKm < 1
                    ? `${(result.distanceKm * 1000).toFixed(0)} m`
                    : `${result.distanceKm.toFixed(0)} km`}
                </p>
                <p className="text-sm text-score font-semibold tabular-nums">
                  {result.score.toLocaleString()} 分
                </p>
              </div>
            </div>

            {/* Map */}
            <MiniResultMap
              guessLat={result.guessLat}
              guessLng={result.guessLng}
              realLat={result.location.latitude}
              realLng={result.location.longitude}
            />

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1.5 text-white/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e2483a] inline-block" />
                你的猜测
              </span>
              <span className="flex items-center gap-1.5 text-white/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block" />
                实际位置
              </span>
            </div>

            {/* Fun fact */}
            <p className="text-xs text-white/30 leading-relaxed mt-3 pt-3 border-t border-white/5">
              {result.location.funFact}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
