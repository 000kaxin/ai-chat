# AI Chat Web 应用

一个支持多种国内大模型 API 的现代化 Web 对话应用，采用前后端分离架构。

## ✨ 功能特性

- 🎯 **多模型支持**：集成文心一言（百度）、通义千问（阿里）、Claude（Anthropic）、GPT（OpenAI）
- 🚀 **流式响应**：实时打字机效果，无需等待完整响应
- 💬 **多轮对话**：自动维护上下文，支持多会话管理
- ⚙️ **可配置参数**：自定义温度、最大token数、系统提示词
- 🎨 **现代化 UI**：响应式设计，支持暗色/亮色主题
- 📝 **Markdown 渲染**：完美支持代码高亮、表格、列表、公式等
- 💾 **历史持久化**：对话历史自动保存到本地存储
- 🔒 **本地部署**：数据完全本地化，隐私安全

## 🛠️ 技术栈

### 后端
- **FastAPI**: 高性能异步 Python Web 框架
- **Pydantic**: 数据验证和序列化
- **SQLAlchemy**: ORM 框架（可选）
- **各大模型官方 SDK**: 百度千帆、阿里百炼、Anthropic、OpenAI

### 前端
- **React 18**: 现代化前端框架
- **TypeScript**: 类型安全
- **Vite**: 极速构建工具
- **Tailwind CSS**: 原子化 CSS 框架
- **Zustand**: 轻量级状态管理
- **React Markdown**: Markdown 渲染
- **Lucide React**: 图标库

## 🚀 快速开始

### 环境要求
- Python 3.10+
- Node.js 18+

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd ai-chat
```

### 2. 后端配置与启动
```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置 API Key
cp .env.example .env
# 编辑 .env 文件，填入对应的 API Key

# 启动后端服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端服务启动后，访问 http://localhost:8000/docs 可以查看 API 文档。

### 3. 前端配置与启动
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置 API 地址（默认 http://localhost:8000/api 即可）

# 启动前端开发服务
npm run dev
```

前端服务启动后，访问 http://localhost:5173 即可使用应用。

## 🔧 API Key 申请

### 百度文心一言
1. 访问 [百度智能云控制台](https://console.bce.baidu.com/qianfan/)
2. 创建应用，获取 API Key 和 Secret Key
3. 填入 `.env` 文件的 `BAIDU_API_KEY` 和 `BAIDU_SECRET_KEY`

### 阿里通义千问
1. 访问 [阿里云百炼控制台](https://dashscope.console.aliyun.com/)
2. 创建 API Key
3. 填入 `.env` 文件的 `DASHSCOPE_API_KEY`

### Anthropic Claude
1. 访问 [Anthropic 控制台](https://console.anthropic.com/)
2. 创建 API Key
3. 填入 `.env` 文件的 `ANTHROPIC_API_KEY`

### OpenAI GPT
1. 访问 [OpenAI 平台](https://platform.openai.com/)
2. 创建 API Key
3. 填入 `.env` 文件的 `OPENAI_API_KEY`
4. 如果使用代理，可以配置 `OPENAI_BASE_URL`

## 📖 使用说明

### 基础对话
1. 在输入框中输入你想要问的问题
2. 按 Enter 发送，Shift + Enter 换行
3. 等待 AI 响应，支持实时流式输出

### 模型切换
1. 点击右上角设置按钮
2. 在模型选择下拉框中选择你想要使用的模型
3. 只有配置了对应 API Key 的模型才会显示为可用状态

### 参数配置
- **温度**：控制回答的随机性，数值越高越有创意，越低越确定性
- **最大生成长度**：控制单次回答的最大 token 数量
- **系统提示词**：自定义 AI 助手的角色和行为规则

### 会话管理
- 点击左侧「新建对话」按钮创建新的会话
- 点击会话列表中的会话可以切换对话
- 鼠标悬停在会话上可以删除对话

## 📁 项目结构

```
ai-chat/
├── backend/                 # 后端项目
│   ├── app/
│   │   ├── api/             # API 路由
│   │   │   └── chat.py      # 聊天相关接口
│   │   ├── core/            # 核心配置
│   │   │   └── config.py    # 配置管理
│   │   ├── providers/       # 大模型提供商实现
│   │   │   ├── base.py      # 抽象基类
│   │   │   ├── ernie.py     # 百度文心一言
│   │   │   ├── qwen.py      # 阿里通义千问
│   │   │   ├── anthropic.py # Claude
│   │   │   └── openai.py    # GPT
│   │   ├── schemas/         # Pydantic 模型定义
│   │   │   └── chat.py      # 聊天相关数据结构
│   │   └── services/        # 业务逻辑
│   │       └── chat_service.py # 聊天服务
│   ├── .env.example         # 配置模板
│   ├── requirements.txt     # Python 依赖
│   └── main.py              # 应用入口
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/      # 组件
│   │   │   ├── chat/        # 聊天相关组件
│   │   │   ├── layout/      # 布局组件
│   │   │   ├── settings/    # 设置组件
│   │   │   └── common/      # 公共组件
│   │   ├── services/        # API 服务
│   │   │   └── api.ts       # API 封装
│   │   ├── store/           # 状态管理
│   │   │   └── useChatStore.ts # 聊天状态
│   │   ├── types/           # TypeScript 类型定义
│   │   │   └── index.ts
│   │   ├── App.tsx          # 应用主组件
│   │   └── main.tsx         # 应用入口
│   ├── .env.example         # 环境变量模板
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔌 API 接口

### 获取模型列表
```http
GET /api/chat/models
```
返回所有支持的模型及其可用状态。

### 流式聊天
```http
POST /api/chat/stream
Content-Type: application/json

{
  "model": "ernie-4.0",
  "messages": [{"role": "user", "content": "你好"}],
  "temperature": 0.7,
  "max_tokens": 4096,
  "stream": true,
  "system_prompt": "你是一个友好的助手"
}
```
返回 SSE 事件流，每个事件是一段文本内容。

## 🚀 部署

### 生产环境部署

#### 后端部署
```bash
# 安装生产依赖
pip install -r requirements.txt

# 使用 uvicorn 运行（或 gunicorn）
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### 前端部署
```bash
# 构建生产版本
npm run build

# 将 dist 目录部署到 Nginx、Vercel、Netlify 等
```

#### Docker 部署
可以自行编写 Dockerfile 进行容器化部署。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
