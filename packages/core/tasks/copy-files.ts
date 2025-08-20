import fs from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

export async function copyFiles(outputPath: string, copyPaths: string[]): Promise<void> {
  try {
    // 确保输出目录存在
    await fs.mkdir(outputPath, { recursive: true });

    // 并行复制所有文件
    await Promise.all(
      copyPaths.map(async (sourcePath) => {
        const fullSource = resolve(sourcePath);
        const fileName = basename(fullSource);
        const fullDest = resolve(outputPath, fileName);

        // 创建目标目录结构
        await fs.mkdir(dirname(fullDest), { recursive: true });

        // 执行文件复制
        await fs.copyFile(fullSource, fullDest);
      }),
    );
  }
  catch (error) {
    console.error(`Error copying files:`, error);
  }
}
