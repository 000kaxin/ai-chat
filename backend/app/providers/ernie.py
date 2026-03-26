from typing import List, Dict, Any, AsyncGenerator
import qianfan
from .base import BaseProvider
from app.core.config import settings

class ErnieProvider(BaseProvider):
    """百度文心一言模型提供商"""

    def __init__(self, model: str, config: Dict[str, Any]):
        super().__init__(model, config)
        if not settings.BAIDU_API_KEY or not settings.BAIDU_SECRET_KEY:
            raise ValueError("Baidu API key and secret key are required")

        self.client = qianfan.ChatCompletion(
            ak=settings.BAIDU_API_KEY,
            sk=settings.BAIDU_SECRET_KEY
        )

        # 模型映射
        self.model_map = {
            "ernie-4.0": "ernie-4.0-8k",
            "ernie-3.5": "ernie-3.5-8k",
            "ernie-speed": "ernie-speed-8k",
        }
        self.qianfan_model = self.model_map.get(model, model)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        stream: bool = True,
    ) -> AsyncGenerator[str, None]:
        # 文心一言的 system prompt 需要放在 messages 的第一个
        processed_messages = []
        system_prompt = None

        for msg in messages:
            if msg["role"] == "system":
                system_prompt = msg["content"]
            else:
                processed_messages.append(msg)

        if system_prompt:
            processed_messages.insert(0, {"role": "user", "content": system_prompt})
            processed_messages.insert(1, {"role": "assistant", "content": "好的，我会遵守这些规则。"})

        if stream:
            response = await self.client.ado(
                model=self.qianfan_model,
                messages=processed_messages,
                stream=True,
                temperature=self.temperature,
                max_output_tokens=self.max_tokens,
            )
            async for chunk in response:
                if chunk.body.get("result"):
                    yield chunk.body["result"]
        else:
            response = await self.client.ado(
                model=self.qianfan_model,
                messages=processed_messages,
                stream=False,
                temperature=self.temperature,
                max_output_tokens=self.max_tokens,
            )
            yield response.body["result"]
