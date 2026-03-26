import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import { useChatStore } from '../../store/useChatStore'

const ChatContainer: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentConversation = useChatStore((state) => state.getCurrentConversation())
  const isGenerating = useChatStore((state) => state.isGenerating)
  const error = useChatStore((state) => state.error)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages, isGenerating])

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>暂无对话，点击左侧新建对话开始聊天</p>
      </div>
    )
  }

  if (currentConversation.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            AI Chat Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            支持文心一言、通义千问、Claude、GPT等多种大模型，开始你的对话吧！
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium mb-2">💡 你可以问我...</p>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 解释编程概念</li>
                <li>• 帮你写代码</li>
                <li>• 翻译各种语言</li>
                <li>• 解决问题故障</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium mb-2">✨ 支持功能</p>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 多模型切换</li>
                <li>• 流式响应</li>
                <li>• 上下文管理</li>
                <li>• Markdown渲染</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {currentConversation.messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isLast={index === currentConversation.messages.length - 1}
          isGenerating={isGenerating}
        />
      ))}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-t dark:border-red-800">
          {error}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatContainer
