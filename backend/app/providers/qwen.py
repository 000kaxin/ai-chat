from typing import List, Dict, Any, AsyncGenerator
import dashscope
from http import HTTPStatus
from .base import BaseProvider
from app.core.config import settings

class QwenProvider(BaseProvider):
    """阿里通义千问模型提供商"""

    def __init__(self, model: str, config: Dict[str, Any]):
        super().__init__(model, config)
        if not settings.DASHSCOPE_API_KEY:
            raise ValueError("DashScope API key is required")
        dashscope.api_key = settings.DASHSCOPE_API_KEY

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        stream: bool = True,
    ) -> AsyncGenerator[str, None]:
        if stream:
            responses = dashscope.Generation.call(
                model=self.model,
                messages=messages,
                stream=True,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                result_format='message',
            )
            for response in responses:
                if response.status_code == HTTPStatus.OK:
                    if response.output.choices and response.output.choices[0].message.content:
                        yield response.output.choices[0].message.content
                else:
                    raise Exception(f"Qwen API error: {response.message}")
        else:
            response = dashscope.Generation.call(
                model=self.model,
                messages=messages,
                stream=False,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                result_format='message',
            )
            if response.status_code == HTTPStatus.OK:
                yield response.output.choices[0].message.content
            else:
                raise Exception(f"Qwen API error: {response.message}")
