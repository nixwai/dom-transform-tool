/** 单个构建命令的执行结果，失败时也会保留 stdout/stderr 方便排查。 */
export interface BuildCommandResult {
  command: string
  cwd: string
  stdout: string
  stderr: string
  code: number | null
  signal: string | null
}

/** 子进程命令失败时抛出的错误，附带命令、目录、退出码和完整输出。 */
export class BuildCommandError extends Error {
  command: string;
  cwd: string;
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;

  constructor(result: BuildCommandResult) {
    super(`Command failed: ${result.command}`);
    this.name = 'BuildCommandError';
    this.command = result.command;
    this.cwd = result.cwd;
    this.stdout = result.stdout;
    this.stderr = result.stderr;
    this.code = result.code;
    this.signal = result.signal;
  }
}
