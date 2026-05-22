import sharp from 'sharp';
import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { existsSync } from 'node:fs';

const INPUT_DIR = 'raw-images';
const OUTPUT_DIR = 'public/locations';
const MAX_WIDTH = 1600;
const QUALITY = 75;

async function run() {
  if (!existsSync(INPUT_DIR)) {
    console.error(`❌ "${INPUT_DIR}" 目录不存在`);
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(INPUT_DIR)).filter((f) => {
    const ext = extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  if (files.length === 0) {
    console.log('📭 raw-images/ 中没有 jpg/png 文件');
    return;
  }

  console.log(`🔍 找到 ${files.length} 个文件，开始压缩...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const name = basename(file, extname(file));
    const outputPath = join(OUTPUT_DIR, `${name}.webp`);

    const beforeSize = (await stat(inputPath)).size;
    totalBefore += beforeSize;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const afterSize = (await stat(outputPath)).size;
    totalAfter += afterSize;

    const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);
    const beforeKB = (beforeSize / 1024).toFixed(0);
    const afterKB = (afterSize / 1024).toFixed(0);

    console.log(
      `${name}.webp  ${beforeKB}KB → ${afterKB}KB  (${reduction}%)  ${
        afterSize > 500 * 1024 ? '⚠️  超过 500KB' : '✅'
      }`
    );
  }

  console.log(`\n📊 总计:`);
  console.log(`   原始: ${(totalBefore / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`   输出: ${(totalAfter / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`   节省: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  console.log(`   输出目录: ${OUTPUT_DIR}/`);
}

run().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
