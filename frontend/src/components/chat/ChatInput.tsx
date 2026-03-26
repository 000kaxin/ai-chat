import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '../../store/useChatStore'
import { streamChat } from '../../services/api'
import type { Message } from '../../types'

interface ChatInputProps {
  disabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ disabled = false }) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const {
    addMessage,
    updateLastMessage,
    setIsGenerating,
    isGenerating,
    config,
    getCurrentConversation,
    setError,
  } = useChatStore()

  // 自动调整文本框高度
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = async () => {
    if (!input.trim() || isGenerating) return

    const conversation = getCurrentConversation()
    if (!conversation) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    addMessage(userMessage)
    setInput('')
    setIsGenerating(true)
    setError(null)

    // 添加空的助手消息
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    addMessage(assistantMessage)

    let fullResponse = ''

    try {
      await streamChat(
        {
          model: config.model,
          messages: [...conversation.messages, userMessage],
          temperature: config.temperature,
          max_tokens: config.max_tokens,
          system_prompt: config.system_prompt,
          stream: true,
        },
        (chunk) => {
          fullResponse += chunk
          updateLastMessage(fullResponse)
        },
        () => {
          setIsGenerating(false)
        },
        (error) => {
          setError(error.message)
          updateLastMessage(`❌ 请求失败: ${error.message}`)
          setIsGenerating(false)
        }
      )
    } catch (error) {
      setError((error as Error).message)
      updateLastMessage(`❌ 请求失败: ${(error as Error).message}`)
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto flex gap-4 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            disabled={disabled || isGenerating}
            className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none pr-12 min-h-[56px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || isGenerating || !input.trim()}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
