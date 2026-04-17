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

  const mermaidScript = enableMermaid ? getMermaidScript() : '';
  const katexScript = enableLatex ? getKaTeXScript() : '';
  const katexCSS = enableLatex ? getKaTeXCSS() : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${katexCSS}
  <style>
    /* ===== 基础重置 ===== */
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
    
    /* ===== GitHub Markdown 样式 ===== */
    ${githubMarkdownCSS}
    
    /* ===== 自定义样式 ===== */
    ${customCSS}
    
    /* ===== 页面设置 ===== */
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
  ${mermaidScript}
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
 * 获取 Mermaid 脚本
 */
function getMermaidScript(): string {
  return `<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    
    // Mark mermaid as loading
    window.__mermaidReady = false;
    
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#e1f5fe',
        primaryTextColor: '#01579b',
        primaryBorderColor: '#0288d1',
        lineColor: '#0288d1',
        secondaryColor: '#fff3e0',
        tertiaryColor: '#f3e5f5'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        useMaxWidth: true,
        diagramMarginX: 50,
        diagramMarginY: 10
      },
      gantt: {
        useMaxWidth: true,
        leftPadding: 75,
        gridLineStartPadding: 35
      }
    });
    
    // Run mermaid and mark as ready when done
    async function renderMermaid() {
      try {
        await mermaid.run();
        
        // Ensure all Mermaid SVGs are properly styled
        document.querySelectorAll('.mermaid svg').forEach(svg => {
          svg.style.maxWidth = '100%';
          svg.style.height = 'auto';
          svg.setAttribute('width', '100%');
        });
        
        // Mark as ready
        window.__mermaidReady = true;
        console.log('Mermaid rendering complete');
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        window.__mermaidReady = true; // Mark as ready even on error
      }
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderMermaid);
    } else {
      renderMermaid();
    }
  </script>`;
}

/**
 * 转义 HTML 特殊字符
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
