import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { convertMarkdownToPDF, MarkdownToPDFConverter } from './pdf-engine';
import { PDFOptions } from './types';

const program = new Command();

program
  .name('md2pdf')
  .description('Convert Markdown documents to beautifully styled PDFs with GitHub-style rendering, Mermaid diagrams, and LaTeX support')
  .version('1.0.0');

program
  .argument('<input>', 'Input Markdown file path')
  .option('-o, --output <path>', 'Output PDF file path')
  .option('-t, --title <title>', 'PDF document title')
  .option('--no-mermaid', 'Disable Mermaid diagram rendering')
  .option('--no-latex', 'Disable LaTeX formula rendering')
  .option('--theme <theme>', 'Document theme (github-light | github-dark)', 'github-light')
  .option('--code-theme <theme>', 'Code highlighting theme (github | github-dark | atom-one-light | atom-one-dark | vs | vs2015)', 'github')
  .option('--format <format>', 'Page format (A4 | Letter | Legal | A3 | A5)', 'A4')
  .option('--landscape', 'Landscape orientation')
  .option('--margin <margin>', 'Page margins (e.g., 20mm, 1in)', '20mm')
  .option('--margin-top <margin>', 'Top margin')
  .option('--margin-right <margin>', 'Right margin')
  .option('--margin-bottom <margin>', 'Bottom margin')
  .option('--margin-left <margin>', 'Left margin')
  .option('--css <path>', 'Custom CSS file path')
  .option('--header', 'Display header')
  .option('--footer', 'Display footer')
  .option('--timeout <ms>', 'Rendering timeout in milliseconds', '30000')
  .action(async (input: string, options: any) => {
    try {
      // Check if input file exists
      if (!fs.existsSync(input)) {
        console.error(chalk.red(`Error: File not found: ${input}`));
        process.exit(1);
      }

      // Determine output path
      const outputPath = options.output || input.replace(/\.md$/i, '.pdf');

      // Read custom CSS
      let customCSS = '';
      if (options.css) {
        if (!fs.existsSync(options.css)) {
          console.error(chalk.red(`Error: CSS file not found: ${options.css}`));
          process.exit(1);
        }
        customCSS = fs.readFileSync(options.css, 'utf-8');
      }

      // Build PDF options
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

      console.log(chalk.blue('Converting...'));
      console.log(chalk.gray(`Input: ${path.resolve(input)}`));
      console.log(chalk.gray(`Output: ${path.resolve(outputPath)}`));

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

      console.log(chalk.green(`Conversion successful! (${duration}s)`));
      console.log(chalk.gray(`Output file: ${path.resolve(outputPath)}`));

    } catch (error) {
      console.error(chalk.red('Conversion failed:'), error);
      process.exit(1);
    }
  });

program
  .command('batch')
  .description('Batch convert multiple Markdown files')
  .argument('<pattern>', 'File pattern (e.g., docs/*.md)')
  .option('-o, --output-dir <dir>', 'Output directory', './pdfs')
  .option('--no-mermaid', 'Disable Mermaid diagram rendering')
  .option('--no-latex', 'Disable LaTeX formula rendering')
  .option('--theme <theme>', 'Document theme', 'github-light')
  .action(async (pattern: string, options: any) => {
    try {
      const glob = require('glob');
      const files = glob.sync(pattern);

      if (files.length === 0) {
        console.log(chalk.yellow('No matching files found'));
        return;
      }

      console.log(chalk.blue(`Found ${files.length} files`));

      // Ensure output directory exists
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

          process.stdout.write(chalk.gray(`Converting: ${file} ... `));

          await converter.convert({
            content: fs.readFileSync(file, 'utf-8'),
            outputPath,
            title: basename,
            enableMermaid: options.mermaid,
            enableLatex: options.latex,
            theme: options.theme
          });

          console.log(chalk.green('OK'));
          successCount++;
        } catch (error) {
          console.log(chalk.red('FAILED'));
          console.error(chalk.red(`  Error: ${error}`));
          failCount++;
        }
      }

      await converter.close();

      console.log(chalk.green(`\nComplete: ${successCount} succeeded, ${failCount} failed`));

    } catch (error) {
      console.error(chalk.red('Batch conversion failed:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Create a configuration file template')
  .option('-o, --output <path>', 'Configuration file path', 'md2pdf.config.js')
  .action((options: any) => {
    const configContent = `module.exports = {
  // Default title
  title: 'Document',
  
  // Enable Mermaid diagrams
  enableMermaid: true,
  
  // Enable LaTeX formulas
  enableLatex: true,
  
  // Document theme: 'github-light' | 'github-dark'
  theme: 'github-light',
  
  // Code highlighting theme
  codeTheme: 'github',
  
  // PDF options
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
  
  // Custom CSS
  customCSS: \`
    /* Add custom styles here */
  \`
};
`;

    fs.writeFileSync(options.output, configContent);
    console.log(chalk.green(`Configuration file created: ${options.output}`));
  });

program.parse();
