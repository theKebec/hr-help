import { useSettingsStore } from '@/stores/settings'
import { useChatStore } from '@/stores/chat'

/**
 * 调用 DeepSeek Chat Completions（SSE 流式）。
 * 请求走同源 /api/deepseek/chat 代理，避免浏览器 CORS 与跨域问题；
 * API Key 由用户在「设置」中填写，随请求体提交给代理转发。
 *
 * @param {Object} opts
 * @param {string} opts.employeeId 当前数字员工 id
 * @param {string} opts.systemPrompt 该员工的系统提示词
 * @param {Array<{role: string, content: string}>} opts.history 历史消息
 * @param {string} opts.userInput 用户本轮输入
 * @param {AbortSignal} [opts.signal]
 */
export async function streamChat({ employeeId, systemPrompt, history, userInput, signal }) {
  const settings = useSettingsStore()
  const chat = useChatStore()

  if (!settings.configured) {
    throw new Error('未配置 DeepSeek API Key，请先点击左下角设置按钮填写。')
  }

  // 1. 用户消息落库
  chat.addMessage(employeeId, 'user', userInput)
  chat.beginAssistantMessage(employeeId)
  chat.startStreaming(employeeId)

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history
      .filter((m) => !m.error && m.content)
      .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: userInput }
  ]

  try {
    const resp = await fetch('/api/deepseek/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        stream: true,
        temperature: 0.7
      }),
      signal
    })

    if (!resp.ok) {
      let detail = ''
      try {
        const errData = await resp.json()
        detail = errData?.error?.message || errData?.message || ''
      } catch {
        /* ignore */
      }
      throw new Error(detail || `请求失败（HTTP ${resp.status}），请检查 API Key 与网络。`)
    }

    if (!resp.body) {
      throw new Error('当前浏览器不支持流式响应。')
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') continue

        try {
          const json = JSON.parse(data)
          const delta = json?.choices?.[0]?.delta?.content
          if (delta) {
            fullText += delta
            chat.appendAssistantChunk(employeeId, delta)
          }
        } catch {
          // 代理层可能下发非 JSON 的错误提示行，忽略解析失败
        }
      }
    }

    if (!fullText) {
      throw new Error('模型未返回内容，请稍后重试。')
    }
    chat.finishAssistantMessage(employeeId)
  } catch (err) {
    const aborted = err?.name === 'AbortError'
    if (aborted) {
      // 用户主动停止：保留已生成内容
      const conv = chat.conversations[employeeId]
      const last = conv?.messages[conv.messages.length - 1]
      if (last && last.streaming) {
        if (!last.content) {
          last.content = '（已停止生成）'
        }
        last.streaming = false
      }
    } else {
      chat.markAssistantError(employeeId, `⚠️ ${err.message || '对话失败，请稍后重试。'}`)
    }
  } finally {
    chat.stopStreaming(employeeId)
  }
}
