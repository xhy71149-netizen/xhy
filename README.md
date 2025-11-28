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
这是一个为您优化过的 `README.md` 版本。它提取了部署手册中的核心信息，并按照 GitHub 开源项目的标准格式进行了重组，格式清晰，包含必要的徽章和代码块，您可以直接复制粘贴到项目的 `README.md` 文件中。

***

```markdown
# Clip Name AI - 智能视频理解与重命名工具

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

这是一个基于 **React + TypeScript + Vite** 开发的单页应用（SPA）。项目利用 **Google Gemini API** 的强大视觉理解能力，实现视频内容的自动分析与智能重命名建议。

> ⚠️ **注意**：本项目核心功能依赖 Google Gemini API，使用前必须配置 API Key。

## ✨ 核心功能

*   **视频/图像分析**：利用 Google 最新的多模态模型（如 `gemini-2.5-flash-lite` 或 `gemini-3-pro` 预览版）深入理解视频内容。
*   **极速构建**：基于 Vite 构建，开发体验流畅。
*   **现代化 UI**：使用 TailwindCSS 构建的响应式界面。
*   **纯前端架构**：无需后端服务器，直接通过浏览器调用 API。

## 🛠️ 技术栈

*   **前端框架**: React 18
*   **语言**: TypeScript
*   **构建工具**: Vite
*   **样式库**: TailwindCSS
*   **AI SDK**: Google GenAI SDK (`@google/genai`)

## 🚀 快速开始 (本地运行)

### 1. 环境准备
确保您的本地环境已安装 Node.js (推荐 v18 或更高版本)。
```bash
node -v
```

### 2. 获取 Google API Key
由于项目依赖 Google Gemini 模型，您需要先申请 API Key：
1.  访问 [Google AI Studio](https://aistudio.google.com/)。
2.  登录 Google 账号并点击 **Get API key**。
3.  复制生成的 API Key。
    *   *注意：请关注 `gemini-3-pro` 等预览版模型的计费情况。*

### 3. 安装依赖
下载代码后，在项目根目录运行以下命令安装依赖：

```bash
npm install
```

### 4. 配置环境变量 (关键步骤)
在项目根目录创建一个 `.env` 文件，并添加您的 API Key：

```properties
# .env 文件
VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxx
```
*注意：变量名必须以 `VITE_` 开头，否则 Vite 无法识别。*

### 5. 启动项目
运行本地开发服务器：

```bash
npm run dev
```
启动成功后，访问终端显示的地址（通常为 `http://localhost:5173`）即可使用。

## 📦 上线部署

本项目为纯静态网站，推荐使用 Vercel 或 Netlify 进行免费托管。

### 方案 A：部署到 Vercel (推荐)
1.  将代码推送到您的 **GitHub** 仓库。
2.  登录 [Vercel](https://vercel.com/) 并点击 **New Project**。
3.  导入您的 GitHub 仓库。
4.  **配置环境变量**：
    *   在 **Environment Variables** 区域点击 Add。
    *   Key: `VITE_API_KEY`
    *   Value: `您的实际 API Key`
5.  点击 **Deploy**，等待构建完成即可获得公网访问地址。

### 方案 B：部署到 Netlify
1.  登录 [Netlify](https://www.netlify.com/) 并选择 **Import from Git**。
2.  选择 GitHub 仓库。
3.  在 **Site settings** -> **Environment variables** 中添加 `VITE_API_KEY`。
4.  点击 **Deploy site**。

## 🔒 安全性提示

当前架构采用 **客户端直接调用 API** 的方式（Client-side API Calls）。

*   **个人/演示用途**：
    可直接使用。建议在 [Google AI Studio 控制台](https://aistudio.google.com/) 设置 API Key 的 **Referrer 限制**（仅允许您的 Vercel/Netlify 域名调用），以防止 Key 被盗用。
*   **商业/生产环境**：
    **不建议**直接使用当前架构。建议搭建轻量级后端（Node.js/Python），将 API Key 存储在服务器端，前端通过后端转发请求，以确保密钥安全。

## 📄 目录结构说明

```text
src/
├── components/       # UI 组件 (Header, UploadArea, ResultsView)
├── services/         # 业务逻辑
│   ├── api.ts        # Google GenAI SDK 调用封装
│   └── fileUtils.ts  # 文件处理工具
├── App.tsx           # 主应用入口
├── main.tsx          # 渲染入口
└── index.css         # Tailwind 样式入口
```

---

```
