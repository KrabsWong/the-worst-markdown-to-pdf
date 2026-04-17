# Markdown to PDF 项目说明

## 项目概述

这是一个将 Markdown 文档转换为美观 PDF 的工具，严格遵循 GitHub Markdown 渲染规范，支持 Mermaid 图表和 LaTeX 数学公式。

## 核心特性

1. **GitHub 风格渲染**：完美还原 GitHub 的 Markdown 渲染效果
2. **Mermaid 图表**：支持流程图、时序图、甘特图、类图等
3. **LaTeX 公式**：完整的数学公式支持（行内和块级）
4. **代码高亮**：使用 highlight.js，支持多种代码主题
5. **暗色主题**：支持 GitHub 暗色主题
6. **批量转换**：支持批量转换多个文件

## 项目结构

```
markdown-to-pdf/
├── src/
│   ├── index.ts              # 入口文件，导出所有模块
│   ├── cli.ts                # 命令行工具
│   ├── pdf-engine.ts         # PDF 生成引擎
│   ├── markdown-parser.ts    # Markdown 解析器
│   ├── html-template.ts      # HTML 模板生成器
│   ├── types.ts              # TypeScript 类型定义
│   ├── styles/
│   │   └── github-markdown.ts    # GitHub 风格 CSS
│   └── test.ts               # 测试文件
├── examples/
│   └── demo.md               # 示例文档
├── dist/                     # 编译后的 JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 技术栈

- **TypeScript**：主要开发语言
- **marked**：Markdown 解析器
- **playwright**：浏览器自动化（PDF 生成）
- **KaTeX**：LaTeX 公式渲染
- **highlight.js**：代码高亮
- **mermaid.js**：图表渲染

## 构建命令

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行测试
npm test

# CLI 使用
node dist/cli.js <input.md> [options]
```

## 渲染流程

1. 读取 Markdown 文件
2. 预处理（LaTeX 公式、警告框）
3. 使用 marked 解析 Markdown
4. 生成完整 HTML 页面（包含 CSS 和脚本）
5. 使用 Playwright 渲染 HTML
6. 等待资源加载（KaTeX、Mermaid）
7. 生成 PDF

## 样式系统

- 基于 GitHub 的 Markdown 样式
- 使用 CSS 变量支持主题切换
- 打印优化（避免分页截断）
- 响应式设计

## 扩展点

- `customCSS`：添加自定义 CSS
- `pdfOptions`：自定义 PDF 输出选项
- `Renderer`：自定义 Markdown 渲染器

## 注意事项

- 首次运行需要下载 Chromium（通过 Playwright）
- Mermaid 图表渲染需要网络连接（CDN 加载）
- LaTeX 公式渲染需要网络连接（CDN 加载）
