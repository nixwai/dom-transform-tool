import { resolve } from 'node:path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { zh } from './zh';

export default defineConfig({
  title: 'Dom Transform Tool',
  rewrites: { 'zh/:rest*': ':rest*' },
  base: '/dom-transform-tool/',
  outDir: resolve(__dirname, '../../../dist/docs'),
  vite: {
    plugins: [UnoCSS() as any],
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  },
  themeConfig: {
    logo: '/transform-logo.svg',
    socialLinks: [{ icon: 'github', link: 'https://github.com/nixwai/dom-transform-tool' }],
  },
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin, { demoDir: resolve(__dirname, '../../examples') });
    },
  },
  locales: {
    root: {
      label: '中文',
      ...zh,
    },
  },
});
