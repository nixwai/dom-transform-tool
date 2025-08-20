import fs from 'node:fs';
import { resolve } from 'node:path';

export async function delPath(path: string): Promise<void> {
  try {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path);
      for (const file of files) {
        const curPath = resolve(path, file);
        const isDirectory = fs.statSync(curPath).isDirectory();
        if (isDirectory) {
          await delPath(curPath); // Delete all children
        }
        else {
          fs.unlinkSync(curPath);
        }
      }
      // delete path
      fs.rmdirSync(path);
    }
  }
  catch (error) {
    console.error(`Error deleting path ${path}:`, error);
  }
}
