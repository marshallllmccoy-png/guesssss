'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { SPRING_GENTLE } from '@/lib/constants';

const rules = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M12 13v4" />
      </svg>
    ),
    title: '查看照片',
    desc: '每轮你会看到一张中国某地的真实照片，仔细观察建筑、植被和地形线索。',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: '标记地图',
    desc: '在中国地图上点击你认为的位置。越准确，分数越高。',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15l-2 5h4l-2-5z" />
        <circle cx="12" cy="8" r="5" />
        <path d="M12 3v2M12 13v2" />
      </svg>
    ),
    title: '获得分数',
    desc: '五轮过后揭晓总分。看看你比全国多少玩家更了解中国。',
  },
];

export default function GameRules() {
  return (
    <section className="px-4 py-24 max-w-5xl mx-auto">
      <motion.h2
        className="text-2xl md:text-3xl font-semibold text-center text-white/70 mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        怎么玩
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rules.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ ...SPRING_GENTLE, delay: i * 0.15 }}
          >
            <GlassCard className="p-8 text-center h-full">
              <div className="text-amber-400 mb-5 flex justify-center">{rule.icon}</div>
              <h3 className="text-lg font-semibold text-white/90 mb-3">{rule.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{rule.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
