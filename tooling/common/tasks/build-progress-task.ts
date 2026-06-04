import type { BuildCommandResult } from '../utils';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { BuildCommandError, formatDuration, formatUnknownError, printBuildFailure, ProgressBar } from '../utils';

export { BuildCommandError } from '../utils';

export interface BuildStep {
  name: string
  run: () => Promise<unknown> | unknown
}

export function runBuildCommand(command: string, cwd = '.'): Promise<BuildCommandResult> {
  const resolvedCwd = resolve(cwd);

  return new Promise((resolvePromise, reject) => {
    let stdout = '';
    let stderr = '';
    let settled = false;

    const app = spawn(command, {
      cwd: resolvedCwd,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    app.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    app.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    app.on('error', (error) => {
      if (settled) {
        return;
      }

      settled = true;
      reject(new BuildCommandError({
        command,
        cwd: resolvedCwd,
        stdout,
        stderr: `${stderr}${formatUnknownError(error)}`,
        code: null,
        signal: null,
      }));
    });

    app.on('close', (code, signal) => {
      if (settled) {
        return;
      }

      settled = true;
      const result = {
        command,
        cwd: resolvedCwd,
        stdout,
        stderr,
        code,
        signal,
      };

      if (code === 0) {
        resolvePromise(result);
        return;
      }

      reject(new BuildCommandError(result));
    });
  });
}

/** 按顺序执行单包构建阶段，并在控制台展示阶段级进度。 */
export async function runBuildSteps(title: string, steps: BuildStep[]) {
  const progress = new ProgressBar(title, steps.length);
  const startTime = Date.now();

  for (const step of steps) {
    progress.step(step.name);

    try {
      await step.run();
      progress.complete(step.name);
    }
    catch (error) {
      progress.fail(`${step.name} failed`);
      printBuildFailure(title, step.name, error);
      throw new Error(`${title} build failed at "${step.name}"`);
    }
  }

  progress.finish(`done in ${formatDuration(Date.now() - startTime)}`);
}
