import { resolve } from 'node:path';

/** 项目根路径 */
export const projRoot = resolve(__dirname, '../../');

/** pkg根目录 */
export const pkgRoot = resolve(projRoot, 'packages');

/** 获取模块根路径以及打包路径 */
export function createModulePaths(rootPath: string) {
  const root = resolve(pkgRoot, rootPath);
  const output = resolve(root, 'dist');
  return [root, output];
}
