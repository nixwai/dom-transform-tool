import { createModulePaths, projRoot } from '../common/paths.ts';

export { projRoot };

export const [toolRoot, toolOutput] = createModulePaths('utils');
