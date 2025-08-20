import { defineConfig } from 'vitepress';
import { navbar } from './navbar';
import { sidebar } from './sidebar';

export const zh = defineConfig({
  lang: 'zh-CN',
  themeConfig: {
    nav: navbar,
    sidebar,
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: { label: '页面导航' },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
});
