'use client';

import { motion } from 'framer-motion';

interface LocationImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
}

export default function LocationImage({ src, alt, className = '' }: LocationImageProps) {
  if (!src) {
    return (
      <div className={`${className} bg-gradient-to-br from-red-900/15 to-red-900/15 flex items-center justify-center`}>
        <p className="text-white/20 text-sm">图片加载中...</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      <motion.img
        key={src}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add('bg-gradient-to-br', 'from-red-900/15', 'to-red-900/15', 'flex', 'items-center', 'justify-center');
            const text = document.createElement('p');
            text.className = 'text-white/20 text-sm';
            text.textContent = '图片加载中...';
            parent.appendChild(text);
          }
        }}
      />
    </div>
  );
}
