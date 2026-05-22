'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { clearGameData } from '@/hooks/useGamePersistence';
import GlassButton from '@/components/ui/GlassButton';

export default function PlayAgainButton() {
  const router = useRouter();

  function handlePlayAgain() {
    clearGameData();
    router.push('/game');
  }

  return (
    <motion.div
      className="flex flex-col items-center pt-8 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <GlassButton variant="primary" size="lg" onClick={handlePlayAgain}>
        再来一局
      </GlassButton>
      <button
        onClick={() => {
          clearGameData();
          router.push('/');
        }}
        className="mt-4 text-sm text-gray-350 hover:text-gray-500 transition-colors" style={{ color: '#b0a99e' }}
      >
        返回首页
      </button>
    </motion.div>
  );
}
