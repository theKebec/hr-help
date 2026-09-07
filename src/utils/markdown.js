// 轻量 Markdown 渲染（覆盖对话常见语法），避免引入重型依赖
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(text) {
  let s = escapeHtml(text)
  // 代码块占位由 block 处理，这里处理行内代码
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>')
  // 粗体 / 斜体
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  // 链接
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  // 换行
  s = s.replace(/\n/g, '<br />')
  return s
}

export function renderMarkdown(src) {
  if (!src) return ''
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const html = []
  let i = 0
  let listType = null
  let codeLang = null
  let codeBuf = []

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`)
      listType = null
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    // 代码块围栏
    if (line.trimStart().startsWith('```')) {
      if (codeLang !== null) {
        html.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`)
        codeBuf = []
        codeLang = null
      } else {
        closeList()
        codeLang = line.trim().slice(3).trim() || 'text'
      }
      i++
      continue
    }
    if (codeLang !== null) {
      codeBuf.push(line)
      i++
      continue
    }

    // 标题
    const heading = line.match(/^(#{1,4})\s+(.*)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i++
      continue
    }

    // 分隔线
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      closeList()
      html.push('<hr />')
      i++
      continue
    }

    // 无序列表
    const ul = line.match(/^\s*[-*]\s+(.*)$/)
    if (ul) {
      if (listType !== 'ul') {
        closeList()
        html.push('<ul>')
        listType = 'ul'
      }
      html.push(`<li>${inline(ul[1])}</li>`)
      i++
      continue
    }

    // 有序列表
    const ol = line.match(/^\s*\d+[.、]\s+(.*)$/)
    if (ol) {
      if (listType !== 'ol') {
        closeList()
        html.push('<ol>')
        listType = 'ol'
      }
      html.push(`<li>${inline(ol[1])}</li>`)
      i++
      continue
    }

    // 引用
    const quote = line.match(/^\s*>\s?(.*)$/)
    if (quote) {
      closeList()
      html.push(`<blockquote>${inline(quote[1])}</blockquote>`)
      i++
      continue
    }

    // 空行
    if (!line.trim()) {
      closeList()
      i++
      continue
    }

    // 普通段落
    closeList()
    html.push(`<p>${inline(line)}</p>`)
    i++
  }

  if (codeLang !== null) {
    html.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`)
  }
  closeList()
  return html.join('')
}
