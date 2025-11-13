import { REGISTRY } from '../build-config';
import { run } from './command-runner-task';
import { versionTag } from './version-tag-generator';

export async function publishTask(version: string, rootPath: string) {
  return run(`pnpm publish --registry ${REGISTRY} ${versionTag(version)}`, rootPath);
}
