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
npm install @google/generative-ai react-markdown lucide-react

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

修改 `src/index.css`，清空原内容并添加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 第三步：配置环境变量

在项目根目录创建 `.env` 文件：

```env
# 请将下方字符串替换为您的真实 API Key
VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **安全提示**: 在纯前端项目中，API Key 会暴露在浏览器网络请求中。如果是个人本地使用或部署在带密码保护的环境，可以接受；如果是面向公网的商业服务，强烈建议后续增加后端服务转发请求。

---

## 3. 核心代码实现 (Source Code)

请将以下代码分别复制到对应的文件中。

### 3.1 API 服务层 (`src/services/api.ts`)

创建该文件用于处理文件转换和与 Gemini 的通信。

```typescript
// src/services/api.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("Missing VITE_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 配置使用的模型，如果您的账号支持 gemini-3-pro-preview，请在此修改
const MODEL_NAME = "gemini-1.5-pro"; 

export async function generateContent(file: File, promptText: string) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 将文件转换为 Base64
    const base64Data = await fileToGenerativePart(file);

    // 发送请求
    const result = await model.generateContent([
      promptText || "Describe this video/image in detail.", // 默认提示词
      base64Data
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// 辅助函数：将 File 对象转为 Gemini SDK 需要的格式
async function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // 移除 "data:image/jpeg;base64," 这样的前缀
      const base64Data = base64String.split(',')[1];
      
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

### 3.2 主界面逻辑 (`src/App.tsx`)

这是一个现代化的、响应式的上传和分析界面。

```tsx
// src/App.tsx
import { useState } from 'react';
import { generateContent } from './services/api';
import ReactMarkdown from 'react-markdown';
import { Upload, Loader2, Image as ImageIcon, Video } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // 创建本地预览 URL
      setPreview(URL.createObjectURL(selectedFile));
      setResult('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult('');
    try {
      const aiResponse = await generateContent(file, prompt);
      setResult(aiResponse);
    } catch (error) {
      setResult('Error: Failed to analyze content. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-600 tracking-tight">Clip Name AI</h1>
          <p className="text-gray-500">Gemini 驱动的视频与图像智能理解助手</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
            <input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <div className="text-center space-y-2">
                {file?.type.startsWith('video') ? (
                  <video src={preview} className="max-h-64 rounded shadow" controls />
                ) : (
                  <img src={preview} alt="Preview" className="max-h-64 rounded shadow" />
                )}
                <p className="text-sm text-gray-500">{file?.name}</p>
                <button 
                  className="text-xs text-blue-600 hover:underline z-10 relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  更换文件
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="font-medium text-gray-700">点击上传 视频 或 图片</p>
                <p className="text-xs text-gray-400 mt-1">支持 MP4, JPG, PNG 等格式</p>
              </>
            )}
          </div>

          {/* Prompt Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分析指令 (Prompt)
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="例如：请详细描述这个视频里发生了什么？或者给这张图起一个合适的文件名。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center font-semibold text-white transition-all
              ${!file || loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                正在分析中...
              </>
            ) : (
              <>
                {file?.type.startsWith('video') ? <Video className="w-5 h-5 mr-2"/> : <ImageIcon className="w-5 h-5 mr-2"/>}
                开始分析
              </>
            )}
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-800">
              <span className="w-1 h-6 bg-blue-600 rounded mr-2"></span>
              分析结果
            </h2>
            <div className="prose prose-blue max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
```

---

## 4. 运行与测试

完成上述文件替换后，在终端运行：

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
