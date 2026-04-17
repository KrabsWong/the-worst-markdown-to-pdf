import { chromium, Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Mermaid 服务端渲染器
 * 在 Node.js 环境中预渲染 Mermaid 图表为 SVG
 */

interface MermaidDiagram {
  id: string;
  code: string;
}

export class MermaidRenderer {
  private browser: Browser | null = null;
  private static instance: MermaidRenderer | null = null;

  static getInstance(): MermaidRenderer {
    if (!MermaidRenderer.instance) {
      MermaidRenderer.instance = new MermaidRenderer();
    }
    return MermaidRenderer.instance;
  }

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true
      });
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * 提取所有 Mermaid 代码块
   */
  extractMermaidBlocks(content: string): MermaidDiagram[] {
    const blocks: MermaidDiagram[] = [];
    // 匹配 ```mermaid ... ``` 代码块
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let index = 0;
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      blocks.push({
        id: `mermaid-${index++}`,
        code: match[1].trim()
      });
    }
    
    return blocks;
  }

  /**
   * 渲染单个 Mermaid 图表
   */
  async renderDiagram(code: string): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      // 创建包含 Mermaid 的简单 HTML 页面
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 20px; }
    .mermaid { text-align: center; }
  </style>
</head>
<body>
  <div class="mermaid">${this.escapeHtml(code)}</div>
  
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    
    window.__svgContent = null;
    
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default'
    });
    
    async function render() {
      try {
        const element = document.querySelector('.mermaid');
        if (element) {
          const { svg } = await mermaid.render('mermaid-svg', element.textContent);
          window.__svgContent = svg;
        }
      } catch (error) {
        console.error('Render error:', error);
        window.__svgContent = 'ERROR: ' + error.message;
      }
    }
    
    render();
  </script>
</body>
</html>`;

      await page.setContent(html, { waitUntil: 'networkidle' });
      
      // 等待渲染完成
      await page.waitForFunction(() => {
        return (window as any).__svgContent !== null;
      }, { timeout: 30000 });
      
      // 获取 SVG 内容
      const svg = await page.evaluate(() => {
        return (window as any).__svgContent;
      });
      
      if (svg && svg.startsWith('ERROR:')) {
        throw new Error(svg.substring(7));
      }
      
      return svg || '';
      
    } finally {
      await page.close();
    }
  }

  /**
   * 批量渲染所有 Mermaid 图表
   */
  async renderAll(content: string): Promise<string> {
    const blocks = this.extractMermaidBlocks(content);
    
    if (blocks.length === 0) {
      return content;
    }

    console.log(`Found ${blocks.length} Mermaid diagram(s) to render...`);
    
    let result = content;
    
    for (const block of blocks) {
      try {
        console.log(`  Rendering diagram ${parseInt(block.id.split('-')[1]) + 1}/${blocks.length}...`);
        const svg = await this.renderDiagram(block.code);
        
        // 替换原始代码块为 SVG
        const originalBlock = '```mermaid\n' + block.code + '```';
        const svgWrapper = `<div class="mermaid-svg">${svg}</div>`;
        
        result = result.replace(originalBlock, svgWrapper);
        
      } catch (error) {
        console.warn(`  Failed to render diagram: ${error}`);
        // 保留原始代码块
      }
    }
    
    return result;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

/**
 * 便捷函数：预渲染 Markdown 中的 Mermaid 图表
 */
export async function prerenderMermaid(content: string): Promise<string> {
  const renderer = MermaidRenderer.getInstance();
  
  try {
    await renderer.initialize();
    return await renderer.renderAll(content);
  } finally {
    // 不在这里关闭 browser，因为可能在批量转换中复用
  }
}

export async function closeMermaidRenderer(): Promise<void> {
  await MermaidRenderer.getInstance().close();
}
