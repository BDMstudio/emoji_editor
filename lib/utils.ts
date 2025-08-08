// File: lib/utils.ts

// AI-SUMMARY: Utility functions for text transformations and HTML escaping
export function fixLegacyKeycaps(str: string): string {
  // Replace legacy keycap format (digit + combining enclosing keycap) 
  // with proper format (digit + variation selector-16 + combining enclosing keycap)
  return str.replace(/([0-9])\u20E3/g, '$1\uFE0F\u20E3')
}

export function listDigitsToKeycap(str: string): string {
  // Convert list-style digits at the beginning of lines to keycap emojis
  // Matches patterns like "1.", "1、", "1-", "1)" at the start of lines
  return str.replace(
    /(^|\n)([1-9])(?:[.\-、\)]?\s)/g,
    (_, prefix, digit) => `${prefix}${digit}\uFE0F\u20E3 `
  )
}

export function escapeHTML(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }
  return str.replace(/[&<>"]/g, (char) => htmlEscapeMap[char])
}

export function download(filename: string, content: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  
  // Clean up the URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}