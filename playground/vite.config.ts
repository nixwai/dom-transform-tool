import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Unocss()],
  base: './',
  build: { emptyOutDir: true, outDir: resolve(__dirname, '../dist/play') },
});
