import { resolve } from 'node:path';
import { pkgRoot } from '../paths';

/** 工具库代码根目录 */
export const toolRoot = resolve(pkgRoot, 'utils');

/** 工具库打包目录 */
export const toolOutput = resolve(toolRoot, 'dist');
