import React from 'react'
import { User, Bot } from 'lucide-react'
import MarkdownRender from '../common/MarkdownRender'
import type { Message } from '../../types'

interface MessageBubbleProps {
  message: Message
  isLast?: boolean
  isGenerating?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast, isGenerating }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium mb-1">
          {isUser ? '你' : 'AI 助手'}
        </div>
        <div className="text-gray-900 dark:text-gray-100">
          {isGenerating && isLast && !message.content ? (
            <div className="flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
            </div>
          ) : (
            <MarkdownRender content={message.content} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
