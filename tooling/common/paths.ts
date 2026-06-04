import { resolve } from 'node:path';
import process from 'node:process';

export const projRoot = resolve(process.cwd(), '../../');

export const pkgRoot = resolve(projRoot, 'packages');

export function createModulePaths(rootPath: string) {
  const root = resolve(pkgRoot, rootPath);
  const output = resolve(root, 'dist');
  return [root, output];
}
