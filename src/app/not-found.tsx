import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-white/5 mb-4">404</p>
        <h2 className="text-xl text-white/40 mb-6">这个页面不存在</h2>
        <Link
          href="/"
          className="px-6 py-3 text-sm text-violet-300 border border-violet-400/30 rounded-xl hover:bg-violet-500/10 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
