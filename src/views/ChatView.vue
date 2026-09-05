<template>
  <div class="chat-page">
    <!-- 顶部员工信息条 -->
    <header class="chat-header">
      <button class="back-btn" @click="router.push('/employees')" aria-label="返回">
        <AppIcon name="chevronLeft" :size="20" />
      </button>
      <img :src="employee?.avatar" :alt="employee?.name" class="header-avatar" />
      <div class="header-info">
        <h2>
          {{ employee?.name }}
          <span class="badge" :class="employee?.type === 'BOSS' ? 'boss' : 'work'">{{ employee?.type }}</span>
        </h2>
        <p class="header-desc">{{ employee?.desc }}</p>
      </div>
      <div class="header-actions">
        <button class="btn-ghost" @click="confirmClear">
          <AppIcon name="trash" :size="15" />
          清空对话
        </button>
      </div>
    </header>

    <!-- 未配置 Key 提示 -->
    <div v-if="!settingsStore.configured" class="key-tip">
      <AppIcon name="key" :size="16" />
      <span>还未配置 DeepSeek API Key，对话功能暂不可用。</span>
      <RouterLink to="/settings" class="key-link">去配置 →</RouterLink>
    </div>

    <!-- 消息流 -->
    <div ref="messageArea" class="messages scroll-area">
      <div class="messages-inner">
        <div v-for="msg in messages" :key="msg.id" class="msg-row" :class="msg.role === 'user' ? 'is-user' : 'is-ai'">
          <img v-if="msg.role !== 'user'" :src="employee?.avatar" class="msg-avatar" alt="AI" />
          <div class="msg-bubble" :class="{ error: msg.error }">
            <div v-if="msg.role === 'user'" class="user-text">{{ msg.content }}</div>
            <div v-else class="md" v-html="rendered(msg)"></div>
            <span v-if="msg.streaming" class="typing-cursor">▍</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <footer class="composer">
      <div class="composer-box">
        <textarea
          ref="inputEl"
          v-model="input"
          class="composer-input"
          rows="1"
          :placeholder="placeholder"
          :disabled="streaming"
          @keydown="onKeydown"
          @input="autoResize"
        />
        <button v-if="!streaming" class="send-btn" :disabled="!canSend" @click="send">
          <AppIcon name="send" :size="18" />
        </button>
        <button v-else class="stop-btn" @click="stop">
          <AppIcon name="stop" :size="16" />
        </button>
      </div>
      <p class="composer-hint">Enter 发送 · Shift + Enter 换行 · 内容由 DeepSeek 生成</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { getEmployee } from '@/data/employees'
import { useChatStore } from '@/stores/chat'
import { useSettingsStore } from '@/stores/settings'
import { streamChat } from '@/services/deepseek'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  employeeId: { type: String, required: true }
})

const router = useRouter()
const chatStore = useChatStore()
const settingsStore = useSettingsStore()

const employee = computed(() => getEmployee(props.employeeId))
const messages = computed(() => chatStore.getMessages(props.employeeId))
const streaming = computed(() => chatStore.isStreaming(props.employeeId))

const input = ref('')
const messageArea = ref(null)
const inputEl = ref(null)
let abortController = null

const placeholder = computed(() =>
  settingsStore.configured ? `和${employee.value?.name ?? '数字员工'}说点什么…` : '请先在设置中配置 API Key…'
)
const canSend = computed(() => input.value.trim().length > 0 && settingsStore.configured)

const rendered = (msg) => renderMarkdown(msg.content || '')

const scrollToBottom = () => {
  nextTick(() => {
    const el = messageArea.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

const autoResize = () => {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

const onKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault()
    send()
  }
}

const send = async () => {
  const text = input.value.trim()
  if (!text || streaming.value || !settingsStore.configured) return
  input.value = ''
  await nextTick()
  autoResize()
  abortController = new AbortController()
  await streamChat({
    employeeId: props.employeeId,
    systemPrompt: employee.value.systemPrompt,
    history: messages.value,
    userInput: text,
    signal: abortController.signal
  })
  scrollToBottom()
}

const stop = () => {
  abortController?.abort()
}

const confirmClear = () => {
  if (streaming.value) return
  if (window.confirm('确定清空与该员工的全部对话记录吗？')) {
    chatStore.clearConversation(props.employeeId)
    chatStore.ensureConversation(props.employeeId, employee.value.greetings)
  }
}

watch(messages, scrollToBottom, { deep: true })
watch(
  () => props.employeeId,
  (id) => {
    const emp = getEmployee(id)
    chatStore.ensureConversation(id, emp?.greetings)
  }
)

onMounted(() => {
  chatStore.ensureConversation(props.employeeId, employee.value?.greetings)
  // 技能页携带的预设指令
  const preset = sessionStorage.getItem(`hr-helper-skill-prompt:${props.employeeId}`)
  if (preset) {
    sessionStorage.removeItem(`hr-helper-skill-prompt:${props.employeeId}`)
    input.value = preset
    nextTick(() => {
      autoResize()
      inputEl.value?.focus()
    })
  }
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 28px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: var(--text-sub);
  transition: background 0.15s var(--ease);
}
.back-btn:hover {
  background: #f1f3f6;
  color: var(--text);
}
.header-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.header-info {
  flex: 1;
  min-width: 0;
}
.header-info h2 {
  font-size: 16.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-info h2 .badge {
  font-size: 11px;
  padding: 2px 8px;
}
.header-desc {
  font-size: 12.5px;
  color: var(--text-sub);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.key-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 28px 0;
  padding: 10px 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  border-radius: 12px;
  font-size: 13px;
  flex-shrink: 0;
}
.key-link {
  margin-left: auto;
  font-weight: 600;
  color: #b45309;
}

.messages {
  flex: 1;
  padding: 28px 0 12px;
}
.messages-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.msg-row {
  display: flex;
  gap: 12px;
  animation: fadeUp 0.25s var(--ease);
}
.msg-row.is-user {
  flex-direction: row-reverse;
}
.msg-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-top: 2px;
}
.msg-bubble {
  max-width: 76%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14.5px;
  line-height: 1.75;
  word-break: break-word;
}
.is-ai .msg-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  border-top-left-radius: 4px;
  box-shadow: var(--shadow-card);
}
.is-user .msg-bubble {
  background: var(--dark);
  color: #fff;
  border-top-right-radius: 4px;
}
.msg-bubble.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: var(--danger);
}

.user-text {
  white-space: pre-wrap;
}

/* Markdown 样式 */
.md :deep(p) {
  margin: 0 0 8px;
}
.md :deep(p:last-child) {
  margin-bottom: 0;
}
.md :deep(ul),
.md :deep(ol) {
  margin: 6px 0 10px;
  padding-left: 22px;
}
.md :deep(li) {
  margin: 4px 0;
}
.md :deep(h1),
.md :deep(h2),
.md :deep(h3),
.md :deep(h4) {
  font-weight: 700;
  margin: 12px 0 6px;
  line-height: 1.4;
}
.md :deep(h1) {
  font-size: 17px;
}
.md :deep(h2) {
  font-size: 16px;
}
.md :deep(h3),
.md :deep(h4) {
  font-size: 15px;
}
.md :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 10px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.6;
}
.md :deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 0.88em;
}
.md :deep(:not(pre) > code) {
  background: #f1f3f6;
  padding: 2px 6px;
  border-radius: 6px;
  color: #db2777;
}
.md :deep(blockquote) {
  border-left: 3px solid var(--border-strong);
  padding-left: 12px;
  color: var(--text-sub);
  margin: 8px 0;
}
.md :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
.md :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}

.composer {
  padding: 8px 28px 20px;
  flex-shrink: 0;
}
.composer-box {
  max-width: 860px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  padding: 10px 10px 10px 16px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  box-shadow: var(--shadow-card);
  transition: border-color 0.15s var(--ease);
}
.composer-box:focus-within {
  border-color: #9ca3af;
}
.composer-input {
  flex: 1;
  border: none;
  resize: none;
  font-size: 14.5px;
  line-height: 1.6;
  max-height: 140px;
  background: transparent;
  color: var(--text);
  padding: 6px 0;
}
.composer-input::placeholder {
  color: var(--text-weak);
}
.send-btn,
.stop-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.15s var(--ease), transform 0.15s var(--ease);
}
.send-btn {
  background: var(--dark);
  color: #fff;
}
.send-btn:hover:not(:disabled) {
  background: var(--dark-hover);
}
.send-btn:disabled {
  background: #e5e7eb;
  color: var(--text-weak);
  cursor: not-allowed;
}
.stop-btn {
  background: #fee2e2;
  color: var(--danger);
}
.stop-btn:hover {
  background: #fecaca;
}
.composer-hint {
  max-width: 860px;
  margin: 8px auto 0;
  font-size: 12px;
  color: var(--text-weak);
  text-align: center;
}
</style>
