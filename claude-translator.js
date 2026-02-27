// ==UserScript==
// @name         Claude.ai 中文化插件
// @namespace    https://github.com/yourname/claude-chinese
// @description  中文化 Claude.ai 界面的菜单及内容
// @version      0.2.2
// @author       你的名字
// @license      GPL-3.0
// @match        https://claude.ai/*
// @icon         https://raw.githubusercontent.com/imeelinew/claude-translator/main/icon/claude-color.svg
// @updateURL    https://raw.githubusercontent.com/imeelinew/claude-translator/main/claude-translator.js
// @downloadURL  https://raw.githubusercontent.com/imeelinew/claude-translator/main/claude-translator.js
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function (window, document, undefined) {
    'use strict';

    const FeatureSet = {
        enable_RegExp: GM_getValue('enable_regexp', true),
    };
    const MAX_TEXT_LENGTH = 500;
    const LOOKUP_CACHE_LIMIT = 2000;
    const lookupCache = new Map();
    const DEBUG = false;
    const OBSERVED_ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'value'];

    let selectorTaskScheduled = false;

    const DYNAMIC_TEXT_RULES = [
        [/^(\d+)\s+chats?\s+with\s+Claude$/i, '$1 条和 Claude 的对话'],
        [/^Last\s+message\s+(about\s+)?(\d+)\s+minutes?\s+ago$/i, '上次对话是 $2 分钟前'],
        [/^Last\s+message\s+(about\s+)?(\d+)\s+hours?\s+ago$/i, '上次对话是 $2 小时前'],
        [/^Last\s+message\s+(about\s+)?(\d+)\s+days?\s+ago$/i, '上次对话是 $2 天前'],
        [/^上次对话是\s*(about\s+)?(\d+)\s+minutes?\s+ago$/i, '上次对话是 $2 分钟前'],
        [/^上次对话是\s*(about\s+)?(\d+)\s+hours?\s+ago$/i, '上次对话是 $2 小时前'],
        [/^上次对话是\s*(about\s+)?(\d+)\s+days?\s+ago$/i, '上次对话是 $2 天前'],
        [/^(about\s+)?(\d+)\s+minutes?\s+ago$/i, '$2 分钟前'],
        [/^(about\s+)?(\d+)\s+hours?\s+ago$/i, '$2 小时前'],
        [/^(about\s+)?(\d+)\s+days?\s+ago$/i, '$2 天前'],
        [/^an\s+hour\s+ago$/i, '1 小时前'],
        [/^a\s+day\s+ago$/i, '1 天前'],
    ];

    const INLINE_SENTENCE_TRIGGER = /should Claude consider in responses\?/i;
    const INLINE_SENTENCE_LINK_TEXT = /personal preferences/i;

    /**************************************************************************
     * 词库区 —— 所有翻译在这里填写
     *
     * static（静态词库）：精确匹配原文
     *   "English text": "中文译文",
     *
     * regexp（正则词库）：匹配含变量的动态文本
     *   [/(\d+) messages?/, "$1 条消息"],
     *
     * selector（选择器词库）：用于侧边栏等 React 高频重绘区域
     *   ["CSS选择器", "中文译文"],
     **************************************************************************/
    const I18N = {
    "public": {
        "static": {
            "Customize": "自定义",
            "Customize and manage the context and tools you are giving Claude.": "自定义并管理你提供给 Claude 的上下文和工具。",
            "Connect your tools": "连接你的工具",
            "Integrate with the tools you use to complete your tasks": "与你用于完成任务的工具进行集成",
            "Create new skills": "创建新 Skills",
            "Teach Claude your processes, team norms, and expertise": "向 Claude 传授你的流程、团队规范和专业经验",
            "Projects": "项目",
            "New project": "新建项目",
            "Search projects": "搜索项目",
            "Sort by": "排序方式",
            "Activity": "最近活动",
            "Recent activity": "最近活动",
            "Last edited": "最后编辑",
            "Edited": "最后编辑",
            "Date created": "创建日期",
            "Looking to start a project?": "想开始一个项目？",
            "Upload materials, set custom instructions, and organize conversations in one space.": "在同一个空间中上传资料、设置自定义指令，并整理对话。",
            "Chats": "对话",
            "New chat": "新建对话",
            "chats with Claude": "条和 Claude 的对话",
            "Select": "选择",
            "Last message": "上次对话是",
            "hour ago": "小时前",
            "hours ago": "小时前",
            "day ago": "天前",
            "days ago": "天前",
            "Past hour": "1 小时前",
            "Today": "今天",
            "Yesterday": "昨天",
            "Past week": "一周前",
            "Show more": "显示更多",
            "Settings": "设置",
            "Code": "代码",
            "Life stuff": "生活琐事",
            "Learn": "学习",
            "Write": "写作",
            "Claude's choice": "让 Claude 出主意",
            "English (United States)": "简体中文",
            "Hide": "隐藏",
            "Recents": "最近对话",
            "Starred": "已星标",
            "Star": "星标",
            "Unstar": "取消星标",
            "Rename": "重命名",
            "Add to project": "添加到项目",
            "Delete": "删除",
            "Language": "语言",
            "Get help": "获取帮助",
            "Upgrade plan": "升级计划",
            "Get apps and extensions": "获取应用和扩展",
            "Gift Claude": "赠送 Claude",
            "Learn more": "了解更多",
            "All chats": "所有对话",
            "plan": "计划",
            "About Anthropic": "关于 Anthropic",
            "Tutorials": "教程",
            "Courses": "课程",
            "Usage policy": "使用政策",
            "Privacy policy": "隐私政策",
            "Your privacy choices": "你的隐私选择",
            "Keyboard shortcuts": "键盘快捷键",
            "Add files, connectors, and more": "添加文件、Connectors 等内容",
            "Add files or photos": "添加文件或照片",
            "Take a screenshot": "截图",
            "Start a new project": "新建项目",
            "Web search": "网络搜索",
            "Use style": "行文风格",
            "Add connectors": "添加 Connectors",
            "Normal": "普通",
            "Learning": "学习",
            "Concise": "简洁",
            "Explanatory": "详细解释",
            "Formal": "正式",
            "Create & edit styles": "创建和编辑风格",
            "Upgrade": "升级",
            "Extended": "扩展",
            "Extended thinking": "扩展思考",
            "Most capable for ambitious work": "最适合高难度任务",
            "Most efficient for everyday tasks": "最适合日常任务",
            "Fastest for quick answers": "最快获得快速回答",
            "Think longer for complex tasks": "为复杂任务进行更深度思考",
            "More models": "更多模型",
            "Upgrade to Claude Pro to use our best and latest models": "升级到 Claude Pro 以使用我们最新、最强的模型",
            "Use incognito": "使用无痕模式",
            "Close sidebar": "关闭侧边栏",
            "Open sidebar": "打开侧边栏",
            "Share": "分享",
            "Retry": "重试",
            "Edit": "编辑",
            "Copy": "复制",
            "Give positive feedback": "这次回答很好",
            "Give negative feedback": "这次回答不好",
            "Hi, I’m Claude. How can I help you today?": "你好，我是 Claude。今天我能帮你做些什么？",
            "Start a new chat": "开始新的对话",
            "Use voice mode": "使用语音模式",
            "Upgrade to Claude Pro to use our legacy models": "升级到 Claude Pro 以使用我们的旧版模型",
            "Plans that grow with you": "陪你一同成长的计划",
            "Individual": "个人",
            "Team and Enterprise": "团队与企业",
            "Meet Claude": "认识 Claude",
            "Use Claude for free": "免费使用 Claude",
            "Research, code, and organize": "研究、编程与组织管理",
            "Monthly": "按月",
            "· Save 17%": "· 立省 17%",
            "Yearly": "按年",
            "/ month billed annually": "/ 月, 按年计费",
            "Get Pro plan": "获取 Pro 计划",
            "Higher limits, priority access": "更高额度，优先访问",
            "From $100": "起价 $100",
            "/ month billed monthly": "/ 月, 按月计费",
            "Get Max plan": "获取 Max 计划",
            "Everything in Free and:": "包含 Free 版全部功能，另有：",
            "Everything in Pro, plus:": "包含 Pro 版全部功能，另有：",
            "Free plan": "Free 计划",
            "Try Claude": "试用 Claude",
            "Chat on web, iOS, Android, and on your desktop": "可在网页、iOS、Android 及桌面端聊天",
            "Generate code and visualize data": "生成代码并可视化数据",
            "Write, edit, and create content": "写作、编辑与内容创作",
            "Analyze text and images": "分析文本和图像",
            "Ability to search the web": "支持网络搜索",
            "Create files and execute code": "创建文件并执行代码",
            "Unlock more from Claude with desktop extensions": "通过桌面扩展解锁更多 Claude 功能",
            "Connect Slack and Google Workspace services": "连接 Slack 与 Google Workspace 服务",
            "Integrate any context or tool through connectors with remote MCP": "通过 Connectors 与远程 MCP 集成任意上下文或工具",
            "Extended thinking for complex work": "复杂任务的扩展思考能力",
            "More usage*": "更高使用额度*",
            "Claude Code": "Claude Code",
            "Unlimited projects": "不限项目数量",
            "Access to Research": "访问 Research",
            "Memory across conversations": "跨对话记忆",
            "More Claude models": "更多 Claude 模型",
            "Claude in Excel": "在 Excel 中使用 Claude",
            "Claude in Chrome": "在 Chrome 中使用 Claude",
            "Choose 5x or 20x more usage than Pro*": "可选比 Pro 高 5 倍或 20 倍的使用额度*",
            "Higher output limits for all tasks": "所有任务更高输出上限",
            "Early access to advanced Claude features": "抢先体验高级 Claude 功能",
            "Priority access at high traffic times": "高峰时段优先访问",
            "Claude in PowerPoint": "在 PowerPoint 中使用 Claude",
            "General": "通用",
            "Account": "账户",
            "Privacy": "隐私",
            "Billing": "账单",
            "Capabilities": "功能",
            "Profile": "个人资料",
            "Full name": "全名",
            "What should Claude call you?": "Claude 应该怎么称呼你？",
            "What best describes your work?": "你主要从事哪方面的工作？",
            "Select your work function": "请选择你的工作职能",
            "Product management": "产品管理",
            "Engineering": "工程",
            "Human resources": "人力资源",
            "Finance": "财务",
            "Marketing": "市场",
            "Sales": "销售",
            "Operations": "运营",
            "Data science": "数据科学",
            "Design": "设计",
            "Legal": "法务",
            "Other": "其他",
            "personal preferences": "个人偏好",
            "Your preferences will apply to all conversations, within Anthropic’s guidelines.": "你的偏好将适用于所有对话，并遵循 Anthropic 的使用规范。",
            "Your preferences will apply to all conversations, within": "你的偏好将适用于所有对话，并遵循",
            "Anthropic’s guidelines": "Anthropic 的使用规范",
            "Notifications": "通知",
            "Response completions": "回复完成提醒",
            "Get notified when Claude has finished a response. Most useful for long-running tasks like tool calls and Research.": "当 Claude 完成回复时接收通知。对工具调用、研究等耗时较长的任务尤其有用。",
            "Appearance": "外观",
            "Color mode": "颜色模式",
            "Light": "浅色",
            "Auto": "自动",
            "Dark": "深色",
            "Chat font": "聊天字体",
            "Default": "默认",
            "Sans": "无衬线",
            "System": "系统字体",
            "Dyslexic friendly": "阅读障碍友好",
            "Voice settings": "语音设置",
            "Voice": "语音",
            "Cancel": "取消",
            "Save changes": "保存更改",
            "Log out of all devices": "从所有设备退出登录",
            "Log out": "退出登录",
            "Delete your account": "删除你的账户",
            "Delete account": "删除账户",
            "Organization ID": "组织 ID",
            "Active sessions": "当前登录会话",
            "Device": "设备",
            "Location": "位置",
            "Created": "创建时间",
            "Updated": "更新时间",
            "Current": "当前",
            "Anthropic believes in transparent data practices": "Anthropic 致力于透明的数据使用方式",
            "Learn how your information is protected when using Anthropic products, and visit our": "了解在使用 Anthropic 产品时你的信息是如何受到保护的，并访问我们的",
            "Privacy Center": "隐私中心",
            "and": "和",
            "Privacy Policy": "隐私政策",
            "for more details.": "了解更多细节.",
            "How we protect your data": "我们如何保护你的数据",
            "How we use your data": "我们如何使用你的数据",
            "Privacy settings": "隐私设置",
            "Export data": "导出数据",
            "Shared chats": "已共享的聊天",
            "Manage": "管理",
            "Location metadata": "位置元数据",
            "Allow Claude to use coarse location metadata (city/region) to improve product experiences.": "允许 Claude 使用粗略的位置数据（城市/地区）来改进产品体验.",
            "Help improve Claude": "帮助改进 Claude",
            "Allow the use of your chats and coding sessions to train and improve Anthropic AI models.": "允许使用你的聊天和编程会话来训练和改进 Anthropic 的 AI 模型.",
            "Learn more.": "了解更多.",
            "Ask Claude to generate content like code snippets, text documents, or website designs, and Claude will create an Artifact that appears in a dedicated window alongside your conversation.": "让 Claude 生成代码片段、文本文档或网站设计等内容，Claude 会创建一个 Artifact，并在对话旁边的独立窗口中显示。",
            "AI-powered artifacts": "AI 驱动的 Artifacts",
            "Create apps, prototypes, and interactive documents that use Claude inside the artifact. Start by saying, “Let’s build an AI app...” to access the power of Claude API.": "创建在 Artifacts 中使用 Claude 的应用、原型和交互式文档。只需说“让我们构建一个 AI 应用……”，即可使用 Claude API 的能力。",
            "Code execution and file creation": "代码执行与文件创建",
            "Claude can execute code and create and edit docs, spreadsheets, presentations, PDFs, and data reports.": "Claude 可以执行代码，并创建和编辑文档、电子表格、演示文稿、PDF 以及数据报告。",
            "Allow network egress": "允许网络访问",
            "Allow Claude to access common package managers to install packages and libraries for data analysis, visualizations, and file processing.": "允许 Claude 访问常见的软件包管理器，用于安装数据分析、可视化和文件处理所需的包和库。",
            "Skills have moved to Customize. Head to the new Customize page to manage your skills and connectors.": "Skills 已移至“自定义”。请前往新的“自定义”页面来管理你的 Skills 和 Connectors。",
            "Go to Customize": "前往自定义"
        },
        "regexp": [],
        "selector": [
            [
                "a[aria-label='New chat'] span",
                "新建对话"
            ],
            [
                "a[aria-label='Search'] span",
                "搜索"
            ],
            [
                "a[aria-label='Customize'] span",
                "自定义"
            ],
            [
                "a[aria-label='Chats'] span",
                "对话"
            ],
            [
                "a[aria-label='Projects'] span",
                "项目"
            ],
            [
                "a[aria-label='Code'] span",
                "代码"
            ],
            [
                "[aria-label='Starred'] span, [aria-label='Starred']",
                "已星标"
            ],
            [
                "[aria-label='Recents'] span, [aria-label='Recents']",
                "最近对话"
            ],
            [
                "button[aria-label*='Hide'] span, button[title*='Hide'] span",
                "隐藏"
            ]
        ]
    },
    "chat": {
        "static": {},
        "regexp": [],
        "selector": []
    },
    "settings": {
        "static": {},
        "regexp": [],
        "selector": []
    },
    "login": {
        "static": {},
        "regexp": [],
        "selector": []
    }
};

    /**************************************************************************
     * 不翻译的区域（聊天内容容器）
     * 填入 CSS 选择器，命中的元素及其子节点会被完全跳过
     **************************************************************************/
    const IGNORE_SELECTOR_LIST = [
        'div[contenteditable="true"]',
        'textarea',
        'input:not([type="button"]):not([type="submit"]):not([type="reset"])',
        '[data-testid="message-content"]',
        'main [data-testid*="message"]',
        'main [class*="message"]',
        '[data-message-author-role="assistant"]',
        '[data-message-author-role="user"]',
        'main .prose',
        'main [class*="prose"]',
    ];
    const IGNORE_SELECTORS = IGNORE_SELECTOR_LIST.join(', ');

    /**************************************************************************
     * 页面类型检测
     **************************************************************************/
    function detectPageType() {
        const path = window.location.pathname;
        if (path === '/new' || path.startsWith('/chat')) return 'chat';
        if (path.startsWith('/settings')) return 'settings';
        if (path.startsWith('/login') || path.startsWith('/register')) return 'login';
        return null;
    }

    /**************************************************************************
     * 构建当前页面的合并词库
     **************************************************************************/
    function buildPageDict(pageType) {
        const pub = I18N.public;
        const page = (pageType && I18N[pageType]) ? I18N[pageType] : {};
        return {
            pageType,
            staticDict: { ...pub.static, ...(page.static || {}) },
            regexpRules: [...(page.regexp || []), ...pub.regexp],
            selectors: [...(pub.selector || []), ...(page.selector || [])],
        };
    }

    let pageDict = buildPageDict(detectPageType());

    function clearLookupCache() {
        lookupCache.clear();
    }

    function debugLog(...args) {
        if (!DEBUG) return;
        console.log('[claude-translator]', ...args);
    }

    function isInIgnoredArea(node) {
        if (!IGNORE_SELECTORS || !node) return false;
        const base = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (!base) return false;
        return Boolean(base.matches?.(IGNORE_SELECTORS) || base.closest?.(IGNORE_SELECTORS));
    }

    function scheduleSelectorTranslation() {
        if (selectorTaskScheduled) return;
        selectorTaskScheduled = true;
        requestAnimationFrame(() => {
            selectorTaskScheduled = false;
            transBySelector();
        });
    }

    function translateDynamicText(cleaned) {
        if (!cleaned) return false;
        if (!/(chats?\s+with\s+Claude|Last\s+message|\bago\b|上次对话是)/i.test(cleaned)) return false;

        let result = cleaned;
        for (const [pattern, replacement] of DYNAMIC_TEXT_RULES) {
            result = result.replace(pattern, replacement);
        }

        return result !== cleaned ? result : false;
    }

    /**************************************************************************
     * 翻译核心
     **************************************************************************/

    /**
     * 查词库，返回译文或 false
     * 已是中文时跳过，避免重复替换触发无限循环
     */
    function lookupText(text) {
        if (!text || text.length > MAX_TEXT_LENGTH) return false;
        if (/^[\s\d]*$/.test(text)) return false; // 纯空白/数字
        if (/^[\u4e00-\u9fa5\s\d.,!?，。！？]+$/.test(text)) return false; // 已是中文
        if (!/[a-zA-Z]/.test(text)) return false; // 不含英文

        const cleaned = text.trim().replace(/\s+/g, ' ');
        if (!cleaned) return false;

        const cacheKey = `${pageDict.pageType || 'public'}|${FeatureSet.enable_RegExp ? 1 : 0}|${cleaned}`;
        if (lookupCache.has(cacheKey)) return lookupCache.get(cacheKey);

        let result = false;

        const dynamicHit = translateDynamicText(cleaned);
        if (dynamicHit) result = dynamicHit;

        // 1. 静态词库：精确匹配
        const hit = !result ? pageDict.staticDict[cleaned] : false;
        if (typeof hit === 'string') {
            result = hit;
        }

        // 2. 正则词库
        if (!result && FeatureSet.enable_RegExp) {
            for (const [pattern, replacement] of pageDict.regexpRules) {
                const translated = cleaned.replace(pattern, replacement);
                if (translated !== cleaned) {
                    result = translated;
                    break;
                }
            }
        }

        if (lookupCache.size >= LOOKUP_CACHE_LIMIT) clearLookupCache();
        lookupCache.set(cacheKey, result);
        return result;
    }

    /**
     * 翻译文本节点
     * 直接修改 node.data（底层文本），而非 textContent
     * 这样可被 characterData 类型的 MutationObserver 捕获，
     * 也不会触发父元素的 childList 突变，避免无限循环
     */
    function transTextNode(node) {
        if (node.nodeType !== Node.TEXT_NODE) return;
        if (node._translating) return; // 跳过自己触发的变化

        if (isInIgnoredArea(node)) return;

        const translated = lookupText(node.data);
        if (translated && translated !== node.data) {
            node._translating = true;
            const trimmed = node.data.trim();
            node.data = trimmed ? node.data.replace(trimmed, translated) : translated;
            node._translating = false;
        }
    }

    /**
     * 翻译元素属性（placeholder、aria-label、title 等）
     */
    function transAttr(el, attr) {
        if (!el) return;
        if (isInIgnoredArea(el)) return;
        const val = el.getAttribute?.(attr) ?? el[attr];
        if (!val) return;
        const translated = lookupText(val);
        if (translated && translated !== val) {
            if (typeof el[attr] === 'string') {
                el[attr] = translated;
            }
            if (el.hasAttribute?.(attr) || attr.includes('-')) {
                el.setAttribute(attr, translated);
            }
        }
    }

    /**
     * 按 CSS 选择器翻译（用于 sidebar 等文本被频繁重绘的场景）
     */
    function transBySelector() {
        for (const [selector, text] of (pageDict.selectors || [])) {
            let nodes;
            try {
                nodes = document.querySelectorAll(selector);
            } catch (err) {
                continue;
            }
            for (const node of nodes) {
                if (node && node.textContent !== text) node.textContent = text;
            }
        }
    }

    function transInlineSentence(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
        const raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!raw || !INLINE_SENTENCE_TRIGGER.test(raw)) return;

        const link = el.querySelector('a');
        if (!link) return;

        const linkText = (link.textContent || '').trim();
        if (!INLINE_SENTENCE_LINK_TEXT.test(linkText) && linkText !== '个人偏好') return;

        link.textContent = '个人偏好';

        const children = Array.from(el.childNodes);
        const linkIndex = children.indexOf(link);
        if (linkIndex === -1) return;

        let prevText = null;
        for (let i = linkIndex - 1; i >= 0; i--) {
            if (children[i].nodeType === Node.TEXT_NODE) {
                prevText = children[i];
                break;
            }
        }

        let nextText = null;
        for (let i = linkIndex + 1; i < children.length; i++) {
            if (children[i].nodeType === Node.TEXT_NODE) {
                nextText = children[i];
                break;
            }
        }

        if (prevText) prevText.data = 'Claude 在回复中应如何考虑 ';
        if (nextText) nextText.data = '？';
    }

    /**
     * 遍历节点树，翻译所有文本节点和元素属性
     */
    function traverseNode(root) {
        if (!root) return;

        // 文本节点直接处理
        if (root.nodeType === Node.TEXT_NODE) {
            transTextNode(root);
            return;
        }

        if (root.nodeType !== Node.ELEMENT_NODE) return;

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (node.nodeType === Node.ELEMENT_NODE && isInIgnoredArea(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                transTextNode(node);
                continue;
            }

            // 翻译元素属性
            switch (node.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                    transAttr(node, 'placeholder');
                    break;
                case 'BUTTON':
                case 'A':
                case 'SPAN':
                case 'DIV':
                case 'LABEL':
                case 'P':
                    transAttr(node, 'title');
                    transAttr(node, 'aria-label');
                    break;
            }

            transInlineSentence(node);
        }
    }

    /**************************************************************************
     * MutationObserver：持续拦截 React 渲染
     *
     * React 每次重新渲染都会更新真实 DOM，策略：
     *   childList      → 新节点插入时立即遍历翻译
     *   characterData  → 文本节点内容被改变时立即重新翻译（核心）
     *   attributes     → 属性变化时重新翻译该属性
     **************************************************************************/
    function watchUpdate() {
        let lastURL = location.href;

        new MutationObserver((mutations) => {

            // SPA 路由变化检测
            if (location.href !== lastURL) {
                lastURL = location.href;
                pageDict = buildPageDict(detectPageType());
                clearLookupCache();
                debugLog('Route changed:', lastURL, 'pageType=', pageDict.pageType);
                traverseNode(document.body);
                scheduleSelectorTranslation();
            }

            let hasChildListMutation = false;
            for (const { type, target, addedNodes, attributeName } of mutations) {

                if (type === 'childList') {
                    hasChildListMutation = true;
                    // React 渲染了新组件，遍历翻译新增节点
                    for (const node of addedNodes) {
                        traverseNode(node);
                    }

                } else if (type === 'characterData') {
                    // React 改写了文本节点内容 → 立即重新翻译
                    // _translating 标志防止我们自己的修改触发无限循环
                    if (!target._translating) {
                        transTextNode(target);
                    }

                } else if (type === 'attributes') {
                    // 属性被 React 更新（如 placeholder）
                    if (attributeName) transAttr(target, attributeName);
                }
            }

            if (hasChildListMutation) scheduleSelectorTranslation();

        }).observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,   // 关键：监听文本节点内容变化
            attributeFilter: OBSERVED_ATTRIBUTES,
        });
    }

    /**************************************************************************
     * 油猴菜单
     **************************************************************************/
    function registerMenuCommand() {
        let menuId;
        const register = () => {
            const enabled = FeatureSet.enable_RegExp;
            menuId = GM_registerMenuCommand(
                `${enabled ? '✅' : '❌'} 正则翻译`,
                () => {
                    const next = !FeatureSet.enable_RegExp;
                    FeatureSet.enable_RegExp = next;
                    clearLookupCache();
                    GM_setValue('enable_regexp', next);
                    GM_notification(`正则翻译已${next ? '启用' : '禁用'}`);
                    if (next) traverseNode(document.body);
                    GM_unregisterMenuCommand(menuId);
                    register();
                }
            );
        };
        register();
    }

    /**************************************************************************
     * 初始化
     **************************************************************************/
    function init() {
        const onReady = () => {
            traverseNode(document.body); // 首次全量翻译
            transBySelector();           // 首次选择器翻译
            watchUpdate();               // 启动持续监听
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }

        registerMenuCommand();
    }

    init();

})(window, document);
