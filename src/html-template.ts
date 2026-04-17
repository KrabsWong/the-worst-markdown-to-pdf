import { HTMLTemplateOptions } from './types';
import { githubMarkdownCSS } from './styles/github-markdown';

/**
 * 生成完整的 HTML 模板
 */
export function generateHTMLTemplate(options: HTMLTemplateOptions): string {
  const {
    title,
    content,
    enableMermaid,
    enableLatex,
    codeTheme,
    theme,
    customCSS = ''
  } = options;

  const katexScript = enableLatex ? getKaTeXScript() : '';
  const katexCSS = enableLatex ? getKaTeXCSS() : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${katexCSS}
  <style>
    /* ===== Base Reset ===== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #24292f;
      background-color: #ffffff;
    }
    
    /* ===== GitHub Markdown Styles ===== */
    ${githubMarkdownCSS}
    
    /* ===== Mermaid SVG Styles ===== */
    .mermaid-svg {
      text-align: center;
      margin: 24px 0;
      padding: 16px;
      background: var(--color-canvas-subtle, #f6f8fa);
      border-radius: 6px;
      border: 1px solid var(--color-border-default, #d0d7de);
    }
    
    .mermaid-svg svg {
      max-width: 100%;
      height: auto;
      display: inline-block;
    }
    
    /* ===== Custom Styles ===== */
    ${customCSS}
    
    /* ===== Page Settings ===== */
    @page {
      size: A4;
      margin: 25mm 20mm 25mm 20mm;
    }
    
    @page :first {
      margin-top: 20mm;
    }
  </style>
</head>
<body>
  <article class="markdown-body" data-theme="${theme}">
    ${content}
  </article>
  
  ${katexScript}
</body>
</html>`;
}

/**
 * 获取 KaTeX CSS
 */
function getKaTeXCSS(): string {
  return `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" 
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" 
          crossorigin="anonymous">`;
}

/**
 * 获取 KaTeX 脚本
 */
function getKaTeXScript(): string {
  return `<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" 
          integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" 
          crossorigin="anonymous"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" 
          integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" 
          crossorigin="anonymous"
          onload="renderMathInElement(document.body, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\\\[', right: '\\\\]', display: true},
              {left: '\\\\(', right: '\\\\)', display: false}
            ],
            throwOnError: false,
            errorColor: '#cc0000',
            strict: false
          });"></script>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
