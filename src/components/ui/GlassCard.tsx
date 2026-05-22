'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/70 border border-black/6 rounded-2xl shadow-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
