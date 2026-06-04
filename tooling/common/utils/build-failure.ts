import { BuildCommandError } from './build-error';
import { formatExit, formatUnknownError } from './error';

function appendOutput(lines: string[], label: string, output: string) {
  const text = output.trim();

  if (!text) {
    return;
  }

  lines.push(`${label}:`);
  const indentText = text.split(/\r?\n/).map(line => `  ${line}`).join('\n');
  lines.push(indentText);
}

/** 打印构建失败上下文，优先展示 stderr，再补充 stdout。 */
export function printBuildFailure(title: string, step: string | undefined, error: unknown) {
  const lines = [
    '',
    `Build failed: ${title}`,
  ];

  if (step) {
    lines.push(`Step: ${step}`);
  }

  if (error instanceof BuildCommandError) {
    lines.push(`Command: ${error.command}`);
    lines.push(`Cwd: ${error.cwd}`);
    lines.push(`Exit: ${formatExit(error)}`);
    appendOutput(lines, 'stderr', error.stderr);
    appendOutput(lines, 'stdout', error.stdout);
  }
  else {
    lines.push(formatUnknownError(error));
  }

  console.error(lines.join('\n'));
}
