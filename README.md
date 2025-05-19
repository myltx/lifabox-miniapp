<!-- 📌 中文版仓库描述： -->

<!-- 🎯 LifaBox 是一款基于 UniBest 开发的微信小程序，集打卡记录、物品提醒、生活习惯管理于一体，帮你更高效地管理日常生活。
🚀 技术栈：Vue 3 + UnoCSS + TypeScript + Wot-UI + UniApp
🧰 功能包括：打卡、物品分类与记录、到期订阅提醒等。 -->

<!-- 📌 英文版仓库描述：

🎯 LifaBox is a WeChat Mini Program built with UniBest, designed as your intelligent daily assistant.
It helps you track habits, manage items, and receive expiration reminders — all in one place.
🚀 Tech Stack: Vue 3, TypeScript, UnoCSS, Wot-UI, and UniApp. -->

# 📦 LifaBox - 生活学习助手微信小程序

**LifaBox** 是一款基于 UniBest + UniApp + Vue3 开发的微信小程序，集「学习管理」「打卡记录」「物品管理」「到期提醒」等功能于一体，适合个人或情侣/好友共同使用，提升学习效率与生活管理质量。

---

## 🌟 核心功能

### 📖 学习模块

- **课程管理**

  - 支持课程创建与周期设置（如 10、15、30 天）
  - 填写课程描述（如授课人、课程名称、简介等）
  - 设置课程开始时间，计算学习周期

- **学习进度与打卡**

  - 每日学习打卡记录，累计打卡天数统计
  - 打卡成功自动播放烟花/气球等庆祝动画
  - 查看课程当前进度与历史记录

- **学习奖励系统**

  - 根据课程周期自动生成奖励规则
  - 如完成 10 天/15 天/30 天等阶段学习，即可解锁奖励
  - 奖励可设置金额或其他激励方式，记录发放情况

- **好友关联与互看**
  - 绑定另一位用户（如情侣/好友）
  - 可相互查看学习进度、打卡状态，促进共同成长

---

### 📦 物品管理模块

- **物品管理**

  - 添加、编辑、删除物品记录
  - 设置分类、到期时间、提醒设置等
  - 支持图片上传（TODO）

- **分类管理**

  - 支持默认与自定义物品分类
  - 方便按类型管理生活物品、订阅服务等

- **智能提醒**
  - 即将到期的物品高亮提示
  - 可结合订阅消息机制发送提醒（TODO）

---

### ✅ 打卡模块（通用）

- 每日打卡记录与反馈
- 打卡成功动画增强使用体验
- 打卡记录统计、历史查看

---

## 🚀 技术栈

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [UnoCSS](https://unocss.dev/)
- [Wot-UI](https://wot-design-uni.jd.com/)
- [UniApp](https://uniapp.dcloud.io/)
- [UniBest](https://github.com/uni-helper/unibest)（项目脚手架）

---

## 🗂️ 项目结构

```bash
lifabox/
├── pages/             # 页面目录（首页、学习、打卡、物品等）
├── components/        # 公共组件（如庆祝动画等）
├── stores/            # 状态管理（Pinia）
├── utils/             # 工具函数
├── composables/       # 组合式 API 封装
├── constants/         # 枚举/常量定义
├── uni_modules/       # 第三方 uni 模块
├── public/            # 静态资源
├── unocss.config.ts   # UnoCSS 配置
└── vite.config.ts     # Vite 配置
```

---

📦 数据表说明

| 文件名                             | 表名                 | 用途                                 |
| ---------------------------------- | -------------------- | ------------------------------------ |
| `user_profile.schema.json`         | user_profile         | 用户资料扩展                         |
| `clock_records.schema.json`        | clock_records        | 用户打卡记录                         |
| `item_categories.schema.json`      | item_categories      | 物品分类                             |
| `items.schema.json`                | items                | 物品记录                             |
| `notifications.schema.json`        | notifications        | 到期提醒通知记录                     |
| `feedbacks.schema.json`            | feedbacks            | 用户反馈                             |
| `course.schema.json`               | course               | 学习课程信息（含描述/开始时间/周期） |
| `user_course_progress.schema.json` | user_course_progress | 用户课程进度（是否学习、完成时间）   |
| `learning_records.schema.json`     | learning_records     | 学习记录（打卡、进度、奖励等）       |
| `learning_rewards.schema.json`     | learning_rewards     | 学习奖励配置（周期/奖励金额）        |
| `user_relations.schema.json`       | user_relations       | 用户之间的关联（配对/好友）          |

## 🚦 快速开始

```bash
# 安装依赖
pnpm install

# 启动微信小程序开发环境
pnpm dev:mp-weixin

# 构建小程序
pnpm build:mp-weixin
```

> ⚠️ 请确保你已安装 pnpm 和 HBuilderX 或 微信开发者工具 用于调试和预览。

---

📱 页面亮点

- 首页：课程学习总览、学习奖励进度、打卡入口、物品提醒入口
- 学习页：课程详情、打卡进度、奖励信息、好友学习情况
- 物品页：物品分类、列表、过期提醒、添加编辑功能
- 动画组件：庆祝动效，如烟花/气球，提升交互体验

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

MIT License © 2025-present [myltx](https://github.com/myltx)
