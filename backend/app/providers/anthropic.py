from typing import List, Dict, Any, AsyncGenerator
from anthropic import AsyncAnthropic
from .base import BaseProvider
from app.core.config import settings

class AnthropicProvider(BaseProvider):
    """Anthropic Claude 模型提供商"""

    def __init__(self, model: str, config: Dict[str, Any]):
        super().__init__(model, config)
        if not settings.ANTHROPIC_API_KEY:
            raise ValueError("Anthropic API key is required")
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        stream: bool = True,
    ) -> AsyncGenerator[str, None]:
        # Claude 的 system prompt 需要单独传递
        system_prompt = None
        filtered_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_prompt = msg["content"]
            else:
                filtered_messages.append(msg)

        if stream:
            async with self.client.messages.stream(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                messages=filtered_messages,
            ) as response:
                async for text in response.text_stream:
                    yield text
        else:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt,
                messages=filtered_messages,
            )
            yield response.content[0].text
