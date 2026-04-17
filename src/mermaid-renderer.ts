import { chromium, Browser } from 'playwright';

/**
 * Mermaid server-side renderer
 * Renders Mermaid diagrams to SVG in Node.js environment
 */

interface MermaidDiagram {
  id: string;
  code: string;
  originalHTML: string;
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
   * Extract all Mermaid code blocks from HTML
   */
  extractMermaidBlocksFromHTML(html: string): MermaidDiagram[] {
    const blocks: MermaidDiagram[] = [];
    // Match <pre><code class="language-mermaid">...</code></pre>
    const mermaidRegex = /<pre><code class="hljs language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
    let match;
    let index = 0;

    while ((match = mermaidRegex.exec(html)) !== null) {
      // Store the original HTML (with encoded entities) for replacement
      const originalHTML = match[0];

      // Decode HTML entities for rendering
      const code = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      blocks.push({
        id: `mermaid-${index++}`,
        code: code,
        originalHTML: originalHTML
      });
    }

    return blocks;
  }

  /**
   * Render a single Mermaid diagram
   */
  async renderDiagram(code: string): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      // Create a simple HTML page with Mermaid
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    .mermaid { text-align: center; }
  </style>
</head>
<body>
  <div class="mermaid"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    window.__svgContent = null;
    
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });
    
    async function render() {
      try {
        const graphDefinition = ${JSON.stringify(code)};
        const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), graphDefinition);
        window.__svgContent = svg;
      } catch (error) {
        console.error('Mermaid render error:', error);
        window.__svgContent = 'ERROR: ' + (error.message || 'Unknown error');
      }
    }
    
    setTimeout(render, 100);
  </script>
</body>
</html>`;

      await page.setContent(html, { waitUntil: 'networkidle' });
      
      // Wait for render to complete
      let attempts = 0;
      const maxAttempts = 50;
      
      while (attempts < maxAttempts) {
        const svg = await page.evaluate(() => {
          return (window as any).__svgContent;
        });
        
        if (svg !== null) {
          if (svg.startsWith('ERROR:')) {
            throw new Error(svg.substring(7));
          }
          return svg;
        }
        
        await page.waitForTimeout(100);
        attempts++;
      }
      
      throw new Error('Timeout waiting for Mermaid to render');
      
    } finally {
      await page.close();
    }
  }

  /**
   * Render all Mermaid diagrams in HTML and return updated HTML
   */
  async renderAllInHTML(html: string): Promise<string> {
    const blocks = this.extractMermaidBlocksFromHTML(html);

    if (blocks.length === 0) {
      return html;
    }

    console.log(`Found ${blocks.length} Mermaid diagram(s) to render...`);

    let result = html;

    // Process blocks from last to first to preserve string indices
    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      // Calculate display order (1-based, counting from first to last)
      const displayOrder = blocks.length - i;
      try {
        console.log(`  Rendering diagram ${displayOrder}/${blocks.length}...`);
        const svg = await this.renderDiagram(block.code);

        // Create SVG wrapper
        const svgWrapper = `<div class="mermaid-svg" style="text-align: center; margin: 24px 0; padding: 16px; background: #f6f8fa; border-radius: 6px; border: 1px solid #d0d7de;">${svg}</div>`;

        // Replace using the exact original HTML string
        // Use split/join to replace only the first occurrence from the end
        const lastIndex = result.lastIndexOf(block.originalHTML);
        if (lastIndex !== -1) {
          result = result.substring(0, lastIndex) + svgWrapper + result.substring(lastIndex + block.originalHTML.length);
        }

      } catch (error) {
        console.warn(`  Failed to render diagram ${displayOrder}: ${error}`);
        // Keep original block on error
      }
    }

    return result;
  }
}

/**
 * Convenience function: render Mermaid diagrams in HTML
 */
export async function renderMermaidInHTML(html: string): Promise<string> {
  const renderer = MermaidRenderer.getInstance();
  
  try {
    await renderer.initialize();
    return await renderer.renderAllInHTML(html);
  } finally {
    // Don't close browser here as it may be reused in batch conversions
  }
}

export async function closeMermaidRenderer(): Promise<void> {
  await MermaidRenderer.getInstance().close();
}
