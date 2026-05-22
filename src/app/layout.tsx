import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '探索中国 - 地理猜猜猜',
  description: '看看你有多了解中国！根据真实照片在地图上猜测位置，挑战你的地理知识。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link rel="preconnect" href="https://webapi.amap.com" />
      </head>
      <body className="h-full antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
