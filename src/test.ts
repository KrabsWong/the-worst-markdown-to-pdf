import { convertMarkdownToPDF } from './index';
import * as fs from 'fs';
import * as path from 'path';

async function test() {
  console.log('测试 Markdown to PDF 转换...\n');
  
  try {
    // 确保示例目录存在
    const exampleDir = path.join(__dirname, 'examples');
    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true });
    }
    
    // 创建一个简单的测试文档
    const testContent = `# Markdown to PDF 测试

## 基础语法

这是**粗体**，这是*斜体*，这是~~删除线~~。

### 代码示例

\`\`\`typescript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 列表

- 项目 1
- 项目 2
  - 子项目 2.1
- 项目 3

### 任务列表

- [x] 已完成
- [ ] 未完成

### 表格

| 名称 | 值 |
|------|-----|
| A    | 1   |
| B    | 2   |

### LaTeX 公式

行内公式: $E = mc^2$

块级公式:

$$
\\int_{0}^{\\infty} e^{-x} dx = 1
$$

### Mermaid 图表

\`\`\`mermaid
graph TD
    A[开始] --> B[结束]
\`\`\`

> [!NOTE]
> 这是一个 GitHub 风格的警告框
`;

    const testFile = path.join(exampleDir, 'test.md');
    fs.writeFileSync(testFile, testContent);
    
    console.log('1. 正在转换测试文档...');
    const outputPath = await convertMarkdownToPDF(testFile, undefined, {
      title: '测试文档',
      theme: 'github-light',
      enableMermaid: true,
      enableLatex: true
    });
    console.log('✓ 转换成功:', outputPath);
    
    // 检查完整示例文件是否存在
    const demoFile = path.join(exampleDir, 'demo.md');
    if (fs.existsSync(demoFile)) {
      console.log('\n2. 正在转换完整示例文档...');
      const demoOutputPath = await convertMarkdownToPDF(demoFile, undefined, {
        title: 'Markdown to PDF 完整示例',
        theme: 'github-light',
        enableMermaid: true,
        enableLatex: true
      });
      console.log('✓ 转换成功:', demoOutputPath);
    }
    
    console.log('\n✅ 所有测试通过!');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

test();
