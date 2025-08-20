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
      { text: '调整大小', link: '/dom-resize' },
    ],
  },
];
