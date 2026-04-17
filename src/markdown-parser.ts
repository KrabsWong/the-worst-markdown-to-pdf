import { marked, MarkedOptions, Tokens, Renderer, Token } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

/**
 * Markdown 解析器配置
 * 严格遵循 GitHub Markdown 规范
 */

// 自定义渲染器
class GitHubRenderer extends Renderer {
  // 代码块处理 - 支持 Mermaid 和代码高亮
  code(code: string, infostring: string | undefined, escaped: boolean): string {
    const lang = (infostring || '').trim();
    
    // 处理 Mermaid 图表 (服务端预渲染后的 SVG 包装)
    if (lang === 'mermaid-svg') {
      return code; // 已经是渲染好的 SVG，直接返回
    }
    
    // 处理普通代码块
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(code, { language: lang }).value;
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
      } catch (e) {
        // 高亮失败，返回普通代码
      }
    }
    
    const escapedCode = escaped ? code : escapeHtml(code);
    const className = lang ? ` class="hljs language-${lang}"` : ' class="hljs"';
    return `<pre><code${className}>${escapedCode}</code></pre>`;
  }

  // 内联代码
  codespan(code: string): string {
    return `<code>${escapeHtml(code)}</code>`;
  }

  // 任务列表项
  listitem(text: string, task: boolean, checked: boolean): string {
    if (task) {
      const checkbox = `<input type="checkbox" ${checked ? 'checked' : ''} disabled>`;
      return `<li class="task-list-item">${checkbox} ${text}</li>`;
    }
    return `<li>${text}</li>`;
  }

  // 列表
  list(body: string, ordered: boolean, start: number | ''): string {
    const type = ordered ? 'ol' : 'ul';
    const startAttr = (ordered && start !== 1 && start !== '') ? ` start="${start}"` : '';
    const taskListClass = body.includes('task-list-item') ? ' contains-task-list' : '';
    return `<${type}${startAttr} class="${taskListClass}">${body}</${type}>`;
  }

  // 表格
  table(header: string, body: string): string {
    return `<table class="">\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>`;
  }

  // 引用块
  blockquote(quote: string): string {
    return `<blockquote>\n${quote}</blockquote>\n`;
  }

  // 段落
  paragraph(text: string): string {
    return `<p>${text}</p>\n`;
  }

  // 标题
  heading(text: string, level: number, raw: string): string {
    const id = generateId(raw);
    const anchor = `<a class="anchor" href="#${id}" aria-hidden="true">#</a>`;
    return `<h${level} id="${id}">${anchor}${text}</h${level}>\n`;
  }

  // 链接
  link(href: string, title: string | null | undefined, text: string): string {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  }

  // 图片
  image(href: string, title: string | null | undefined, text: string): string {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<img src="${href}" alt="${text}"${titleAttr}>`;
  }

  // 水平线
  hr(): string {
    return `<hr>\n`;
  }

  // 强调
  strong(text: string): string {
    return `<strong>${text}</strong>`;
  }

  // 斜体
  em(text: string): string {
    return `<em>${text}</em>`;
  }

  // 删除线
  del(text: string): string {
    return `<del>${text}</del>`;
  }

  // 换行
  br(): string {
    return `<br>`;
  }

  // 文本
  text(text: string): string {
    return text;
  }
}

/**
 * 生成标题 ID
 */
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
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

/**
 * 处理 GitHub 警告框语法
 * > [!NOTE]
 * > [!TIP]
 * > [!IMPORTANT]
 * > [!WARNING]
 * > [!CAUTION]
 */
function processAlerts(content: string): string {
  const alertTypes = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];
  
  let result = content;
  alertTypes.forEach(type => {
    const regex = new RegExp(`^> \\[!${type}\\]\\s*$`, 'gmi');
    result = result.replace(regex, `> **${type}**`);
  });
  
  return result;
}

/**
 * 处理 LaTeX 公式
 * 支持行内公式 $...$ 和块级公式 $$...$$
 */
function processLatex(content: string): string {
  // 块级公式 $$...$$
  content = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    const escaped = escapeHtml(formula.trim());
    return `<div class="katex-display">\\[${escaped}\\]</div>`;
  });
  
  // 行内公式 $...$
  content = content.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (match, formula) => {
    const escaped = escapeHtml(formula.trim());
    return `\\(${escaped}\\)`;
  });
  
  return content;
}

/**
 * 创建 marked 实例
 */
export function createMarkedInstance(): typeof marked {
  const renderer = new GitHubRenderer();
  
  marked.use({
    renderer: renderer as any,
    gfm: true,
    breaks: false,
    pedantic: false
  });
  
  // 使用 marked-highlight 进行代码高亮
  marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  }));
  
  return marked;
}

/**
 * 解析 Markdown 内容
 */
export function parseMarkdown(content: string): string {
  // 预处理
  let processed = content;
  
  // 处理警告框
  processed = processAlerts(processed);
  
  // 处理 LaTeX（在 Markdown 解析之前处理）
  processed = processLatex(processed);
  
  // 创建解析器实例并解析
  const md = createMarkedInstance();
  return md.parse(processed) as string;
}

export { hljs };
