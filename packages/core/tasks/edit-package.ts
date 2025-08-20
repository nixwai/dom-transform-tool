import path from 'node:path';
import fs from 'fs-extra';

export async function editPackage(filePath: string, editFn: (config: Record<string, any>) => void) {
  try {
    const pkgPath = path.join(filePath, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      return;
    }
    const pkg = await fs.readJson(pkgPath);
    editFn(pkg);
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
  catch (error) {
    console.error('Error editing package.json:', error);
  }
}
