import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { convertMarkdownToPDF, MarkdownToPDFConverter } from './pdf-engine';
import { PDFOptions } from './types';

const program = new Command();

program
  .name('md2pdf')
  .description('将 Markdown 文档转换为美观的 PDF，支持 GitHub 风格、Mermaid 图表和 LaTeX 公式')
  .version('1.0.0');

program
  .argument('<input>', '输入 Markdown 文件路径')
  .option('-o, --output <path>', '输出 PDF 文件路径')
  .option('-t, --title <title>', 'PDF 文档标题')
  .option('--no-mermaid', '禁用 Mermaid 图表渲染')
  .option('--no-latex', '禁用 LaTeX 公式渲染')
  .option('--theme <theme>', '文档主题 (github-light | github-dark)', 'github-light')
  .option('--code-theme <theme>', '代码高亮主题 (github | github-dark | atom-one-light | atom-one-dark | vs | vs2015)', 'github')
  .option('--format <format>', '页面格式 (A4 | Letter | Legal | A3 | A5)', 'A4')
  .option('--landscape', '横向页面')
  .option('--margin <margin>', '页边距 (例如: 20mm, 1in)', '20mm')
  .option('--margin-top <margin>', '上边距')
  .option('--margin-right <margin>', '右边距')
  .option('--margin-bottom <margin>', '下边距')
  .option('--margin-left <margin>', '左边距')
  .option('--css <path>', '自定义 CSS 文件路径')
  .option('--header', '显示页眉')
  .option('--footer', '显示页脚')
  .option('--timeout <ms>', '渲染超时时间（毫秒）', '30000')
  .action(async (input: string, options: any) => {
    try {
      // 检查输入文件是否存在
      if (!fs.existsSync(input)) {
        console.error(chalk.red(`错误: 文件不存在: ${input}`));
        process.exit(1);
      }

      // 确定输出路径
      const outputPath = options.output || input.replace(/\.md$/i, '.pdf');

      // 读取自定义 CSS
      let customCSS = '';
      if (options.css) {
        if (!fs.existsSync(options.css)) {
          console.error(chalk.red(`错误: CSS 文件不存在: ${options.css}`));
          process.exit(1);
        }
        customCSS = fs.readFileSync(options.css, 'utf-8');
      }

      // 构建 PDF 选项
      const pdfOptions: PDFOptions = {
        format: options.format,
        landscape: options.landscape || false,
        printBackground: true,
        margin: {
          top: options.marginTop || options.margin,
          right: options.marginRight || options.margin,
          bottom: options.marginBottom || options.margin,
          left: options.marginLeft || options.margin
        },
        displayHeaderFooter: options.header || options.footer || false,
        timeout: parseInt(options.timeout)
      };

      console.log(chalk.blue('正在转换...'));
      console.log(chalk.gray(`输入: ${path.resolve(input)}`));
      console.log(chalk.gray(`输出: ${path.resolve(outputPath)}`));

      const startTime = Date.now();

      await convertMarkdownToPDF(input, outputPath, {
        title: options.title,
        enableMermaid: options.mermaid,
        enableLatex: options.latex,
        pdfOptions,
        customCSS,
        codeTheme: options.codeTheme,
        theme: options.theme
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(chalk.green(`✓ 转换成功! (${duration}s)`));
      console.log(chalk.gray(`输出文件: ${path.resolve(outputPath)}`));

    } catch (error) {
      console.error(chalk.red('转换失败:'), error);
      process.exit(1);
    }
  });

program
  .command('batch')
  .description('批量转换多个 Markdown 文件')
  .argument('<pattern>', '文件匹配模式（如: docs/*.md）')
  .option('-o, --output-dir <dir>', '输出目录', './pdfs')
  .option('--no-mermaid', '禁用 Mermaid 图表渲染')
  .option('--no-latex', '禁用 LaTeX 公式渲染')
  .option('--theme <theme>', '文档主题', 'github-light')
  .action(async (pattern: string, options: any) => {
    try {
      const glob = require('glob');
      const files = glob.sync(pattern);

      if (files.length === 0) {
        console.log(chalk.yellow('未找到匹配的文件'));
        return;
      }

      console.log(chalk.blue(`找到 ${files.length} 个文件`));

      // 确保输出目录存在
      if (!fs.existsSync(options.outputDir)) {
        fs.mkdirSync(options.outputDir, { recursive: true });
      }

      const converter = new MarkdownToPDFConverter();
      await converter.initialize();

      let successCount = 0;
      let failCount = 0;

      for (const file of files) {
        try {
          const basename = path.basename(file, '.md');
          const outputPath = path.join(options.outputDir, `${basename}.pdf`);

          process.stdout.write(chalk.gray(`转换: ${file} ... `));

          await converter.convert({
            content: fs.readFileSync(file, 'utf-8'),
            outputPath,
            title: basename,
            enableMermaid: options.mermaid,
            enableLatex: options.latex,
            theme: options.theme
          });

          console.log(chalk.green('✓'));
          successCount++;
        } catch (error) {
          console.log(chalk.red('✗'));
          console.error(chalk.red(`  错误: ${error}`));
          failCount++;
        }
      }

      await converter.close();

      console.log(chalk.green(`\n完成: ${successCount} 成功, ${failCount} 失败`));

    } catch (error) {
      console.error(chalk.red('批量转换失败:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('创建配置文件模板')
  .option('-o, --output <path>', '配置文件路径', 'md2pdf.config.js')
  .action((options: any) => {
    const configContent = `module.exports = {
  // 默认标题
  title: 'Document',
  
  // 启用 Mermaid 图表
  enableMermaid: true,
  
  // 启用 LaTeX 公式
  enableLatex: true,
  
  // 文档主题: 'github-light' | 'github-dark'
  theme: 'github-light',
  
  // 代码高亮主题
  codeTheme: 'github',
  
  // PDF 选项
  pdfOptions: {
    format: 'A4',
    landscape: false,
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  },
  
  // 自定义 CSS
  customCSS: \`
    /* 在这里添加自定义样式 */
  \`
};
`;

    fs.writeFileSync(options.output, configContent);
    console.log(chalk.green(`配置文件已创建: ${options.output}`));
  });

program.parse();
