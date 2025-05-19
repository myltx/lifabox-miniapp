<!-- 📌 中文版仓库描述： -->

<!-- 🎯 LifaBox 是一款基于 UniBest 开发的微信小程序，集打卡记录、物品提醒、生活习惯管理于一体，帮你更高效地管理日常生活。
🚀 技术栈：Vue 3 + UnoCSS + TypeScript + Wot-UI + UniApp
🧰 功能包括：打卡、物品分类与记录、到期订阅提醒等。 -->

<!-- 📌 英文版仓库描述：

🎯 LifaBox is a WeChat Mini Program built with UniBest, designed as your intelligent daily assistant.
It helps you track habits, manage items, and receive expiration reminders — all in one place.
🚀 Tech Stack: Vue 3, TypeScript, UnoCSS, Wot-UI, and UniApp. -->

# 📦 LifaBox - 生活小助手微信小程序

LifaBox 是一款基于 UniBest + UniApp + Vue3 开发的微信小程序，集**打卡记录、物品管理、到期提醒**等功能于一体，帮你高效管理日常生活。

---

## 🌟 主要功能

- **首页总览**

  - 顶部 Banner 显示今日日期和品牌标识
  - 学习打卡次数统计与打卡入口
  - 物品总数统计与物品列表入口
  - 即将过期物品智能提醒
  - 打卡成功后自动播放庆祝动画（如烟花/庆祝特效）

- **打卡模块**

  - 支持每日学习打卡，统计打卡次数
  - 打卡后有动效反馈，提升用户体验

- **物品管理**

  - 物品分类、添加、编辑、删除
  - 物品总数统计
  - 物品到期时间自动计算
  - 即将过期物品高亮提醒

- **视觉体验**
  - 现代化渐变 Banner
  - 卡片式信息区块，主色突出
  - 动画庆祝组件，增强交互趣味性

---

## 🚀 技术栈

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [UnoCSS](https://unocss.dev/)
- [Wot-UI](https://wot-design-uni.jd.com/)
- [UniApp](https://uniapp.dcloud.io/)
- [UniBest](https://github.com/uni-helper/unibest)（项目脚手架）

---

## 🗂️ 目录结构

```shell
lifabox/
├── pages/             # 页面目录（首页、打卡、物品等）
├── components/        # 公共组件（如烟花/庆祝动画等）
├── stores/            # 状态管理（Pinia）
├── utils/             # 工具函数
├── composables/       # 组合式 API 封装
├── constants/         # 枚举/常量
├── uni_modules/       # 第三方 uni 模块
├── public/            # 静态资源
├── unocss.config.ts   # UnoCSS 配置
└── vite.config.ts     # Vite 配置
```

---

## 🚦 快速开始

```shell
# 安装依赖
pnpm install

# 启动微信小程序开发环境
pnpm dev:mp-weixin

# 构建小程序
pnpm build:mp-weixin
```

> ⚠️ 请确保你已安装 pnpm 和 HBuilderX 或 微信开发者工具 用于调试和预览。

---

## 📱 页面亮点

- **首页**：信息总览、打卡、物品统计、即将过期提醒、庆祝动画
- **打卡页**：每日打卡、打卡历史
- **物品页**：物品列表、分类、添加/编辑/删除、到期提醒
- **动画组件**：如烟花、庆祝动效，提升用户体验

---

## 📌 TODO

- [ ] 订阅消息推送接入
- [ ] 云函数/后端对接
- [ ] 黑暗模式适配
- [ ] 多端适配（如 H5）
- [ ] 物品图片上传
- [ ] 更丰富的打卡/物品统计图表

---

## 📄 License

MIT License © 2025-present [your-name]

| 文件名                        | 表名            | 用途             |
| ----------------------------- | --------------- | ---------------- |
| `user_profile.schema.json`    | user_profile    | 用户资料扩展     |
| `clock_records.schema.json`   | clock_records   | 用户打卡记录     |
| `item_categories.schema.json` | item_categories | 物品分类         |
| `items.schema.json`           | items           | 物品记录         |
| `notifications.schema.json`   | notifications   | 到期提醒通知记录 |
| `feedbacks.schema.json`       | feedbacks       | 用户反馈         |
