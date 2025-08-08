// File: components/Preview.tsx
'use client'

import { useEffect, useRef } from 'react'

// Declare twemoji as global to avoid TypeScript errors
declare global {
  interface Window {
    twemoji: any
  }
}

interface PreviewProps {
  content: string
  enabled: boolean
}

// AI-SUMMARY: Preview component that renders text with Twemoji image replacements
export default function Preview({ content, enabled }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !previewRef.current) return

    // Load Twemoji script if not already loaded
    if (!window.twemoji) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js'
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        updateTwemoji()
      }
      document.head.appendChild(script)
    } else {
      updateTwemoji()
    }
  }, [content, enabled])

  const updateTwemoji = () => {
    if (!previewRef.current || !window.twemoji) return

    previewRef.current.textContent = content
    window.twemoji.parse(previewRef.current, {
      base: 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/',
      folder: 'svg',
      ext: '.svg',
    })
  }

  if (!enabled) {
    return null
  }

  return (
    <div
      ref={previewRef}
      className="h-full overflow-auto p-3 rounded-[10px] 
                 border border-borderEditor outline-none bg-editor
                 leading-[1.55] text-base whitespace-pre-wrap font-emoji"
      aria-live="polite"
    />
  )
}