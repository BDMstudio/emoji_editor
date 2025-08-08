# Emoji Editor - Next.js

A modern emoji text editor built with Next.js, TypeScript, and Tailwind CSS. Features Twemoji preview and multiple export formats.

## Features

- **Rich Text Editing**: ContentEditable interface with native emoji support
- **Twemoji Preview**: Toggle between native emoji and Twemoji visualization
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
- **Dark Theme UI**: Modern dark interface with smooth transitions
- **Responsive Design**: Works across desktop and mobile devices

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
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
│   ├── Editor.tsx         # Main editor component
│   ├── Preview.tsx        # Twemoji preview component
│   ├── Toolbar.tsx        # Text transformation buttons
│   ├── ExportButtons.tsx  # Export functionality buttons
│   └── ScriptLoader.tsx   # External script loader
├── lib/                   # Utility functions
│   ├── utils.ts           # Text transformation utilities
│   └── export.ts          # Export functionality
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Usage

1. **Edit Text**: Type or paste your emoji-rich text in the left panel
2. **Transform Text**: Use toolbar buttons to fix keycaps or convert list digits
3. **Preview**: Toggle Twemoji preview to see how emojis will render
4. **Export**: Choose your preferred export format (HTML, Markdown, or PDF)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled

## License

MIT