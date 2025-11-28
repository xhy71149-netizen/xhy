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
这份指南整合了构建基于 **Google Gemini API** 的 **React + TypeScript** 视频/图像分析单页应用（SPA）的完整流程。

此教程将指导你从零开始，搭建开发环境、配置 API、处理样式，并最终免费部署上线。

---

### 🚀 项目概览
*   **类型**：纯前端单页应用 (SPA)。
*   **技术栈**：React, TypeScript, Vite, Tailwind CSS。
*   **核心功能**：利用 Google Gemini 模型进行视频理解和图像分析。
*   **必要条件**：必须拥有 Google API Key。

---

### 第一阶段：准备工作 (API Key)

此项目依赖 Google 的 AI 模型，**必须**配置 API Key 才能运行。

1.  **获取 Key**：
    *   访问 [Google AI Studio](https://aistudio.google.com/)。
    *   登录 Google 账号。
    *   点击 **"Get API key"** 创建一个新的 Key。
2.  **注意模型与费用**：
    *   项目代码默认配置的模型（如描述中的 `gemini-3-pro` 或 `gemini-2.5-flash-lite`）可能处于预览阶段。
    *   建议在 Google AI Studio 控制台关注计费情况（Gemini 1.5 Flash 目前通常有免费层级）。

---

### 第二阶段：项目初始化 (本地环境)

确保电脑已安装 **Node.js** (推荐 v18+)。

1.  **创建 Vite 项目**：
    打开终端（Terminal/CMD），执行以下命令：
    ```bash
    # 创建项目 (选择 React 和 TypeScript)
    npm create vite@latest clip-name-ai -- --template react-ts

    # 进入目录
    cd clip-name-ai

    # 安装基础依赖
    npm install
    ```

2.  **安装功能依赖**：
    安装 Google GenAI SDK 和 Tailwind CSS：
    ```bash
    # 安装 Google AI SDK
    npm install @google/genai

    # 安装 Tailwind CSS 及其依赖
    npm install -D tailwindcss postcss autoprefixer
    
    # 初始化 Tailwind 配置
    npx tailwindcss init -p
    ```

---

### 第三阶段：代码配置与迁移

#### 1. 配置 Tailwind CSS
修改根目录下的 `tailwind.config.js`：
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

修改 `src/index.css`，清空原内容并填入：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 2. 迁移源代码
请按照以下结构组织文件（将你生成的代码填入对应文件）：

*   **根目录/src/**
    *   `App.tsx` (覆盖原文件，主应用逻辑)
    *   `main.tsx` (入口文件)
    *   `types.ts` (类型定义)
    *   `constants.ts` (常量定义，如 Prompt 提示词)
*   **根目录/src/components/** (新建文件夹)
    *   `Header.tsx`
    *   `UploadArea.tsx`
    *   `ResultsView.tsx`
*   **根目录/src/services/** (新建文件夹)
    *   `api.ts` (负责调用 Google API)
    *   `fileUtils.ts` (文件处理工具)

---

### 第四阶段：关键配置 (API Key 集成)

由于使用 Vite 构建，环境变量的处理方式与传统 Node.js 不同。

1.  **创建环境变量文件**：
    在项目**根目录**（与 `package.json` 同级）新建一个名为 `.env` 的文件，内容如下：
    ```env
    VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxx
    ```
    *(将 `AIza...` 替换为你第一步申请的真实 Key)*

2.  **修改代码中的调用方式**：
    打开 `src/services/api.ts`，找到初始化 `GoogleGenAI` 的地方，修改如下：
    ```typescript
    // ❌ 错误写法 (Node.js 方式)
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // ✅ 正确写法 (Vite 方式)
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    ```

---

### 第五阶段：运行与测试

1.  **启动本地服务器**：
    ```bash
    npm run dev
    ```
2.  **访问**：
    浏览器打开终端显示的地址（通常是 `http://localhost:5173`）。
3.  **测试**：
    上传一个视频或图片，查看 AI 是否能正常返回分析结果。

---

### 第六阶段：上线部署 (免费托管)

因为这是纯静态网站，无需购买服务器，推荐使用 **Vercel** 进行托管。

1.  **推送到 GitHub**：
    将你的项目代码提交并推送到 GitHub 仓库。
2.  **在 Vercel 导入**：
    *   登录 Vercel，点击 "Add New Project"。
    *   选择 import 刚才的 GitHub 仓库。
3.  **配置环境变量 (重要)**：
    *   在 Vercel 的部署页面，找到 **"Environment Variables"** 选项。
    *   **Key**: `VITE_API_KEY`
    *   **Value**: `AIzaSyD...` (你的真实 Key)
4.  **点击 Deploy**：
    等待约 1 分钟，你的应用就会生成一个公网可访问的 URL（例如 `https://clip-name-ai.vercel.app`）。

---

### ⚠️ 安全性重要提示

**架构风险**：
目前的实现是 **Client-side (客户端)** 直接调用 Google API。这意味着你的 API Key 会包含在浏览器的网络请求中，精通技术的用户可以在控制台看到你的 Key。

**建议**：
1.  **个人/演示用途**：
    *   可以直接使用。
    *   强烈建议在 **Google AI Studio** 的 API Key 设置中，添加 **HTTP Referrer 限制**。将其限制为仅允许你的 Vercel 域名（如 `https://your-app.vercel.app/*`）和本地地址（`http://localhost:5173/*`）调用。
2.  **商业/公开产品**：
    *   这种架构**不安全**。
    *   你需要搭建一个后端服务（Node.js/Python/Go），将 Key 保存在后端服务器。前端请求你的后端，后端再代理请求 Google。
