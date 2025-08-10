// File: server-next-static.js
// AI-SUMMARY: Tiny HTTP server to host pre-exported Next.js static site (./out) and auto-open browser with dynamic port.

const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const HOST = '127.0.0.1'
const BASE_PORT = Number(process.env.PORT) || 5173
const ROOT = __dirname
// Resolve out directory from multiple candidates: embedded snapshot, cwd/out, exeDir/out
function resolveOutDir() {
  const exeDir = path.dirname(process.execPath)
  const candidates = [
    path.join(exeDir, 'out'),             // alongside executable (优先)
    path.join(process.cwd(), 'out'),      // working dir
    path.join(ROOT, 'out'),               // embedded (pkg snapshot)
  ]
  for (const p of candidates) {
    try { if (fs.existsSync(p) && (fs.statSync(p).isDirectory())) return p } catch {}
  }
  return candidates[0] // fallback to exeDir/out
}
const OUT_DIR = resolveOutDir()
console.log('[emoji-editor] resolved OUT_DIR =', OUT_DIR)

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
  ['.txt',  'text/plain; charset=utf-8'],
])

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers)
  res.end(body)
}

function tryServe(res, filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase()
    const mime = MIME.get(ext) || 'application/octet-stream'
    const data = fs.readFileSync(filePath)
    send(res, 200, data, { 'Content-Type': mime, 'Cache-Control': 'no-cache' })
    return true
  } catch {
    return false
  }
}

function requestHandler(req, res) {
  const url = decodeURI((req.url || '/').split('?')[0])

  // Root -> index.html
  const indexPath = path.join(OUT_DIR, 'index.html')
  if (url === '/' || url === '/index.html') {
    if (tryServe(res, indexPath)) return
    return send(res, 500, `Next export output not found. Expected: ${indexPath}`)
  }

  // Static file attempt
  const safe = path.normalize(url).replace(/^\/+/, '')
  const staticPath = path.join(OUT_DIR, safe)
  if (staticPath.startsWith(OUT_DIR) && tryServe(res, staticPath)) return

  // Directory index fallback
  const altIndex = path.join(OUT_DIR, safe, 'index.html')
  if (altIndex.startsWith(OUT_DIR) && tryServe(res, altIndex)) return

  // SPA fallback
  if (tryServe(res, indexPath)) return
  return send(res, 500, `Next export output not found. Expected: ${indexPath}`)
}

function createServer() { return http.createServer(requestHandler) }

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
      console.log(`[emoji-editor] static site running at ${url}`)
      const platform = process.platform
      const openCmd = platform === 'win32' ? `start "" "${url}"` : platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`
      try { exec(openCmd) } catch {}
    })
  }
  tryListen(basePort || 0)
}

startOnAvailablePort(BASE_PORT)

