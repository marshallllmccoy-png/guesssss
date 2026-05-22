// ═══════════════════════════════════════
// 百度地图静态图采集器 — 配置
// ═══════════════════════════════════════
//
// 申请 AK: https://lbsyun.baidu.com/apiconsole/key
// 必须启用「静态图」API 权限
//
//   【服务端 AK】
//     → 白名单填 IP: 0.0.0.0/0（本地开发）
//     → 需要同时填写下方的 BAIDU_SK 用于签名
//
//   【浏览器端 AK】
//     → 白名单填 referer: *（允许所有来源）
//     → 无需填写 SK
// ═══════════════════════════════════════

// 从 .env.local 读取（tsx 不会自动加载 Next.js 的 .env 文件）
function loadEnv(key: string): string {
  const envVal = process.env[key];
  if (envVal) return envVal;
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.resolve(__dirname, '../../.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(new RegExp(`^${key}=(.+)$`, 'm'));
    if (match) return match[1].trim();
  } catch {}
  return '';
}

export const BAIDU_AK = loadEnv('BAIDU_MAP_AK') || '你的AK';

// 服务端 SK（仅服务端 AK 需要，浏览器端 AK 留空即可）
export const BAIDU_SK = process.env.BAIDU_MAP_SK || '';

// 中国陆地边界（粗略）
export const CHINA_BOUNDS = {
  minLng: 73.5,
  maxLng: 135.0,
  minLat: 18.0,
  maxLat: 53.5,
};

// 采集参数
export const COLLECT_CONFIG = {
  targetCount: 30,        // 目标采集数量
  maxAttempts: 500,        // 最大尝试次数
  imageWidth: 640,         // 静态图宽度
  imageHeight: 480,        // 静态图高度
  zoom: 15,                // 地图缩放级别 (3-18, 越高越细节)
  minFileSize: 5000,       // 最小文件大小 (字节) — 低于此认定为无效
  outputDir: '../../public/images/locations',
  metadataPath: '../../src/data/locations.ts',
  concurrency: 1,          // 并发数（免费 API 建议 1）
};
