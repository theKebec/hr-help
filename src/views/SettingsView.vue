<template>
  <div class="page scroll-area">
    <header class="page-header">
      <h1 class="page-title">设置</h1>
      <p class="page-subtitle">配置 DeepSeek API，数字员工将通过它为你工作</p>
    </header>

    <div class="settings-card">
      <div class="field">
        <label>
          DeepSeek API Key
          <span class="required">*</span>
        </label>
        <div class="input-wrap">
          <AppIcon name="key" :size="16" class="input-icon" />
          <input
            v-model="form.apiKey"
            :type="showKey ? 'text' : 'password'"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="toggle-btn" @click="showKey = !showKey">{{ showKey ? '隐藏' : '显示' }}</button>
        </div>
        <p class="field-hint">
          Key 仅保存在本浏览器 localStorage 中，请求经服务端代理转发到 DeepSeek。
          可在
          <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener">DeepSeek 开放平台</a>
          创建。
        </p>
      </div>

      <div class="field">
        <label>API Base URL</label>
        <input v-model="form.baseUrl" placeholder="https://api.deepseek.com" spellcheck="false" />
      </div>

      <div class="field">
        <label>模型</label>
        <select v-model="form.model">
          <option value="deepseek-v4-flash">deepseek-v4-flash（V4 Flash，快速通用，推荐）</option>
          <option value="deepseek-chat">deepseek-chat（通用对话）</option>
          <option value="deepseek-reasoner">deepseek-reasoner（深度推理）</option>
        </select>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="save">
          <AppIcon name="check" :size="16" />
          保存配置
        </button>
        <button class="btn-ghost" @click="test" :disabled="!form.apiKey.trim() || testing">
          <AppIcon name="message" :size="15" />
          {{ testing ? '测试中…' : '发送测试消息' }}
        </button>
      </div>

      <transition name="fade">
        <div v-if="testResult" class="test-result" :class="testResult.ok ? 'ok' : 'fail'">
          <AppIcon :name="testResult.ok ? 'check' : 'help'" :size="16" />
          <span>{{ testResult.text }}</span>
        </div>
      </transition>
    </div>

    <div class="settings-card subtle">
      <h3>数据说明</h3>
      <ul>
        <li>对话记录保存在本浏览器 localStorage，清空浏览器数据会同时删除对话。</li>
        <li>API Key 不会随对话记录上传到任何第三方，仅用于代理转发至 DeepSeek 官方接口。</li>
        <li>每位数字员工都有独立的系统提示词，模拟对应 HR 岗位的专业角色。</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const showKey = ref(false)
const testing = ref(false)
const testResult = ref(null)

const form = reactive({
  apiKey: settingsStore.apiKey,
  baseUrl: settingsStore.baseUrl,
  model: settingsStore.model
})

const save = () => {
  settingsStore.update({
    apiKey: form.apiKey.trim(),
    baseUrl: form.baseUrl.trim() || 'https://api.deepseek.com',
    model: form.model
  })
  testResult.value = { ok: true, text: '配置已保存。' }
}

const test = async () => {
  save()
  testing.value = true
  testResult.value = null
  try {
    const resp = await fetch('/api/deepseek/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${form.apiKey.trim()}`
      },
      body: JSON.stringify({
        model: form.model,
        stream: true,
        messages: [
          { role: 'system', content: '你是一个测试助手。' },
          { role: 'user', content: '回复"连接成功"四个字即可。' }
        ]
      })
    })
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error(err?.error?.message || `HTTP ${resp.status}`)
    }
    const reader = resp.body.getReader()
    const decoder = new TextDecoder()
    let text = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      if (text.length > 200) break
    }
    testResult.value = { ok: true, text: '连接成功，DeepSeek API 工作正常。' }
  } catch (e) {
    testResult.value = { ok: false, text: `连接失败：${e.message}` }
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.page {
  height: 100vh;
  padding: 32px 40px 48px;
  max-width: 760px;
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

.settings-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 26px 28px;
  margin-top: 22px;
  box-shadow: var(--shadow-card);
}
.settings-card.subtle {
  background: #f8f9fb;
}
.settings-card h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}
.settings-card ul {
  padding-left: 18px;
  color: var(--text-sub);
  font-size: 13px;
  line-height: 2;
}

.field {
  margin-bottom: 20px;
}
.field label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  margin-bottom: 8px;
}
.required {
  color: var(--danger);
}
.field input,
.field select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  color: var(--text);
  transition: border-color 0.15s var(--ease);
}
.field input:focus,
.field select:focus {
  border-color: #9ca3af;
}
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-wrap input {
  padding-left: 40px;
  padding-right: 64px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13.5px;
}
.input-icon {
  position: absolute;
  left: 13px;
  color: var(--text-weak);
}
.toggle-btn {
  position: absolute;
  right: 10px;
  font-size: 12.5px;
  color: var(--text-sub);
  padding: 4px 8px;
  border-radius: 6px;
}
.toggle-btn:hover {
  background: #f1f3f6;
}
.field-hint {
  margin-top: 8px;
  font-size: 12.5px;
  color: var(--text-weak);
  line-height: 1.7;
}
.field-hint a {
  color: #2563eb;
  text-decoration: underline;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
}

.test-result {
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.test-result.ok {
  background: #ecfdf5;
  color: #047857;
}
.test-result.fail {
  background: #fef2f2;
  color: #b91c1c;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
