import { series } from 'gulp';
import { version } from '../../utils/package.json';
import { delPath, publishTask, releaseTask, run } from '../tasks';
import { toolOutput, toolRoot } from './paths';

export const release = series(
  () => releaseTask('tool', toolRoot),
);

export const build = series(
  () => delPath(toolOutput),
  () => run('vite build'),
);

export const publish = series(
  () => publishTask(version, toolRoot),
);
