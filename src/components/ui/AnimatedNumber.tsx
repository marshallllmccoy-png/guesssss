'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({ value, duration = 2, className = '' }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20, duration: duration * 1000 });
  const display = useTransform(spring, (v) => Math.round(v));

  const prevValue = useRef(0);

  useEffect(() => {
    motionValue.set(prevValue.current);
    const timer = setTimeout(() => {
      prevValue.current = value;
      motionValue.set(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
}
