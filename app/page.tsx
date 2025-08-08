// File: app/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Editor from '@/components/Editor'
import Preview from '@/components/Preview'
import Toolbar from '@/components/Toolbar'
import ExportButtons from '@/components/ExportButtons'
import ScriptLoader from '@/components/ScriptLoader'
import ThemeToggle from '@/components/ThemeToggle'
import EmojiContainer from '@/components/EmojiContainer'
import { fixLegacyKeycaps, listDigitsToKeycap } from '@/lib/utils'

const DEFAULT_CONTENT = `2025 Zhangjiajie Travel Guide Is Here!!!||
The 9 Must-See Spots in Zhangjiajie❗❗Read Before You Go❗
📍Must-see attractions:
1️⃣ Zhangjiajie National Forest Park
2️⃣ Tianmen Mountain National Forest Park
3️⃣ Wulingyuan Scenic Area
4️⃣ Baofeng Lake
5️⃣ Huanglong Cave
6️⃣ Zhangjiajie Grand Canyon Glass Bridge
7️⃣ Furong Town
8️⃣ Phoenix Ancient Town (Fenghuang)
9️⃣ Tianmen Cave`

export default function Home() {
  const [content, setContent] = useState('')
  const [previewEnabled, setPreviewEnabled] = useState(false)
  const [copyStatus, setCopyStatus] = useState(false)
  const [editorWidth, setEditorWidth] = useState(50) // percentage
  const [editorHeight, setEditorHeight] = useState(85) // percentage of main area
  const [isLargeScreen, setIsLargeScreen] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [isVerticalResizing, setIsVerticalResizing] = useState(false)

  const STORAGE_KEYS = {
    width: 'emoji_editor_split_width',
    height: 'emoji_editor_split_height',
  } as const;

  // Initialize content with legacy keycap fix on mount + restore split ratios
  useEffect(() => {
    setContent(fixLegacyKeycaps(DEFAULT_CONTENT))
    // Restore saved ratios
    try {
      const savedW = localStorage.getItem(STORAGE_KEYS.width)
      const savedH = localStorage.getItem(STORAGE_KEYS.height)
      if (savedW) {
        const w = Number(savedW)
        if (!Number.isNaN(w) && w >= 20 && w <= 80) setEditorWidth(w)
      }
      if (savedH) {
        const h = Number(savedH)
        if (!Number.isNaN(h) && h >= 40 && h <= 95) setEditorHeight(h)
      }
    } catch {}
  }, [])

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleFixKeycaps = () => {
    setContent(fixLegacyKeycaps(content))
  }

  const handleListToKeycap = () => {
    setContent(listDigitsToKeycap(content))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopyStatus(true)
      setTimeout(() => setCopyStatus(false), 1200)
    } catch (error) {
      alert('复制失败：' + error)
    }
  }

  const handleClear = () => {
    setContent('')
  }

  const handleEmojiSelect = (emoji: string) => {
    // Get current cursor position from the editor
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
        // Insert at cursor position
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(emoji)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)

        // Update content state
        setContent(editorRef.current.innerText)
      } else {
        // Append to end if no cursor position
        setContent(prev => prev + emoji)
      }
    }
  }

  const togglePreview = () => {
    setPreviewEnabled(!previewEnabled)
  }

  // Horizontal resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  // Vertical resize handlers
  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    setIsVerticalResizing(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

        // Limit width between 20% and 80%
        const clampedWidth = Math.min(80, Math.max(20, newWidth))
        setEditorWidth(clampedWidth)
      }

      if (isVerticalResizing && mainContainerRef.current) {
        const containerRect = mainContainerRef.current.getBoundingClientRect()
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100

        // Limit height between 40% and 95%
        const clampedHeight = Math.min(95, Math.max(40, newHeight))
        setEditorHeight(clampedHeight)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setIsVerticalResizing(false)
    }

    if (isResizing || isVerticalResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = isResizing ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, isVerticalResizing])
  // Persist ratios whenever values change (outside JSX)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.width, String(editorWidth))
      localStorage.setItem(STORAGE_KEYS.height, String(editorHeight))
    } catch {}
  }, [editorWidth, editorHeight])


  return (
    <main className="h-screen flex flex-col">
      <ScriptLoader />
      <header className="flex items-center justify-between mb-3 flex-shrink-0">
        <h1 className="text-lg font-semibold">
          Emoji 适配可编辑工具{' '}
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent ml-2">
            导出：HTML / HTML(快照) / MD / PDF
          </span>
        </h1>
        <ThemeToggle />
      </header>

      <div
        ref={mainContainerRef}
        className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden"
      >
        <div
          ref={containerRef}
          className="flex flex-col lg:flex-row gap-3 relative overflow-hidden min-h-0"
          style={{ height: `${editorHeight}%` }}
        >
        {/* Editor Panel */}
        <section
          className="bg-panel border border-borderPanel rounded-xl p-3 shadow-[0_4px_18px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden min-h-0"
          style={{
            width: isLargeScreen ? `${editorWidth}%` : '100%',
            height: isLargeScreen ? '100%' : '50%'
          }}
        >
          <Toolbar
            onFixKeycaps={handleFixKeycaps}
            onListToKeycap={handleListToKeycap}
            onCopy={handleCopy}
            onClear={handleClear}
            copyStatus={copyStatus}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor
              ref={editorRef}
              content={content}
              onChange={setContent}
            />
          </div>
          <div className="text-muted text-xs mt-2">
            提示：先点"修复旧式 Keycap"，必要时再把段首数字转换为 1️⃣2️⃣3️⃣。
          </div>
        </section>

        {/* Resize Handle - only show on large screens */}
        <div
          className="hidden lg:block w-1 hover:w-2 bg-transparent hover:bg-ring/30 cursor-col-resize transition-all duration-200 rounded-full flex-shrink-0 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 -mx-2"></div>
          <div className="w-full h-full bg-transparent group-hover:bg-ring/50 transition-colors duration-200 rounded-full"></div>
        </div>

        {/* Preview Panel */}
        <section
          className="bg-panel border border-borderPanel rounded-xl p-3 shadow-[0_4px_18px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden min-h-0"
          style={{
            width: isLargeScreen ? `${100 - editorWidth}%` : '100%',
            height: isLargeScreen ? '100%' : '50%'
          }}
        >
          <ExportButtons
            content={content}
            editorRef={editorRef}
            previewEnabled={previewEnabled}
            onTogglePreview={togglePreview}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            <Preview
              content={content}
              enabled={previewEnabled}
            />
          </div>
          {!previewEnabled && (
            <div className="text-muted text-xs mt-2">
              未开启预览（为避免把文字替换成图片，编辑区保持原生 emoji）。
            </div>
          )}
        </section>
        </div>

        {/* Vertical Resize Handle */}
        <div
          className="h-3 bg-transparent hover:bg-ring/20 cursor-row-resize transition-all duration-200 flex-shrink-0 relative group flex items-center justify-center"
          onMouseDown={handleVerticalMouseDown}
        >
          {/* Extended clickable area */}
          <div className="absolute inset-0 -my-4 w-full"></div>
          {/* Visual indicator */}
          <div className="w-12 h-1 bg-ring/20 group-hover:bg-ring/40 transition-colors duration-200 rounded-full"></div>
        </div>

        {/* Emoji Container */}
        <div style={{ height: `${100 - editorHeight}%`, minHeight: '100px' }} className="overflow-hidden min-h-0">
          <EmojiContainer onEmojiSelect={handleEmojiSelect} />
        </div>
      </div>
    </main>
  )
}