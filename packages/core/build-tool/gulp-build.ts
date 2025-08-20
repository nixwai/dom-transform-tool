import { series } from 'gulp';
import { delPath, run } from '../tasks';
import { toolOutput } from './paths';

export default series(
  () => delPath(toolOutput),
  () => run('vite build'),
);
