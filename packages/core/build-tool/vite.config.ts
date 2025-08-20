import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { dtsPlugin } from '../vite-configs';
import { toolOutput, toolRoot } from './paths';

export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: { entry: { index: resolve(toolRoot, 'src/index.ts') } },
    rollupOptions: {
      external: ['lodash-es', 'date-fns'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          exports: 'named',
          dir: resolve(toolOutput, 'es'),
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: resolve(toolOutput, 'lib'),
        },
      ],
    },
  },
  plugins: [
    dtsPlugin(resolve(toolRoot, 'src'), toolOutput),
  ],
});
