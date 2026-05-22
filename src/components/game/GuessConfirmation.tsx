'use client';

import { motion } from 'framer-motion';
import GlassButton from '@/components/ui/GlassButton';
import { SPRING_BOUNCY } from '@/lib/constants';

interface GuessConfirmationProps {
  onConfirm: () => void;
  hasGuess: boolean;
  isLoading: boolean;
}

export default function GuessConfirmation({ onConfirm, hasGuess, isLoading }: GuessConfirmationProps) {
  return (
    <motion.div
      className="w-full p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_BOUNCY}
    >
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        <div>
          {!hasGuess ? (
            <p className="text-sm text-white/30 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
              </svg>
              在地图上点击你要猜测的位置
            </p>
          ) : (
            <p className="text-sm text-amber-300/60">已选择，点击按钮确认</p>
          )}
        </div>
        <GlassButton
          variant="primary"
          size="md"
          onClick={onConfirm}
          disabled={!hasGuess}
          loading={isLoading}
          className="shadow-lg shadow-red-500/15"
        >
          确认猜测
        </GlassButton>
      </div>
    </motion.div>
  );
}
