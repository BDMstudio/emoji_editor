// File: lib/export.ts
import { escapeHTML, download } from './utils'

// Declare global types for libraries
declare global {
  interface Window {
    twemoji: any
    html2pdf: any
  }
}

// AI-SUMMARY: Export functionality for various file formats (HTML, Markdown, PDF)
export function exportEditableHTML(content: string): void {
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Document (Editable, Native Emoji)</title>
  <style>
    body {
      margin: 24px;
      font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
                   "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
    }
    .doc {
      white-space: pre-wrap;
      line-height: 1.6;
      font-size: 16px;
      font-family: inherit, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", 
                   "Twemoji Mozilla", "EmojiOne Color";
    }
  </style>
</head>
<body>
  <div class="doc" contenteditable="true" dir="auto">${escapeHTML(content)}</div>
</body>
</html>`

  download('document-editable.html', html, 'text/html')
}

export function exportTwemojiHTML(content: string): void {
  // Create a temporary container for Twemoji parsing
  const tempDiv = document.createElement('div')
  tempDiv.textContent = content

  // Parse with Twemoji if available
  if (window.twemoji) {
    window.twemoji.parse(tempDiv, {
      base: 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/',
      folder: 'svg',
      ext: '.svg',
    })
  }

  const snapshot = tempDiv.innerHTML

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Document (Twemoji Snapshot)</title>
  <style>
    body {
      margin: 24px;
      font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
                   "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
    }
    .doc {
      white-space: pre-wrap;
      line-height: 1.6;
      font-size: 16px;
    }
    .doc img.emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em;
      vertical-align: -0.1em;
    }
  </style>
</head>
<body>
  <div class="doc" dir="auto">${snapshot}</div>
  <!-- 注：此版本为展示一致的快照，emoji 为 <img>；需要联网访问 jsDelivr 的 Twemoji 资源。 -->
</body>
</html>`

  download('document-twemoji.html', html, 'text/html')
}

export function exportMarkdown(content: string): void {
  download('document.md', content, 'text/markdown')
}

export async function exportPDF(content: string): Promise<void> {
  // Dynamically load html2pdf.js if not already loaded
  if (!window.html2pdf) {
    await loadHtml2Pdf()
  }

  if (!window.html2pdf) {
    throw new Error('PDF 组件加载失败，请联网后重试')
  }

  // Create container for PDF generation
  const container = document.createElement('div')
  container.className = 'pdf-container'
  
  // Set container styles for PDF generation
  container.style.cssText = `
    position: fixed;
    left: -10000px;
    top: 0;
    width: 794px;
    background: #ffffff;
    color: #000000;
    padding: 40px;
    line-height: 1.8;
    font-size: 16px;
    white-space: pre-wrap;
    font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", 
                 "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
    visibility: visible;
    opacity: 1;
    z-index: 999999;
    box-sizing: border-box;
  `
  
  // Set content
  container.textContent = content
  document.body.appendChild(container)
  
  // Parse emojis to images
  if (window.twemoji) {
    window.twemoji.parse(container, {
      base: 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/',
      folder: '72x72',
      ext: '.png',
      attributes: () => ({
        crossorigin: 'anonymous',
        style: 'height: 1.2em; width: 1.2em; margin: 0 0.05em; vertical-align: -0.2em;'
      })
    })
  }
  
  // Wait for all images to load
  const images = container.querySelectorAll('img')
  if (images.length > 0) {
    await Promise.all(
      Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve()
          } else {
            img.addEventListener('load', () => resolve(), { once: true })
            img.addEventListener('error', () => resolve(), { once: true })
            // Set timeout to avoid infinite waiting
            setTimeout(() => resolve(), 3000)
          }
        })
      })
    )
  }
  
  // Move container to visible area for capture
  container.style.left = '0'
  container.style.top = '0'
  
  // Wait for browser rendering
  await new Promise(resolve => requestAnimationFrame(() => {
    requestAnimationFrame(resolve)
  }))
  
  // Configure and generate PDF
  const options = {
    margin: [0.5, 0.5, 0.5, 0.5], // Top, right, bottom, left margins (inches)
    filename: 'emoji_document.pdf',
    image: {
      type: 'jpeg',
      quality: 0.95
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: false,
      foreignObjectRendering: false,
      windowWidth: 850,
      windowHeight: 1200,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: 794,
      height: container.scrollHeight
    },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy']
    }
  }
  
  try {
    // Generate and download PDF
    await window.html2pdf().from(container).set(options).save()
  } finally {
    // Clean up
    container.remove()
  }
}

// Helper function to load html2pdf.js dynamically
function loadHtml2Pdf(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load html2pdf.js'))
    document.head.appendChild(script)
  })
}