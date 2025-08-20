import type { PluginOption } from 'vite';
import { dirname, relative } from 'node:path';

/** vue组件样式自动引入插件 */
export function styleInjectPlugin(): PluginOption {
  return {
    name: 'style-inject',
    generateBundle({ format }, bundle) {
      const cssPath: Record<string, string[]> = {};
      const vueBundler: Record<string, any> = {};
      for (const bundler of Object.values(bundle)) {
        const { fileName } = bundler;
        const directoryMatch = fileName.split('/').slice(0, 2).join('/');
        // 收集需要组件的css文件地址
        if (fileName.includes('.css')) {
          if (!cssPath[directoryMatch]) {
            cssPath[directoryMatch] = [];
          }
          cssPath[directoryMatch].push(fileName);
        }
        // 收集需要插入css的组件入口文件
        if (directoryMatch && 'code' in bundler && [`${directoryMatch}/index.js`, `${directoryMatch}/index.mjs`].includes(fileName)) {
          vueBundler[directoryMatch] = bundler;
        }
      }
      for (const key in vueBundler) {
        const bundler = vueBundler[key];
        if (!cssPath[key]) {
          continue;
        }
        // 生成引入文件代码
        const injection = cssPath[key].map((cssFilePath) => {
          cssFilePath = relative(dirname(bundler.fileName), cssFilePath).replaceAll(/[\\/]+/g, '/');
          cssFilePath = cssFilePath.startsWith('.') ? cssFilePath : `./${cssFilePath}`;
          return format === 'es' ? `import '${cssFilePath}';\n` : `require('${cssFilePath}');\n`;
        }).join('');
        // 插入代码
        bundler.code = bundler.code.concat(injection);
      }
    },
  };
}
