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
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center`}>
        <p className="text-gray-300 text-sm">图片加载中...</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-3xl shadow-xl shadow-black/10 ring-1 ring-black/5`}>
      <motion.img
        key={src}
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-3xl"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-50', 'flex', 'items-center', 'justify-center');
            const text = document.createElement('p');
            text.className = 'text-gray-300 text-sm';
            text.textContent = '图片加载中...';
            parent.appendChild(text);
          }
        }}
      />
    </div>
  );
}
