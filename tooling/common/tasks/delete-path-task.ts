import fs from 'node:fs';

export async function delPath(path: string): Promise<void> {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true });
  }
};
