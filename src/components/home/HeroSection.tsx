'use client';

import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/constants';

const floatingPins = [
  { x: '15%', y: '25%', delay: 0.4 },
  { x: '25%', y: '55%', delay: 0.5 },
  { x: '70%', y: '30%', delay: 0.6 },
  { x: '80%', y: '60%', delay: 0.7 },
  { x: '45%', y: '75%', delay: 0.8 },
];

function FloatingPin({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-3 h-3"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.3, 1],
        y: [0, -12, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay: delay + 0.3, duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
        y: { delay: delay + 0.3, duration: 3, repeat: Infinity, repeatType: 'reverse' },
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-400/50">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Floating map pins */}
      {floatingPins.map((pin, i) => (
        <FloatingPin key={i} {...pin} />
      ))}

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <motion.p
          className="text-sm md:text-base text-red-300/60 mb-6 tracking-widest uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Explore China
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className="bg-gradient-to-r from-white via-red-200 to-white/60 bg-clip-text text-transparent">
            探索中国
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/40 mb-2 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          你有多了解这片土地？
        </motion.p>

        <motion.p
          className="text-sm text-white/25 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          一张照片，一个地点，你能否一眼认出？
          <br />
          五轮挑战，看看谁才是真正的中国通。
        </motion.p>
      </motion.div>
    </section>
  );
}
