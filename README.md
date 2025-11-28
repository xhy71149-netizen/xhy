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
这是一个非常棒的单页应用（SPA）项目。由于它是纯前端应用（React + TypeScript），部署相对简单，但确实需要 API Key 才能工作。
以下是详细的部署说明和 API 需求：
1. 核心需求：需要 API 吗？
答案：是的，必须有。
此系统依赖 Google 的 Gemini API 来进行视频理解和图像分析。
API 提供方：Google AI Studio。
所需模型：代码中配置使用的是 gemini-3-pro-preview（目前最强的多模态模型）和 gemini-2.5-flash-lite。
获取方式：
访问 Google AI Studio.
登录 Google 账号。
点击 "Get API key" 创建一个 Key。
注意费用：Gemini 1.5 Flash 目前有免费额度，但 gemini-3-pro 可能会产生费用或处于预览阶段，请在控制台关注计费情况。
2. 部署步骤（从零开始到上线）
由于现在的代码是散落的文件，我们需要一个构建工具来把它们打包成网页。推荐使用 Vite，它速度快且配置简单。
第一步：本地环境准备
确保你的电脑安装了 Node.js (推荐 v18 或更高版本)。
第二步：初始化项目
打开终端（Terminal/CMD），运行以下命令创建一个新项目：
code
Bash
# 创建项目，命名为 clip-name-ai，选择 React + TypeScript
npm create vite@latest clip-name-ai -- --template react-ts

# 进入目录
cd clip-name-ai

# 安装依赖
npm install
第三步：安装项目所需的库
你需要安装 Google GenAI SDK 和样式库：
code
Bash
# 安装 Google GenAI SDK
npm install @google/genai

# 安装 TailwindCSS (Vite 标准流程)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
第四步：配置 Tailwind CSS
修改 tailwind.config.js：
code
JavaScript
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
修改 src/index.css，替换为：
code
CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
第五步：迁移代码
将我之前生成的代码文件复制到 src 文件夹中：
src/App.tsx: 覆盖原文件。
src/main.tsx: (Vite 默认是 main.tsx，对应我提供的 index.tsx)。
创建文件夹 src/components，放入 Header.tsx, UploadArea.tsx, ResultsView.tsx。
创建文件夹 src/services，放入 api.ts, fileUtils.ts。
创建文件 src/types.ts 和 src/constants.ts。
第六步：配置 API Key (关键点)
在 src/services/api.ts 中，原本的代码是：
code
TypeScript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
在 Vite 中，你需要做以下修改：
在项目根目录创建一个文件名为 .env。
在里面写入你的 Key：
code
Env
VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxx
修改 src/services/api.ts，将 process.env.API_KEY 改为 import.meta.env.VITE_API_KEY：
code
TypeScript
// 修改后
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
第七步：本地运行
code
Bash
npm run dev
此时浏览器会打开 http://localhost:5173，你应该能看到完整的应用并可以上传视频测试了。
3. 上线部署 (发布到公网)
因为这是一个纯静态网站（不需要后台服务器，逻辑都在浏览器里跑），你可以免费托管到以下平台：
Vercel (推荐):
将代码推送到 GitHub。
在 Vercel 导入 GitHub 仓库。
在 Vercel 的 "Environment Variables" 设置中添加 VITE_API_KEY。
点击 Deploy。
Netlify: 流程类似。
4. 安全性提示
重要： 目前的架构是 Client-side (客户端) 调用 API。
这意味着你的 API Key 会暴露在浏览器的网络请求中。
如果是个人使用/内部工具：这样做没问题，但在 Google AI Studio 设置 API Key 限制（Referrer 限制）来防止滥用。
如果是面向公众的商业产品：你需要搭建一个后端服务器（Node.js/Python），把 API Key 藏在服务器里，前端请求你的服务器，服务器再去请求 Google。
总结
要钱/Key吗？ 要，去 Google AI Studio 申请。
怎么跑？ 使用 Vite 初始化 React 项目 -> 复制代码 -> 配置 .env -> npm run dev。
