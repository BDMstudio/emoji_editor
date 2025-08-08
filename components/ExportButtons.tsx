// File: components/ExportButtons.tsx
'use client'

import { RefObject, useState } from 'react'
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
    <div className="flex gap-2 flex-wrap mb-2">
      <button
        onClick={onTogglePreview}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        {previewEnabled ? '关闭 Twemoji 预览' : '开启 Twemoji 预览'}
      </button>
      <button
        onClick={handleExportHTML}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        导出：可编辑 HTML
      </button>
      <button
        onClick={handleExportHTMLTwemoji}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        导出：展示一致 HTML（Twemoji 快照）
      </button>
      <button
        onClick={handleExportMarkdown}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        导出：Markdown (.md)
      </button>
      <button
        onClick={handleExportPDF}
        disabled={pdfLoading}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pdfLoading ? '生成中...' : '保存为 PDF'}
      </button>
    </div>
  )
}