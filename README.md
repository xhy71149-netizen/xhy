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
# clip重命名项目部署手册

            <p data-doubao-line="112" data-doubao-column="13" data-doubao-key="6">这是一个基于 <strong data-doubao-line="112" data-doubao-column="23" data-doubao-key="7">React + TypeScript</strong> 开发的单页应用（SPA，纯前端应用），部署流程简单，但核心依赖 Google Gemini API 实现视频理解与图像分析功能，必须配置 API Key 才能正常运行。以下是完整的 API 需求说明与部署步骤。</p>

            ## 1. 核心需求：API 依赖说明

            <p data-doubao-line="115" data-doubao-column="13" data-doubao-key="9">该系统<strong data-doubao-line="115" data-doubao-column="19" data-doubao-key="10">必须使用 API</strong>，具体信息如下：</p>
            <ul data-doubao-line="116" data-doubao-column="13" data-doubao-key="11">
                <li data-doubao-line="117" data-doubao-column="17" data-doubao-key="12"><strong data-doubao-line="117" data-doubao-column="21" data-doubao-key="13">依赖 API</strong>：Google Gemini API（用于视频理解、图像分析）</li>
                <li data-doubao-line="118" data-doubao-column="17" data-doubao-key="14"><strong data-doubao-line="118" data-doubao-column="21" data-doubao-key="15">API 提供方</strong>：谷歌人工智能工作室（Google AI Studio）</li>
                <li data-doubao-line="119" data-doubao-column="17" data-doubao-key="16"><strong data-doubao-line="119" data-doubao-column="21" data-doubao-key="17">所需模型</strong>：
                    <ul data-doubao-line="120" data-doubao-column="21" data-doubao-key="18">
                        <li data-doubao-line="121" data-doubao-column="25" data-doubao-key="19">`gemini-3-pro`（预览版，当前谷歌最强多模态模型）</li>
                        <li data-doubao-line="122" data-doubao-column="25" data-doubao-key="20">`gemini-2.5-flash-lite`</li>
                    

                </li>
                <li data-doubao-line="125" data-doubao-column="17" data-doubao-key="21"><strong data-doubao-line="125" data-doubao-column="21" data-doubao-key="22">API Key 获取步骤</strong>：
                    <ol data-doubao-line="126" data-doubao-column="21" data-doubao-key="23">
                        <li data-doubao-line="127" data-doubao-column="25" data-doubao-key="24">访问官方平台：<a href="https://aistudio.google.com/" target="_blank" data-doubao-line="127" data-doubao-column="36" data-doubao-key="25">Google AI Studio</a></li>
                        <li data-doubao-line="128" data-doubao-column="25" data-doubao-key="26">登录个人 Google 账号（无账号需先注册）</li>
                        <li data-doubao-line="129" data-doubao-column="25" data-doubao-key="27">点击页面中的 <strong data-doubao-line="129" data-doubao-column="36" data-doubao-key="28">Get API key</strong> 按钮，创建专属 API Key</li>
                        <li data-doubao-line="130" data-doubao-column="25" data-doubao-key="29"><strong data-doubao-line="130" data-doubao-column="29" data-doubao-key="30">费用提示</strong>：Gemini 1.5 Flash 目前提供免费额度；`gemini-3-pro`（双子座3专业版）可能产生费用或处于预览阶段，需在 Google AI Studio 控制台实时关注计费情况</li>
                    

                </li>
            

            ## 2. 部署步骤（从零到本地运行）

            <p data-doubao-line="136" data-doubao-column="13" data-doubao-key="32">项目需使用 <strong data-doubao-line="136" data-doubao-column="22" data-doubao-key="33">Vite</strong>（构建工具，特点：速度快、配置简单）打包网页，具体步骤如下：</p>

            ### 第一步：本地环境准备

            <p data-doubao-line="139" data-doubao-column="13" data-doubao-key="35">确保电脑已安装 <strong data-doubao-line="139" data-doubao-column="24" data-doubao-key="36">Node.js</strong>（推荐版本：v18 或更高），可通过终端执行 `node -v` 验证安装状态（显示版本号即安装成功）。</p>

            ### 第二步：初始化 Vite + React 项目

            <p data-doubao-line="142" data-doubao-column="13" data-doubao-key="38">打开终端（Terminal/CMD），依次运行以下命令，创建并初始化项目：</p>
            <pre data-doubao-line="143" data-doubao-column="13" data-doubao-key="39"><code data-doubao-line="143" data-doubao-column="18" data-doubao-key="40"># 1. 创建项目（命名为 clip-name-ai，指定 React + TypeScript 模板）
npm create vite@latest clip-name-ai -- --template react-ts

# 2. 进入项目根目录
cd clip-name-ai

# 3. 安装项目基础依赖
npm install</code></pre>

            ### 第三步：安装核心依赖库

            <p data-doubao-line="153" data-doubao-column="13" data-doubao-key="42">需安装 Google GenAI SDK（用于调用 Gemini API）和 TailwindCSS（用于样式开发），命令如下：</p>
            <pre data-doubao-line="154" data-doubao-column="13" data-doubao-key="43"><code data-doubao-line="154" data-doubao-column="18" data-doubao-key="44"># 1. 安装 Google GenAI SDK
npm install @google/genai

# 2. 安装 TailwindCSS 及配套工具（Vite 标准配置流程）
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>

            ### 第四步：配置 TailwindCSS

            #### 1. 修改 `tailwind.config.js`（项目根目录）

            <p data-doubao-line="163" data-doubao-column="13" data-doubao-key="47">覆盖原文件内容，指定 Tailwind 需监听的文件范围：</p>
            <pre data-doubao-line="164" data-doubao-column="13" data-doubao-key="48"><code data-doubao-line="164" data-doubao-column="18" data-doubao-key="49">/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 匹配 src 目录下所有相关文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}</code></pre>

            #### 2. 修改 `src/index.css`

            <p data-doubao-line="177" data-doubao-column="13" data-doubao-key="51">替换原文件内容，启用 Tailwind 基础样式、组件样式与工具类：</p>
            <pre data-doubao-line="178" data-doubao-column="13" data-doubao-key="52"><code data-doubao-line="178" data-doubao-column="18" data-doubao-key="53">@tailwind base;
@tailwind components;
@tailwind utilities;</code></pre>

            ### 第五步：迁移项目代码

            <p data-doubao-line="183" data-doubao-column="13" data-doubao-key="55">将已生成的代码按以下路径复制到 `clip-name-ai` 项目中，确保文件结构正确：</p>
            <table data-doubao-line="184" data-doubao-column="13" data-doubao-key="56">
                <thead data-doubao-line="185" data-doubao-column="17" data-doubao-key="57">
                    <tr data-doubao-line="186" data-doubao-column="21" data-doubao-key="58">
                        <th data-doubao-line="187" data-doubao-column="25" data-doubao-key="59">源文件</th>
                        <th data-doubao-line="188" data-doubao-column="25" data-doubao-key="60">目标路径</th>
                        <th data-doubao-line="189" data-doubao-column="25" data-doubao-key="61">操作说明</th>
                    </tr>
                </thead>
                <tbody data-doubao-line="192" data-doubao-column="17" data-doubao-key="62">
                    <tr data-doubao-line="193" data-doubao-column="21" data-doubao-key="63">
                        <td data-doubao-line="194" data-doubao-column="25" data-doubao-key="64">App.tsx</td>
                        <td data-doubao-line="195" data-doubao-column="25" data-doubao-key="65">src/App.tsx</td>
                        <td data-doubao-line="196" data-doubao-column="25" data-doubao-key="66">覆盖项目原有 App.tsx 文件</td>
                    </tr>
                    <tr data-doubao-line="198" data-doubao-column="21" data-doubao-key="67">
                        <td data-doubao-line="199" data-doubao-column="25" data-doubao-key="68">index.tsx（原提供文件）</td>
                        <td data-doubao-line="200" data-doubao-column="25" data-doubao-key="69">src/main.tsx</td>
                        <td data-doubao-line="201" data-doubao-column="25" data-doubao-key="70">替换 Vite 默认入口文件</td>
                    </tr>
                    <tr data-doubao-line="203" data-doubao-column="21" data-doubao-key="71">
                        <td data-doubao-line="204" data-doubao-column="25" data-doubao-key="72">Header.tsx、UploadArea.tsx、ResultsView.tsx</td>
                        <td data-doubao-line="205" data-doubao-column="25" data-doubao-key="73">src/components/</td>
                        <td data-doubao-line="206" data-doubao-column="25" data-doubao-key="74">先创建 `components` 文件夹，再放入文件</td>
                    </tr>
                    <tr data-doubao-line="208" data-doubao-column="21" data-doubao-key="75">
                        <td data-doubao-line="209" data-doubao-column="25" data-doubao-key="76">api.ts、fileUtils.ts</td>
                        <td data-doubao-line="210" data-doubao-column="25" data-doubao-key="77">src/services/</td>
                        <td data-doubao-line="211" data-doubao-column="25" data-doubao-key="78">先创建 `services` 文件夹，再放入文件</td>
                    </tr>
                    <tr data-doubao-line="213" data-doubao-column="21" data-doubao-key="79">
                        <td data-doubao-line="214" data-doubao-column="25" data-doubao-key="80">types.ts、constants.ts</td>
                        <td data-doubao-line="215" data-doubao-column="25" data-doubao-key="81">src/</td>
                        <td data-doubao-line="216" data-doubao-column="25" data-doubao-key="82">直接在 src 目录下创建并放入</td>
                    </tr>
                </tbody>
            </table>

            ### 第六步：配置 API Key（关键步骤）

            <p data-doubao-line="222" data-doubao-column="13" data-doubao-key="84">Vite 对环境变量有特定处理规则，需按以下方式配置 API Key，避免硬编码泄露：</p>
            <ol data-doubao-line="223" data-doubao-column="13" data-doubao-key="85">
                <li data-doubao-line="224" data-doubao-column="17" data-doubao-key="86"><strong data-doubao-line="224" data-doubao-column="21" data-doubao-key="87">创建环境变量文件</strong>：在项目根目录新建 `.env` 文件（文件名前需加小数点）。</li>
                <li data-doubao-line="225" data-doubao-column="17" data-doubao-key="88"><strong data-doubao-line="225" data-doubao-column="21" data-doubao-key="89">写入 API Key</strong>：在 `.env` 中添加以下内容（替换为你的实际 API Key）：
                    <pre data-doubao-line="226" data-doubao-column="21" data-doubao-key="90"><code data-doubao-line="226" data-doubao-column="26" data-doubao-key="91">VITE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxx  # 示例格式，需替换为真实 Key</code></pre>
                </li>
                <li data-doubao-line="228" data-doubao-column="17" data-doubao-key="92"><strong data-doubao-line="228" data-doubao-column="21" data-doubao-key="93">修改 API 调用代码</strong>：打开 `src/services/api.ts`，将原代码中的 `process.env.API_KEY` 替换为 `import.meta.env.VITE_API_KEY`，修改后代码如下：
                    <pre data-doubao-line="229" data-doubao-column="21" data-doubao-key="94"><code data-doubao-line="229" data-doubao-column="26" data-doubao-key="95">// 修改后代码
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });</code></pre>
                </li>
            

            ### 第七步：本地运行测试

            <p data-doubao-line="235" data-doubao-column="13" data-doubao-key="97">在终端执行以下命令，启动本地开发服务器：</p>
            <pre data-doubao-line="236" data-doubao-column="13" data-doubao-key="98"><code data-doubao-line="236" data-doubao-column="18" data-doubao-key="99">npm run dev</code></pre>
            <p data-doubao-line="237" data-doubao-column="13" data-doubao-key="100">启动成功后，浏览器会自动打开 `http://localhost:5173`，此时可上传视频测试功能是否正常（若能正常加载页面并分析视频，说明本地部署成功）。</p>

            ## 3. 上线部署（发布到公网）

            <p data-doubao-line="240" data-doubao-column="13" data-doubao-key="102">项目为<strong data-doubao-line="240" data-doubao-column="19" data-doubao-key="103">纯静态网站</strong>（无后端服务器依赖，所有逻辑在浏览器端运行），可免费托管到以下平台：</p>

            ### 方案 1：Vercel（推荐，部署流程简洁）

            <ol data-doubao-line="243" data-doubao-column="13" data-doubao-key="105">
                <li data-doubao-line="244" data-doubao-column="17" data-doubao-key="106"><strong data-doubao-line="244" data-doubao-column="21" data-doubao-key="107">代码推送到 GitHub</strong>：将本地 `clip-name-ai` 项目代码提交并推送到个人 GitHub 仓库（需提前创建仓库，确保代码已 commit）。</li>
                <li data-doubao-line="245" data-doubao-column="17" data-doubao-key="108"><strong data-doubao-line="245" data-doubao-column="21" data-doubao-key="109">导入 Vercel 项目</strong>：
                    <ul data-doubao-line="246" data-doubao-column="21" data-doubao-key="110">
                        <li data-doubao-line="247" data-doubao-column="25" data-doubao-key="111">访问 <a href="https://vercel.com/" target="_blank" data-doubao-line="247" data-doubao-column="32" data-doubao-key="112">Vercel 官网</a>，用 GitHub 账号登录。</li>
                        <li data-doubao-line="248" data-doubao-column="25" data-doubao-key="113">点击 <strong data-doubao-line="248" data-doubao-column="32" data-doubao-key="114">New Project</strong>，在 GitHub 仓库列表中选择需部署的 `clip-name-ai` 仓库，点击 <strong data-doubao-line="248" data-doubao-column="103" data-doubao-key="115">Import</strong>。</li>
                    

                </li>
                <li data-doubao-line="251" data-doubao-column="17" data-doubao-key="116"><strong data-doubao-line="251" data-doubao-column="21" data-doubao-key="117">配置环境变量</strong>：
                    <ul data-doubao-line="252" data-doubao-column="21" data-doubao-key="118">
                        <li data-doubao-line="253" data-doubao-column="25" data-doubao-key="119">在部署页面找到 <strong data-doubao-line="253" data-doubao-column="37" data-doubao-key="120">Environment Variables</strong> 区域，点击 <strong data-doubao-line="253" data-doubao-column="82" data-doubao-key="121">Add</strong>。</li>
                        <li data-doubao-line="254" data-doubao-column="25" data-doubao-key="122">变量名输入 `VITE_API_KEY`，变量值粘贴你的 API Key，点击 <strong data-doubao-line="254" data-doubao-column="69" data-doubao-key="123">Add</strong>。</li>
                    

                </li>
                <li data-doubao-line="257" data-doubao-column="17" data-doubao-key="124"><strong data-doubao-line="257" data-doubao-column="21" data-doubao-key="125">启动部署</strong>：点击 <strong data-doubao-line="257" data-doubao-column="46" data-doubao-key="126">Deploy</strong>，Vercel 会自动完成构建与部署，部署成功后会生成公网访问链接（如 `https://clip-name-ai.vercel.app`）。</li>
            

            ### 方案 2：Netlify（流程与 Vercel 类似）

            <ol data-doubao-line="261" data-doubao-column="13" data-doubao-key="128">
                <li data-doubao-line="262" data-doubao-column="17" data-doubao-key="129">将代码推送到 GitHub 仓库。</li>
                <li data-doubao-line="263" data-doubao-column="17" data-doubao-key="130">访问 <a href="https://www.netlify.com/" target="_blank" data-doubao-line="263" data-doubao-column="24" data-doubao-key="131">Netlify 官网</a>，用 GitHub 账号登录。</li>
                <li data-doubao-line="264" data-doubao-column="17" data-doubao-key="132">点击 <strong data-doubao-line="264" data-doubao-column="24" data-doubao-key="133">Add new site</strong> → <strong data-doubao-line="264" data-doubao-column="56" data-doubao-key="134">Import an existing project</strong>，选择目标 GitHub 仓库。</li>
                <li data-doubao-line="265" data-doubao-column="17" data-doubao-key="135"><strong data-doubao-line="265" data-doubao-column="21" data-doubao-key="136">配置环境变量</strong>：在 <strong data-doubao-line="265" data-doubao-column="47" data-doubao-key="137">Build settings</strong> 下方找到 <strong data-doubao-line="265" data-doubao-column="84" data-doubao-key="138">Environment variables</strong>，添加 `VITE_API_KEY` 及对应值（无需额外配置构建命令，Netlify 会自动识别 Vite 项目）。</li>
                <li data-doubao-line="266" data-doubao-column="17" data-doubao-key="139">点击 <strong data-doubao-line="266" data-doubao-column="24" data-doubao-key="140">Deploy site</strong>，等待部署完成，获取公网访问链接。</li>
            

            ## 4. 安全性提示

            <p data-doubao-line="270" data-doubao-column="13" data-doubao-key="142">当前默认架构为 <strong data-doubao-line="270" data-doubao-column="24" data-doubao-key="143">客户端直接调用 API</strong>，存在 API Key 暴露风险（浏览器开发者工具的“网络”面板可查看 Key），需根据使用场景优化：</p>
            <ul data-doubao-line="271" data-doubao-column="13" data-doubao-key="144">
                <li data-doubao-line="272" data-doubao-column="17" data-doubao-key="145"><strong data-doubao-line="272" data-doubao-column="21" data-doubao-key="146">个人使用/内部工具</strong>：可直接使用，但需在 Google AI Studio 控制台设置 <strong data-doubao-line="272" data-doubao-column="81" data-doubao-key="147">API Key 限制</strong>（如“Referrer 限制”，仅允许你的公网域名调用 API），防止 Key 被他人滥用。</li>
                <li data-doubao-line="273" data-doubao-column="17" data-doubao-key="148"><strong data-doubao-line="273" data-doubao-column="21" data-doubao-key="149">面向公众的商业产品</strong>：必须搭建后端服务器（如 Node.js/Python 服务器），将 API Key 存储在服务器端；前端仅请求自有服务器，由服务器转发请求到 Google Gemini API，彻底避免 Key 暴露。</li>
            

            ## 5. 核心总结

            <table data-doubao-line="277" data-doubao-column="13" data-doubao-key="151">
                <thead data-doubao-line="278" data-doubao-column="17" data-doubao-key="152">
                    <tr data-doubao-line="279" data-doubao-column="21" data-doubao-key="153">
                        <th data-doubao-line="280" data-doubao-column="25" data-doubao-key="154">问题</th>
                        <th data-doubao-line="281" data-doubao-column="25" data-doubao-key="155">答案</th>
                    </tr>
                </thead>
                <tbody data-doubao-line="284" data-doubao-column="17" data-doubao-key="156">
                    <tr data-doubao-line="285" data-doubao-column="21" data-doubao-key="157">
                        <td data-doubao-line="286" data-doubao-column="25" data-doubao-key="158">是否需要 API Key？</td>
                        <td data-doubao-line="287" data-doubao-column="25" data-doubao-key="159">是，需前往 <a href="https://aistudio.google.com/" target="_blank" data-doubao-line="287" data-doubao-column="35" data-doubao-key="160">Google AI Studio</a> 申请。</td>
                    </tr>
                    <tr data-doubao-line="289" data-doubao-column="21" data-doubao-key="161">
                        <td data-doubao-line="290" data-doubao-column="25" data-doubao-key="162">本地运行核心步骤？</td>
                        <td data-doubao-line="291" data-doubao-column="25" data-doubao-key="163">Vite 初始化项目 → 安装依赖 → 配置 Tailwind + API Key → `npm run dev`</td>
                    </tr>
                    <tr data-doubao-line="293" data-doubao-column="21" data-doubao-key="164">
                        <td data-doubao-line="294" data-doubao-column="25" data-doubao-key="165">公网部署方式？</td>
                        <td data-doubao-line="295" data-doubao-column="25" data-doubao-key="166">代码推 GitHub → Vercel/Netlify 导入仓库 → 配置环境变量 → 部署</td>
                    </tr>
                    <tr data-doubao-line="297" data-doubao-column="21" data-doubao-key="167">
                        <td data-doubao-line="298" data-doubao-column="25" data-doubao-key="168">安全风险点？</td>
                        <td data-doubao-line="299" data-doubao-column="25" data-doubao-key="169">客户端调用 API 会暴露 Key，商业场景需用后端转发</td>
                    </tr>
                </tbody>
            </table>
