<!-- 📌 中文版仓库描述： -->

<!-- 🎯 LifaBox 是一款基于 UniBest 开发的微信小程序，集打卡记录、物品提醒、生活习惯管理于一体，帮你更高效地管理日常生活。
🚀 技术栈：Vue 3 + UnoCSS + TypeScript + Wot-UI + UniApp
🧰 功能包括：打卡、物品分类与记录、到期订阅提醒等。 -->

<!-- 📌 英文版仓库描述：

🎯 LifaBox is a WeChat Mini Program built with UniBest, designed as your intelligent daily assistant.
It helps you track habits, manage items, and receive expiration reminders — all in one place.
🚀 Tech Stack: Vue 3, TypeScript, UnoCSS, Wot-UI, and UniApp. -->

📦 LifaBox - 生活小助手微信小程序

基于 UniBest 开发的一款生活效率类微信小程序，支持打卡记录、物品管理、到期提醒等功能，帮你高效管理每日生活。

🌟 项目功能

<!-- ✅ -->

- 微信一键登录
- 首页概览
- 今日打卡情况
- 物品即将到期提醒
- 物品数量统计
- 打卡记录模块
- 每日学习/习惯打卡
- 历史记录查询
- 物品记录模块
- 物品分类管理
- 添加、编辑、删除物品
- 设置物品到期时间，自动提醒
- 订阅提醒功能
- 到期前微信消息提醒（待接入订阅消息）

⚙️ 技术栈

- Vue 3
- TypeScript
- UnoCSS
- Wot-UI
- UniApp

🗂️ 项目结构（推荐）

```shell
lifabox/
├── pages/             # 页面目录
├── components/        # 公共组件
├── stores/            # 状态管理（Pinia）
├── utils/             # 工具函数
├── composables/       # 组合式 API 封装
├── constants/         # 枚举/常量
├── uni_modules/       # 第三方 uni 模块
├── public/            # 静态资源
├── unocss.config.ts   # UnoCSS 配置
└── vite.config.ts     # Vite 配置
```

🚀 快速启动

```shell
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev:mp-weixin

# 构建小程序
pnpm build:mp-weixin
```

⚠️ 请确保你已安装 pnpm 和 HBuilderX 或 微信开发者工具 用于调试和预览。

📌 TODO

- 订阅消息推送接入
- 云函数处理（如有后台）
<!-- - 数据存储：可接 Supabase 或本地存储 -->
- 黑暗模式适配
- 多端适配（如 H5）

📄 License

MIT License © 2025-present [your-name]
