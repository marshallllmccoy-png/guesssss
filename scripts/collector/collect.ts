import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { BAIDU_AK, CHINA_BOUNDS, COLLECT_CONFIG } from './config';
import { nearestCity, MAJOR_CITIES } from './geo';
import type { LocationData } from '../../src/types/location';

interface DownloadedImage {
  filename: string;
  filepath: string;
  lat: number;
  lng: number;
  city: string;
  province: string;
  size: number;
}

// ── 随机坐标生成 ──

function randomCoord(): { lat: number; lng: number } {
  const lat = CHINA_BOUNDS.minLat + Math.random() * (CHINA_BOUNDS.maxLat - CHINA_BOUNDS.minLat);
  const lng = CHINA_BOUNDS.minLng + Math.random() * (CHINA_BOUNDS.maxLng - CHINA_BOUNDS.minLng);
  return { lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
}

/** 在指定城市周围生成坐标 */
function coordNearCity(lat: number, lng: number, radiusKm = 15): { lat: number; lng: number } {
  const latDelta = (radiusKm / 111) * (Math.random() * 2 - 1);
  const lngDelta = (radiusKm / (111 * Math.cos((lat * Math.PI) / 180))) * (Math.random() * 2 - 1);
  return { lat: +(lat + latDelta).toFixed(6), lng: +(lng + lngDelta).toFixed(6) };
}

function randomZoom(): number {
  // Vary zoom for different difficulty: 14-17 for visible detail
  return Math.floor(Math.random() * 4) + 14;
}

// ── 百度静态图 API ──

const STATICMAP_URL = 'https://api.map.baidu.com/staticimage/v2';

async function fetchStaticMap(lat: number, lng: number, zoom: number): Promise<{ buffer: Buffer; size: number } | null> {
  const url = `${STATICMAP_URL}?ak=${BAIDU_AK}`
    + `&width=${COLLECT_CONFIG.imageWidth}&height=${COLLECT_CONFIG.imageHeight}`
    + `&center=${lng},${lat}&zoom=${zoom}`
    + `&coordtype=wgs84ll`;

  try {
    const resp = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: { 'User-Agent': 'Chinese-GeoGuessr-Collector/1.0' },
    });

    const buffer = Buffer.from(resp.data);
    const size = buffer.length;

    if (size < COLLECT_CONFIG.minFileSize) return null;

    // Check for PNG header
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return { buffer, size };
    // Check for JPEG header
    if (buffer[0] === 0xff && buffer[1] === 0xd8) return { buffer, size };
    return null;
  } catch {
    return null;
  }
}

// ── 图片保存 ──

function slugify(text: string): string {
  return text
    .replace(/[（）()]/g, '')
    .replace(/[\s·]+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function generateFilename(city: string, index: number, zoom: number): string {
  return `${slugify(city)}-${String(index + 1).padStart(2, '0')}-z${zoom}.png`;
}

// ── 重复检测 ──

function isTooClose(lat: number, lng: number, existing: DownloadedImage[], minDistKm = 20): boolean {
  for (const img of existing) {
    const dLat = lat - img.lat;
    const dLng = lng - img.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
    if (dist < minDistKm / 111) return true;
  }
  return false;
}

// ── Locations.ts 生成 ──

function generateLocationsFile(images: DownloadedImage[]): string {
  const entries = images.map((img, i) => {
    const funFacts = [
      `${img.city}位于${img.province}，是中国著名的旅游目的地。`,
      `${img.city}是${img.province}的重要城市，历史悠久，文化底蕴深厚。`,
      `${img.city}以其独特的自然风光和人文景观吸引着全国各地的游客。`,
      `位于${img.province}的${img.city}，融合了传统与现代的独特魅力。`,
      `${img.city}拥有丰富的非物质文化遗产，是了解${img.province}文化的窗口。`,
    ];
    const fact = funFacts[i % funFacts.length];

    return `  {
    id: '${img.filename.replace('.png', '')}',
    imageUrl: '/images/locations/${img.filename}',
    city: '${img.city}',
    province: '${img.province}',
    latitude: ${img.lat},
    longitude: ${img.lng},
    funFact: '${fact}',
    difficulty: ${Math.random() > 0.5 ? 2 : 3} as 1 | 2 | 3,
  }`;
  });

  return `import { LocationData } from '@/types/location';

// 自动采集于 ${new Date().toISOString().slice(0, 10)}
// 共 ${images.length} 个地点

export const locations: LocationData[] = [
${entries.join(',\n')},
];

export function getRandomLocations(count: number): number[] {
  const indices = Array.from({ length: locations.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}
`;
}

// ── 主采集流程 ──

async function main() {
  console.log('╔═══════════════════════════════════╗');
  console.log('║   中国地图采集器 v1.0            ║');
  console.log('╚═══════════════════════════════════╝\n');

  if (!BAIDU_AK || BAIDU_AK === '你的AK') {
    console.error('❌ 请先在 scripts/collector/config.ts 或 .env.local 中配置 BAIDU_MAP_AK');
    process.exit(1);
  }

  const outputDir = path.resolve(__dirname, COLLECT_CONFIG.outputDir);
  const metadataPath = path.resolve(__dirname, COLLECT_CONFIG.metadataPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const images: DownloadedImage[] = [];
  let attempts = 0;
  let validCount = 0;

  console.log(`🎯 目标: ${COLLECT_CONFIG.targetCount} 张地图截图\n`);

  for (attempts = 0; attempts < COLLECT_CONFIG.maxAttempts && images.length < COLLECT_CONFIG.targetCount; attempts++) {
    const useCity = Math.random() < 0.8 && MAJOR_CITIES.length > 0;
    let coord: { lat: number; lng: number };

    if (useCity) {
      const city = MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
      coord = coordNearCity(city.lat, city.lng, 10 + Math.random() * 30);
    } else {
      coord = randomCoord();
    }

    if (isTooClose(coord.lat, coord.lng, images)) continue;

    const zoom = randomZoom();

    const pct = ((images.length / COLLECT_CONFIG.targetCount) * 100).toFixed(0);
    process.stdout.write(`\r  尝试 ${attempts + 1}/${COLLECT_CONFIG.maxAttempts}  `
      + `| 已采集 ${images.length}/${COLLECT_CONFIG.targetCount} (${pct}%)  `
      + `| ${coord.lat.toFixed(2)}, ${coord.lng.toFixed(2)} z${zoom}`);

    const result = await fetchStaticMap(coord.lat, coord.lng, zoom);
    if (!result) continue;

    validCount++;

    const cityInfo = nearestCity(coord.lat, coord.lng);
    const filename = generateFilename(cityInfo.name, images.length, zoom);
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, result.buffer);

    images.push({
      filename,
      filepath,
      lat: coord.lat,
      lng: coord.lng,
      city: cityInfo.name,
      province: cityInfo.province,
      size: result.size,
    });

    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('\n');

  // 生成 locations.ts
  const tsContent = generateLocationsFile(images);
  fs.writeFileSync(metadataPath, tsContent, 'utf-8');

  // 报告
  console.log('═══════════════════════════════════');
  console.log('  采集报告');
  console.log('═══════════════════════════════════');
  console.log(`  总尝试次数: ${attempts}`);
  console.log(`  有效地图:   ${validCount} (${((validCount / attempts) * 100).toFixed(1)}%)`);
  console.log(`  成功保存:   ${images.length} 张`);
  console.log(`  图片目录:   ${outputDir}`);
  console.log(`  数据文件:   ${metadataPath}`);

  const totalSize = images.reduce((s, i) => s + i.size, 0);
  console.log(`  总大小:     ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log('═══════════════════════════════════\n');

  console.log('📍 采集到的地点预览:\n');
  for (const img of images) {
    console.log(`  ${img.city} · ${img.province}  (${img.lat.toFixed(2)}, ${img.lng.toFixed(2)})  ${(img.size / 1024).toFixed(0)}KB`);
  }

  console.log('\n✅ 完成！请运行 npm run dev 查看效果\n');
}

main().catch((err) => {
  console.error('\n❌ 采集失败:', err.message);
  process.exit(1);
});
