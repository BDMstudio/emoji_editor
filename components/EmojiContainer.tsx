// File: components/EmojiContainer.tsx
'use client'

import { useState } from 'react'
import { emojiData, EmojiCategory } from '@/lib/emojiData'

interface EmojiContainerProps {
  onEmojiSelect: (emoji: string) => void
}

// AI-SUMMARY: Bottom emoji selection container with category tabs and responsive grid
export default function EmojiContainer({ onEmojiSelect }: EmojiContainerProps) {
  const [activeCategory, setActiveCategory] = useState(0)

  const handleCategoryClick = (index: number) => {
    setActiveCategory(index)
  }

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
  }

  return (
    <section className="emoji-container bg-panel border border-borderPanel rounded-xl p-4 shadow-[0_4px_18px_rgba(0,0,0,0.22)] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">表情选择</h2>
        <div className="text-sm text-muted">
          点击表情插入到光标位置
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 flex-shrink-0">
        {emojiData.map((category, index) => (
          <button
            key={index}
            className={`emoji-button flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === index
                ? 'bg-ring text-white shadow-md'
                : 'bg-button text-text border border-buttonBorder hover:bg-buttonPrimary hover:border-ring'
            }`}
            onClick={() => handleCategoryClick(index)}
            title={category.label}
          >
            <span className="text-lg emoji-button">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="bg-button/30 rounded-lg p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-2">
          {emojiData[activeCategory].emojis.map((emoji, index) => (
            <button
              key={index}
              className="emoji-button text-2xl p-2 rounded-lg hover:bg-buttonPrimary hover:scale-110 transition-all duration-200 text-center border border-transparent hover:border-ring/30 hover:shadow-md"
              onClick={() => handleEmojiClick(emoji)}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-muted mt-3 text-center flex-shrink-0">
        当前分类：{emojiData[activeCategory].label} 
        <span className="mx-2">•</span>
        共 {emojiData[activeCategory].emojis.length} 个表情
      </div>
    </section>
  )
}