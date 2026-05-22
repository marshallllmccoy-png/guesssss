'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function StartButton() {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setMagnet({ x, y });
  }

  function handleMouseLeave() {
    setMagnet({ x: 0, y: 0 });
  }

  return (
    <section className="px-4 pb-32 flex flex-col items-center">
      <motion.button
        ref={btnRef}
        onClick={() => router.push('/game')}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: magnet.x, y: magnet.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative group px-12 py-5 text-lg font-semibold rounded-2xl
          bg-red-500/15 backdrop-blur-xl border border-red-400/25
          text-red-200 cursor-pointer overflow-hidden
          hover:bg-red-500/25 transition-colors"
        style={{ minHeight: 56 }}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" />

        <span className="relative z-10 flex items-center gap-3">
          开始游戏
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </motion.button>

      <p className="mt-6 text-sm text-white/25">
        5 轮挑战 · 全球评分 · 无需注册
      </p>
    </section>
  );
}
