// File: server-standalone.js
// AI-SUMMARY: Minimal HTTP server to host emoji_editor.html and auto-open browser on startup

const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const BASE_PORT = Number(process.env.PORT) || 5173
const HOST = '127.0.0.1'
const ROOT = __dirname
const ENTRY = path.join(ROOT, 'emoji_editor.html')
let ENTRY_CONTENT = null
function loadEntry() {
  const candidates = [
    ENTRY,
    path.join(process.cwd(), 'emoji_editor.html')
  ]
  for (const p of candidates) {
    try {
      const buf = fs.readFileSync(p)
      ENTRY_CONTENT = buf
      return p
    } catch {}
  }
  return null
}
const ENTRY_RESOLVED = loadEntry()

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.htm',  'text/html; charset=utf-8'],
  ['.js',   'application/javascript; charset=utf-8'],
  ['.css',  'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg',  'image/svg+xml'],
  ['.png',  'image/png'],
  ['.jpg',  'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif',  'image/gif'],
  ['.ico',  'image/x-icon'],
])

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers)
  res.end(body)
}

function serveFile(res, filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase()
    const mime = MIME.get(ext) || 'application/octet-stream'
    const data = fs.readFileSync(filePath)
    send(res, 200, data, { 'Content-Type': mime, 'Cache-Control': 'no-cache' })
  } catch (e) {
    send(res, 404, 'Not Found')
  }
}

function requestHandler(req, res) {
  const url = decodeURI((req.url || '/').split('?')[0])
  if (url === '/' || url === '/index.html') {
    if (ENTRY_CONTENT) return send(res, 200, ENTRY_CONTENT, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
    const p = loadEntry()
    if (ENTRY_CONTENT) return send(res, 200, ENTRY_CONTENT, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
    return send(res, 500, Buffer.from('Entry file not found. Place emoji_editor.html next to the executable or ensure packaging assets include it.'))
  }
  const safe = path.normalize(url).replace(/^\/+/, '')
  const filePath = path.join(ROOT, safe)
  if (filePath.startsWith(ROOT) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath)
  }
  send(res, 404, 'Not Found')
}

function createServer() {
  return http.createServer(requestHandler)
}

function startOnAvailablePort(basePort) {
  let attempt = 0
  const maxAttempts = 20
  const tryListen = (p) => {
    const server = createServer()
    server.on('error', (err) => {
      if ((err && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) && attempt < maxAttempts) {
        const next = p + 1
        attempt++
        console.log(`[emoji-editor] port ${p} unavailable, trying ${next}...`)
        tryListen(next)
      } else {
        console.error('[emoji-editor] server error:', err)
        process.exit(1)
      }
    })
    server.listen(p, HOST, () => {
      const actual = server.address().port
      const url = `http://${HOST}:${actual}/`
      console.log(`[emoji-editor] server running at ${url}`)
      const platform = process.platform
      const openCmd = platform === 'win32' ? `start "" "${url}"` : platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`
      try { exec(openCmd) } catch {}
    })
  }

  tryListen(basePort || 0)
}

startOnAvailablePort(BASE_PORT)

