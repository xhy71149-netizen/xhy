# ClipName AI - 智能视频切片命名助手

ClipName AI 是一个基于 Google Gemini 3 Pro 多模态大模型的智能 Web 应用。它能够根据完整的源视频上下文，自动理解并为从源视频中切分出的短视频（Clips）生成具有描述性的中文文件名。

## ✨ 主要功能

*   **多模态理解**：同时分析完整的源视频文件和切片视频的视觉内容。
*   **智能命名**：生成符合 "主语 + 动作" 格式的中文文件名（严格控制在 15 字以内）。
*   **上下文感知**：不仅仅看单帧画面，而是结合源视频的剧情/流程进行命名。
*   **纯前端处理**：视频缩略图生成和逻辑处理均在浏览器端完成。
*   **批量导出**：
    *   一键复制文件名列表。
    *   **Windows 脚本 (.bat)**：下载后双击即可批量重命名本地文件。
    *   **Mac/Linux 脚本 (.sh)**：提供 Shell 脚本用于批量重命名。
*   **大文件支持**：支持最大 300MB 的源视频文件上传。

---

## 🛠️ 前置需求

在开始部署之前，请确保您拥有以下资源：

1.  **Node.js 环境**：建议版本 v18 或更高。
2.  **Google Gemini API Key**：
    *   访问 [Google AI Studio](https://aistudiocdn.com/google-ai-studio) 申请。
    *   **重要**：您的 API Key 必须有权访问 `gemini-3-pro-preview` 模型（这是目前支持强大多模态能力的模型）。

---

## 🚀 本地开发与部署流程

本项目使用 React + Vite + TypeScript 构建。

### 第一步：创建与初始化项目

如果您是直接下载的代码，请跳过创建命令，直接进入目录安装依赖。如果您是从零开始：

```bash
# 1. 使用 Vite 创建项目 (选择 React + TypeScript)
npm create vite@latest clip-name-ai -- --template react-ts

# 2. 进入项目目录
cd clip-name-ai

# 3. 安装项目依赖
# 核心依赖：Google GenAI SDK, React
npm install @google/genai react react-dom

# 样式依赖：Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
```

### 第二步：配置样式 (Tailwind CSS)

1.  初始化 Tailwind：
    ```bash
    npx tailwindcss init -p
    ```

2.  修改 `tailwind.config.js`：
    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

3.  修改 `src/index.css`，替换为：
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

### 第三步：配置 API Key

在项目根目录下创建一个名为 `.env` 的文件（注意文件名以点开头），并填入您的 API Key：

```env
VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **安全提示**：在前端项目中，API Key 实际上是暴露给浏览器的。如果是个人使用或内部工具，这通常是可以接受的。如果是面向公众的商业服务，建议配合后端服务转发请求以隐藏 Key。

### 第四步：导入代码

将项目源代码（`App.tsx`, `components/`, `services/` 等）放入 `src` 目录中。

### 第五步：启动本地服务

```bash
npm run dev
```

终端会显示访问地址，通常是 `http://localhost:5173`。打开浏览器即可开始使用。

---

## 🌐 生产环境部署 (上线)

本项目是纯静态的单页应用 (SPA)，不需要 Node.js 后端服务器，可以部署到任何静态托管平台。

### 推荐平台

*   **Vercel** (推荐)
*   **Netlify**
*   **GitHub Pages**

### 部署到 Vercel 示例

1.  **推送到 GitHub**：将您的代码提交并推送到 GitHub 仓库。
2.  **导入 Vercel**：
    *   登录 Vercel，点击 "Add New..." -> "Project"。
    *   选择您的 GitHub 仓库。
3.  **配置环境变量**：
    *   在 Vercel 的部署设置页面，找到 **Environment Variables** 部分。
    *   添加 Key: `VITE_API_KEY`
    *   添加 Value: `您的_GOOGLE_API_KEY`
4.  **部署**：点击 **Deploy** 按钮。等待约 1 分钟，您的应用就上线了！

---

## 📖 使用指南

1.  **上传源视频**：点击“上传完整视频”，选择包含所有素材的那个完整长视频（最大 300MB）。这用于给 AI 提供上下文。
2.  **上传切片 (Clips)**：点击“批量上传切片”，选择您已经从源视频中切分出来的多个短视频文件。
3.  **开始分析**：点击底部的“生成中文文件名”按钮。
    *   系统会在浏览器本地快速提取每个切片的封面图。
    *   然后将源视频和这些封面图发送给 Google Gemini。
4.  **获取结果**：
    *   查看 AI 生成的建议文件名和理由。
    *   **复制列表**：将文件名按顺序复制到剪贴板。
    *   **下载脚本**：点击 "Win 脚本" 下载 `.bat` 文件，将其放入切片视频所在的文件夹，双击运行即可一键重命名所有文件。

---

## ⚠️ 注意事项

*   **浏览器内存**：由于视频处理涉及 Base64 转换，300MB 左右的视频可能会占用较多内存，建议在电脑端 Chrome/Edge 浏览器使用。
*   **API 配额**：`gemini-3-pro` 模型可能会产生费用或受到预览版配额限制，请关注您的 Google Cloud 账单。
*   **文件顺序**：为确保重命名脚本正确工作，请不要在上传后随意修改本地文件的文件名，直到脚本运行完成。
