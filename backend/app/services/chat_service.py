from typing import List, Dict, Any, AsyncGenerator, Optional
from app.core.config import settings
from app.providers import (
    BaseProvider,
    ErnieProvider,
    QwenProvider,
    AnthropicProvider,
    OpenAIProvider
)
from app.schemas.chat import Message

class ChatService:
    """聊天服务"""

    @staticmethod
    def get_provider(model: str, config: Dict[str, Any]) -> BaseProvider:
        """获取模型对应的提供商实例"""
        provider_name = settings.get_model_provider(model)
        if not provider_name:
            raise ValueError(f"Unsupported model: {model}")

        if not settings.is_model_available(model):
            raise ValueError(f"Model {model} is not available, please check API key configuration")

        provider_config = {
            "max_tokens": config.get("max_tokens", settings.MAX_TOKENS),
            "temperature": config.get("temperature", settings.TEMPERATURE),
            **config,
        }

        if provider_name == "baidu":
            return ErnieProvider(model, provider_config)
        elif provider_name == "alibaba":
            return QwenProvider(model, provider_config)
        elif provider_name == "anthropic":
            return AnthropicProvider(model, provider_config)
        elif provider_name == "openai":
            return OpenAIProvider(model, provider_config)
        else:
            raise ValueError(f"Unsupported provider: {provider_name}")

    @staticmethod
    async def chat_completion(
        model: str,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 4096,
        stream: bool = True,
        system_prompt: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        聊天补全
        :param model: 模型ID
        :param messages: 对话历史
        :param temperature: 温度
        :param max_tokens: 最大token
        :param stream: 是否流式
        :param system_prompt: 系统提示词
        :return: 响应内容生成器
        """
        # 处理系统提示词
        processed_messages = [msg.model_dump() for msg in messages]
        if system_prompt:
            processed_messages.insert(0, {"role": "system", "content": system_prompt})

        # 获取提供商
        provider = ChatService.get_provider(model, {
            "temperature": temperature,
            "max_tokens": max_tokens,
        })

        # 调用接口
        async for chunk in provider.chat_completion(processed_messages, stream=stream):
            yield chunk

    @staticmethod
    def get_available_models() -> List[Dict[str, Any]]:
        """获取可用模型列表"""
        models = []
        for model in settings.SUPPORTED_MODELS:
            models.append({
                **model,
                "status": "available" if settings.is_model_available(model["id"]) else "unavailable"
            })
        return models
