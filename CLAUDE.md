# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev         # Start development server on http://localhost:3000
npm run build       # Build production bundle
npm start           # Start production server
npm run lint        # Run Next.js linter
```

### Testing & Validation
No test framework is currently configured. Manual testing is done through the development server.

## Architecture Overview

### Core Application Flow
The app is a Next.js 14 application using App Router that provides an emoji text editor with multiple export formats. The data flow follows this pattern:

1. **State Management**: Main state lives in `app/page.tsx` - content string flows down to all components
2. **Editor → Preview Pipeline**: User edits in `Editor` component (native emoji) → optional `Preview` with Twemoji rendering
3. **Export System**: Content → `lib/export.ts` → format-specific transformations → download

### Key Architectural Decisions

#### ContentEditable with Circular Update Prevention
The `Editor` component uses a ref-based flag (`isInternalUpdate`) to prevent circular updates between React state and DOM contentEditable. This pattern appears throughout when syncing DOM with React state.

#### Dynamic Script Loading Strategy
External scripts (Twemoji, html2pdf.js) are loaded on-demand via `ScriptLoader` component or within export functions. This keeps initial bundle size small and avoids SSR issues.

#### PDF Export Image Handling
PDF export uses PNG format instead of SVG for Twemoji (`72x72` folder) due to html2canvas cross-origin limitations. The export process:
1. Creates off-screen container with `.pdf-container` class
2. Converts emoji to images via Twemoji
3. Waits for all images to load (3s timeout)
4. Generates PDF with explicit CORS settings

#### Layout Persistence Pattern
Both horizontal (`editorWidth`) and vertical (`editorHeight`) split ratios are stored in localStorage with keys:
- `emoji_editor_split_width`
- `emoji_editor_split_height`

### Component Responsibilities

- **page.tsx**: Orchestrates all state, handles emoji insertion via Selection API, manages layout ratios
- **Editor**: Pure contentEditable wrapper with focus management
- **Preview**: Conditional Twemoji rendering (only when enabled)
- **EmojiContainer**: Category-based emoji selector with cursor position insertion
- **ExportButtons**: Triggers export functions with loading states
- **ThemeProvider**: Context-based theme with system preference detection

### Text Processing Pipeline
1. Initial content gets `fixLegacyKeycaps()` applied on mount
2. Toolbar transformations (`listDigitsToKeycap()`) modify content in-place
3. Exports preserve original Unicode (except PDF which needs images)

### Theme System
CSS custom properties defined in `globals.css` are switched via `data-theme` attribute on `<html>`. Theme preference cascades: localStorage → system preference → default light.

## Important Implementation Details

### Emoji Handling
- Editor maintains native Unicode emoji for editability
- Legacy keycap format (1⃣) auto-fixed to proper format (1️⃣) 
- Font stack includes platform-specific emoji fonts as fallback
- Unsupported emoji characters are filtered out in `EmojiContainer`

### CORS & CDN Configuration
- Twemoji CDN: `https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/`
- All Twemoji images use `crossorigin="anonymous"`
- `next.config.js` whitelists CDN domain for Next.js Image component

### Responsive Breakpoints
- Large screen: ≥1024px (side-by-side layout)
- Mobile: <1024px (stacked layout, emoji selector below)

## Known Constraints

1. No undo/redo system implemented
2. No keyboard shortcuts
3. PDF export requires network access to CDN
4. Clipboard API requires HTTPS or localhost
5. No test coverage - all validation is manual