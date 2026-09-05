// 生产环境服务器：托管 dist/ 静态文件 + 代理 /api/deepseek/* 到 DeepSeek 官方接口（SSE 透传）
import http from 'node:http'
import { statSync, createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import https from 'node:https'

const DIST_DIR = path.resolve(process.cwd(), 'dist')
const PORT = Number(process.env.DEPLOY_RUN_PORT) || 5000
const DEEPSEEK_HOST = 'api.deepseek.com'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json'
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath)

  // 防目录穿越
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA 回退
    filePath = path.join(DIST_DIR, 'index.html')
  }

  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  createReadStream(filePath).pipe(res)
}

function proxyDeepseek(req, res) {
  const url = new URL(req.url, 'http://x')
  const upstreamPath = url.pathname.replace(/^\/api\/deepseek/, '') + url.search

  // 收集请求体
  const chunks = []
  req.on('data', (c) => chunks.push(c))
  req.on('end', () => {
    const body = Buffer.concat(chunks)
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream'
    }
    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization']

    const upstream = https.request(
      {
        hostname: DEEPSEEK_HOST,
        path: upstreamPath,
        method: 'POST',
        headers
      },
      (up) => {
        res.writeHead(up.statusCode || 502, {
          'Content-Type': up.headers['content-type'] || 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive'
        })
        up.pipe(res)
      }
    )

    upstream.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { message: `代理请求失败: ${err.message}` } }))
    })

    if (body.length) upstream.write(body)
    upstream.end()
  })
}

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/deepseek/')) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: { message: 'Method Not Allowed' } }))
    }
    return proxyDeepseek(req, res)
  }
  serveStatic(req, res)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] HR Helper listening on http://0.0.0.0:${PORT}`)
})
