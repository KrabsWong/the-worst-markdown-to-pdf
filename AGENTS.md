# Markdown to PDF - Project Documentation

## Project Overview

A tool that converts Markdown documents to beautifully styled PDFs, strictly following GitHub Markdown rendering specifications. Supports Mermaid diagrams and LaTeX mathematical formulas.

## Core Features

1. **GitHub-style Rendering** - Perfectly reproduces GitHub's Markdown rendering effect
2. **Mermaid Diagrams** - Supports flowcharts, sequence diagrams, Gantt charts, class diagrams, etc.
3. **LaTeX Formulas** - Complete mathematical formula support (inline and block level)
4. **Code Highlighting** - Uses highlight.js, supports multiple code themes
5. **Dark Theme** - Supports GitHub dark theme
6. **Batch Conversion** - Supports batch conversion of multiple files

## Project Structure

```
markdown-to-pdf/
├── src/
│   ├── index.ts              # Entry file, exports all modules
│   ├── cli.ts                # Command line tool
│   ├── pdf-engine.ts         # PDF generation engine
│   ├── markdown-parser.ts    # Markdown parser
│   ├── html-template.ts      # HTML template generator
│   ├── mermaid-renderer.ts   # Mermaid diagram server-side renderer
│   ├── types.ts              # TypeScript type definitions
│   ├── styles/
│   │   └── github-markdown.ts    # GitHub-style CSS
│   └── test.ts               # Test file
├── examples/
│   └── demo.md               # Example document
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Technology Stack

- **TypeScript**: Main development language
- **marked**: Markdown parser
- **playwright**: Browser automation (PDF generation)
- **KaTeX**: LaTeX formula rendering
- **highlight.js**: Code highlighting
- **mermaid.js**: Diagram rendering

## Build Commands

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run tests
npm test

# CLI usage
node dist/cli.js <input.md> [options]
```

## Rendering Pipeline

1. Read Markdown file
2. Preprocessing (LaTeX formulas, alerts)
3. Parse Markdown to HTML using marked
4. **Server-side pre-render Mermaid diagrams** (using separate Chromium instance)
5. Generate complete HTML page (with CSS and scripts)
6. Render HTML using Playwright
7. Wait for KaTeX formula rendering to complete
8. Generate PDF

### Mermaid Rendering Notes

Mermaid diagrams are **pre-rendered server-side** as SVG, rather than being rendered in the final PDF generation browser. Benefits:
- More reliable, avoids CDN loading failure issues
- Can render multiple diagrams in parallel
- No need to wait for JavaScript execution during PDF generation

## Styling System

- Based on GitHub's Markdown style
- Uses CSS variables for theme switching support
- Print optimization (avoids page break truncation)
- Responsive design

## Extension Points

- `customCSS`: Add custom CSS
- `pdfOptions`: Customize PDF output options
- `Renderer`: Customize Markdown renderer

## Notes

- First run requires downloading Chromium (via Playwright)
- Mermaid diagram rendering requires internet connection (CDN loading)
- LaTeX formula rendering requires internet connection (CDN loading)
