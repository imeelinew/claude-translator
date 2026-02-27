'use strict';

module.exports = [
  // Kept commented to mirror current runtime behavior in claude-translator.js
  // [/^(\d+)\s+chats?\s+with\s+Claude$/i, "$1 条和 Claude 的对话"], // handled by translateDynamicText
  // [/^Last\s+message\s+(\d+)\s+hours?\s+ago$/i, "上次对话是 $1 小时前"], // handled by translateDynamicText
  // [/^Last\s+message\s+(\d+)\s+days?\s+ago$/i, "上次对话是 $1 天前"], // handled by translateDynamicText
  // [/^(\d+)\s+hours?\s+ago$/i, "$1 小时前"], // handled by translateDynamicText
  // [/^(\d+)\s+days?\s+ago$/i, "$1 天前"], // handled by translateDynamicText
];
