import { spawn } from 'node:child_process';

export async function run(command: string, path = '.') {
  const [cmd, ...args] = command.split(' ');
  return new Promise((resolve) => {
    const app = spawn(cmd, args, {
      cwd: path,
      stdio: 'inherit',
      shell: true,
    });
    app.on('close', resolve);
  });
};
