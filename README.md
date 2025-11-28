<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zqjFKKYI2cWvrWp6QaTILlOrqjoVsFSb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

##  操作指南
这份指南将您提供的前置需求、本地部署步骤、以及缺失的**核心代码逻辑**进行了完整的整合。这是一个可以直接落地执行的“保姆级”开发文档。

我们将项目命名为 **Clip-Name-AI**，这是一个基于 React + Vite + Tailwind + Gemini 的纯前端智能分析应用。

---

# Clip-Name-AI 开发与部署全指南

## 1. 项目准备 (Prerequisites)

在开始之前，请确保您具备以下条件：

*   **Node.js 环境**: v18 或更高版本。
*   **API Key**: 必须拥有 Google Gemini 的 API 权限。
    *   获取地址: [Google AI Studio](https://aistudio.google.com/)
    *   **注意**: 本项目默认配置使用 `gemini-1.5-pro` (当前最强稳定版) 或您指定的 `gemini-3-pro-preview`（需确认您有该模型访问权限）。

---

## 2. 本地开发搭建 (Local Setup)

请按顺序在终端执行以下命令。

### 第一步：创建项目并安装依赖

这里我们将安装 `lucide-react` (图标库) 和 `react-markdown` (结果渲染) 以提升体验，并将 Google SDK 修正为目前通用的 `@google/generative-ai`。

```bash
# 1. 创建 Vite React+TS 项目
npm create vite@latest clip-name-ai -- --template react-ts

# 2. 进入目录
cd clip-name-ai

# 3. 安装核心依赖 (Google AI SDK, React Markdown)
npm install @google/genai react react-dom

# 4. 安装样式依赖 (Tailwind CSS)
npm install -D tailwindcss postcss autoprefixer
```

### 第二步：初始化 Tailwind CSS

```bash
# 初始化配置
npx tailwindcss init -p
```

修改根目录下的 `tailwind.config.js`，将 `content` 数组替换为：

```javascript
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
```

修改 `src/index.css`，清空原内容并添加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 第三步：配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **安全提示**: 在纯前端项目中，API Key 会暴露在浏览器网络请求中。如果是个人本地使用或部署在带密码保护的环境，可以接受；如果是面向公网的商业服务，强烈建议后续增加后端服务转发请求。

---

## 3. 核心代码实现 (Source Code)
将我提供的所有 XML 代码块中的内容，分别保存到 src/ 目录下的对应文件中（如 src/App.tsx, src/services/api.ts 等）。
注意：在 src/services/api.ts 中，确保初始化代码使用 Vite 的环境变量方式：
// 修改 services/api.ts
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

## 4. 运行与测试



```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`。

1.  上传一张图片或一个短视频。
2.  输入提示词（例如：“帮我给这个视频起一个利于SEO的文件名”）。
3.  点击“开始分析”，等待 Gemini 返回结果。

---

## 5. 生产环境部署 (Deploy)

由于本项目构建后是纯静态文件 (HTML/JS/CSS)，您可以零成本部署。

### 部署到 Vercel (推荐)

1.  **代码推送**: 将您的代码提交到 GitHub/GitLab。
    *   *注意：不要将 `.env` 文件提交到代码仓库中（`.gitignore` 默认已包含）。*
2.  **导入项目**: 登录 [Vercel](https://vercel.com/)，点击 "Add New Project"，导入您的 Git 仓库。
3.  **配置环境变量**:
    *   在 Vercel 部署页面的 **Environment Variables** 区域。
    *   Key: `VITE_API_KEY`
    *   Value: `AIzaSyD...` (您的真实 API Key)
4.  **部署**: 点击 **Deploy**。等待约 1 分钟，您将获得一个公网可访问的 HTTPS 链接。

现在，您的 Clip-Name-AI 智能工具已经上线了！
