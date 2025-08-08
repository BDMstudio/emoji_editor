// File: components/Editor.tsx
'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

// AI-SUMMARY: Main editor component with contenteditable functionality for emoji text editing
const Editor = forwardRef<HTMLDivElement, EditorProps>(({ content, onChange }, ref) => {
  const internalRef = useRef<HTMLDivElement>(null)
  const editorRef = (ref as React.MutableRefObject<HTMLDivElement>) || internalRef
  const [isFocused, setIsFocused] = useState(false)
  const isInternalUpdate = useRef(false)

  // Update editor content when prop changes (but not during internal updates)
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerText !== content) {
        editorRef.current.innerText = content
      }
    }
    isInternalUpdate.current = false
  }, [content, editorRef])

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true
      onChange(editorRef.current.innerText)
    }
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div
      ref={editorRef}
      className={`
        h-full overflow-auto p-3 rounded-[10px] 
        border border-borderEditor outline-none bg-editor
        leading-[1.55] text-base whitespace-pre-wrap font-emoji
        ${isFocused ? 'editor-focus' : ''}
      `}
      contentEditable
      spellCheck={false}
      dir="auto"
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      suppressContentEditableWarning
    />
  )
})

Editor.displayName = 'Editor'

export default Editor