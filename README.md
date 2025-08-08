# Emoji Editor - Next.js

A modern emoji text editor built with Next.js, TypeScript, and Tailwind CSS. Features Twemoji preview and multiple export formats.

## Features

- **Rich Text Editing**: ContentEditable interface with native emoji support
- **Twemoji Preview**: Toggle between native emoji and Twemoji visualization
- **Smart Emoji Selector**: 
  - 6 categorized emoji collections (Smileys, Animals, Food, Activities, Travel, Symbols)
  - Click-to-insert at cursor position
  - Responsive grid layout with category tabs
- **Text Transformations**:
  - Fix legacy keycap emojis (1⃣→1️⃣)
  - Convert list digits to keycap format
  - Copy to clipboard
  - Clear content
- **Multiple Export Formats**:
  - Editable HTML (with native emoji)
  - Twemoji HTML (with emoji as images)
  - Markdown (.md)
  - PDF generation
- **Adaptive Layout System**:
  - Resizable horizontal panels (editor/preview)
  - Resizable vertical panels (content/emoji areas)
  - Layout preferences persistence via localStorage
- **Theme System**: Light/Dark theme toggle with system preference detection
- **Responsive Design**: Works across desktop and mobile devices with adaptive layouts

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Emoji Rendering**: Twemoji
- **PDF Generation**: html2pdf.js

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
emoji_editor/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main page component with layout management
│   └── globals.css        # Global styles, themes, and custom properties
├── components/            # React components
│   ├── Editor.tsx         # Main contentEditable editor
│   ├── Preview.tsx        # Twemoji preview component
│   ├── Toolbar.tsx        # Text transformation buttons
│   ├── ExportButtons.tsx  # Export functionality buttons
│   ├── EmojiContainer.tsx # Bottom emoji selector with categories
│   ├── ThemeProvider.tsx  # Theme context provider
│   ├── ThemeToggle.tsx    # Light/dark theme switch
│   └── ScriptLoader.tsx   # External script loader
├── lib/                   # Utility functions
│   ├── utils.ts           # Text transformation utilities
│   ├── export.ts          # Export functionality
│   ├── emojiData.ts       # Categorized emoji collections
│   └── theme.ts           # Theme management utilities
├── public/                # Static assets
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Usage

1. **Edit Text**: Type or paste your emoji-rich text in the editor panel
2. **Insert Emojis**: Click emojis from the categorized selector at the bottom
3. **Adjust Layout**: Drag the resize handles to customize panel proportions
4. **Transform Text**: Use toolbar buttons to fix keycaps or convert list digits
5. **Toggle Preview**: Enable Twemoji preview to see how emojis will render
6. **Switch Themes**: Use the theme toggle button for light/dark mode
7. **Export**: Choose your preferred export format (HTML, Markdown, or PDF)

### Layout Controls
- **Horizontal Resize**: Drag the vertical line between editor and preview panels
- **Vertical Resize**: Drag the horizontal line between content area and emoji selector  
- **Layout Persistence**: Your preferred panel sizes are automatically saved

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled

## License

MIT