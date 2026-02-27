'use strict';

module.exports = [
  // Keep aligned with I18N.public.selector in claude-translator.js
  ["a[aria-label='New chat'] span", "新建对话"],
  ["a[aria-label='Search'] span", "搜索"],
  ["a[aria-label='Customize'] span", "自定义"],
  ["a[aria-label='Chats'] span", "对话"],
  ["a[aria-label='Projects'] span", "项目"],
  ["a[aria-label='Code'] span", "代码"],
  ["[aria-label='Starred'] span, [aria-label='Starred']", "已星标"],
  ["[aria-label='Recents'] span, [aria-label='Recents']", "最近对话"],
  ["button[aria-label*='Hide'] span, button[title*='Hide'] span", "隐藏"],
];
