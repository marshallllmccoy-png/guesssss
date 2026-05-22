import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
        <h2 className="text-xl text-gray-400 mb-6">这个页面不存在</h2>
        <Link
          href="/"
          className="px-6 py-3 text-sm text-red-600 border border-red-400/30 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
