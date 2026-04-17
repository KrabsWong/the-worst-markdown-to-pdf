import { chromium, Browser, Page } from 'playwright';
import { MarkdownToPDFOptions, PDFOptions } from './types';
import { parseMarkdown } from './markdown-parser';
import { generateHTMLTemplate } from './html-template';
import { prerenderMermaid, MermaidRenderer } from './mermaid-renderer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Markdown to PDF conversion engine
 */
export class MarkdownToPDFConverter {
  private browser: Browser | null = null;
  private mermaidRenderer: MermaidRenderer | null = null;

  /**
   * Initialize browser
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true
      });
    }
    // Initialize mermaid renderer
    if (!this.mermaidRenderer) {
      this.mermaidRenderer = new MermaidRenderer();
      await this.mermaidRenderer.initialize();
    }
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    if (this.mermaidRenderer) {
      await this.mermaidRenderer.close();
      this.mermaidRenderer = null;
    }
  }

  /**
   * Convert Markdown to PDF
   */
  async convert(options: MarkdownToPDFOptions): Promise<string> {
    let {
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

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Pre-render Mermaid diagrams on server side if enabled
    if (enableMermaid && this.mermaidRenderer) {
      content = await this.mermaidRenderer.renderAll(content);
    }

    // Parse Markdown
    const htmlContent = parseMarkdown(content);

    // Generate complete HTML
    const fullHTML = generateHTMLTemplate({
      title,
      content: htmlContent,
      enableMermaid,
      enableLatex,
      codeTheme,
      theme,
      customCSS
    });

    // Generate PDF
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
   * Wait for page resources to load
   */
  private async waitForResources(page: Page, waitForMermaid: boolean): Promise<void> {
    // Wait for KaTeX to render
    try {
      await page.waitForFunction(() => {
        return typeof (window as any).renderMathInElement !== 'undefined';
      }, { timeout: 10000 });
      
      // Wait for math formulas to render
      await page.waitForTimeout(1000);
    } catch (e) {
      // KaTeX not enabled or failed to load
    }

    // Note: Mermaid diagrams are pre-rendered on server side
    // They are already SVG when HTML is loaded, no need to wait
    if (waitForMermaid) {
      // Give a short delay for SVG to stabilize in the layout
      await page.waitForTimeout(500);
    }

    // Ensure all fonts and images are loaded
    await page.waitForLoadState('networkidle');
    
    // Additional wait to ensure rendering is complete
    await page.waitForTimeout(1000);
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
