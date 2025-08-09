// File: components/ExportButtons.tsx
'use client'

import { RefObject, useEffect, useRef, useState } from 'react'
import { 
  exportEditableHTML, 
  exportTwemojiHTML, 
  exportMarkdown, 
  exportPDF 
} from '@/lib/export'

interface ExportButtonsProps {
  content: string
  editorRef: RefObject<HTMLDivElement>
  previewEnabled: boolean
  onTogglePreview: () => void
}

// AI-SUMMARY: Export buttons component for various file format exports and preview toggle
export default function ExportButtons({
  content,
  editorRef,
  previewEnabled,
  onTogglePreview,
}: ExportButtonsProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Close dropdown on outside click or ESC
  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        btnRef.current && !btnRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleExportHTML = () => {
    exportEditableHTML(content)
  }

  const handleExportHTMLTwemoji = () => {
    exportTwemojiHTML(content)
  }

  const handleExportMarkdown = () => {
    exportMarkdown(content)
  }

  const handleExportPDF = async () => {
    setPdfLoading(true)
    try {
      await exportPDF(content)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('PDF生成失败：' + (error as Error).message)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="flex gap-2 flex-wrap mb-2 items-start">
      <button
        onClick={onTogglePreview}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        {previewEnabled ? '关闭 Twemoji 预览' : '开启 Twemoji 预览'}
      </button>

      {/* Export Dropdown */}
      <div className="relative">
        <button
          ref={btnRef}
          onClick={() => setMenuOpen((v) => !v)}
          className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors flex items-center gap-1"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          导出
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="opacity-70">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>
        {menuOpen && (
          <div ref={menuRef} className="absolute right-0 z-50 mt-1 min-w-[220px] bg-panel border border-buttonBorder rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => { setMenuOpen(false); handleExportHTML(); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-buttonPrimary transition-colors"
            >
              可编辑 HTML（原生 emoji）
            </button>
            <button
              onClick={() => { setMenuOpen(false); handleExportHTMLTwemoji(); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-buttonPrimary transition-colors"
            >
              一致 HTML（Twemoji 快照）
            </button>
            <button
              onClick={() => { setMenuOpen(false); handleExportMarkdown(); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-buttonPrimary transition-colors"
            >
              Markdown (.md)
            </button>
            <button
              onClick={async () => { setMenuOpen(false); await handleExportPDF(); }}
              disabled={pdfLoading}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-buttonPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading ? '保存为 PDF（生成中…）' : '保存为 PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}