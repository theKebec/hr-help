import { defineStore } from 'pinia'

const STORAGE_KEY = 'hr-helper-conversations'

/**
 * conversations: {
 *   [employeeId]: {
 *     messages: [{ id, role: 'user'|'assistant'|'error', content, createdAt }],
 *     updatedAt: number
 *   }
 * }
 */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations))
  } catch {
    // 存储超限时忽略
  }
}

let msgSeq = 0
const nextId = () => `${Date.now()}-${msgSeq++}`

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: load(),
    streaming: {} // [employeeId]: boolean
  }),
  getters: {
    getMessages: (state) => (employeeId) => state.conversations[employeeId]?.messages ?? [],
    isStreaming: (state) => (employeeId) => Boolean(state.streaming[employeeId]),
    // 已完成任务数：以用户发起的对话轮次计
    completedCount: (state) => (employeeId) => {
      const msgs = state.conversations[employeeId]?.messages ?? []
      return msgs.filter((m) => m.role === 'user').length
    },
    historyList: (state) => {
      return Object.entries(state.conversations)
        .map(([employeeId, conv]) => ({
          employeeId,
          updatedAt: conv.updatedAt,
          count: conv.messages.filter((m) => m.role === 'user').length,
          preview: conv.messages[conv.messages.length - 1]?.content ?? ''
        }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.updatedAt - a.updatedAt)
    }
  },
  actions: {
    ensureConversation(employeeId, greetings) {
      if (!this.conversations[employeeId]) {
        this.conversations[employeeId] = {
          messages: greetings
            ? [{ id: nextId(), role: 'assistant', content: greetings, createdAt: Date.now() }]
            : [],
          updatedAt: Date.now()
        }
        persist(this)
      }
    },
    addMessage(employeeId, role, content) {
      this.ensureConversation(employeeId)
      this.conversations[employeeId].messages.push({
        id: nextId(),
        role,
        content,
        createdAt: Date.now()
      })
      this.conversations[employeeId].updatedAt = Date.now()
      persist(this)
    },
    startStreaming(employeeId) {
      this.streaming[employeeId] = true
    },
    stopStreaming(employeeId) {
      this.streaming[employeeId] = false
    },
    updateLastAssistant(employeeId, content) {
      const conv = this.conversations[employeeId]
      if (!conv) return
      const last = conv.messages[conv.messages.length - 1]
      if (last && last.role === 'assistant' && last.streaming) {
        last.content = content
      }
      conv.updatedAt = Date.now()
    },
    appendAssistantChunk(employeeId, chunk) {
      const conv = this.conversations[employeeId]
      if (!conv) return
      const last = conv.messages[conv.messages.length - 1]
      if (last && last.role === 'assistant' && last.streaming) {
        last.content += chunk
      }
      conv.updatedAt = Date.now()
    },
    beginAssistantMessage(employeeId) {
      this.ensureConversation(employeeId)
      this.conversations[employeeId].messages.push({
        id: nextId(),
        role: 'assistant',
        content: '',
        streaming: true,
        createdAt: Date.now()
      })
    },
    finishAssistantMessage(employeeId) {
      const conv = this.conversations[employeeId]
      if (!conv) return
      const last = conv.messages[conv.messages.length - 1]
      if (last) last.streaming = false
      conv.updatedAt = Date.now()
      persist(this)
    },
    markAssistantError(employeeId, errorText) {
      const conv = this.conversations[employeeId]
      if (!conv) return
      const last = conv.messages[conv.messages.length - 1]
      if (last && last.role === 'assistant' && last.streaming) {
        last.content = errorText
        last.streaming = false
        last.error = true
      }
      persist(this)
    },
    clearConversation(employeeId) {
      delete this.conversations[employeeId]
      persist(this)
    }
  }
})
