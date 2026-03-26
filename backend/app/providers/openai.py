from typing import List, Dict, Any, AsyncGenerator
from openai import AsyncOpenAI
from .base import BaseProvider
from app.core.config import settings

class OpenAIProvider(BaseProvider):
    """OpenAI GPT 模型提供商"""

    def __init__(self, model: str, config: Dict[str, Any]):
        super().__init__(model, config)
        if not settings.OPENAI_API_KEY:
            raise ValueError("OpenAI API key is required")
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL
        )

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        stream: bool = True,
    ) -> AsyncGenerator[str, None]:
        if stream:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                stream=True,
            )
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        else:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
            )
            yield response.choices[0].message.content
