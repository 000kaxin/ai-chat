import { useState } from 'react'
import { Menu, Settings, X } from 'lucide-react'
import Sidebar from './components/layout/Sidebar'
import ChatContainer from './components/chat/ChatContainer'
import ChatInput from './components/chat/ChatInput'
import ModelSelector from './components/settings/ModelSelector'
import ParamsConfig from './components/settings/ParamsConfig'
import { useChatStore } from './store/useChatStore'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isGenerating = useChatStore((state) => state.isGenerating)

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 主内容 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-16 border-b dark:border-gray-700 bg-white dark:bg-gray-900 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold">AI Chat</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-lg transition-colors ${
                settingsOpen
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* 对话区域 */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatContainer />
            <ChatInput disabled={isGenerating} />
          </div>

          {/* 右侧设置面板 */}
          {settingsOpen && (
            <div className="w-80 border-l dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
              <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                <h2 className="font-bold">设置</h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">模型选择</h3>
                  <ModelSelector />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">参数配置</h3>
                  <ParamsConfig />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
