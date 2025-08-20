import { series } from 'gulp';
import { run } from '../tasks';
import { toolRoot } from './paths';

export default series(
  () => run('bumpp --commit "chore(tool): release v%s" --tag "v%s(tool)"', toolRoot),
);
