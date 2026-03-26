import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useChatStore } from '../../store/useChatStore'
import { getModels } from '../../services/api'
import type { ModelInfo } from '../../types'

const ModelSelector: React.FC = () => {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { config, updateConfig } = useChatStore()

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getModels()
        setModels(data)
      } catch (error) {
        console.error('获取模型列表失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchModels()
  }, [])

  const currentModel = models.find((m) => m.id === config.model)

  const handleSelectModel = (modelId: string) => {
    updateConfig({ model: modelId })
    setIsOpen(false)
  }

  const getProviderBadge = (provider: string) => {
    const colors: Record<string, string> = {
      baidu: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      alibaba: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      anthropic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      openai: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    }
    return colors[provider] || 'bg-gray-100 text-gray-800'
  }

  const providerNames: Record<string, string> = {
    baidu: '百度',
    alibaba: '阿里',
    anthropic: 'Anthropic',
    openai: 'OpenAI',
  }

  if (loading) {
    return (
      <div className="p-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 animate-pulse">
        加载中...
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{currentModel?.name || '选择模型'}</span>
          {currentModel && (
            <span
              className={`text-xs px-2 py-0.5 rounded ${getProviderBadge(
                currentModel.provider
              )}`}
            >
              {providerNames[currentModel.provider]}
            </span>
          )}
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => model.status === 'available' && handleSelectModel(model.id)}
                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                  model.id === config.model
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : model.status === 'available'
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{model.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getProviderBadge(
                      model.provider
                    )}`}
                  >
                    {providerNames[model.provider]}
                  </span>
                </div>
                {model.status === 'unavailable' && (
                  <span className="text-xs text-gray-500">未配置</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ModelSelector
