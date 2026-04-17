/**
 * GitHub Markdown 风格 CSS
 * 严格遵循 GitHub 的渲染效果
 */

export const githubMarkdownCSS = `
/* ===== 基础重置和变量 ===== */
.markdown-body {
  --color-canvas-default: #ffffff;
  --color-canvas-subtle: #f6f8fa;
  --color-border-default: #d0d7de;
  --color-border-muted: #d8dee4;
  --color-neutral-muted: rgba(175, 184, 193, 0.2);
  --color-accent-fg: #0969da;
  --color-accent-emphasis: #0969da;
  --color-danger-fg: #cf222e;
  --color-fg-default: #24292f;
  --color-fg-muted: #57606a;
  --color-fg-subtle: #6e7781;
  --color-header-bg: #f6f8fa;
  --color-header-border: #d0d7de;
  --color-blockquote-border: #d0d7de;
  --color-blockquote-bg: #f6f8fa;
  --color-code-bg: rgba(175, 184, 193, 0.2);
  --color-pre-bg: #f6f8fa;
  --color-table-border: #d0d7de;
  --color-table-header-bg: #f6f8fa;
  --color-table-row-alt-bg: #f6f8fa;
  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-default);
  word-wrap: break-word;
  max-width: none;
  margin: 0 auto;
  padding: 32px;
}

/* ===== 排版 ===== */
.markdown-body * {
  box-sizing: border-box;
}

.markdown-body > *:first-child {
  margin-top: 0 !important;
}

.markdown-body > *:last-child {
  margin-bottom: 0 !important;
}

.markdown-body p,
.markdown-body blockquote,
.markdown-body ul,
.markdown-body ol,
.markdown-body dl,
.markdown-body table,
.markdown-body pre,
.markdown-body details {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body hr {
  height: 4px;
  padding: 0;
  margin: 24px 0;
  background-color: var(--color-border-default);
  border: 0;
}

/* ===== 标题 ===== */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-fg-default);
}

.markdown-body h1 {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--color-border-muted);
}

.markdown-body h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--color-border-muted);
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  font-size: 0.85em;
  color: var(--color-fg-muted);
}

.markdown-body h1 .anchor,
.markdown-body h2 .anchor,
.markdown-body h3 .anchor,
.markdown-body h4 .anchor,
.markdown-body h5 .anchor,
.markdown-body h6 .anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
  text-decoration: none;
  color: var(--color-fg-subtle);
}

.markdown-body h1:hover .anchor,
.markdown-body h2:hover .anchor,
.markdown-body h3:hover .anchor,
.markdown-body h4:hover .anchor,
.markdown-body h5:hover .anchor,
.markdown-body h6:hover .anchor {
  text-decoration: none;
}

/* ===== 段落和文本 ===== */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body a {
  color: var(--color-accent-fg);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

.markdown-body del {
  text-decoration: line-through;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: var(--color-canvas-default);
  border-style: none;
}

.markdown-body img[align=right] {
  padding-left: 20px;
}

.markdown-body img[align=left] {
  padding-right: 20px;
}

.markdown-body svg {
  max-width: 100%;
  height: auto;
}

/* ===== 引用块 ===== */
.markdown-body blockquote {
  margin: 0 0 16px 0;
  padding: 0 1em;
  color: var(--color-fg-muted);
  border-left: 0.25em solid var(--color-border-default);
  background: transparent;
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

.markdown-body blockquote blockquote {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 1em;
}

/* ===== 列表 ===== */
.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-body ul ul,
.markdown-body ul ol,
.markdown-body ol ol,
.markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li {
  margin: 0.25em 0;
}

.markdown-body li > p {
  margin-top: 16px;
}

.markdown-body li + li {
  margin-top: 0.25em;
}

.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-body dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

.markdown-body ul {
  list-style-type: disc;
}

.markdown-body ul ul {
  list-style-type: circle;
}

.markdown-body ul ul ul {
  list-style-type: square;
}

.markdown-body ol {
  list-style-type: decimal;
}

/* ===== 任务列表 ===== */
.markdown-body ul.contains-task-list {
  list-style-type: none;
  padding-left: 0;
}

.markdown-body li.task-list-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.markdown-body input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  margin: 3px 0 0 0;
  border: 2px solid var(--color-border-default);
  border-radius: 2px;
  background-color: var(--color-canvas-default);
  cursor: default;
  flex-shrink: 0;
}

.markdown-body input[type="checkbox"]:checked {
  background-color: var(--color-accent-emphasis);
  border-color: var(--color-accent-emphasis);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath fill-rule='evenodd' d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 12px;
}

/* ===== 代码 ===== */
.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  background-color: var(--color-neutral-muted);
  border-radius: 6px;
  color: var(--color-fg-default);
}

.markdown-body code br,
.markdown-body tt br {
  display: none;
}

.markdown-body pre {
  word-wrap: normal;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--color-pre-bg);
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid var(--color-border-muted);
}

.markdown-body pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
  font-size: 100%;
  color: inherit;
}

.markdown-body pre > code {
  display: block;
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body .highlight {
  margin-bottom: 16px;
}

.markdown-body .highlight pre {
  margin-bottom: 0;
  word-break: normal;
}

.markdown-body .highlight pre,
.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--color-pre-bg);
  border-radius: 6px;
}

.markdown-body pre code,
.markdown-body pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

/* ===== 代码高亮 - GitHub Light Theme ===== */
.markdown-body .hljs {
  display: block;
  overflow-x: auto;
  padding: 0;
  background: transparent;
  color: #24292f;
}

.markdown-body .hljs-comment,
.markdown-body .hljs-quote {
  color: #6e7781;
  font-style: italic;
}

.markdown-body .hljs-keyword,
.markdown-body .hljs-selector-tag,
.markdown-body .hljs-subst {
  color: #cf222e;
}

.markdown-body .hljs-number,
.markdown-body .hljs-literal,
.markdown-body .hljs-variable,
.markdown-body .hljs-template-variable,
.markdown-body .hljs-tag .hljs-attr {
  color: #0550ae;
}

.markdown-body .hljs-string,
.markdown-body .hljs-doctag {
  color: #0a3069;
}

.markdown-body .hljs-title,
.markdown-body .hljs-section,
.markdown-body .hljs-selector-id {
  color: #953800;
  font-weight: 600;
}

.markdown-body .hljs-subst {
  font-weight: normal;
}

.markdown-body .hljs-type,
.markdown-body .hljs-class .hljs-title {
  color: #953800;
  font-weight: 600;
}

.markdown-body .hljs-tag,
.markdown-body .hljs-name,
.markdown-body .hljs-attribute {
  color: #116329;
  font-weight: normal;
}

.markdown-body .hljs-regexp,
.markdown-body .hljs-link {
  color: #0a3069;
}

.markdown-body .hljs-symbol,
.markdown-body .hljs-bullet {
  color: #953800;
}

.markdown-body .hljs-built_in,
.markdown-body .hljs-builtin-name {
  color: #8250df;
}

.markdown-body .hljs-meta {
  color: #6e7781;
  font-weight: 600;
}

.markdown-body .hljs-deletion {
  background: #ffebe9;
  color: #82071e;
}

.markdown-body .hljs-addition {
  background: #dafbe1;
  color: #116329;
}

.markdown-body .hljs-emphasis {
  font-style: italic;
}

.markdown-body .hljs-strong {
  font-weight: 600;
}

/* ===== 表格 ===== */
.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  display: table;
  width: 100%;
  max-width: 100%;
  margin-bottom: 16px;
  table-layout: auto;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid var(--color-table-border);
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 300px;
  hyphens: auto;
}

.markdown-body table th {
  font-weight: 600;
  background-color: var(--color-table-header-bg);
}

.markdown-body table tr {
  background-color: var(--color-canvas-default);
  border-top: 1px solid var(--color-border-muted);
}

.markdown-body table tr:nth-child(2n) {
  background-color: var(--color-table-row-alt-bg);
}

.markdown-body table img {
  background-color: transparent;
}

/* 表格容器，用于处理超宽表格 */
.markdown-body .table-container {
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: 16px;
}

.markdown-body .table-container table {
  margin-bottom: 0;
}

/* ===== 水平线 ===== */
.markdown-body hr {
  height: 2px;
  padding: 0;
  margin: 24px 0;
  background-color: var(--color-border-default);
  border: 0;
}

/* ===== 脚注 ===== */
.markdown-body .footnote-ref {
  font-size: 0.75em;
  vertical-align: super;
}

.markdown-body .footnotes {
  font-size: 0.85em;
  color: var(--color-fg-muted);
  border-top: 1px solid var(--color-border-default);
  margin-top: 24px;
  padding-top: 16px;
}

.markdown-body .footnotes ol {
  padding-left: 20px;
}

.markdown-body .footnotes li {
  margin-bottom: 8px;
}

.markdown-body .footnotes li:target {
  background-color: var(--color-accent-muted);
}

.markdown-body .footnote-backref {
  text-decoration: none;
}

/* ===== 定义列表 ===== */
.markdown-body dd {
  margin-left: 0;
  padding-left: 1em;
}

.markdown-body dt {
  font-weight: 600;
  margin-top: 16px;
}

/* ===== 键盘快捷键 ===== */
.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  line-height: 10px;
  color: var(--color-fg-default);
  vertical-align: middle;
  background-color: var(--color-canvas-subtle);
  border: 1px solid var(--color-neutral-muted);
  border-bottom-color: var(--color-border-default);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 var(--color-border-default);
}

/* ===== 上标和下标 ===== */
.markdown-body sup,
.markdown-body sub {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

.markdown-body sup {
  top: -0.5em;
}

.markdown-body sub {
  bottom: -0.25em;
}

/* ===== 警告/注意框 ===== */
.markdown-body .alert {
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid;
  border-radius: 6px;
}

.markdown-body .alert-note {
  background-color: #ddf4ff;
  border-color: #54aeff;
  color: #24292f;
}

.markdown-body .alert-tip {
  background-color: #dafbe1;
  border-color: #4ac26b;
  color: #24292f;
}

.markdown-body .alert-important {
  background-color: #fbefff;
  border-color: #c297ff;
  color: #24292f;
}

.markdown-body .alert-warning {
  background-color: #fff8c5;
  border-color: #d4a72c;
  color: #24292f;
}

.markdown-body .alert-caution {
  background-color: #ffebe9;
  border-color: #ff8182;
  color: #24292f;
}

.markdown-body .alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 8px;
}

.markdown-body .alert p:last-child {
  margin-bottom: 0;
}

/* ===== Mermaid 图表 ===== */
.markdown-body .mermaid {
  text-align: center;
  margin: 24px 0;
  padding: 16px;
  background: var(--color-canvas-subtle);
  border-radius: 6px;
  border: 1px solid var(--color-border-default);
}

.markdown-body .mermaid svg {
  max-width: 100%;
  height: auto;
  display: inline-block;
}

/* ===== LaTeX 数学公式 ===== */
.markdown-body .katex {
  font-size: 1em;
}

.markdown-body .katex-display {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5em 0;
}

.markdown-body .katex-display > .katex {
  display: inline-block;
  white-space: nowrap;
  max-width: 100%;
}

.markdown-body .katex-display > .katex > .katex-html {
  display: block;
  position: relative;
}

.markdown-body .katex-html {
  overflow-x: auto;
  overflow-y: hidden;
}

.markdown-body .katex-error {
  color: var(--color-danger-fg);
  background-color: var(--color-danger-subtle);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

/* ===== 打印优化 ===== */
@media print {
  .markdown-body {
    padding: 0;
    font-size: 11pt;
    line-height: 1.5;
  }
  
  .markdown-body pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  .markdown-body h1,
  .markdown-body h2 {
    page-break-after: avoid;
  }
  
  .markdown-body pre,
  .markdown-body blockquote {
    page-break-inside: avoid;
  }
  
  /* Table print optimizations */
  .markdown-body table {
    page-break-inside: auto;
    font-size: 10pt;
    width: 100%;
    max-width: 100%;
  }
  
  .markdown-body table thead {
    display: table-header-group;
  }
  
  .markdown-body table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  
  .markdown-body table td,
  .markdown-body table th {
    page-break-inside: avoid;
    max-width: none;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .markdown-body a {
    text-decoration: underline;
    color: #000;
  }
  
  .markdown-body a[href]:after {
    content: " (" attr(href) ")";
    font-size: 90%;
    opacity: 0.8;
  }
  
  .markdown-body a[href^="#"]:after {
    content: "";
  }
}

/* ===== 暗色主题 ===== */
.markdown-body[data-theme="dark"] {
  --color-canvas-default: #0d1117;
  --color-canvas-subtle: #161b22;
  --color-border-default: #30363d;
  --color-border-muted: #21262d;
  --color-neutral-muted: rgba(110, 118, 129, 0.4);
  --color-accent-fg: #58a6ff;
  --color-accent-emphasis: #1f6feb;
  --color-danger-fg: #f85149;
  --color-fg-default: #c9d1d9;
  --color-fg-muted: #8b949e;
  --color-fg-subtle: #6e7681;
  --color-header-bg: #161b22;
  --color-header-border: #30363d;
  --color-blockquote-border: #3b434b;
  --color-blockquote-bg: #161b22;
  --color-code-bg: rgba(110, 118, 129, 0.4);
  --color-pre-bg: #161b22;
  --color-table-border: #30363d;
  --color-table-header-bg: #161b22;
  --color-table-row-alt-bg: #161b22;
  
  background-color: var(--color-canvas-default);
  color: var(--color-fg-default);
}

.markdown-body[data-theme="dark"] .hljs {
  color: #c9d1d9;
}

.markdown-body[data-theme="dark"] .hljs-comment,
.markdown-body[data-theme="dark"] .hljs-quote {
  color: #8b949e;
}

.markdown-body[data-theme="dark"] .hljs-keyword,
.markdown-body[data-theme="dark"] .hljs-selector-tag,
.markdown-body[data-theme="dark"] .hljs-subst {
  color: #ff7b72;
}

.markdown-body[data-theme="dark"] .hljs-number,
.markdown-body[data-theme="dark"] .hljs-literal,
.markdown-body[data-theme="dark"] .hljs-variable,
.markdown-body[data-theme="dark"] .hljs-template-variable,
.markdown-body[data-theme="dark"] .hljs-tag .hljs-attr {
  color: #79c0ff;
}

.markdown-body[data-theme="dark"] .hljs-string,
.markdown-body[data-theme="dark"] .hljs-doctag {
  color: #a5d6ff;
}

.markdown-body[data-theme="dark"] .hljs-title,
.markdown-body[data-theme="dark"] .hljs-section,
.markdown-body[data-theme="dark"] .hljs-selector-id {
  color: #ffa657;
}

.markdown-body[data-theme="dark"] .hljs-type,
.markdown-body[data-theme="dark"] .hljs-class .hljs-title {
  color: #ffa657;
}

.markdown-body[data-theme="dark"] .hljs-tag,
.markdown-body[data-theme="dark"] .hljs-name,
.markdown-body[data-theme="dark"] .hljs-attribute {
  color: #7ee787;
}

.markdown-body[data-theme="dark"] .hljs-regexp,
.markdown-body[data-theme="dark"] .hljs-link {
  color: #a5d6ff;
}

.markdown-body[data-theme="dark"] .hljs-symbol,
.markdown-body[data-theme="dark"] .hljs-bullet {
  color: #ffa657;
}

.markdown-body[data-theme="dark"] .hljs-built_in,
.markdown-body[data-theme="dark"] .hljs-builtin-name {
  color: #d2a8ff;
}

.markdown-body[data-theme="dark"] .hljs-meta {
  color: #8b949e;
}

.markdown-body[data-theme="dark"] .hljs-deletion {
  background: #490202;
  color: #ffdcd7;
}

.markdown-body[data-theme="dark"] .hljs-addition {
  background: #12261e;
  color: #aff5b4;
}

/* ===== 暗色主题警告框 ===== */
.markdown-body[data-theme="dark"] .alert-note {
  background-color: #0d1b2a;
  border-color: #1f6feb;
}

.markdown-body[data-theme="dark"] .alert-tip {
  background-color: #0d2317;
  border-color: #238636;
}

.markdown-body[data-theme="dark"] .alert-important {
  background-color: #1f102e;
  border-color: #8957e5;
}

.markdown-body[data-theme="dark"] .alert-warning {
  background-color: #2a220b;
  border-color: #9e6a03;
}

.markdown-body[data-theme="dark"] .alert-caution {
  background-color: #2a0d0d;
  border-color: #da3633;
}
`;

export default githubMarkdownCSS;
