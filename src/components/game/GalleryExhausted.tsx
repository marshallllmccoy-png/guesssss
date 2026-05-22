'use client';

import { useRouter } from 'next/navigation';
import { ImagePlus, Home } from 'lucide-react';

export default function GalleryExhausted() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fef9f0] to-[#faf5ec]">
      <div className="text-center px-6 max-w-md">
        <p className="text-2xl font-bold text-[#5c4a3a] leading-relaxed">
          已经到底了，但是你可以帮助我一起为难别人嘻嘻
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={() => alert('功能即将上线，敬请期待！')}
            className="inline-flex items-center justify-center gap-3 w-full min-h-[56px] rounded-xl bg-[#E56442] text-white font-bold text-lg hover:bg-[#cf5535] transition-colors"
          >
            <ImagePlus size={22} />
            上传照片，加入图库
          </button>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center gap-3 w-full min-h-[56px] rounded-xl border-2 border-[#E56442] text-[#E56442] font-bold text-lg hover:bg-[#E56442]/5 transition-colors"
          >
            <Home size={22} />
            回到主页
          </button>
        </div>
      </div>
    </div>
  );
}
