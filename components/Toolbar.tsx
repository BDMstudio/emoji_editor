// File: components/Toolbar.tsx
'use client'

interface ToolbarProps {
  onFixKeycaps: () => void
  onListToKeycap: () => void
  onCopy: () => void
  onClear: () => void
  copyStatus: boolean
}

// AI-SUMMARY: Toolbar component with text transformation and utility buttons
export default function Toolbar({
  onFixKeycaps,
  onListToKeycap,
  onCopy,
  onClear,
  copyStatus,
}: ToolbarProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-2">
      <button
        onClick={onFixKeycaps}
        className="bg-buttonPrimary text-text border border-ring rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        修复旧式 Keycap（1⃣→1️⃣）
      </button>
      <button
        onClick={onListToKeycap}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        段首数字→Keycap（1./1、/1-）（注意：./、-后要有空格才能识别）
      </button>
      <button
        onClick={onCopy}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        {copyStatus ? '已复制 ✅' : '复制文本'}
      </button>
      <button
        onClick={onClear}
        className="bg-button text-text border border-buttonBorder rounded-[10px] px-3 py-2 cursor-pointer text-sm hover:border-ring transition-colors"
      >
        清空
      </button>
    </div>
  )
}