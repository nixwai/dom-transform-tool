import { series } from 'gulp';
import { version } from '../../packages/utils/package.json';
import { delPath, publishTask, releaseTask, runBuildCommand, runBuildSteps } from '../common/tasks';
import { toolOutput, toolRoot } from './paths';

export const release = series(
  () => releaseTask('tool', toolRoot),
);

export function build() {
  return runBuildSteps('tool build', [
    { name: 'clean dist', run: () => delPath(toolOutput) },
    { name: 'bundle with tsdown', run: () => runBuildCommand('tsdown --config tsdown.config.ts') },
  ]);
}

export const publish = series(
  () => publishTask(version, toolRoot),
);
