import { chromium, Browser, Page } from 'playwright';
import { MarkdownToPDFOptions, PDFOptions } from './types';
import { parseMarkdown } from './markdown-parser';
import { generateHTMLTemplate } from './html-template';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Markdown 转 PDF 核心引擎
 */
export class MarkdownToPDFConverter {
  private browser: Browser | null = null;

  /**
   * 初始化浏览器
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true
      });
    }
  }

  /**
   * 关闭浏览器
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * 转换 Markdown 为 PDF
   */
  async convert(options: MarkdownToPDFOptions): Promise<string> {
    const {
      content,
      outputPath,
      title = 'Document',
      enableMermaid = true,
      enableLatex = true,
      pdfOptions = {},
      customCSS = '',
      codeTheme = 'github',
      theme = 'github-light'
    } = options;

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 解析 Markdown
    const htmlContent = parseMarkdown(content);

    // 生成完整 HTML
    const fullHTML = generateHTMLTemplate({
      title,
      content: htmlContent,
      enableMermaid,
      enableLatex,
      codeTheme,
      theme,
      customCSS
    });

    // 生成 PDF
    await this.generatePDF(fullHTML, outputPath, pdfOptions, enableMermaid);

    return outputPath;
  }

  /**
   * 生成 PDF
   */
  private async generatePDF(
    html: string, 
    outputPath: string, 
    pdfOptions: PDFOptions,
    waitForMermaid: boolean
  ): Promise<void> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();

    try {
      // 加载 HTML 内容
      await page.setContent(html, {
        waitUntil: 'networkidle'
      });

      // 等待资源加载
      await this.waitForResources(page, waitForMermaid);

      // 配置 PDF 选项
      const defaultPDFOptions: any = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        displayHeaderFooter: false,
        ...pdfOptions
      };

      // 生成 PDF
      await page.pdf({
        path: outputPath,
        ...defaultPDFOptions
      });

    } finally {
      await page.close();
    }
  }

  /**
   * 等待页面资源加载完成
   */
  private async waitForResources(page: Page, waitForMermaid: boolean): Promise<void> {
    // 等待 KaTeX 渲染
    try {
      await page.waitForFunction(() => {
        return typeof (window as any).renderMathInElement !== 'undefined';
      }, { timeout: 5000 });
      
      // 等待数学公式渲染
      await page.waitForTimeout(1000);
    } catch (e) {
      // KaTeX 未启用或加载失败
    }

    // 等待 Mermaid 渲染
    if (waitForMermaid) {
      try {
        await page.waitForFunction(() => {
          const mermaidElements = document.querySelectorAll('.mermaid');
          if (mermaidElements.length === 0) return true;
          
          // 检查是否所有 Mermaid 元素都已渲染为 SVG
          for (let i = 0; i < mermaidElements.length; i++) {
            if (!mermaidElements[i].querySelector('svg')) {
              return false;
            }
          }
          return true;
        }, { timeout: 30000 });
      } catch (e) {
        console.warn('Mermaid 图表渲染超时，继续生成 PDF');
      }
    }

    // 确保所有字体和图片加载完成
    await page.waitForLoadState('networkidle');
    
    // 额外等待确保渲染完成
    await page.waitForTimeout(2000);
  }

  /**
   * 批量转换
   */
  async convertBatch(
    items: Array<{ content: string; outputPath: string; title?: string }>,
    options: Omit<MarkdownToPDFOptions, 'content' | 'outputPath' | 'title'>
  ): Promise<string[]> {
    const results: string[] = [];
    
    for (const item of items) {
      const outputPath = await this.convert({
        ...options,
        content: item.content,
        outputPath: item.outputPath,
        title: item.title
      });
      results.push(outputPath);
    }
    
    return results;
  }
}

/**
   * 转换单个文件
   */
export async function convertMarkdownToPDF(
  markdownPath: string,
  outputPath?: string,
  options: Partial<Omit<MarkdownToPDFOptions, 'content' | 'outputPath'>> = {}
): Promise<string> {
  // 读取 Markdown 文件
  const content = fs.readFileSync(markdownPath, 'utf-8');
  
  // 确定输出路径
  const finalOutputPath = outputPath || markdownPath.replace(/\.md$/i, '.pdf');
  
  // 获取文件名作为标题
  const title = path.basename(markdownPath, '.md');
  
  // 创建转换器
  const converter = new MarkdownToPDFConverter();
  
  try {
    await converter.initialize();
    
    const result = await converter.convert({
      content,
      outputPath: finalOutputPath,
      title: options.title || title,
      enableMermaid: options.enableMermaid ?? true,
      enableLatex: options.enableLatex ?? true,
      pdfOptions: options.pdfOptions,
      customCSS: options.customCSS,
      codeTheme: options.codeTheme || 'github',
      theme: options.theme || 'github-light'
    });
    
    return result;
  } finally {
    await converter.close();
  }
}

/**
 * 转换 Markdown 文本
 */
export async function convertMarkdownTextToPDF(
  content: string,
  outputPath: string,
  options: Partial<Omit<MarkdownToPDFOptions, 'content' | 'outputPath'>> = {}
): Promise<string> {
  const converter = new MarkdownToPDFConverter();
  
  try {
    await converter.initialize();
    
    const result = await converter.convert({
      content,
      outputPath,
      title: options.title || 'Document',
      enableMermaid: options.enableMermaid ?? true,
      enableLatex: options.enableLatex ?? true,
      pdfOptions: options.pdfOptions,
      customCSS: options.customCSS,
      codeTheme: options.codeTheme || 'github',
      theme: options.theme || 'github-light'
    });
    
    return result;
  } finally {
    await converter.close();
  }
}
