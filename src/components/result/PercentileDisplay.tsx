'use client';

import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { getPercentile } from '@/lib/percentiles';

interface PercentileDisplayProps {
  totalScore: number;
}

export default function PercentileDisplay({ totalScore }: PercentileDisplayProps) {
  const percentile = getPercentile(totalScore);

  return (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <p className="text-lg text-white/60 leading-relaxed">
        你的地理知识超过了{' '}
        <span className="text-amber-300 font-bold">
          <AnimatedNumber value={percentile} duration={1.5} />
          %
        </span>{' '}
        的玩家
      </p>
      <p className="text-sm text-white/25 mt-2">
        你比全国{percentile}%的人更了解中国
      </p>
    </motion.div>
  );
}
