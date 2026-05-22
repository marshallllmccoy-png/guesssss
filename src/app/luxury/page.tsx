'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ── Elegant spring preset ──
const spring = { type: 'spring' as const, stiffness: 60, damping: 20 };
const gentle  = { type: 'spring' as const, stiffness: 40, damping: 25 };

// ── Product data ──
const products = [
  { name: 'The Midnight Oud', category: 'Eau de Parfum', price: '¥4,280', img: '⚱️', tag: '限量' },
  { name: 'Serpentine Chronograph', category: 'Swiss Automatic', price: '¥128,000', img: '⌚', tag: '手工' },
  { name: 'Noir Essence', category: 'Handbag · Calfskin', price: '¥36,500', img: '👜', tag: '经典' },
];

const values = [
  { title: '百年传承', desc: '始于1923年的手工坊，每一件作品跨越三代匠人。', icon: '✦' },
  { title: '珍稀材质', desc: '仅选用全球0.1%的顶级原料，每年限量采购。', icon: '◆' },
  { title: '私人订制', desc: '一对一专属顾问，打造只属于您的传世之作。', icon: '◈' },
];

// ── Liquid Glass background element ──
function LiquidOrb({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.5, 0.3],
        rotate: [0, 45, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ── Magnetic button ──
function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.2;
    const y = (e.clientY - r.top - r.height / 2) * 0.2;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={gentle}
      className={`relative backdrop-blur-2xl border border-white/15 rounded-full
        font-light tracking-[0.15em] transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}

// ── SECTION: Hero ──
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Liquid orbs */}
      <LiquidOrb className="w-[600px] h-[600px] bg-amber-500/15 -top-40 -left-40" />
      <LiquidOrb className="w-[500px] h-[500px] bg-amber-200/10 top-1/2 -right-32" />
      <LiquidOrb className="w-[400px] h-[400px] bg-amber-600/8 bottom-0 left-1/3" />

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
      />

      <div className="relative z-10 text-center max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mb-8"
        >
          <span className="inline-block w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent align-middle mr-4" />
          <span className="text-amber-300/60 text-xs tracking-[0.4em] uppercase align-middle">Maison Éternelle</span>
          <span className="inline-block w-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent align-middle ml-4" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ...spring }}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6 leading-[1.1]"
        >
          时间是<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">唯一</span>
          <br />真正的奢侈品
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-white/30 text-lg md:text-xl font-light tracking-wider mb-12 leading-relaxed"
        >
          每一件作品，皆为永恒而造
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton className="px-10 py-4 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20 text-sm">
            探索系列
          </MagneticButton>
          <MagneticButton className="px-10 py-4 bg-white/3 text-white/50 hover:bg-white/8 text-sm">
            预约鉴赏
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-amber-400/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

// ── SECTION: Brand Story ──
function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-[#0c0c0c] overflow-hidden">
      <LiquidOrb className="w-[300px] h-[300px] bg-amber-400/5 -bottom-20 right-1/4" />

      <motion.div style={{ opacity, y }} className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-300/40 text-xs tracking-[0.3em] uppercase">Our Story</span>
            <h2 className="text-3xl md:text-5xl font-light text-white mt-4 mb-8 leading-tight">
              一个世纪的<br />
              <span className="text-amber-200/70">沉默坚守</span>
            </h2>
            <p className="text-white/25 text-base leading-relaxed font-light">
              自1923年，我们在佛罗伦萨的小巷中创立了第一家手工坊。一百多年来，世界天翻地覆，
              我们始终只做一件事 —— 用时间对抗时间。每一件作品从选材到完工，需要至少
              <span className="text-amber-300/50"> 200 小时</span>的纯手工打磨。
            </p>
            <p className="text-white/25 text-base leading-relaxed mt-4 font-light">
              我们不为所有人而造。只为那些懂得「等待」即是最高奢侈的人。
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-[#0c0c0c] rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-10">⏳</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="backdrop-blur-xl bg-black/30 border border-white/5 rounded-xl p-4">
                  <p className="text-amber-200/70 text-sm tracking-wider">1923 — ∞</p>
                  <p className="text-white/20 text-xs mt-1">Florence, Italy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── SECTION: Featured Products ──
function FeaturedProducts() {
  return (
    <section className="relative py-32 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-amber-300/40 text-xs tracking-[0.3em] uppercase">Featured</span>
          <h2 className="text-3xl md:text-5xl font-light text-white mt-4">臻选之作</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.15, ...spring }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-b from-white/3 to-white/[0.01] rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm mb-6">
                <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-700">
                  {p.img}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase bg-amber-500/20 text-amber-300/80 px-3 py-1 rounded-full border border-amber-400/10">
                    {p.tag}
                  </span>
                </div>
                {/* Liquid glass hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                  bg-gradient-to-t from-amber-500/5 via-transparent to-transparent" />
              </div>
              <p className="text-white/20 text-xs tracking-[0.15em] uppercase mb-1">{p.category}</p>
              <h3 className="text-white/80 text-lg font-light tracking-wide mb-1">{p.name}</h3>
              <p className="text-amber-300/60 text-sm font-light">{p.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION: Brand Values ──
function BrandValues() {
  return (
    <section className="relative py-32 bg-[#0c0c0c] overflow-hidden">
      <LiquidOrb className="w-[400px] h-[400px] bg-amber-300/5 -top-32 -left-32" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-amber-300/40 text-xs tracking-[0.3em] uppercase">Philosophy</span>
          <h2 className="text-3xl md:text-5xl font-light text-white mt-4">何以传世</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.2, ...spring }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-white/5
                flex items-center justify-center backdrop-blur-xl bg-white/[0.02]
                group-hover:border-amber-400/20 group-hover:bg-amber-400/[0.03] transition-all duration-500">
                <span className="text-2xl text-amber-300/40 group-hover:text-amber-300/70 transition-colors duration-500">{v.icon}</span>
              </div>
              <h3 className="text-white/70 text-lg font-light tracking-wide mb-3">{v.title}</h3>
              <p className="text-white/20 text-sm leading-relaxed font-light">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SECTION: Exclusive Membership ──
function MembershipCTA() {
  return (
    <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      <LiquidOrb className="w-[500px] h-[500px] bg-amber-200/8 -bottom-40 left-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ...gentle }}
        className="max-w-3xl mx-auto px-6 text-center relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/8 rounded-3xl p-12 md:p-20
          shadow-[0_0_120px_rgba(251,191,36,0.03)]">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-amber-300/50 text-xs tracking-[0.4em] uppercase"
          >
            Membership
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl md:text-5xl font-light text-white mt-6 mb-6 leading-tight"
          >
            成为Éternelle<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">私享会员</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-white/25 text-base font-light mb-12 max-w-md mx-auto leading-relaxed"
          >
            会员享有优先选购限量系列、私人定制服务、全球臻品预览、以及每年两次的佛罗伦萨手工坊私访之旅。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <MagneticButton className="px-12 py-5 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25 text-sm tracking-[0.2em]">
              申请加入
            </MagneticButton>
            <p className="text-white/10 text-xs mt-6 font-light">
              每年仅开放 200 个新名额 · 需通过审核
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ── SECTION: Footer ──
function Footer() {
  return (
    <footer className="py-16 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-amber-300/50 text-lg tracking-[0.3em] font-light">ÉTERNELLE</p>
            <p className="text-white/15 text-xs mt-2 font-light">Since 1923 · Firenze</p>
          </div>
          <div className="flex gap-8 text-white/20 text-xs tracking-wider font-light">
            <span className="hover:text-white/40 cursor-pointer transition-colors">隐私政策</span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">条款与条件</span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">联系我们</span>
          </div>
        </div>
        <p className="text-white/10 text-xs text-center mt-10 font-light">
          © 2026 Maison Éternelle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── LANDING PAGE ──
export default function LuxuryLanding() {
  return (
    <main className="bg-[#0a0a0a] text-white font-light selection:bg-amber-500/20 selection:text-amber-200">
      <Hero />
      <BrandStory />
      <FeaturedProducts />
      <BrandValues />
      <MembershipCTA />
      <Footer />
    </main>
  );
}
