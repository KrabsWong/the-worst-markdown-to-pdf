import { MarkedOptions } from 'marked';

export interface PDFOptions {
  /** 页面大小 */
  format?: 'A4' | 'Letter' | 'Legal' | 'Tabloid' | 'A3' | 'A5';
  /** 页面方向 */
  landscape?: boolean;
  /** 页边距 */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /** 是否显示页眉 */
  displayHeaderFooter?: boolean;
  /** 页眉模板 */
  headerTemplate?: string;
  /** 页脚模板 */
  footerTemplate?: string;
  /** 打印背景 */
  printBackground?: boolean;
  /** 页面超时时间（毫秒） */
  timeout?: number;
}

export interface MarkdownToPDFOptions {
  /** Markdown 内容 */
  content: string;
  /** 输出 PDF 路径 */
  outputPath: string;
  /** 标题 */
  title?: string;
  /** 是否启用 Mermaid */
  enableMermaid?: boolean;
  /** 是否启用 LaTeX */
  enableLatex?: boolean;
  /** PDF 选项 */
  pdfOptions?: PDFOptions;
  /** 自定义 CSS */
  customCSS?: string;
  /** 代码主题 */
  codeTheme?: 'github' | 'github-dark' | 'atom-one-light' | 'atom-one-dark' | 'vs' | 'vs2015';
  /** 文档主题 */
  theme?: 'github-light' | 'github-dark';
}

export interface HTMLTemplateOptions {
  title: string;
  content: string;
  enableMermaid: boolean;
  enableLatex: boolean;
  codeTheme: string;
  theme: 'github-light' | 'github-dark';
  customCSS?: string;
}
