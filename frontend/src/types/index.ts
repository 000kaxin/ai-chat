export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

export interface ModelInfo {
  id: string
  name: string
  provider: string
  status: 'available' | 'unavailable'
}

export interface ChatConfig {
  model: string
  temperature: number
  max_tokens: number
  system_prompt?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  config: ChatConfig
  created_at: number
  updated_at: number
}

export interface ChatRequest {
  model: string
  messages: Message[]
  temperature: number
  max_tokens: number
  stream?: boolean
  system_prompt?: string
}
