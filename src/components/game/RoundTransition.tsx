'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT } from '@/lib/constants';

interface RoundTransitionProps {
  roundNumber: number;
  onComplete: () => void;
}

export default function RoundTransition({ roundNumber, onComplete }: RoundTransitionProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Enter → hold
    const t1 = setTimeout(() => setPhase('hold'), 500);
    // Hold → exit
    const t2 = setTimeout(() => setPhase('exit'), 1200);
    // Exit → complete
    const t3 = setTimeout(() => onComplete(), 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf7f2]"
        initial={{ scaleY: 0, originY: 1 }}
        animate={
          phase === 'exit'
            ? { scaleY: 0, originY: 0 }
            : { scaleY: 1, originY: 1 }
        }
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={
            phase === 'exit'
              ? { opacity: 0, scale: 0.8 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.3, delay: phase === 'enter' ? 0.2 : 0 }}
        >
          <p className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-4">第 {roundNumber} 轮</p>
          <p className="text-gray-300 text-xs tracking-widest uppercase">准备</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
