<template>
  <div class="page scroll-area">
    <header class="page-header">
      <h1 class="page-title">帮助</h1>
      <p class="page-subtitle">了解 HR Helper 的使用方式与常见问题</p>
    </header>

    <div class="help-grid">
      <section class="help-card" v-for="(item, i) in guides" :key="i">
        <div class="help-num">{{ String(i + 1).padStart(2, "0") }}</div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </section>
    </div>

    <section class="faq">
      <h2>常见问题</h2>
      <details v-for="(faq, i) in faqs" :key="i" class="faq-item">
        <summary>
          <span>{{ faq.q }}</span>
          <AppIcon name="chevronDown" :size="16" class="faq-icon" />
        </summary>
        <p v-html="faq.a"></p>
      </details>
    </section>
  </div>
</template>

<script setup>
import AppIcon from "@/components/AppIcon.vue";

const guides = [
  {
    title: "配置 API Key",
    desc: "点击左下角用户区进入「设置」，填入 DeepSeek API Key（sk- 开头）并保存，可一键测试连通性。",
  },
  {
    title: "与数字员工对话",
    desc: "在「我的员工」中点击任意卡片进入对话，每位员工都有专属岗位角色与系统提示词，回答更贴合业务。",
  },
  {
    title: "使用技能模板",
    desc: "「我的技能」内置 JD 生成、面试题、九宫格盘点等 10 个高频场景，点击即带预设指令打开对应员工。",
  },
  {
    title: "流式输出与停止",
    desc: "回复采用打字机式流式输出；生成过程中可点击红色停止按钮中断，已生成的内容会保留。",
  },
];

const faqs = [
  {
    q: "API Key 会被上传到哪里？",
    a: "Key 仅保存在你浏览器的 localStorage 中；发消息时经本项目的服务端代理转发到 DeepSeek 官方接口（api.deepseek.com），代理不做任何持久化。",
  },
  {
    q: "对话记录存在哪里？",
    a: "所有对话记录保存在浏览器本地 localStorage，按员工分别存储。清除浏览器站点数据会同时清空记录，也可以在对话页右上角手动清空。",
  },
  {
    q: "deepseek-chat 和 deepseek-reasoner 怎么选？",
    a: "日常 HR 问答、文案生成用 deepseek-chat 更快；需要复杂推演（如薪酬测算、制度逻辑分析）可切换 deepseek-reasoner，但响应更慢。",
  },
  {
    q: "回复失败怎么办？",
    a: "请检查：1) Key 是否正确、余额是否充足；2) 网络是否可访问 api.deepseek.com；3) 在设置页点击「发送测试消息」定位问题。错误信息会直接显示在对话气泡中。",
  },
];
</script>

<style scoped>
.page {
  height: 100vh;
  padding: 32px 40px 48px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
}
.page-subtitle {
  font-size: 13.5px;
  color: var(--text-sub);
  margin-top: 6px;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}
.help-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: var(--shadow-card);
}
.help-num {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-weak);
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}
.help-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}
.help-card p {
  font-size: 13.5px;
  color: var(--text-sub);
  line-height: 1.7;
}

.faq {
  margin-top: 34px;
}
.faq h2 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
}
.faq-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.faq-item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 18px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
.faq-item summary::-webkit-details-marker {
  display: none;
}
.faq-icon {
  color: var(--text-weak);
  transition: transform 0.2s var(--ease);
}
.faq-item[open] .faq-icon {
  transform: rotate(180deg);
}
.faq-item p {
  padding: 0 18px 16px;
  font-size: 13.5px;
  color: var(--text-sub);
  line-height: 1.8;
}

@media (max-width: 760px) {
  .help-grid {
    grid-template-columns: 1fr;
  }
  .page {
    padding: 24px;
  }
}
</style>
