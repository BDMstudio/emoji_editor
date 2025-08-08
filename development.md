## 项目简介

Emoji Editor 是一个支持原生 Emoji 编辑、Twemoji 预览与多格式导出的前端应用。项目包含两种形态：
- Next.js 应用（推荐，支持主题、组件化与更好的扩展性）
- 单文件静态版 emoji_editor.html（便于快速离线使用/嵌入）

主要能力：
- 文本编辑（contentEditable，原生 Emoji）
- 智能 Emoji 选择器（6大分类，光标位置插入）
- 可调节布局系统（水平/垂直双向调节，布局持久化）
- 主题系统（明暗主题切换，系统偏好检测）
- 文本修复/转换（旧式 Keycap 修复、段首数字 → Keycap）
- Twemoji 预览（不影响编辑区的原生 Emoji）
- 多格式导出：可编辑 HTML、Twemoji 快照 HTML、Markdown、PDF（直接保存）

## 运行环境与依赖
- Node.js >= 18（Next.js 14 需要）
- 包管理：npm
- 依赖要点：
  - next 14.x、react 18、tailwindcss 3.x
  - twemoji 14.0.2（CDN 与代码版本一致）
  - html2pdf.js 0.10.1（PDF 导出）

## 快速开始（Next.js 版本）
1. 安装依赖
   - npm install
2. 开发调试
   - npm run dev
   - 浏览器打开 http://localhost:3000
3. 生产构建
   - npm run build && npm start

提示：请通过 HTTP 访问而非 file://，避免 CORS/权限限制导致的预览与导出异常。

## 目录结构（关键文件）
- app/
  - layout.tsx：全局布局与主题 Provider
  - page.tsx：主页，组装工具栏、编辑器、预览、导出按钮与 Emoji 容器
  - globals.css：全局样式/主题/打印样式/PDF 容器样式
- components/
  - Editor.tsx：contentEditable 编辑器（支持聚焦态样式）
  - Preview.tsx：Twemoji 预览（仅在开启预览时解析）
  - Toolbar.tsx：文本转换与复制/清空
  - ExportButtons.tsx：导出按钮与状态管理
  - ScriptLoader.tsx：在客户端动态加载 Twemoji 与 html2pdf.js（CDN）
  - ThemeProvider.tsx：主题上下文提供者（支持系统偏好检测）
  - ThemeToggle.tsx：明暗主题切换按钮
  - EmojiContainer.tsx：Emoji 快选容器（6大分类，光标位置插入）
- lib/
  - utils.ts：文本转换与下载工具函数
  - export.ts：导出实现（HTML/Markdown/PDF）
  - emojiData.ts：分类 Emoji 数据集合
  - theme.ts：主题管理工具函数
- emoji_editor.html：静态单文件版（纯 HTML/CSS/JS）
- README.md：项目概览
- development.md：本开发文档

## 代码规范与说明
- 统一使用 TypeScript
- 每个模块顶部使用“AI-SUMMARY”注释简述模块功能（已在多数文件中体现）
- 主题/配色/间距通过 CSS 变量与 Tailwind 原子类控制
- 不在源码与注释中使用中文与 emoji（编译相关文件），业务提示文本可中文
- 外部脚本统一通过 ScriptLoader 动态引入，或 lib/export.ts 在首次导出 PDF 时按需加载

## 功能实现细节

### 1) 文本编辑与转换
- Editor.tsx：
  - 使用 contentEditable + innerText 双向同步，避免粘贴 HTML 污染
  - 聚焦态样式 .editor-focus，支持自动文本方向检测
  - 防循环更新机制（isInternalUpdate ref）
- utils.ts：
  - fixLegacyKeycaps：将旧式"digit + U+20E3"替换为"digit + VS16 + U+20E3"
  - listDigitsToKeycap：将行首 1-9 的"1."、"1、"、"1-"、"1)"等转为 Keycap 表示
- page.tsx：
  - 默认文本 DEFAULT_CONTENT 首次挂载时做一次 Keycap 修复
  - EmojiContainer 支持在光标处插入 Emoji
  - 双向布局调节（水平/垂直），支持 localStorage 持久化
  - 响应式布局检测（≥1024px 为大屏）

### 2) Twemoji 预览（不修改编辑区）
- Preview.tsx：
  - 开关式预览。开启后将 content 赋值到预览节点的 textContent，并通过 twemoji.parse 对预览区进行图片替换
  - Twemoji 使用 jsDelivr：base: https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/，folder: 'svg', ext: '.svg'
  - 只在预览开启时解析，避免编辑区被替换为图片

### 3) 导出
- lib/export.ts：
  - exportEditableHTML：
    - 将文本内容 escape 后塞入可编辑 div（原生 Emoji），便于后续二次编辑
  - exportTwemojiHTML：
    - 在临时容器中 twemoji.parse → 生成快照（<img class="emoji">），导出为 HTML（展示一致）
  - exportMarkdown：
    - 直接保存 UTF-8 文本
  - exportPDF（关键）：
    - 动态加载 html2pdf.js（如果尚未加载）
    - 创建离屏容器 .pdf-container，将文本以 textContent 放入
    - 使用 Twemoji 将 Emoji 转为图片后再导出
      - PDF 中采用 PNG（folder: '72x72', ext: '.png'）以提升 html2canvas 兼容性
      - 为 Twemoji 图片显式添加 crossorigin: 'anonymous'
    - 等待图片加载完成（或 3s 超时）后，再调用 html2pdf 生成 PDF
    - html2canvas 选项：useCORS=true，backgroundColor='#fff'，scale=2，禁用污染

为什么使用 PNG 而不是 SVG？
- html2canvas 对跨域 SVG 渲染在部分浏览器存在限制，容易导致画布污染或空白输出；PNG 更稳健

### 4) 主题系统与布局管理
- ThemeProvider.tsx：
  - 基于 React Context 的主题状态管理
  - 支持系统偏好检测（prefers-color-scheme）
  - localStorage 持久化主题选择，防止水合不匹配
- 布局调节系统：
  - 水平调节：editorWidth 状态（20%-80%）
  - 垂直调节：editorHeight 状态（40%-95%）
  - 调节手柄：微妙的视觉提示，hover 时显示
  - 持久化：localStorage 保存布局比例
- EmojiContainer.tsx：
  - 6大分类：表情与人物、动物与自然、食物与饮料、活动、旅行与地点、符号
  - 响应式网格布局（8-12列）
  - 分类标签导航，当前分类高亮
  - 使用 DOM Selection API 实现光标位置插入

### 5) 静态版（emoji_editor.html）
- 保持与组件版一致的导出能力
- 预览/快照/打印（若启用）均统一 Twemoji CDN 前缀，避免路径变化导致资源 404
- 若本地使用，建议通过 HTTP 服务打开（例如 VSCode Live Server），避免 file:// 环境下的权限问题

## 常见问题（FAQ）
- PDF 文件空白？
  - 请确认通过 HTTP 访问（非 file://）
  - 确保网络可访问 jsDelivr（Twemoji 与 html2pdf.js）
  - 留意控制台是否有 CORS/图片加载错误；项目已对 Twemoji 图片增加 crossorigin 与 useCORS
  - 等待渲染（代码已经等待图片加载并双 RAF 刷新）
- 复制失败？
  - 现代浏览器要求 HTTPS 或用户手势；若失败可允许权限或在 localhost 下操作
- favicon.ico 404？
  - 不影响功能；可在 public/ 放置 favicon 或在 <head> 添加 data URL 空图标
- 预览不显示图片？
  - 确认已开启预览开关；仅预览区会替换为图片，编辑区永远保持原生 Emoji

## 开发建议
- 组件层职责单一：编辑（Editor）、预览（Preview）、导出（ExportButtons）、工具栏（Toolbar）
- 所有外部脚本统一集中在 ScriptLoader 动态加载，避免 SSR 阶段出错
- Twemoji/CDN 版本变更时同步更新 base 与 package.json 版本，保持一致
- 如需离线使用：将 Twemoji 资源下载到 public/twemoji/，把 base 指向本地

## 测试与验证
- 建议为 lib/utils.ts 与 lib/export.ts 编写单元测试（文本转换、HTML 生成片段、PDF 生成入口是否调用）
- 手工回归：
  - 不开预览 → 编辑/转换/复制/清空
  - 开启预览 → Twemoji 预览一致性
  - 四种导出分别验证：HTML（可编辑）、HTML（快照）、Markdown、PDF

## 版本与发布
- 版本：见 package.json
- 构建：npm run build
- 部署：常规 Next.js 静态/自托管部署流程

## 待办（TODO）
- [ ] 增加"纯文本 PDF（不依赖 Twemoji CDN）"兜底导出
- [ ] 支持 0/#/* keycap 转换
- [ ] 提供本地 Twemoji 资源与开关（离线模式）
- [ ] 为 export.ts 增加更完善的错误提示与日志开关
- [ ] 添加撤销/重做功能
- [ ] 实现键盘快捷键支持
- [ ] 虚拟滚动优化（大量 Emoji 渲染）
- [ ] 拖拽文件导入功能

## 变更记录（近期）
- **v2.0 主要更新**：
  - 新增主题系统：明暗主题切换，系统偏好检测，localStorage 持久化
  - 新增智能 Emoji 选择器：6大分类，光标位置插入，响应式布局
  - 新增双向布局调节：水平/垂直调节手柄，比例持久化
  - 优化组件架构：ThemeProvider, EmojiContainer, 改进的 Editor
  - 修复 Emoji 显示：移除不支持的字符，添加字体后备
- **v1.x 基础功能**：
  - PDF 导出：从 SVG 改为 PNG，并添加 CORS 与图片加载等待，解决空白 PDF 与跨域渲染问题
  - 统一 Twemoji CDN 基础路径，预览/快照/导出一致
