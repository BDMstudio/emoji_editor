// File: components/ScriptLoader.tsx
'use client'

import { useEffect } from 'react'

// AI-SUMMARY: Component to load external scripts (Twemoji and html2pdf) on client-side
export default function ScriptLoader() {
  useEffect(() => {
    // Load Twemoji script
    if (!window.twemoji) {
      const twemojiScript = document.createElement('script')
      twemojiScript.src = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js'
      twemojiScript.crossOrigin = 'anonymous'
      twemojiScript.async = true
      document.head.appendChild(twemojiScript)
    }

    // Load html2pdf.js script
    if (!window.html2pdf) {
      const html2pdfScript = document.createElement('script')
      html2pdfScript.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js'
      html2pdfScript.crossOrigin = 'anonymous'
      html2pdfScript.async = true
      document.head.appendChild(html2pdfScript)
    }
  }, [])

  return null
}