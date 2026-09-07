# AGENTS.md

## 项目概览

**HR Helper** —— HR 数字员工工作台（Vue 3 SPA）。左侧导航，右侧主区；点击「数字员工」卡片进入与该岗位 AI 的对话窗口，对话通过服务端代理调用 DeepSeek Chat API（SSE 流式）。

- **Framework**：Vue 3（Composition API，`<script setup>`，纯 JavaScript）
- **Build**：Vite
- **State**：Pinia（`settings`、`chat` 两个 store）
- **Routing**：Vue Router（history 模式）
- **样式**：全局 CSS 变量 + 组件 scoped CSS（无 Tailwind / UI 库），设计规范见 `DESIGN.md`

## 构建与运行

- 包管理器：**仅 pnpm**
- 开发：`pnpm run dev`（Vite，端口取 `DEPLOY_RUN_PORT`，HMR 路径 `/hot/vite-hmr`）
- 构建：`pnpm run build`（产物在 `dist/`）
- 生产：`node server.js`（零依赖 Node HTTP 服务：静态托管 `dist/` + SPA 回退 + `/api/deepseek` 代理透传 SSE）
- DeepSeek 代理：
  - 开发：Vite `server.proxy` 把 `/api/deepseek/*` 转发到 `https://api.deepseek.com/*`
  - 生产：`server.js` 中用 `https.request` 透传请求体与 `Authorization` 头、流式 pipe 响应
  - 前端请求 `POST /api/deepseek/chat/completions`，`Authorization: Bearer <key>` 由代理转发到官方

## 目录结构

```
├── public/avatars/          # 10 位数字员工头像（本地静态文件）
├── src/
│   ├── components/
│   │   ├── AppIcon.vue      # 统一 SVG 图标库（按 name 取路径）
│   │   ├── Sidebar.vue      # 左侧导航 + 历史记录抽屉 + API 状态
│   │   └── EmployeeCard.vue # 数字员工卡片
│   ├── views/
│   │   ├── HomeView.vue      # 首页（快捷入口/最近对话/推荐员工）
│   │   ├── EmployeesView.vue # 员工办公室（10 人网格）
│   │   ├── ChatView.vue      # AI 对话页（SSE 流式渲染）
│   │   ├── SkillsView.vue    # 我的技能（场景模板）
│   │   ├── HelpView.vue      # 帮助 / FAQ
│   │   ├── HistoryView.vue   # 历史记录
│   │   └── SettingsView.vue  # DeepSeek API Key 配置
│   ├── stores/
│   │   ├── settings.js       # apiKey/baseUrl/model，localStorage 持久化
│   │   └── chat.js           # 按 employeeId 分会话，localStorage 持久化
│   ├── services/deepseek.js  # SSE 流式调用（fetch reader 解析 data: 行）
│   ├── data/
│   │   ├── employees.js      # 10 位员工定义（含 systemPrompt/greetings）
│   │   └── skills.js         # 10 个技能模板（关联员工 + 预设指令）
│   ├── utils/markdown.js     # 轻量 Markdown -> HTML（对话渲染）
│   ├── router/index.js
│   ├── styles/main.css       # Design Tokens / 全局样式
│   └── main.js
└── vite.config.js
```

## 关键约定

1. **API Key 流向**：用户在设置页填写 → localStorage 保存 → 每次对话随请求体发给同源 `/api/deepseek/chat` → Vite 代理转发时透传 `Authorization` 头（代理自动携带）。前端绝不硬编码 Key。
2. **流式协议**：前端请求 `POST /api/deepseek/chat/completions`，header 带 `Authorization: Bearer <key>`，body 为 `{ model, messages, stream: true, temperature }`。代理（Vite proxy / server.js）透传至 `https://api.deepseek.com/chat/completions`。响应为标准 OpenAI SSE（`data: {...}` / `data: [DONE]`），前端逐块解析 `choices[0].delta.content` 追加渲染。
3. **对话存储**：按员工 id 分键存 localStorage（`hr-helper-conversations`）；「已完成 N 任务」= 用户消息轮次。
4. **技能模板**：`SkillsView` 点击后把预设 prompt 写入 `sessionStorage`（`hr-helper-skill-prompt:<employeeId>`），跳转对话页后自动填入输入框。
5. **新增员工**：在 `src/data/employees.js` 增加对象（id/name/type/avatar/desc/greetings/systemPrompt），头像放 `public/avatars/`。
6. **图标**：统一用 `<AppIcon name="..." />`，新增图标在 `AppIcon.vue` 的 `ICONS` 中加 path。
7. 代码标点全部半角；中文仅用于文案。

## 常见问题定位

- 对话报错：先看页面气泡内错误信息；未配置 Key 时输入区有提示条，去 `/settings`。
- 生产环境 404：确认走的是 `vite preview`（带代理），不要用裸静态服务器（会丢失 `/api` 代理）。
