import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '指南',
    items: [
      { text: '快速开始', link: '/install' },
    ],
  },
  {
    text: 'API',
    items: [
      { text: 'domResize', link: '/dom-resize' },
      { text: 'domRotate', link: '/dom-rotate' },
      { text: 'domScale', link: '/dom-scale' },
    ],
  },
];
