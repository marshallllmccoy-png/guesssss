'use client';

import { motion } from 'framer-motion';
import { SPRING_GENTLE, EASE_OUT } from '@/lib/constants';

// ── Light theme floating pins ──
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
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.3, 1],
        y: [0, -12, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay: delay + 0.3, duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
        y: { delay: delay + 0.3, duration: 3, repeat: Infinity, repeatType: 'reverse' },
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-400/40">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    </motion.div>
  );
}

// ── Light theme glass cards ──
function LightGlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-black/6 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function LightGlassButton({ children, primary = false }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      className={`relative group px-12 py-5 text-lg font-semibold rounded-2xl cursor-pointer transition-colors ${
        primary
          ? 'bg-red-500/10 border border-red-400/30 text-red-600 hover:bg-red-500/20'
          : 'bg-white/60 border border-black/8 text-gray-600 hover:bg-white/80'
      }`}
    >
      {children}
    </button>
  );
}

// ── Rules data ──
const rules = [
  { title: '查看照片', desc: '每轮你会看到一张中国某地的真实照片，仔细观察建筑、植被和地形线索。' },
  { title: '标记地图', desc: '在中国地图上点击你认为的位置。越准确，分数越高。' },
  { title: '获得分数', desc: '五轮过后揭晓总分。看看你比全国多少玩家更了解中国。' },
];

export default function LightPreviewPage() {
  return (
    <div className="min-h-screen" style={{ background: '#faf7f2', color: '#1a1815' }}>
      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fef7f0 0%, #faf7f2 100%)' }}>
        {floatingPins.map((pin, i) => (
          <FloatingPin key={i} {...pin} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-red-100/30 via-transparent to-transparent pointer-events-none" />

        <motion.div
          className="relative z-10 text-center max-w-2xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <motion.p
            className="text-sm md:text-base text-red-400/70 mb-6 tracking-widest uppercase"
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
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 bg-clip-text text-transparent">
              探索中国
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-500 mb-2 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            你有多了解这片土地？
          </motion.p>

          <motion.p
            className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed"
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

      {/* ═══════════ Rules Section ═══════════ */}
      <section className="px-4 py-24 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-12">怎么玩</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING_GENTLE, delay: i * 0.15 }}
            >
              <LightGlassCard className="p-8 text-center h-full">
                <div className="text-red-400 mb-5 flex justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{rule.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{rule.desc}</p>
              </LightGlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ Start Button ═══════════ */}
      <section className="px-4 pb-16 flex flex-col items-center">
        <LightGlassButton primary>
          <span className="relative z-10 flex items-center gap-3">
            开始游戏
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </LightGlassButton>
        <p className="mt-6 text-sm text-gray-350" style={{ color: '#b0a99e' }}>
          5 轮挑战 · 全球评分 · 无需注册
        </p>
      </section>

      {/* ═══════════ Game UI Samples ═══════════ */}
      <section className="px-4 pb-24 max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-center text-gray-500 mb-8">游戏界面预览</h2>

        {/* Header bar */}
        <div className="bg-white/50 backdrop-blur-xl border border-black/6 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">回合</span>
            <span className="text-lg font-semibold text-gray-800">
              第3<span className="text-gray-300 text-sm">/5</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">得分</span>
            <span className="text-lg font-semibold tabular-nums" style={{ color: '#E56442' }}>12,450</span>
          </div>
        </div>

        {/* Result card */}
        <LightGlassCard className="p-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">成都 · 四川</p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-800">42 km</span>
            <span className="text-sm text-gray-400">误差</span>
          </div>
          <div className="text-5xl font-bold tabular-nums mb-2" style={{ color: '#E56442' }}>3,280</div>
          <p className="text-xs text-gray-350 mb-4" style={{ color: '#b0a99e' }}>本轮得分</p>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            成都是大熊猫的故乡，也是川菜的发源地，拥有超过3000年的建城史。
          </p>
          <LightGlassButton primary>下一轮</LightGlassButton>
        </LightGlassCard>

        {/* Score summary */}
        <LightGlassCard className="p-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">最终得分</p>
          <div className="text-6xl font-bold tabular-nums mb-3" style={{ color: '#E56442' }}>18,720</div>
          <div className="w-full bg-black/5 rounded-full h-2 mb-3">
            <div className="h-2 rounded-full" style={{ width: '78%', background: '#E56442' }} />
          </div>
          <p className="text-sm text-gray-400">超过 78% 的玩家</p>
        </LightGlassCard>

        {/* Round breakdown with map placeholder */}
        <LightGlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm font-mono">#1</span>
              <div>
                <p className="text-sm text-gray-700">杭州市</p>
                <p className="text-xs text-gray-400">浙江</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">12 km</p>
              <p className="text-sm font-semibold tabular-nums" style={{ color: '#E56442' }}>4,100 分</p>
            </div>
          </div>
          {/* Mini map placeholder */}
          <div className="w-full rounded-xl border border-black/5 flex items-center justify-center" style={{ height: 200, background: '#f0ede7' }}>
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-xs text-gray-350" style={{ color: '#b0a99e' }}>Mini 地图</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#e2483a' }} />
              你的猜测
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#22c55e' }} />
              实际位置
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mt-3 pt-3 border-t border-black/5">
            杭州西湖是中国最著名的湖泊之一，被联合国教科文组织列为世界文化遗产。
          </p>
        </LightGlassCard>

        {/* Button variants */}
        <div className="flex gap-3 justify-center pt-4">
          <LightGlassButton primary>主要按钮</LightGlassButton>
          <LightGlassButton>次要按钮</LightGlassButton>
        </div>
      </section>
    </div>
  );
}
