import { run } from './command-runner-task';

export async function releaseTask(type: string, rootPath: string) {
  return run(`bumpp --commit "chore(${type}): release v%s" --tag "v%s(${type})"`, rootPath);
}
