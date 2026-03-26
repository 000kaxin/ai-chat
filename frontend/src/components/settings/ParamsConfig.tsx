import React from 'react'
import { useChatStore } from '../../store/useChatStore'

const ParamsConfig: React.FC = () => {
  const { config, updateConfig } = useChatStore()

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">温度 (Temperature)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="w-12 text-center text-sm font-mono">
            {config.temperature.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          数值越高，回答越有创意；数值越低，回答越确定性
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">最大生成长度</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="512"
            max="32768"
            step="512"
            value={config.max_tokens}
            onChange={(e) => updateConfig({ max_tokens: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="w-16 text-center text-sm font-mono">
            {config.max_tokens}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          模型单次回答的最大token数，约等于汉字数量的0.7倍
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">系统提示词</label>
        <textarea
          value={config.system_prompt || ''}
          onChange={(e) => updateConfig({ system_prompt: e.target.value })}
          placeholder="自定义AI助手的行为规则，例如：你是一个专业的编程助手..."
          className="w-full px-3 py-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          设定AI助手的角色和行为规范，会在所有对话中生效
        </p>
      </div>
    </div>
  )
}

export default ParamsConfig
