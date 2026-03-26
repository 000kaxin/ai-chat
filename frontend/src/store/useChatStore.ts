import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, ChatConfig, Conversation } from '../types'

interface ChatState {
  // 会话列表
  conversations: Conversation[]
  currentConversationId: string | null

  // 当前会话状态
  isGenerating: boolean
  error: string | null

  // 配置
  config: ChatConfig

  // 方法
  createConversation: (title?: string) => void
  switchConversation: (id: string) => void
  deleteConversation: (id: string) => void
  updateConversationTitle: (id: string, title: string) => void

  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  clearMessages: () => void

  setIsGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
  updateConfig: (config: Partial<ChatConfig>) => void

  getCurrentConversation: () => Conversation | null
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

const defaultConfig: ChatConfig = {
  model: 'ernie-4.0',
  temperature: 0.7,
  max_tokens: 4096,
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isGenerating: false,
      error: null,
      config: defaultConfig,

      createConversation: (title = '新对话') => {
        const newConversation: Conversation = {
          id: generateId(),
          title,
          messages: [],
          config: { ...get().config },
          created_at: Date.now(),
          updated_at: Date.now(),
        }

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }))
      },

      switchConversation: (id: string) => {
        set({ currentConversationId: id })
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId:
            state.currentConversationId === id
              ? state.conversations.length > 1
                ? state.conversations.find((conv) => conv.id !== id)?.id || null
                : null
              : state.currentConversationId,
        }))
      },

      updateConversationTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title, updated_at: Date.now() } : conv
          ),
        }))
      },

      addMessage: (message: Message) => {
        const { currentConversationId, conversations } = get()
        if (!currentConversationId) return

        set({
          conversations: conversations.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updated_at: Date.now(),
                }
              : conv
          ),
        })
      },

      updateLastMessage: (content: string) => {
        const { currentConversationId, conversations } = get()
        if (!currentConversationId) return

        set({
          conversations: conversations.map((conv) => {
            if (conv.id === currentConversationId && conv.messages.length > 0) {
              const lastMessage = conv.messages[conv.messages.length - 1]
              return {
                ...conv,
                messages: [
                  ...conv.messages.slice(0, -1),
                  { ...lastMessage, content },
                ],
                updated_at: Date.now(),
              }
            }
            return conv
          }),
        })
      },

      clearMessages: () => {
        const { currentConversationId, conversations } = get()
        if (!currentConversationId) return

        set({
          conversations: conversations.map((conv) =>
            conv.id === currentConversationId
              ? { ...conv, messages: [], updated_at: Date.now() }
              : conv
          ),
        })
      },

      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),

      updateConfig: (newConfig) => {
        set((state) => ({
          config: { ...state.config, ...newConfig },
        }))
      },

      getCurrentConversation: () => {
        const { currentConversationId, conversations } = get()
        return conversations.find((conv) => conv.id === currentConversationId) || null
      },
    }),
    {
      name: 'chat-storage',
    }
  )
)

// 初始化时创建一个默认会话
const state = useChatStore.getState()
if (state.conversations.length === 0) {
  state.createConversation()
}
