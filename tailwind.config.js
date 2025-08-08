/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS custom properties
        bg: 'var(--color-bg)',
        panel: 'var(--color-panel)',
        muted: 'var(--color-muted)',
        ring: 'var(--color-ring)',
        text: 'var(--color-text)',
        accent: 'var(--color-accent)',
        editor: 'var(--color-editor)',
        button: 'var(--color-button)',
        buttonBorder: 'var(--color-button-border)',
        buttonPrimary: 'var(--color-button-primary)',
        borderPanel: 'var(--color-border-panel)',
        borderEditor: 'var(--color-border-editor)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Noto Sans CJK SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        emoji: [
          'inherit',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Noto Color Emoji"',
          '"Twemoji Mozilla"',
          '"EmojiOne Color"',
        ],
      },
      transitionProperty: {
        'colors-bg': 'color, background-color, border-color, fill, stroke, box-shadow',
      },
    },
  },
  plugins: [],
}